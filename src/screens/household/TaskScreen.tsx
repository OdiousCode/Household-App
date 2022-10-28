import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button } from "react-native-paper";
import { Task } from "../../data/APItypes";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { createHouseholdTask } from "../../store/slices/taskSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function TaskScreen({
  navigation,
}: HouseholdScreenProps<"TaskScreen">) {
  const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDifficulty, setTaskDifficulty] = useState('');
  const [taskFrequency, setTaskFrequency] = useState('');

  const tasko: Task = {
    id: '0',
    householdId: '0',
    description: taskDescription,
    difficulty: 0,
    frequency: 0,
    name: taskName,
    isArchived: false,
  }



  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Skapa en ny syssla</Text>

        <Text>Title</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Title"
          value={taskName}
          onChangeText={setTaskName}
        />
        <TextInput
          placeholder="Description"
          value={taskDescription}
          onChangeText={setTaskDescription}
        />

        <TextInput
          placeholder="Difficulty"
          value={taskDifficulty}
          onChangeText={setTaskDifficulty}
        />

        <TextInput
          placeholder="Frequency"
          value={taskFrequency}
          onChangeText={setTaskFrequency}
        />


        <View style={{
          position: "absolute",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          bottom: 25,
          padding: 10,
        }}>
          <Button
            icon="plus-circle-outline"
            mode="contained"
            buttonColor="#DCCFCF"
            textColor="#000"
            style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
            onPress={() => dispatch(createHouseholdTask(tasko))}
          >
            Spara
          </Button>
          <Button
            icon="close"
            mode="contained-tonal"
            buttonColor="#DCCFCF"
            style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
            onPress={() => navigation.navigate('TaskOverviewScreen')}
          >
            Stäng
          </Button>
        </View>

      </SafeAreaView >
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
  },
  nameInput: {
    margin: 10,
    backgroundColor: 'red',
    padding: 50,
  },
});
