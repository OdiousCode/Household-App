import React, { useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
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
      <Text style={styles.text}>Room application Screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={(code) => setEntranceCode(code)}
        placeholder="Entrance code"
        value={entrenceCode}
      ></TextInput>

      <View style={styles.container2}>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text>Cancel</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={async () => {
            if (
              allH.find(
                (h) => h.entrenceCode.substring(14, 20) === entrenceCode
              )
            ) {
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
        >
          <Text>Join household</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    color: "black",
    width: 200,
  },
  text: {
    fontSize: 25,
    margin: 50,
  },
  button: {
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#ABB2B4",
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
