const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const db = 'mongodb+srv://Gaukhar1188:Somepsw123$@cluster0.sdtomsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const Task = require('./models/Task');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render('index', { title: 'Tasks List', tasks });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Error fetching tasks');
    }
});


app.post('/add_task', async (req, res) => {
    const { title } = req.body;
    const task = new Task({ title });

    try {
        await task.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error saving task:', err);
        res.status(500).send('Error saving task');
    }
});


app.post('/update_task/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        task.isDone = !task.isDone;
        await task.save();

        res.redirect('/');
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send('Error updating task');
    }
});


app.post('/delete_task/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        await Task.findByIdAndDelete(taskId);

        res.redirect('/');
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Error deleting task');
    }
});


app.get('/manage', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render('manage', { tasks });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Error fetching tasks');
    }
});


app.get('/edit/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.render('edit', { task });
    } catch (err) {
        console.error('Error fetching task:', err);
        res.status(500).send('Error fetching task');
    }
});


app.post('/edit/:id', async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            isDone: req.body.isDone === 'on'
        });
        res.redirect('/manage');
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send('Error updating task');
    }
});


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('DB connection error:', err));
