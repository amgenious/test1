import { StyleSheet, View, Text, TouchableOpacity  } from 'react-native'
import React,{useEffect} from 'react'
import { useRouter } from 'expo-router'
import { useNavigation } from 'expo-router'

const WelcomeScreen = () => {
    const router =useRouter()
    const navigaton =useNavigation()
    useEffect(()=>{
        navigaton.setOptions({
          headerShown:false,
        })
      },[])
  return (
    <View style={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        flex:1
    }}>
        <View style={{
            display:'flex',flexDirection:'row', fontSize:20
        }}>
            <Text style={{
                 color: "#FFB41A",
                 fontSize: 25,
                 fontWeight:"bold"
            }}>Hello </Text>
            <Text style={{
                 color: "#3D8ABE",
                 fontSize: 25,
                 fontWeight:"bold" 
            }}>
                Greener
            </Text>
        </View>
        <Text style={{
             color: "#FFB41A",
             fontSize: 17,
             width: 265,
             textAlign: "center",
             marginTop: 10
        }}>
        Please choose one of the buttons below to get started
        </Text>
       
           <TouchableOpacity
            onPress={() => router.push("Signin")}
           style={{
            padding:20,
            width:300,
            backgroundColor: "#3D8ABE",
            borderRadius:20,
            marginTop:40
           }}
           >
            <Text
            style={{
                color:"white",
                fontSize:20,
                fontWeight:"bold",
                textAlign:"center"
            }}
            >Sign In</Text>
           </TouchableOpacity>
    
         <TouchableOpacity
          onPress={() => router.push("Signup")}
           style={{
            padding:20,
            width:300,
            backgroundColor: "white",
            borderColor: "#3D8ABE",
            borderWidth: 1,
            borderRadius:20,
            marginTop:40
           }}
           >
            <Text
            style={{
                fontSize:20,
                fontWeight:"bold",
                color:"#3D8ABE",
                textAlign:"center"
            }}
            >Sign Up</Text>
           </TouchableOpacity>
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({})