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
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function TaskOverviewScreen({
  navigation,
}: HouseholdScreenProps<"TaskOverviewScreen">) {
  const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  useFocusEffect(
    useCallback(() => {
      dispatch(getUserTasks());
      dispatch(getUserTaskHistories());
    }, [])
  );

  const householdTasks = useAppSelector(selectActiveHouseholdTask);
  const test = useAppSelector((p) => p.tasks.householdTasks);

  const householdTaskHistory = useAppSelector(
    selectActiveHouseholdTaskHistories
  );

  householdTaskHistory.sort((a, b) => a.date - b.date);
  console.log("All profileHisotries");
  console.log(householdTaskHistory);

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
            renderItem={({ item: task }) =>
              !task.isArchived ? (
                <Card
                  onPress={() =>
                    Alert.alert(
                      task.name,
                      task.description,
                      [
                        {
                          text: "Arkivera",
                          onPress: () => {
                            Alert.alert('Arkiverar syssla "' + task.name + '"');
                            // Archive it smh
                          },
                        },
                        {
                          text: "Markera som klar",
                          onPress: async () => {
                            Alert.alert(
                              'Syssla "' + task.name + '" markerad som klar'
                            );
                            // Mark as finished smh
                            let r = await dispatch(
                              createHouseholdTaskHistory(task)
                            );
                          },
                        },
                      ],
                      {
                        cancelable: true,
                        onDismiss: () =>
                          Alert.alert("Avbröt uppdatering av syssla"),
                      }
                    )
                  }
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
                      {/* Days between */}
                      {Math.ceil(
                        (householdTaskHistory.find(
                          (hth) => hth.taskId === task.id
                        )!.date -
                          Date.now()) /
                          (1000 * 3600 * 24)
                      )}
                    </Text>

                    <Text style={{ fontSize: 17 }}>
                      {getAvatar(0).icon}
                      {getAvatar(2).icon}
                      {getAvatar(3).icon}
                    </Text>
                    {/* </View> */}
                    {/* <Text>{item.description}</Text> */}
                    {/* <Text>Svårighetsgrad: {item.difficulty}</Text> */}
                  </View>
                </Card>
              ) : (
                <Text style={{ textDecorationLine: "line-through" }}>
                  {task.name} - arkiverad
                </Text>
              )
            }
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
            onPress={() => console.log("Pressed")}
          >
            Lägg till
          </Button>
          <Button
            icon="pencil"
            mode="contained-tonal"
            buttonColor="#DCCFCF"
            style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
            onPress={() => console.log("Pressed")}
          >
            Editera
          </Button>
        </View>
      </SafeAreaView>
      {/* <Button title="Set name" onPress={() => dispatch(setName("David"))} /> */}
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
});
