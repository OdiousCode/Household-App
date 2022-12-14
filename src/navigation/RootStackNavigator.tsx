import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import CustomNavigationBar from "../components/HeaderComponent";
import CreateAccount from "../screens/login/CreateAccountScreen";
import CreateAvatar from "../screens/login/CreateAvatarScreen";
import LoginScreen from "../screens/login/LoginScreen";
import ProfileScreen from "../screens/login/ProfileScreen";
import RoomApplication from "../screens/login/RoomApplicationScreen";

import { useAppDispatch, useAppSelector } from "../store/store";
import { auth } from "../data/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import CreateHouseHoldScreen from "../screens/login/CreateHouseholdScreen";
import HouseholdTopTabNavigator, {
  HouseholdTopTabParamList,
} from "./HouseholdTopTabNavigator";
import PortalWaitingScreen from "../screens/login/PortalWaitingScreen";
import CreateTask from "../screens/login/CreateTaskScreen";
import { logIn, logOut } from "../store/slices/userSlice";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  CreateAvatar: { profileId: string; isEditing?: boolean } | undefined;
  CreateTask: { taskId: string; viewOnly?: boolean } | undefined;
  PortalWaiting: { profileId: string };
  Profile: undefined;
  RoomApplication: undefined;
  CreateHousehold: undefined;
  HouseholdTopTabNavigator: NavigatorScreenParams<HouseholdTopTabParamList>;
};

export type RootScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  let user = useAppSelector((state) => state.user?.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth != null)
        if (userAuth) {
          user = userAuth;
          dispatch(logIn(user));
        } else {
          dispatch(logOut());
        }
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => (
          <CustomNavigationBar
            title={"Household"}
            userEmail={user?.email?.toString()}
          />
        ),
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
        </>
      ) : (
        <>
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="PortalWaiting" component={PortalWaitingScreen} />

          <Stack.Screen
            name="CreateHousehold"
            component={CreateHouseHoldScreen}
          />

          <Stack.Screen name="CreateAvatar" component={CreateAvatar} />
          <Stack.Screen name="RoomApplication" component={RoomApplication} />
          <Stack.Screen name="CreateTask" component={CreateTask} />

          <Stack.Screen
            name="HouseholdTopTabNavigator"
            component={HouseholdTopTabNavigator}
            options={{ headerShown: true }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
