import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native';
import { StatusBar } from "expo-status-bar";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { auth, db } from '../firebase';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [fullName, setFullName] = useState('');
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

    const register = () => {
        setLoading(true);
        if (name.includes(" ")) {
            alert("Username should not contain spaces.");
            setName("");
            return;
        }
        db.collection("users").doc(name).get().then(doc => {
            if (doc.exists) {
                alert("The username already exists.");
                setName("");
                setLoading(false);
            } else {
                auth.createUserWithEmailAndPassword(email, password).then(authUser => {
                    authUser.user.updateProfile({
                        displayName: name,
                        photoURL: "https://firebasestorage.googleapis.com/v0/b/instagram-clone-cd10e.appspot.com/o/avatar.jpeg?alt=media&token=584fe601-cd79-4f7b-8ae2-c6eb684c546b",
                    })

                    db.collection("users").doc(name).set({
                        username: name,
                        fullName,
                        email,
                        avatar: "https://firebasestorage.googleapis.com/v0/b/instagram-clone-cd10e.appspot.com/o/avatar.jpeg?alt=media&token=584fe601-cd79-4f7b-8ae2-c6eb684c546b",
                        noOfFollowers: 0,
                        noOfPosts: 0,
                        noOfFollowing: 0,
                        bio: "",
                        isVerified: 0,
                    }).then(() => {
                        setLoading(false);
                        navigation.navigate("BottomStack");
                    })
                })
            }
        }).catch(err => alert(err))
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
                <TextInput style={styles.input} value={fullName} onChangeText={text => setFullName(text)} placeholder="Full Name" />
                <TextInput style={styles.input} value={name} onChangeText={text => setName(text)} placeholder="Username" />
                <TextInput style={styles.input} value={email} onChangeText={text => setEmail(text)} placeholder="Email" />
                <TextInput style={styles.input} secureTextEntry placeholder="Password" value={password} onChangeText={(text) => setPassword(text)} />
                <SubmitForm onPress={() => register()} disabled={!email || !password || !name || !fullName || loading ? true : false} style={{ opacity: !email || !password || !name || !fullName || loading ? 0.5 : 1 }} activeOpacity={0.5}><ButtonText>{loading ? "Loading..." : "Sign Up"}</ButtonText></SubmitForm>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("Login")}>
                    <RedirectText style={{ margin: 10 }}>Already have an account? <RedirectText style={{ color: "#2795F6" }}>Sign In.</RedirectText></RedirectText>
                </TouchableOpacity>
            </ScrollView>
        </>
    )
}

export default RegisterScreen


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