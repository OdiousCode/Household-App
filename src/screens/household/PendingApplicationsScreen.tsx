//TODO late
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Profile } from "../../data/APItypes";
import { auth } from "../../data/firebase/config";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import {
  getUserHouseholds,
  setActiveHouseHold,
} from "../../store/slices/householdSlice";
import {
  getUserProfiles,
  selectCurrentProfile,
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
  let baseProfile = route.params?.profile;
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   // Update the document title using the browser API
  //   dispatch(setActiveHouseHold())
  //   dispatch(getUserProfiles)
  //   dispatch(getUserHouseholds)
  // });

  let uid = useAppSelector((state) => state.user.user?.uid);
  let currentProfile = useAppSelector((state) =>
    state.profiles.profiles.find((p) => p.id === baseProfile?.id)
  );

  console.log(currentProfile);
  if (currentProfile !== undefined) {
    console.log("1");
    if (currentProfile?.userId === uid) {
      // first validility, this is your profile, true
      if (currentProfile.pending) {
        console.log("2");
        return (
          <View style={styles.container}>
            <Text>Du väntar på att få bli insläppt i detta hus </Text>
            <Button title="Go back" onPress={() => navigation.goBack()} />
          </View>
        );
      } else if (
        currentProfile.pending === false &&
        currentProfile.avatar !== -1
      ) {
        console.log("3");
        return (
          <View style={styles.container}>
            <Text>Du har blivit insläptt </Text>
            <Button
              title="Gå vidare"
              onPress={() => {
                navigation.navigate("ProfileOverViewScreen", {
                  householdId: currentProfile!.householdId,
                });
              }}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Text>Du har blivit insläptt men behöver göra en profil </Text>
            <Button
              title="Skapa Avatar"
              onPress={() => {
                navigation.navigate("CreateAvatar", {
                  profile: currentProfile!,
                });
              }}
            />
          </View>
        );
      }

      // navigation.navigate("HouseholdTopTabNavigator", {
      //   screen: "ProfileOverviewScreen",
      //   params: currentProfile?.householdId,
      // });
    }
  } else {
    return (
      <View style={styles.container}>
        <Text>An Error occured</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // const currentProfile = useAppSelector(selectCurrentProfile);
  // console.log(currentProfile);
  // if (
  //   currentProfile !== undefined &&
  //   currentProfile.pending === false &&
  //   currentProfile.avatar !== undefined
  // ) {
  //   console.log("GO TO OVERVIEW");
  //   navigation.navigate("ProfileOverViewScreen");
  // }

  // if (currentProfile === undefined) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>An Error occured</Text>
  //       <Button title="Go back" onPress={() => navigation.goBack()} />
  //     </View>
  //   );
  // } else if (currentProfile.pending)
  //   return (
  //     <View style={styles.container}>
  //       <Text>Du är inte insläppt i detta rum</Text>
  //       <Button title="Go back" onPress={() => navigation.goBack()} />
  //     </View>
  //   );
  // else if (!currentProfile.pending && currentProfile.avatar === undefined) {
  //   //TODO nav 2 next step
  //   //navigation.navigate("CreateAvatarScreen");
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
