import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-paper";
import { getAvatar } from "../../constants/Layout";
import { SafeAreaView } from "react-native-safe-area-context";
import {} from "../../constants/Layout";
import { Task, TaskHistory } from "../../data/APItypes";
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

  householdTaskHistory.sort((a, b) => a.date - b.date);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          Task overview Screen
        </Text>
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
                  daysToMostRecent = "Idag";
                } else if (tempHolder == -1) {
                  daysToMostRecent = "Igår";
                } else if (tempHolder == -2) {
                  daysToMostRecent = "Iförrgår";
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
                    shouldBeDone = "idag";
                  } else if (tempHolder == -1) {
                    shouldBeDone = "igårr";
                  } else if (tempHolder == -2) {
                    shouldBeDone = "iförrgår";
                  } else {
                    shouldBeDone = tempHolder.toString();
                  }
                } else {
                  console.log(tempHolder);
                  if (tempHolder === 0) {
                    shouldBeDone = "idag";
                  } else if (tempHolder === 1) {
                    shouldBeDone = "imorgon";
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
                  {task.name} - arkiverad
                </Text>
              );
            }}
          />
        </View>
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
            style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
            onPress={() => {
              navigation.navigate("CreateTask");
            }}
          >
            Lägg till
          </Button>
        </View>
      </SafeAreaView>
    </>
  );

  function OnPressFunc(task: Task) {
    Alert.alert(
      task.name,
      task.description,
      [
        {
          text: "Se mer",
          onPress: () => {
            navigation.navigate("CreateTask", {
              taskId: task.id,
              viewOnly: true,
            });
          },
        },
        {
          text: "Ändra",
          onPress: () => {
            navigation.navigate("CreateTask", { taskId: task.id });
          },
        },
        {
          text: "Markera som klar",
          onPress: async () => {
            Alert.alert('Syssla "' + task.name + '" avklarad!');
            let r = await dispatch(createHouseholdTaskHistory(task));
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => Alert.alert("Avbröt uppdatering av syssla"),
      }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
});
