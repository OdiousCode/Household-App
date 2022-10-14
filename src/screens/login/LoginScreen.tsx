import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function LoginScreen({ navigation }: RootScreenProps<"Login">) {
  //   const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={() => navigation.navigate("Profile")} />
      <Button
        title="Create account"
        onPress={() => navigation.navigate("CreateAccount")}
      />
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
