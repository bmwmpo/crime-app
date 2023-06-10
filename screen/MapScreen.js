import { Component, useEffect,useState, useRef } from "react";
import{View, Text, Button, Dimensions} from "react-native";
import React from 'react';
import MapView,{ Marker, Polygon }from 'react-native-maps';
import styleSheet from '../assets/StyleSheet';
import API_Request from '../API_Request'
import Region from '../class/Region.js'

const MapScreen =()=>{


    const count = useRef(0);
    const [data,setdata] = React.useState([])
    const [apiFlag,setflag] = React.useState(false)
    const [eventID, setID] = React.useState(-1)
    const [eventCoord, setCoord] = React.useState({latitude: 43.759, longitude: -79.571})
    const default_poly = [
        [ -122.4351431, 37.8025259],
        [ -122.421646, 37.7896386],
        [ -122.4161628, 37.7665248],
        [ -122.4577787, 37.7734153],
        [-122.4596065, 37.7948605],
        [ -122.4351431, 37.8025259],
      ]
    const initRegion = {
        latitude: 43.653225,
        longitude: -79.383186,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,}

    const [polyCoord, setPoly] = React.useState(default_poly)
     const[Region_Obj,setObj] = React.useState(new Region('test_region',0,0,0,0,0,0,0,0,0,default_poly))
    
getApi=async()=>{
    return fetch(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?resource_id=58b33705-45f0-4796-a1a7-5762cc152772&limit=1`)
    .then((response)=>response.json())
    .then((json)=>{
        setdata(json.result.records);
        console.log((json.result.records[0].AREA_NAME))
        setflag(true)
        console.log(apiFlag)
        setPoly(JSON.parse(json.result.records[0].geometry).coordinates[0])

    })
    .catch((err)=>{
        console.error(err)
    })

}

const apiGot=()=>{
    console.log("api got")
    console.log(polyCoord)

    if(polyCoord!=default_poly){
        var temp_obj = new Region("published_region",0,0,0,0,0,0,0,0,0,polyCoord)
        setObj(temp_obj)

    }
}
 
useEffect(()=>{
    console.log("data to class Obj")
    console.log(Region_Obj.region_geo)
},[Region_Obj])

useEffect(()=>{getApi()},[]) 

useEffect(()=>{apiGot()},[polyCoord])


     return(
        <View>
    <Text >test_component</Text>
    <Text>first item EVENT_UNIQUE_ID : {"\n"}{eventID}</Text>
    


    <MapView
          style= {{width: Dimensions.get('window').width, height: 500}}
          initialRegion={initRegion}
        //   onRegionChangeComplete={mapMoved}
        //   ref={mapRef}
        >
            <Polygon
             coordinates={Region_Obj.region_geo}
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
