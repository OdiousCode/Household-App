import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { Household, Profile, ProfileDTO } from "../../data/APItypes";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import {
  createHousehold,
  getUserHouseholds,
} from "../../store/slices/householdSlice";
import { createProfile } from "../../store/slices/profileSlice";
import { selectUser } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/store";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateHouseHoldScreen({
  navigation,
}: RootScreenProps<"CreateHousehold">) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [entrenceCode, setEntranceCode] = useState("");

  const user = useSelector(selectUser);

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>

      <Button
        title="Apply to room"
        onPress={() => navigation.navigate("RoomApplication")}
      />
      <Button
        title="Enter household"
        onPress={() =>
          navigation.navigate("HouseholdTopTabNavigator", {
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
        onPress={async () => {
          const r = await dispatch(createHousehold(name));
          console.log(r.meta.requestStatus);
          if (r.meta.requestStatus === "fulfilled") {
            let householdId = (r.payload as Household).id;

            //TODO
            // create profile
            const profile: ProfileDTO = {
              avatar: -1,
              name: "",
              pending: false,
              role: "Admin",
            };

            const re = await dispatch(
              createProfile({
                profile: profile,
                houseHoldId: householdId,
              })
            );
            if (re.meta.requestStatus === "fulfilled") {
              navigation.replace("CreateAvatar", {
                profileId: (re.payload as Profile).id,
              });
            }
          }
        }}
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
