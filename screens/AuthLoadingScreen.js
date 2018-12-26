import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import md5 from 'md5';

import Database from '../constants/Database';
const db = Database.getInstance();

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // save user data to asyncstorage
  _saveUserToken = async (userToken) => {
    await AsyncStorage.setItem('userToken', JSON.stringify(userToken));
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // check is user has been logon
    if(userToken)
    {
      // check is user logging out
      const isLogout = this.props.navigation.getParam('logout', false);
      if(isLogout) {
        let userID = JSON.parse(userToken)['id'];
        db.insertIntoLog(userID, "logout from account");
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
      }
      else {
        this.props.navigation.navigate('Main');
      }
    }
    else
    {
      const username = this.props.navigation.getParam('username', '');
      const password = this.props.navigation.getParam('password', '');
      const firstAttempt = this.props.navigation.getParam('firstAttempt', true);
      // check is user submit empty form input
      if(username == '' || password == '') {
        this.props.navigation.navigate('Auth', {errorMessage: "Please fill Username and Password!", firstAttempt: firstAttempt});
      }
      else {
        // check if username and password right
        db.getUserToken(username, password, (res) => {
          if (res.rows.length > 0) {
            this._saveUserToken(res.rows._array[0]);
            db.insertIntoLog(res.rows._array[0].id, "login into account", () => {
              this.props.navigation.navigate('Main');
            });
          }
          else {
            this.props.navigation.navigate('Auth', {errorMessage: 'Credential not found!', firstAttempt: firstAttempt});
          }
        });
      }
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
