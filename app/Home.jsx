import { StyleSheet, View, Text, TouchableOpacity  } from 'react-native'
import React,{useEffect} from 'react'
import { useRouter } from 'expo-router'
import { useNavigation } from 'expo-router'

const HomeScreen = () => {
    const router =useRouter()
    const navigaton =useNavigation()
    useEffect(()=>{
        navigaton.setOptions({
          headerShown:false,
        })
      },[])
  return (
    <View
    style={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        flex:1
    }}
    >
      <Text
      style={{
        fontSize:25,
        marginBottom:20,
        color:"#3D8ABE"
      }}
      >Go to Home</Text>
      <TouchableOpacity
      onPress={()=>router.push('home')}
      style={{
        padding:10,
        backgroundColor:"#FFB41A",
        borderRadius:10
      }}
      >
        <Text
        style={{
            color:"white",
            fontSize: 20,
            fontWeight:"bold"
        }}
        >Home</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})