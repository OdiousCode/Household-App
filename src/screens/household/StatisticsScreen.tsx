import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
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
      <View>
        <Text style={{ fontSize: 22, textAlign: "center" }}>Diska</Text>
        <VictoryPie
          width={300}
          height={300}
          colorScale={[
            av[0].color,
            av[1].color,
            av[2].color,
            av[3].color,
            av[4].color,
            av[5].color,
          ]}
          data={[
            { x: av[0].icon, y: 33 },
            { x: av[1].icon, y: 22 },
            { x: av[2].icon, y: 44 },
            { x: av[3].icon, y: 55 },
            { x: av[4].icon, y: 11 },
            { x: av[5].icon, y: 33 },
          ]}
        />
      </View>
      <View>
        <Text style={{ fontSize: 22, textAlign: "center" }}>Tvätta</Text>
        <VictoryPie
          width={300}
          height={300}
          colorScale={[
            av[0].color,
            av[1].color,
            av[2].color,
            av[3].color,
            av[4].color,
            av[5].color,
          ]}
          data={[
            { x: av[0].icon, y: 5 },
            { x: av[1].icon, y: 7 },
            { x: av[2].icon, y: 1 },
            { x: av[3].icon, y: 2 },
            { x: av[4].icon, y: 11 },
            { x: av[5].icon, y: 5 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
