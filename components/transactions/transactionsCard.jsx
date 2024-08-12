import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TransactionsCard = ({transactions}) => {
  const formatDate = (timestamp) =>{
    if (!timestamp) {
      return "Pending"; // Placeholder for when timestamp is null or undefined
    }
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      return date.toUTCString(); 
  };
  return (
    <View style={{
        width:"100%",
        padding:7,
        backgroundColor:"white",
        borderRadius:10,
        marginBottom:5
      }}>
        <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between",marginBottom:2}}>
              <Text style={{fontSize:17,}}>Ref id: {transactions.data.data.tx_ref}</Text>
              <Text style={{fontSize:17,backgroundColor:"#FFB41A",padding:3, borderRadius:5, color:"white"}}>Status: {transactions.status}</Text>
          </View>
              <Text style={{fontSize:17, backgroundColor:"green",padding:3, borderRadius:5, width:110,color:"white", marginBottom:5}}>Amount Paid: {transactions.amount}</Text>
              <Text style={{fontSize:17,backgroundColor:"#3D8ABE",padding:3,borderRadius:5, width:130,color:"white",marginBottom:5}}>Credits Obtained: {transactions.credit}</Text>
              <Text style={{fontSize:17,backgroundColor:"gray",padding:3,borderRadius:5, width:240,color:"white"}}>Date: {formatDate(transactions.createdAt)}</Text>
      </View>
  )
}

export default TransactionsCard

const styles = StyleSheet.create({})