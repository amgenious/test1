import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TransactionsCard = ({transactions}) => {
  return (
    <View style={{
        borderColor:"#3D8ABE",
        borderWidth:1,
        width:"100%",
        padding:7,
        backgroundColor:"white",
        borderRadius:10
      }}>
        <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between",marginBottom:2}}>
              <Text style={{fontSize:17,}}>Ref id: </Text>
              <Text style={{fontSize:17,}}>Status: </Text>
          </View>
              <Text style={{fontSize:17,}}>Amount Paid: </Text>
              <Text style={{fontSize:17,}}>Credits Obtained: </Text>
              <Text style={{fontSize:17, marginTop:2}}>Date: </Text>
      </View>
  )
}

export default TransactionsCard

const styles = StyleSheet.create({})