import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions } from 'react-native'
import React,{useEffect} from 'react'
import { useNavigation } from 'expo-router';
import GetTransactions from '../../components/credits/gettransactions'

const Transactions = () => {
    const navigation = useNavigation();
    useEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTitle:'All Transactions',
        headerTitleStyle: {
          color: '#3D8ABE', 
          fontSize: 30, 
          fontWeight: 'bold',
        },
      });
    }, []);
  return (
    <SafeAreaView>
      <View
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
            <GetTransactions />
        </View>
    </SafeAreaView>
  )
}

export default Transactions

const styles = StyleSheet.create({})