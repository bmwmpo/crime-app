 import { StyleSheet } from "react-native";
 
 const styleSheet = StyleSheet.create({
    //Login Screen and SignUp Screen
    container: {
      flex: 1,
      backgroundColor: '#808080',
      alignItems: 'center',
      paddingHorizontal: 50,
      justifyContent: 'center',
    },
    formatContainer:{
        marginBottom:25,
        width:'120%',
        height:50,
    },
    inputContainer:{
        flexDirection:'row',
        backgroundColor:'#d3d3d3',
        //width:'120%',
        //height: 50,
        borderWidth: 1,
        borderColor:'#ccc',
        borderRadius: 5,
        padding:10,
    },
    errorInputContainer:{
        flexDirection:'row',
        backgroundColor:'#d3d3d3',
        // width:'120%',
        // height: 50,
        borderWidth: 2,
        borderColor:'#ff0000',
        borderRadius: 5,
        padding:10,
    },
    headerStyle:{
        marginBottom: 30,
        fontSize: 30
    },
    errorTextStyle:{
        fontSize: 15,
        color:'#ff0000',
    },
    forgotPasswordTextStyle:{
        fontSize: 15,
        color:'#0000cd',
        textDecorationLine:'underline'
    },
    // errorInputStyle:{
    //     width:'100%',
    //     height:50,
    //     borderWidth: 1,
    //     borderColor:'##ff4500',
    //     borderRadius: 5,
    //     padding:5,
    //     marginBottom: 20,
    // },
    inputStyle:{
        flex:9
    },
    iconStyle:{
        justifyContent:'center',
        alignItems:'center'
    },
    buttonStyle:{
        backgroundColor: '#ff4500',
        width: '120%',
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 5,
        marginVertical: 30
    },
    disabledButtonStyle:{
        backgroundColor: '#a9a9a9',
        width: '120%',
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        marginVertical: 30
    },
    buttonTextStyle:{
        fontWeight:'bold',
        fontSize:16
    }
    ,
    //AddPostScreen
    postingContainer:{
        flex:1,
        backgroundColor: '#808080',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleTextInputStyle:{
        flex:1, 
        height:'20%',
        width:'100%', 
        textAlignVertical:'top', 
        fontSize:30, 
        fontWeight:'bold', 
        borderBottomWidth:1, 
        borderColor:'black'
    },
    bodyTextInputStyle:{
        flex:9, 
        width:'100%', 
        textAlignVertical:'top', 
        fontSize: 20
    }
});

export default styleSheet;