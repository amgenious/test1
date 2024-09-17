import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, ToastAndroid,PermissionsAndroid,Alert } from 'react-native';
import React, { useState,useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { auth, db } from "./../../configs/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { serverTimestamp,setDoc,doc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  useEffect(() => {
    requestPhotosPermission()
  }, []);
  const requestPhotosPermission = async()=>{
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ])
    return granted;
  }
  const validateInputs = () => {
    if (!firstname || !lastname || !contact || !gender || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return false;
    }if(password.length < 6){
      Alert.alert('Password should be greater than 6');
      return false;
    }
    return true;
  };
  const createnewuser = async () => {
    if (validateInputs()){

      setLoading(true);
      console.log(firstname, lastname, gender, email, contact);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await addDetails(user.uid);
        ToastAndroid.show("Sign up Successfully", ToastAndroid.LONG);
        router.push("home");
      } catch (error) {
        setLoading(false);
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    }
  };

  const addDetails = async (uid) => {
    try {
      await setDoc(doc(db, "passengers", contact), {
        createdAt: serverTimestamp(),
        firstName: firstname,
        lastName: lastname,
        email: email,
        gender: gender,
        phoneNumber: contact,
        password: password,
        solarCredit: 0,
        uid: uid,
        tokens:{},
        verified:'false'
      });
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>Sign up</Text>

        <View style={styles.wrapper}>
          <Ionicons name="person" size={20} color="#3D8ABE" />
          <TextInput
            onChangeText={(value) => setFirstName(value)}
            style={styles.textInput}
            placeholder="First Name"
            placeholderTextColor="#3D8ABE"
          />
        </View>

        <View style={styles.wrapper}>
          <Ionicons name="person" size={20} color="#3D8ABE" />
          <TextInput
            onChangeText={(value) => setLastName(value)}
            style={styles.textInput}
            placeholder="Last Name"
            placeholderTextColor="#3D8ABE"
          />
        </View>

        <View style={styles.wrapper}>
          <Ionicons name="mail" size={20} color="#3D8ABE" />
          <TextInput
            onChangeText={(value) => setContact(value)}
            style={styles.textInput}
            keyboardType="numbers-and-punctuation"
            placeholder="+233xxxxxxxxx"
            placeholderTextColor="#3D8ABE"
          />
        </View>

        <View style={styles.wrapper}>
          <Ionicons name="people" size={20} color="#3D8ABE" />
          <TextInput
            onChangeText={(value) => setGender(value)}
            style={styles.textInput}
            placeholder="Gender"
            placeholderTextColor="#3D8ABE"
          />
        </View>

        <View style={styles.wrapper}>
          <Ionicons name="mail" size={20} color="#3D8ABE" />
          <TextInput
            onChangeText={(value) => setEmail(value)}
            style={styles.textInput}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#3D8ABE"
          />
        </View>

        <View style={styles.wrapper}>
          <Ionicons name="key" size={20} color="#3D8ABE" />
          <TextInput
            onChangeText={(value) => setPassword(value)}
            style={styles.textInput}
            secureTextEntry={secureTextEntry}
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

        <View style={styles.center}>
          <TouchableOpacity
            disabled={loading}
            onPress={createnewuser}
            style={styles.btn}
          >
            {loading ? (
              <ActivityIndicator size={'large'} color="white" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;

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
  center: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    padding: 20,
    width: 300,
    backgroundColor: "#3D8ABE",
    borderRadius: 20,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
