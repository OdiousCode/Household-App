import { getDatabase, onValue, ref } from "firebase/database";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { app } from "../../data/firebase/config";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import {} from "../../store/slices/householdSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Household, Profile } from "../../data/APItypes";
import { selectUserProfiles } from "../../store/slices/profileSlice";
import { Button, Menu, Divider, Provider, Appbar } from "react-native-paper";
import { avatars } from "../../constants/Layout";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function ProfileScreen({
  navigation,
}: RootScreenProps<"Profile">) {
  const dispatch = useAppDispatch();
  const [entrenceCode, setEntranceCode] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);

  ///=========================================================================
  // Get all PROFILES where Profile.userId ===  auth.currentUser?.uid;
  // Get all HOUSEHOLDS where profile.householdId === household.id

  // // // Save Both of these in redux? ( MyProfiles, MyHouseholds)
  // WAIT FOR USER TO SELECT A PROFILE

  // then
  // NAVIGATE to Said Profile
  // Save CurrentProfile + CurrentHousehold to redux
  ///=========================================================================

  // PROFILER.userId = auth.currentuser.uid

  const myfakeProfile: Profile = {
    avatar: 0,
    householdId: 0,
    id: 12,
    name: "obs",
    pending: false,
    role: "User",
    userId: "22",
  };

  const myProfiles = useAppSelector(selectUserProfiles);
  const [visible, setVisible] = React.useState(false);
  const [avatarNumber, setAvatarNumber] = React.useState(0);
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
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
          Gå med hushåll
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
            <Menu.Item
              onPress={() => {
                closeMenu();
                // set active household
                setAvatarNumber(1);
              }}
              title="Familjen Andersson"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                // set active household
                setAvatarNumber(2);
              }}
              title="Sportklubben Sport IF"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                // set active household
                setAvatarNumber(3);
              }}
              title="Arbete AB"
            />
          </Menu>
        </View>
        <View
          style={{
            backgroundColor: avatars[avatarNumber].color,
            padding: 50,
            borderRadius: 555,
            margin: 10,
          }}
        >
          <Text style={{ fontSize: 130 }}>{avatars[avatarNumber].icon}</Text>
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
          onPress={() =>
            navigation.navigate("HouseholdTopTabNavigator", {
              screen: "TaskScreen",
            })
          }
        >
          Gå in
        </Button>
      </View>
      <View style={{ position: "absolute", bottom: 50 }}>
        <Text>Testing stuff</Text>
      </View>
      <View style={{ flexDirection: "row", position: "absolute", bottom: 0 }}>
        <Button onPress={() => navigation.navigate("CreateAvatar")}>
          Create Avatar
        </Button>

        <TextInput
          style={styles.input}
          onChangeText={(code) => setEntranceCode(code)}
          placeholder="entrance code"
          value={entrenceCode}
        ></TextInput>
        <Button>Gå med hushåll</Button>
        {/* <Button onPress={() => navigation.navigate("CreateHousehold")}>
        Create household
      </Button> */}
        {/* <Button
        onPress={() =>
          navigation.navigate("HouseholdTopTabNavigator", {
            screen: "TaskScreen",
          })
        }
      >
        Enter household
      </Button> */}
        {/* <Button title="Log out" onPress={logoutOfApp} /> */}
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
