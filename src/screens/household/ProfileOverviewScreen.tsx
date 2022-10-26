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
import { avatars } from "../../constants/Layout";
import { Item } from "react-native-paper/lib/typescript/components/List/List";

export default function ProfileOverViewScreen({
  navigation,
}: HouseholdScreenProps<"ProfileOverViewScreen">) {
  const profileData = useAppSelector((state) => state.profiles.profiles);
  const householdData = useAppSelector((state) => state.households);
  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}>
          Hushåll: {householdData.households[0].name}
        </Text>

        {/* IF current user is a user */}
        <View style={{ height: 500, width: "90%" }}>
          {/* user 0 is normal user, set to 1 to test admin mode, that user is admin */}
          {profileData[0].role === "User" && (
            <FlatList
              style={{ flex: 1, width: "100%" }}
              data={profileData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View>
                  {item.householdId === householdData.households[0].id && (
                    <Card
                      style={{
                        backgroundColor: avatars[item.avatar].color,
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
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>

                        {/* This should only be displayed if currentuser === item.id*/}
                        {item.id === "1" && (
                          <TouchableOpacity
                            onPress={() =>
                              Alert.alert(
                                item.name,
                                householdData.households[0].name,
                                [
                                  {
                                    text: "Lämna hushåll",
                                    onPress: () => {
                                      Alert.alert(
                                        'Lämna hushåll "' +
                                          householdData.households[0].name +
                                          '"',
                                        "Är du säker att du vill lämna?",
                                        [
                                          {
                                            text: "Ja",
                                            onPress: () => {
                                              // Lägg in kod för att faktiskt se till att profilen lämnar hushåll här.
                                              Alert.alert(
                                                'Lämnat hushåll "' +
                                                  householdData.households[0]
                                                    .name +
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
                        )}

                        <Text style={{ fontSize: 17 }}>
                          {avatars[item.avatar].icon}
                        </Text>
                      </View>
                    </Card>
                  )}
                  {/* Visa bara följande för att se att logik funkar! */}
                  {item.householdId !== householdData.households[0].id && (
                    <Text>{item.name} tillhör annat hushåll</Text>
                  )}
                </View>
              )}
            />
          )}

          {/* IF current user is a admin */}
          {/* user 0 is normal user, set to 1 to test admin mode, that user is admin */}
          {profileData[0].role === "Admin" && (
            <FlatList
              style={{ flex: 1, width: "100%" }}
              data={profileData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View>
                  {item.householdId === householdData.households[0].id && (
                    <Card
                      style={{
                        backgroundColor: avatars[item.avatar].color,
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
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>

                        {/* This should only be displayed if currentuser === item.id*/}
                        <TouchableOpacity
                          onPress={() =>
                            Alert.alert(
                              item.name,
                              householdData.households[0].name,
                              [
                                {
                                  text: "Kasta ur hushåll",
                                  onPress: () => {
                                    Alert.alert(
                                      "Ta bort " +
                                        item.name +
                                        ' ifrån "' +
                                        householdData.households[0].name +
                                        '"',
                                      "Är du säker att du vill ta bort användaren?",
                                      [
                                        {
                                          text: "Ja",
                                          onPress: () => {
                                            // Lägg in kod för att faktiskt se till att profilen lämnar hushåll här.
                                            Alert.alert(
                                              item.name +
                                                ' har tagits bort ur hushåll "' +
                                                householdData.households[0]
                                                  .name +
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
                          {avatars[item.avatar].icon}
                        </Text>
                      </View>
                    </Card>
                  )}
                  {/* Visa bara följande för att se att logik funkar! */}
                  {item.householdId !== householdData.households[0].id && (
                    <Text>{item.name} tillhör annat hushåll</Text>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </View>
    </>
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
