import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import TaskOverviewScreen from "../screens/household/TasksOverviewScreen";
import LoginScreen from "../screens/login/LoginScreen";
import { HouseholdStackParamList } from "./HouseholdStackNavigator";

// import LoginScreen from "../screens/LoginScreen";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Login: undefined;
  HouseholdStackNavigator: NavigatorScreenParams<HouseholdStackParamList>;
};

export type RootScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen
        name="HouseholdStackNavigator"
        component={TaskOverviewScreen}
      />
    </Stack.Navigator>
  );
}
