import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { useDispatch, useSelector } from "react-redux";
import { auth, app } from "../../data/firebase/config";
import { selectUser } from "../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getDatabase, onValue, push, ref, set } from "firebase/database";

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
import { selectUserProfiles } from "../../store/slices/profileSlice";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function ProfileScreen({
  navigation,
}: RootScreenProps<"Profile">) {
  const dispatch = useAppDispatch();
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

  const myProfiles = useAppSelector(selectUserProfiles);

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
          navigation.navigate("HouseholdTopTabNavigator", {
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
});
