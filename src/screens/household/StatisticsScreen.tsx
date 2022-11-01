import React, { useCallback } from "react";
import {
  Button,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";

import {
  VictoryBar,
  VictoryChart,
  VictoryPie,
  VictoryTheme,
} from "victory-native";
import { avatarColors } from "../../constants/Colors";
import { getAllAvatars, getAvatar } from "../../constants/Layout";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getUserTaskHistories,
  getUserTasks,
  selectActiveHouseholdTask,
  selectActiveHouseholdTaskHistories,
  selectHistoryForPeriod as selectStatisticsForPeriod,
} from "../../store/slices/taskSlice";
import { Profile } from "../../data/APItypes";
import { useFocusEffect } from "@react-navigation/native";
import { getUserProfiles } from "../../store/slices/profileSlice";
import { getUserHouseholds } from "../../store/slices/householdSlice";
import { wait } from "../login/ProfileScreen";

// Vecka Månadg, All-Time

export default function StatisticsScreen({
  navigation,
}: HouseholdScreenProps<"StatisticsScreen">) {
  const dispatch = useAppDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(getUserTasks());
      dispatch(getUserTaskHistories());
      dispatch(getUserProfiles());
    }, [])
  );

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    console.log("refreshing");
    setRefreshing(true);
    dispatch(getUserTasks());
    dispatch(getUserTaskHistories());
    dispatch(getUserProfiles());
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const av = getAllAvatars();

  const { chores, total } = useAppSelector(
    selectStatisticsForPeriod("Current Week")
  );

  console.log("total");
  console.log(total);

  if (!total.data) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <Text style={{ fontSize: 22, textAlign: "center" }}>
            No history found
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView>
      <View>
        {/* OVERALL "CONTRIBUTION" */}
        <Text style={{ fontSize: 22, textAlign: "center" }}>
          Household Tasks
        </Text>

        <View style={styles.container}>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            {total.title}
          </Text>
          <VictoryPie
            labels={total.labels}
            width={200}
            height={200}
            colorScale={total.colorScale}
            data={total.data}
          />
        </View>

        <View style={styles.container}>
          {chores.map((c) => {
            return (
              <View key={c.title}>
                <Text style={{ fontSize: 18, textAlign: "center" }}>
                  {c.title}
                </Text>
                <VictoryPie
                  labels={c.labels}
                  width={200}
                  height={200}
                  colorScale={c.colorScale}
                  data={c.data}
                />
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  chart: {},
});
