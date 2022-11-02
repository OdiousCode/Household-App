import React, { useCallback, useState } from "react";
import {
  Alert,
  GestureResponderEvent,
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
import { Button, SegmentedButtons } from "react-native-paper";

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
  // let period : string = "";
  const [period, setPeriod] = React.useState("");
  const { chores, total } = useAppSelector(
    selectStatisticsForPeriod(allPeriods[statisticIndex])
  );

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
      <View style={{ alignItems: "center" }}>
        {/* OVERALL "CONTRIBUTION" */}
        <Text style={{ fontSize: 22, textAlign: "center" }}>
          Household Tasks
        </Text>
        <Text style={{ fontSize: 22, textAlign: "center" }}>
          {allPeriods[statisticIndex]}
        </Text>
        <View style={styles.container2}>
          <Pressable
            onPress={() => {
              if (statisticIndex === 0) {
                setStatisticIndex(allPeriods.length - 1);
              } else {
                setStatisticIndex(statisticIndex - 1);
              }
            }}
          >
            <SegmentedButtons
              value={""}
              onValueChange={() => null}
              density="high"
              buttons={[
                {
                  value: "Previous",
                  label: "",
                  icon: "arrow-left-drop-circle",
                  onPress: () => {
                    if (statisticIndex === 0) {
                      setStatisticIndex(allPeriods.length - 1);
                    } else {
                      setStatisticIndex(statisticIndex - 1);
                    }
                  },
                },
                {
                  value: "Next",
                  label: "",
                  icon: "arrow-right-drop-circle",
                  onPress: () => {
                    if (statisticIndex === allPeriods.length - 1) {
                      setStatisticIndex(0);
                    } else {
                      setStatisticIndex(statisticIndex + 1);
                    }
                  },
                },
              ]}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              if (statisticIndex === allPeriods.length - 1) {
                setStatisticIndex(0);
              } else {
                setStatisticIndex(statisticIndex + 1);
              }
            }}
          ></Pressable>
        </View>
        <View style={styles.container}>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            {total.title}
          </Text>
          <VictoryPie
            labels={total.labels}
            width={300}
            height={300}
            colorScale={total.colorScale}
            data={total.data}
          />
        </View>
        <View style={styles.container2}>
          {chores.map((c) => {
            return (
              <View key={c.title}>
                <Text style={{ fontSize: 18, textAlign: "center" }}>
                  Task: {c.title}
                </Text>
                <VictoryPie
                  labels={c.labels}
                  width={175}
                  height={175}
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
    flexDirection: "column",
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
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",
  },
});
