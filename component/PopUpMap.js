import { BottomSheet } from "@rneui/themed";
import { View, Dimensions } from "react-native";
import { Card, RadioButton, Text } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import styleSheet from "../assets/StyleSheet";

//PopUp Map component
const PopUpMap = ({
  showMapView,
  showHideMapView,
  initRegion,
  isRadioButton,
  useCurrentLocation,
  handleUseCurrentLocation,
  isDraggable,
  handleDraggableMaker,
}) => {
  const windowHeight = Dimensions.get("window").height;

  return (
    <BottomSheet isVisible={showMapView} onBackdropPress={showHideMapView}>
      <Card
        style={[
          styleSheet.padding_Horizontal,
          styleSheet.padding_Vertical,
          { height: windowHeight * 0.7 },
        ]}
      >
        {/* use current location radio button */}
        {isRadioButton && (
          <View>
            <View style={[styleSheet.flexRowContainer, styleSheet.alignCenter]}>
              <RadioButton
                value={true}
                status={useCurrentLocation ? "checked" : "unchecked"}
                onPress={handleUseCurrentLocation}
              />
              <Text variant="labelLarge">Use current location</Text>
            </View>
            <Text variant="labelLarge">
              or use draggable marker for the crime scene
            </Text>
          </View>
        )}
        {/* map */}
        <MapView
          style={[{ width: "100%", height: "100%" }]}
          region={initRegion}
          //onRegionChange={(region) => setInitRegion(region)}
        >
          {/* marker */}
          {isDraggable ? (
            <Marker
              draggable={!useCurrentLocation}
              coordinate={initRegion}
              onDragEnd={(e) => {
                handleDraggableMaker(e.nativeEvent.coordinate);
              }}
            />
          ) : (
            <Marker coordinate={initRegion} />
          )}
        </MapView>
      </Card>
    </BottomSheet>
  );
};

export default PopUpMap;
