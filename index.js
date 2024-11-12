import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { engine } from 'express-handlebars';

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
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/img'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post('/addService', upload.single('serviceImage'), async (req, res) => {
    const { serviceName, serviceDescription, servicePrice } = req.body;
    const serviceImg = `/img/${req.file.filename}`;

    const db = await dbPromise;
    await db.run('INSERT INTO Services (service_name, service_description, service_price, service_img) VALUES (?, ?, ?, ?)', [serviceName, serviceDescription, servicePrice, serviceImg]);
    console.log('Received data:', req.body);
    res.json({ message: 'Service added successfully' });
});

app.post('/editService', upload.single('serviceImage'), async (req, res) => {
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

app.get('/', async (req, res) => {
    const db = await dbPromise;
    const services = await db.all('SELECT * FROM Services');
    res.render('home', {
        services
    });
});

app.get('/admin', async (req, res) => {
    const db = await dbPromise;
    const services = await db.all('SELECT * FROM Services');
    res.render('admin', {
        services
    });
});

app.get('/orders', async (req, res) => {
    const db = await dbPromise;
    const orders = await db.all('SELECT * FROM Orders');
    res.render('orders', {
        orders
    });
});

const setup = async () => {
    const db = await dbPromise;
    await db.migrate({ migrationsPath: path.join(__dirname, 'migrations') });
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

setup();