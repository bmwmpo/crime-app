import { View,Text, TextInput } from "react-native";
import styleSheet from "./assets/StyleSheet";
import { useState } from "react";

const AddPostScreen = () =>{
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    return(
        <View style={styleSheet.postingContainer}>
            <TextInput 
            style={styleSheet.titleTextInputStyle} 
            placeholder="Title" 
            value={title} 
            onChangeText={setTitle} 
            multiline={true}
            />
            <TextInput 
            style={styleSheet.bodyTextInputStyle} 
            placeholder="Body" 
            value={body} 
            onChangeText={setBody} 
            multiline={true} 
            />
        </View>
    );
}

export default AddPostScreen;