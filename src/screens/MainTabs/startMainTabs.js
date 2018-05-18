import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import { Platform } from "react-native";

const startTabs = () => {
	Promise.all([
		Icon.getImageSource(Platform.OS === "android" ? "md-map" : "ios-map", 30),
		Icon.getImageSource(Platform.OS === "android" ? "md-share-alt" : "ios-share", 30),
		Icon.getImageSource(Platform.OS === "android" ? "md-menu" : "ios-menu", 30)
	])
		.then((icons) => {
			Navigation.startTabBasedApp({
				tabs: [
					{
						screen: "awesome-places.FindPlaceScreen",
						label: "Find Place",
						title: "Find Place",
						icon: icons[0],
						navigatorButtons: {
							leftButtons: [
								{
									icon: icons[2],
									title: "Menu",
									id: "sideDrawerToggle"
								}
							]
						}
					},
					{
						screen: 'awesome-places.SharePlaceScreen',
						label: "Share Place",
						title: "Share Place",
						icon: icons[1],
						navigatorButtons: {
							leftButtons: [
								{
									icon: icons[2],
									title: "Menu",
									id: "sideDrawerToggle"
								}
							]
						}
					}
				],
				drawer: {
					left: {
						screen: "awesome-places.SideDrawer"
					}
				}
			});
		});
};

export default startTabs;
