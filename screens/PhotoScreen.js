import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Badge } from 'react-native-elements';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';

import { Colors, Fonts } from '../constants';
import { Button } from '../components';

import Database from '../constants/Database';
const db = Database.getInstance();

export default class AddPhotoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      photo: "",
      name: "",
      description: "",
      address: "",
      price: "",
    };

  }

  async componentDidMount() {
    if(this.props.navigation.getParam('itemId')) {
      await this.setState(
        this.props.navigation.getParam('itemId')
      );
    }
    const didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.loadData();
      }
    );
  }

  loadData() {
    db.getItemData(this.state.id, (res) => {
      this.setState(
        res.rows._array[0]
      );
    });
  }

  _goEditImage() {
    this.props.navigation.navigate('AddPhoto', {itemId: this.state});
  }

  async _goDeleteImage() {
    let userToken = await AsyncStorage.getItem('userToken');
    let userID = JSON.parse(userToken)['id'];
    Alert.alert(
      'Delete Corfirmation',
      'Are you sure want to delete this data?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          db.deleteData(this.state.id, this.state.name, userID, () => {
            this.props.navigation.goBack();
          });
        }},
      ],
      { cancelable: false }
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageHeader}>
          <Text style={styles.usernameText}>
            {this.state.username}
          </Text>
          <TouchableOpacity
            onPress={() => this._goEditImage()}
            style={styles.editButton}
          >
            <EvilIcons name="pencil" size={40} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._goDeleteImage()}
            style={styles.deleteButton}
          >
            <EvilIcons name="trash" size={40} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <Image
          source={(this.state.photo === "")?require('../assets/images/white-logo.png'):{ uri: this.state.photo }}
          style={styles.itemImage}
          resizeMode='contain'
        />
        <View style={styles.namePriceContainer}>
          <Text style={styles.nameText}>
            {this.state.name}
          </Text>
          <Badge containerStyle={{ backgroundColor: 'gold', alignSelf: 'flex-end', height: 30, marginTop: 5, marginRight: 4}}>
            <Text style={styles.priceText}>
              {'$'+this.state.price}
            </Text>
          </Badge>
        </View>
        <Text style={styles.descriptionText}>
          {this.state.description}
        </Text>
        <View style={styles.addressContainer}>
          <MaterialIcons name="place" size={40} color={Colors.grey} />
          <Text style={styles.addressText}>
            {this.state.address}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageHeader: {
    flexDirection: 'row',
    height: 50,
    marginLeft: 6,
    marginRight: 6,
  },
  usernameText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 4,
    marginTop: 3,
    marginBottom: 3,
    alignSelf: 'flex-start',
    flex: 9,
    height: 40,
    textAlignVertical: 'center',
  },
  editButton: {
    height: 40,
    marginRight: 4,
    marginTop: 3,
    marginBottom: 3,
    alignSelf: 'flex-end',
    flex: 1,
  },
  deleteButton: {
    height: 40,
    marginRight: 4,
    marginTop: 3,
    marginBottom: 3,
    alignSelf: 'flex-end',
    flex: 1,
  },
  itemImage: {
    marginTop: 0,
    marginLeft: 0,
    alignSelf: 'stretch',
    height: Dimensions.get('window').width,
  },
  namePriceContainer: {
    height: 40,
    marginTop: 0,
    marginLeft: 6,
    marginRight: 6,
    flexDirection: 'row',
  },
  nameText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 16,
    height: 40,
    marginLeft: 4,
    marginRight: 3,
    marginBottom: 3,
    alignSelf: 'flex-start',
    textAlignVertical: 'center',
    textAlign: 'left',
    flex: 1,
  },
  priceText: {
    fontFamily: Fonts.primaryBold,
    fontSize: 16,
    height: 30,
    alignSelf: 'flex-start',
    textAlignVertical: 'center',
    textAlign: 'left',
    flex: 1,
  },
  descriptionText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 6,
    alignSelf: 'stretch',
  },
  addressContainer: {
    marginTop: 0,
    marginLeft: 6,
    marginRight: 6,
    flexDirection: 'row',
  },
  addressText: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 14,
    marginLeft: 3,
    marginBottom: 3,
  },
});
