import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
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
  const [taskDifficulty, setTaskDifficulty] = useState("");
  const [taskFrequency, setTaskFrequency] = useState("");


  const tasko: Task = {
    description: taskDescription,
    difficulty: '1',
    frequency: '1',
    name: taskName,
    isArchived: false,
  }




  return (
    <View style={styles.container}>
      <Text>Signup</Text>
      <TextInput
        placeholder="Name"
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

      <Button
        title="Add task"
        onPress={() => dispatch(createHouseholdTask(tasko))}
      />



      {/* <Button title="Set name" onPress={() => dispatch(setName("David"))} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
