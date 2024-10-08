import { StyleSheet, Text, TouchableOpacity, View,Image, ActivityIndicator,ToastAndroid, Button } from "react-native";
import React,{useRef,useEffect,useState} from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter,useLocalSearchParams } from "expo-router";
import MapViewDirections from 'react-native-maps-directions';
import MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps';
import axios from 'axios';
import {onAuthStateChanged} from 'firebase/auth'
import {auth,db} from '../configs/FirebaseConfig'
import { RadioButton } from 'react-native-paper';
import { Rating } from 'react-native-ratings'
import {
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,addDoc
} from "firebase/firestore";

export default function ChooseVehicle() {
  const router = useRouter();
  const [rating,setRating] = useState(4);
  const [ratingLoad,setRatingLoad] = useState(false);
  const [cancelmodal,setCancelModal] = useState(false);
  const [solarCredits,setSolarCedits] = useState(null);
  const [unqueid,setUnqueid] = useState(null);
  const [firstName,setFirstName] = useState(null);
  const [lastName,setLastName] = useState(null);
  const [email,setEmail] = useState(null);
  const [phoneNumber,setPhoneNumber] = useState(null);
  const [profileImage,setProfileImage] = useState(null);
  const [searching,setSearching] = useState(false);
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [gettingSelf, setGettingSelf] = useState(false)
  const [drivers, setDrivers] = useState()
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [checked, setChecked] = useState('');
  const [model, setModal] = useState(false);
  const { destinationname, destinationlat, destinationlng, pickupname, pickuplat, pickuplng } = useLocalSearchParams();
  var list
  useEffect(() => {
  }, [destinationname, destinationlat, destinationlng, pickupname, pickuplat, pickuplng]);
  
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
      setSolarCedits(list.solarCredit)
      setUnqueid(list.uid)
      setFirstName(list.firstName)
      setLastName(list.lastName)
      setEmail(list.email)
      setProfileImage(list.profileImage)
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
  const GOOGLE_MAPS_APIKEY = "AIzaSyBuTyyoR9Q3ZRhGjYkfobhPdTRurx1WABs";
  const mapRef = useRef(null);
  const INITIAL_REGION={
    latitude:5.562989,
    longitude: -0.232909,
    latitudeDelta:0.0922,
    longitudeDelta:0.0421
  }
  const coordinates = [
    { latitude: parseFloat(pickuplat) || 0.0, longitude: parseFloat(pickuplng) || 0.0 },
    { latitude: parseFloat(destinationlat) || 0.0, longitude: parseFloat(destinationlng) || 0.0 },
  ];
  const animateToLocation = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: { latitude, longitude },
        zoom: 15,
        heading: 0,
        pitch: 0,
      }, { duration: 1000 });
    }
  };
  useEffect(() => {
    if (pickuplat && pickuplng) {
      animateToLocation(pickuplat, pickuplng);
    }
  }, [pickuplat, pickuplng]);

  useEffect(() => {
    if (pickuplat && pickuplng) {
      animateToLocation(parseFloat(pickuplat), parseFloat(pickuplng));
    }
  }, [pickuplat, pickuplng]);

  useEffect(() => {
    if (destinationlat && destinationlng) {
      animateToLocation(parseFloat(destinationlat), parseFloat(destinationlng));
    }
  }, [destinationlat, destinationlng]);

  useEffect(() => {
    const fetchDistanceAndDuration = async () => {
      const origin = { lat: pickuplat, lng: pickuplng };
      const destination = { lat: destinationlat, lng: destinationlng };

      const result = await getDistanceAndDuration(origin, destination);
      if (result) {
        setDistance(result.distance);
        setDuration(result.duration);
      }
    };

    fetchDistanceAndDuration();
  }, [pickuplat, pickuplng, destinationlat, destinationlng]);
  const getDistanceAndDuration = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${GOOGLE_MAPS_APIKEY}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.rows[0].elements[0].status === 'OK') {
        const distance = data.rows[0].elements[0].distance.text;
        const duration = data.rows[0].elements[0].duration.text;
        return { distance, duration };
      } else {
        console.error('Error fetching data from Google Maps API:', data.rows[0].elements[0].status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching data from Google Maps API:', error);
      return null;
    }
  };
 

const showcancelmodal = () =>{
  setCancelModal(true)
}
const hideshowcancelmodal = () =>{
  setCancelModal(false)
}
const canceltrip = () =>{
  ToastAndroid.show('Trip Cancelled',ToastAndroid.LONG)
       datatobase()
       setSearching(false);
       setSending(false);
       setCancelModal(false)
}
const checkpaidstatus = async()=>{
  if(checked === 'SolarCredit' && solarCredits < newprice){
    setModal(true)  
    console.log("passed here")
    setSending(false)
    setSearching(false);
  }
  else{
    goSolar()
  }
}
const newprice = parseFloat(distance) * parseFloat(duration)

  const goSolar =async ()=>{
    setSending(true)
    setSearching(true)
    }
    const loadingoff =()=>{
      // setRatingLoad(false)
    }
    const closemodal =()=>{
       setModal(false)
    }
    const datatobase = async()=>{
      setSending(true)
      try{
        await addDoc(collection(db,'passengerRequests'),{
          timeStamps: serverTimestamp(),
          clientID:unqueid,
          destination:{
            name:destinationname,
            location:{
              lat:destinationlat,
              lng:destinationlng
            }
          },
          origin:{
            name:pickupname,
            location:{
              lat:pickuplat,
              lng:pickuplng
            }
          },
          distance:distance,
          duration:duration,
          paymentMethod:checked,
          price: newprice,
          vehicleType:'SolarCar',
          requestStatus:'Trip Cancelled',
          statusInfo:[{
            createdAt:Date.now(),
            message:"No Driver Responed",
            status:"cancelled"
          }],
          userDetails:{
            email:email,
            firstName:firstName,
            lastName:lastName,
            phoneNumber:phoneNumber,
            profileImage:profileImage,
          },
          driverDetails:{
            id:"",
            name:"",
            phone:"",
            ratingCount:"",
            ratingSum:"",
            rides:"",
            vehicle:"",
          },
          driverId:"",
            })
            setSending(false)
            // setRatingLoad(true)
          }catch(error){
            setSending(false)
            console.log(error)
          }
    }
  return (
    <View style={styles.container}>
      <MapView style={styles.map}       
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      >
         {(coordinates[0].latitude != 0.0 && coordinates[0].longitude != 0.0) && (
        <Marker
          coordinate={coordinates[0]}
          title={pickupname || "Pick Up location"}
          description="Your pick up position"
        >
          <Image
            style={{
              width: 40, height: 40
            }}
            source={require("../assets/images/pic.png")}
          />
        </Marker>
        )}
        {(coordinates[1].latitude != 0.0 && coordinates[1].longitude != 0.0) && (
        <Marker
          coordinate={coordinates[1]}
          title={destinationname || "Destination"}
          description="Your destination"
        >
          <Image
            style={{
              width: 40, height: 40
            }}
            source={require("../assets/images/des.png")}
          />
        </Marker>
        )}
          {(pickuplat && pickuplng && destinationlat && destinationlng) && (
          <MapViewDirections
            origin={coordinates[0]}
            destination={coordinates[1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor='blue'
          />
        )}
      </MapView>
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={30} color="#3D8ABE" />
        </TouchableOpacity>
        <View style={{
          position: "absolute",
          zIndex: 10,
          padding: 10,
          marginTop: 20,
          marginRight: 10,
          backgroundColor:"white",
          right:0,
          borderRadius:10
        }}>
      <Text>Distance: {distance}</Text>
      <Text>Duration: {duration}</Text> 
    </View>
      </View>
     { searching ?
      <View style={{
        position: "absolute",
        zIndex: 15,
        height:"100%",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        padding:20
      }}>
          <View style={{
            backgroundColor:"white",
            width:"100%",
            height:"auto",
            padding:10,
            borderRadius:10
          }}>
          <View style={{
            position:"relative",
            width:"100%",
            display:"flex",
            flexDirection:"column",
            alignItems:"flex-end"
          }}>
            <TouchableOpacity
            onPress={showcancelmodal}
            >
              <Ionicons name="close" size={40} color="red"/>
            </TouchableOpacity>
          </View>
            <Ionicons name="search" size={50} color="#3D8ABE" style={{
              textAlign:"center",
              padding:10
            }} />
            <Text style={{
              textAlign:"center",
              fontSize:30,
              fontWeight:"bold",
              color:"#3D8ABE",marginBottom:10
            }}>Searching for Solar Taxi near you please wait</Text>
          </View>
      </View>:(
        <View style={{
          display:"none"
        }}></View>
      )
}
     { cancelmodal ?
      <View style={{
        position: "absolute",
        zIndex: 15,
        height:"100%",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        padding:20, 
      }}>
          <View style={{
            backgroundColor:"white",
            width:"100%",
            height:200,
            padding:5,
            borderRadius:10,
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
          }}>
            <Text style={{
              textAlign:"center",
              fontSize:30,
              fontWeight:"bold",
              color:"#3D8ABE",marginBottom:10,marginTop:20    
            }}>Do you want to cancel the trip?</Text>
            <View style={{
              display:"flex",
              flexDirection:"row",
              gap:30,
              width:"100%",
              justifyContent:"center",
              alignItems:"center",
              marginTop:5,
              marginBottom:10
            }}>
              <TouchableOpacity onPress={canceltrip}>
                <Text style={{fontSize:25,color:"#3D8ABE", fontWeight:"bold"}}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={hideshowcancelmodal}>
                  <Text style={{fontSize:25, color:"red", fontWeight:"bold"}}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
      </View>:(
        <View style={{
          display:"none"
        }}></View>
      )
}
     {/* 
     This commented code displays the popup for the user to rate the trip after the trip is done
     { ratingLoad ?
      <View style={{
        position: "absolute",
        zIndex: 15,
        height:"100%",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        padding:20
      }}>
          <View style={{
            backgroundColor:"white",
            width:"100%",
            height:"auto",
            padding:5,
            borderRadius:10
          }}>
            <Text style={{
              textAlign:"center",
              fontSize:30,
              fontWeight:"bold",
              color:"#3D8ABE",marginBottom:10
            }}>Please rate the ride?</Text>
            <Rating 
        showRating = {false}
        imageSize={20}
        onFinishRating={(rating) => setRating(rating)}
        style={{
            paddingVertical:10 
        }}
        />
            <Text style={{
              textAlign:"center",
              color:"#3D8ABE",
              fontSize:18,
              marginBottom:20
            }}>Swipe to Rate</Text>
           <TouchableOpacity
           onPress={loadingoff}
           >
            <Text style={{
              textAlign:"right",
              paddingRight:15,
              paddingBottom:15,
              color:"#3D8ABE",
              fontSize:16,
              fontWeight:"bold"
            }}>OK</Text>
            </TouchableOpacity>
          </View>
      </View>:(
        <View style={{
          display:"none"
        }}></View>
      )
} */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          backgroundColor: "white",
          height: 330,
          width: "100%",
          padding: 15,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#FFB41A",
            marginBottom: 5,
          }}
        >
          Choose Solar Taxi
        </Text>
        
            <View
          style={{
            width: 80,
            borderWidth: 1,
            borderRadius: 7,
            borderColor: "#3D8ABE",
            padding: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginRight:15,
          }}
        >
          <Ionicons name="car" size={50} color="#3D8ABE" />
          <Text style={{ color: "#3D8ABE" }}>Solar Car</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Ionicons name="person" size={15} color="#3D8ABE" />
            
          </View>
          <Text style={{ color: "#3D8ABE" }}>GHS {parseFloat(newprice)}</Text>
        </View>
           
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            paddingTop: 4,
            gap:10
         
          }}
        >
          <Ionicons name="cash" size={20} color="#FFB41A" />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: checked === 'SolarCredit' ? '#3D8ABE' : 'gray',
              borderRadius: 10,
              width:120
            }}
            >
              <RadioButton
           value="Solar Credit"
           status={checked === 'SolarCredit' ? 'checked' : 'unchecked'}
           onPress={() => setChecked('SolarCredit')}
          />
            <Text style={{  color: checked === 'SolarCredit' ? 'black' : 'white'  }}>Solar Credit</Text>
          </View>
          <View
            style={{
              width:80,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: checked === 'Cash' ? '#3D8ABE' : 'gray',
              borderRadius: 10,
            }}
            >
              <RadioButton
             value="Cash"
             status={checked === 'Cash' ? 'checked' : 'unchecked'}
             onPress={() => setChecked('Cash')}
            ></RadioButton>
            <Text style={{
               color: checked === 'Cash' ? 'black' : 'white' 
             }}>Cash</Text>
          </View>
        </View>
        {
          gettingSelf ? <Text style={{
            display:'none'
          }}></Text> :
        <TouchableOpacity
        disabled={sending}
        onPress={checkpaidstatus}
          style={{
            width: "100%",
            padding: 15,
            backgroundColor: "#3D8ABE",
            marginTop: 40,
          }}
        >
          {
            sending ? <ActivityIndicator 
            size={"large"}
            color={'green'}
            />:
          <Text
            style={{
              textAlign: "center",
              fontSize: 25,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Go Solar
          </Text>
          }
        </TouchableOpacity>
        }
        {
          model ? <View style={{position:"absolute", width:"108%", backgroundColor:"red", padding:5, bottom:130}}>
              <TouchableOpacity style={{marginBottom:2,}} onPress={closemodal}>
                <Ionicons style={{textAlign:"right"}} name="close" size={20} color="white" />
              </TouchableOpacity>
              <Text style={{color:"white", textAlign:"center", fontSize:18, fontWeight:"bold",marginBottom:5}}>Insufficent Solar Credits</Text>
              <View style={{display:"flex", justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity 
              onPress={()=>router.push("TopUpCredit")}
              style={{backgroundColor:"white", width:"25%", padding:10, borderRadius:10}}>
                <Text style={{textAlign:"center", fontSize:17}}>
                Buy Some
                </Text>
                </TouchableOpacity>
                </View>
          </View>
          :(
            <View style={{
              display:"none"
            }}></View>
          )
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
});
