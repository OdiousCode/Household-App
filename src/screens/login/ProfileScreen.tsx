import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Menu } from "react-native-paper";
import { getAvatar } from "../../constants/Layout";
import { Profile } from "../../data/APItypes";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { getUserHouseholds } from "../../store/slices/householdSlice";
import {
  getUserProfiles,
  selectUserProfiles,
  setActiveProfile,
} from "../../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function ProfileScreen({
  navigation,
}: RootScreenProps<"Profile">) {
  const dispatch = useAppDispatch();

  let myProfiles = useAppSelector(selectUserProfiles);
  let allHouseHolds = useAppSelector((state) => state.households.households);

  const [visible, setVisible] = React.useState(false);
  const [avatarNumber, setAvatarNumber] = React.useState(0);
  const [profile, setProfile] = useState({} as Profile);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    dispatch(setActiveProfile(undefined));
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    console.log("refreshing");
    setRefreshing(true);
    dispatch(getUserProfiles());
    dispatch(getUserHouseholds());
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserProfiles());
      dispatch(getUserHouseholds());
      dispatch(setActiveProfile(undefined));
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          position: "absolute",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          top: 0,
          padding: 10,
        }}
      >
        <Button
          icon="login"
          mode="contained"
          buttonColor="#FFF"
          textColor="#000"
          style={{
            borderRadius: 50,
            borderWidth: 0.5,
            width: 175,
            borderColor: "#000",
          }}
          onPress={() => navigation.navigate("RoomApplication")}
        >
          Join
        </Button>
        <Button
          icon="plus-circle-outline"
          mode="contained-tonal"
          buttonColor="#FFF"
          style={{
            borderRadius: 50,
            borderWidth: 0.5,
            width: 175,
            borderColor: "#000",
          }}
          onPress={() => navigation.navigate("CreateHousehold")}
        >
          Create new
        </Button>
      </View>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            paddingTop: 5,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button
                icon="chevron-down"
                mode="contained"
                buttonColor="#FFF"
                textColor="#000"
                style={{
                  borderRadius: 5,
                  borderWidth: 2,
                  width: 350,
                }}
                onPress={openMenu}
              >
                {profile.name
                  ? profile.name +
                    " - " +
                    allHouseHolds.find((h) => h.id === profile.householdId)
                      ?.name
                  : "Pick household"}
              </Button>
            }
          >
            {myProfiles.map((myProf) => {
              return (
                <Menu.Item
                  key={myProf.id}
                  onPress={() => {
                    closeMenu();
                    // set active household
                    setAvatarNumber(myProf.avatar);
                    setProfile(myProf);
                  }}
                  //TODO get name from householdId
                  title={
                    myProf.name +
                    " - " +
                    allHouseHolds.find((h) => h.id === myProf.householdId)?.name
                  }
                />
              );
            })}
          </Menu>
        </View>
        <View
          style={{
            backgroundColor: getAvatar(avatarNumber).color,
            padding: 50,
            borderRadius: 555,
            margin: 10,
          }}
        >
          <Text style={{ fontSize: 130 }}>{getAvatar(avatarNumber).icon}</Text>
        </View>
        <Button
          icon="login"
          mode="contained"
          buttonColor="#FFF"
          textColor="#000"
          style={{
            borderRadius: 10,
            borderWidth: 0.5,
            width: 200,
            borderColor: "#000",
          }}
          onPress={() => {
            //TODO
            // setActive Profile?
            if (profile.id !== undefined) {
              dispatch(setActiveProfile(profile.id));

              //TODO navigate to correct screen
              if (!profile.pending && profile.avatar !== -1) {
                console.log("Valid Profile");

                navigation.navigate("HouseholdTopTabNavigator", {
                  screen: "ProfileOverViewScreen",
                });
              } else {
                navigation.navigate("PortalWaiting", {
                  profileId: profile.id,
                });
              }
            } else {
              {
                return Alert.alert(
                  "Please choose a household or create one if you don't have one!"
                );
              }
            }
          }}
        >
          Enter household
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    color: "black",
    margin: 10,
  },
});
