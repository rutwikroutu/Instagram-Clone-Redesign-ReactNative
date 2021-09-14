import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native';
import { StatusBar } from "expo-status-bar";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const Logo = styled.Image`
        height: 70px;
        width: 200px;
    `

    const SubmitForm = styled.TouchableOpacity`
    width: 90%;
    height: 50px;
    color: white;
    border-radius: 5px;
    border: none;
    justify-content: center;
    align-items: center
    margin-top: 20px;
    background-color: #2795F6;
`
    const ButtonText = styled.Text`
	font-size: 15px;
    padding-left: 5px;
    color: white;
`

    const RedirectText = styled.Text`
    color: grey;
`

    const login = () => {
        setLoading(true);
        auth.signInWithEmailAndPassword(email, password).then(authUser => {
            navigation.navigate('BottomStack', { screen: 'Home' });
            setLoading(false);
        }).catch(err => alert(err.message))
    }

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView contentContainerStyle={styles.login} keyboardDismissMode='on-drag'>
                <Logo source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" }} />
                <TextInput style={styles.input} value={email} onChangeText={text => setEmail(text)} placeholder="Phone number, username, email" />
                <TextInput style={styles.input} secureTextEntry placeholder="Password" value={password} onChangeText={(text) => setPassword(text)} />
                <SubmitForm onPress={login} disabled={!email || !password || loading ? true : false} style={{ opacity: !email || !password || loading ? 0.5 : 1 }} activeOpacity={0.5}><ButtonText>{loading ? "Loading..." : "Log In"}</ButtonText></SubmitForm>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("Register")}>
                    <RedirectText style={{ margin: 10 }}>Don't have an account? <RedirectText style={{ color: "#2795F6" }}>Sign up.</RedirectText></RedirectText>
                </TouchableOpacity>
            </ScrollView>
        </>
    )
}

export default LoginScreen


const styles = StyleSheet.create({
    login: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        backgroundColor: '#FAFAFA',
        borderRadius: 5,
        padding: 10,
        borderColor: "#E5E5E5",
        borderWidth: 2,
        width: '90%',
        paddingTop: 15,
        paddingBottom: 15,
        marginTop: 10,
    }
})