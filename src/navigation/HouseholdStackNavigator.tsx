import { CompositeScreenProps } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "./RootStackNavigator";

import TaskScreen from "../screens/household/TaskScreen";
import PendingApplicationScreen from "../screens/household/PendingApplicationsScreen";
import ProfileOverViewScreen from "../screens/household/ProfileOverviewScreen";
import StatisticsScreen from "../screens/household/StatisticsScreen";
import TaskOverviewScreen from "../screens/household/TasksOverviewScreen";

// import QuestionScreen from "../screens/QuestionScreen";

export type HouseholdStackParamList = {
  TaskScreen: undefined;
  PendingApplicationScreen: undefined;
  ProfileOverViewScreen: undefined;
  StatisticsScreen: undefined;
  TaskOverviewScreen: undefined;
};

export type HouseholdScreenProps<Screen extends keyof HouseholdStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HouseholdStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

const Stack = createNativeStackNavigator<HouseholdStackParamList>();

export default function HouseholdStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaskScreen" component={TaskScreen} />
      <Stack.Screen
        name="PendingApplicationScreen"
        component={PendingApplicationScreen}
      />
      <Stack.Screen
        name="ProfileOverViewScreen"
        component={ProfileOverViewScreen}
      />
      <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} />
      <Stack.Screen name="TaskOverviewScreen" component={TaskOverviewScreen} />
    </Stack.Navigator>
  );
}
