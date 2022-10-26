//TODO late
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Profile } from "../../data/APItypes";
import { auth } from "../../data/firebase/config";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import {
  getUserHouseholds,
  setActiveHouseHold,
} from "../../store/slices/householdSlice";
import {
  getUserProfiles,
  selectCurrentProfile,
} from "../../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function PortalWaitingScreen({
  navigation,
  route,
}: RootScreenProps<"PortalWaiting">) {
  //todo usestate mby?
  let profileId = route.params?.profileId;
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserProfiles());
      dispatch(getUserHouseholds());
    }, [])
  );

  let currentProfile = useAppSelector((state) =>
    state.profiles.profiles.find((p) => p.id === profileId)
  );
  let uid = useAppSelector((state) => state.user.user?.uid);

  useEffect(() => {
    // console.log("UseEffect running");
    console.log(currentProfile);
    if (
      currentProfile &&
      !currentProfile.pending &&
      currentProfile.avatar !== -1
    ) {
      setTimeout(function () {
        dispatch(setActiveHouseHold(currentProfile!.householdId));
        navigation.replace("HouseholdTopTabNavigator", {
          screen: "ProfileOverViewScreen",
        });
      }, 1000);
    }
  }, [currentProfile]);

  if (currentProfile !== undefined) {
    if (currentProfile?.userId === uid) {
      // first validility, this is your profile, true
      if (currentProfile.pending) {
        return (
          <View style={styles.container}>
            <Text>Du väntar på att få bli insläppt i detta hus </Text>
            <Button title="Go back" onPress={() => navigation.goBack()} />
          </View>
        );
      } else if (!currentProfile.pending && currentProfile.avatar === -1) {
        return (
          <View style={styles.container}>
            <Text>Du har blivit insläptt men behöver skapa en profil </Text>
            <Button
              title="Skapa Avatar"
              onPress={() => {
                navigation.replace("CreateAvatar", {
                  profileId: currentProfile!.id,
                });
              }}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Text>Please wait</Text>
            <Button title="Go back" onPress={() => navigation.goBack()} />
          </View>
        );
      }
    }
  }
  return (
    <View style={styles.container}>
      <Text>An Error occured</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
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