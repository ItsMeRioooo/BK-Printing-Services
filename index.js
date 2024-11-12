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
    // await db.run(`
    //     CREATE TABLE IF NOT EXISTS Services (
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         service_name TEXT NOT NULL,
    //         service_description TEXT NOT NULL,
    //         service_price REAL NOT NULL,
    //         service_img TEXT
    //     )
    // `);
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

setup();