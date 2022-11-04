//TODO late
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { getUserHouseholds } from "../../store/slices/householdSlice";
import {
  getUserProfiles,
  setActiveProfile,
} from "../../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export default function PortalWaitingScreen({
  navigation,
  route,
}: RootScreenProps<"PortalWaiting">) {
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
    console.log(currentProfile);
    if (
      currentProfile &&
      !currentProfile.pending &&
      currentProfile.avatar !== -1
    ) {
      setTimeout(function () {
        dispatch(setActiveProfile(currentProfile!.id));
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
            <Text>You are awaiting acceptance to the household </Text>
            <Button title="Go back" onPress={() => navigation.goBack()} />
          </View>
        );
      } else if (!currentProfile.pending && currentProfile.avatar === -1) {
        return (
          <View style={styles.container}>
            <Text>
              You have been accepted, but you need to create a profile
            </Text>
            <Button
              title="Create avatar"
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
