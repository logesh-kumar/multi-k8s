const express = require('express')
const keys = require('./keys')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')
const redis = require('redis')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

//Postgres 
pgClient.on('err', () => {
    console.log('Lost pg connection')
})

pgClient.on('connect', () => pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log('err creating db: ', err)));

// Redis Client Setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

//exprss route handlers

app.get('/', (req, res) => {
    res.send("hi")
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query("SELECT * FROM values")
    console.log(values.rows)
    res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, () => {
    console.log("listening on port 5000")
})


