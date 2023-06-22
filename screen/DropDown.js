import {View, Text} from 'react-native';
import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker' ;
// import { useGetData } from './useGetData';
import { crime } from '../constants/dummy';

const DropDown = (props) => {

// const [loading, error, crime] = useGetData()
const [isOpen, setIsOpen] = useState(false);
const [currentValue, setCurrentValue] = useState([]) ;

// console.log(crime)
const items = [];


crime.result.records.forEach((element,index) => {
    const obj = {
      label: element.AREA_NAME,
      value: index
    };
  
    items.push(obj);
  });

  const handleInputChange = (val) => {
    props.updateSharedState(val);
  };




return (
<View style={{padding: 30}}>

<DropDownPicker
items={items}
open={isOpen}
setOpen={() => setIsOpen(!isOpen) }
value={currentValue}
setValue={handleInputChange}
maxHeight={ 200}
autoScroll
placeholder="Select Area"
placeholderStyle={{color: 'red', fontWeight: 'bold', fontSize: 16}}
showTickIcon={true}
showArrowIcon={true}
disableBorderRadius={true}
theme="LIGHT"
/>
</View>
);
}

export default DropDown;