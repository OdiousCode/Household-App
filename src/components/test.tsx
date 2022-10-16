import { NavigationAction, NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Appbar, Menu } from "react-native-paper";
import Navigation from "../navigation/Index";
import {Text, StyleSheet} from "react-native";
import { logOut } from "../store/slices/userSlice";
import { auth } from "../data/firebase/config";

export type Props = {
    title: string,
    userName?: string,
    userEmail?:string,
  }


function CustomNavigationBar(props :Props) {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const sayHello = () => (navigation.goBack()) 
  const navigation = useNavigation();
  
  return (
    <Appbar.Header style={styles.header}>
      {<Appbar.BackAction onPress={sayHello} />}
      <Appbar.Content style={styles.title} title={props.title} />
      <Appbar.Action onPress={sayHello} icon={'arrow-left-bold'}/>
      {<Appbar.Action icon={'arrow-right-bold'}/>}
      { (
        <Menu 
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="account" color="white" onPress={openMenu} />
          }>
          <Menu.Item title= {props.userName} />
          <Menu.Item title= {props.userEmail} />
          <Menu.Item onPress={auth.signOut} title="Log Out"/>
        </Menu>
      )}
    </Appbar.Header>
  );
}

export default CustomNavigationBar;

const styles = StyleSheet.create({
  title:{
    position: 'relative',
    alignItems: 'center',
    display: 'flex',
    marginBottom: 30 ,
    
  },
  header:{
    backgroundColor: 'orange'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});