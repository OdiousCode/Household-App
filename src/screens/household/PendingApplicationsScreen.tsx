//TODO late
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
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
import { getAvatar } from "../../constants/Layout";
import { Profile } from "../../data/APItypes";
import { auth } from "../../data/firebase/config";
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

  let allProfiles = useAppSelector(selectProfilesByActiveHousehold);

  let uid = useAppSelector((state) => state.user.user?.uid);

  console.log("pending App");

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
    console.log(allPending);
    console.log(activeHousehold);
    console.log(myProfile);

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
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          No Pendings
        </Text>
      </View>
    );
  } else if (activeHousehold) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ height: 500, width: "90%" }}>
          <FlatList
            style={{ flex: 1, width: "100%" }}
            data={allPending}
            keyExtractor={(profile) => profile.id.toString()}
            renderItem={({ item: profile }) => (
              <View>
                <Card
                  style={{
                    backgroundColor: getAvatar(profile.avatar).color,
                    borderRadius: 10,
                    borderColor: "#000",
                    marginBottom: 10,
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
                                text: "Neka tillåtelse till hushåll",
                                onPress: () => {
                                  Alert.alert(
                                    "Ta bort " +
                                      profile.email +
                                      ' ifrån "' +
                                      activeHousehold!.name +
                                      '"',
                                    "Är du säker att du vill ta bort användaren?",
                                    [
                                      {
                                        text: "Ja",
                                        onPress: () => {
                                          Alert.alert(
                                            profile.email +
                                              ' har tagits bort ur hushåll "' +
                                              activeHousehold!.name +
                                              '"'
                                          );
                                          deleteUser(profile);
                                        },
                                      },
                                      {
                                        text: "Nej",
                                      },
                                    ]
                                  );
                                },
                              },
                              {
                                text: "Avbryt",
                              },
                            ],
                            {
                              cancelable: true,
                              onDismiss: () =>
                                Alert.alert("Avbröt uppdatering av användare"),
                            }
                          )
                        }
                      >
                        <Text>❌</Text>
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
                              text: "Tillåt användaren till hushåll",
                              onPress: () => {
                                Alert.alert(
                                  "Lägg till " +
                                    profile.email +
                                    ' till "' +
                                    activeHousehold!.name +
                                    '"',
                                  "Är du säker att du vill lägga till användaren?",
                                  [
                                    {
                                      text: "Ja",
                                      onPress: () => {
                                        // Lägg in kod för att faktiskt se till att profilen lämnar hushåll här.
                                        allowUser(profile);
                                        Alert.alert(
                                          profile.email +
                                            ' har lagts till i hushållet"' +
                                            activeHousehold!.name +
                                            '"'
                                        );
                                      },
                                    },
                                    {
                                      text: "Nej",
                                    },
                                  ]
                                );
                              },
                            },
                            {
                              text: "Avbryt",
                            },
                          ],
                          {
                            cancelable: true,
                            onDismiss: () =>
                              Alert.alert("Avbröt uppdatering av användare"),
                          }
                        )
                      }
                    >
                      <Text style={{ fontSize: 17 }}>✔</Text>
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
});
