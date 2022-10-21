import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-paper";
import { avatars } from "../../constants/Layout";
import { Task } from "../../data/APItypes";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { getUserTasks } from "../../store/slices/taskSlice";
import { store, useAppDispatch, useAppSelector } from "../../store/store";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function TaskOverviewScreen({
  navigation,
}: HouseholdScreenProps<"TaskOverviewScreen">) {
  //   const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  const taskData = useAppSelector((state) => state.tasks.householdTasks);
  // const taskData = state
  // const taskData = store.dispatch(getUserTasks());
  // console.log(taskData.toString());
  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          Task overview Screen
        </Text>
        {/* <Button title="Go back" onPress={() => navigation.goBack()} /> */}
        <View style={{ height: 500, width: "90%" }}>
          <FlatList
            style={{ flex: 1, width: "100%" }}
            data={taskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
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
            )}
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
      </View>
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
