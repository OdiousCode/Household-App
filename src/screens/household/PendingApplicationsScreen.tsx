//TODO late
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Profile } from "../../data/APItypes";
import { auth } from "../../data/firebase/config";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import {
  getUserHouseholds,
  selectActiveHousehold,
} from "../../store/slices/householdSlice";
import {
  getUserProfiles,
  selectPendingProfilesByActiveHousehold,
  selectProfilesByActiveHousehold,
  updateProfile,
} from "../../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import ProfileOverViewScreen from "./ProfileOverviewScreen";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function PendingApplicationScreen({
  navigation,
  route,
}: HouseholdScreenProps<"PendingApplicationScreen">) {
  //todo usestate mby?
  const dispatch = useAppDispatch();

  let myProfile = useAppSelector((state) => state.profiles.activeProfile);
  let activeHousehold = useAppSelector(selectActiveHousehold);
  let allPending = useAppSelector(selectPendingProfilesByActiveHousehold);

  let uid = useAppSelector((state) => state.user.user?.uid);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserProfiles());
      dispatch(getUserHouseholds());
    }, [])
  );
  async function allowUser(profile: Profile) {
    let newProfile: Profile = {
      avatar: profile.avatar,
      name: profile.name,
      email: profile.email,

      householdId: profile!.householdId,
      id: profile!.id,
      pending: false,
      role: profile!.role,
      userId: profile!.userId,
    };

    const r = await dispatch(
      updateProfile({
        profile: newProfile,
      })
    );
  }

  if (myProfile?.role === "Admin") {
    return (
      <View style={styles.container}>
        <Text>Depending profiles</Text>
        {allPending.map((ap) => {
          return (
            <View>
              <Button onPress={() => allowUser(ap)}>{ap.email}</Button>
            </View>
          );
        })}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Du har inte rättelse för denna sida</Text>
        <Button onPress={() => navigation.goBack()}> Go Back</Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
