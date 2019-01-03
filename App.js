import React, {Component} from 'react';
import {StatusBar, View, StyleSheet} from 'react-native';
import HomeScreen from './screens/HomeScreen'
import GardenScreen from './screens/GardenScreen'
import {TabNavigator} from 'react-navigation';
import {Icon} from 'react-native-elements';

export const Tabs = TabNavigator({
        Home: {
            screen: HomeScreen,
        },
        Garden: {
            screen: GardenScreen,

        }
    },
    {
        tabBarOptions: {
            style: {
                marginTop: StatusBar.currentHeight,
                backgroundColor: '#3db535c7'
            },
            labelStyle: {
                fontSize: 18,
            },
            indicatorStyle: {
                backgroundColor: "black",
            }
        }
    });

export default class App extends Component {
    render() {
        return <Tabs />;
    }
}

