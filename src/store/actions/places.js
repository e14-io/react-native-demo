import { DELETE_PLACE, REMOVE_PLACE, SET_PLACES, PLACE_ADDED, START_ADD_PLACE } from "./actionTypes";
import { uiStartLoading, uiStopLoading } from "./ui";
import { authGetToken } from "./auth";

export const startAddPlace = () => {
	return {
		type: START_ADD_PLACE
	};
};

export const addPlace = (placeName, location, image) => {
	return dispatch => {
		let authToken = null;
		dispatch(uiStartLoading());
		dispatch(authGetToken())
			.catch(() => alert("No valid token found"))
			.then((token) => {
				authToken = token;
				return fetch("https://us-central1-react-native-places-fd867.cloudfunctions.net/storeImage", {
					method: "POST",
					body: JSON.stringify({
						image: image.base64,
					}),
					headers: {
						"Authorization": "Bearer " + authToken,
					}
				})
			})
			.catch(err => {
				console.log(err);
				alert("Something went wrong, please try again!");
				dispatch(uiStopLoading());
			})
			.then(res => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error();
				}
			})
			.then(parsedRes => {
				const placeDate = {
					name: placeName,
					location: location,
					image: parsedRes.imageUrl,
					imagePath: parsedRes.imagePath,
				};
				return fetch("https://react-native-places-fd867.firebaseio.com/places.json?auth=" + authToken, {
					method: "POST",
					body: JSON.stringify(placeDate)
				})
			})
			.then(res => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error();
				}
			})
			.then(parsedRes => {
				console.log(parsedRes);
				dispatch(uiStopLoading());
				dispatch(placeAdded());
			})
			.catch(err => {
				console.log(err);
				alert("Something went wrong, please try again!");
				dispatch(uiStopLoading());
				dispatch(startAddPlace());
			})
	}
};

export const getPlaces = () => {
	return dispatch => {

		dispatch(authGetToken())
			.catch(() => alert("No valid token found"))
			.then((token) => {
					return fetch("https://react-native-places-fd867.firebaseio.com/places.json?auth=" + token)
			})
			.then(res => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error();
				}
			})
			.then(parsedRes => {
				const places = [];
				for (let key in parsedRes) {
					places.push({
						...parsedRes[key],
						image: {
							uri: parsedRes[key].image
						},
						key: key,
					})
				}
				dispatch(setPlaces(places))
			})
			.catch(err => {
				console.log(err);
				alert("Something went wrong, please try again!");
			})
	}
};

export const setPlaces = places => {
	return {
		type: SET_PLACES,
		places: places,
	};
};

export const deletePlace = (key) => {
	return dispatch => {

		dispatch(authGetToken())
			.catch(() => alert("No valid token found"))
			.then((token) => {
				return fetch("https://react-native-places-fd867.firebaseio.com/places/" + key + ".json?auth=" + token, {
					method: "DELETE"
				})
			})
			.then(res => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error();
				}
			})
			.then(parsedRes => {
				console.log("Done!");
				dispatch(removePlace(key))
			})
			.catch(err => {
				console.log(err);
				alert("Something went wrong, please try again!");
			})
	}
};

export const removePlace = (key) => {
	return {
		type: REMOVE_PLACE,
		placeKey: key
	}
};

export const placeAdded = () => {
	return {
		type: PLACE_ADDED
	};
};
