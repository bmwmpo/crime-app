 import { StyleSheet } from "react-native";
 
 const styleSheet = StyleSheet.create({
    //Login Screen and SignUp Screen
    container: {
      flex: 1,
      backgroundColor: '#696969',
      alignItems: 'center',
      paddingHorizontal: 50,
      justifyContent: 'center',
    },
    formatContainer:{
        marginBottom:20
    },
    inputContainer:{
        flexDirection:'row',
        backgroundColor:'#d3d3d3',
        width:'120%',
        height: 50,
        borderWidth: 1,
        borderColor:'#ccc',
        borderRadius: 5,
        padding:10,
    },
    errorInputContainer:{
        flexDirection:'row',
        backgroundColor:'#d3d3d3',
        width:'120%',
        height: 50,
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
        color:'#ff4500'
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
        borderRadius: 5
    },
    disabledButtonStyle:{
        backgroundColor: '#a9a9a9',
        width: '120%',
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    }  
});

export default styleSheet;