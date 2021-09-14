import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, } from "react-native";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { db } from "../firebase";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const SearchBox = styled.TextInput`
background-color: #efefef;
padding: 9px;
border-radius: 10px;
width: 78%;
margin-left: 20px;
`

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`

const ResultsWrapper = styled.View`
  flex: 1;
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
`

const Username = styled.Text`
  font-weight: bold;
  font-size: 15px;
`

const Name = styled.Text`
  color: grey;
`

const Avatar = styled.Image`
  border-radius: 50px;
  height: 70px;
  width: 70px;
  margin-right: 10px;
`

const SearchScreen = ({ username }) => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [results2, setResults2] = useState([]);

  useEffect(() => {
    var temp = [];
    db.collection('users').onSnapshot(snapshot => {
      snapshot.docs.map(doc => {
        if (doc.id != username) {
          temp.push(doc.data())
        }
      })
      setResults2(temp);
    })
  }, [])

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

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Container>
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 55, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <SearchBox placeholder="Search" value={search} onChangeText={text => setSearch(text)} />
          <TouchableOpacity activeOpacity={0.5} onPress={() => setSearch("")}>
            <Text style={{ margin: 10, }}>Cancel</Text>
          </TouchableOpacity>
        </View>
        {
          results2.length != 0 && (
            <ResultsWrapper>
              {
                results2.map((user, i) => (
                  <Result activeOpacity={0.5} key={user.username} onPress={() => {
                    navigation.navigate("UserProfileScreen", {
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
      </Container>
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
