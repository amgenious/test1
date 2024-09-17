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

  const [previousFirstName, setPreviousFirstName] = useState('')
  const [previousLastName, setPreviousLastName] = useState('')
  const [previousgender, setPreviousGender] = useState('')
  const [previousphoneNumber, setPreviousPhoneNumber] = useState('')
  const [previousemail, setPreviousEmail] = useState('')
  const [userimge, setUserImageUrl] = useState('')

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
          setPreviousEmail(list.email)
          setPreviousFirstName(list.firstName)
          setPreviousLastName(list.lastName)
          setPreviousGender(list.gender)
          setPreviousPhoneNumber(list.phoneNumber)
          setUserImageUrl(list.profileImage);
          setLoading(false)
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
  const onAddDetails = async () => {
    try {
      setLoading(true);
      
      if (imageUri) {
        const fileName = Date.now().toString() + ".jpg";
        const resp = await fetch(imageUri);
        const blob = await resp.blob();
        const imageRef = ref(storage, 'UserImages/' + fileName);
        
        
        const snapShot = await uploadBytes(imageRef, blob);
        console.log("Image uploaded");
        
        
        const downloadUrl = await getDownloadURL(imageRef);
        await saveDetails(downloadUrl); 
      } else {
       
        await saveDetails(userimge); 
      }
      
    } catch (err) {
      console.error("Error updating profile:", err);
      ToastAndroid.show('An Error Occurred: ' + err.message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };
  
  const saveDetails = async (imageUrl) => {
    try {
      const q1 = query(collection(db, "passengers"), where("uid", "==", userId));
      const querySnapshot = await getDocs(q1);
  
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          firstName: firstname !== '' ? firstname : previousFirstName,
          lastName: lastname !== '' ? lastname : previousLastName,
          email: email !== '' ? email : previousemail,
          gender: gender !== '' ? gender : previousgender,
          phoneNumber: contact !== '' ? contact : previousphoneNumber,
          profileImage: imageUrl !== '' ? imageUrl : userimge, 
        });
  
        ToastAndroid.show('Profile Updated', ToastAndroid.LONG);
        router.push("Profile");
      } else {
        ToastAndroid.show('No matching document found.', ToastAndroid.LONG);
      }
    } catch (err) {
      console.error(err);
      ToastAndroid.show('An Error Occurred: ' + err.message, ToastAndroid.LONG);
    }
  };
  

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
       {userimge ? (
        <View
          style={{
            width: 'auto',
            height: 'auto',
            marginBottom: 10,
            overflow: 'hidden', 
            display:'flex',
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          <Image
            source={{ uri: userimge }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 99,
            }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View
          style={{
            width: 'auto',
            height: 'auto',
            marginBottom: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
          style={{
            width:100,
            height:100,
            borderRadius: 99,
            backgroundColor: "#FFB41A",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          >
          <Text
            style={{
              fontSize: 20,
              color: "white",
              fontWeight: "bold",
            }}
            >
            {previousFirstName}
          </Text>
            </View>
        </View>
      )}
          <View style={styles.wrapper}>
          <Ionicons name="person" size={20} color="#3D8ABE" />
          <TextInput placeholder={previousFirstName} placeholderTextColor="#3D8ABE" 
           onChangeText={(value) => setFirstName(value)}
           style={{width:"90%", height:50}}
          />
        </View>
       
        <View style={styles.wrapper}>
          <Ionicons name="person" size={20} color="#3D8ABE" />
          <TextInput placeholder={previousLastName} placeholderTextColor="#3D8ABE" 
           onChangeText={(value) => setLastName(value)}
           style={{width:"90%", height:50}}
          />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="call" size={20} color="#3D8ABE" />
          <TextInput
          style={{width:"90%", height:50}}
            keyboardType="numbers-and-punctuation"
            placeholder={previousphoneNumber}
            placeholderTextColor="#3D8ABE"
            onChangeText={(value) => setContact(value)}
          />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="people" size={20} color="#3D8ABE" />
          <TextInput placeholder={previousgender} placeholderTextColor="#3D8ABE"  
           onChangeText={(value) => setGender(value)}
           style={{width:"90%", height:50}}
          />
        </View>
        <View style={styles.wrapper}>
          <Ionicons name="mail" size={20} color="#3D8ABE" />
          <TextInput
            keyboardType="email"
            placeholder={previousemail}
            placeholderTextColor="#3D8ABE"
            onChangeText={(value) => setEmail(value)}
            style={{width:"90%", height:50}}
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
              {!imageUri ? <Ionicons name="image"  size={100}/>:<Image source={{ uri: imageUri }} style={styles.image} />}
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
    width: 100,
    height: 100,
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
