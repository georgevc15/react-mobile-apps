import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import DefaultStyles from '../constants/default-styles';
import BodyText from '../components/BodyText';
import MainButton from '../components/MainButton';

const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max - min)) + min;
    if(rndNum === exclude) {
        return generateRandomBetween(min, max, exclude);
    } else {
        return rndNum;
    }
}

const renderListItem = (listLenght, itemData) => (
    <View style={styles.listItem}>
        <BodyText>#{listLenght - itemData.index}</BodyText>
        <BodyText>{itemData.item}</BodyText>
</View>
);

const GameScreen = props => {
    const initialGuess = generateRandomBetween(1, 100, props.userChoice);
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
    const [ availableDeviceWidth, setAvailableDeviceWidth ] = useState(Dimensions.get('window').width);
    const [ availableDeviceWHeight, setAvailableDeviceHeight ] = useState(Dimensions.get('window').height);     
    
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

const { userChoice, onGameOver } = props;

useEffect(() => {
    const updateLayout = () => {
        setAvailableDeviceWidth(Dimensions.get('window').width);
        setAvailableDeviceHeight(Dimensions.get('window').height);
    };
    
    //cleanup function
    Dimensions.addEventListener('change',updateLayout);

    return () => {
        Dimensions.removeEventListener('change', updateLayout);
    };

});

useEffect(() => {
    if(currentGuess === userChoice) {
        onGameOver(pastGuesses.length);
    }
}, [currentGuess, userChoice, onGameOver]);


 const nextGuessHandler = direction => {
        if(
            (direction === 'lower' && currentGuess < props.userChoice) || 
            (direction === 'greater' && currentGuess > props.userChoice)
            ) {
              Alert.alert('The hint is wrong!', 'Your choise is wrong...', 
              [{ text: 'Cancel', style: 'cancel' }
            ]); 
            return; 
        }
        if (direction === 'lower') {
            currentHigh.current = currentGuess;
        } else {
            currentLow.current = currentGuess + 1;
        }
        const nextNumber = generateRandomBetween(
            currentLow.current, 
            currentHigh.current, 
            currentGuess
        );
        setCurrentGuess(nextNumber);
        //setRounds(curRounds => curRounds + 1);
        setPastGuesses(curPastGuesses => [nextNumber.toString(),...curPastGuesses]);
 };

if(availableDeviceWHeight < 350) {
   //do something
}

 if(availableDeviceWHeight < 500) {
     //return ();
 }

return (
    <View style={styles.screen}>
        <Text style={DefaultStyles.bodyText}>Opponent's Guess</Text>
        <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')} >
                    <Ionicons name="md-remove" size={24} color="white"/>
                </MainButton>
                <MainButton onPress={nextGuessHandler.bind(this, 'greater')} >
                <Ionicons name="md-add" size={24} color="white"/>
                </MainButton>
            </Card>
          <View style={styles.list}>  
           {/*
            <ScrollView>
                {pastGuesses.map((guess, index) => renderListItem(guess, pastGuesses.length - index))}
           </ScrollView>*/}
          <FlatList 
            keyExtractor={(item) => item} 
            data={pastGuesses} 
            renderItem={renderListItem.bind(this, pastGuesses.length)} 
            >

          </FlatList>
          
          </View>
    </View>
    );
 
};

const styles =  StyleSheet.create({
    screen: {
        flex: 1,
        padding: 1,
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Dimensions.get('window').height > 600 ? 20 : 5,
        width: 400,
        maxWidth: '80%'
    },
    listItem: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 15,
        marginVertical: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    list: {
        flex: 1, //important otherwise it does not scroll
        width: '80%'
    }
});

export default GameScreen;