import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  AsyncStorage,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';

import { Colors, Fonts } from '../constants';
import { Button, TextInput, GridRow } from '../components';

import Database from '../constants/Database';
const db = Database.getInstance();

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

  async componentDidMount() {
    let userToken = await AsyncStorage.getItem('userToken');
    let userID = JSON.parse(userToken)['id'];
    const didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.loadData();
      }
    );
    db.insertIntoLog(userID, "launch the app");
    this.loadData();
  }

  loadData() {
    db.getHomeItem(this.state.search, (data) => {
      this.setState({
        data: data,
      });
    });
  }

  async _openData(data) {
    let userToken = await AsyncStorage.getItem('userToken');
    let userID = JSON.parse(userToken)['id'];
    db.insertIntoLog(userID, "view data : " + data.name + '[' + data.id + ']', () => {
      this.props.navigation.navigate('Photo', {itemId: data});
    });
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
              <Text style={styles.itemPrice}>${item.price}</Text>
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

  async searchbarType(text) {
    await this.setState({search: '%'+text+'%'});
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
