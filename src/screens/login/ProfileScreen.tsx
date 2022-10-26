import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { getUserHouseholds } from "../../store/slices/householdSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Household, Profile } from "../../data/APItypes";
import {
  getUserProfiles,
  selectProfileById,
  selectUserProfiles,
  setActiveProfile,
} from "../../store/slices/profileSlice";
import { Button, Menu, Divider, Provider, Appbar } from "react-native-paper";
import { avatars, getAvatar } from "../../constants/Layout";
import { useFocusEffect } from "@react-navigation/native";

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

  //let prof = useAppSelector(selectProfileById("-NFEJ99u7lzjxhCStSzZ"));

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserProfiles());
      dispatch(getUserHouseholds());
    }, [])
  );

  return (
    <View style={styles.container}>
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
            width: 150,
            borderColor: "#000",
          }}
          onPress={() => navigation.navigate("RoomApplication")}
        >
          Sök åktomst till hushåll
        </Button>
        <Button
          icon="plus-circle-outline"
          mode="contained-tonal"
          buttonColor="#FFF"
          style={{
            borderRadius: 50,
            borderWidth: 0.5,
            width: 150,
            borderColor: "#000",
          }}
          onPress={() => navigation.navigate("CreateHousehold")}
        >
          Skapa hushåll
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
                Välj hushåll
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
            width: 150,
            borderColor: "#000",
          }}
          onPress={() => {
            //TODO
            // setActive Profile?
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
            //else go to pending
          }}
        >
          Gå in
        </Button>
      </View>
      <View style={{ position: "absolute", bottom: 50 }}>
        <Text>Testing stuff</Text>

        <Button
          onPress={async () => {
            console.log("GET DATA RUNNING");
            const r = await dispatch(getUserProfiles());
            if (r.meta.requestStatus === "fulfilled") {
            }
            const res = await dispatch(getUserHouseholds());
            if (r.meta.requestStatus === "fulfilled") {
            }
          }}
        >
          Get Data
        </Button>
      </View>
    </View>
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
