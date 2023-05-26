const mariadb = require('mariadb');

const useCases = {
  'test' : 'test',
  'loginUsers' : 'selectUsers',
  'fetchLoopers' : 'selectLoopers', 
  'fetchLoops' : 'selectMemos',
  'registerAccount' : 'insertUsers',
  'addLooper' : 'insertLoopers',
  'addLoop' : 'insertMemos',
  'editAccount' : 'updateUsers',
  'editLooper' : 'updateLoopers',
  'editLoop' : 'updateMemos',
  'deleteAccount' : 'deleteUsers',
  'deleteLooper' : 'deleteLoopers',
  'deleteLoop' : 'deleteMemos'
  }
  
const paramQuery = {
  'test' : 'SELECT * FROM Users',
  'selectUsers' : 'SELECT user_id, password, register_date FROM Users WHERE user_id = ? AND password = ?',
  'selectLoopers' : 'SELECT looper_id, user_id, created_date, title, url FROM Loopers WHERE user_id = ?',
  'selectMemos' : 'SELECT id, timestamp, looper_id, memo FROM Memos WHERE looper_id = ?',
  'insertUsers' : 'INSERT INTO Users (user_id, register_date, password) VALUES (?, ?, ?)',
  'insertLoopers' : 'INSERT INTO Loopers (looper_id, user_id, created_date, title, url) VALUES (?, ?, ?, ? ,? )',
  'insertMemos' : 'INSERT INTO Memos (id, timestamp, looper_id, memo) VALUES (?, ?, ?, ?)',
  'updateUsers' : 'UPDATE Users SET (password = ?) WHERE user_id = ?',
  'updateLoopers' : 'UPDATE Loopers SET (title = ? , url =? ) WHERE looper_id = ?',
  'updateMemos' : 'UPDATE Memos SET (memo = ?) WHERE id = ?',
  'deleteUsers' : 'DELETE FROM Users WHERE user_id = ?',
  'deleteLoopers' : 'DELETE FROM Loopers WHERE looper_id = ?',
  'deleteMemos' : 'DELETE FROM Memos WHERE id = ?'
  }


async function dbQuery(type, args = []){
  const conn = await mariadb.createConnection({
    user : 'looper_admin',
    password : '20180222',
    database : 'looperProject'
  })

  let result = null
  const sqlQuery = paramQuery[type]

  try{
    result = await conn.query(sqlQuery, args);
  }
  catch(err){
    console.log(err)
    result = null
  }
  finally{
    if (conn) conn.end();
  }
  return result 
}
 
module.exports = { dbQuery, useCases, paramQuery };
