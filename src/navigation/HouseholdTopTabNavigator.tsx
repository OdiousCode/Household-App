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
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from "@react-navigation/material-top-tabs";

// import QuestionScreen from "../screens/QuestionScreen";

export type HouseholdTopTabParamList = {
  TaskScreen: undefined;
  PendingApplicationScreen: undefined;
  ProfileOverViewScreen: undefined;
  StatisticsScreen: undefined;
  TaskOverviewScreen: undefined;
};

export type HouseholdScreenProps<
  Screen extends keyof HouseholdTopTabParamList
> = CompositeScreenProps<
  MaterialTopTabScreenProps<HouseholdTopTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

const Tab = createMaterialTopTabNavigator<HouseholdTopTabParamList>();
// const Stack = createNativeStackNavigator<HouseholdStackParamList>();

export default function HouseholdTopTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="TaskScreen" component={TaskScreen} />
      <Tab.Screen
        name="PendingApplicationScreen"
        component={PendingApplicationScreen}
      />
      <Tab.Screen
        name="ProfileOverViewScreen"
        component={ProfileOverViewScreen}
      />
      <Tab.Screen name="StatisticsScreen" component={StatisticsScreen} />
      <Tab.Screen name="TaskOverviewScreen" component={TaskOverviewScreen} />
    </Tab.Navigator>
  );
}
