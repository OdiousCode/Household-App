import { CompositeScreenProps } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "./RootStackNavigator";

import TaskScreen from "../screens/household/TaskScreen";

// import QuestionScreen from "../screens/QuestionScreen";

export type HouseholdStackParamList = {
  TaskScreen: { id: number };
  //   ResultScreen: undefined;
};

export type HouseholdScreenProps<Screen extends keyof HouseholdStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HouseholdStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

const Stack = createNativeStackNavigator<HouseholdStackParamList>();

export default function QuestionStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskScreen" component={TaskScreen} />
    </Stack.Navigator>
  );
}
