import React from "react";

import { Colors } from "./../components/styles";
const {primary, brand} = Colors;

//react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';

const Stack = createNativeStackNavigator();

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const RootStack = () => {
    return(
       <CredentialsContext.Consumer>
           {({storedCredentials}) => {
               <NavigationContainer>
                 <Stack.Navigator
                   screenOptions={{
                       
                       headerShown: false,
                       headerTintColor: brand,
                       headerTitle: "",
                       headerShadowVisible: false,
                       
                   }}
                   initialRouteName="Login"
               >
                   {storedCredentials ? (
                       <Stack.Screen name="Welcome" component={Welcome} />
                   ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Signup" component={Signup} />
                    </>
                   )}          
                   
                 </Stack.Navigator>
                </NavigationContainer>
           }}
       </CredentialsContext.Consumer> 
        
    );
}

export default RootStack;