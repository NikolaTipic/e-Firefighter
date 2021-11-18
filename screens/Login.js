import React, {useState, useContext} from "react";
import { StatusBar } from 'expo-status-bar';

//formik
import { Formik } from "formik";

//icons
import{Octicons, Ionicons, Fontisto} from "@expo/vector-icons";

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    Colors,
    StyledButton,
    ButtonText,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent

} from "./../components/styles";
import { values } from "lodash";
import { View, ActivityIndicator } from "react-native";

//Colors
const {brand, darkLight, primary} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from "../components/keyboardAvoidingWrapper";

//API client
import axios from "axios";

import * as Google from "expo-google-app-auth";
import { use } from "ast-types";

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

export default function Login ({navigation}) {

    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleLogin = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://obscure-atoll-80604.herokuapp.com/user/signin";

        axios
        .post(url, credentials)
        .then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if(status !== "SUCCESS") {
                    handleMessage(message, status);
            } else {
                persistLogin({...data}, message, status);
            }
            setSubmitting(false);
        })
        .catch(error => {
            console.log(error.JSON());
            setSubmitting(false);
            handleMessage("An error occurred. Check your network and try again");
        })
    };

    const handleMessage = (message, type = "FAILED") => {
        setMessage(message);
        setMessageType(type);
    };

    const handleGoogleSignin = () => {
        setGoogleSubmitting(true);

        const config = {
            iosClientId: `717792648837-c3klqilpaqchunjm6qfjla8roqmk2q3h.apps.googleusercontent.com`, 
            androidClientId: `717792648837-hda01jmpgojrcrvq8uar6ccfvv1hr6lt.apps.googleusercontent.com`,
            scopes: ['profile', 'email']
        };

        Google
            .logInAsync(config)
            .then((result) => {
                const {type, user} = result;

                if(type == "success") {
                    const {email, name} = user;
                    persistLogin({email, name}, message, "SUCCESS");
                } else {
                    handleMessage("Google signin was cancelled");
                }

                setGoogleSubmitting(false);
            })
            .catch(error => {
                console.log(error);
                handleMessage("An error occurred. Check you Network and try again");
                setGoogleSubmitting(false);
            })
    };

    const persistLogin = (credentials, message, status) => {
        AsyncStorage.setItem("DVD", JSON.stringify(credentials))
        .then(() => {
            handleMessage(message, status);
            setStoredCredentials(credentials);
        })
        .catch((error) => {
            console.log(error);
            handleMessage("Persisting login failed");
        });
    };


    return(
    <KeyboardAvoidingWrapper>
        <StyledContainer logScr={true}>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageLogo source={require("./../assets/welcome.png")} />    
                <PageTitle>DVD Dugi rat</PageTitle>
                <SubTitle>Account Login</SubTitle>

                <Formik
                    initialValues={{email: "", password: ""}}
                    onSubmit={(values, {setSubmitting}) => {
                        if (values.email == "" || values.password == "") {
                            handleMessage("Please fill all the fields");
                            setSubmitting(false);
                        } else {
                            handleLogin(values, setSubmitting);
                        }
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                        <StyledFormArea>
                            <MyTextInput 
                                label="Email Address"
                                icon="mail"
                                placeholder="example@gmail.com"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                value={values.email}
                                keyboardType="email-address"
                            />

                            <MyTextInput 
                                label="Password"
                                icon="lock"
                                placeholder="* * * * * * * * *"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <MsgBox type={messageType}>{message}</MsgBox>

                            {!isSubmitting && (<StyledButton onPress={handleSubmit}>
                                <ButtonText>Login</ButtonText>
                            </StyledButton>
                            )}

                            {isSubmitting && (<StyledButton disabled={true}>
                                <ActivityIndicator size="large" color={primary} />
                            </StyledButton>
                            )}
                            <Line />
                            

                            {!googleSubmitting && (
                                <StyledButton google={true} onPress={handleGoogleSignin}>
                                    <Fontisto name="google" color={primary} size={25} />
                                    <ButtonText google={true}>Sign in with Google</ButtonText>
                                </StyledButton>)}
                            
                            {googleSubmitting && (
                                <StyledButton google={true} disabled = {true}>
                                    <ActivityIndicator size="large" color={primary} />
                                </StyledButton>
                            )}
                            <ExtraView>
                                <ExtraText>Don't have an account already? </ExtraText>
                                <TextLink onPress={() => navigation.navigate("Signup")}>
                                    <TextLinkContent>Signup</TextLinkContent>
                                </TextLink>
                            </ExtraView>
                        </StyledFormArea>)}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    </KeyboardAvoidingWrapper> 
    );
};

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)} >
                    <Ionicons name={hidePassword ? "md-eye-off" : "md-eye"} size={30} color={brand} />
                </RightIcon>
            )}
        </View>
    );
}