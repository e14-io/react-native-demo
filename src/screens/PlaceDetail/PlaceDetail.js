import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import { connect } from "react-redux";
import MapView from "react-native-maps";

import { deletePlace } from "../../store/actions";

class PlaceDetail extends Component {

	state = {
		viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape",
	};


	constructor(props) {
		super(props);
		Dimensions.addEventListener("change", this.updateStyles);
	}

	updateStyles = (dims) => {
		this.setState({
			viewMode: dims.window.height > 500 ? "portrait" : "landscape",
		})
	};

	componentWillUnmount () {
		Dimensions.removeEventListener("change", this.updateStyles);
	}

	placeDeletedHandler = () => {
		this.props.onDeletePlace(this.props.selectedPlace.key);
		this.props.navigator.pop();
	};

	render() {
		return (
			<View style={[styles.container, this.state.viewMode === "portrait" ? styles.portraitContainer : styles.landscapeContainer]}>
				<View style={styles.placeDetailContainer}>
					<View style={styles.subContainer}>
						<Image style={styles.placeImage} source={this.props.selectedPlace.image}/>
					</View>
					<View style={styles.subContainer}>
						<MapView
							initialRegion={{
								...this.props.selectedPlace.location,
								latitudeDelta: 0.0122,
								longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.0122,
							}}
							style={styles.map}
						>
							<MapView.Marker coordinate={this.props.selectedPlace.location} />
						</MapView>
					</View>
				</View>
				<View style={styles.subContainer}>
					<View>
						<Text style={styles.placeName}>{this.props.selectedPlace.name}</Text>
					</View>
					<View>
						<TouchableOpacity>
							<View style={styles.deleteButton}>
								<Icon size={30} name={Platform.OS === "android" ? "md-trash" : "ios-trash"} color="red" onPress={this.placeDeletedHandler} />
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		margin: 22,
		flex: 1,
	},
	landscapeContainer: {
		flexDirection: "row"
	},
	portraitContainer: {
		flexDirection: "column"
	},
	placeDetailContainer: {
		flex: 2
	},
	placeImage: {
		width: "100%",
		height: "100%",
	},
	placeName: {
		fontWeight: "bold",
		textAlign: "center",
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	deleteButton: {
		alignItems: "center"
	},
	subContainer: {
		flex: 1,
	}
});

const mapDispatchToProps = dispatch => {
	return {
		onDeletePlace: key => dispatch(deletePlace(key))
	}
};

export default connect(null, mapDispatchToProps)(PlaceDetail);
