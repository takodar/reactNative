import React, {Component} from 'react';
import {Platform, View, Text, StyleSheet, Image, ScrollView, TextInput, Button, TouchableHighlight} from 'react-native'
const options = {weekday: 'long', month: 'long', day: 'numeric'};
import { Constants, Location, Permissions } from 'expo';

function RenderSevenDayWeather(weather, zipCodeTextInput) {
    if (typeof weather !== 'undefined') {
        return <View style={{flexDirection: 'row'}}><ScrollView horizontal={true} style={styles.container}>
            {Object.entries(weather).map(([key, weathers]) =>
                <View key={key} style={styles.weatherContainer}>
                    <Text
                        style={styles.weatherDate}>{new Date(weathers['dt'] * 1000).toLocaleDateString('en-US', options)}</Text>
                    <Image
                        style={{width: 70,height: 70}}
                        source={{uri: "http://openweathermap.org/img/w/" + weathers['weather'][0]['icon'] + '.png'}}
                    />
                    <Text>{weathers['temp']['max']}&deg; / {weathers['temp']['min']}&deg;</Text>
                    <Text>{weathers['weather'][0]['description'].toUpperCase()}</Text>
                    <Text>Humidity: {weathers['humidity']}</Text>
                </View>
            )}
        </ScrollView></View>;
    }
    else if(zipCodeTextInput.length > 0) {
        return <View style={styles.invalidZipCodeContainer}>
                    <Text style={styles.invalidZipCode}> {zipCodeTextInput}</Text>
                    <Text style={styles.invalZipCodeMessage}>  is not a valid zip code :( </Text>
                </View>
    }
}
class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {weather: [], sevenDays: [], zipCode: '', text: '', location: null, errorMessage: null, longitude: null, latitude: null, displayLocation: "...", loadingImage: 250};
    }

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
        this.lookupWeather();
    };


    lookupWeather = () => {
        const that = this;

        //Look up weather by zip code entered
        if(this.state.text.length > 0){
            fetch('http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + this.state.text + '&APPID=916847b6b7d2d1d9a152a66bf14d2095&units=imperial')
                .then(res => res.json())
                .then(weather => this.setState({weather: weather}))
                .catch(err => console.log('There was an error fetching the weather:' + err));
                RenderSevenDayWeather(this.state.weather['list'], this.state.text)
                this.state.displayLocation = this.state.text;
        }

        // Look up weather by users geo location
        else if(this.state.location !== null){
            fetch('http://api.openweathermap.org/data/2.5/forecast/daily?'+ this.state.latitude + this.state.longitude + '&APPID=916847b6b7d2d1d9a152a66bf14d2095&units=imperial')
                .then((res) => res.json())
                .then(function(data) {
                    that.setState({weather: data});
                    that.setState({displayLocation: data.city.name});
                })
                .catch(err => console.log('There was an error fetching the weather:' + err));
                RenderSevenDayWeather(this.state.weather['list'], "geolocationused");
        }
    }

    render() {
        let loadingWeatherMessage = "Loading weather for your current location"
        if (this.state.errorMessage) {
            this.state.location = this.state.errorMessage;
        } else if (this.state.location) {
            this.state.latitude = "lat=" + this.state.location.coords.latitude;
            this.state.longitude = "&lon=" + this.state.location.coords.longitude;
            loadingWeatherMessage = "";
            this.state.loadingImage = 0;
        }

        return (
            <View style={styles.containerSuper}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Weather for <Text style={{color:'blue'}}>{this.state.displayLocation}</Text></Text>
                </View>
                <View style={styles.flexRowzz}>
                    <TextInput
                        style={{height: 35, borderColor: 'black', textAlign: 'center', borderWidth: 1, width: 125, marginHorizontal: 20}}
                        placeholder="Zip Code"
                        underlineColorAndroid='transparent'
                        keyboardType = 'numeric'
                        maxLength = {5}
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
                <View style={{alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{height: this.state.loadingImage, width: this.state.loadingImage}} source={require('../images/loading.gif')} />
                </View>
                <View style={styles.invalidZipCodeContainer}>{RenderSevenDayWeather(this.state.weather['list'], this.state.text)}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        flexDirection: 'row',
        paddingBottom: 12,
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
        width: 120,
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
    invalidZipCodeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 15
    },
    invalidZipCode: {
        fontSize: 15,
        fontWeight: "600",
        color: "red"
    },
    invalZipCodeMessage: {
        fontSize: 18,
    }
});
export default HomeScreen;