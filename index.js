import express from 'express';
import {engine} from 'express-handlebars';
import {open} from 'sqlite';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded())
const dbPromise = open({
    filename: 'data.db',
    driver: sqlite3.Database
});

app.use(express.static('public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');



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
    res.render('orders');
});

app.post('/schedule', async (req, res) => {
    const { name, description, image } = req.body;

    // Here you would write the data to your database
    // For example, using a MongoDB client:
    // db.collection('services').insertOne({ name, description, image });
    const db = await dbPromise;
    await db.run('INSERT INTO Orders (test) VALUES (?)', [name]);
    console.log('Received data:', req.body);
    res.json({ message: 'Data received successfully' });
});

const setup = async () => {
    const db = await dbPromise;
    await db.migrate();
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

setup();