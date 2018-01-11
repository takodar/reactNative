import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, ScrollView, Dimensions, TouchableHighlight, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'
const imgWidth = Dimensions.get('window').width / 2;

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
        this.state = {trees: [], isModalVisible: false, images: []};
    }

    componentDidMount() {
        fetch('https://service.takoda.net/s_garden_trees/')
            .then(res => res.json())
            .then(trees => this.setState({trees}))
            .catch(err => console.log('There was an error fetching from cloudinary:' + err));
    }

    _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible })


    render() {
        return (
            <ScrollView>
                <View>
                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={this._toggleModal}>
                                <Text style={{color:'black', fontSize: 30, marginBottom: 20}} >X</Text>
                            </TouchableOpacity>
                            <Text>Under Construction! Check Back Soon...</Text>
                        </View>
                    </Modal>
                </View>
                <View style={styles.container}>
                    {this.state.trees.map(tree =>
                        <TouchableHighlight key={tree._id} onPress={this._toggleModal} underlayColor="white"
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
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
})
export default GardenScreen;


// class ProfileScreen extends Component {

//     render() {
//         return (
//             <View>
//                 <Text>test</Text>
//             </View>);
//             {/*<View>*/}
//                 {/*<View>*/}
//                     {/*<Text id="treeHeader" style={{color: "green"}} className="text-center">{this.props.className}*/}
//                         {/*Tree*/}
//                     {/*</Text>*/}
//                 {/*</View>*/}
//                 {/*<View>*/}
//                             {/*{this.state.trees.map(tree =>*/}
//                                 {/*<Text key={tree._id}>*/}
//                                     {/*<Text>{tree.date}</Text>*/}
//                                     {/*<Text>{tree.treeHeight}</Text>*/}
//                                     {/*<Text>{tree.diameter}</Text>*/}
//                                 {/*</Text>*/}
//                             {/*)}*/}
//                 {/*</View>*/}
//                     {/*<View>*/}
//                         {/*<ImageGallery*/}
//                             {/*items={this.state.images}*/}
//                             {/*slideInterval={2000}*/}
//                             {/*showThumbnails={false}*/}
//                         {/*/>*/}
//                     {/*</View>*/}
//             {/*</View>*/}
//         // )
//     }
// }
// export default ProfileScreen;