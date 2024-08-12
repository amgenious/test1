import { StyleSheet,View,SafeAreaView,Dimensions } from 'react-native'
import React,{useEffect} from 'react'
import { useNavigation } from 'expo-router';
import GetBalance from '../../components/credits/getbalance'

const Credit = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle:'Solar Credit',
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
          }}>
 <GetBalance />
      </View>
    </SafeAreaView>
  )
}

export default Credit

const styles = StyleSheet.create({})