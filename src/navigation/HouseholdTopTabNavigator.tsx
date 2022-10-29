import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useCallback } from "react";
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
import { useAppSelector } from "../store/store";

export type HouseholdTopTabParamList = {
  TaskScreen: undefined;
  PendingApplicationScreen: { profileId: string } | undefined;
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
  let myProfile = useAppSelector((state) => state.profiles.activeProfile);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: "#444",
        tabBarLabel: "",
        tabBarStyle: { backgroundColor: "orange", height: 1 },
      }}
    >
      <Tab.Screen
        name="ProfileOverViewScreen"
        component={ProfileOverViewScreen}
      />
      <Tab.Screen name="TaskScreen" component={TaskScreen} />
      <Tab.Screen name="StatisticsScreen" component={StatisticsScreen} />
      <Tab.Screen name="TaskOverviewScreen" component={TaskOverviewScreen} />
      {myProfile?.role === "Admin" && (
        <Tab.Screen
          name="PendingApplicationScreen"
          //TODO fix later (temporary fix for CI) V
          component={PendingApplicationScreen as any}
        />
      )}
    </Tab.Navigator>
  );
}
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
