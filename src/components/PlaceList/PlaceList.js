import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { connect } from 'react-redux';

import ListItem from '../ListItem/ListItem';

const placeList = props => {
	return (
		<FlatList
			style={style.listContainer}
			data={props.places}
			renderItem={(info) => (
				<ListItem
					placeName={info.item.name}
					image={info.item.image}
					onItemPresses={() => props.onItemSelected(info.item.key)}
				/>
			)}
		/>
	);
};

const style = StyleSheet.create({
	listContainer: {
		width: '100%'
	}
});

export default placeList;
