import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { addPlace, placeAdded, startAddPlace } from "../../store/actions";
import PickImage from "../../components/PickImage/PickImage";
import PickLocation from "../../components/PickLocation/PickLocation";
import PlaceInput from "../../components/PlaceInput/PlaceInput";
import MainText from "../../components/UI/MainText/MainText";
import HeadingText from "../../components/UI/HeadingText/HeadingText";

import validate from "../../utility/validation";

class SharePlaceScreen extends Component {
	static navigatorStyle = {
		navBarButtonColor: "orange"
	};

	reset = () => {
		this.setState({
			controls: {
				placeName: {
					value: "",
					valid: false,
					touched: false,
					validationRules: {
						notEmpty: true,
					}
				},
				location: {
					value: null,
					valid: false,
				},
				image: {
					value: null,
					valid: false,
				}
			}
		});
	};

	componentWillMount() {
		this.reset();
	};

	componentDidUpdate() {
		if (this.props.placeAdded) {
			this.props.navigator.switchToTab({tabIndex: 0});
			// this.props.onStartAddPlace();
		}
	};

	placeNameChangeHandler = val => {
		this.setState(prevState => {
			return {
				controls: {
					...prevState.controls,
					placeName: {
						...prevState.controls.placeName,
						value: val,
						valid: validate(val, prevState.controls.placeName.validationRules),
						touched: true,
					},
				}
			};
		})
	};

	placeAddedHandler = () => {
		this.props.onAddPlace(
			this.state.controls.placeName.value,
			this.state.controls.location.value,
			this.state.controls.image.value
		);
		this.reset();
		this.imagePicker.reset();
		this.locationPicker.reset();
	};

	locationPickedHandler = location => {
		this.setState(prevState => {
			return {
				controls: {
					...prevState.controls,
					location: {
						value: location,
						valid: true,
					}
				}
			}
		})
	};

	imagePickedHandler = image => {
		this.setState(prevState => {
			return {
				controls: {
					...prevState.controls,
					image: {
						value: image,
						valid: true,
					}
				}
			}
		})
	};

	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	}

	onNavigatorEvent = event => {
		if (event.type === "ScreenChangedEvent") {
			if (event.id === "willAppear") {
				this.props.onStartAddPlace();
			}
		}
		if (event.type === "NavBarButtonPress") {
			if (event.id === "sideDrawerToggle") {
				this.props.navigator.toggleDrawer({
					side: "left",
				});
			}
		}
	};

	render() {
		let submitButton = (
			<Button
				title="Share the Place!"
				onPress={this.placeAddedHandler}
				disabled={
					!this.state.controls.placeName.valid ||
					!this.state.controls.location.valid ||
					!this.state.controls.image.valid
				}
			/>
		);
		if (this.props.isLoading) {
			submitButton = <ActivityIndicator />
		}

		return(
			<ScrollView>
				<View style={styles.container}>
					<MainText>
						<HeadingText>Share a place with us!</HeadingText>
					</MainText>
					<PickImage
						onImagePicked={this.imagePickedHandler}
						ref={ref => {this.imagePicker = ref}}
					/>
					<PickLocation
						onLocationPick={this.locationPickedHandler}
						ref={ref => {this.locationPicker = ref}}
					/>
					<PlaceInput
						placeData={this.state.controls.placeName}
						onChangeText={this.placeNameChangeHandler}
					/>
					<View style={styles.button}>
						{submitButton}
					</View>
				</View>
			</ScrollView>
		)
	}
};

const mapStateToProps = state => {
	return {
		isLoading: state.ui.isLoading,
		placeAdded: state.places.placeAdded,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName, location, image)),
		onPlaceAdded: () => dispatch(placeAdded()),
		onStartAddPlace: () => dispatch(startAddPlace()),
	};
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	placeholder: {
		borderWidth: 1,
		borderColor: 1,
		backgroundColor: "#eee",
		width: "80%",
		height: 150,
	},
	button: {
		margin: 8,
	},
	previewImage: {
		width: "100%",
		height: "100%"
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);
