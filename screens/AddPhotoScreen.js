import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  AsyncStorage,
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Input } from 'react-native-elements';

import { Colors, Fonts } from '../constants';
import { Button } from '../components';

import Database from '../constants/Database';

export default class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      image: "",
      name: "",
      description: "",
      address: "",
      price: 0,
      nameError: "",
    };
  }

  async componentDidMount() {
    // let { cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    // if (cameraStatus !== 'granted') {
    //   this.props.navigation.goBack();
    // }
    if(Platform.OS === 'ios') {
      let { cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (cameraRollStatus !== 'granted') {
        this.props.navigation.goBack();
      }
    }
    this._pickImage(true);
  }

  _pickImage = async (first) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
    else if(first){
      this.props.navigation.goBack();
    }
  };

  _saveData = async () => {
    let name = String.prototype.trim.call(this.state.name);
    let price = this.state.price;
    let description = String.prototype.trim.call(this.state.description);
    let address = String.prototype.trim.call(this.state.address);
    let image = this.state.image;
    let userToken = await AsyncStorage.getItem('userToken');
    let username = JSON.parse(userToken)['username'];
    if(this.state.name !== "") {
      Database.transaction(
        tx => {
          tx.executeSql('insert into images (photo, name, description, price, address, username) values (?, ?, ?, ?, ?, ?)', [image, name, description, price, address, username], this.props.navigation.goBack());
          tx.executeSql('select * from images', [], (_, { rows }) =>
            console.log(JSON.stringify(rows))
          );
        },
        null,
      );
    }
    else {
      this.setState({nameError: 'Please fill the name'});
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <TouchableOpacity
            onPress={() => this._pickImage(false)}
          >
            <Image
              source={(this.state.image === "")?require('../assets/images/white-logo.png'):{ uri: this.state.image }}
              style={styles.itemImage}
              resizeMode='cover'
            />
          </TouchableOpacity>
          <View style={styles.namePriceContainer}>
            <View style={styles.nameContainer}>
              <Input
                label='NAME'
                placeholder='Enter the name here'
                errorStyle={{ color: 'red' }}
                errorMessage={this.state.nameError}
                labelStyle={styles.formLabel}
                inputStyle={styles.formInput}
                errorStyle={styles.formError}
                containerStyle={styles.formContainer}
                InputContainerStyle={styles.formInputContainer}
                value={this.state.name}
                onChangeText={(text) => this.setState({name: text})}
              />
            </View>
            <View style={styles.priceContainer}>
              <Input
                label='PRICE ($)'
                placeholder='Enter the price here'
                errorStyle={{ color: 'red' }}
                errorMessage={this.state.priceError}
                keyboardType='numeric'
                labelStyle={styles.formLabel}
                inputStyle={styles.formInput}
                errorStyle={styles.formError}
                containerStyle={styles.formContainer}
                InputContainerStyle={styles.formInputContainer}
                value={this.state.price+""}
                onChangeText={(text) => this.setState({price: isNaN(parseFloat(text))?0:parseFloat(text)})}
              />
            </View>
          </View>
        </View>

        <View style={styles.descAddressContainer}>
          <View style={styles.descContainer}>
            <Input
              label='DESCRIPTION'
              placeholder='Enter the description here'
              errorStyle={{ color: 'red' }}
              errorMessage=''
              labelStyle={styles.formLabel}
              inputStyle={styles.formInput}
              errorStyle={styles.formError}
              containerStyle={styles.formAreaContainer}
              InputContainerStyle={styles.formTextAreaContainer}
              value={this.state.description}
              onChangeText={(text) => this.setState({description: text})}
            />
          </View>
          <View style={styles.addressContainer}>
            <Input
              label='ADDRESS'
              placeholder='Enter the address here'
              errorStyle={{ color: 'red' }}
              errorMessage=''
              multiline={true}
              numberOfLines={3}
              labelStyle={styles.formLabel}
              inputStyle={styles.formTextArea}
              errorStyle={styles.formError}
              containerStyle={styles.formAreaContainer}
              InputContainerStyle={styles.formTextAreaContainer}
              value={this.state.address}
              onChangeText={(text) => this.setState({address: text})}
            />
            <Button
              style={{ alignSelf: 'stretch', margin: 5, paddingRight: 10, marginTop: 10 }}
              caption="Save"
              onPress={this._saveData}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    flexDirection: 'row',
    height: 130,
  },
  namePriceContainer: {
    height: 130,
    marginTop: 5,
    marginLeft: 10,
  },
  nameContainer: {
    flex: 1,
  },
  priceContainer: {
    flex: 1,
  },
  itemImage: {
    marginTop: 10,
    marginLeft: 10,
    width: 120,
    height: 120,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'gray',
  },
  formLabel: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 10,
    color: '#617ae1',
  },
  formInput: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 12,
    height: 17,
    marginLeft: 4,
    marginTop: 3,
    marginBottom: 3,
  },
  formError: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 9,
  },
  formContainer: {
    width: 210,
    marginTop: 1,
  },
  formInputContainer: {
    height: 10,
    padding: 0,
  },
  descAddressContainer: {
    height: 200,
    marginTop: 10,
    marginLeft: 10,
  },
  descContainer: {
    flex: 1,
  },
  addressContainer: {
    flex: 2,
  },
  formTextArea: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 12,
    height: 50,
    marginLeft: 4,
    marginTop: 3,
    marginBottom: 3,
  },
  formTextAreaContainer: {
    padding: 0,
  },
  formAreaContainer: {
    width: 340,
    marginTop: 1,
  },
});
