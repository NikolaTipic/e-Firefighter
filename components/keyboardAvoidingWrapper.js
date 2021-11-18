import React from "react";

//keyboards avoiding view
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Colors } from "./styles";

const {primary} = Colors;

export default function KeyboardAvoidingWrapper({children}) {
    return(
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: primary}} >
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}