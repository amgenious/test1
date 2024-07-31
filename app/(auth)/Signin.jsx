import { StyleSheet, Text, TextInput, TouchableOpacity, View,  ToastAndroid,ActivityIndicator } from 'react-native'
import React,{useState} from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from "expo-router";
import { auth } from "./../../configs/FirebaseConfig";
import {signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signin = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const toggleSecureTextEntry = () => {
      setSecureTextEntry(!secureTextEntry);
    };
   
    const signinuser = async () => {
      setLoading(true)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        ToastAndroid.show("Sign in Successfully", ToastAndroid.LONG); 
        router.push("home")
        setLoading(false)
      } catch (error) {
        setLoading(false)
        ToastAndroid.show(error.message, ToastAndroid.LONG); 
      }
    };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Sign In</Text>
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
        <View style={styles.wrapper}>
          <Ionicons name="key" size={20} color="#3D8ABE" />
          <TextInput
            secureTextEntry={secureTextEntry}
            onChangeText={(value) => setPassword(value)}
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#3D8ABE"
          />
           <TouchableOpacity onPress={toggleSecureTextEntry} style={{ padding: 5,}}>
          <Ionicons 
            name={secureTextEntry ? "eye-off" : "eye"}
            size={20}
            color="#3D8ABE"
          />
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotPassword} onPress={()=>router.push('forgotpassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <TouchableOpacity onPress={signinuser} style={styles.signInButton}>
          {
            loading? <ActivityIndicator 
            size={'large'}
            color="white"
            />: <Text style={styles.signInButtonText}>Sign In</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('Signup')}>
            <Text style={styles.signupText}>Don't have an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Signin

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