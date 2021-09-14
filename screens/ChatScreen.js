import React, { useLayoutEffect, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebase';

const NavContainerPart = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-right: 20px;
  align-items: center;
`;

const InputBoxWrapper = styled.View`
    flex: 1;
    position: absolute;
    bottom: 10;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const InputBox = styled.TextInput`
    width: 90%;
    height: 55px;
    padding: 10px;
    border-radius: 40px;
`

const InputBoxSend = styled.View`
border: 1px solid #ccc;
width: 90%;
height: 55px;
padding-left: 15px;
border-radius: 40px;
flex-direction: row;
align-items: center;
padding-right: 5px;
`

const ChatsWrapper = styled.ScrollView`
    flex: 1;
    margin-top: 10px;
    margin-bottom: 80px;
`

const Chat = styled.View`
    background-color: #E9E9E9;
    padding: 15px;
    border-radius: 40px;
    height: 50px;
    align-self: flex-start;
    justify-content: center;
    position: relative;
    right: 20px;
`

const ChatText = styled.Text`
    font-size: 17px;
    color: black;
`

const ChatWrapperRight = styled.View`
    height: 50px;
    width: 100%;
    justify-content: flex-end;
    flex-direction: row;
    margin-top: 10px;
`

const ChatWrapperLeft = styled.View`
    height: 50px;
    width: 100%;
    justify-content: flex-start;
    flex-direction: row;
    margin-top: 10px;
    margin-left: 50px;
`

const AvatarMessage = styled.Image`
height: 35px;
  width: 35px;
  z-index: 100;
  elevation: 10;
  border-radius: 50px;
  right: 110px;
  top: 25;
`

const ChatScreen = (params) => {
    const username = params.route.params.username;
    const [input, setInput] = useState('');
    const [chat, setChat] = useState();
    const [rUser, setRUser] = useState();
    const [mRef, setMRef] = useState();

    useEffect(() => {
        db.collection('users').doc(username).onSnapshot(doc => {
            setRUser(doc.data());
        })
    }, [])

    useLayoutEffect(() => {
        params.navigation.setOptions({
            title: username,
            headerTitleStyle: {
                fontSize: 21,
                marginLeft: 5,
            },
            headerStyle: {
                backgroundColor: '#EFF2F8',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerLeft: () => (
                <View style={{ marginLeft: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign name="arrowleft" size={30} color="black" style={{ marginTop: 5 }} onPress={() => {
                        params.navigation.goBack();
                    }} />
                </View>
            ),
            headerRight: () => (
                <NavContainerPart>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Feather name="video" size={30} color="black" style={{ margin: 10, marginLeft: 15, }} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}>
                        <MaterialCommunityIcons name="information-outline" size={30} color="black" style={{ margin: 5, marginLeft: 10, }} />
                    </TouchableOpacity>
                </NavContainerPart>
            ),
        });
    }, [params.navigation]);

    useEffect(() => {
        if (username > firebase.auth().currentUser.displayName) {
            db.collection('chats').doc(`${username}-${firebase.auth().currentUser.displayName}`).onSnapshot(doc => {
                setChat(doc.data())
                console.log(doc.data())
            })
        } else {
            db.collection('chats').doc(`${firebase.auth().currentUser.displayName}-${username}`).onSnapshot(doc => {
                setChat(doc.data())
            })
        }
    }, [username])

    const sendMessage = () => {
        if (input != '') {
            var list;
            if (chat == undefined) {
                list = []
            } else {
                list = chat.list;
            }
            list.push({ username: firebase.auth().currentUser.displayName, message: input });
            if (username > firebase.auth().currentUser.displayName) {
                db.collection('chats').doc(`${username}-${firebase.auth().currentUser.displayName}`).set({
                    list: list
                })
            } else {
                db.collection('chats').doc(`${firebase.auth().currentUser.displayName}-${username}`).set({
                    list: list
                })
            }
            setInput("")
        }
    }

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ChatsWrapper ref={ref => setMRef(ref)} onContentSizeChange={() => mRef.scrollToEnd({ animated: true })}>
                {
                    chat && chat.list.map((message, i) => {
                        if (message.username == firebase.auth().currentUser.displayName) {
                            return (
                                <ChatWrapperRight key={i}>
                                    <Chat><ChatText>{message.message}</ChatText></Chat>
                                </ChatWrapperRight>
                            )
                        } else {
                            return (
                                <ChatWrapperLeft key={i}>
                                    <Chat><ChatText>{message.message}</ChatText></Chat>
                                    <AvatarMessage source={{ uri: rUser.avatar }} />
                                </ChatWrapperLeft>
                            )
                        }
                    })
                }
            </ChatsWrapper>
            <InputBoxWrapper>
                <InputBoxSend>
                    <InputBox placeholder="Message..." value={input} onChangeText={e => setInput(e)} />
                    <TouchableOpacity activeOpacity={0.5} onPress={() => sendMessage()}>
                        <Ionicons name="send" size={25} color="black" />
                    </TouchableOpacity>
                </InputBoxSend>
            </InputBoxWrapper>
        </>
    )
}

export default ChatScreen
