import { StyleSheet } from 'react-native'
import React,{useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,} from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useLocalSearchParams, useNavigation } from 'expo-router'
import GetBalance from '../../components/credits/getbalance';
import GetTransactions from '../../components/credits/gettransactions';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function BalanceScreen() {
  return (
   <GetBalance />
  );
}

function TransactionsScreen() {
  return (
  <GetTransactions />
  );
}

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Balance" component={BalanceScreen}/>
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  );
}

const Credit = () => {
  const navigation = useNavigation()
  const {category} = useLocalSearchParams()
  useEffect(() => {
    navigation.setOptions({
        headerShown:true,
        headerTitle:category
    })
  },[])
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs}  options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Credit

const styles = StyleSheet.create({
    scp: {
        color: "#1D88BA",
        fontSize: 20,
        fontWeight: "bold"
      },
      credit: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#1D88BA"
      },
      tabText: {
        color: "#FDB201",
        fontSize: 20,
        fontWeight: "bold"
      },
})