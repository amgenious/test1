import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect,useState } from "react";
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import {onAuthStateChanged} from 'firebase/auth'
import Axios from "axios";
import {auth,db} from '../configs/FirebaseConfig'
import {
  collection,
  query,
  where,
  onSnapshot,
  doc, updateDoc,addDoc
} from "firebase/firestore";

const TopUpCredit=()=> {
    const navigation = useNavigation();
    const [amount, setAmount] = useState('')
    const [details, setDetails] = useState()
    const [gettingSelf, setGettingSelf] = useState(false)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('');
    const router =useRouter()
    useEffect(() => {
        navigation.setOptions({
          headerShown: true,
          headerTitle:'Top Up Credit'
        });
      }, []);
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
      const handlePress = async() => {
        if (amount.trim() === '') {
          ToastAndroid.show('Amount is required',ToastAndroid.LONG)  
        } else {
          setError('');
             const date = new Date();
             const clientRef = `${details.firstName}${details.lastName}${date.getTime()}`;
             Axios.post(
              "https://payproxyapi.hubtel.com/items/initiate",
              {
                totalAmount: amount,
                description: "Solar credit payment",
                callbackUrl:
                  "https://solar-taxi-services.appspot.com/api/v1/transactions/callback",
                returnUrl: "http://solartaxi.co",
                merchantAccountNumber: "89343",
                cancellationUrl: "http://solartaxi.co",
                clientReference: clientRef
              },
              {
                auth: {
                  username: "026rPJX",
                  password: "887ad3b11cc6478f8a4e14d42be86040"
                }
              }
             )
               .then(async response => {
                console.log(response)
                // try{
                //   await addDoc(collection(db, "transactions"), {
                //     timeStamps: serverTimestamp(),
                //     Status:"Success",
                //     uid: details.uid,
                //     data:response.data
                //   });
                // }catch(err){
                //   console.log(error)
                // }
          //        const docRef=query(collection(db, "passengers"),where("uid", "==",details.uid));
          //  await updateDoc(docRef,{
          //    clientReference: clientRef,
          //    solarCredit:amount
          //  })
               })
               .catch(err => {
                 console.log("error:" + err);
               });
           }
      };

  return (
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
      >Top Up Credit</Text>
        <View style={styles.wrapper}>
          <Ionicons name="cash" size={20} color="#3D8ABE" />
          <TextInput
            keyboardType="tel"
            placeholder="Enter Amount in GHs"
            placeholderTextColor="#3D8ABE"
            style={[styles.input, error ? styles.errorBorder : null]}
           onChangeText={(value) => setAmount(value)}
          />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
        <View
        style={{
            flexDirection:"column",
            alignItems:"center"
        }}
        >
            {
          gettingSelf ? <Text style={{
            display:'none'
          }}></Text> :
        <TouchableOpacity
        disabled={sending}
        onPress={handlePress} 
            style={{
                padding: 20,
                width: 300,
                backgroundColor: "#3D8ABE",
                borderRadius: 20,
                marginBottom: 20,
            }}
            >
                {
            sending ? <ActivityIndicator 
            size={"large"}
            color={'#3D8ABE'}
            />: <Text
              style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                >
              Buy Credits
            </Text>
            }
          </TouchableOpacity>
}
        </View>
      </View>
    </View>
  )
}

export default TopUpCredit

const styles = StyleSheet.create({
    wrapper: {
      height: 50,
      borderWidth: 1,
      padding: 10,
      borderColor: "#3D8ABE",
      borderRadius: 10,
      marginBottom: 10,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    input: {
      width: '90%',
    },
    errorBorder: {
      borderWidth:1,
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
  });