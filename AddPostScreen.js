import { View,Text, TextInput, StatusBar, Button, Pressable, TouchableOpacity, KeyboardAvoidingView, Platform, Share, Alert } from "react-native";
import styleSheet from "./assets/StyleSheet";
import { useState } from "react";
import { db } from './config/firebase_config';
import { collection, addDoc } from 'firebase/firestore'
import Icon from 'react-native-vector-icons/Ionicons'
import uuid from 'react-native-uuid';

const AddPostScreen = () =>{
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isTitleEmpty, setIsTitleEmpty] = useState(true);

    //share the positng
    const onShare = async () => {
        try{
            const result = await Share.share({
                title,
                message:body
            });

            if(result.action === Share.sharedAction){
                if(result.activityType){
                    console.log('Yes')
                }
            }
        }
        catch(err){
            Alert.alert(err.message);
        }
    }

    //add the post in firestore
    const addPost = async () => {
        try{
            const collectionRef = collection(db, 'Postings');

            const postingId = uuid.v4();

            const newPosting = {
                title,
                body,
                postingId
            }

            await addDoc(collectionRef, newPosting);
        }
        catch(err){
            Alert.alert(err.message);
        }
    }

    //handle the title text change and check whether the title is empty or not
    //disable the add posting button if the title is missing
    const handleTitleTextChange = (newText) => {
        if(newText.trim() === '')
            setIsTitleEmpty(true);
        else
            setIsTitleEmpty(false);

        setTitle(newText);
    }

    return(
        <KeyboardAvoidingView style={styleSheet.postingContainer} keyboardVerticalOffset={100} behavior={Platform.OS === 'ios' && 'height'}>
            <StatusBar/>
            {/* title text input */}
            <View style={styleSheet.titleBodyContainer}>
            <TextInput 
            style={styleSheet.titleTextInputStyle} 
            placeholder='Title'
            value={title} 
            onChangeText={handleTitleTextChange}
            multiline={true}
            autoFocus={true}
            />
            {/* body text input */}
            <TextInput 
            style={styleSheet.bodyTextInputStyle} 
            placeholder='Body'
            value={body} 
            onChangeText={setBody} 
            multiline={true} 
            />
            </View>
            {/* add post and share buttons */}
            <View style={styleSheet.optionBarStyle}>
                <TouchableOpacity onPress={addPost} disabled={isTitleEmpty}>
                    <Icon name='add-circle-outline' size={40} color={isTitleEmpty ? '#a9a9a9': '#000000'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={onShare} >
                    <Icon name='share-social-outline' size={40} color='#000000'/>
                </TouchableOpacity>
            </View>
           
        </KeyboardAvoidingView>
    );
}

export default AddPostScreen;