import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { createHousehold } from "../../store/slices/householdSlice";
import { selectUser } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/store";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateHouseHoldScreen({
  navigation,
}: RootScreenProps<"CreateHousehold">) {
  const dispatch = useAppDispatch();


  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [entrenceCode, setEntranceCode] = useState('');


  const user = useSelector(selectUser);

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button
        title="Create Avatar"
        onPress={() => navigation.navigate("CreateAvatar")}
      />
      <Button
        title="Apply to room"
        onPress={() => navigation.navigate("RoomApplication")}
      />
      <Button
        title="Enter household"
        onPress={() =>
          navigation.navigate("HouseholdStackNavigator", {
            screen: "TaskScreen",
          })
        }
      />
        <TextInput
          style={styles.input}
          onChangeText={(name) => setName(name)}
          placeholder="name"
      ></TextInput>
      <TextInput
          style={styles.input}
          onChangeText={(code) => setEntranceCode(code)}
          placeholder="entrance code"
      ></TextInput>
       <TextInput
          style={styles.input}
          onChangeText={(id) => setId(id)}
          placeholder="id"
      ></TextInput>
       <Button
        title="Submit"
        onPress={() => dispatch(createHousehold({ name: name, entrenceCode: entrenceCode, id: id}))}
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
  input: {
    color: "black",
    margin: 10,
  },
});
