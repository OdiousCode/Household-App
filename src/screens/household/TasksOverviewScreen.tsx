import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function TaskOverviewScreen({
  navigation,
}: HouseholdScreenProps<"TaskOverviewScreen">) {
  //   const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);

  return (
    <View style={styles.container}>
      <Text>Task overview Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />

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
