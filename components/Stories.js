import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import * as Font from "expo-font";

const StoriesScroll = styled.ScrollView`
  padding-left: 15px;
  margin-top: 5px;
`;

const Avatar = styled.Image`
  height: 74px;
  width: 74px;
  border-radius: 50px;
  margin: 5px;
`;

const AvatarText = styled.Text`
  color: black;
  font-size: 13.5px;
  font-family: "ProximaMedium";
  
`;

const AvatarConainer = styled.TouchableOpacity`
  width: 90px;
  justify-content: center;
  align-items: center;
  margin: 7px;
  margin-top: 0px;
  margin-left: 0px;
`;

const Stories = ({ stories }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadFontAsync();
  }, []);

  const loadFontAsync = async () => {
    await Font.loadAsync({
      "Proxima": require("../assets/fonts/Proxima.ttf"),
      "ProximaMedium": require("../assets/fonts/ProximaMedium.ttf"),
      "ProximaBold": require("../assets/fonts/ProximaBold.ttf"),
    });
    setLoading(false);
  };

  if (loading) {
    return null;
  } else {
    return (
      <StoriesScroll horizontal showsHorizontalScrollIndicator={false}>
        {stories.map((story, key) => (
          <AvatarConainer activeOpacity={0.5} key={key}>
            <Avatar source={{ uri: story.image }} />
            <AvatarText numberOfLines={1}>{story.name}</AvatarText>
          </AvatarConainer>
        ))}
      </StoriesScroll>
    );
  }
};

export default Stories;
