import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { engine } from 'express-handlebars';
import fs from 'fs';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const dbPromise = open({
    filename: './database.db',
    driver: sqlite3.Database
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const adminStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/img'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const adminUpload = multer({ storage: adminStorage });

const scheduleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'public/img/cdn');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const scheduleUpload = multer({ storage: scheduleStorage });

// Middleware to check if the user is logged in as admin
function isAdmin(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Admin login route
app.get('/login', (req, res) => {
    res.render('login', { title: 'Admin Login' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = await dbPromise;
    const admin = await db.get(
        'SELECT * FROM Users WHERE (user_name = ? OR user_email = ?) AND user_password = ? AND user_perms = "admin"',
        [username, username, password]
    );
    if (admin) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('login', { title: 'Admin Login', error: 'Invalid credentials' });
    }
});

// Admin page route
app.get('/admin', isAdmin, async (req, res) => {
    const db = await dbPromise;
    const services = await db.all('SELECT * FROM Services');
    res.render('admin', {
        title: 'Admin Page',
        services
    });
});

// Orders page route
app.get('/orders', isAdmin, async (req, res) => {
    const db = await dbPromise;
    const orders = await db.all('SELECT * FROM Orders');
    res.render('orders', {
        title: 'Orders Page',
        orders
    });
});

// History page route
app.get('/history', isAdmin, async (req, res) => {
    const db = await dbPromise;
    const history = await db.all('SELECT * FROM History');
    res.render('history', {
        title: 'History Page',
        history
    });
});

app.post('/addService', adminUpload.single('serviceImage'), async (req, res) => {
    const { serviceName, serviceDescription, servicePrice } = req.body;
    const serviceImg = `/img/${req.file.filename}`;

    const db = await dbPromise;
    await db.run('INSERT INTO Services (service_name, service_description, service_price, service_img) VALUES (?, ?, ?, ?)',
        [serviceName, serviceDescription, servicePrice, serviceImg]);
    console.log('Received data:', req.body);
    res.json({ message: 'Service added successfully' });
});

app.post('/editService', adminUpload.single('serviceImage'), async (req, res) => {
    const { serviceId, serviceName, serviceDescription, servicePrice } = req.body;
    let serviceImg = req.body.serviceImg;

    if (req.file) {
        serviceImg = `/img/${req.file.filename}`;
    }

    const db = await dbPromise;
    const fieldsToUpdate = [];
    const values = [];

    if (serviceName) {
        fieldsToUpdate.push('service_name = ?');
        values.push(serviceName);
    }
    if (serviceDescription) {
        fieldsToUpdate.push('service_description = ?');
        values.push(serviceDescription);
    }
    if (servicePrice) {
        fieldsToUpdate.push('service_price = ?');
        values.push(servicePrice);
    }
    if (req.file) {
        fieldsToUpdate.push('service_img = ?');
        values.push(serviceImg);
    }

    values.push(serviceId);

    const query = `UPDATE Services SET ${fieldsToUpdate.join(', ')} WHERE service_id = ?`;
    await db.run(query, values);
    console.log('Updated data:', req.body);
    res.json({ message: 'Service updated successfully' });
});

app.delete('/deleteService/:id', async (req, res) => {
    const { id } = req.params;

    const db = await dbPromise;
    await db.run('DELETE FROM Services WHERE service_id = ?', [id]);
    console.log('Deleted service with id:', id);
    res.json({ message: 'Service deleted successfully' });
});

app.post('/schedule', scheduleUpload.single('file'), async (req, res) => {
    const { serviceId, name, emailOrNumber, date, message } = req.body;
    const file = req.file;

    const db = await dbPromise;

    const service = await db.get('SELECT * FROM Services WHERE service_id = ?', [serviceId]);
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    const filePath = file ? `/img/cdn/${file.filename}` : null;
    const fileNameWithoutExtension = file.filename.split('.').slice(0, -1).join('.');
    const orderId = fileNameWithoutExtension;

    const mode = "Schedule";
    const status = "Pending" 

    await db.run('INSERT INTO Orders (order_id, order_img, order_name, order_price, customer_name, customer_contact, order_date, customer_message, order_file, order_mode, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [orderId, service.service_img, service.service_name, service.service_price, name, emailOrNumber, date, message, filePath, mode, status]);

    res.json({ message: 'Service scheduled successfully', orderId: orderId, modifiedFileName: modifiedFileName });
});

app.post('/print', scheduleUpload.single('file'), async (req, res) => {
    const { serviceId, name } = req.body;
    const file = req.file;

    const db = await dbPromise;

    const service = await db.get('SELECT * FROM Services WHERE service_id = ?', [serviceId]);
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    const filePath = file ? `/img/cdn/${file.filename}` : null;
    const modifiedFileName = file.filename.split('.').slice(0, -1).join('.');
    const orderId = modifiedFileName;

    const mode = "Print";
    const status = "Pending";
    const date = new Date().toISOString().split('T')[0];

    await db.run('INSERT INTO Orders (order_id, order_img, order_name, order_price, order_date, order_file, order_mode, order_status, customer_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [orderId, service.service_img, service.service_name, service.service_price, date, filePath, mode, status, name]
    );

    res.json({ message: 'File sent successfully', modifiedFileName: modifiedFileName });
});

app.post('/confirmPrint/:id', async (req, res) => {
    const { id } = req.params;

    const db = await dbPromise;
    const order = await db.get('SELECT * FROM Orders WHERE order_id = ?', [id]);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    await db.run('INSERT INTO History (order_id, order_name, order_date, order_price, customer_name, customer_contact, customer_message, order_file, order_img, order_mode, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [order.order_id, order.order_name, order.order_date, order.order_price, order.customer_name, order.customer_contact, order.customer_message, order.order_file, order.order_img, order.order_mode, order.order_status]);

    await db.run('DELETE FROM Orders WHERE order_id = ?', [id]);
    console.log('Moved order to history and deleted from orders:', id);
    res.json({ message: 'Order moved to history successfully' });
});

app.get('/', async (req, res) => {
    const db = await dbPromise;
    const services = await db.all('SELECT * FROM Services');
    res.render('home', {
        title: 'Home Page',
        services
    });
});

app.get('/history', isAdmin, async (req, res) => {
    const db = await dbPromise;
    const history = await db.all('SELECT * FROM History ORDER BY order_date ASC');
    res.render('history', {
        title: 'History',
        history
    });
});

app.get('/admin', isAdmin, async (req, res) => {
    const db = await dbPromise;
    const services = await db.all('SELECT * FROM Services');
    res.render('admin', {
        title: 'Admin Page',
        services
    });
});

app.get('/service/:id', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    const service = await db.get('SELECT * FROM Services WHERE service_id = ?', [id]);
    res.json(service);
});

app.get('/orders', isAdmin, async (req, res) => {
    const db = await dbPromise;
    const orders = await db.all('SELECT * FROM Orders ORDER BY order_date ASC');
    res.render('orders', {
        title: 'Orders Page',
        orders
    });
});

app.get('/order/:id', async (req, res) => {
    const { id } = req.params;
    
    const db = await dbPromise;
    const order = await db.get('SELECT * FROM Orders WHERE order_id = ?', [id]);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
});

app.get('/history/:id', async (req, res) => {
    const { id } = req.params;

    const db = await dbPromise
    const history = await db.get('SELECT * FROM History WHERE order_id = ?', [id]);
    if (!history) {
        return res.status(404).json({ messaga: 'History not found'})
    }
    res.json(history)
});

app.delete('/deleteOrder/:id', async (req, res) => {
    const { id } = req.params;

    const db = await dbPromise;
    await db.run('DELETE FROM Orders WHERE order_id = ?', [id]);
    console.log('Deleted order with id:', id);
    res.json({ message: 'Order deleted successfully' });
});

app.get('/searchOrders', async (req, res) => {
    const { q } = req.query;
    const db = await dbPromise;
    const orders = await db.all(
        `SELECT * FROM Orders
         WHERE order_id LIKE ?
         OR order_name LIKE ?
         OR order_date LIKE ?
         OR customer_contact LIKE ?
         OR customer_name LIKE ?`,
        [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    );
    res.json(orders);
});

app.get('/searchHistory', async (req, res) => {
    const { q } = req.query;
    const db = await dbPromise;
    const orders = await db.all(
        `SELECT * FROM History
         WHERE order_id LIKE ?
         OR order_name LIKE ?
         OR order_date LIKE ?
         OR customer_contact LIKE ?
         OR customer_name LIKE ?`,
        [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    );
    res.json(orders);
});

const setup = async () => {
    const db = await dbPromise;
    await db.migrate({ migrationsPath: path.join(__dirname, 'migrations') });
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

setup();