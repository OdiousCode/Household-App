import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { BlurView } from "expo-blur";
import { TextInput } from "react-native-paper";
import { signin } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/store";
import { Formik } from "formik";
import * as yup from "yup";

export default function LoginScreen({ navigation }: RootScreenProps<"Login">) {
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email address is Required"),
    password: yup
      .string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });

  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "blue",
          position: "absolute",
          transform: [{ rotate: "25deg" }],
        }}
      ></View>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "red",
          top: 120,
          position: "absolute",
          transform: [{ rotate: "60deg" }],
        }}
      ></View>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "yellow",
          bottom: 120,
          position: "absolute",
          borderRadius: 120,
        }}
      ></View>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BlurView intensity={100}>
          <View style={styles.logIn}>
            <Formik
              //TODO idk where validateOnMount exists
              validateOnChange={true}
              validationSchema={loginValidationSchema}
              initialValues={{ email: "", password: "" }}
              onSubmit={(values) => console.log(values)}
            >
              {({
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <>
                  <View>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "400",
                        color: "black",
                      }}
                    >
                      E-mail
                    </Text>
                    <TextInput
                      placeholder="Email Address"
                      style={styles.input}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                    />
                    {errors.email && touched.email && (
                      <Text
                        style={{
                          color: "red",
                        }}
                      >
                        {errors.email}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "400",
                        color: "black",
                      }}
                    >
                      Password
                    </Text>
                    <TextInput
                      placeholder="Password"
                      style={styles.input}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      secureTextEntry
                    />
                    {errors.password && touched.password && (
                      <Text
                        style={{
                          color: "red",
                        }}
                      >
                        {errors.password}
                      </Text>
                    )}
                  </View>
                  <Pressable
                    style={styles.button}
                    onPress={() =>
                      dispatch(
                        signin({
                          username: values.email,
                          password: values.password,
                        })
                      )
                    }
                    disabled={!isValid || values.email === ""}
                  >
                    <Text style={styles.text}>Login</Text>
                  </Pressable>
                  <Pressable
                    style={styles.button}
                    onPress={() => navigation.navigate("CreateAccount")}
                  >
                    <Text style={styles.text}>Create account</Text>
                  </Pressable>
                </>
              )}
            </Formik>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logIn: {
    flex: 1,
    height: 500,
    width: 300,
    margin: 10,
    marginTop: 150,
  },
  input: {
    color: "black",
    margin: 10,
  },
  button: {
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#7DB2C5",
  },
  text: {
    fontSize: 17,
  },
});
