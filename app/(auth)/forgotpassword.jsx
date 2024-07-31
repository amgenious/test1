import React,{useState} from 'react'
import {sendPasswordResetEmail } from "firebase/auth";
import { View, Text,TouchableOpacity, TextInput, ActivityIndicator, StyleSheet,ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from "expo-router";
import {auth} from "../../configs/FirebaseConfig"

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const getEmail =async()=>{
        setLoading(true)
        try{
            await sendPasswordResetEmail(auth,email)
            ToastAndroid.show('Reset Email sent',ToastAndroid.LONG)
            setLoading(false)
            router.push("Signin")
        }catch(error){
            setLoading(false)
            console.log(error)            
        }

    }
  return (
    <View style={styles.container}>
    <View style={styles.innerContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Forgot Password</Text>
      </View>
      <View style={styles.wrapper}>
        <Ionicons name="mail" size={20} color="#3D8ABE" />
        <TextInput
          onChangeText={(value) => setEmail(value)}
          style={styles.textInput}
          keyboardType="email-address"
          placeholder="example@gmail.com"
          placeholderTextColor="#3D8ABE"
        />
      </View>
    
      <View style={styles.center}>
        <TouchableOpacity style={styles.signInButton}
        onPress={getEmail}
        >
        {
          loading? <ActivityIndicator 
          size={'large'}
          color="white"
          />: <Text style={styles.signInButtonText}>Submit</Text>}
        </TouchableOpacity>
      </View>
    </View>
  </View>
)
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      },
      innerContainer: {
        padding: 10,
        width: "100%",
      },
      header: {
        alignItems: "center",
      },
      headerText: {
        color: "#3D8ABE",
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10,
      },
      wrapper: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderColor: "#3D8ABE",
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
      },
      textInput: {
        padding: 5,
        width: 300,
      },
      forgotPassword: {
        width: "100%",
      },
      forgotPasswordText: {
        color: "#FFB41A",
        fontSize: 15,
        textAlign: "right",
        marginBottom: 20,
      },
      center: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      signInButton: {
        padding: 20,
        width: 300,
        backgroundColor: "#3D8ABE",
        borderRadius: 20,
        marginBottom: 20,
      },
      signInButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
      },
      signupText: {
        color: "#FFB41A",
        fontSize: 15,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
      },
})