import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { RootScreenProps } from "../../navigation/RootStackNavigator";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Task } from "../../data/APItypes";
import {} from "../../store/slices/householdSlice";
import { Button } from "react-native-paper";
import {
  createHouseholdTask,
  deleteTask,
  updateTask as updateHouseholdTask,
} from "../../store/slices/taskSlice";
import * as yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Slider from "@react-native-community/slider";

export default function CreateTask({
  navigation,
  route,
}: RootScreenProps<"CreateTask">) {
  const dispatch = useAppDispatch();
  let baseProfile = useAppSelector((state) => state.profiles.activeProfile);
  let baseTask = useAppSelector((state) =>
    state.tasks.householdTasks.find((t) => t.id === route.params?.taskId)
  );

  if (!baseProfile) {
    //TODO 404
    return null;
  }
  let isEditing = false;
  if (baseTask === undefined) {
    isEditing = false;
  } else {
    isEditing = true;
  }

  let viewOnly = false;
  if (route.params?.viewOnly === undefined) {
    viewOnly = false;
  } else {
    viewOnly = true;
  }

  let startStateDesc = "";
  let startStateName = "";
  let startStateDiff = 1;
  let startStateFreq = 1;
  if (isEditing) {
    startStateName = baseTask!.name;
    startStateDesc = baseTask!.description;
    startStateDiff = baseTask!.difficulty;
    startStateFreq = baseTask!.frequency;
  }

  const [sliderValueDifficulty, setSliderValueDifficulty] =
    useState(startStateDiff);
  const [sliderValueFrequency, setSliderValyeFrequency] =
    useState(startStateFreq);

  const TaskValidationSchema = yup.object().shape({
    name: yup.string().required("Title Address is Required"),
    description: yup.string().required("Deacription is required"),
    difficulty: yup
      .number()
      .max(5, `Difficulty should be number between 1-5`)
      .min(1, `Difficulty should be number between 1-5`)
      .required("Difficulty is Required"),
    frequency: yup
      .number()
      .min(1, `Frequency should be number between 1-5`)
      .required("Frequency is Required"),
  });

  async function handleFormSubmit(values: Task) {
    let r = await choseDispatch(values);

    if (r.meta.requestStatus === "fulfilled") {
      navigation.replace("HouseholdTopTabNavigator", {
        screen: "TaskOverviewScreen",
      });
    }
  }

  if (viewOnly === false) {
    return (
      <>
        <Text style={styles.title}>Task</Text>

        <Formik
          validateOnChange={true}
          validationSchema={TaskValidationSchema}
          initialValues={{
            name: startStateName,
            description: startStateDesc,
            difficulty: startStateDiff,
            frequency: startStateFreq,
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
              <SafeAreaView style={styles.container}>
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
                      style={styles.input}
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

                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "400",
                          color: "black",
                        }}
                      >
                        Difficulty
                      </Text>
                      <Text>{sliderValueDifficulty}</Text>
                      <Slider
                        style={{ width: 200, height: 40 }}
                        minimumValue={1}
                        maximumValue={5}
                        onValueChange={(value) =>
                          setSliderValueDifficulty(value)
                        }
                        step={1}
                        value={(values.difficulty = sliderValueDifficulty)}
                        maximumTrackTintColor="#ff0000"
                        minimumTrackTintColor="#00ff00"
                      />

                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "400",
                          color: "black",
                        }}
                      >
                        Frequency
                      </Text>
                      <Text>{sliderValueFrequency}</Text>
                      <Slider
                        style={{ width: 200, height: 40 }}
                        minimumValue={1}
                        maximumValue={31}
                        onValueChange={(value) =>
                          setSliderValyeFrequency(value)
                        }
                        step={1}
                        value={(values.frequency = sliderValueFrequency)}
                        maximumTrackTintColor="#ff0000"
                        minimumTrackTintColor="#00ff00"
                      />
                    </View>
                  </View>

                  {baseProfile?.role === "Admin" && isEditing && (
                    <Button
                      icon="plus-circle-outline"
                      mode="contained"
                      buttonColor="#DCCFCF"
                      textColor="#000"
                      style={{ borderRadius: 50, borderWidth: 1, width: 150 }}
                      onPress={async () => {
                        const r = await dispatch(
                          deleteTask({
                            task: baseTask!,
                          })
                        );

                        if (r.meta.requestStatus === "fulfilled") {
                          navigation.goBack();
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </KeyboardAwareScrollView>

                <View
                  style={{
                    position: "relative",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row",
                    bottom: 15,
                  }}
                >
                  <Button
                    icon="plus-circle-outline"
                    mode="contained"
                    buttonColor="#DCCFCF"
                    textColor="#000"
                    style={{
                      right: "90%",
                      borderRadius: 50,
                      borderWidth: 1,
                      width: 150,
                    }}
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
                    style={{
                      left: "90%",
                      borderRadius: 50,
                      borderWidth: 1,
                      width: 150,
                    }}
                    onPress={() => navigation.goBack()}
                  >
                    Close
                  </Button>
                </View>
              </SafeAreaView>
            </>
          )}
        </Formik>
      </>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <Text style={styles.text}>Task</Text>
          <Text>{startStateName}</Text>
          <Text style={styles.text}>Description: </Text>
          <Text>{startStateDesc}</Text>
          <Text style={styles.text}>Difficulty: </Text>
          <Text>{startStateDiff}</Text>
          <Text style={styles.text}>Frequency: </Text>
          <Text>{startStateFreq}</Text>
        </View>
        <View>
          <Button
            icon="arrow-u-left-top"
            mode="contained"
            buttonColor="#FFF"
            textColor="#000"
            style={{
              borderRadius: 50,
              borderWidth: 0.5,
              width: 150,
              borderColor: "#000",
              margin: 10,
            }}
            onPress={async () => {
              navigation.replace("HouseholdTopTabNavigator", {
                screen: "TaskOverviewScreen",
              });
            }}
          >
            Go back
          </Button>
        </View>
      </View>
    );
  }

  async function choseDispatch(task: Task) {
    if (isEditing) {
      let editedTask: Task = {
        id: baseTask!.id,
        householdId: baseTask!.householdId,
        isArchived: baseTask!.isArchived,
        // img: baseTask?.img,
        // voice: baseTask?.voice,

        description: task.description,
        name: task.name,
        frequency: +task.frequency,
        difficulty: +task.difficulty,
      };
      const r = await dispatch(
        updateHouseholdTask({
          task: editedTask,
        })
      );
      return r;
    } else {
      let createdTask: Task = {
        id: "",
        householdId: "",

        isArchived: false,
        // img: baseTask?.img,
        // voice: baseTask?.voice,

        description: task.description,
        name: task.name,
        frequency: +task.frequency,
        difficulty: +task.difficulty,
      };

      const r = await dispatch(createHouseholdTask(createdTask));
      return r;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    marginTop: 15,
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    paddingBottom: 15,
  },
  input: {
    color: "black",

    backgroundColor: "#E8E8E8",
    padding: 15,
    alignItems: "center",
    width: 350,
    fontSize: 17,
  },
  text: {
    fontSize: 18,
    margin: 20,
  },
  button: {
    margin: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#7DB2C5",
  },
});
