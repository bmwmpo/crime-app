import { BottomSheet } from "@rneui/themed";
import { View, Dimensions } from "react-native";
import { Card, RadioButton, Text } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
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
  handleDraggableMaker,
}) => {
  //styling
  const windowHeight = Dimensions.get("window").height;
  const isDarkMode = useTheme().dark;
  const textColor = styleSheet.darkModeColor;

  return (
    <BottomSheet isVisible={showMapView} onBackdropPress={showHideMapView}>
      <Card
        style={[
          styleSheet.padding_Horizontal,
          styleSheet.padding_Vertical,
          { height: windowHeight * 0.65, backgroundColor: "#797979" },
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
              <Text variant="labelLarge" style={textColor}>
                Use current location
              </Text>
            </View>
            <Text
              variant="labelLarge"
              style={[textColor, { marginBottom: "1%" }]}
            >
              or use draggable marker for the crime scene
            </Text>
          </View>
        )}
        {/* map */}
        <MapView
          style={[{ width: "100%", height: "90%" }]}
          region={initRegion}
          //onRegionChange={(region) => setInitRegion(region)}
        >
          {/* marker */}
          <Marker
            draggable={true}
            coordinate={initRegion}
            onDragEnd={(e) => {
              handleDraggableMaker(e.nativeEvent.coordinate);
            }}
          />
        </MapView>
      </Card>
    </BottomSheet>
  );
};

export default PopUpMap;