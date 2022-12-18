const express = require('express')
const app = express()
const port = 5000

const path = require('path');

const cors = require("cors")
app.use(cors());

app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

const mongoose = require('mongoose');

const database_path = "mongodb://localhost:27017/expense"

mongoose.connect(database_path, { useNewUrlParser: true })
    .then(() => { console.log('Connected with database') })
    .catch((err) => {
        console.log('Error from connection database', err);
        process.exit(1)
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.use("/expense",require("./routes/expense.routes"));



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})