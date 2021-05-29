const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const db = require ('./config/database.js')

app.use(express.urlencoded({extended: false})) 
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {  
  res.send(`
  <html>
    <body>
      <form action='/todo' method='post'>
        <input name='description'/>
        <button>Add</button>
      </form>
    </body>
  </html>`)
})

app.get('/todo', async (req, res) => {  
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

app.post('/todo', (req, res) =>{
  //console.log(req.body);
  db.query("INSERT INTO todo (description) VALUES (?)", req.body.description, (err, results) => {             
    if(err) {
      console.log(err);        
    } else {
      res.json(results);
    }
  })
})

app.delete('/todo/:id', (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})