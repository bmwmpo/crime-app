import { BottomSheet } from "@rneui/themed";
import { View, Dimensions } from "react-native";
import { Card, RadioButton, Text } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import MapView, { Marker, Callout,PROVIDER_GOOGLE } from "react-native-maps";
import styleSheet from "../assets/StyleSheet";

//PopUp Map component
const PopUpMap = ({
  showMapView,
  showHideMapView,
  initRegion,
  isRadioButton,
  useCurrentLocation,
  handleUseCurrentLocation,
  useDraggableMaker,
  handleDraggableMaker,
  location,
}) => {
  //styling
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
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
        {isRadioButton ? (
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
              or use the marker to spot the crime scene
            </Text>
          </View>
        ) : (
          <View>
            <Text variant="labelLarge">{location}</Text>
          </View>
        )}
        {/* map */}
        <MapView
          style={
            isRadioButton
              ? { width: "100%", height: "90%" }
              : { width: "100%", height: "95%" }
          }
          provider={PROVIDER_GOOGLE}
          region={initRegion}
          //onRegionChange={(region) => setInitRegion(region)}
        >
          {/* marker */}
          <Marker
            draggable={useDraggableMaker}
            coordinate={initRegion}
            onDragEnd={(e) => {
              handleDraggableMaker(e.nativeEvent.coordinate);
            }}
          >
            {/* popUp text */}
            <Callout style={ [{width:windowWidth*0.5, height:windowHeight*0.05}, styleSheet.container] }>
              <Text variant='labelLarge' style={styleSheet.lightModeColor}>{ location }</Text>
            </Callout>
          </Marker>
        </MapView>
      </Card>
    </BottomSheet>
  );
};

export default PopUpMap;
