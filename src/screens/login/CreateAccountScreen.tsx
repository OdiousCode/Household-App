import React from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { signup } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../store/store";
import { Formik } from "formik";
import * as Yup from "yup";
import { BlurView } from "expo-blur";

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
  confirmPassword: Yup.string().when("password", {
    is: (val: string) => val && val.length > 0,
    then: Yup.string()
      .oneOf([Yup.ref("password")], "Both passwords need to be the same")
      .required("Required"),
  }),
});

export default function CreateAccount({
  navigation,
}: RootScreenProps<"CreateAccount">) {
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
              validationSchema={SignUpSchema}
              initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
              }}
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
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        {errors.email}
                      </Text>
                    )}
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
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "400",
                        color: "black",
                      }}
                    >
                      Confirm password
                    </Text>
                    <TextInput
                      placeholder="Confirm password"
                      style={styles.input}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      value={values.confirmPassword}
                      secureTextEntry
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <Text
                        style={{
                          color: "red",
                        }}
                      >
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>
                  <Pressable
                    style={styles.button}
                    onPress={() =>
                      dispatch(
                        signup({
                          username: values.email,
                          password: values.confirmPassword,
                        })
                      )
                    }
                    disabled={!isValid || values.email === ""}
                  >
                    <Text style={styles.text}>Submit</Text>
                  </Pressable>
                  <View>
                    <Text
                      style={{ color: "gray", fontWeight: "600", fontSize: 14 }}
                    >
                      Already have an account?{" "}
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                      >
                        <Text
                          style={{
                            color: "#7DB2C5",
                            fontWeight: "600",
                            fontSize: 14,
                          }}
                        >
                          {" "}
                          Log in
                        </Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                  <Button title="Go back" onPress={() => navigation.goBack()} />
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
