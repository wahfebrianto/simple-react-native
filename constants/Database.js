import Expo, { SQLite } from 'expo';

module.exports = SQLite.openDatabase('FoodNoteDB.db');
