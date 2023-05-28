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
  const {userId, userPw} = req.body
  const result = await dbQuery(useCases.loginUsers, [userId, userPw])
  if(result.length > 0){
    req.session.validUser = true 
    res.redirect('/main')
  }else res.redirect('/login')
})

app.delete('/logout',(req, res) => {
  console.log(req.session)
  req.session.destroy(err => {
    if(err){
      console.log(err)
      return res.status(500).send('Internal Server Error')
    }
    res.clearCookie('connect.sid')
    // return res.redirect('/login')
    return res.status(200).end()
  })
})

app.post('/register', async (req, res) => {
  const {usrNickname, usrPw, usrId, registTime} = req.body
  const result = await dbQuery(useCases.registerAccount, [usrId, usrNickname, registTime, usrPw])
  if(result){
    res.redirect('/login')
  }
  
})

app.post('/id-check' , async (req, res) => {
    const userId  = req.body.val
    const result = await dbQuery(useCases.checkUserId, userId)
    console.log('hello?')
    if(result.length)
      res.json(false)
    else
      res.json(true)
})

app.get('/session-check', (req, res) => {
  if(req.session.validUser)
    res.json(true)
  else
    res.json(false)
})

app.get('*',  (req, res) => {
  // console.log('HELOO!')
  // // res.sendFile( path.resolve(__dirname, "../build/index.html"))
})


app.listen(port, () => {
  console.log('app is running on ' + port);
})
