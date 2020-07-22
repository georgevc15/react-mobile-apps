import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';

export default function App() {

  const [courseGoals, setCourseGoals] = useState([]);



  const addGoalHandler = goalTitle => {
    setCourseGoals(currentGoals => [
      ...courseGoals, {key: Math.random().toString(), value: goalTitle}
    ]);
  }

  return (
    <View style={styles.screen}>
      <GoalInput onAddGoal={addGoalHandler}/>
      <FlatList 
      keyExtractor={(item, index) => item.key}
        data={courseGoals} 
        renderItem={itemData => <GoalItem onDelete={() => console.log('Delete element')} title={itemData.item.value} />}
          />
    </View>
  );
}

const styles = StyleSheet.create({
    screen: {
      padding: 50
    }

});
