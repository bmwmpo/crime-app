import {View, Text} from 'react-native';
import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker' ;
import { useEffect } from 'react';


const DropDown = (props) => {

// const [loading, error, crime] = useGetData()
const [isOpen, setIsOpen] = useState(false);
const [currentValue, setCurrentValue] = useState([]) ;

// console.log(crime)
const items = [];
let crime = props.crime

//function to arrange alphabetically
function sortByKey(arr, key) {
  return arr.sort((a, b) => {
    const valueA = a[key].toUpperCase(); // Convert to uppercase for case-insensitive sorting
    const valueB = b[key].toUpperCase(); // Convert to uppercase for case-insensitive sorting

    if (valueA < valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else {
      return 0;
    }
  });
}

crime.result.records = sortByKey(crime.result.records, 'AREA_NAME')

// useEffect(()=>{console.log(currentValue)},)

crime.result.records.forEach((element,index) => {
    const obj = {
      label: element.AREA_NAME,
      value: index
    };
  
    items.push(obj);
  });

  const handleInputChange = (val) => {
    setCurrentValue(val)
    console.log(val)
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
placeholderStyle={{color: 'black', fontWeight: 'bold', fontSize: 16}}
showTickIcon={true}
showArrowIcon={true}
disableBorderRadius={true}
theme="LIGHT"
/>
</View>
);
}

export default DropDown;