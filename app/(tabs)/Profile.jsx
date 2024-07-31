import { StyleSheet, Text, TouchableOpacity, View,ToastAndroid, ActivityIndicator, Image } from 'react-native'
import React,{useState, useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from "firebase/auth";
import {auth,db} from "../../configs/FirebaseConfig"
import { onSnapshot } from 'firebase/firestore';
import {
  collection,
  query,
  where,
} from "firebase/firestore";


const Profile = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [FirstName, setFirstName] = useState('')
  const [userimge, setUserImageUrl] = useState()
  const [LastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const id = user.uid
      const q1 = query(collection(db, "passengers"),where("uid", "==", id));
      const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
     
          setLoading(true)
          snapShot.docs.forEach((doc) => {
            list=(doc.data())
          });
          if (list.imageUrl) {
            setUserImageUrl(list.imageUrl);
          }
          setEmail(list.email)
          setFirstName(list.firstName)
          setLastName(list.lastName)
          setGender(list.gender)
          setPhoneNumber(list.phoneNumber)
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
  const signout =async()=>{
    try{
      await signOut(auth).then(()=>{
        router.push("Signin")
      })
    }catch(error){
      ToastAndroid.show(error, ToastAndroid.LONG); 
    }
  }
  return (
    <View
    style={{
      display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        padding:10,
        position:"relative"
    }}>
      <Text style={{fontSize:30, fontWeight:"bold", color: "#3D8ABE",}}>Your Profile</Text>

      {
        loading ? <ActivityIndicator 
        size={'large'} color={"#FFB41A"}
        />:
      <View style={{marginTop:20,width:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',}}>
             {userimge ? (
        <View
          style={{
            width: 200,
            height: 200,
            borderRadius: 99,
            marginBottom: 20,
            overflow: 'hidden', 
          }}
        >
          <Image
            source={{ uri: userimge }}
            style={{
              width: 200,
              height: 200,
            }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View
          style={{
            width: 200,
            height: 200,
            borderRadius: 99,
            backgroundColor: "#FFB41A",
            marginBottom: 20,
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
            {FirstName}
          </Text>
        </View>
      )}
            <View style={styles.wrapper}>
            <Ionicons name="person" size={20} color="#3D8ABE" />
              <Text style={{fontSize:17,color: "#3D8ABE"}}>First Name: {FirstName}</Text>
            </View>
            <View style={styles.wrapper}>
            <Ionicons name="person" size={20} color="#3D8ABE" />
              <Text style={{fontSize:17,color: "#3D8ABE"}}>Last Name: {LastName}</Text>
            </View>
            <View style={styles.wrapper}>
            <Ionicons name="call" size={20} color="#3D8ABE" />
              <Text style={{fontSize:17,color: "#3D8ABE"}}>Phone Number: {phoneNumber} </Text>
            </View>
            <View style={styles.wrapper}>
            <Ionicons name="people" size={20} color="#3D8ABE" />
              <Text style={{fontSize:17,color: "#3D8ABE"}}>Gender: {gender}</Text>
            </View>
            <View style={styles.wrapper}>
            <Ionicons name="mail" size={20} color="#3D8ABE" />
              <Text style={{fontSize:17,color: "#3D8ABE"}}>Email: {email}</Text>
            </View>
      </View>
      }
      <View style={{
        position:"absolute",
        bottom:0,
        padding:10,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        width:"100%"
      }}>
        <TouchableOpacity
        onPress={signout}
         style={{display:'flex', flexDirection:"column", justifyContent:"center",alignItems:'center'}}>
          <Ionicons name="exit" size={24} color="#FFB41A" />
          <Text style={{fontSize:10, color:"#FFB41A"}}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={()=> router.push("/UpdateProfile")}
         style={{display:'flex', flexDirection:"column", justifyContent:"center",alignItems:'center'}}>
          <Ionicons name="person" size={24} color="#FFB41A" />
          <Text style={{fontSize:10, color:"#FFB41A"}}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    padding: 10,
    backgroundColor:"white",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
})