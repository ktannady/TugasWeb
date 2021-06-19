const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const db = require ('./config/database.js')
const auth = require('./middleware/auth.js')

app.use(express.urlencoded({extended: false})) 
app.use(express.json());
app.use(cors());


app.get('/', auth, (req, res) => {  
  res.send(
  `
  <html>
    <body>
      <form action='/todo' method='post'>
        <input name='description'/>
        <button>Add</button>
      </form>
    </body>
  </html>
  `
  )
})

app.get('/todo', auth, async (req, res) => {  
  try{
    let results = await loadAll();
    res.status(200).json(results);
  }
  catch(err){
    res.status(500).send(err);
  }
})

function loadAll() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM todo",
    (err, result) => {
      if(err){
        reject(err);
        console.log(err);
      }
      resolve(result);
    })
  })
}

app.post('/todo', auth, (req, res) =>{
  //console.log(req.body);
  db.query("INSERT INTO todo (description) VALUES (?)", req.body.description, (err, results) => {             
    if(err) {
      console.log(err);        
    } else {
      res.json(results);
    }
  })
})

app.delete('/todo/:id', auth, (req, res) => {
  db.query(`DELETE FROM todo where id = ${req.params.id}`, 
  (err, result) => {
    if(err){
      console.log(err);
    }
    var json = {
      message : "delete succeed"
    }
    res.json(json);
  })
})

app.post('/user', (req, res, next) => {
  db.query('SELECT COUNT(*) as jumlah_user FROM user', (err, result) => {
    if(result[0].jumlah_user > 0)
    {
      auth(req, res, next);
    }
    else
    {
      next();
    }
  })
}, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.query('INSERT INTO user(username,password) VALUES (?,?)', [username, password], (err, result) =>{
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.json({
        id: result.insertId, 
        username: username
      })
    }
  })
});

app.get('/user', auth, (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.json(result);
    }
  })
})

app.delete('/user/:id', auth, (req, res, next) =>{
  db.query('SELECT COUNT(*) as jumlah_user FROM user', (err, result) =>{
    if(result[0].jumlah_user === 1)
    {
      res.sendStatus(401);
    }
    else
    {
      next()
    }
  })
}, (req, res) => {
  db.query("DELETE FROM user where id=(?)", req.params.id, (err, result) => {
    if(err)
    {
      console.log(err);
    }
  })
  res.end();
})

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const io = require('socket.io')(server, {cors: {origin: "*"}})
io.on('connection',(socket)=> {
  socket.on('add', (data) => {
      socket.broadcast.emit('get', data)
    })
  socket.on('delete', (data) => {
      socket.broadcast.emit('get', data)
    })
})