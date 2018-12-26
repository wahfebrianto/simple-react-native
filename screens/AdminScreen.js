import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PureChart from 'react-native-pure-chart';

import { Colors, Fonts } from '../constants';

import Database from '../constants/Database';
const db = Database.getInstance();

export default class AdminScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      launchData: [],
      viewData: [],
      insertData: [],
      log: [],
    };
  }

  async componentWillMount() {
    let userToken = await AsyncStorage.getItem('userToken');
    let userIsAdmin = JSON.parse(userToken)['is_admin'];
    if(!userIsAdmin) {
      Alert.alert(
        'Admin Area',
        'You Do Not Have Permission to Access',
        [
          {text: 'OK', onPress: () => this.props.navigation.goBack()},
        ],
        { cancelable: false }
      );
    }
  }

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    db.getAllLogData((res) => {
      this.setState({
        log: res.rows._array,
      });
    });
    db.getChartData('launch%', (res) => {
      this.setState({
        launchData: res.rows._array,
      });
    });
    db.getChartData('view%', (res) => {
      this.setState({
        viewData: res.rows._array,
      });
    });
    db.getChartData('insert%', (res) => {
      this.setState({
        insertData: res.rows._array,
      });
    });
  }

  renderRow({ item }) {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.itemContainer}
      >
        <View style={styles.itemSubContainer}>
          <View style={styles.itemContent}>
            <Text style={styles.itemBrand}>{item.time}</Text>
            <View>
              <Text style={styles.itemTitle}>{item.username}</Text>
              <Text style={styles.itemSubtitle} numberOfLines={1}>{item.description}</Text>
            </View>
          </View>
        </View>
        <View style={styles.itemHr} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container} ref='_scrollView'>
        <Text style={styles.sectionHeader}>
          Application Launch
        </Text>
        <PureChart
          data={this.state.launchData}
          type='line'
        />
        <View style={styles.itemHr} />
        <Text style={styles.sectionHeader}>
          Post View
        </Text>
        <PureChart
          data={this.state.viewData}
          type='line'
        />
        <View style={styles.itemHr} />
        <Text style={styles.sectionHeader}>
          Post Insert
        </Text>
        <PureChart
          data={this.state.insertData}
          type='line'
        />
        <View style={styles.itemHr} />
        <Text style={styles.sectionHeader}>
          Log
        </Text>
        <FlatList
          keyExtractor={item => item.id}
          style={{ backgroundColor: Colors.white, paddingHorizontal: 15 }}
          data={this.state.log}
          renderItem={this.renderRow}
        />
        <TouchableOpacity
         style={styles.actionButton}
         onPress={() => {this.refs._scrollView.scrollTo({y:0, animate: true});}}
        >
          <AntDesign name="arrowup" size={20} color="#ffffff" />
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    fontFamily: Fonts.primaryBold,
    fontSize: 14,
    color: '#617ae1',
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
  },
  itemSubContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  itemContent: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  itemBrand: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 12,
    color: '#617ae1',
  },
  itemTitle: {
    fontFamily: Fonts.primaryBold,
    fontSize: 14,
    color: '#5F5F5F',
  },
  itemSubtitle: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 11,
    color: '#a4a4a4',
  },
  itemHr: {
    flex: 1,
    height: 1,
    backgroundColor: '#e3e3e3',
    marginRight: -15,
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
