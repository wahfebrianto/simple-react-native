import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { SimpleLineIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

import { Fonts, Colors } from '../constants';
import HomeScreen from '../screens/HomeScreen';
import AddPhotoScreen from '../screens/AddPhotoScreen';
import PhotoScreen from '../screens/PhotoScreen';
import AdminScreen from '../screens/AdminScreen';
import NavigationService from './NavigationService';
import Database from '../constants/Database';

const headerBackground = require('../assets/images/topBarBg.png');

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
  },
  headerCaption: {
    fontFamily: Fonts.primaryRegular,
    color: Colors.white,
    fontSize: 18,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 9,
    bottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 9,
    bottom: 10,
  },
  adminButton: {
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 9,
    bottom: 10,
  },
});

const userToken = AsyncStorage.getItem('userToken');

const _signOutAsync = async () => {
  NavigationService.navigate('AuthLoading', {logout: true});
};

const _goBack = () => {
  NavigationService.navigate('Home');
};

const _goAdmin = async () => {
  let userToken = await AsyncStorage.getItem('userToken');
  let userIsAdmin = JSON.parse(userToken)['is_admin'];
  console.log(userIsAdmin);
  if(!userIsAdmin) {
    Alert.alert(
      'Admin Area',
      'You Do Not Have Permission to Access',
      [
        {text: 'OK', onPress: () => NavigationService.navigate('Home')},
      ],
      { cancelable: false }
    );
  }
  else {
    NavigationService.navigate('Admin');
  }
};

const MemberStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: (
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerImage}
            source={headerBackground}
          />
          <TouchableOpacity style={styles.adminButton} onPress={_goAdmin} >
            <FontAwesome name={'user-md'} size={28} color='white' />
          </TouchableOpacity>
          <Text style={styles.headerCaption}>Home</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={_signOutAsync} >
            <SimpleLineIcons name={'logout'} size={26} color='white' />
          </TouchableOpacity>
        </View>
      ),
    },
  },
  AddPhoto: {
    screen: AddPhotoScreen,
    navigationOptions: {
      header: (
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerImage}
            source={headerBackground}
          />
          <TouchableOpacity style={styles.backButton} onPress={_goBack} >
            <Ionicons name={'md-arrow-back'} size={26} color='white' />
          </TouchableOpacity>
          <Text style={styles.headerCaption}>Photo</Text>
        </View>
      ),
    },
  },
  Photo: {
    screen: PhotoScreen,
    navigationOptions: {
      header: (
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerImage}
            source={headerBackground}
          />
          <TouchableOpacity style={styles.backButton} onPress={_goBack} >
            <Ionicons name={'md-arrow-back'} size={26} color='white' />
          </TouchableOpacity>
          <Text style={styles.headerCaption}>Photo</Text>
        </View>
      ),
    },
  },
  Admin: {
    screen: AdminScreen,
    navigationOptions: {
      header: (
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerImage}
            source={headerBackground}
          />
          <TouchableOpacity style={styles.backButton} onPress={_goBack} >
            <Ionicons name={'md-arrow-back'} size={26} color='white' />
          </TouchableOpacity>
          <Text style={styles.headerCaption}>Admin</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={_signOutAsync} >
            <SimpleLineIcons name={'logout'} size={26} color='white' />
          </TouchableOpacity>
        </View>
      ),
    },
  },
}, { initialRouteName : 'Home' });

export default (
  MemberStack
);
