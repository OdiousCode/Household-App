import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { avatars } from "../../constants/Layout";
import { Task } from "../../data/APItypes";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { getUserTasks, selectHousHoldTasks } from "../../store/slices/taskSlice";
import { store, useAppDispatch, useAppSelector } from "../../store/store";
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
    }, []));



  const taskDataSelektor = useAppSelector(selectHousHoldTasks);
  const test = useAppSelector((p) => p.tasks.householdTasks)

  console.log(test, 'Test   SELEKTOR')
  console.log(taskDataSelektor)
  // const showAlert = () =>
  //   Alert.alert(
  //     taskData[0].name,
  //     taskData[0].description,
  //     [
  //       {
  //         text: "Arkivera",
  //         onPress: () => Alert.alert("Arkiverar syssla"),
  //         style: "cancel",
  //       },
  //       {
  //         text: "Markera som klar",
  //         onPress: () => Alert.alert("Syssla markerad som klar"),
  //         style: "destructive",
  //       },
  //     ],
  //     {
  //       cancelable: true,
  //       onDismiss: () => Alert.alert("Avbröt uppdatering av syssla"),
  //     }
  //   );
  // const taskData = state
  // const taskData = store.dispatch(getUserTasks());
  // console.log(taskData.toString());
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
            data={taskDataSelektor}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              !item.isArchived ? (
                <Card
                  onPress={() =>
                    Alert.alert(
                      item.name,
                      item.description,
                      [
                        {
                          text: "Arkivera",
                          onPress: () => {
                            Alert.alert('Arkiverar syssla "' + item.name + '"');
                            // Archive it smh
                          },
                        },
                        {
                          text: "Markera som klar",
                          onPress: () => {
                            Alert.alert(
                              'Syssla "' + item.name + '" markerad som klar'
                            );
                            // Mark as finished smh
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
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    {/* <View
                    key={avatars[0].icon}
                    style={{
                      backgroundColor: avatars[0].color,
                      padding: 3,
                      borderRadius: 50,
                    }}
                  > */}
                    <Text style={{ fontSize: 17 }}>
                      {avatars[0].icon}
                      {avatars[2].icon}
                      {avatars[3].icon}
                    </Text>
                    {/* </View> */}
                    {/* <Text>{item.description}</Text> */}
                    {/* <Text>Svårighetsgrad: {item.difficulty}</Text> */}
                  </View>
                </Card>
              ) : (
                <Text style={{ textDecorationLine: "line-through" }}>
                  {item.name} - arkiverad
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
