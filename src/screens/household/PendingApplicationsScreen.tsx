//TODO late
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Profile } from "../../data/APItypes";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import {
  getUserHouseholds,
  selectActiveHousehold,
} from "../../store/slices/householdSlice";
import {
  deleteProfile,
  getUserProfiles,
  selectPendingProfilesByActiveHousehold,
  selectProfilesByActiveHousehold,
  updateProfile,
} from "../../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export default function PendingApplicationScreen({
  navigation,
}: HouseholdScreenProps<"PendingApplicationScreen">) {
  const dispatch = useAppDispatch();

  let myProfile = useAppSelector((state) => state.profiles.activeProfile);
  let activeHousehold = useAppSelector(selectActiveHousehold);
  let allPending = useAppSelector(selectPendingProfilesByActiveHousehold);

  let allProfiles = useAppSelector(selectProfilesByActiveHousehold);

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

  async function deleteUser(profile: Profile) {
    const r = await dispatch(
      deleteProfile({
        profile: profile,
      })
    );
  }

  if (myProfile?.role === "Admin" && allPending.length < 1) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          No Pendings
        </Text>
      </View>
    );
  } else if (activeHousehold) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ height: 500, width: "90%" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Pending applications
          </Text>
          <FlatList
            style={{ flex: 1, width: "100%" }}
            data={allPending}
            keyExtractor={(profile) => profile.id.toString()}
            renderItem={({ item: profile }) => (
              <View>
                <Card
                  style={{
                    backgroundColor: "#E5EDF0",
                    borderRadius: 10,
                    borderColor: "#000",
                    marginBottom: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      margin: 10,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          Alert.alert(
                            profile.email,
                            activeHousehold!.name,
                            [
                              {
                                text: "Deny access to household",
                                onPress: () => {
                                  Alert.alert(
                                    "Remove" +
                                      profile.email +
                                      "from" +
                                      activeHousehold!.name +
                                      '"',
                                    "Are you sure you want to remove the user?",
                                    [
                                      {
                                        text: "Yes",
                                        onPress: () => {
                                          Alert.alert(
                                            profile.email +
                                              ' have been removed from household "' +
                                              activeHousehold!.name +
                                              '"'
                                          );
                                          deleteUser(profile);
                                        },
                                      },
                                      {
                                        text: "No",
                                      },
                                    ]
                                  );
                                },
                              },
                              {
                                text: "Cancel",
                              },
                            ],
                            {
                              cancelable: true,
                              onDismiss: () =>
                                Alert.alert("Cancel update of user"),
                            }
                          )
                        }
                      >
                        <Text style={styles.cancelIcon}>❌</Text>
                      </TouchableOpacity>
                      <Text
                        style={{ fontWeight: "bold", alignItems: "center" }}
                      >
                        {profile.email}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          profile.email,
                          activeHousehold!.name,
                          [
                            {
                              text: "Allow user access to household",
                              onPress: () => {
                                Alert.alert(
                                  "Add " +
                                    profile.email +
                                    ' to "' +
                                    activeHousehold!.name +
                                    '"',
                                  "Are you sure you want to add the user?",
                                  [
                                    {
                                      text: "Yes",
                                      onPress: () => {
                                        allowUser(profile);
                                        Alert.alert(
                                          profile.email +
                                            ' have been added to the household "' +
                                            activeHousehold!.name +
                                            '"'
                                        );
                                      },
                                    },
                                    {
                                      text: "No",
                                    },
                                  ]
                                );
                              },
                            },
                            {
                              text: "Cancel",
                            },
                          ],
                          {
                            cancelable: true,
                            onDismiss: () =>
                              Alert.alert("canceled update of the user"),
                          }
                        )
                      }
                    >
                      <Text style={styles.acceptIcon}>✔</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
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
  cancelIcon: {
    marginRight: 80,
  },
  acceptIcon: {
    marginLeft: 80,
    fontSize: 17,
  },
});
