import React from 'react';
import Expo, {SQLite} from 'expo';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import md5 from 'md5';

const db = SQLite.openDatabase('FoodNoteDB.db');

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      navigation: navigation
    }
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
      this.state.navigation.navigate('Main');
    }
    else
    {
      const username = this.state.navigation.getParam('username', '');
      const password = this.state.navigation.getParam('password', '');
      if(username == '' || password == '') {
        this.state.navigation.navigate('Auth', {errorMessage: 'Please fill Username and Password!'});
      }
      else {
        var self = this;
        db.transaction(function(txn) {
          txn.executeSql(
            "SELECT id, is_admin FROM users WHERE username=? AND password=? AND is_active=?",
            [username, md5(password), true],
            function(tx, res) {
              if (res.rows.length > 0) {
                self._saveUserToken(res.rows._array[0]);
                self.state.navigation.navigate('Main');
              }
              else {
                self.state.navigation.navigate('Auth', {errorMessage: 'Credential not found!'});
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
