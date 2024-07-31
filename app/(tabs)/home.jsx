import MapView, {Marker } from 'react-native-maps';
import {  StyleSheet, Text,View,PermissionsAndroid, Dimensions, Image } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import React,{useEffect,useState} from 'react'
import {collection,query, where,onSnapshot, } from "firebase/firestore";
import {db} from "../../configs/FirebaseConfig"

const home = () => {
    const [data, setData] = useState([])
    const colRef = collection(db, "riders");
    const INITIAL_REGION={
        latitude:5.562989,
        longitude:-0.232909,
        latitudeDelta:0.0922,
        longitudeDelta:0.0421
      }
      useEffect(() => {
        requestloctionPermission()
        driversonline()
      }, []);
      const requestloctionPermission = async()=>{
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ])
        return granted;
      }

      const driversonline = async()=>{
        const q1 = query(
          colRef,
          where("status", "==", "online"),
          where("isActive", "==", true)
        );
        const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
          let list = [];
          snapShot.docs.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data().location });
          });
          setData(list);
        });
        return () => {
          unsubscribeSnapshot();
        };
      }
  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
      provider="google"
      initialRegion={INITIAL_REGION}
      >
         {data.map((item, index) => {
          if (item.geoLocation) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.geoLocation.lat,
                  longitude: item.geoLocation.long,
                }}
                title={item.name}
              >
                <Image 
                style={{
                  width:40,height:40
                }}
                source={require("../../assets/images/car.png")}
                />
              </Marker>
            );
          }
          return null;
        })}

       
      </MapView>
      <View style={{
        position:"absolute",
        bottom:0,
        backgroundColor:"white",
        height:200,
        width:"100%",
        padding:20
      }}>
      <Text
      style={{
        color: "#FFB41A",
        fontSize:17,
        marginBottom:15
      }}
      >Book a ride</Text>
      <Text
      style={{
        color: "#3D8ABE",
        fontSize:20,
        fontWeight:"bold",
        marginBottom:5
      }}>
        Where are you going to?
      </Text>
      <View style={styles.wrapper}>
        <Link style={{width:"100%",padding:5}} href="/PickUpPage">
          <Ionicons name="search" size={20} color="#3D8ABE" />
          </Link>
        </View>
      </View>
    </View>
  )
}

export default home

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
        flex: 1,
      },
      map: {
        ...StyleSheet.absoluteFillObject,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        flex:1
      },
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
})