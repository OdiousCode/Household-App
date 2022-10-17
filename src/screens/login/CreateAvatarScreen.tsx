import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { avatarColors } from "../../constants/Colors";
import { avatars } from "../../constants/Layout";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateAvatar({
  navigation,
}: RootScreenProps<"CreateAvatar">) {
  //   const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);
  const allAvatars = avatars;
  return (
    <View style={styles.container}>
      <Text>Create avatar Screen</Text>
      {/* <Button title="Set name" onPress={() => dispatch(setName("David"))} /> */}
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <View>
        {allAvatars.map((a) => {
          return (
            <View
              key={a.icon}
              style={{
                backgroundColor: a.color,
                padding: 10,
                borderRadius: 50,
              }}
            >
              <Text style={{ fontSize: 30 }}>{a.icon}</Text>
            </View>
          );
        })}
      </View>

      {/* <View style={[styles.avatar, { backgroundColor: Colors.avatar_Fox }]}>
        <Text style={{ fontSize: 30 }}>🦊</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Frog }]}>
        <Text style={{ fontSize: 30 }}>🐸</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Squid }]}>
        <Text style={{ fontSize: 30 }}>🐙</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Whale }]}>
        <Text style={{ fontSize: 30 }}>🐳</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Chicken }]}>
        <Text style={{ fontSize: 30 }}>🐤</Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: Colors.avatar_Pig }]}>
        <Text style={{ fontSize: 30 }}>🐷</Text>
      </View> */}
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
  avatar: {
    padding: 10,
    borderRadius: 50,
  },
});
