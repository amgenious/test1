import { Image,StyleSheet, Text, View,ActivityIndicator,FlatList, } from 'react-native'

import {onAuthStateChanged} from 'firebase/auth'
import React,{useEffect,useState} from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {auth,db} from '../../configs/FirebaseConfig'
import GetallTrips from '../../components/trips/getalltrips';
const Trips = () => {
  const [details, setDetails] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const email = user.uid
      setDetails([])
  const q1 = query(collection(db,"passengerRequests"),where("clientID", "==", email));
  const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
    try{
      snapShot.docs.forEach((doc) => {
        setDetails(prev=>[...prev,{id:doc.id, ...doc.data()}])
      });   
      setLoading(false)
    }catch(error){
      setLoading(false)
      console.log(error)
    }
  });
  return () => {
    unsubscribeSnapshot();
  };
      
})
return () => {
  unsubscribe();
};
},[])
  return (
    <View
    style={{
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      flex:1,
      padding:10,
    }}
    >
      <Text
      style={{fontSize:30, fontWeight:"bold", color: "#3D8ABE",marginBottom:20}}
      >My Trips</Text>
     
      <View
       style={{
        padding: 10,
        width: "100%",
      }}
      >
        {
          loading ? 
          <ActivityIndicator 
          size={"large"}
          color={'#3D8ABE'}
          />
          :
          <FlatList 
          data={details}
          renderItem={({item,id})=>(
            <GetallTrips 
            trips={item}
            key={id}
            />
          )}
          />
 } 
      </View>
    </View>
  )
}

export default Trips

const styles = StyleSheet.create({})