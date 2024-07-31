import {Image, View, StyleSheet, TouchableOpacity, Text, TextInput, ToastAndroid} from "react-native";
import React, { useEffect,useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {db,storage,auth} from "../configs/FirebaseConfig"
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  collection,
  query,
  where,
  updateDoc, onSnapshot,getDocs
} from "firebase/firestore";

const UpdateProfile=()=> {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [getloading, setGetLoading] = useState(false);

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const id = user.uid
      setUserId(id)
      const q1 = query(collection(db, "passengers"),where("uid", "==", id));
      const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
          setGetLoading(true)
          snapShot.docs.forEach((doc) => {
            list=(doc.data())
          });
      });
      return () => {
        unsubscribeSnapshot();
      };
})
return () => {
  unsubscribe();
};
  },[])
  const onImagePick =async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    setImageUri(result?.assets[0].uri)
    console.log(result);

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const onAddDetails =async()=>{
    setLoading(true)
    const fileName =Date.now().toString()+".jpg";
    const resp = await fetch(imageUri);
    const blob = await resp.blob()

    const imageRef = ref(storage,'UserImages/'+fileName);
    uploadBytes(imageRef,blob).then((snapShot)=>{
      console.log("file uploaded")
    }).then(resp =>{
      getDownloadURL(imageRef).then(async(downloadUrl) => {
        console.log(downloadUrl)
        saveDetails(downloadUrl)
      })
    })
    setLoading(false)
  }
  const saveDetails =async(imageUrl) => {
    try {
      // Query the collection to find the document with the specific userId
      const q1 = query(collection(db, "passengers"), where("uid", "==", userId));
  
      // Fetch the document snapshot from the query
      const querySnapshot = await getDocs(q1);
  
      if (!querySnapshot.empty) {
        // Assuming there is only one document per userId
        const docRef = querySnapshot.docs[0].ref;
  
        // Update the document with new data
        await updateDoc(docRef, {
          firstName: firstname,
          lastName: lastname,
          email: email,
          gender: gender,
          phoneNumber: contact,
          imageUrl: imageUrl,
        });
  
        ToastAndroid.show('Profile Updated', ToastAndroid.LONG);
        router.push("Profile");
      } else {
        ToastAndroid.show('No matching document found.', ToastAndroid.LONG);
      }
    } catch (err) {
      console.log(err);
      ToastAndroid.show('An Error Occurred: ' + err.message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle:'Update Profile'
    });
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 15,
      }}
    >
      <View
        style={{
          marginTop: 10,
          width: "100%",
        }}
      >
          <View style={styles.wrapper}>
          <Ionicons name="person" size={20} color="#3D8ABE" />
          <TextInput placeholder="First Name" placeholderTextColor="#3D8ABE" 
           onChangeText={(value) => setFirstName(value)}
          />
        </View>
       
        <View style={styles.wrapper}>
          <Ionicons name="person" size={20} color="#3D8ABE" />
          <TextInput placeholder="Last Name" placeholderTextColor="#3D8ABE" 
           onChangeText={(value) => setLastName(value)}
          />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="call" size={20} color="#3D8ABE" />
          <TextInput
            keyboardType="tel"
            placeholder="Phone Number"
            placeholderTextColor="#3D8ABE"
            onChangeText={(value) => setContact(value)}
          />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="people" size={20} color="#3D8ABE" />
          <TextInput placeholder="Gender" placeholderTextColor="#3D8ABE" 
           onChangeText={(value) => setGender(value)}
          />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="mail" size={20} color="#3D8ABE" />
          <TextInput
            keyboardType="email"
            placeholder="Email"
            placeholderTextColor="#3D8ABE"
            onChangeText={(value) => setEmail(value)}
          />
        </View>
       
         <View style={styles.container}>
      <TouchableOpacity onPress={onImagePick} 
      style={styles.input}
      >
        <Ionicons name="camera" size={20} color="#3D8ABE" />
        <Text
        style={{
          color:"#3D8ABE"
        }}
        >
        Pick an image from camera roll
        </Text>
      </TouchableOpacity>
     
    </View>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop:30
          }}
          >
        
          <TouchableOpacity
            onPress={onAddDetails}
            style={styles.btn}
            >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
              >
              Update Profile
            </Text>
          </TouchableOpacity>
        </View>
              {!imageUri ? <Ionicons name="image"  size={150}/>:<Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
  );
}

export default UpdateProfile;

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    padding: 10,
    borderWidth:1,
    borderColor:"#3D8ABE",
    backgroundColor:"white",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  container: {
    height: 50,
    padding: 10,
    borderWidth:1,
    borderColor:"#3D8ABE",
    backgroundColor:"white",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  image: {
    width: 200,
    height: 200,
    marginTop:5,
    borderRadius:20
  },
  input:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    gap:3
  },
  btn: {
    padding: 20,
    width: 300,
    backgroundColor: "#3D8ABE",
    borderRadius: 20,
    marginBottom: 20,
  },
})
