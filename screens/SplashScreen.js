import React, { useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import { StatusBar } from "expo-status-bar";
import { auth } from '../firebase';

const SplashScreen = ({ navigation }) => {

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace("BottomStack")
            } else {
                navigation.replace("Login")
            }
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ height: 100, width: 100 }} source={{ uri: 'https://www.freepnglogos.com/uploads/instagram-logo-png-transparent-0.png' }} />
            </View>
        </>
    )
}

export default SplashScreen
