import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
  let startStateName = "";
  if (isEditing === true) {
    indexStartState = avaibleAvatars.indexOf(baseProfile.avatar);
    startStateName = baseProfile.name;
  }

  const [name, setName] = useState(startStateName);
  const [avatarIndex, setAvatarIndex] = useState(indexStartState);
  //TODO limit based on existing avatars

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create avatar Screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={(name) => setName(name)}
        placeholder="Name"
        defaultValue={name}
      ></TextInput>

        <View
          style={{
            backgroundColor: getAvatar(avaibleAvatars[avatarIndex]).color,
            padding: 20,
            borderRadius: 50,
            width: 75,
          }}
        >
          <Text style={{ fontSize: 30 }}>
            {getAvatar(avaibleAvatars[avatarIndex]).icon}
          </Text>
        </View>

        <View style={styles.container2}>
          <Pressable style={styles.selectButton}
            onPress={() => {
              if (avatarIndex === 0) {
                setAvatarIndex(avaibleAvatars.length - 1);
              } else {
                setAvatarIndex(avatarIndex - 1);
              }
            }}
          >
            <Text>Prev</Text>
          </Pressable>
          <Pressable style={styles.selectButton}
          onPress={() => {
            if (avatarIndex === avaibleAvatars.length - 1) {
              setAvatarIndex(0);
            } else {
              setAvatarIndex(avatarIndex + 1);
            }
          }}
        >
          <Text>Next</Text>
        </Pressable>
        </View>

        <View style={styles.container2}>

        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}><Text style={styles.text}>Cancel</Text></Pressable>

        <Pressable style={styles.submitButton}
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
          <Text style={styles.text}>Submit</Text>
        </Pressable>
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
  title: {
    fontSize: 25,
    marginBottom: 90
  },
  avatar: {
    padding: 10,
    borderRadius: 50,
  },
  input: {
    color: "black",
    margin: 20,
    fontSize: 18
  },
  selectButton: {
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#ABB2B4",
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    marginTop: 100,
    marginLeft: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#7DB2C5",
  },
  cancelButton: {
    marginTop: 100,
    marginRight: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#7DB2C5",
  },
  text: {
    fontSize: 18,
  }

});
