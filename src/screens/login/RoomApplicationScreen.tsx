import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Profile, ProfileDTO } from "../../data/APItypes";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { getUserHouseholds } from "../../store/slices/householdSlice";
import { createProfile } from "../../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function RoomApplication({
  navigation,
}: RootScreenProps<"RoomApplication">) {
  const dispatch = useAppDispatch();
  const [entrenceCode, setEntranceCode] = useState("");

  // const activeHouseHold = useAppSelector(
  //   (state) => state.households.activeHouseHold
  // );
  let allH = useAppSelector((state) => state.households.households);

  let allProfiles = useAppSelector((state) => state.profiles);

  return (
    <View style={styles.container}>
      <Text>Room application Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />

      <Button
        title="Submit"
        onPress={async () => {
          if (allH.find((h) => h.entrenceCode === entrenceCode)) {
            const profile: ProfileDTO = {
              avatar: -1,
              name: "No Profile",
              pending: true,
              role: "User",
            };

            const r = await dispatch(
              createProfile({
                profile: profile,
                houseHoldId: entrenceCode,
              })
            );
            if (r.meta.requestStatus === "fulfilled") {
              navigation.replace("PortalWaiting", {
                profileId: (r.payload as Profile).id,
              });
            }
          }
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
