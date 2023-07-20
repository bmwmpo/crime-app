import React, { useState,useEffect } from "react";

import { StatusBar, FlatList, Image, Animated, Text, View, Dimensions, StyleSheet, TouchableOpacity, Easing, SafeAreaViewBase, SafeAreaView } from 'react-native';
const { width, height } = Dimensions.get('screen');

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

const LiveCalls = () => {
  const [data, setData] = useState(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const BG_IMG= "https://lh3.googleusercontent.com/p/AF1QipPCsEaUL6f2zgNEUMx14RwI3V4Rj8tODwPqPPz-=s680-w680-h510"
  const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3
let newArray=[]

  const fetchData = async () => {
    const response = await fetch("https://services.arcgis.com/S9th0jAJ7bqgIRjw/ArcGIS/rest/services/C4S_Public_NoGO/FeatureServer/0/query?where=OBJECTID+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=OCCURRENCE_TIME+DESC&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=");
    const json = await response.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return <Text>Loading...</Text>;
  } else {
    newArray = data.features.map(feature => ({
        OBJECTID: feature.attributes.OBJECTID,
        OCCURRENCE_TIME: timeConverter(feature.attributes.OCCURRENCE_TIME),
        CALL_TYPE: feature.attributes.CALL_TYPE,
        CROSS_STREETS: feature.attributes.CROSS_STREETS,
        geometry: feature.geometry
      }));
    return (

<View style={{flex: 1, backgroundColor: '#fff'}}>
<View style={styles.container}>
      </View>
              <Image
                  source={{uri: BG_IMG}}
                  style={StyleSheet.absoluteFillObject}
                  blurRadius={80}
              />
              <Animated.FlatList 
              data={newArray}
              onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: scrollY}}}],
                  { useNativeDriver: true}
              )}
              keyExtractor={item => item.OBJECTID}
              contentContainerStyle={{
                  padding: SPACING,
                  paddingTop: StatusBar.currentHeight || 42
              }}
              renderItem= {({item, index}) => {
                  const inputRange = [
                      -1,
                      0,
                      ITEM_SIZE * index,
                      ITEM_SIZE * (index +2)
                  ]
      
                  const opacityInputRange = [
                      -1,
                      0,
                      ITEM_SIZE * index,
                      ITEM_SIZE * (index +1)
                  ]
                  
                  const scale = scrollY.interpolate({
                      inputRange,
                      outputRange: [1,1,1,0]
                  })
      
                  const opacity = scrollY.interpolate({
                      inputRange:opacityInputRange,
                      outputRange: [1,1,1,0]
                  })
      
                  return <Animated.View style={{flexDirection: 'row', padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12, 
                      shadowColor: "#000",
                      shadowOffset: {
                          width: 0,
                          height: 10
                      },
                      shadowOpacity: .3,
                      shadowRadius: 20,
                      opacity,
                      transform: [{scale}]
                  }}>
                  {/* <Image
                      source={{uri: item.image}}
                      style={{width:AVATAR_SIZE, height:AVATAR_SIZE, borderRadius: AVATAR_SIZE,
                      marginRight: SPACING/2
                      }}
                  /> */}
                  <View>
                      <Text style={{fontSize:22, fontWeight: '700'}}>{item.OCCURRENCE_TIME}</Text>
                      <Text style={{fontSize:18, opacity: .7}}>{item.CALL_TYPE}</Text>
                      <Text style={{fontSize:14, opacity: .8,color:'#0099cc'}}>{item.CROSS_STREETS}</Text>
                  </View>
              </Animated.View>
      }}
      
      />
      </View>

    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
     justifyContent: "center",
     alignItems: "center",
  },
});

export default LiveCalls;
