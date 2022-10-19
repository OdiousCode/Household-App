import {
  NavigationAction,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import React from "react";
import { Appbar, Menu } from "react-native-paper";
import Navigation from "../navigation/Index";
import { Text, StyleSheet } from "react-native";
import { auth } from "../data/firebase/config";

export type Props = {
  title: string;
  userName?: string;
  userEmail?: string;
};

function CustomNavigationBar(props: Props) {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const sayHello = () => navigation.goBack();
  const navigation = useNavigation();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Content style={styles.title} title={props.title} />
      <Appbar.Action
        style={styles.arrowright}
        onPress={sayHello}
        icon={"arrow-left-bold"}
      />
      {<Appbar.Action style={styles.arrowleft} icon={"arrow-right-bold"} />}
      {
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="account" color="white" onPress={openMenu} />
          }
        >
          <Menu.Item title={props.userName} />
          <Menu.Item title={props.userEmail} />
          <Menu.Item onPress={() => auth.signOut()} title="Log Out" />
        </Menu>
      }
    </Appbar.Header>
  );
}

export default CustomNavigationBar;

const styles = StyleSheet.create({
  title: {
    position: "relative",
    alignItems: "center",
    display: "flex",
    marginBottom: 30,
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
    flexDirection: "row",
    backgroundColor: "orange",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
