import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import NavigationService from './NavigationService';
import MemberNavigator from './MemberNavigator';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthScreen from '../screens/AuthScreen';

const TopLevelNavigator = createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Main: MemberNavigator,
    Auth: {
      screen: AuthScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
const AppContainer = createAppContainer(TopLevelNavigator);

export default class App extends React.Component{
  render() {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
