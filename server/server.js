const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors  = require('cors')
const path = require('path')
const mariadb = require('mariadb');

const credentials = require('./secret/.credentials.development')
const {dbQuery, useCases} = require('./db.js')

const port = process.env.port || 8000
const app = express();

console.log(__dirname)
app.use(cors())
app.use(express.static(path.resolve(__dirname, '../build')))
app.use(session({
  resave : false,
  saveUninitialized : false,
  secret : credentials.key
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())

app.post('/login', async (req, res) => {
  console.log('/login')
  const {userId, userPw} = req.body
  const result = await dbQuery(useCases.loginUsers, [userId, userPw])
  console.log(result)
  if(result.length > 0){
    req.session.validUser = true 
    res.redirect('/main')
  }else res.redirect('/login')

})

app.get('/session-check', (req, res) => {
  if(req.session.validUser)
    res.status(200)
  else
    res.status(403)
})

// app.get('*',  (req, res) => {
//   console.log('HELOO!')
//   // res.sendFile( path.resolve(__dirname, "../build/index.html"))
// })


app.listen(port, () => {
  console.log('app is running on ' + port);
})
