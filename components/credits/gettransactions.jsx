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
    const [details, setDetails] = useState([])
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user){

            const id = user.uid
            setDetails([])
            setGettingSelf(true)
            const q1 = query(collection(db, "transactions"),where("userID", "==", id));
            const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
              try{
                const newDetails = snapShot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })); 
                setDetails(newDetails);
                setGettingSelf(false)
              }catch(error){
                setGettingSelf(false)
                console.log(error)
              }
            });
            return () => {
              unsubscribeSnapshot();
            };
          }else {
           
            setDetails(null); 
          }
              
        })
        return () => {
          unsubscribe();
        };
      },[])
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width:"100%",
          marginTop:10,
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
        style={{
          width:"100%",
        }}
        data={details}
        keyExtractor={(item) => item.id}
        renderItem={({item})=>(
          <TransactionsCard 
          transactions={item}
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