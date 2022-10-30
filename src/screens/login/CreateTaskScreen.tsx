import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import RootStackNavigator, {
  RootScreenProps,
} from "../../navigation/RootStackNavigator";
import { avatarColors } from "../../constants/Colors";
import { getAllAvatars, getAvatar } from "../../constants/Layout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  createProfile,
  selectProfileById,
  setActiveProfile,
  updateProfile,
} from "../../store/slices/profileSlice";
import { Profile, ProfileDTO, Task } from "../../data/APItypes";
import {} from "../../store/slices/householdSlice";
import { Button, Menu, Divider, Provider, Appbar } from "react-native-paper";
import {
  createHouseholdTask,
  updateTask as updateHouseholdTask,
} from "../../store/slices/taskSlice";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateTask({
  navigation,
  route,
}: RootScreenProps<"CreateTask">) {
  const dispatch = useAppDispatch();
  //TODO route.params not optional?
  let baseProfile = useAppSelector((state) => state.profiles.activeProfile);
  let baseTask = useAppSelector((state) =>
    state.tasks.householdTasks.find((t) => t.id === route.params?.taskId)
  );

  if (!baseProfile) {
    //TODO 404
    return null;
  }
  let isEditing = false;
  if (baseTask === undefined) {
    isEditing = false;
  } else {
    isEditing = true;
  }

  let viewOnly = false;
  if (route.params?.viewOnly === undefined) {
    viewOnly = false;
  } else {
    viewOnly = true;
  }

  let startStateDesc = "";
  let startStateName = "";
  let startStateDiff = 1;
  let startStateFreq = 1;
  if (isEditing) {
    startStateName = baseTask!.name;
    startStateDesc = baseTask!.description;
    startStateDiff = baseTask!.difficulty;
    startStateFreq = baseTask!.frequency;
  }

  const [name, setName] = useState(startStateName);
  const [description, setDescription] = useState(startStateDesc);
  const [frequency, setFrequency] = useState(startStateFreq);
  const [difficulty, setdifficulty] = useState(startStateDiff);

  if (viewOnly === false) {
    return (
      <View style={styles.container}>
        <Text>Create Task Screen</Text>
        <Button onPress={() => navigation.goBack()}> Go Back</Button>

        <TextInput
          style={styles.input}
          onChangeText={(name) => setName(name)}
          placeholder="Name"
          defaultValue={name}
        ></TextInput>

        <TextInput
          style={styles.input}
          onChangeText={(description) => setDescription(description)}
          placeholder="Description"
          defaultValue={description}
        ></TextInput>

        <TextInput
          style={styles.input}
          onChangeText={(name) => setName(name)}
          placeholder="Diff"
          defaultValue={name}
        ></TextInput>

        <TextInput
          style={styles.input}
          onChangeText={(name) => setName(name)}
          placeholder="Freq"
          defaultValue={name}
        ></TextInput>

        <View>
          <Button
            onPress={async () => {
              // TODO
              let r = await choseDispatch();

              if (r.meta.requestStatus === "fulfilled") {
                navigation.replace("HouseholdTopTabNavigator", {
                  screen: "TaskOverviewScreen",
                });
              }
            }}
          >
            Submit
          </Button>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>View Task "Screen"</Text>
        <Button onPress={() => navigation.goBack()}> Go Back</Button>

        <Text>{name}</Text>
        <Text>{description}</Text>
        <Text>{difficulty}</Text>
        <Text>{frequency}</Text>

        <View>
          <Button
            onPress={async () => {
              navigation.replace("HouseholdTopTabNavigator", {
                screen: "TaskOverviewScreen",
              });
            }}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  async function choseDispatch() {
    if (isEditing) {
      let editedTask: Task = {
        id: baseTask!.id,
        householdId: baseTask!.householdId,
        isArchived: baseTask!.isArchived,
        img: baseTask?.img,
        voice: baseTask?.voice,

        description: description,
        name: name,
        frequency: frequency,
        difficulty: difficulty,
      };

      const r = await dispatch(
        updateHouseholdTask({
          task: editedTask,
        })
      );
      return r;
    } else {
      let createdTask: Task = {
        id: "",
        householdId: "",

        isArchived: false,
        img: baseTask?.img,
        voice: baseTask?.voice,

        description: description,
        name: name,
        frequency: frequency,
        difficulty: difficulty,
      };

      const r = await dispatch(createHouseholdTask(createdTask));
      return r;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    padding: 10,
    borderRadius: 50,
  },
  input: {
    color: "black",
    margin: 10,
  },
});
