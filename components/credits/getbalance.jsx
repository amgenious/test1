import React,{useEffect,useState} from 'react';
import { useRouter } from 'expo-router'
import {onAuthStateChanged} from 'firebase/auth'
import {auth,db} from '../../configs/FirebaseConfig'
import {
    collection,
    query,
    where,
    onSnapshot,
  } from "firebase/firestore";
  import { StyleSheet, Text, View,TouchableOpacity, Image, ScrollView  } from 'react-native'
const GetBalance = () => {
    const router =useRouter()
    const [gettingSelf, setGettingSelf] = useState(false)
    const [details, setDetails] = useState()
    const [creditAmount, setCreditAmount] = useState()
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          const id = user.uid
          setGettingSelf(true)
          const q1 = query(collection(db, "passengers"),where("uid", "==", id));
          const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
            try{
              snapShot.docs.forEach((doc) => {
                list=(doc.data())
              });
              setDetails(list);
              setCreditAmount(details.solarCredit)
              setGettingSelf(false)
            }catch(error){
              setGettingSelf(false)
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View
 style={{
   display:'flex',
   flexDirection:'column',
   justifyContent:'center',
   alignItems:'center',
   padding:10,
   flex:1
 }}
 >
   <View
   style={{
     padding: 10,
     width: "100%",
     paddingTop:30
   }}
   >
   <Text
   style={{fontSize:30, fontWeight:"bold", color: "#3D8ABE", textAlign:"center",marginBottom:20}}
   > Solar Credit</Text>
           
       <View
         style={{
           marginTop:10,
           justifyContent: "center",
           alignItems: "center"
         }}
       >
         <View
           style={{
             width: "50%",
             paddingVertical: 10,
             borderWidth: 1,
             borderColor: "#1D88BA",
             backgroundColor: "white",
             borderRadius: 10,
             justifyContent: "center",
             alignItems: "center"
           }}
         >
           <Text style={styles.scp}>Credit</Text>
          
             <Text style={styles.credit}>
               {parseInt(creditAmount)}
             </Text>

         </View>
         <View
           style={{
             flexDirection: "column",
             marginTop: 30,
             alignItems: "center",
             paddingRight: 5,
             marginBottom:10
           }}
         >
           <Text
             style={{
               color: "#1D88BA",
               fontSize: 17,
               fontWeight: "bold",
               textAlign: "center",
               marginBottom:5
             
             }}
           >
             TOP UP USING
           </Text>
           <View>
              <Image
               source={require("../../assets/images/hubtel_payments.png")}
             /> 
           </View>
         </View>
         <TouchableOpacity
         onPress={()=>router.push("/TopUpCredit")}
         style={{
           padding: 20,
           width: 300,
           backgroundColor: "#3D8ABE",
           borderRadius: 20,
           marginTop: 15,
         }}
       >
         <Text
           style={{
             color: "white",
             fontSize: 20,
             fontWeight: "bold",
             textAlign: "center",
           }}
         >
            Top Up Credit here
         </Text>
       </TouchableOpacity>
       </View>
       <View style={{ marginTop:20 }}>
         <ScrollView
           contentContainerStyle={{
             paddingBottom: 20,
             width: "100%",
             paddingTop: 10,
             paddingHorizontal: 10
           }}
         >
         </ScrollView>
       </View>
       </View>
 </View>
 </View>
  )
}

export default GetBalance
const styles = StyleSheet.create({
    scp: {
        color: "#1D88BA",
        fontSize: 20,
        fontWeight: "bold"
      },
      credit: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#1D88BA"
      },
      tabText: {
        color: "#FDB201",
        fontSize: 20,
        fontWeight: "bold"
      }})