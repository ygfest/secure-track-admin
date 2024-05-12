const mysql = require('mysql');
const express = require('express')
const cors = require('cors')

const port = 3000

const app = express();
const router = express.Router();

app.use(cors())

const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'securetrack_db'
        })

connection.connect();

router.get('/strack', (req, res) => {
      connection.query('SELECT * FROM cargo_details', (error, results, fields) => {
            if (error) throw error;
            res.json(results);
          });
  })

router.get('/users', (req, res) => {
      connection.query('SELECT * FROM users_tbl', (error, results, fields) => {
    if (error) throw error;
  res.json(results);
  })
})

  app.use('/', router);


app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })

