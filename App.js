import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import SearchScreen from "./screens/SearchScreen";
import AddPostScreen from "./screens/AddPostScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import ProfileScreen from "./screens/ProfileScreen";
import SplashScreen from "./screens/SplashScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import ChatScreen from "./screens/ChatScreen";
import ChatsScreen from "./screens/ChatsScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { auth, db } from './firebase';
import { NativeBaseProvider } from 'native-base';
import { Image } from "react-native-elements";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState();
  const [user2, setUser2] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        db.collection('users').doc(authUser.displayName).onSnapshot(doc => {
          setUser2(doc.data())
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  function BottomStackScreen() {
    return (
      <Tab.Navigator
        screenOptions={
          ({ route }) => ({
            tabBarButton: [
              "UserProfileScreen",
            ].includes(route.name)
              ? () => {
                return null;
              }
              : undefined,
          })
        }
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarStyle: {
              height: 70,
              backgroundColor: "white",
              elevation: 5,
              borderTopWidth: 0,
              top: 1,
            },
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Entypo name="home" size={size} color="black" />
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          children={() => <SearchScreen username={user.displayName} />}
          options={{
            tabBarStyle: {
              height: 70,
              backgroundColor: "white",
              elevation: 5,
              borderTopWidth: 0,
              top: 1,
            },
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="search" size={size} color="black" />
            ),
          }}
        />

        <Tab.Screen
          name="Add"
          component={AddPostScreen}
          options={{
            tabBarStyle: {
              height: 70,
              backgroundColor: "white",
              elevation: 5,
              borderTopWidth: 0,
              top: 1,
            },
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <LinearGradient
                colors={["#515BD4", "#DD2A7B", "#FEDA77"]}
                start={[0, 1]}
                end={[1, 0]}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  bottom: 28,
                  width: 70,
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "black",
                  elevation: 8,
                  shadowOpacity: 0.6,
                  shadowOffset: { width: 2, height: 2 },
                }}
              >
                <Ionicons name="add-sharp" size={33} color="white" />
              </LinearGradient>
            ),
          }}
        />

        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            tabBarStyle: {
              height: 70,
              backgroundColor: "white",
              elevation: 5,
              borderTopWidth: 0,
              top: 1,
            },
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="heart" size={size} color="black" />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          children={() => <ProfileScreen username={user.displayName} user={user2} authUser={user} />}
          options={{
            tabBarStyle: {
              height: 70,
              backgroundColor: "white",
              elevation: 5,
              borderTopWidth: 0,
              top: 1,
            },
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Image source={{ uri: user2?.avatar }} style={{ height: 35, width: 35, borderRadius: 30, }} />
            ),
          }}
        />
        <Tab.Screen name="UserProfileScreen" component={UserProfileScreen} options={{
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 70,
            backgroundColor: "white",
            elevation: 5,
            borderTopWidth: 0,
            top: 1,
          },
        }} />
      </Tab.Navigator>
    )
  }

  const screenOptions = {
    ...TransitionPresets.SlideFromRightIOS,
  }
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
        >
          <Stack.Navigator initialRouteName="Splash" screenOptions={screenOptions}>
            <Stack.Screen name="Login" component={LoginScreen} options={{
              headerShown: false,
            }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{
              headerShown: false,
            }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="BottomStack" component={BottomStackScreen} options={{
              headerShown: false,
            }} />
            <Stack.Screen name="Splash" component={SplashScreen} options={{
              headerShown: false,
            }} />
          </Stack.Navigator>
        </KeyboardAvoidingView>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
