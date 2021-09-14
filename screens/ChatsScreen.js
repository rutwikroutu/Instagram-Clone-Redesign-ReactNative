import React, { useLayoutEffect, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import Stories from "../components/Stories";
import styled from 'styled-components/native';
import Post from "../components/Post";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import SearchScreen from "./SearchScreen";
import { db } from "../firebase";
import firebase from 'firebase';

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
  align-items: center;
`;

const SearchBox = styled.TextInput`
background-color: #efefef;
border-radius: 10px;
width: 90%;
`

const SearchSection = styled.View`
background-color: #efefef;
border-radius: 10px;
padding: 10px;
width :96%;
`

const SearchSectionWrapper = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
`

const NoMessagesHeading = styled.Text`
    text-align: center;
    color: black;
    font-size: 24px;
`

const NoMessagesDescription = styled.Text`
    text-align: center;
    color:grey;
    width: 85%;
    margin: 15px;
    margin-bottom: 5px;
    font-size: 15px;
`

const NoMessageWrapper = styled.View`
    flex: 1;
    margin-top: 20px;
    align-items: center;
`

const ResultsWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
`

const Result = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  padding: 5px;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: center;
  margin-bottom: 10px;
`

const Username = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-top: 0px;
`

const Name = styled.Text`
  color: grey;
`

const Avatar = styled.Image`
  border-radius: 50px;
  height: 65px;
  width: 65px;
  margin-right: 10px;
`


const ChatsScreen = ({ navigation, route }) => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [results2, setResults2] = useState([]);
    const username = firebase.auth().currentUser.displayName;
    const [dms, setDms] = useState([]);

    useEffect(() => {
        db.collection('chats').onSnapshot(snapshot => {
            var temp = [];
            setDms([]);
            snapshot.docs.map(doc => {
                if (doc.id.includes(username)) {
                    var split = doc.id.split("-");
                    var num = split.indexOf(username) == 0 ? 1 : 0;
                    db.collection('users').doc(split[num]).onSnapshot(doc2 => {
                        temp.push({ username: split[num], avatar: doc2.data().avatar, fullName: doc2.data().fullName })
                        setDms([...temp])
                    })
                }
            })
        })
    }, [setDms, username])

    useEffect(() => {
        var temp = []
        db.collection('users').onSnapshot(snapshot => {
            snapshot.docs.map(doc => {
                if (doc.id != username) {
                    temp.push(doc.data())
                }
            })
            setResults(temp);
        })

        if (results != undefined || results.length != []) {
            const finalResults = results.filter(result => {
                return result.username.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            })

            setResults2(finalResults);
        }
    }, [search])

    useLayoutEffect(() => {
        navigation.setOptions({
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
                        navigation.goBack();
                    }} />
                </View>
            ),
            headerRight: () => (
                <NavContainerPart>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Feather name="video" size={30} color="black" style={{ margin: 10, marginLeft: 15, }} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Ionicons name="ios-create-outline" size={30} color="black" style={{ margin: 5, marginLeft: 10, }} />
                    </TouchableOpacity>
                </NavContainerPart>
            ),
        });
    }, [navigation]);

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <SearchSectionWrapper>
                <SearchSection style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name="search" size={20} color="grey" style={{ margin: 0, marginRight: 10, marginLeft: 10, }} />
                    <SearchBox placeholder="Search" value={search} onChangeText={text => setSearch(text)} />
                </SearchSection>
            </SearchSectionWrapper>
            {
                search == '' ? (
                    dms ? (
                        <ResultsWrapper>
                            {
                                dms.map((user, i) => {
                                    return (
                                        <Result activeOpacity={0.5} key={user.username} onPress={() => {
                                            navigation.navigate("ChatScreen", {
                                                username: user.username,
                                            })
                                        }}>
                                            <Avatar source={{ uri: user.avatar }} />
                                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                                <Username>{user.username}</Username>
                                                <Name>{user.fullName}</Name>
                                            </View>
                                        </Result>
                                    )
                                })
                            }
                        </ResultsWrapper>
                    ) : (
                            <NoMessageWrapper>
                                <NoMessagesHeading>Message your friends</NoMessagesHeading>
                                <NoMessagesDescription>Message, video chat or share your favourite posts firectly with people you care about.</NoMessagesDescription>
                                <NoMessagesDescription>People who use Instagram or Facebook can chat across apps. Use the message controls in Settings to decide who you want to hear from.</NoMessagesDescription>
                                <TouchableOpacity activeOpacity={0.5}>
                                    <Text style={{ color: '#2794F6', fontWeight: '600', fontSize: 16, margin: 5 }}>Send Message</Text>
                                </TouchableOpacity>
                            </NoMessageWrapper>
                        )
                ) : (
                        <ResultsWrapper>
                            {
                                results2.map((user, i) => (
                                    <Result activeOpacity={0.5} key={user.username} onPress={() => {
                                        navigation.navigate("ChatScreen", {
                                            username: user.username,
                                        })
                                    }}>
                                        <Avatar source={{ uri: user.avatar }} />
                                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                                            <Username>{user.username}</Username>
                                            <Name>{user.fullName}</Name>
                                        </View>
                                    </Result>
                                ))
                            }
                        </ResultsWrapper>
                    )
            }

        </>
    );
};

export default ChatsScreen;
