//
// import React, {Component} from 'react';
// import { Button} from 'react-native'
//
// class HomeScreen extends React.Component {
//     static navigationOptions = {
//         title: 'Welcome',
//     };
//     render() {
//         const { navigate } = this.props.navigation;
//         return (
//             <Button
//                 title="Go to Jane's profile"
//                 onPress={() =>
//                     navigate('Profile', { name: 'Jane' })
//                 }
//             />
//         );
//     }
// }
// export default HomeScreen;


import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TextInput, Button, TouchableHighlight} from 'react-native'
const options = {weekday: 'long', month: 'long', day: 'numeric'};

function myWeather(weather) {
    if (typeof weather !== 'undefined') {
        return <ScrollView horizontal={true} style={styles.container}>
            {Object.entries(weather).map(([key, weathers]) =>
                <View key={key} style={styles.weatherContainer}>
                    <Text
                        style={styles.weatherDate}>{new Date(weathers['dt'] * 1000).toLocaleDateString('en-US', options)}</Text>
                    <Image
                        style={{width: 50, height: 50}}
                        source={{uri: "http://openweathermap.org/img/w/" + weathers['weather'][0]['icon'] + '.png'}}
                    />
                    <Text>{weathers['temp']['max']}&deg;/{weathers['temp']['min']}&deg;</Text>
                    <Text>{weathers['weather'][0]['description'].toUpperCase()}</Text>
                    <Text>Humidity: {weathers['humidity']}</Text>
                </View>
            )}
        </ScrollView>;
    }
}
class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {weather: [], sevenDays: [], zipCode: '02472', text: ''};
    }
    componentDidMount() {
        fetch('http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + this.state.zipCode + '&APPID=916847b6b7d2d1d9a152a66bf14d2095&units=imperial')
            .then(res => res.json())
            .then(weather => this.setState({weather}))
            .catch(err => console.log('There was an error fetching the weather:' + err));
    }

    lookupWeather = () => {
        fetch('http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + this.state.text + '&APPID=916847b6b7d2d1d9a152a66bf14d2095&units=imperial')
            .then(res => res.json())
            .then(weather => this.setState({weather: weather}))
            .catch(err => console.log('There was an error fetching the weather:' + err));
        myWeather(this.state.weather['list'])

        this.setState({zipCode: this.state.text})
    }
    render() {
        return (
            <View style={styles.containerSuper}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Weather for <Text style={{color:'blue'}}>{this.state.zipCode}</Text></Text>
                </View>
                <View style={styles.flexRowzz}>
                    <TextInput
                        style={{height: 35, borderColor: 'black', textAlign: 'center', borderWidth: 1, width: 125, marginHorizontal: 20}}
                        placeholder="Zip Code"
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => this.setState({text})}
                    />
                    <View style={styles.button}>
                        <Button
                            onPress={this.lookupWeather}
                            title="Search"
                            color="green"
                            accessibilityLabel="Search"
                        />
                    </View>
                </View>
                    {myWeather(this.state.weather['list'])}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        flexDirection: 'row',
    },
    containerSuper: {
        flex: 1,
        paddingTop: 15,
        flexDirection: 'column',
    },
    weatherDate: {
        fontSize: 18,
        fontWeight: "700",
        alignItems: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        paddingBottom: 15,
    },
    header: {
        fontSize: 24,
        fontWeight: "700",
        color: 'black',
    },
    weatherContainer: {
        width: 100,
        paddingLeft: 10,
    },
    searchQuery: {
        fontStyle: 'italic',
        fontSize: 10,
        marginLeft: 20,
    },
    button: {
        width: 100,
        height: 40,
    },
    flexRowzz: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});
export default HomeScreen;