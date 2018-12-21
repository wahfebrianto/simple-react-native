import React from 'react';
import Expo, {SQLite} from 'expo'
import { Platform, StatusBar, StyleSheet, View, UIManager } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Colors from './constants/Colors';
import md5 from 'md5';

const db = SQLite.openDatabase('FoodNoteDB.db');

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  componentDidMount() {
    console.disableYellowBox = true;
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
        [],
        function(tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS users', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(30) UNIQUE, password VARCHAR(255), is_admin BOOLEAN, is_active BOOLEAN DEFAULT(TRUE))',
              []
            );
            txn.executeSql('DROP TABLE IF EXISTS images', []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, time DATETIME DEFAULT(datetime('now','localtime')), photo VARCHAR(255), name VARCHAR(255), description VARCHAR(255), address VARCHAR(255), price DOUBLE(7,2), user_id INTEGER, is_active BOOLEAN DEFAULT(TRUE))",
              []
            );
            txn.executeSql('DROP TABLE IF EXISTS logs', []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, description VARCHAR(255), time DATETIME DEFAULT(datetime('now','localtime')))",
              []
            );
            txn.executeSql(
              'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
              ['administrator', md5('secret'), true, true]
            );
            txn.executeSql(
              'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
              ['administrator2', md5('secret'), true, true]
            );
            txn.executeSql(
              'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
              ['johndoe', md5('helloworld'), false, true]
            );
            txn.executeSql(
              'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
              ['reynold', md5('welcome'), false, true]
            );
            txn.executeSql(
              'INSERT INTO users (username, password, is_admin, is_active) VALUES (?,?,?,?)',
              ['bumblebee', md5('yellow'), false, false]
            );

          }
        }
      );
    });
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={Colors.watermelon} />
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf'),
        'Lato-BoldItalic': require('./assets/fonts/Lato-BoldItalic.ttf'),
        'Lato-Italic': require('./assets/fonts/Lato-Italic.ttf'),
        'Lato-Light': require('./assets/fonts/Lato-Light.ttf'),
        'Lato-Medium': require('./assets/fonts/Lato-Medium.ttf'),
        'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
        'Lato-Semibold': require('./assets/fonts/Lato-Semibold.ttf'),
        'Lato-Thin': require('./assets/fonts/Lato-Thin.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
