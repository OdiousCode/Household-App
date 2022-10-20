import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { useDispatch, useSelector } from "react-redux";
import { auth, app } from "../../data/firebase/config";
import { logIn, selectUser } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/store";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Household } from "../../data/APItypes";

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateHouseHoldScreen({
  navigation,
}: RootScreenProps<"CreateHousehold">) {
  const dispatch = useAppDispatch();
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

  // const HouseholdCollectionRef = collection(database, "Household");
  // const TaskCollectionRef = collection(database, "Task");
  // const ProfileCollectionRef = collection(database, "Task");

  // const q = query(TaskCollectionRef, where("householdId", "==", [user.Id]));
  // const myProfiles = query(
  //   ProfileCollectionRef,
  //   where("id", "==", auth.currentUser?.uid)
  // );

  //dispatch(SetMyProfiles(myProfiles));

  // const getData = async () => {
  //   const data = await getDocs(HouseholdCollectionRef);
  //   data.forEach((d) => {
  //     const docId = d.get("id");
  //     d.data();

  //     if (docId == 2) {
  //       console.log("This is my Document");
  //     }
  //   });
  // };

  // .where('userId', '==', route.params ? route.params.userId : user.uid)

  // getData();

  // const addData = async () => {
  //   addDoc(HouseholdCollectionRef, {
  //     householdid: 2,
  //     entranceCode: 4321,
  //     name: "Vattna blommorna",
  //   });
  // };

  // addData();

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
          navigation.navigate("HouseholdTopTabNavigator", {
            screen: "TaskScreen",
          })
        }
      />
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
