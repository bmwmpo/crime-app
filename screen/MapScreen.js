import { Component, useEffect,useState, useRef } from "react";
import{View, Text, Button, Dimensions, TextInput} from "react-native";
import React from 'react';
import MapView, {Marker, Polygon, Callout,PROVIDER_GOOGLE }from 'react-native-maps';
import styleSheet from '../assets/StyleSheet';
import Region from '../class/Region.js'
import { BottomSheet,ListItem  } from '@rneui/themed';
import polylabel from "polylabel";
import { Searchbar } from "react-native-paper";
import DropDownPicker from 'react-native-dropdown-picker' ;
const MapScreen =()=>{

    const region_color = ["rgba(0,0,0,0.5)",//best  white
    "rgba(28,252,0,0.5)",//-1 sd   green
    "rgba(255,130,0,0.5)",//-2 sd   orange
    "rgba(255,70,70,0.5)",//+1 2sd   mid red
    "rgba(255,20,20,0.5)",
    "rgba(255,0,0,0.5)",
    "rgba(0,0,0,0.5)"]    //worst blk
    const [selectedName, setSelectedName] = React.useState("")
    const [crime_filter, setCrimeFilter] = React.useState("None")
    const [yearSelected,setYearSelected] = React.useState(2014)
    const [year_option, setYearOption] = React.useState([2014])
    // const year_option = [2014,2015,2016,2017,2018,2019,2020,2021,2022]
    const [bottom_sheet_visible, setBottomVisble] = React.useState(false)

    const default_poly = [
        [ -122.4351431, 37.8025259],
        [ -122.421646, 37.7896386],
        [ -122.4161628, 37.7665248],
        [ -122.4577787, 37.7734153],
        [-122.4596065, 37.7948605],
        [ -122.4351431, 37.8025259],
      ]

      const [Bottom_Sheet, setBottomSheet] = React.useState([
        { title: ("Default")  },
        { title: (crime_filter)  },
        { title: (`Total count in ${yearSelected}: ` + 0) },
      ])

      const [avg,setAverage] = React.useState(-1)
      const [sd,setSD] = React.useState(-1)


    const [CameraRegion,setCamera] = React.useState({
        latitude: 43.653225,
        longitude: -79.383186,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,})

        const [searchQuery, setSearchQuery] = React.useState('');

        const [isOpen, setIsOpen] = useState(false);

    const crime_option = ["None","Assault", "Auto Theft", "Bike Theft", "Break Enter", "Homicide", "Robbery", "Shooting", "Theft from MV", "Theft Over"]
    const crime_option_value = ["none","assault", "autotheft", "biketheft", "breakenter", "homicide", "robbery", "shooting", "theftFromMv", "theftOver"]
      const crime_list = []
      crime_option.forEach((ele,index)=>{
        const obj = {
          label: ele,
          value: crime_option_value[index]
        };
        
        crime_list.push(obj);
      })
      const year_list = []


    const[Region_Obj,setObj] = React.useState([new Region(-1,'default_poly',[0],[0],[0],[0],[0],[0],[0],[0],[0],default_poly,[1.0,0.0])])
    
getApi=async()=>{
    return fetch(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?resource_id=58b33705-45f0-4796-a1a7-5762cc152772&limit=200`)
    .then((response)=>response.json())
    .then((json)=>{
        // console.log("name print")
        // console.log(json.result.records[1].AREA_NAME)
        // console.log(JSON.parse(json.result.records[1].geometry).coordinates[0])
    let i = 0  
    var temp_obj_list=[]
    while(i<json.result.total){
        var keyArray = Object.keys(json.result.records[0])
        var lastestYear = 2014
        var temp_assault = []
        var temp_autotheft = []
        var temp_biketheft = []
        var temp_breakenter = []
        var temp_homicide = []
        var temp_robbery = []
        var temp_shooting = []
        var temp_theftfrommv = []
        var temp_theftover = []
        var year_option =[]
        // console.log(keyArray)
        // console.log("start array")
        // console.log(keyArray.some(ele=>ele.includes(String(lastestYear))))
        while(keyArray.some(ele=>ele.includes(String(lastestYear)))){
            // console.log(lastestYear)
            year_option.push(lastestYear)
            temp_assault.push(json.result.records[i]["ASSAULT_"+String(lastestYear)])
            temp_autotheft.push(json.result.records[i]["AUTOTHEFT_"+String(lastestYear)])
            temp_biketheft.push(json.result.records[i]["BIKETHEFT_"+String(lastestYear)])
            temp_breakenter.push(json.result.records[i]["BREAKENTER_"+String(lastestYear)])
            temp_homicide.push(json.result.records[i]["HOMICIDE_"+String(lastestYear)])
            temp_robbery.push(json.result.records[i]["ROBBERY_"+String(lastestYear)])
            temp_shooting.push(json.result.records[i]["SHOOTING_"+String(lastestYear)])
            temp_theftfrommv.push(json.result.records[i]["THEFTFROMMV_"+String(lastestYear)])
            temp_theftover.push(json.result.records[i]["THEFTOVER_"+String(lastestYear)])
            // console.log(temp_assault)
            lastestYear+=1
        }      
        setYearOption(year_option)

        // temp_assault=[0]
        // temp_autotheft=[0]
        // temp_biketheft=[0]
        // temp_breakenter=[0]
        // temp_homicide=[0]
        // temp_robbery=[0]
        // temp_shooting=[0]
        // temp_theftfrommv=[0]
        // temp_theftover=[0]

        // var p = polylabel(JSON.parse(json.result.records[i].geometry).coordinates,1.0) 
        // console.log("center")
        // console.log(p)
        var temp_obj = new Region(json.result.records[i]._id,
                                    json.result.records[i].AREA_NAME,
                                    temp_assault,temp_autotheft,
                                    temp_biketheft,
                                    temp_breakenter,
                                    temp_homicide,
                                    temp_robbery,
                                    temp_shooting,
                                    temp_theftfrommv,
                                    temp_theftover,
                                    JSON.parse(json.result.records[i].geometry).coordinates[0],
                                    polylabel(JSON.parse(json.result.records[i].geometry).coordinates,0.3)
                                    )
     
        temp_obj_list.push(temp_obj)
        // console.log(JSON.parse(json.result.records[i].geometry).coordinates[0])
        i++
    }
     setObj(temp_obj_list)


    })
    .catch((err)=>{
        console.error(err)
    })
  }
  const apiGot = () => {
    console.log("apiGot");
  };

const Get_Average=(Region_Obj,option)=>{
    var i = 0
    var total=0
    while(i<Region_Obj.length){
        total+=Region_Obj[i][option][year_option.indexOf(yearSelected)]
        i++
    }
    return (total/Region_Obj.length)
}

const Get_SD=(Region_Obj,option,avg)=>{
    var i = 0 
    var temp_sum = 0
    while(i<Region_Obj.length){
        temp_sum+=(Math.pow((Region_Obj[i][option][year_option.indexOf(yearSelected)]-avg),2))
        i++
    }
    return (Math.sqrt((temp_sum/Region_Obj.length)))
}

const onChangeSearch = query => setSearchQuery(query)

const coloring=()=>{
console.log(Region_Obj[0])
console.log("start re-coloring")
if(crime_filter!="None"){
var option = crime_option_value[crime_option.indexOf(crime_filter)]
console.log(option)

var avg = Get_Average(Region_Obj,option)
setAverage(avg)
var sd = Get_SD(Region_Obj,option,avg)
setSD(sd)

console.log(avg)
console.log(sd)

var z1=avg-3*sd
var z2=avg-2*sd
var z3=avg-1*sd
var z4=avg
var z5=avg+1*sd
var z6=avg+2*sd
var z7=avg+3*sd
}

var i = 0
while(i<Region_Obj.length){

    // if(Region_Obj[i][option]<z2){Region_Obj[i].region_color=region_color[0]}
    // else if(Region_Obj[i][option]<z3){Region_Obj[i].region_color=region_color[1]}
    // else if(Region_Obj[i][option]<z4){Region_Obj[i].region_color=region_color[2]}
    // else if(Region_Obj[i][option]<z5){Region_Obj[i].region_color=region_color[3]}
    // else if(Region_Obj[i][option]<z6){Region_Obj[i].region_color=region_color[3]}
    // else if(Region_Obj[i][option]<z7){Region_Obj[i].region_color=region_color[5]}
    // else if(Region_Obj[i][option]>z7){Region_Obj[i].region_color=region_color[6]}

    var temp_front_regList = []
    var temp_end_regList = []

    Region_Obj.map((ele,index)=>{
        if(index<i){
            temp_front_regList.push(ele)
        }
        else if(index>i){
            temp_end_regList.push(ele)
        }
        })
                                                                    //<z1  <-3sd
        if(crime_filter!="None"){
            if(Region_Obj[i][option][year_option.indexOf(yearSelected)]<z2){// <-2sd
        Region_Obj[i].region_color=region_color[0]
     }

    else if(Region_Obj[i][option][year_option.indexOf(yearSelected)]<z3){ // <-sd
        Region_Obj[i].region_color=region_color[1]}

    else if(Region_Obj[i][option][year_option.indexOf(yearSelected)]<z4){// <m
        Region_Obj[i].region_color=region_color[2]}

    else if(Region_Obj[i][option][year_option.indexOf(yearSelected)]<z5){// m+1sd
        Region_Obj[i].region_color=region_color[3]}

    else if(Region_Obj[i][option][year_option.indexOf(yearSelected)]<z6){
        Region_Obj[i].region_color=region_color[3]}

    else if(Region_Obj[i][option][year_option.indexOf(yearSelected)]<z7){
        Region_Obj[i].region_color=region_color[5]}

    else if(Region_Obj[i][option][year_option.indexOf(yearSelected)]>z7){
        Region_Obj[i].region_color=region_color[6]}
//white <-2sd < green  <-1sd < orange  <mean < light red  <mean+1  <mean+2 < dark red <mean+3 < black
        }
        else{
            Region_Obj[i].region_color="rgba(0,0,0,0)"
        }
    

        setObj(
            temp_front_regList.concat(Region_Obj[i],temp_end_regList)
        )
    i++
    
}
}
// const Get_MidPt=(coord)=>{
//     var i = 0

//     var lowX=coord[0].latitude
//     var lowY=coord[0].longitude
//     var highX=coord[0].latitude
//     var highY=coord[0].longitude

//     var lat_total = 0
//     var long_total = 0

//     var tempx1=0
//     var tempy1=0
//     var tempx2=0
//     var tempy2=0

//     var cenX=0
//     var cenY=0

//     var polygonSignedArea = 0

//     while(i<coord.length-1){
//        polygonSignedArea = polygonSignedArea + (coord[i].latitude*coord[i+1].longitude - coord[i+1].latitude*coord[i].longitude)
//        cenX = cenX + ((coord[i].latitude + coord[i+1].latitude) * (coord[i].latitude*coord[i+1].longitude - coord[i+1].latitude*coord[i].longitude))
//        cenY = cenY + ((coord[i].longitude + coord[i+1].longitude) * (coord[i].latitude*coord[i+1].longitude - coord[i+1].latitude*coord[i].longitude))
//         i++
//     }
//     polygonSignedArea = polygonSignedArea/2
//     cenX = cenX/(6*polygonSignedArea)
//     cenY = cenY/(6*polygonSignedArea)

//     while(i<coord.length){
//         if(coord[i].latitude>highX){
//             highX=coord[i].latitude
//         }
//         if(coord[i].longitude>highY){
//             highY=coord[i].longitude
//         }
//         if(coord[i].latitude<lowX){
//             lowX=coord[i].latitude
//         }
//         if(coord[i].longitude<lowY){
//             lowY=coord[i].longitude
//         }
//         lat_total+=coord[i].latitude
//         long_total+=coord[i].longitude
//         i++
//     }
//     var midOfResult_X= ((highX+lowX)/2 + lat_total/coord.length)/2
//     var midOfResult_Y= ((highY+lowY)/2 + long_total/coord.length)/2

//     var midOfResult_X= ( lat_total/coord.length)
//     var midOfResult_Y= ( long_total/coord.length)


//     return    {
//         latitude: cenX,
//         longitude: cenY,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,}
// }
const searchRegion=(searchName)=>{
    console.log("searching")
    Region_Obj.map((ele)=>{
        if(ele.region_name==searchName){
            RegionPressed(ele)
        }
    })
}

const handleInputChange =(val)=>{
  console.log("DropDown")
  console.log(val())
  console.log(crime_option[crime_option_value.indexOf(val())])
  setCrimeFilter(crime_option[crime_option_value.indexOf(val())])
}

const handleInputChangeYear=(val)=>{
  setCrimeFilter(crime_option[crime_option_value.indexOf(val())])
}

  useEffect(() => {
    apiGot();
  }, [Region_Obj]);

useEffect(()=>{getApi()},[])

useEffect(()=>{coloring()},[crime_filter])
useEffect(()=>{coloring()},[yearSelected])



const mapRef = useRef(null)

 RegionPressed=(region)=>{
    console.log("pressed")
    console.log(region.region_name)

    

    setSelectedName(region.region_name)
    var temp_count = region[crime_option_value[crime_option.indexOf(crime_filter)]][year_option.indexOf(yearSelected)]?region[crime_option_value[crime_option.indexOf(crime_filter)]][year_option.indexOf(yearSelected)]:"No record"
    setBottomSheet([
        { title: (region.region_name)  },
        { title: (crime_filter)  },
        { title: (`Total count in ${yearSelected} : ` + temp_count) },
      ])
   setBottomVisble(true)
    mapRef.current.animateToRegion(region.center_geo,1*1000)
}

const Poly_list = Region_Obj.map((item)=>
<Polygon
key={crime_filter+"_"+item.id+"_"+item.region_name}
coordinates={item.region_geo}
strokeColor="rgba(255,0,0,0.5)"
fillColor= {item.region_color}
tappable = {true}
strokeWidth={2}
onPress={()=>RegionPressed(item)}
/>

)

const Marker_list = Region_Obj.map((item)=>
<Marker
key={`key_${item.id}_${item.region_name}`}
coordinate={item.center_geo}
tracksViewChanges={false}
tracksInfoWindowChanges={false}
tappable={true}
onPress={()=>RegionPressed(item)}
>
        <Text>{(item[crime_option_value[crime_option.indexOf(crime_filter)]]?item[crime_option_value[crime_option.indexOf(crime_filter)]]:["0"])[year_option.indexOf(yearSelected)]}</Text>
</Marker>
)

// const Picker_Option_Categlory = crime_option.map((item)=>
// <Picker.Item label={item} value={crime_option_value[crime_option.indexOf(item)]}/>
// )

// const Picker_Option_Year = year_option.map((item)=>
// <Picker.Item label={String(item)} value={item}/>
// )


     return(
    <View style={{width:"100%",height:"100%",backgroundColor:"red"}}>     

    <MapView
        ref={mapRef}
        style= {{width: Dimensions.get('window').width,opacity:1, height:  Dimensions.get('window').height,position:"absolute",top:0, left:0 }}
        initialRegion={CameraRegion}
        //   onRegionChangeComplete={mapMoved}
        provider={PROVIDER_GOOGLE}
        >
            
            {Poly_list}
            {Marker_list}
        </MapView>

        <Searchbar
        placeholder="Search"
         onChangeText={onChangeSearch}
         value={searchQuery}
         style={{opacity:0.95}}
         onIconPress={()=>searchRegion(searchQuery)}/>

        <View style={{flexDirection:"row",height:"7%",opacity:0.8,backgroundColor:"#a6a6a6"}}>
       {/* <Picker
       style={{flex:0.5,height:"100%"}}
        selectedValue={crime_option_value[crime_option.indexOf(crime_filter)]}
        onValueChange={(itemValue, itemIndex) =>
            setCrimeFilter(crime_option[crime_option_value.indexOf(itemValue)])
        }>
        {Picker_Option_Categlory}
        </Picker>  */}


        <DropDownPicker
          items={crime_list} //list
          open={isOpen}
          setOpen={() => setIsOpen(!isOpen) }
          value={crime_filter}
          setValue={handleInputChange}//sele
          maxHeight={ 400}
          autoScroll
          placeholder="Select Crime"
          placeholderStyle={{color: 'black', fontWeight: 'bold', fontSize: 16}}
          showTickIcon={true}
          showArrowIcon={true}
          disableBorderRadius={true}
          theme="LIGHT"
          style={{flex:0.5,height:"100%"}}
          />


{/* <DropDownPicker
          items={crime_list} //list
          open={isOpen}
          setOpen={() => setIsOpen(!isOpen) }
          value={crime_filter}
          setValue={handleInputChangeYear}//sele
          maxHeight={ 400}
          autoScroll
          placeholder="Select Crime"
          placeholderStyle={{color: 'black', fontWeight: 'bold', fontSize: 16}}
          showTickIcon={true}
          showArrowIcon={true}
          disableBorderRadius={true}
          theme="LIGHT"
          style={{flex:0.5,height:"100%"}}
          /> */}


        {/* <Picker
        style={{flex:0.5}}
        selectedValue={yearSelected}
        onValueChange={(itemValue, itemIndex) =>
            setYearSelected(itemValue)
        }>
        {Picker_Option_Year}
        </Picker>  */}
    </View>

        <View style={{flexDirection:"column",height:"5%",width:"100%",marginBottom:0,marginTop:"auto"}}>
            <View style={{flexDirection:"row",width:"100%",height:"50%",backgroundColor:"#a6a6a6",opacity:0.8}}>
                <Text style={{flex:0.2,textAlign:"center"}}>mean-2sd</Text>
                <Text style={{flex:0.2,textAlign:"center"}}>mean-sd</Text>
                <Text style={{flex:0.2,textAlign:"center"}}>mean</Text>
                <Text style={{flex:0.2,textAlign:"center"}}>mean+sd</Text>
                <Text style={{flex:0.2,textAlign:"center"}}>mean+2sd</Text>
            </View>

            <View style={{flexDirection:"row",height:"50%",backgroundColor:"#a6a6a6",opacity:0.8}}>
              <Text style={{flex:0.2,textAlign:"center"}}>{(Math.round((avg-2*sd)*10))/10}</Text>
                <Text style={{flex:0.2,textAlign:"center"}}>{(Math.round((avg-sd)*10))/10}</Text>
                <Text style={{flex:0.2,textAlign:"center"}}>{(Math.round((avg)*10))/10}</Text>
                <Text style={{flex:0.2,textAlign:"center"}}>{(Math.round((avg+sd)*10))/10}</Text>
                <Text style={{flex:0.2,textAlign:"center"}}>{(Math.round((avg+2*sd)*10))/10}</Text>
            </View>
        </View>

        

        <BottomSheet modalProps={{}} isVisible={bottom_sheet_visible} onBackdropPress={()=>setBottomVisble(false)}>
   
        {Bottom_Sheet.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={l.containerStyle}
          onPress={l.onPress}
        >
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    
    </BottomSheet>

</View>
    )
}

export default MapScreen;
