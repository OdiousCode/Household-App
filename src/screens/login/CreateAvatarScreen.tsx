import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import RootStackNavigator, {
  RootScreenProps,
} from "../../navigation/RootStackNavigator";
import { avatarColors } from "../../constants/Colors";
import { getAllAvatars, getAvatar } from "../../constants/Layout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  createProfile,
  selectProfileById,
  setActiveProfile,
  updateProfile,
} from "../../store/slices/profileSlice";
import { Profile, ProfileDTO } from "../../data/APItypes";
import {} from "../../store/slices/householdSlice";
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
  if (!baseProfile) {
    return null;
  }
  let isEditing = route.params?.isEditing;
  if (isEditing === undefined) {
    isEditing = false;
  }

  let allSameHouseHoldId = useAppSelector((state) =>
    state.profiles.profiles.filter(
      (p) => p.householdId === baseProfile?.householdId
    )
  );

  const allAvatars = getAllAvatars();
  let allAvatarsInNumber: number[] = [];
  allAvatars.forEach((avatar, index) => {
    allAvatarsInNumber.push(index);
  });

  let avaibleAvatars = allAvatarsInNumber;
  allSameHouseHoldId.forEach((element) => {
    if (
      avaibleAvatars.includes(element.avatar) &&
      baseProfile?.id !== element.id
    ) {
      let index = avaibleAvatars.indexOf(element.avatar);
      avaibleAvatars.splice(index, 1);
    }
  });

  // If more ppl then avatars, let them use all.
  if (avaibleAvatars.length <= 1) {
    avaibleAvatars = allAvatarsInNumber;
  }
  let indexStartState = 0;
  if (isEditing) {
    indexStartState = avaibleAvatars.indexOf(baseProfile.avatar);
  }

  const [name, setName] = useState(baseProfile.name);
  const [avatarIndex, setAvatarIndex] = useState(indexStartState);
  //TODO limit based on existing avatars

  return (
    <View style={styles.container}>
      <Text>Create avatar Screen</Text>
      <Button onPress={() => navigation.goBack()}> Go Back</Button>

      <TextInput
        style={styles.input}
        onChangeText={(name) => setName(name)}
        placeholder="Name"
        defaultValue={baseProfile.name}
      ></TextInput>

      <View>
        <View
          style={{
            backgroundColor: getAvatar(avaibleAvatars[avatarIndex]).color,
            padding: 20,
            borderRadius: 50,
          }}
        >
          <Text style={{ fontSize: 30 }}>
            {getAvatar(avaibleAvatars[avatarIndex]).icon}
          </Text>
        </View>

        <Button
          onPress={() => {
            if (avatarIndex === avaibleAvatars.length - 1) {
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
              setAvatarIndex(avaibleAvatars.length - 1);
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
              avatar: avaibleAvatars[avatarIndex],
              name: name,

              email: baseProfile!.email,
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

                if (!isEditing) {
                  dispatch(setActiveProfile(newProfile.id));
                }

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
