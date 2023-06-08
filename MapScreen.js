import { Component, useEffect,useState, useRef } from "react";
import{StyleSheet, View, Text, Button, Dimensions} from "react-native";
import React from 'react';
import MapView,{ Marker, Polygon }from 'react-native-maps';
import styleSheet from './assets/StyleSheet';

const MapScreen =()=>{


    const count = useRef(0);
    const [data,setdata] = React.useState([])
    const [apiFlag,setflag] = React.useState(false)
    const [eventID, setID] = React.useState(-1)
    const [eventCoord, setCoord] = React.useState({latitude: 43.759, longitude: -79.571})

    const [polyCoord, setPoly] = React.useState()
    
getApi=async()=>{

    // return fetch(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?resource_id=34e4206d-549e-4957-a0da-093d703a1c62&q=${2022}&limit=1`)
    return fetch(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?resource_id=58b33705-45f0-4796-a1a7-5762cc152772&limit=1`)
    .then((response)=>response.json())
    .then((json)=>{
        setdata(json.result.records);
        console.log((json.result.records[0].AREA_NAME))
        // setID(json.result.records[0].EVENT_UNIQUE_ID)
        setflag(true)
        console.log(apiFlag)
        // console.log([0,1])
        // var g = {"a":1111}
        // console.log(g)
        // console.log(g["a"])
        // console.log(g.a)
        // var dict = JSON.parse(json.result.records[0].geometry)
        // console.log((dict))
        // console.log(JSON.stringify(dict.coordinates))

        // setCoord({latitude:JSON.parse(json.result.records[0].geometry).coordinates[1],longitude:JSON.parse(json.result.records[0].geometry).coordinates[0]})
        setPoly(JSON.parse(json.result.records[0].geometry).coordinates)
        console.log(polyCoord)
    })
    .catch((err)=>{
        console.error(err)
    })

}
 
useEffect(()=>{getApi()},[]) //map component

     return(
        <View style={styleSheet.MapContainer}>
    <Text >test_component</Text>
    <Text>first item EVENT_UNIQUE_ID : {"\n"}{eventID}</Text>
    


    <MapView
          style= {{width: Dimensions.get('window').width, height: 500}}
        //   initialRegion={currRegion}
        //   onRegionChangeComplete={mapMoved}
        //   ref={mapRef}
        >

            {/* <Marker 
            coordinate={eventCoord} 
            title="event 1" 
            description='bike theft'></Marker> */}

            <Polygon
             coordinates={[
                {latitude: 37.8025259, longitude: -122.4351431},
                {latitude: 37.7896386, longitude: -122.421646},
                {latitude: 37.7665248, longitude: -122.4161628},
                {latitude: 37.7734153, longitude: -122.4577787},
                {latitude: 37.7948605, longitude: -122.4596065},
                {latitude: 37.8025259, longitude: -122.4351431},
              ]}
              strokeColor="#000" 
              strokeColors={[
                '#7F0000',
                '#00000000', 
                '#B24112',
                '#E5845C',
                '#238C23',
                '#7F0000',
              ]}
              strokeWidth={6}
            /> 

        </MapView>



</View>
    )
}

export default MapScreen