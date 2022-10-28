import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button } from "react-native-paper";
import { Task } from "../../data/APItypes";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { createHouseholdTask } from "../../store/slices/taskSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Formik } from "formik";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";
import * as yup from "yup";

export default function TaskScreen({
  navigation,
}: HouseholdScreenProps<"TaskScreen">) {

  const dispatch = useAppDispatch();

  const TaskValidationSchema = yup.object().shape({
    Title: yup
      .string()
      .required("Title Address is Required"),
    Description: yup
      .string()
      .required("Deacription is required"),
    Difficulty: yup
      .number()
      .max(5, `Difficulty should be number between 1-5`)
      .min(1, `Difficulty should be number between 1-5`)
      .required("Difficulty is Required"),
    Frequency: yup
      .number()
      .min(1, `Frequency should be number between 1-5`)
      .required("Frequency is Required"),
  });


  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Skapa en ny syssla</Text>

        <Formik
          validateOnChange={true}
          validationSchema={TaskValidationSchema}
          initialValues={{ Title: "", Description: "", Difficulty: 1, Frequency: "" }}
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
                  Title
                </Text>
                <TextInput
                  placeholder="Title"
                  style={styles.input}
                  onChangeText={handleChange("Title")}
                  onBlur={handleBlur("Title")}
                  value={values.Title}
                />
                {errors.Title && touched.Title && (
                  <Text
                    style={{
                      color: "red",
                    }}
                  >
                    {errors.Title}
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
                  Description
                </Text>
                <TextInput
                  placeholder="Description"
                  style={styles.input}
                  onChangeText={handleChange("Description")}
                  onBlur={handleBlur("Description")}
                  value={values.Description}
                />
                {errors.Description && touched.Description && (
                  <Text
                    style={{
                      color: "red",
                    }}
                  >
                    {errors.Description}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "400",
                    color: "black",
                  }}
                >
                  Difficulty
                </Text>
                <TextInput
                  placeholder="Difficulty"
                  style={styles.input}
                  onChangeText={handleChange("Difficulty")}
                  onBlur={handleBlur("Difficulty")}
                  value={values.Difficulty.toString()}
                  maxLength={1}
                />
                {errors.Difficulty && touched.Difficulty && (
                  <Text
                    style={{
                      color: "red",
                    }}
                  >
                    {errors.Difficulty}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "400",
                    color: "black",
                  }}
                >
                  Frequency
                </Text>
                <TextInput
                  placeholder="Frequency"
                  style={styles.input}
                  onChangeText={handleChange("Frequency")}
                  onBlur={handleBlur("Frequency")}
                  value={values.Frequency}
                  maxLength={1}

                />
                {errors.Frequency && touched.Frequency && (
                  <Text
                    style={{
                      color: "red",
                    }}
                  >
                    {errors.Frequency}
                  </Text>
                )}
              </View>

              <View
                style={{
                  position: "absolute",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                  bottom: 20,
                  padding: 10,
                }}>
                <Button
                  icon="plus-circle-outline"
                  mode="contained"
                  buttonColor="#DCCFCF"
                  textColor="#000"
                  style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
                  onPress={() => dispatch(createHouseholdTask({ id: "", householdId: "", name: values.Title, description: values.Description, difficulty: values.Difficulty, frequency: 1, voice: "", img: "", isArchived: false }))}
                >
                  Spara
                </Button>
                <Button
                  icon="close"
                  mode="contained-tonal"
                  buttonColor="#DCCFCF"
                  style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
                  onPress={() => navigation.navigate('TaskOverviewScreen')}
                >
                  Stäng
                </Button>
              </View>

            </>
          )}


        </Formik>
        <View style={{
          position: "absolute",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          bottom: 25,
          padding: 10,
        }}>
        </View>

      </SafeAreaView >
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
  },
  nameInput: {
    margin: 10,
    backgroundColor: 'red',
    padding: 50,
  },
  input: {
    color: "black",
    margin: 10,
  },
});
