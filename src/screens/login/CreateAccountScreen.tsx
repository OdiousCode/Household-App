import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from '../../data/firebase/config';
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { logIn } from '../../store/slices/userSlice';

// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

export default function CreateAccount({
  navigation,
}: RootScreenProps<"CreateAccount">) {
  //   const dispatch = useAppDispatch();
  //   const balance = useAppSelector((state) => state.bank.balance);
  //   const transactions = useAppSelector((state) => state.bank.transactions);
  //   const profile = useAppSelector((state) => state.profile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onHandleSignup = () => {
    if (!firstName || !lastName) {
      return alert('Please enter a full name');
    }
    createUserWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <View style={styles.container}>
    <View style={styles.whiteSheet} />
    <SafeAreaView style={styles.form}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
      style={styles.input}
      placeholder="First Name"
      autoCapitalize="words"
      autoFocus={true}
      value={firstName}
      onChangeText={(text) => setFirstName(text)}
    />
      <TextInput
      style={styles.input}
      autoCapitalize="words"
      placeholder="Last Name"
      autoFocus={true}
      value={lastName}
      onChangeText={(text) => setLastName(text)}
    />
       <TextInput
      style={styles.input}
      placeholder="E-mail"
      autoCapitalize="none"
      keyboardType="email-address"
      textContentType="emailAddress"
      autoFocus={true}
      value={email}
      onChangeText={(text) => setEmail(text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry={true}
      textContentType="password"
      value={password}
      onChangeText={(text) => setPassword(text)}
    />
    <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
      <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}> Sign Up</Text>
    </TouchableOpacity>
    <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
      <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Don't have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{color: '#7DB2C5', fontWeight: '600', fontSize: 14}}> Log In</Text>
      </TouchableOpacity>
    </View>
    <Button title="Go back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#7DB2C5",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#7DB2C5',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
function dispatch(arg0: any): ((value: void) => void | PromiseLike<void>) | null | undefined {
  throw new Error('Function not implemented.');
}

