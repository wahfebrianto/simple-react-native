import Expo, { SQLite } from 'expo';
import md5 from 'md5';

const db = SQLite.openDatabase('FoodNoteDB.db');

//Singleton Class
export default class Database {
  static myInstance = null;

  static getInstance() {
      if (Database.myInstance == null) {
          Database.myInstance = new Database();
      }
      return this.myInstance;
  }

  //Check if phone user have sqlite database structure
  hasTableUser(_callback) {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
        [],
        (tx, res) => {
          if(_callback){
            _callback(res);
          }
        }
      );
    });
  }

  createUserTable() {
    db.transaction(
      tx => {
        tx.executeSql('DROP TABLE IF EXISTS users', []);
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(30) UNIQUE, password VARCHAR(255), is_admin TINYINT, is_active TINYINT)',
          []
        );
      }
    );
  }

  createImageTable() {
    db.transaction(
      tx => {
        tx.executeSql('DROP TABLE IF EXISTS images', []);
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS images(id INTEGER PRIMARY KEY AUTOINCREMENT, photo VARCHAR(255), name VARCHAR(255), description VARCHAR(255), address VARCHAR(255), price VARCHAR(255), username VARCHAR(30), is_active TINYINT DEFAULT(1))",
          []
        );
      }
    );
  }

  createLogTable() {
    db.transaction(
      tx => {
        tx.executeSql('DROP TABLE IF EXISTS logs', []);
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS logs(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, description VARCHAR(255), time DATETIME DEFAULT(datetime('now','localtime')))",
          []
        );
      }
    );
  }

  // insert user to users table
  seedUserTable() {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
          ['administrator', md5('secret'), 1, 1]
        );
        tx.executeSql(
          'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
          ['administrator2', md5('secret'), 1, 1]
        );
        tx.executeSql(
          'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
          ['johndoe', md5('helloworld'), 0, 1]
        );
        tx.executeSql(
          'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
          ['reynold', md5('welcome'), 0, 1]
        );
        tx.executeSql(
          'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
          ['bumblebee', md5('yellow'), 0, 0]
        );
      }
    );
  }

  // doing insert to logs table
  insertIntoLog(userID, description, _callback) {
    db.transaction(
      txn => {
        txn.executeSql("INSERT INTO logs (user_id, description) VALUES (?,?)",
        [userID, description], () => {
          if(_callback){
            _callback();
          }
        });
      },
      null,
    );
  }

  // get logon user data
  getUserToken(username, password, _callback) {
    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT id, username, is_admin FROM users WHERE username=? AND password=? AND is_active=1",
        [username, md5(password)],
        function(tx, res) {
          if(_callback){
            _callback(res);
          }
        }
      );
    });
  }

  // get items shown in home page
  getHomeItem(searchText, _callback) {
    db.transaction(
      txn => {
        txn.executeSql("select id, username, name, description, price, photo, address from images where is_active=1 AND (username like ? OR name like ?) order by id desc", [searchText, searchText], (tx, res) => {
          if(_callback){
            _callback(res.rows._array);
          }
        });
      }
    );
  }

  // update data of the image and insert to log
  updateData(id, data, userID, _callback) {
    db.transaction(
      tx => {
        tx.executeSql('update images set photo = ?, name = ?, description = ?, price = ?, address = ? where id = ?', [data[0], data[1], data[2], data[3], data[4], id], () => {
          this.insertIntoLog(userID, "edit data : " + data[1] + '[' + id + ']');
          if(_callback){
            _callback();
          }
        });
      }
    );
  }

  // insert data of the image and insert to log
  insertData(data, userID, _callback) {
    db.transaction(
      tx => {
        tx.executeSql('insert into images (photo, name, description, price, address, username) values (?, ?, ?, ?, ?, ?)', [data[0], data[1], data[2], data[3], data[4], data[5]], (_, res) => {
          this.insertIntoLog(userID, "insert data : " + data[1] + '[' + res.insertId + ']');
          if(_callback){
            _callback();
          }
        });
      }
    );
  }

  // get item data based on id
  getItemData(id, _callback) {
    db.transaction(
      txn => {
        txn.executeSql("select id, name, description, price, photo, address from images where is_active=1 AND id=? order by id desc", [id], (tx, res) => {
          if(_callback){
            _callback(res);
          }
        });
      }
    );
  }

  // delete image data and insert to log
  deleteData(id, name, userID, _callback) {
    db.transaction(
      txn => {
        txn.executeSql("update images set is_active=0 where id=?", [id], () => {
          this.insertIntoLog(userID, "delete data : " + name + '[' + id + ']');
          if(_callback){
            _callback();
          }
        });
      }
    );
  }

  getAllLogData(_callback) {
    db.transaction(
      txn => {
        txn.executeSql("select logs.id as id, users.username as username, logs.description as description, logs.time as time from logs, users where users.id = logs.user_id order by logs.id desc", [], async (tx, res) => {
          if(_callback){
            _callback(res);
          }
        });
      }
    );
  }

  // get x and y data for chart axis
  getChartData(type, _callback) {
    db.transaction(
      txn => {
        txn.executeSql("select date(time) as x, count(*) as y from logs where description like ? group by x", [type], (tx, res) => {
          if(_callback){
            _callback(res);
          }
        });
      }
    );
  }

}
