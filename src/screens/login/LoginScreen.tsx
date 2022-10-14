import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function LoginScreen() {
  //   const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);

  return (
    <View style={styles.container}>
      <Text>Task Screen</Text>
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
