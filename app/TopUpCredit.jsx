import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ToastAndroid, Button } from 'react-native'
import React, { useEffect,useState } from "react";
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import {onAuthStateChanged} from 'firebase/auth'
import {auth,db} from '../configs/FirebaseConfig'
import {
  collection,
  query,
  where,
  onSnapshot, updateDoc,getDocs,doc,
  addDoc,serverTimestamp
} from "firebase/firestore";
import {PayWithFlutterwave} from 'flutterwave-react-native';
const TopUpCredit=()=> {
    const navigation = useNavigation();
    const [amount, setAmount] = useState(0)
    const [details, setDetails] = useState()
    const [gettingSelf, setGettingSelf] = useState(true)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('');
    const [bigid, setBigid] = useState(null); 
    useEffect(() => {
        navigation.setOptions({
          headerShown: true,
          headerTitle:'Top Up Credit',
          headerTitleStyle: {
            color: '#3D8ABE', 
            fontSize: 30, 
            fontWeight: 'bold',
          },
          headerTintColor: '#FFB41A',
        });
      }, []);
      useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          const id = user.uid
          setBigid(id);
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
      const generateTransactionRef = (length) => {
        var result = '';
        var characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return `${result}`;
      };
      const handleOnRedirect = async (data) => {
        if (data.status == "cancelled"){
          try {
            await addDoc(collection(db, "transactions"), {
              createdAt: serverTimestamp(),
              status:data.status,
              userID:details.uid,
              amount:parseInt(amount),
              credit:0,
              data:{data}
            });
            ToastAndroid.show("Transaction cancelled", ToastAndroid.LONG);
          } catch (error) {
            console.log("Error adding document: ", error);
          }
        }else{
          try {
            await addDoc(collection(db, "transactions"), {
              createdAt: serverTimestamp(),
              status:data.status,
              userID:details.uid,
              amount: parseInt(amount),
              credit: parseInt(amount),
              data:{data}
            });
              const docQuery = query(collection(db, "passengers"), where("uid", "==", bigid));
              const querySnapshot = await getDocs(docQuery);
              querySnapshot.forEach(async (docSnapshot) => {
                const docRef = doc(db, "passengers", docSnapshot.id);
                const currentData = docSnapshot.data();
                const currentCredit = currentData.solarCredit ? parseInt(currentData.solarCredit) : 0;
                const updatedCredit = currentCredit + parseInt(amount);
                await updateDoc(docRef, {
                    solarCredit: updatedCredit,
                  });
                });
            console.log("Transaction Successfully");
            ToastAndroid.show("Transaction Successfully", ToastAndroid.LONG);
          } catch (error) {
            console.log("Error adding document: ", error);
          }
        }
      };
      const isAmountValid = amount !== '' && parseInt(amount) > 9;  
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
        {gettingSelf ? <ActivityIndicator 
        size={"large"}
        color={'#3D8ABE'}
        />
      : <View
      style={{
        padding: 10,
        width: "100%",
        paddingTop:30
      }}
      >
        <Text
        style={{
          fontWeight:"bold",
          fontSize:20,
          textAlign:"center",
          marginBottom:10,
          color:'#3D8ABE'
        }}
        >Please Enter an Amount from Ghc10 and above</Text>
        <View style={styles.wrapper}>
          <Ionicons name="cash" size={20} color="#3D8ABE" />
          <TextInput
            keyboardType="decimal-pad"
            placeholder="Enter Amount in GHc"
            placeholderTextColor="#3D8ABE"
            style={styles.input}
           onChangeText={(value) => setAmount(value)}
          />
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
        <PayWithFlutterwave
  onRedirect={handleOnRedirect}
  options={{
    tx_ref: generateTransactionRef(10),
    authorization: 'FLWPUBK_TEST-3b4f6d066955192f3617234c9eeea393-X',
    // authorization: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLISHABLE_KEY,
    customer: {
      email: details.email
    },
    amount: parseInt(amount),
    currency: 'GHS',
    payment_options: 'mobilemoneyghana'
  }}
  customButton={(props) => (
    <TouchableOpacity
    style={{
              padding: 20,
              width: 300,
              backgroundColor: isAmountValid ? '#3D8ABE' : '#9BBED1',
              borderRadius: 20,
              marginBottom: 20,
          }}
      onPress={props.onPress}
      isBusy={props.isInitializing}
      disabled={!isAmountValid || props.disabled}>
        <Text
              style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                >
              Buy Credits
            </Text>
    </TouchableOpacity>
  )}
/>
}
        </View>
        <Text
        style={{
          fontWeight:"bold",
          fontSize:20,
          textAlign:"center",
          marginTop:10,
          color:'#3D8ABE'
        }}
        >Please note Ghc 10 = 10 credits</Text>
      </View>
      }
    </View>
  )
}

export default TopUpCredit;

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
      height:'130%',
      paddingLeft:5,
    },
  })