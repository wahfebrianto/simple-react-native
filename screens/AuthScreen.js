import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";

import { Fonts, Colors } from '../constants';
import { TextInput, Button} from '../components';

export default class AuthScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anim: new Animated.Value(0),
      isKeyboardVisible: false,
      username: "",
      password: "",
    }
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }), this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener(Platform.select({ android: 'keyboardDidHide', ios: 'keyboardWillHide' }), this._keyboardDidHide.bind(this));
  }

  componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start();
    const errorMessage = this.props.navigation.getParam('errorMessage', '');
    const firstAttempt = this.props.navigation.getParam('firstAttempt', true);
    if(errorMessage != '' && !firstAttempt)
    {
      showMessage({
        message: errorMessage,
        type: "danger",
        position: {
          top: 370,
          right: 10,
          bottom: 50,
          left: 10,
        },
        floating: true,
      });
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isKeyboardVisible: true });
    hideMessage();
  }

  _keyboardDidHide() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isKeyboardVisible: false });
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state;
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      transform: [{
        translateY: anim.interpolate({
          inputRange: [delay, Math.min(delay + 500, 3000)],
          outputRange: [from, 0],
          extrapolate: 'clamp',
        }),
      }],
    };
  }

  _signInAsync = async () => {
    this.props.navigation.navigate('AuthLoading', {username: this.state.username, password: this.state.password, firstAttempt: false});
  };

  render() {
    const TopComponent = Platform.select({ ios: KeyboardAvoidingView, android: View });
    return (
      <View style={[styles.container, { paddingBottom: this.state.isKeyboardVisible ? 270 : 0 }]}>
        <ImageBackground
          source={require('../assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >

          <View style={[styles.section, { paddingTop: 30 }, { marginTop: this.state.isKeyboardVisible ? 90 : 0 }]}>
            <Animated.Image
              resizeMode="contain"
              style={[styles.logo, this.state.isKeyboardVisible && { height: 90 }, this.fadeIn(0)]}
              source={require('../assets/images/white-logo.png')}
            />
          </View>

          <Animated.View style={[styles.section, styles.middle, this.fadeIn(700, -20)]}>
            <TextInput
              placeholder="Username"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => this.setState({ username: text })}
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.textInput}
              onChangeText={(text) => this.setState({ password: text })}
            />

            <Animated.View style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}>
              <Button
                secondary
                rounded
                style={{ alignSelf: 'stretch', marginBottom: 10 }}
                caption="Login"
                onPress={this._signInAsync}
              />
            </Animated.View>
          </Animated.View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingHorizontal: 30,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 2,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  bottom: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
  },
  last: {
    justifyContent: 'flex-end',
  },
  textInput: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  logo: {
    height: 150,
  },
});
