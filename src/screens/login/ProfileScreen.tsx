import { getDatabase, onValue, ref } from "firebase/database";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { app } from "../../data/firebase/config";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { getHouseholdByEntrenceCode } from "../../store/slices/householdSlice";
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

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function ProfileScreen({
  navigation,
}: RootScreenProps<"Profile">) {
  const dispatch = useAppDispatch();
  const [entrenceCode, setEntranceCode] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);

  ///=========================================================================
  // Get all PROFILES where Profile.userId ===  auth.currentUser?.uid;
  // Get all HOUSEHOLDS where profile.householdId === household.id

  // // // Save Both of these in redux? ( MyProfiles, MyHouseholds)
  // WAIT FOR USER TO SELECT A PROFILE

  // then
  // NAVIGATE to Said Profile
  // Save CurrentProfile + CurrentHousehold to redux
  ///=========================================================================

  // PROFILER.userId = auth.currentuser.uid

  const myfakeProfile: Profile = {
    avatar: 0,
    householdId: 0,
    id: 12,
    name: "obs",
    pending: false,
    role: "User",
    userId: "22",
  };

  // console.log("try to send to moon");
  // const db = getDatabase(app);
  const db = getDatabase(app);

  // const referencePush = ref(db, "app/profiles");
  // const pushRef = push(referencePush);
  // set(pushRef, myfakeProfile);

  const reference = ref(db, "app/profiles");
  onValue(reference, (snapshot) => {
    //console.log(snapshot);
    const allProfiles = Object.values(
      (snapshot.val() || {}) as Record<string, Profile>
    );
    // const allMyProfiles: Profile[] = Object.values(allProfiles);

    console.log(allProfiles[0].id);
  });

  const myProfiles = useAppSelector((state) => state.user.profiles);

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
      <TextInput
        style={styles.input}
        onChangeText={(code) => setEntranceCode(code)}
        placeholder="entrance code"
        value={entrenceCode}
      ></TextInput>
      <Button
        title="Gå med hushåll"
        onPress={() =>
          console.log(dispatch(getHouseholdByEntrenceCode(entrenceCode)))
        }
      />
      <Button
        title="Create household"
        onPress={() => navigation.navigate("CreateHousehold")}
      />
      <Button
        title="Enter household"
        onPress={() =>
          navigation.navigate("HouseholdStackNavigator", {
            screen: "TaskScreen",
          })
        }
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
