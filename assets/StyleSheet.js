import { StyleSheet } from "react-native";
 
const styleSheet = StyleSheet.create({
    //Login Screen and SignUp Screen
    flex_9: {
        flex:9
    },
    flex_1: {
        flex:1
    },
    screenBackGroundColor: {
       backgroundColor: '#0C090A',
    },
    textInputBackGroundColor: {
        backgroundColor:'#3D3C3A',
    },
   errorTextInputBorderColor: {
        backgroundColor:'#3D3C3A',
    },
    textColor: {
       color:'#E5E4E2'
    },
    lightModeColor: {
        color:'#0C090A'
    },
    highLightTextColor:{
        color:'#ff4500',
    },
    logoutColor: {
        color:'#E41B17'
    },
   container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
   },
   formatContainer:{
       marginBottom:35,
       height:50,
   },
   inputContainer:{
       flexDirection:'row',
       width:'90%',
       //height: 50,
       borderWidth: 1,
       borderRadius: 5,
       padding: 10,
    },
   flexRowContainer: {
       flexDirection:'row'    
   },
   errorInputContainer:{
       flexDirection:'row',
       width:'90%',
       // height: 50,
       borderWidth: 2,
       borderColor:'#F70D1A',
       borderRadius: 5,
       padding:10,
   },
   headerStyle:{
       marginBottom: 30,
       fontSize: 25,
       fontWeight: 'bold',
       textAlign:'center'
   },
   errorTextStyle:{
       fontSize: 15,
       color:'#F70D1A',
   },
   underLineTextStyle:{
       fontSize: 15,
       textDecorationLine:'underline'
    },
   textStyle: {
       fontSize: 15,
       fontWeight:'bold'
   },
   inputStyle:{
       flex: 9,
       fontSize:18
   },
   iconStyle:{
       justifyContent:'center',
       alignItems:'center'
   },
   buttonStyle:{
       backgroundColor: '#ff4500',
       width: '90%',
       height: 50,
       alignItems:'center',
       justifyContent:'center',
       borderRadius: 5,
       marginVertical: 30
   },
   disabledButtonStyle:{
       backgroundColor: '#686A6C',
       width: '90%',
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
       backgroundColor: '#808080',
       alignItems: 'center',
       justifyContent:'center',
       flex:1
   },
   titleBodyContainer:{
       flex:9, 
       width:'100%',
   },
   titleTextInputStyle:{
       width:'100%', 
       textAlignVertical:'top', 
       fontSize:30, 
       fontWeight:'bold', 
       borderBottomWidth:2, 
       borderColor:'#696969',
   },
   bodyTextInputStyle:{ 
       width:'100%',
       textAlignVertical:'top', 
       fontSize: 20
   },
   optionBarStyle:{
       flex:1,
       flexDirection:"row",
       alignItems:'center',
       justifyContent:'center',
       width:'100%'
   },
    drawerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    drawerTextStyle: {
        textAlign: 'left',
        marginHorizontal: '10%',
        fontWeight: 'bold',
        width:'80%'
    },
});

export default styleSheet;