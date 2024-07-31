import React,{useEffect,useState} from 'react'
import { View,Text } from 'react-native'
import {onAuthStateChanged} from 'firebase/auth'
import {auth,db} from '../../configs/FirebaseConfig'
import {
    collection,
    query,
    where,
    onSnapshot,
  } from "firebase/firestore";

const GetTransactions = () => {
    const [gettingSelf, setGettingSelf] = useState(false)
    const [details, setDetails] = useState()
    const [transactions, setTransactions] = useState()
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          const id = user.uid
          setGettingSelf(true)
          const q1 = query(collection(db, "transactions"),where("uid", "==", id));
          const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
            try{
              snapShot.docs.forEach((doc) => {
                list=(doc.data())
              });
              setDetails(list);
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
        <Text style={{fontSize:18, fontWeight:"bold"}}>All Transactions</Text>
    </View>
  )
}

export default GetTransactions