import React, { useLayoutEffect, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import styled from 'styled-components/native';
import { db, storage, auth } from "../firebase";
import * as Font from "expo-font";
import * as ImagePicker from 'expo-image-picker';
import { Actionsheet, useDisclose } from 'native-base';
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from '@expo/vector-icons';

const Profile = styled.ScrollView`
flex: 1;
  background-color: #fff;
`;

const UserDetails = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const Avatar = styled.ImageBackground`
  border-radius: 50px;
  height: 100px;
  width: 100px;
  margin-bottom: 5px;
`

const UserFullName = styled.Text`
  text-align: center;
  font-family: "MilliardSemiBold";
  font-size: 18px;
`

const UserStats = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`

const UserStat = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const UserStatPrime = styled.Text`
  font-size: 20px;
  font-family: "MilliardSemiBold";
`

const UserStatSub = styled.Text`
  color: grey;
`

const Verified = styled.Image`
  height: 50px;
  width: 50px;
  z-index: 100;
  elevation: 10;
  right: -65px;
`

const ChoosePhoto = styled.TouchableOpacity`
  flex: 1;
`

const UserButtons = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding-left: 10px;
`

const UserButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 10px;
  margin-right: 10px;
  margin-top: 20px;
  padding: 7px;
`

const UserButtonText = styled.Text`
  color: black;
  font-weight: bold;
  text-align: center;
`

const UserBio = styled.Text`
  color: black;
  font-size: 15px;
  font-family: "MilliardLight";
  text-align: center;
  margin: 5px;
  line-height: 20px;
`

const ProfileScreen = ({ username, user, authUser, route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclose();

  const uploadAvatar = async (image) => {
    const response = await fetch(image)
    const blob = await response.blob();
    const uploadTask = storage.ref(`profilePics/${user?.email}/avatar`).put(blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref(`profilePics/${user?.email}`)
          .child("avatar")
          .getDownloadURL()
          .then(url => {
            db.collection("users").doc(authUser?.displayName).update({
              avatar: url
            })
          }
          )
      }
    )
  }

  const choosePhotoFromLibrary = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadAvatar(result.uri);
    }
  };

  useEffect(() => {
    console.log(user)
    loadFontAsync();
  }, []);

  const loadFontAsync = async () => {
    await Font.loadAsync({
      "Proxima": require("../assets/fonts/Proxima.ttf"),
      "ProximaBold": require("../assets/fonts/ProximaBold.ttf"),
      "ProximaMedium": require("../assets/fonts/ProximaMedium.ttf"),
      "MilliardLight": require("../assets/fonts/MilliardLight.otf"),
      "MilliardMedium": require("../assets/fonts/MilliardMedium.otf"),
      "MilliardSemiBold": require("../assets/fonts/MilliardSemiBold.otf"),
    });
    setLoading(false);
  };

  const signout = () => {
    auth.signOut();
    navigation.navigate("Splash");
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: username,
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        fontSize: 19,
      },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => signout()}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, signout]);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
      <Profile>
        <UserDetails>
          <ChoosePhoto activeOpacity={0.5} onPress={onOpen}>
            <View style={{
              shadowColor: '#000',
              shadowRadius: 5,
              elevation: 15,
              borderRadius: 50,
              marginTop: 20,
            }}>
              <Avatar source={{ uri: user?.avatar }} imageStyle={{ borderRadius: 50, }}>
                {
                  user?.isVerified == 1 && (
                    <Verified source={{ uri: "https://images.pngnice.com/download/2007/Instagram-Verified-Badge-PNG-Image.png" }} />
                  )
                }
              </Avatar>
            </View>
          </ChoosePhoto>
          <UserFullName>{user?.fullName}</UserFullName>
          <UserBio>{user?.bio}</UserBio>
          <UserStats>
            <UserStat activeOpacity={0.5}>
              <UserStatPrime>
                {user?.noOfPosts}
              </UserStatPrime>
              <UserStatSub>
                Posts
              </UserStatSub>
            </UserStat>
            <UserStat activeOpacity={0.5}>
              <UserStatPrime>
                {user?.noOfFollowers}
              </UserStatPrime>
              <UserStatSub>
                Followers
              </UserStatSub>
            </UserStat>
            <UserStat activeOpacity={0.5}>
              <UserStatPrime>
                {user?.noOfFollowing}
              </UserStatPrime>
              <UserStatSub>
                Following
              </UserStatSub>
            </UserStat>
          </UserStats>
        </UserDetails>
        <UserButtons>
          {
            user?.email == authUser.email ? (
              <UserButton onPress={() => {
                navigation.navigate("EditProfile", { user: user })
              }} activeOpacity={0.5} style={{ flex: 0.9, paddingTop: 8, paddingBottom: 8, paddingLeft: 40, paddingRight: 40 }}><UserButtonText>Edit Profile</UserButtonText></UserButton>
            ) : (
                <UserButton activeOpacity={0.5} style={{ backgroundColor: "#3BA0F2", borderWidth: 0, paddingTop: 8, paddingBottom: 8, paddingLeft: 50, paddingRight: 50 }}><UserButtonText style={{ color: "white" }}>Follow</UserButtonText></UserButton>
              )
          }
          {
            user?.email != authUser?.email && (
              <UserButton activeOpacity={0.5} style={{ paddingLeft: 40, paddingRight: 40 }}><UserButtonText>Message</UserButtonText></UserButton>
            )
          }
          <UserButton activeOpacity={0.5} style={{ padding: 3 }}><MaterialIcons name="keyboard-arrow-down" size={20} color="black" /></UserButton>
        </UserButtons>
      </Profile>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={choosePhotoFromLibrary}>Open Gallery</Actionsheet.Item>
          <Actionsheet.Item onPress={onClose}>Cancel</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
