import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { getAvatar } from "../../constants/Layout";
import { SafeAreaView } from "react-native-safe-area-context";
import {} from "../../constants/Layout";
import { Household, Task, TaskHistory } from "../../data/APItypes";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import {
  createHouseholdTaskHistory,
  getUserTaskHistories,
  getUserTasks,
  selectActiveHouseholdTask,
  selectActiveHouseholdTaskHistories,
} from "../../store/slices/taskSlice";
import { store, useAppDispatch, useAppSelector } from "../../store/store";
import { date } from "yup/lib/locale";
import {
  getUserProfiles,
  selectProfileById,
} from "../../store/slices/profileSlice";
import CreateTask from "../login/CreateTaskScreen";
import {
  selectActiveHousehold,
  updateHousehold,
} from "../../store/slices/householdSlice";
import { removeListener } from "@reduxjs/toolkit";
import Dialog from "react-native-dialog";
import { string } from "yup";
export default function TaskOverviewScreen({
  navigation,
}: HouseholdScreenProps<"TaskOverviewScreen">) {
  const dispatch = useAppDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(getUserTasks());
      dispatch(getUserTaskHistories());
      dispatch(getUserProfiles());
    }, [])
  );

  const householdTasks = useAppSelector(selectActiveHouseholdTask);
  const allProfs = useAppSelector((p) => p.profiles.profiles);

  const householdTaskHistory = useAppSelector(
    selectActiveHouseholdTaskHistories
  );
  const activeProfile = useAppSelector((state) => state.profiles.activeProfile);
  householdTaskHistory.sort((a, b) => b.date - a.date);
  const activeHousehold = useAppSelector(selectActiveHousehold);
  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return date + "-" + month + "-" + year; //format: d-m-y;
  };

  let d = new Date();

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",

  ];
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };
  const [newHouseName, setHouseName] = useState("");
  const handleCancel = () => {
    setVisible(false);
  };
  const handleOk = (newName: string) => {
    Alert.alert("Change name to", newName);
    // let newHH = activeHousehold;
    let newHH: Household = {
      name: newName,
      id: activeHousehold!.id,
      entrenceCode: activeHousehold!.entrenceCode,
    };

    dispatch(updateHousehold({ household: newHH }));

    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    setVisible(false);
  };
  let day = weekday[d.getDay()];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
          Hello {activeProfile?.name}
        </Text>
        <Text style={styles.date}>
          {day}: {getCurrentDate()}
        </Text>
        {activeProfile?.role === "Admin" ? (
          <Pressable onPress={showDialog}>
            <Text style={styles.date}>New task: {activeHousehold?.name}</Text>
          </Pressable>
        ) : (
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}>
            New task: {activeHousehold?.name}
          </Text>
        )}
        <Dialog.Container visible={visible}>
          <Dialog.Title>Name changes for household</Dialog.Title>
          <Dialog.Description>What is your prefer name?</Dialog.Description>
          <Dialog.Input
            label="New name"
            onChangeText={(text: string) => {
              setHouseName(text);
            }}
          ></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Ok" onPress={() => handleOk(newHouseName)} />
        </Dialog.Container>
        {/* <Button title="Go back" onPress={() => navigation.goBack()} /> */}
        <View style={{ height: 500, width: "90%" }}>
          <FlatList
            style={{ flex: 1, width: "100%" }}
            data={householdTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: task }) => {
              let taskHistory = householdTaskHistory.find(
                (hth) => hth.taskId === task.id
              );

              let daysToMostRecent = "?";
              if (taskHistory) {
                let tempHolder = Math.ceil(
                  (taskHistory.date - Date.now()) / (1000 * 3600 * 24)
                );

                if (tempHolder === 0) {
                  daysToMostRecent = "Today";
                } else if (tempHolder == -1) {
                  daysToMostRecent = "Yesterday";
                } else if (tempHolder == -2) {
                  daysToMostRecent = "Before yesterday";
                } else {
                  daysToMostRecent = tempHolder.toString();
                }
              }

              let shouldBeDone = "0";
              if (taskHistory) {
                var whenTaskWasDone = taskHistory?.date;
                var numberOfDaysToAdd = task.frequency;
                let dateShouldBeDone =
                  whenTaskWasDone + numberOfDaysToAdd * 24 * 60 * 60 * 1000;

                let tempHolder = Math.ceil(
                  (dateShouldBeDone - Date.now()) / (1000 * 3600 * 24)
                );

                if (dateShouldBeDone < Date.now()) {
                  if (tempHolder === 0) {
                    shouldBeDone = "Today";
                  } else if (tempHolder == -1) {
                    shouldBeDone = "Yesterday";
                  } else if (tempHolder == -2) {
                    shouldBeDone = "Before yesterday";
                  } else {
                    shouldBeDone = tempHolder.toString();
                  }
                } else {
                  console.log(tempHolder);
                  if (tempHolder === 0) {
                    shouldBeDone = "idag";
                  } else if (tempHolder === 1) {
                    shouldBeDone = "Yesterday";
                  } else {
                    shouldBeDone = "+" + tempHolder.toString();
                  }
                }
              }

              let latestProfileDoneTask = getAvatar(-1).icon;
              if (taskHistory) {
                let tempHolder = allProfs.find(
                  (p) => p.id === taskHistory?.profileId
                );

                if (tempHolder) {
                  latestProfileDoneTask = getAvatar(tempHolder?.avatar).icon;
                }
              }

              return !task.isArchived ? (
                <Card
                  onPress={() => {
                    OnPressFunc(task);
                  }}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    borderColor: "#000",
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      margin: 10,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{task.name}</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {latestProfileDoneTask}
                      {daysToMostRecent}
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      Due:
                      {shouldBeDone}
                    </Text>
                  </View>
                </Card>
              ) : (
                <Text style={{ textDecorationLine: "line-through" }}>
                  {task.name} - active
                </Text>
              );
            }}
          />
        </View>
        {activeProfile?.role === "Admin" && (
          <View
            style={{
              position: "absolute",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              width: "100%",
              bottom: 0,
              padding: 10,
            }}
          >
            <Button
              icon="plus-circle-outline"
              mode="contained"
              buttonColor="#DCCFCF"
              textColor="#000"
              style={{ borderRadius: 4, borderWidth: 1, width: 150, backgroundColor: "#7DB2C5" }}
              onPress={() => {
                navigation.navigate("CreateTask");
              }}
            >
              Add
            </Button>
          </View>
        )}
      </SafeAreaView>
    </>
  );

  function OnPressFunc(task: Task) {
    {
      activeProfile?.role === "Admin"
        ? Alert.alert(
            task.name,
            task.description,
            [
              {
                text: "See more",
                onPress: () => {
                  navigation.navigate("CreateTask", {
                    taskId: task.id,
                    viewOnly: true,
                  });
                },
              },
              {
                text: "Change",
                onPress: () => {
                  navigation.navigate("CreateTask", { taskId: task.id });
                },
              },
              {
                text: "done?",
                onPress: async () => {
                  Alert.alert( task.name + '" completed');
                  let r = await dispatch(createHouseholdTaskHistory(task));
                },
              },
            ],
            {
              cancelable: true,
              onDismiss: () => Alert.alert("Cancel updating of new task"),

            }
          )
        : Alert.alert(
            task.name,
            task.description,
            [
              {
                text: "See more",
                onPress: () => {
                  navigation.navigate("CreateTask", {
                    taskId: task.id,
                    viewOnly: true,
                  });
                },
              },
              {
                text: "Done?",
                onPress: async () => {
                  Alert.alert(task.name + '" completed!');
                  let r = await dispatch(createHouseholdTaskHistory(task));
                },
              },
            ],
            {
              cancelable: true,
              onDismiss: () => Alert.alert("Cancel updating of new task"),

            }
          );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  date: {
    margin: 5
  }
});
