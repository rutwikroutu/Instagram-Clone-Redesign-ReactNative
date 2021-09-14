import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Touchable, TouchableOpacity, Image, Dimensions } from 'react-native'
import styled from 'styled-components/native';
import * as Font from "expo-font";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
} from 'react-native-reanimated';
import { Divider } from 'react-native-elements';

const PostCard = styled.View`
    height: 680px;
    width: 93%;
    margin: 10px;
    background-color: white;
    border-radius: 20px;
    padding: 8px;
    padding-top: 3px;
`

const PostCard__section1 = styled.View`
    justify-content: space-between;
    flex-direction: row;
    height: 80px;
    margin-bottom: 5px;
`

const PostCard__section2 = styled.View`

`

const PostCardContainer = styled.View`
    justify-content: center;
    align-items: center;
`

const Avatar = styled.Image`
    height: 57px;
    width: 57px;
    border-radius: 50px;
`

const PostImage = styled.ImageBackground`
    height: 400px;
    width: 100%;
    justify-content: center;
    align-items: center;
`

const SubText = styled.Text`
    color: #969696;
    font-family: "MilliardMedium";
    font-size: 13px;
`

const Username = styled.Text`
    color: black;
    font-family: "MilliardMedium";
    font-size: 15px;
`

const PostCard__section3 = styled.View`
    flex-direction: column;
    margin: 20px;
    margin-top: 13px;
`

const CommentCard = styled.View`
    flex-direction: row;
    align-items: center;
`

const CommentUser = styled.Text`
    color: black;
    font-family: "MilliardSemiBold";
    margin: 5px;
`

const CommentDescr = styled.Text`
    color: black;
`

const AnimatedImage = Animated.createAnimatedComponent(Image);

const Post = ({ image }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
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

    //Double Tap Animation
    const doubleTapRef = useRef();
    const scale = useSharedValue(0);
    const [tapGoing, setTapGoing] = useState(false);

    const rStyle = useAnimatedStyle(() => {
        'worklet'
        return {
            transform: [{ scale: Math.max(scale.value, 0) }],
        }
    });

    const onDoubleTap = useCallback(() => {
        scale.value = withSpring(1, undefined, (isFinished) => {
            if (isFinished) {
                scale.value = withDelay(200, withSpring(0));
            }
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return (
            <PostCardContainer>
                <PostCard>
                    <PostCard__section1>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar source={{ uri: "https://raw.githubusercontent.com/MarcusNg/flutter_instagram_feed_ui_redesign/master/assets/images/user0.png" }} />
                            <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 10 }}>
                                <Username>Rutwik Routu</Username>
                                <SubText>5 mins</SubText>
                            </View>
                        </View>
                    </PostCard__section1>
                    <PostCard__section2 style={{
                        shadowColor: '#000',
                        shadowRadius: 20,
                        elevation: 10,
                        borderRadius: 20,
                    }}>
                        <TapGestureHandler waitFor={doubleTapRef}>
                            <TapGestureHandler maxDelayMs={250} ref={doubleTapRef} numberOfTaps={2} onActivated={onDoubleTap}>
                                <Animated.View>
                                    <PostImage imageStyle={{ borderRadius: 20 }} source={{ uri: image }}>
                                        <AnimatedImage style={[
                                            {
                                                shadowOffset: { width: 0, height: 20 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 35,
                                                height: 110,
                                                width: 110
                                            },
                                            rStyle,
                                        ]} resizeMode={"center"} source={{ uri: "https://raw.githubusercontent.com/enzomanuelmangano/animate-with-reanimated/main/05-double-tap-gesture-handler/assets/heart.png" }} />
                                    </PostImage>
                                </Animated.View>
                            </TapGestureHandler>
                        </TapGestureHandler>
                    </PostCard__section2>
                    <PostCard__section3 style={{ marginLeft: 2 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity activeOpacity={0.5}>
                                <AntDesign name="hearto" size={27} color="black" style={{ marginRight: 19 }} />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5}>
                                <Ionicons name="chatbubble-outline" size={27} color="black" style={{ marginRight: 17 }} />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5}>
                                <Ionicons name="paper-plane-outline" size={27} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontFamily: "MilliardMedium", fontSize: 15, marginBottom: 5, marginTop: 5 }}>127,980,000 likes</Text>

                        <CommentCard>
                            <CommentUser>Rutwik Routu</CommentUser>
                            <CommentDescr>Shot on Canon 1DX Mark-II</CommentDescr>
                        </CommentCard>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                            <Divider orientation="horizontal" inset={true} insetType="middle" width={0.8} style={{ width: 70 }} />
                        </View>
                        <CommentCard>
                            <CommentUser>Elon Musk</CommentUser>
                            <CommentDescr>This is lit ! Nice ... Great duh !</CommentDescr>
                        </CommentCard>
                        <CommentCard>
                            <CommentUser>Elon Musk</CommentUser>
                            <CommentDescr>This is lit ! Nice ... Great duh !</CommentDescr>
                        </CommentCard>
                    </PostCard__section3>
                </PostCard>
            </PostCardContainer>
        )
    }
}

export default Post
