import React from "react";
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
  selectActiveHouseholdTask,
  selectActiveHouseholdTaskHistories,
  selectHistoryForPeriod,
  selectHistoryForPeriod as selectStatisticsForPeriod,
} from "../../store/slices/taskSlice";
import { Profile } from "../../data/APItypes";

// Vecka Månadg, All-Time

export default function StatisticsScreen({
  navigation,
}: HouseholdScreenProps<"StatisticsScreen">) {
  const dispatch = useAppDispatch();
  const av = getAllAvatars();

  const { chores, total } = useAppSelector(
    selectStatisticsForPeriod("Current Week")
  );
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        {/* OVERALL "CONTRIBUTION" */}
        <Text style={{ fontSize: 22, textAlign: "center" }}>
          Household Tasks
        </Text>
        {chores.map((c) => (
          <View key={c.title}>
            <Text>{c.title}</Text>
            <VictoryPie
              labels={c.labels}
              width={300}
              height={300}
              colorScale={c.colorScale}
              data={c.data}
            />
          </View>
        ))}
      </View>
      <View>{/* OVERALL "CONTRIBUTION" */}</View>
      <View>
        <VictoryPie
          width={300}
          height={300}
          colorScale={[av[0].color]}
          data={[{ y: 5 }]}
        />
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
