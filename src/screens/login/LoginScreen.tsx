import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../data/firebase/config";
import { RootScreenProps } from "../../navigation/RootStackNavigator";;
import { BlurView } from 'expo-blur';
import { TextInput } from "react-native-paper";
import { useDispatch } from 'react-redux';
import { logIn } from "../../store/slices/userSlice";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function LoginScreen({ navigation }: RootScreenProps<"Login">) {
  //   const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const loginToApp = (e: any) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        dispatch(
          logIn({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            photoUrl: userAuth.user.photoURL,
          })
        );
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{width: 100, height: 100, backgroundColor: 'blue', position: 'absolute', transform:[{ rotate: "25deg" }]}}></View>
      <View style={{width: 100, height: 100, backgroundColor: 'red', top: 120, position: 'absolute', transform:[{ rotate: "60deg" }] }}></View>
      <View style={{width: 100, height: 100, backgroundColor: 'yellow', bottom: 120, position: 'absolute', borderRadius: 120 }}></View>
      <ScrollView contentContainerStyle= {{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
          <BlurView intensity={100}>
            <View style={styles.logIn}>
              <View>
                <Text style={{fontSize: 17, fontWeight:'400', color: 'black'}}>E-mail</Text>
                <TextInput style={styles.input}
                  onChangeText={(text) => setEmail(text)}
                  placeholder='test@email.se'>
                </TextInput>
              </View>
              <View>
                <Text style={{fontSize: 17, fontWeight:'400', color: 'black'}}>Password</Text>
                <TextInput autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  textContentType="password"
                  value={password}
                  style={styles.input}
                  onChangeText={(text) => setPassword(text)} placeholder='password'></TextInput>
              </View>
              <Pressable style={styles.button} onPress={(loginToApp)}><Text style={styles.text}>Login</Text></Pressable>
              <Pressable  style={styles.button} onPress={() => navigation.navigate("CreateAccount")}><Text style={styles.text}>Create account</Text></Pressable>
            </View>
          </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%', 
    alignItems: 'center',
    justifyContent: 'center'

  },
  logIn: {
    flex: 1,
    height: 500,
    width: 300,
    margin: 10,
    marginTop: 150,
    
  },
  input: {
    color: 'black',
    margin: 10
  },
  button: {
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#7DB2C5',
  },
  text: {
    fontSize: 17,
  }
});
