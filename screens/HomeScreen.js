import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';

import { Colors, Fonts } from '../constants';
import { Button, TextInput, GridRow } from '../components';

import Database from '../constants/Database';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      search: "%%",
    };
    this._openData = this._openData.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.addNewPhoto = this.addNewPhoto.bind(this);
  }

  componentDidMount() {
    // this.props.gridStateActions.loadData(); LOAD DATA
    const listData = [{
      id: "1",
      username: 'Jackrexx',
      name: 'CHICKEN STEAK BURGER',
      description: 'Chicken steak inside the burger',
      price: 1.99,
      photo: 'https://reactnativestarter.com/demo/images/city-sunny-people-street.jpg',
    }, {
      id: "2",
      username: 'reynoldkevin',
      name: 'HONGKONG FRIED RICE',
      description: 'Fried rice with carrot, greenbeans, and beef',
      price: 3.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-26549.jpg',
    }, {
      id: "3",
      username: 'tancejang',
      name: 'SALMON SUSHI',
      description: 'Sushi with salmon inside',
      price: 7.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-30360.jpg',
    }, {
      id: "4",
      username: 'blacklarsa',
      name: 'CANTONESE FRIED NOODLE',
      description: 'Fried noodle with cantonese style',
      price: 5.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-37839.jpg',
    }, {
      id: "5",
      username: 'ardyputra',
      name: 'GREEN SALAD',
      description: 'Salad with many green and fresh vegetables',
      price: 2.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-69212.jpg',
    }, {
      id: "6",
      username: 'stevenchristian',
      name: 'FISH FILLET BURGER',
      description: 'Burger with fish fillet inside',
      price: 3.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-108061.jpg',
    },
    {
      id: "7",
      username: 'gregorian',
      name: 'WAGYU STEAK',
      description: 'Wagyu steak with barbeque sauce',
      price: 22.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-126371.jpg',
    }, {
      id: "8",
      username: 'RKW',
      name: 'HAINANESE CHICKEN RICE',
      description: 'Chicken rice with hainanese style',
      price: 6.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-165888.jpg',
    }, {
      id: "9",
      username: 'hufungxian',
      name: 'WONTON NOODLE',
      description: 'Soup noodle with pork wonton',
      price: 3.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-167854.jpg',
    }, {
      id: "10",
      username: 'yosikristian',
      name: 'BABY OCTOPUS SANDWICH',
      description: 'Sandwich with baby octopus inside',
      price: 11.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-173427.jpg',
    }, {
      id: "11",
      username: 'rhomairama',
      name: 'TURKEY STEAK',
      description: 'Steak made by turkey chest',
      price: 21.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-175696.jpg',
    }, {
      id: "12",
      username: 'iisdahlia',
      name: 'JAPANESE CHICKEN CURRY RICE',
      description: 'Japanese chicken curry rice with vegetables',
      price: 4.99,
      photo: 'https://reactnativestarter.com/demo/images/pexels-photo-175733.jpg',
    }];
    const didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.loadData();
      }
    );
  }

  loadData() {
    Database.transaction(
      txn => {
        txn.executeSql("select id, username, name, description, price, photo, address from images where is_active=1 AND (username like ? OR name like ?) order by id desc", [this.state.search, this.state.search], (tx, res) => {
          this.setState({
            data: res.rows._array,
          });
        }, () => console.log('gagal'));
      },
      null,
    );
  }

  _openData(data) {
    this.props.navigation.navigate('Photo', {itemId: data});
  }

  renderRow({ item }) {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.itemContainer}
        onPress={() => this._openData(item)}
      >
        <View style={styles.itemSubContainer}>
          <Image
            source={{ uri: item.photo }}
            style={styles.itemImage}
          />
          <View style={styles.itemContent}>
            <Text style={styles.itemBrand}>{item.username}</Text>
            <View>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSubtitle} numberOfLines={1}>{item.description}</Text>
            </View>
            <View style={styles.itemMetaContainer}>
              <Text style={styles.itemPrice}>${item.price+""}</Text>
            </View>
          </View>
        </View>
        <View style={styles.itemHr} />
      </TouchableOpacity>
    );
  }

  addNewPhoto() {
    this.props.navigation.navigate('AddPhoto');
  }

  searchbarType(text) {
    this.setState({search: '%'+text+'%'});
    this.loadData();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 50 }}>
        <SearchBar
          lightTheme
          searchIcon={{ size: 24 }}
          placeholder='Search'
          onChangeText={(text) => this.searchbarType(text)} />
        </View>
        <FlatList
          keyExtractor={item => item.id}
          style={{ backgroundColor: Colors.white, paddingHorizontal: 15 }}
          data={this.state.data}
          renderItem={this.renderRow}
        />
        <TouchableOpacity
         style={styles.actionButton}
         onPress={this.addNewPhoto}
        >
          <AntDesign name="plus" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  itemContainer: {
    backgroundColor: 'white',
  },
  itemSubContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  itemImage: {
    height: 100,
    width: 100,
  },
  itemContent: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  itemBrand: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 14,
    color: '#617ae1',
  },
  itemTitle: {
    fontFamily: Fonts.primaryBold,
    fontSize: 16,
    color: '#5F5F5F',
  },
  itemSubtitle: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 12,
    color: '#a4a4a4',
  },
  itemMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 15,
    color: '#5f5f5f',
    textAlign: 'right',
  },
  itemHr: {
    flex: 1,
    height: 1,
    backgroundColor: '#e3e3e3',
    marginRight: -15,
  },
  textInput: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  actionButton: {
    alignItems:'center',
    justifyContent:'center',
    width:50,
    position: 'absolute',
    bottom: 16,
    right: 16,
    height: 50,
    backgroundColor:'#617ae1',
    borderRadius:100,
  },
});
