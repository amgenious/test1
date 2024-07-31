import { db,storage } from "./../../configs/FirebaseConfig";
import { View, Text,StyleSheet, TextInput, Image,TouchableOpacity, ActivityIndicator,ToastAndroid } from 'react-native'
import React,{useState,useEffect} from 'react'
import { Ionicons } from "@expo/vector-icons";
import { addDoc,setDoc,doc, collection } from 'firebase/firestore';
import { useRouter } from "expo-router";


const addProfile = ({route}) => {
    const router =useRouter()
    const {uid}=route.params
    const [firstname, setFirstName] = useState();
    const [lastname, setLastName] = useState();
    const [gender, setGender] = useState();
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);
    const saveUserDetails =async ()=>{
        setLoading(true)
        console.log(firstname,lastname,gender,uid,email)
        try{
            await addDoc(collection(db,'passengers'),{
                firstName:firstname,
                lastName:lastname,
                email:email,
                gender:gender,
                solarCredit:0,
                uid:uid,
                verified:true
            })
            setLoading(false)
            ToastAndroid.show('Profile Added...',ToastAndroid.LONG)
            router.push("home")
        }catch(error){
            setLoading(false)
            console.log(error)
            ToastAndroid.show(error,ToastAndroid.LONG)
        }
    }
  return (
    <View
    style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: 10,
      }}
    >
        <View
        style={{
          padding: 10,
          width: "100%",
        }}
      >
      <Text
       style={{
        color: "#3D8ABE",
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10,
      }}
      >Add Profile</Text>
      <View style={styles.wrapper}>
          <Ionicons name="person" size={20} color="#3D8ABE" />
          <TextInput 
          onChangeText={(value) => setFirstName(value)}
          style={{
            padding:5,
            width:350
           }}
          placeholder="First Name" placeholderTextColor="#3D8ABE" />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="person" size={20} color="#3D8ABE" />
          <TextInput
          onChangeText={(value) => setLastName(value)} 
          style={{
            padding:5,
            width:350
           }}
          placeholder="Last Name" placeholderTextColor="#3D8ABE" />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="mail" size={20} color="#3D8ABE" />
          <TextInput
          onChangeText={(value) => setEmail(value)}
          style={{
            padding:5,
            width:350
           }}
            keyboardType="email-address"
            placeholder="+233xxxxxxxxx"
            placeholderTextColor="#3D8ABE"
          />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="people" size={20} color="#3D8ABE" />
          <TextInput 
          onChangeText={(value) => setGender(value)}
          style={{
            padding:5,
            width:350
           }}
          placeholder="Gender" placeholderTextColor="#3D8ABE" />
        </View>
    <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
    <TouchableOpacity
           disabled={loading}
           onPress={saveUserDetails}
           style={styles.btn}
           >
            {loading? <ActivityIndicator 
         size={'large'}
         color="white"
         />:
         <Text
              style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                >
              Add Profile
            </Text>}
          </TouchableOpacity>
                </View>
      </View>
    </View>

  )
}

export default addProfile

const styles = StyleSheet.create({})