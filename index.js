import express from 'express';
import {engine} from 'express-handlebars';
import {open} from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();


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
    res.render('admin');
});
app.get('/orders', async (req, res) => {
    res.render('orders');
});


const setup = async () => {
    const db = await dbPromise;
    await db.migrate();
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

setup();