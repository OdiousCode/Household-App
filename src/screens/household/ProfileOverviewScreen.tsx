import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { Card, Button } from "react-native-paper";
import { store, useAppDispatch, useAppSelector } from "../../store/store";
import { avatars, getAvatar } from "../../constants/Layout";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { selectUserProfiles } from "../../store/slices/profileSlice";
import { selectActiveHousehold } from "../../store/slices/householdSlice";

export default function ProfileOverViewScreen({
  navigation,
}: HouseholdScreenProps<"ProfileOverViewScreen">) {
  const currentProfile = useAppSelector(
    (state) => state.profiles.activeProfile
  );
  const profileData = useAppSelector((state) => state.profiles.profiles);
  const test = useAppSelector((state) => state.profiles.activeProfile?.id);
  // const currentProfile = useAppSelector(selectUserProfiles);
  const householdData = useAppSelector(selectActiveHousehold);
  if (householdData === undefined) {
    return (
      <View>
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
          {test}
        </Text>
      </View>
    );
  } else {
    return (
      <>
        <View style={styles.container}>
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
              renderItem={({ item: profile }) => (
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
              )}
            />
          </View>
        </View>
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
