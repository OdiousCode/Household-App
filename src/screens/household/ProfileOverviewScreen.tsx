import React from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { Card, Button } from "react-native-paper";
import { store, useAppDispatch, useAppSelector } from "../../store/store";
import { avatars } from "../../constants/Layout";

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

        <View style={{ height: 500, width: "90%" }}>
          <FlatList
            style={{ flex: 1, width: "100%" }}
            data={profileData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                {item.householdId === householdData.households[0].id && (
                  <Card
                    onPress={() =>
                      Alert.alert(
                        item.name,
                        "Tillhör hushåll " + householdData.households[0].name,
                        [
                          {
                            // Om user är profil, visa knapp för lämna hushåll här
                          },
                          {},
                        ],
                        {
                          cancelable: true,
                          onDismiss: () =>
                            Alert.alert("Avbröt uppdatering av användare"),
                        }
                      )
                    }
                    style={{
                      backgroundColor: "#fff",

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
