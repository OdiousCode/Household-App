import React, { useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import {
  getUserTaskHistories,
  getUserTasks,
} from "../../store/slices/taskSlice";

export default function ProfileOverViewScreen({
  navigation,
}: HouseholdScreenProps<"ProfileOverViewScreen">) {
  useFocusEffect(
    useCallback(() => {
      dispatch(getUserTasks());
      dispatch(getUserTaskHistories());
      dispatch(getUserProfiles());
    }, [])
  );

  const currentProfile = useAppSelector(
    (state) => state.profiles.activeProfile
  );
  const profileData = useAppSelector(selectValidProfilesByActiveHousehold);
  const activeProfile = useAppSelector(
    (state) => state.profiles.activeProfile?.id
  );
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
          - IF SOMETHING FAILS THIS IS DISPLAYED - {"\n"}Household:{" "}
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
              [Admin] Household: {householdData.name}
            </Text>
          ) : (
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 30 }}
            >
              Household: {householdData.name}
            </Text>
          )}
          <View style={{ height: 500, width: "90%" }}>
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
                                        text: "Remove from household",
                                        onPress: () => {
                                          Alert.alert(
                                            "Remove " +
                                              profile.name +
                                              ' from "' +
                                              householdData.name +
                                              '"',
                                            "Are you sure you want to remove this user?",
                                            [
                                              {
                                                text: "Yes",
                                                onPress: () => {
                                                  adminDeleteProfile(profile);
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
                                        Alert.alert(
                                          "Canceled update of the user"
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
                                        text: "Edit profile",
                                        onPress: () => {
                                          navigation.navigate("CreateAvatar", {
                                            profileId: profile.id,
                                            isEditing: true,
                                          });
                                        },
                                      },
                                      {
                                        text: "Leave household",
                                        onPress: () => {
                                          Alert.alert(
                                            'Leave household "' +
                                              householdData.name +
                                              '"',
                                            "Are you certain want to leave the household?",
                                            [
                                              {
                                                text: "Yes",
                                                onPress: () => {
                                                  Alert.alert(
                                                    'left household "' +
                                                      householdData.name +
                                                      '"'
                                                  );
                                                  adminDeleteProfile(profile);
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
                                        Alert.alert(
                                          "Canceled update of the user"
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
                  </View>
                );
              }}
            />
          </View>
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
