import React, { useCallback, useState } from "react";
import {
  Button,
  Pressable,
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
  PeriodString,
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

  const [statisticIndex, setStatisticIndex] = useState(0);
  const allPeriods: PeriodString[] = [
    "Current Week",
    "Previous Week",
    "Previous Month",
    "All Time",
  ];

  const { chores, total } = useAppSelector(
    selectStatisticsForPeriod(allPeriods[statisticIndex])
  );

  // console.log("chores[0]");
  // console.log(chores[3]);
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

        <Text style={{ fontSize: 22, textAlign: "center" }}>
          {allPeriods[statisticIndex]}
        </Text>

        <View style={styles.container2}>
          <Pressable
            style={styles.selectButton}
            onPress={() => {
              if (statisticIndex === 0) {
                setStatisticIndex(allPeriods.length - 1);
              } else {
                setStatisticIndex(statisticIndex - 1);
              }
            }}
          >
            <Text>Prev</Text>
          </Pressable>
          <Pressable
            style={styles.selectButton}
            onPress={() => {
              if (statisticIndex === allPeriods.length - 1) {
                setStatisticIndex(0);
              } else {
                setStatisticIndex(statisticIndex + 1);
              }
            }}
          >
            <Text>Next</Text>
          </Pressable>
        </View>

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
  selectButton: {
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#ABB2B4",
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
