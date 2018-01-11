import React, {Component} from 'react';
import {StatusBar, View, StyleSheet} from 'react-native';
import HomeScreen from './HomeScreen'
import GardenScreen from './ProfileScreen'
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
                marginTop: StatusBar.currentHeight
            }
            ,
        }
    });

export default class App extends Component {
    render() {
        return <Tabs />;
    }
}

