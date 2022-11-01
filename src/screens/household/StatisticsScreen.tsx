import React, { useCallback } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
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

  const av = getAllAvatars();

  const { chores, total } = useAppSelector(
    selectStatisticsForPeriod("Current Week")
  );

  console.log("chores");
  console.log(chores.length);
  console.log(chores);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        {/* OVERALL "CONTRIBUTION" */}
        <Text style={{ fontSize: 22, textAlign: "center" }}>
          Household Tasks
        </Text>

        {chores.map((c) => {
          // console.log(c);
          console.log("c");
          console.log(c.data);

          return (
            <View key={c.title}>
              <Text>{c.title}</Text>
              <VictoryPie
                labels={c.labels}
                width={150}
                height={150}
                colorScale={c.colorScale}
                data={c.data}
              />
            </View>
          );
        })}
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
