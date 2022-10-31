import {
  useNavigation,
} from "@react-navigation/native";
import React, { useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import { Text, StyleSheet } from "react-native";
import { auth } from "../data/firebase/config";
import { logOut} from "../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getAvatar } from "../constants/Layout";

export type Props = {
  title: string;
  userName?: string;
  userEmail?: string;
};

function CustomNavigationBar(props: Props) {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const sayHello = () => navigation.goBack();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const activeHouseHold = useAppSelector((state) => state.profiles.activeProfile?.householdId);

  function logOutOfapp() {
    dispatch(logOut());
    auth.signOut();
  }
  function checkIfUserLoged() {
    const userEmail = useAppSelector((state) => state.user.user?.email);
    if (userEmail?.length === undefined || "") return true;
  }

  function checkIfProfileActive() {
    const activeProfile = useAppSelector(
      (state) => state.profiles.activeProfile
    );
    if (activeProfile !== undefined) return true;
    else {
      return false;
    }
  }

  let activeProfile = useAppSelector((state) => state.profiles.activeProfile);
  const appbarIcon = ({}) => {
    return <Text>{getAvatar(activeProfile!.avatar).icon}</Text>;
  };

  if (checkIfUserLoged()) {
    return (
      <Appbar.Header style={styles.header}>
        <Appbar.Content style={styles.title} title={props.title} />
      </Appbar.Header>
    );
  } else {
    return (
      <Appbar.Header style={styles.header}>
        {checkIfProfileActive() ? (
          <>
            <Appbar.Content style={styles.title} title={props.title} />
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Appbar.Action
                  icon={appbarIcon}
                  color="white"
                  onPress={openMenu}
                />
              }
            >
              {/* <Menu.Item title={props.userName ? null : "No Nickname "} /> */}
              <Menu.Item title={props.userEmail} />
              <Menu.Item title={activeProfile?.name} />
              <Menu.Item title={"Code: " + activeHouseHold?.substring(14,20)} />
              <Menu.Item
                onPress={() => {
                  navigation.navigate("Profile");
                }}
                title="Change profile "
              />
            </Menu>
          </>
        ) : (
          <>
            <Appbar.Content style={styles.title} title={props.title} />
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Appbar.Action
                  icon={"account"}
                  color="white"
                  onPress={openMenu}
                />
              }
            >
              {/* <Menu.Item title={props.userName ? null : "No Nickname "} /> */}
              <Menu.Item title={props.userEmail} />
              <Menu.Item onPress={logOutOfapp} title="Log Out" />
            </Menu>
          </>
        )}
      </Appbar.Header>
    );
  }
}

export default CustomNavigationBar;

const styles = StyleSheet.create({
  title: {
    alignContent: "center",
    alignItems: "center",
    display: "flex",
  },

  arrowright: {
    justifyContent: "center",
    textAlign: "left",
  },

  arrowleft: {
    justifyContent: "center",
    textAlign: "left",
  },

  header: {
    height: 80,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "orange",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
