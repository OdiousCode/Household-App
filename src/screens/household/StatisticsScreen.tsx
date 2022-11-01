import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HouseholdScreenProps } from "../../navigation/HouseholdTopTabNavigator";
// import { setName } from "../store/profileSlice";
// import { useAppDispatch, useAppSelector } from "../store/store";
import Svg, { G, Circle } from "react-native-svg";

import {
  VictoryBar,
  VictoryChart,
  VictoryPie,
  VictoryTheme,
} from "victory-native";
import { avatarColors } from "../../constants/Colors";
import { getAllAvatars } from "../../constants/Layout";

export default function StatisticsScreen({
  navigation,
}: HouseholdScreenProps<"StatisticsScreen">) {
  const av = getAllAvatars();
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ fontSize: 25, textAlign: "center" }}>Diska</Text>
          <VictoryPie
            colorScale={[
              av[0].color,
              av[1].color,
              av[2].color,
              av[3].color,
              av[4].color,
              av[5].color,
            ]}
            data={[
              { x: " ", y: 33 },
              { x: " ", y: 22 },
              { x: " ", y: 44 },
              { x: " ", y: 55 },
              { x: " ", y: 11 },
              { x: " ", y: 33 },
            ]}
          />
        </View>
        <View style={styles.container}>
          <Text style={{ fontSize: 25, textAlign: "center" }}>Tvätta</Text>
          <VictoryPie
            colorScale={[
              av[0].color,
              av[1].color,
              av[2].color,
              av[3].color,
              av[4].color,
              av[5].color,
            ]}
            data={[
              { x: " ", y: 33 },
              { x: " ", y: 22 },
              { x: " ", y: 44 },
              { x: " ", y: 55 },
              { x: " ", y: 11 },
              { x: " ", y: 33 },
            ]}
          />
        </View>
        <View style={styles.container}>
          <Text style={{ fontSize: 25, textAlign: "center" }}>Dammsuga</Text>
          <VictoryPie
            colorScale={[
              av[0].color,
              av[1].color,
              av[2].color,
              av[3].color,
              av[4].color,
              av[5].color,
            ]}
            data={[
              { x: " ", y: 33 },
              { x: " ", y: 22 },
              { x: " ", y: 44 },
              { x: " ", y: 55 },
              { x: " ", y: 11 },
              { x: " ", y: 33 },
            ]}
          />
        </View>
      </ScrollView>
    </View>
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
