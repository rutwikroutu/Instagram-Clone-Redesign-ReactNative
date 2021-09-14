import React, { useLayoutEffect, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import Stories from "../components/Stories";
import styled from 'styled-components/native';
import Post from "../components/Post";
import firebase from 'firebase';
import { db } from "../firebase";

const Home = styled.ScrollView`
  flex: 1;
  background-color: #EFF2F8;
`

const Icon = styled.Image`
  width: 25px;
  height: 25px;
  margin: 10px;
  margin-right: 15px;
`;

const NavContainerPart = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-right: 20px;
`;

const HomeScreen = ({ navigation, route }) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: '#EFF2F8',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5}>
            <Image style={{ width: 130, height: 40 }} source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <NavContainerPart>
          <TouchableOpacity activeOpacity={0.5}>
            <Icon source={require("../assets/images/instagram-reels.png")} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ChatsScreen", { username: firebase.auth().currentUser.displayName })}>
            <Icon
              style={{ height: 29, width: 29, marginRight: 0 }}
              source={{
                uri:
                  "https://cdn.iconscout.com/icon/free/png-256/messenger-2999859-2492725.png",
              }}
            />
          </TouchableOpacity>
        </NavContainerPart>
      ),
    });
  }, [navigation]);

  const stories = [
    {
      name: "Rutwik Routu",
      image:
        "https://raw.githubusercontent.com/MarcusNg/flutter_instagram_feed_ui_redesign/master/assets/images/user0.png",
    },
    {
      name: "Elon Musk",
      image:
        "https://raw.githubusercontent.com/MarcusNg/flutter_instagram_feed_ui_redesign/master/assets/images/user1.png",
    },
    {
      name: "Steve Jobs",
      image:
        "https://raw.githubusercontent.com/MarcusNg/flutter_instagram_feed_ui_redesign/master/assets/images/user2.png",
    },
    {
      name: "Gordon Ramsay",
      image:
        "https://raw.githubusercontent.com/MarcusNg/flutter_instagram_feed_ui_redesign/master/assets/images/user3.png",
    },
    {
      name: "Andy Samberg",
      image:
        "https://raw.githubusercontent.com/MarcusNg/flutter_instagram_feed_ui_redesign/master/assets/images/user4.png",
    },
  ];

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Home>
        <Stories stories={stories} />
        <Post image="https://raw.githubusercontent.com/MarcusNg/flutter_instagram_feed_ui_redesign/master/assets/images/post0.jpg" />
      </Home>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
