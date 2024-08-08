import React,{useEffect,useState} from 'react'
import { View,Text, ActivityIndicator, FlatList } from 'react-native'
import {onAuthStateChanged} from 'firebase/auth'
import {auth,db} from '../../configs/FirebaseConfig'
import {
    collection,
    query,
    where,
    onSnapshot,
  } from "firebase/firestore";
import TransactionsCard from '../transactions/transactionsCard';

const GetTransactions = () => {
    const [gettingSelf, setGettingSelf] = useState(true)
    const [details, setDetails] = useState()
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          const id = user.uid
          setGettingSelf(true)
          const q1 = query(collection(db, "transactions"),where("userID", "==", id));
          const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
            try{
              snapShot.docs.forEach((doc) => {
                list=(doc.data())
              });
              setDetails(list);
              console.log(details)
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
        <Text style={{fontSize:25, fontWeight:"bold",textAlign:"center", color:"#3D8ABE"}}>All Transactions</Text>
        <View style={{
          width:"100%",
          marginTop:10
        }}>
          {
      gettingSelf ? 
      <ActivityIndicator 
      size={"large"}
      color={'#3D8ABE'}
      />:
      <View
      style={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        padding:10,
      }}
      >
        <FlatList 
        data={details}
        renderItem={({item,id})=>(
          <TransactionsCard 
          transactions={item}
          key={id}
          />
        )}
        />
      </View>
    }
        </View>
    </View>
  )
}

export default GetTransactions