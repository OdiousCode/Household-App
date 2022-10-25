import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
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
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateAvatar({
  navigation,
  route,
}: RootScreenProps<"CreateAvatar">) {
  const dispatch = useAppDispatch();
  //TODO route.params not optional?
  let baseProfile = useAppSelector(selectProfileById(route.params!.profileId));

  const allAvatars = avatars;

  if (!baseProfile) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text>Create avatar Screen</Text>
      {/* <Button title="Set name" onPress={() => dispatch(setName("David"))} /> */}
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <View>
        {allAvatars.map((a) => {
          return (
            <View
              key={a.icon}
              style={{
                backgroundColor: a.color,
                padding: 10,
                borderRadius: 50,
              }}
            >
              <Text style={{ fontSize: 30 }}>{a.icon}</Text>
            </View>
          );
        })}

        <Button
          title="Submit"
          onPress={async () => {
            // TODO
            //update Profile? currentprofile to name + avatar as wished

            let newProfile: Profile = {
              avatar: 1,
              name: "Nytt namn",

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
              navigation.goBack();
            }
          }}
        />
      </View>

      {/* <View style={[styles.avatar, { backgroundColor: Colors.avatar_Fox }]}>
        <Text style={{ fontSize: 30 }}>🦊</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Frog }]}>
        <Text style={{ fontSize: 30 }}>🐸</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Squid }]}>
        <Text style={{ fontSize: 30 }}>🐙</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Whale }]}>
        <Text style={{ fontSize: 30 }}>🐳</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Chicken }]}>
        <Text style={{ fontSize: 30 }}>🐤</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Pig }]}>
        <Text style={{ fontSize: 30 }}>🐷</Text>
      </View> */}
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
});
