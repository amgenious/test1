import React from 'react'
import { View,Text,Image } from 'react-native'

const GetallTrips = ({trips}) => {
  return (
    <View 
    style={{
      height: 189,
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom:5
    }}
    >
        <View
         style={{
          width: "100%",
          height: "60%",
          alignItems: "center",
          justifyContent: "center"
        }}
        >
          <Text style={{ color: "green", fontWeight: "bold",marginBottom:10 }}>Pickup: {trips.origin.name}</Text>
          <Text style={{ color: "#1D88BA", fontWeight: "bold" }}>Destination: {trips.destination.name}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginLeft: 15
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "#1D88BA", fontWeight: "bold" }}>
             Trip Vehicle {trips.vehicleType}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#1D88BA", fontSize: 12 }}>
                {"Powered by:"}
              </Text>
              <Image
                style={{ height: 30, width: 30, left: 0 }}
                source={require("../../assets/images/logo.png")}
              />
            </View>
          </View>
          <View style={{ right: 30, position: "absolute" }}>
            <Text style={{ color: "#1D88BA" }}>Price {trips.price}</Text>
            <Text
              style={{
                color: "#1D88BA",
                fontSize: 15,
                fontWeight: "bold"
              }}
            >
              {trips.paymentMethod}
            </Text>
          </View>
        </View>
          <View>
            <Text>Status: {trips.requestStatus}</Text>
          </View>
    </View>

  )
}

export default GetallTrips