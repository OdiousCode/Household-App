import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import {
  getHouseholdByEntrenceCode,
  setActiveHousehold,
} from "../../store/slices/householdSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function RoomApplication({
  navigation,
}: RootScreenProps<"RoomApplication">) {
  const dispatch = useAppDispatch();
  const [entrenceCode, setEntranceCode] = useState("");

  return (
    <View style={styles.container}>
      <Text>Room application Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />

      <Button
        title="Submit"
        onPress={() => {
          console.log("entrence code: " + entrenceCode);
          dispatch(setActiveHousehold(entrenceCode));
        }}
      />
      <TextInput
        style={styles.input}
        onChangeText={(code) => setEntranceCode(code)}
        placeholder="entrance code"
        value={entrenceCode}
      ></TextInput>
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
  input: {
    color: "black",
    margin: 10,
  },
});
