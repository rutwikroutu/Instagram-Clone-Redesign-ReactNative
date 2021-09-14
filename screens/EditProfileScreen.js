import React, { useLayoutEffect, useState } from 'react'
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import { Actionsheet, useDisclose } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { db } from '../firebase';

const Container = styled.ScrollView`
    flex: 1;
    background-color: #EFF2F8;
    padding: 20px;
    margin-bottom: 100px;
`

const Avatar = styled.Image`
  border-radius: 60px;
  height: 120px;
  width: 120px;
  margin-bottom: 5px;
`

const ChoosePhoto = styled.TouchableOpacity`
`

const Input = styled.TextInput`
    padding: 10px;
    width: 100%;
    background-color: #f7f8fa;
    border-radius: 10px;
    shadow-color: 'rgba(0,0,0,0.5)';
    shadow-radius: 15px;
    elevation: 15;
`

const InputWrapper = styled.View`
    width: 80%;
    flex-direction: column;
`

const EditProfileScreen = (params) => {
    const navigation = useNavigation();
    const user = params.route.params.user;
    const [fullName, setFullName] = React.useState(user.fullName);
    const [bio, setBio] = React.useState(user.bio);

    const { isOpen, onOpen, onClose } = useDisclose();

    const uploadAvatar = async (image) => {
        const response = await fetch(image)
        const blob = await response.blob();
        const uploadTask = storage.ref(`profilePics/${user.email}/avatar`).put(blob);
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
                    .ref(`profilePics/${user.email}`)
                    .child("avatar")
                    .getDownloadURL()
                    .then(url => {
                        db.collection("users").doc(authUser.displayName).update({
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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Edit Profile",
            headerStyle: {
                backgroundColor: '#EFF2F8',
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
                        <Entypo name="cross" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{ marginRight: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={updateProfile}>
                        <Feather name="check" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation, updateProfile, fullName, bio]);

    const updateProfile = () => {
        if (fullName == user.fullName && bio == user.bio) {
            navigation.goBack();
            return;
        }

        db.collection('users').doc(user.username).update({
            fullName: fullName,
            bio,
        });

        navigation.goBack();
    }

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
            >
                <Container contentContainerStyle={{ alignItems: 'center' }}>
                    <ChoosePhoto activeOpacity={0.5} onPress={onOpen}>
                        <View style={{
                            shadowColor: '#000',
                            shadowRadius: 5,
                            elevation: 15,
                            borderRadius: 50,
                            marginTop: 20,
                        }}>
                            <Avatar source={{ uri: user.avatar }} />
                        </View>
                    </ChoosePhoto>
                    <View style={{ marginTop: 30, flex: 1, width: '100%', alignItems: "center", flexDirection: 'column', paddingBottom: 30 }}>
                        <InputWrapper>
                            <Text style={{ margin: 10, marginLeft: 0 }}>Name</Text>
                            <Input placeholder="Full Name" value={fullName} onChangeText={(text) => setFullName(text)} />
                        </InputWrapper>
                        <InputWrapper>
                            <Text style={{ margin: 10, marginLeft: 0 }}>Username</Text>
                            <Input placeholder="Username" value={user.username} editable={false} />
                        </InputWrapper>

                        <InputWrapper>
                            <Text style={{ margin: 10, marginLeft: 0 }}>Bio</Text>
                            <Input numberOfLines={5} placeholder="Bio" value={bio} onChangeText={(text) => setBio(text)} multiline={true} style={{ textAlignVertical: "top" }} />
                        </InputWrapper>
                    </View>
                </Container>
                <Actionsheet isOpen={isOpen} onClose={onClose}>
                    <Actionsheet.Content>
                        <Actionsheet.Item onPress={choosePhotoFromLibrary}>Open Gallery</Actionsheet.Item>
                        <Actionsheet.Item onPress={onClose}>Cancel</Actionsheet.Item>
                    </Actionsheet.Content>
                </Actionsheet>
            </KeyboardAvoidingView>
        </>
    )
}

export default EditProfileScreen
