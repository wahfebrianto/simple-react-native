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

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _saveUserToken = async (userToken) => {
    await AsyncStorage.setItem('userToken', JSON.stringify(userToken));
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if(userToken)
    {
      this.props.navigation.navigate('Main');
    }
    else
    {
      const username = this.props.navigation.getParam('username', '');
      const password = this.props.navigation.getParam('password', '');
      const firstAttempt = this.props.navigation.getParam('firstAttempt', true);
      if(username == '' || password == '') {
        this.props.navigation.navigate('Auth', {errorMessage: "Please fill Username and Password!", firstAttempt: firstAttempt});
      }
      else {
        var self = this;
        Database.transaction(function(txn) {
          txn.executeSql(
            "SELECT id, username, is_admin FROM users WHERE username=? AND password=? AND is_active=?",
            [username, md5(password), true],
            function(tx, res) {
              if (res.rows.length > 0) {
                self._saveUserToken(res.rows._array[0]);
                self.props.navigation.navigate('Main');
              }
              else {
                self.props.navigation.navigate('Auth', {errorMessage: 'Credential not found!', firstAttempt: firstAttempt});
              }
            }
          );
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
