import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Button, 
    Image, 
    Dimensions,
    ScrollView
} from 'react-native';

import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';
import MainButton from '../components/MainButton';
import colors from '../constants/colors';

const GameOverScreen = props => {
    return (
    <ScrollView>
     <View style={styles.screen}>
        <BodyText>The Game is over! </BodyText>
        <TitleText>Number of rounds: {props.roundsNumber}</TitleText>
           
           <View style={styles.imageContainer}> 
               <Image 
               fadeDuration={2000}
               source={require('../assets/success.png')} 
               //source={{uri:  'https://www.solcreation.ro/wp-content/uploads/2015/02/seo-sem.jpg'}} 
               style={styles.image}
               resizeMode="cover"/>
            </View>

    <View style={styles.resultContainer}>
        <BodyText style={styles.resultText}>Yout phone needed 
            <Text style={styles.highlight}> {props.roundsNumber} </Text>rounds 
                to guess the number 
                <Text style={styles.highlight}> {props.userNumber} </Text>
        </BodyText>
    </View>

        <MainButton onPress={props.onRestart}>New Game</MainButton>
    </View>
 </ScrollView>
     )
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    imageContainer: {
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        borderRadius: Dimensions.get('window').width * 0.7 / 2, //should be half of the width and height
        borderWidth: 5,
        borderColor: 'black',
        overflow: 'hidden',
        marginVertical: Dimensions.get('window').height / 30
    },
    image: {
        width: '100%',
        height: '100%'
    },
    resultContainer: {
        marginHorizontal: 30,
        marginVertical: Dimensions.get('window').height / 60
    },
    resultText: {
        textAlign: 'center',
        fontSize: Dimensions.get('window').height < 400 ? 16 : 20
    },
    highlight: {
        color: colors.primary,
        fontFamily: 'open-sans-bold'
    }
});

export default GameOverScreen; 