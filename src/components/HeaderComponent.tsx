import {
  NavigationAction,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import React, { useReducer, useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import Navigation from "../navigation/Index";
import { Text, StyleSheet } from "react-native";
import { auth } from "../data/firebase/config";
import { logOut, userReducer } from "../store/slices/userSlice";
import { store, useAppDispatch, useAppSelector } from "../store/store";
import { useStore } from "react-redux";
import StatisticsScreen from "../screens/household/StatisticsScreen";

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

  function logOutOfapp() {
    dispatch(logOut());
    auth.signOut();
  }

  function checkIfUserLoged() {
    const userEmail = useAppSelector((state) => state.user.user?.email);
    if (userEmail?.length === undefined || null)
      return true;
    else {
      return false;
    }
  }
  return (
    <Appbar.Header style={styles.header}>
      {checkIfUserLoged() ? (
        <Appbar.Content style={styles.title} title={props.title} />

      ) : (
        <>
          <Appbar.Content style={styles.title} title={props.title} />
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Appbar.Action icon="account" color="white" onPress={openMenu} />}
          >
            <Menu.Item title={props.userName} />
            <Menu.Item title={props.userEmail} />
            <Menu.Item onPress={(logOutOfapp)} title="Log Out" />
          </Menu>
        </>

      )}
    </Appbar.Header>
  );
}

export default CustomNavigationBar;

const styles = StyleSheet.create({
  title: {
    alignContent: 'center',
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
