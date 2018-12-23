import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';

import { Fonts, Colors } from '../constants';
import HomeScreen from '../screens/HomeScreen';
import AddPhotoScreen from '../screens/AddPhotoScreen';
import NavigationService from './NavigationService';

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
});

const _signOutAsync = async () => {
  await AsyncStorage.clear();
  NavigationService.navigate('AuthLoading');
};

const _goBack = () => {
  NavigationService.navigate('Home');
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
          <Text style={styles.headerCaption}>Add New Photo</Text>
        </View>
      ),
    },
  },
}, { initialRouteName : 'Home' });

export default (
  MemberStack
);
