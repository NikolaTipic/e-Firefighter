import React, {useContext} from "react";
import { StatusBar } from 'expo-status-bar';




//icons
import{Octicons, Ionicons, Fontisto} from "@expo/vector-icons";

import {

    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,  
    Line,   
    WelcomeContainer,
    WelcomeImage,
    Avatar

} from "./../components/styles";

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';


export default function Welcome () {

    

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {name, availability} = storedCredentials;

    const clearLogin = () => {
        AsyncStorage.removeItem("DVD")
        .then(() => {
            setStoredCredentials(null);
        })
        .catch(error => console.log(error));
    }

    return(
        <>
            <StatusBar style="dark" />
            <InnerContainer>
                    
                <WelcomeImage resizeMode="cover" source={require("./../assets/welcomeImage.jpg")} />

                <WelcomeContainer>
                    <PageTitle welcome={true}>Welcome Firefighter</PageTitle>
                    <SubTitle welcome={true}>{name || "Marin Carević"}</SubTitle>
                    
                    <StyledFormArea>
                        <Avatar resizeMode="cover" source={require("./../assets/welcome.png")} />
                        <Line />
                         <StyledButton onPress={clearLogin}>
                            <ButtonText>Logout</ButtonText>
                        </StyledButton>
                                
                                
                    </StyledFormArea>           
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};

