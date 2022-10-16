import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Header } from "react-native/Libraries/NewAppScreen";
import CustomNavigationBar from "../components/test";
import TaskOverviewScreen from "../screens/household/TasksOverviewScreen";
import CreateAccount from "../screens/login/CreateAccountScreen";
import CreateAvatar from "../screens/login/CreateAvatarScreen";
import LoginScreen from "../screens/login/LoginScreen";
import Profile from "../screens/login/ProfileScreen";
import RoomApplication from "../screens/login/RoomApplicationScreen";
import HouseholdStackNavigator, { HouseholdStackParamList } from "./HouseholdStackNavigator";
import { useAppDispatch, useAppSelector } from "../store/store";
import Navigation from "../navigation/Index";
import { logIn, logOut, selectUser } from '../store/slices/userSlice';
import { auth } from '../data/firebase/config';
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

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
  
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // user is logged in, send the user's details to redux, store the current user in the state
        dispatch(
          logIn({
            email: userAuth.email,
            displayName: userAuth.displayName,
          })
        );
      } else {
        dispatch(logOut());
      }
    });
  }, []);

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
          </>
           ) : (
            <>
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="CreateAvatar" component={CreateAvatar} />
              <Stack.Screen name="RoomApplication" component={RoomApplication} />
              <Stack.Screen name="HouseholdStackNavigator" component={HouseholdStackNavigator} />
            </>
        )}
    </Stack.Navigator>
  );
}
