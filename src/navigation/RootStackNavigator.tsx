import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import TaskOverviewScreen from "../screens/household/TasksOverviewScreen";
import CreateAccount from "../screens/login/CreateAccountScreen";
import CreateAvatar from "../screens/login/CreateAvatarScreen";
import LoginScreen from "../screens/login/LoginScreen";
import Profile from "../screens/login/ProfileScreen";
import RoomApplication from "../screens/login/RoomApplicationScreen";
import HouseholdStackNavigator, { HouseholdStackParamList } from "./HouseholdStackNavigator";

// import LoginScreen from "../screens/LoginScreen";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  CreateAvatar: undefined;
  Profile: undefined;
  RoomApplication: undefined;
  HouseholdStackNavigator: NavigatorScreenParams<HouseholdStackParamList>;
};

export type RootScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="CreateAvatar" component={CreateAvatar} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="RoomApplication" component={RoomApplication} />

      <Stack.Screen
        name="HouseholdStackNavigator"
        component={HouseholdStackNavigator}
      />
    </Stack.Navigator>
  );
}
