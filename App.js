import React from 'react';
import { Platform, StatusBar, StyleSheet, View, UIManager } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Colors from './constants/Colors';
import md5 from 'md5';
import FlashMessage from "react-native-flash-message";

import Database from './constants/Database';
const db = Database.getInstance();

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  componentDidMount() {
    console.disableYellowBox = true;
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    db.hasTableUser();
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
          <FlashMessage position="top" />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
        require('./assets/images/background.png'),
        require('./assets/images/white-logo.png'),
        require('./assets/images/topBarBg.png'),
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
