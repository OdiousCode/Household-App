import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function TaskScreen({
  navigation,
}: HouseholdScreenProps<"TaskScreen">) {
  //   const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Task Screen</Text>
      {/* <Button
        title="Statistics"
        onPress={() =>
          navigation.navigate("HouseholdStackNavigator", {
            screen: "StatisticsScreen",
          })
        }
      />
      <Button
        title="Pending Applications"
        onPress={() =>
          navigation.navigate("HouseholdStackNavigator", {
            screen: "PendingApplicationScreen",
          })
        }
      />
      <Button
        title="Profile Overview"
        onPress={() =>
          navigation.navigate("HouseholdStackNavigator", {
            screen: "ProfileOverViewScreen",
          })
        }
      />
      <Button
        title="Task overview"
        onPress={() =>
          navigation.navigate("HouseholdStackNavigator", {
            screen: "TaskOverviewScreen",
          })
        }
      /> */}
      <Button title="Go back" onPress={() => navigation.goBack()} />

      {/* <Button title="Set name" onPress={() => dispatch(setName("David"))} /> */}
    </SafeAreaView>
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
