import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, ScrollView, Dimensions, TouchableHighlight, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'
import Gallery from 'react-native-image-gallery';
const imgWidth = Dimensions.get('window').width / 2;
const imgHeight = Dimensions.get('window').height / 2;
// const imgWidthModalGallery = Dimensions.get('window').height / 2;
// const imgHeightModalGallery = Dimensions.get('window').height / 2;
const imgWidthModalGallery = Dimensions.get('window').width - 100;
const imgHeightModalGallery = (Dimensions.get('window').height / 2) +20;

const imgWidthModalGalleryHighRes = (Dimensions.get('window').width - 100) + 350;
const imgHeightModalGalleryHighRes = (Dimensions.get('window').height / 2) + 400;

function checkImage(imgPath) {
    if (imgPath.toUpperCase().indexOf('A') > -1 || imgPath.indexOf('s') > -1) {
        return (
            <Image
                style={{width: imgWidth, height: 150, borderWidth: .5, borderColor: 'white'}}
                source={{uri: 'http://res.cloudinary.com/dwz017v6p/image/upload/a_0/' + imgPath}}
            />
        )
    }
    else {
        return (<Text style={{display: 'none'}}>N</Text>)
    }
}
class GardenScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {trees: [], isModalVisible: false, modalData: {}, imageGalleryRough: [], imageGalleryFinal: []};
    }

    componentDidMount() {
        fetch('https://takoda-register.herokuapp.com/s_garden_trees/')
            .then(res => res.json())
            .then(trees => this.setState({trees}))
            .catch(err => console.log('There was an error fetching from cloudinary:' + err));
    }

    toggleModal() {
        this.setState({isModalVisible: !this.state.isModalVisible});
        this.setState({imageGalleryFinal: [], imageGalleryRough: []});
    }

    handleClick(imgSource, treeType, treeHeight, diameter, date, id) {
        this.setState({isModalVisible: !this.state.isModalVisible});
        this.setState({
            modalData: {
                'imgSource': imgSource,
                'treeType': treeType,
                'treeHeight': treeHeight,
                'diameter': diameter,
                'date': date
            }
        });

        fetch('https://takoda-register.herokuapp.com/s_garden_trees/' + id)
            .then(res => res.json())
            .then(imageGalleryRough => this.setState({imageGalleryRough: imageGalleryRough}))
            .catch(err => console.log('There was an error fetching the weather:' + err));
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.superContainer}>
                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={styles.modalContent}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: 'green', fontSize: 28, paddingRight: 60}}>
                                    {this.state.modalData.treeType}
                                </Text>
                                <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                                    <TouchableOpacity onPress={() => this.toggleModal()}
                                                      style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: 28,
                                            flexDirection: 'row',
                                            alignSelf: 'flex-end'
                                        }}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{display: 'none'}}>
                                {this.state.imageGalleryRough.map(tree =>
                                    <Text key={tree._id}>
                                        {this.state.imageGalleryFinal.push({
                                            source: {uri: 'http://res.cloudinary.com/dwz017v6p/image/upload/a_0/c_scale,g_center,h_' + imgHeightModalGalleryHighRes + ',w_' + imgWidthModalGalleryHighRes + '/' + tree.imgPath},
                                        },)}
                                    </Text>
                                )}
                            </View>
                            <View style={{height: imgHeightModalGallery, width: imgWidthModalGallery}}>
                                <Gallery
                                    style={{flex: 1}}
                                    images={this.state.imageGalleryFinal}
                                />
                            </View>
                            <View style={{justifyContent: 'space-between', flexDirection: 'row', marginTop: 10}}>
                                <Text style={{fontWeight: 'bold'}}>{this.state.modalData.date}    </Text>
                                <Text>Height: {this.state.modalData.treeHeight}    </Text>
                                <Text>Diameter: {this.state.modalData.diameter}    </Text>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={styles.imageGalleryContainer}>
                    {this.state.trees.map(tree =>
                        <TouchableHighlight key={tree._id}
                                            onPress={() => this.handleClick(tree.imgPath, tree.treeType, tree.treeHeight, tree.diameter, tree.date, tree.id)}
                                            underlayColor="white"
                                            style={styles.container}>
                            {checkImage(tree.imgPath)}
                        </TouchableHighlight>
                    )}
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    superContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    imageGalleryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    modalContent: {
        backgroundColor: 'white',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        flexWrap: 'wrap',
        flexDirection: 'column',
    },
})
export default GardenScreen;
