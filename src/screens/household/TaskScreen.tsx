import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { Task } from "../../data/APItypes";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
import { createHouseholdTask } from "../../store/slices/taskSlice";
import { useAppDispatch } from "../../store/store";
import { Formik } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function TaskScreen({
  navigation,
}: HouseholdScreenProps<"TaskScreen">) {
  const dispatch = useAppDispatch();

  const TaskValidationSchema = yup.object().shape({
    name: yup.string().required("Task title is Required"),
    description: yup.string().required("Description is required"),
    difficulty: yup
      .number()
      .max(5, `Difficulty should be a number between 1-5`)
      .min(1, `Difficulty should be a number between 1-5`)
      .required("A difficulty is required"),
    frequency: yup
      .number()
      .min(1, `Frequency should be a number between 1-5`)
      .required("Frequency is required"),
  });

  async function handleFormSubmit(values: Task) {
    dispatch(createHouseholdTask(values));
    navigation.navigate("TaskOverviewScreen");
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Create a new task</Text>
        <Formik
          validateOnChange={true}
          validationSchema={TaskValidationSchema}
          initialValues={{
            name: "",
            description: "",
            difficulty: 1,
            frequency: 1,
            isArchived: false,
            householdId: "",
            id: "",
          }}
          onSubmit={(values) => {
            handleFormSubmit(values);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <>
              <KeyboardAwareScrollView>
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
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />
                  {errors.name && touched.name && (
                    <Text
                      style={{
                        color: "red",
                      }}
                    >
                      {errors.name}
                    </Text>
                  )}
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
                    style={{
                      color: "black",
                      margin: 10,
                      backgroundColor: "#E8E8E8",
                      padding: 15,
                      alignContent: "flex-start",
                      width: 350,
                      height: 100,
                    }}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                  />
                  {errors.description && touched.description && (
                    <Text
                      style={{
                        color: "red",
                      }}
                    >
                      {errors.description}
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
                    onChangeText={handleChange("difficulty")}
                    onBlur={handleBlur("difficulty")}
                    value={values.difficulty.toString()}
                    maxLength={1}
                    keyboardType={"numeric"}
                  />
                  {errors.difficulty && touched.difficulty && (
                    <Text
                      style={{
                        color: "red",
                      }}
                    >
                      {errors.difficulty}
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
                    onChangeText={handleChange("frequency")}
                    onBlur={handleBlur("frequency")}
                    value={values.frequency.toString()}
                    keyboardType={"numeric"}
                  />
                  {errors.frequency && touched.frequency && (
                    <Text
                      style={{
                        color: "red",
                      }}
                    >
                      {errors.frequency}
                    </Text>
                  )}
                </View>
              </KeyboardAwareScrollView>

              <View
                style={{
                  position: "absolute",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexDirection: "row",
                  width: "100%",
                  bottom: 20,
                  padding: 10,
                }}
              >
                <Button
                  icon="plus-circle-outline"
                  mode="contained"
                  buttonColor="#DCCFCF"
                  textColor="#000"
                  style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  Save
                </Button>
                <Button
                  icon="close"
                  mode="contained-tonal"
                  buttonColor="#DCCFCF"
                  style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
                  onPress={() => navigation.navigate("TaskOverviewScreen")}
                >
                  Close
                </Button>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    paddingBottom: 20,
  },
  input: {
    color: "black",
    margin: 10,
    backgroundColor: "#E8E8E8",
    padding: 15,
    alignItems: "center",
    width: 350,
  },
});
