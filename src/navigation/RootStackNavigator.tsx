import { NavigatorScreenParams, useRoute } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Header } from "react-native/Libraries/NewAppScreen";
import CustomNavigationBar from "../components/HeaderComponent";
import TaskOverviewScreen from "../screens/household/TasksOverviewScreen";
import CreateAccount from "../screens/login/CreateAccountScreen";
import CreateAvatar from "../screens/login/CreateAvatarScreen";
import LoginScreen from "../screens/login/LoginScreen";
import ProfileScreen from "../screens/login/ProfileScreen";
import RoomApplication from "../screens/login/RoomApplicationScreen";
// import HouseholdStackNavigator, {
//   HouseholdStackParamList,
// } from "./HouseholdStackNavigator";
import { useAppDispatch, useAppSelector } from "../store/store";
import Navigation from "../navigation/Index";
import { logOut, signin } from "../store/slices/userSlice";
import { auth } from "../data/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import CreateHouseHoldScreen from "../screens/login/CreateHouseholdScreen";
import HouseholdTopTabNavigator, {
  HouseholdTopTabParamList,
} from "./HouseholdTopTabNavigator";
import { Profile } from "../data/APItypes";
import PortalWaitingScreen from "../screens/login/PortalWaitingScreen";
import CreateTask from "../screens/login/CreateTaskScreen";

// import LoginScreen from "../screens/LoginScreen";

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
  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // user is logged in, send the user's details to redux, store the current user in the state
        console.log("Log In");
        // dispatch(
        //   signin({
        //     email: userAuth.email,
        //     password: userAuth. // if we save pass
        //   })
        // );
      } else {
        console.log("LogOut");
        //TODO look at this
        // auth.signOut();
        // dispatch(logOut());
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
