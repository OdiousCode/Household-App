import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../data/firebase/config';
import { logOut, selectUser } from '../../store/slices/userSlice';
import { useAppDispatch } from "../../store/store";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function Profile({ navigation }: RootScreenProps<"Profile">) {
  const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);

  const logoutOfApp = () => {
    // dispatch to the store with the logout action
    dispatch(logOut());
    // sign out function from firebase
    auth.signOut();
  };

  const user = useSelector(selectUser);

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button
        title="Create Avatar"
        onPress={() => navigation.navigate("CreateAvatar")}
      />
      <Button
        title="Apply to room"
        onPress={() => navigation.navigate("RoomApplication")}
      />
      <Button
        title="Enter household"
        onPress={() =>
          navigation.navigate("HouseholdStackNavigator", {
            screen: "TaskScreen",
          })
        }
      />

      <Button title="Log out" onPress={(logoutOfApp)} />
    </View>
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
