  import * as Location from "expo-location";

  //reverse thr coordinate to address
  const getLocationAddress = async (coords, setLocationAddress) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(coords);

      if (reverseGeocode.length > 0) {
        const matchedLocation = reverseGeocode[0];
        const street =
          matchedLocation.street === null ||
          matchedLocation.streetNumber === null
            ? `${matchedLocation.name}`
            : `${matchedLocation.streetNumber} ${matchedLocation.street}`;
        const address = `${street},  ${matchedLocation.city} ${matchedLocation.postalCode}`;
        setLocationAddress(address);
      }
    } catch (err) {
      console.log(err);
    }
  };

    //get device's current location
  const getUserCurrentLocation = async (setInitRegion, setUseCurrentLocation, setShowFailDialog, setShowMapView) => {
    try {
      const result = await Location.requestForegroundPermissionsAsync();

      if (result.status === "granted") {
        const location = await Location.getCurrentPositionAsync();

        console.log(location.coords);
        const curentLocationCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setInitRegion(curentLocationCoords);

        return curentLocationCoords;
      }
      //show failed dialog if permission denied
      else {
        setUseCurrentLocation(false);
        setShowFailDialog(true);
        setShowMapView(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  export { getLocationAddress, getUserCurrentLocation }; 