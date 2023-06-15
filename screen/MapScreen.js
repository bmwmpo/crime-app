import { Component, useEffect,useState, useRef } from "react";
import{View, Text, Button, Dimensions, TextInput} from "react-native";
import React from 'react';
import MapView,{ Marker, Polygon }from 'react-native-maps';
import styleSheet from '../assets/StyleSheet';
import API_Request from '../API_Request'
import Region from '../class/Region.js'
import Drawer from '@mui/material/Drawer';
import { bottom } from "@popperjs/core";


const MapScreen =()=>{


    const count = useRef(0);
    const [data,setdata] = React.useState([])
    const [region_id, setID] = React.useState([])
    const [region_name, setName] = React.useState([])
    const [eventCoord, setCoord] = React.useState({latitude: 43.759, longitude: -79.571})
    const [region_color, setColor] = React.useState(["rgba(255,138,142,0.3)",
    "rgba(250,228,62,0.3)",
    "rgba(55,255,41,0.3)",
    "rgba(41,137,255,0.3)"])
    const [selectedName, setSelectedName] = React.useState("")
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

    const [polyCoord, setPoly] = React.useState([default_poly])
     const[Region_Obj,setObj] = React.useState([new Region(-1,'default_poly',0,0,0,0,0,0,0,0,0,default_poly)])
    
getApi=async()=>{
    return fetch(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?resource_id=58b33705-45f0-4796-a1a7-5762cc152772&limit=200`)
    .then((response)=>response.json())
    .then((json)=>{
        // setdata(json.result.records);
        console.log("name print")
        console.log(json.result.records[1].AREA_NAME)
        console.log(JSON.parse(json.result.records[1].geometry).coordinates[0])
    let i = 0  
    var temp_obj_list=[]
    while(i<json.result.total){
        var temp_obj = new Region(json.result.records[i]._id,json.result.records[i].AREA_NAME,0,0,0,0,0,0,0,0,0,JSON.parse(json.result.records[i].geometry).coordinates[0])
        temp_obj_list.push(temp_obj)
        i++
    }
     setObj(temp_obj_list)


    })
    .catch((err)=>{
        console.error(err)
    })

}

const apiGot=()=>{
console.log("apiGot")
}


useEffect(()=>{getApi()},[]) 

useEffect(()=>{apiGot()},[Region_Obj])

 RegionPressed=(region_name)=>{
    console.log("pressed")
    console.log(region_name)
    setSelectedName(region_name)
}

const Poly_list = Region_Obj.map((item)=>
<Polygon
coordinates={item.region_geo}
strokeColor="rgba(255,0,9,0.5)"
fillColor= {region_color[item.id%4]}
tappable = {true}
strokeWidth={2}
onPress={()=>RegionPressed(item.region_name)}
/>
)

const DrawerInfo=(
    <Text>{selectedName}</Text>
)


     return(
        <View>




    <MapView
          style= {{width: Dimensions.get('window').width, height:  Dimensions.get('window').height}}
          initialRegion={initRegion}
        //   onRegionChangeComplete={mapMoved}
        //   ref={mapRef}
        >


{Poly_list}


        </MapView>


</View>
    )
}

export default MapScreen
