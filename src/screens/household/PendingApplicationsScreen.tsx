//TODO late
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Profile } from "../../data/APItypes";
import { auth } from "../../data/firebase/config";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { getUserHouseholds } from "../../store/slices/householdSlice";
import { getUserProfiles } from "../../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import ProfileOverViewScreen from "./ProfileOverviewScreen";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function PendingApplicationScreen({
  navigation,
  route,
}: HouseholdScreenProps<"PendingApplicationScreen">) {
  //todo usestate mby?
  let profileId = route.params?.profileId;
  const dispatch = useAppDispatch();

  let currentProfile = useAppSelector((state) =>
    state.profiles.profiles.find((p) => p.id === profileId)
  );
  let uid = useAppSelector((state) => state.user.user?.uid);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserProfiles());
      dispatch(getUserHouseholds());
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text>LISTA ÖVER FOLK SOM VILL KOMMA IN </Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
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
