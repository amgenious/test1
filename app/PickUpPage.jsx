import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import { Ionicons } from "@expo/vector-icons";
import {  useRouter } from "expo-router";
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';

export default function PickUpPage() {
  const GOOGLE_MAPS_APIKEY = "AIzaSyBuTyyoR9Q3ZRhGjYkfobhPdTRurx1WABs";
  const navigation = useNavigation();
  const router = useRouter();
  const mapRef = useRef(null); // Ref for the MapView
  const [destinationname, setDestinationname] = useState();
  const [destinationlat, setDestinationlat] = useState();
  const [destinationlng, setDestinationlng] = useState();
  const [pickupname, setPickupname] = useState();
  const [pickuplat, setPickuplat] = useState();
  const [pickuplng, setPickuplng] = useState();
  const INITIAL_REGION = {
    latitude: 5.562989,
    longitude: -0.232909,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const coordinates = [
    {
      latitude: pickuplat || 0.0,
      longitude: pickuplng || 0.0
    },
    {
      latitude: destinationlat || 0.0,
      longitude: destinationlng || 0.0
    }
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
    if (destinationlat && destinationlng) {
      animateToLocation(destinationlat, destinationlng);
    }
  }, [destinationlat, destinationlng]);

  const handleNavigation = () => {
    router.push({
      pathname: "/ChooseVehicle",
      params: {
        destinationname: destinationname,
        destinationlat: destinationlat,
        destinationlng: destinationlng,
        pickupname: pickupname,
        pickuplat: pickuplat,
        pickuplng: pickuplng,
      },
    });
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
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
      </View>
      <View
        style={{
          position: "absolute",
          backgroundColor: "white",
          height: "auto",
          width: "100%",
          top: 60,
        }}
      >
        <View style={styles.inputandlogo}>
          <Ionicons name="home" size={20} color="#3D8ABE" style={{ marginTop: 10 }} />
          <GooglePlacesAutocomplete
            placeholder="Pick Up Location"
            minLength={2}
            autoFocus={true}
            returnKeyType={'search'}
            listViewDisplayed="auto"
            fetchDetails={true}
            onPress={(data, details) => {
              setPickupname(data.description);
              setPickuplat(details.geometry.location.lat);
              setPickuplng(details.geometry.location.lng);
            }}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'en',
              components: 'country:gh',
            }}
            styles={{
              textInput: styles.inputfield,
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
          />
        </View>
        <View style={styles.inputandlogo}>
          <Ionicons name="location" size={20} color="#3D8ABE" style={{ marginTop: 10 }} />
          <GooglePlacesAutocomplete
            placeholder="Destination"
            minLength={2}
            autoFocus={true}
            returnKeyType={'search'}
            listViewDisplayed="auto"
            fetchDetails={true}
            onPress={(data, details) => {
              setDestinationname(data.description);
              setDestinationlat(details.geometry.location.lat);
              setDestinationlng(details.geometry.location.lng);
            }}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'en',
              components: 'country:gh',
            }}
            styles={{
              textInput: styles.inputfield,
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
          />
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          backgroundColor: "white",
          height: 200,
          width: "100%",
          padding: 15,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            marginTop: 6,
          }}
        >
          <View
            style={{
              width: "50%",
            }}
          >
            <View
              style={{
                backgroundColor: "lightblue",
                padding: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 17,
                  color: "#3D8ABE",
                }}
              >
                Pick Up
              </Text>
            </View>
            <Text style={{ textAlign: "center" }}>{pickupname}</Text>
          </View>
          <View
            style={{
              width: "50%",
            }}
          >
            <View
              style={{
                backgroundColor: "lightblue",
                padding: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 17,
                  color: "#3D8ABE",
                }}
              >
                Destination
              </Text>
            </View>
            <Text style={{ textAlign: "center" }}>{destinationname}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleNavigation}
          style={{
            width: "100%",
            padding: 15,
            backgroundColor: "#3D8ABE",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 25,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Proceed
          </Text>
        </TouchableOpacity>
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
  inputandlogo: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 40,
    padding: 10,
    justifyContent: "center",
    alignContent: "center"
  },
  inputfield: {
    width: "80%",
    height: 45,
    borderWidth: 1,
    padding: 10,
    borderColor: "#3D8ABE",
    borderRadius: 10,
  },
});
