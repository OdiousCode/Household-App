import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { Household, Profile, ProfileDTO } from "../../data/APItypes";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import {
  createHousehold,
  getUserHouseholds,
} from "../../store/slices/householdSlice";
import { createProfile } from "../../store/slices/profileSlice";
import {} from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/store";
import { Button, Menu, Divider, Provider, Appbar } from "react-native-paper";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateHouseHoldScreen({
  navigation,
}: RootScreenProps<"CreateHousehold">) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>New household</Text>

      <TextInput
        style={styles.input}
        onChangeText={(name) => setName(name)}
        placeholder="Name"
      ></TextInput>

      {/* //TODO better */}
      <Button
        icon="login"
        mode="contained"
        buttonColor="#FFF"
        textColor="#000"
        style={{
          borderRadius: 50,
          borderWidth: 0.5,
          width: 200,
          borderColor: "#000",
        }}
        onPress={async () => {
          const r = await dispatch(createHousehold(name));
          if (r.meta.requestStatus === "fulfilled") {
            let householdId = (r.payload as Household).id;

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
      >
        Create household
      </Button>
      <Button
        icon="arrow-u-left-top"
        mode="contained"
        buttonColor="#FFF"
        textColor="#000"
        style={{
          borderRadius: 50,
          borderWidth: 0.5,
          width: 150,
          borderColor: "#000",
          margin: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        Go back
      </Button>
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
