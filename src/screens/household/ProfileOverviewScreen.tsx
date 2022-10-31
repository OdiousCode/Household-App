import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button as Butt,
  ScrollView,
  RefreshControl,
} from "react-native";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { Card, Button } from "react-native-paper";

import { store, useAppDispatch, useAppSelector } from "../../store/store";
import { getAvatar } from "../../constants/Layout";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import {
  deleteProfile,
  getUserProfiles,
  selectProfilesByActiveHousehold,
  selectUserProfiles,
  selectValidProfilesByActiveHousehold,
} from "../../store/slices/profileSlice";
import {
  getUserHouseholds,
  selectActiveHousehold,
} from "../../store/slices/householdSlice";

import { SafeAreaView } from "react-native-safe-area-context";
import { Profile, ProfileDTO } from "../../data/APItypes";
import { wait } from "../login/ProfileScreen";

export default function ProfileOverViewScreen({
  navigation,
}: HouseholdScreenProps<"ProfileOverViewScreen">) {
  const currentProfile = useAppSelector(
    (state) => state.profiles.activeProfile
  );
  const profileData = useAppSelector(selectValidProfilesByActiveHousehold);
  const activeProfile = useAppSelector((state) => state.profiles.activeProfile?.id);
  // const currentProfile = useAppSelector(selectUserProfiles);
  // const [refreshing, setRefreshing] = React.useState(false);
  // const onRefresh = React.useCallback(() => {
  //   console.log("refreshing");
  //   setRefreshing(true);
  //   dispatch(getUserProfiles());
  //   dispatch(getUserHouseholds());
  //   wait(2000).then(() => setRefreshing(false));
  // }, []);
  const householdData = useAppSelector(selectActiveHousehold);
  const dispatch = useAppDispatch();

  const adminDeleteProfile = async (profile: Profile) => {
    if (profileData.find((i) => i.id === profile.id)) {
      const r = await dispatch(
        deleteProfile({
          profile: profile,
        })
      );
      if (r.meta.requestStatus === "fulfilled") {
        if ((r.payload as Profile).id === currentProfile?.id)
          // if(profile.role=== "Admin")
          navigation.navigate("Profile");
      }
    }
  };
  let allH = useAppSelector((state) => state.profiles.profiles);

  if (householdData === undefined) {
    return (
      <SafeAreaView>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          - IF SOMETHING FAILS THIS IS DISPLAYED - {"\n"}Hushåll:{" "}
          {householdData}
        </Text>
        <Text>
          namn: {currentProfile?.name}
          {"\n"}
          id: {currentProfile?.id}
          {"\n"}
          husid: {currentProfile?.householdId}
          {"\n"}
          pending: {currentProfile?.pending}
          {"\n"}
          roll: {currentProfile?.role}
          {activeProfile}
        </Text>
      </SafeAreaView>
    );
  } else {
    return (
      <>
        <SafeAreaView style={styles.container}>
          {currentProfile?.role === "Admin" ? (
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}
            >
              [Admin] Hushåll: {householdData.name}
            </Text>
          ) : (
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}
            >
              Hushåll: {householdData.name}
            </Text>
          )}
          {/* <Text>
            namn: {currentProfile?.name}
            id: {currentProfile?.id}
            husid: {currentProfile?.householdId}
            pending: {currentProfile?.pending}
            roll: {currentProfile?.role}
          </Text> */}
          {/* IF current user is a user */}
          <View style={{ height: 500, width: "90%" }}>
            {/* user 0 is normal user, set to 1 to test admin mode, that user is admin */}
            {/* {currentProfile[12].role === "User" && ( */}
            <FlatList
              style={{ flex: 1, width: "100%" }}
              data={profileData}
              keyExtractor={(profile) => profile.id.toString()}
              renderItem={({ item: profile }) => {
                let data = profileData;
                return (
                  <View>
                    {profile.householdId === currentProfile?.householdId && (
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
                            {currentProfile?.role === "Admin" && (
                              <TouchableOpacity
                                onPress={() =>
                                  Alert.alert(
                                    profile.name,
                                    householdData.name,
                                    [
                                      {
                                        text: "Kasta ur hushåll",
                                        onPress: () => {
                                          Alert.alert(
                                            "Ta bort " +
                                              profile.name +
                                              ' ifrån "' +
                                              householdData.name +
                                              '"',
                                            "Är du säker att du vill ta bort användaren?",
                                            [
                                              {
                                                text: "Ja",
                                                onPress: () => {
                                                  adminDeleteProfile(profile);
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
                                        Alert.alert(
                                          "Avbröt uppdatering av användare"
                                        ),
                                    }
                                  )
                                }
                              >
                                <Text>❌ </Text>
                              </TouchableOpacity>
                            )}
                            {currentProfile?.id === profile.id && (
                              <TouchableOpacity
                                onPress={() =>
                                  Alert.alert(
                                    profile.name,
                                    householdData.name,
                                    [
                                      {
                                        text: "Redigera profil",
                                        onPress: () => {
                                          navigation.replace("CreateAvatar", {
                                            profileId: profile.id,
                                            isEditing: true,
                                          });
                                        },
                                      },
                                      {
                                        text: "Lämna hushåll",
                                        onPress: () => {
                                          Alert.alert(
                                            'Lämna hushåll "' +
                                              householdData.name +
                                              '"',
                                            "Är du säker att du vill lämna?",
                                            [
                                              {
                                                text: "Ja",
                                                onPress: () => {
                                                  // Lägg in kod för att faktiskt se till att profilen lämnar hushåll här.

                                                  Alert.alert(
                                                    'Lämnat hushåll "' +
                                                      householdData.name +
                                                      '"'
                                                  );
                                                  adminDeleteProfile(profile);
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
                                        Alert.alert(
                                          "Avbröt uppdatering av användare"
                                        ),
                                    }
                                  )
                                }
                              >
                                <Text>🖋️</Text>
                              </TouchableOpacity>
                            )}

                            <Text style={{ fontWeight: "bold" }}>
                              {profile.name}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 17 }}>
                            {getAvatar(profile.avatar).icon}
                          </Text>
                        </View>
                      </Card>
                    )}
                    {/* Visa bara följande för att se att logik funkar! */}
                    {/* {profile.householdId !== householdData.id && (
                    <Text>{profile.name} tillhör annat hushåll</Text>
                  )} */}
                  </View>
                );
              }}
            />
          </View>
          {/* </ScrollView> */}
        </SafeAreaView>
      </>
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

{
  /* IF current user is a admin */
}
{
  /* user 0 is normal user, set to 1 to test admin mode, that user is admin */
}
{
  /* {currentProfile[12].role === "Admin" && (
              <FlatList
                style={{ flex: 1, width: "100%" }}
                data={profileData}
                keyExtractor={(profile) => profile.id.toString()}
                renderItem={({ item: profile }) => (
                  <View>
                    {profile.householdId === householdData.id && (
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
                          <Text style={{ fontWeight: "bold" }}>
                            {profile.name}
                          </Text> */
}

{
  /* This should only be displayed if currentuser === item.id*/
}
{
  /* <TouchableOpacity
                            onPress={() =>
                              Alert.alert(
                                profile.name,
                                householdData.name,
                                [
                                  {
                                    text: "Kasta ur hushåll",
                                    onPress: () => {
                                      Alert.alert(
                                        "Ta bort " +
                                          profile.name +
                                          ' ifrån "' +
                                          householdData.name +
                                          '"',
                                        "Är du säker att du vill ta bort användaren?",
                                        [
                                          {
                                            text: "Ja",
                                            onPress: () => {
                                              // Lägg in kod för att faktiskt se till att profilen lämnar hushåll här.
                                              Alert.alert(
                                                profile.name +
                                                  ' har tagits bort ur hushåll "' +
                                                  householdData.name +
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
                                    Alert.alert(
                                      "Avbröt uppdatering av användare"
                                    ),
                                }
                              )
                            }
                          >
                            <Text>✒️</Text>
                          </TouchableOpacity>

                          <Text style={{ fontSize: 17 }}>
                            {getAvatar(profile.avatar).icon}
                          </Text>
                        </View>
                      </Card>
                    )} */
}
{
  /* Visa bara följande för att se att logik funkar! */
}
{
  /* {item.householdId !== householdData.id && (
                      <Text>{item.name} tillhör annat hushåll</Text>
                    )} */
}
{
  /* </View>
                )}
              />
            )} */
}
