import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Profile, ProfileDTO } from "../../data/APItypes";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import {
  getUserHouseholds,
  setActiveHouseHold,
} from "../../store/slices/householdSlice";
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
          console.log("1");
          //TODO change to id, but find based on entrencode?
          //TODO
          // change from activeHousehold to activeProfile?
          // makes more sense right?
          // everyhwere household is important send as param i guess
          // make soem sense :)
          if (allH.find((h) => h.entrenceCode === entrenceCode)) {
            console.log("2");
            //dispatch(setActiveHouseHold(entrenceCode));
            // create profile?
            const profile: ProfileDTO = {
              avatar: -1,
              name: "Elias",
              pending: true,
              role: "User",
            };

            //TODO
            dispatch(
              createProfile({
                profile: profile,
                houseHoldId: entrenceCode,
              })
            );

            const r = await dispatch(
              createProfile({
                profile: profile,
                houseHoldId: entrenceCode,
              })
            );
            if (r.meta.requestStatus === "fulfilled") {
              navigation.navigate("HouseholdTopTabNavigator", {
                screen: "PendingApplicationScreen",
                params: { profileId: (r.payload as Profile).id },
              });
            }
            console.log("3");
            // dispatch(setActiveHouseHold(entrenceCode));
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
