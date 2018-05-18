import React from "react";
import { TextInput, StyleSheet } from 'react-native';

const defaultIpunt = props => {
	return (
		<TextInput
			{...props}
			style={[styles.input, props.style, !props.valid && props.touched ? styles.invalid : null]}
			placeholder={props.placeholder}
			underlineColorAndroid="transparent"
		/>
	)
};

const styles = StyleSheet.create({
	input: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#eee",
		padding: 5,
		margin: 8,
	},
	invalid: {
		backgroundColor: "#f9c0c0",
		borderColor: "red",
	},
});

export default defaultIpunt;
