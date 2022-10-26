import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import RootStackNavigator, {
  RootScreenProps,
} from "../../navigation/RootStackNavigator";
import { avatarColors } from "../../constants/Colors";
import { avatars } from "../../constants/Layout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  createProfile,
  selectProfileById,
  updateProfile,
} from "../../store/slices/profileSlice";
import { Profile, ProfileDTO } from "../../data/APItypes";
import { setActiveHouseHold } from "../../store/slices/householdSlice";
import { Button, Menu, Divider, Provider, Appbar } from "react-native-paper";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateAvatar({
  navigation,
  route,
}: RootScreenProps<"CreateAvatar">) {
  const dispatch = useAppDispatch();
  //TODO route.params not optional?
  let baseProfile = useAppSelector(selectProfileById(route.params!.profileId));

  const [name, setName] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(1);
  const allAvatars = avatars;
  //TODO limit based on existing avatars

  if (!baseProfile) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text>Create avatar Screen</Text>
      <Button onPress={() => navigation.goBack()}> Go Back</Button>

      <TextInput
        style={styles.input}
        onChangeText={(name) => setName(name)}
        placeholder="name"
      ></TextInput>

      <View>
        <View
          style={{
            backgroundColor: allAvatars[avatarIndex].color,
            padding: 20,
            borderRadius: 50,
          }}
        >
          <Text style={{ fontSize: 30 }}>{allAvatars[avatarIndex].icon}</Text>
        </View>

        <Button
          onPress={() => {
            if (avatarIndex === avatars.length - 1) {
              setAvatarIndex(0);
            } else {
              setAvatarIndex(avatarIndex + 1);
            }
          }}
        >
          Next
        </Button>

        <Button
          onPress={() => {
            if (avatarIndex === 0) {
              setAvatarIndex(avatars.length - 1);
            } else {
              setAvatarIndex(avatarIndex - 1);
            }
          }}
        >
          Previous
        </Button>

        <Button
          onPress={async () => {
            // TODO
            //update Profile? currentprofile to name + avatar as wished

            let newProfile: Profile = {
              avatar: avatarIndex,
              name: name,

              householdId: baseProfile!.householdId,
              id: baseProfile!.id,
              pending: baseProfile!.pending,
              role: baseProfile!.role,
              userId: baseProfile!.userId,
            };

            const r = await dispatch(
              updateProfile({
                profile: newProfile,
              })
            );

            //TODO take screen as param and move to screen?
            if (r.meta.requestStatus === "fulfilled") {
              if (!newProfile.pending && newProfile.avatar != -1) {
                console.log("Go To Profile Screen");

                dispatch(setActiveHouseHold(newProfile.householdId));

                navigation.replace("HouseholdTopTabNavigator", {
                  screen: "ProfileOverViewScreen",
                });
              } else {
                console.log("Go back");
                navigation.goBack();
              }
            }
          }}
        >
          Submit
        </Button>
      </View>
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
  avatar: {
    padding: 10,
    borderRadius: 50,
  },
  input: {
    color: "black",
    margin: 10,
  },
});
