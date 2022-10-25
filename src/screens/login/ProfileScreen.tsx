import { getDatabase, onValue, ref } from "firebase/database";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { app, auth } from "../../data/firebase/config";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import {
  getUserHouseholds,
  setActiveHouseHold,
} from "../../store/slices/householdSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Household, Profile } from "../../data/APItypes";
import {
  getUserProfiles,
  selectUserProfiles,
} from "../../store/slices/profileSlice";
import { logOut } from "../../store/slices/userSlice";
import { async } from "@firebase/util";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function ProfileScreen({
  navigation,
}: RootScreenProps<"Profile">) {
  const dispatch = useAppDispatch();
  const [entrenceCode, setEntranceCode] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  // dispatch(logOut());
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);

  //dispatch(getUserProfiles);

  // dispatch(getUserProfiles());
  console.log("all Profiles?");
  let allProfiles = useAppSelector((state) => state.profiles.profiles);
  console.log(allProfiles);

  console.log("My Profile");
  let uid = useAppSelector((state) => state.user.user?.uid);
  let myProfiles = allProfiles.filter((p) => p.userId === uid);

  //const profile = useAppSelector((state) => state.profiles.profiles);

  console.log("All households");
  console.log(useAppSelector((state) => state.households.households));

  //TODO prob not?
  // if (activehs) {
  //   navigation.navigate("HouseholdTopTabNavigator", {
  //     screen: "PendingApplicationScreen",
  //   });
  // }
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      {/* <Button
        title="Create Avatar"
        onPress={() => navigation.navigate("CreateAvatar")}
      /> */}

      {myProfiles.map((p) => {
        return (
          <View key={p.id}>
            <Button
              title={p.name + " " + p.householdId}
              onPress={async () => {
                navigation.navigate("HouseholdTopTabNavigator", {
                  screen: "PendingApplicationScreen",
                  params: { profile: p },
                });

                // }
              }}
            />
          </View>
        );
      })}

      {/* {allAvatars.map((a) => {
        return (
          <View
            key={a.icon}
            style={{
              backgroundColor: a.color,
              padding: 10,
              borderRadius: 50,
            }}
          >
            <Text style={{ fontSize: 30 }}>{a.icon}</Text>
          </View>
        );
      })} */}

      <Button
        title="Get Data"
        onPress={async () => {
          console.log("GET DATA RUNNING");
          const r = await dispatch(getUserProfiles());
          if (r.meta.requestStatus === "fulfilled") {
          }
          const res = await dispatch(getUserHouseholds());
          if (r.meta.requestStatus === "fulfilled") {
          }
        }}
      />

      <Button
        title="Apply to room"
        onPress={() => navigation.navigate("RoomApplication")}
      />
      <Button
        title="Create household"
        onPress={() => navigation.navigate("CreateHousehold")}
      />

      {/* <Button title="Log out" onPress={logoutOfApp} /> */}
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
