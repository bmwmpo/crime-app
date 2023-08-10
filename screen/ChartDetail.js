import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, Image, ScrollView, Animated } from "react-native";
import { COLORS, SIZES, FONTS, icons } from "../constants";
import HeaderBar from "./HeaderBar";
import AreaLabel from "./AreaLabel";
import TextButton from "./TextButton";
import DropDown from "./DropDown";
import styleSheet from "../assets/StyleSheet";
import { chartOps } from "../constants/dummy";
import { useTheme, useNavigation } from "@react-navigation/native";
import {
  VictoryScatter,
  VictoryLine,
  VictoryChart,
  VictoryAxis,
} from "victory-native";
import { VictoryCustomTheme } from "../assets/VictoryCustomTheme";

import { crimeDummy } from "../constants/dummy";

const axisData = {
  Assault: [
    "ASSAULT_2014",
    "ASSAULT_2015",
    "ASSAULT_2016",
    "ASSAULT_2017",
    "ASSAULT_2018",
    "ASSAULT_2019",
    "ASSAULT_2020",
    "ASSAULT_2021",
    "ASSAULT_2022",
  ],
  "Break-In": [
    "BREAKENTER_2014",
    "BREAKENTER_2015",
    "BREAKENTER_2016",
    "BREAKENTER_2017",
    "BREAKENTER_2018",
    "BREAKENTER_2019",
    "BREAKENTER_2020",
    "BREAKENTER_2021",
    "BREAKENTER_2022",
  ],
  Homicide: [
    "HOMICIDE_2014",
    "HOMICIDE_2015",
    "HOMICIDE_2016",
    "HOMICIDE_2017",
    "HOMICIDE_2018",
    "HOMICIDE_2019",
    "HOMICIDE_2020",
    "HOMICIDE_2021",
    "HOMICIDE_2022",
  ],
  Robbery: [
    "ROBBERY_2014",
    "ROBBERY_2015",
    "ROBBERY_2016",
    "ROBBERY_2017",
    "ROBBERY_2018",
    "ROBBERY_2019",
    "ROBBERY_2020",
    "ROBBERY_2021",
    "ROBBERY_2022",
  ],
};

// const ChartDetail = ({ route, navigation }) => {
const ChartDetail = ({ route, navigation }) => {
  console.log(route.params.area);

  const [crime, setCrime] = useState(crimeDummy);


    //styling
    const isDarkMode = useTheme().dark;
    const textColor = isDarkMode
      ? styleSheet.darkModeColor
      : styleSheet.lightModeColor;
    const backgroundColor = isDarkMode
      ? styleSheet.darkModeBackGroundColor
      : styleSheet.lightModeBackGroundColor;
    const cardBorderColor = isDarkMode
      ? styleSheet.darkModeOutlinedColor
      : styleSheet.lightModeOutlinedColor;

      

  const [selectedArea, setSelectedArea] = React.useState(route.params.area);
  const [chartOptions, setChartOptions] = React.useState(chartOps);
  const [selectedOption, setSelectedOption] = React.useState(chartOptions[0]);

  const updateSharedState = (newValue) => {
    setSelectedArea(newValue);
  };

  console.log(selectedOption);

  function optionOnClickHandler(option) {
    setSelectedOption(option);
  }

  useEffect(() => {
    getApi = async () => {
      return fetch(
        `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?resource_id=58b33705-45f0-4796-a1a7-5762cc152772&limit=200`
      )
        .then((response) => response.json())
        .then((json) => {
          // setdata(json.result.records);
          //     console.log("getting all data in chart screen")
          //     console.log(json.result.records[1].AREA_NAME)
          //     console.log(JSON.parse(json.result.records[1].geometry).coordinates[0])
          // let i = 0
          // var temp_obj_list=[]
          // while(i<json.result.total){
          //     var temp_obj = new Region(json.result.records[i]._id,json.result.records[i].AREA_NAME,0,0,0,0,0,0,0,0,0,JSON.parse(json.result.records[i].geometry).coordinates[0])
          //     temp_obj_list.push(temp_obj)
          //     i++
          // }
          console.log(json);
          setCrime(json);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getApi();
  }, []);

  function renderChart() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          marginBottom: SIZES.padding,
          marginHorizontal: SIZES.radius,
          alignItems: "center",
          borderRadius: SIZES.radius,
          backgroundColor: {cardBorderColor},
          ...styles.shadow,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: SIZES.padding,
            paddingHorizontal: SIZES.padding,
          }}
        >
          <View style={{ flex: 1 }}>
            <AreaLabel area={crime.result.records[selectedArea].AREA_NAME} />
          </View>
          {/* <View>
            <Text style={{ ...FONTS.h3 }}>${dummyData.trendingCurrencies[0]?.amount}</Text>
            <Text style={{ ...FONTS.body3 }}>${dummyData.trendingCurrencies[0]?.changes}</Text>
          </View> */}
        </View>
        <View
          style={{
            marginTop: -25,
          }}
        >
          <VictoryChart
            theme={VictoryCustomTheme}
            height={220}
            width={SIZES.width - 40}
          >
            <VictoryLine
              style={{
                data: {
                  stroke: COLORS.secondary,
                },
                parent: {
                  border: "1px solid #ccc",
                },
              }}
              data={axisData[selectedOption.label].map((key) => ({
                x: key.slice(-4),
                y: crime.result.records[selectedArea][key],
                // y: crime.result.records[0][key]
              }))}
              categories={{
                x: [
                  "2014",
                  "2015",
                  "2016",
                  "2017",
                  "2018",
                  "2019",
                  "2020",
                  "2021",
                  "2022",
                ],
              }}
            />
            <VictoryScatter
              data={axisData[selectedOption.label].map((key) => ({
                x: key.slice(-4),
                // y: crime.result.records[0][key]
                y: crime.result.records[selectedArea][key],
              }))}
              categories={{
                x: [
                  "2014",
                  "2015",
                  "2016",
                  "2017",
                  "2018",
                  "2019",
                  "2020",
                  "2021",
                  "2022",
                ],
              }}
              size={5}
              style={{
                data: {
                  fill: COLORS.secondary,
                },
              }}
            />

            <VictoryAxis
              style={{
                grid: {
                  stroke: "transparent",
                },
                tickLabels : {
                  fill: textColor.color
                }
              }}
            />

            <VictoryAxis
              dependentAxis
              style={{
                axis: {
                  stroke: "transparent",
                },
                grid: {
                  stroke: "grey",
                },
                tickLabels : {
                  fill: textColor.color
                }
              }}
            />
          </VictoryChart>
        </View>

        <View
          style={{
            width: "100%",
            paddingHorizontal: SIZES.padding,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: SIZES.padding,
          }}
        >
          {chartOptions.map((option) => {
            return (
              <TextButton
                key={`option-${option.id}`}
                label={option.label}
                customContainerstyle={{
                  height: 45,
                  width: 80,
                  borderRadius: 15,
                  backgroundColor:
                    selectedOption.id == option.id
                      ? COLORS.primary
                      : backgroundColor.color,
                }}
                customLabelStyle={{
                  color:
                    selectedOption.id == option.id ? COLORS.white : COLORS.gray,
                  ...FONTS.body5,
                }}
                onPress={() => optionOnClickHandler(option)}
              />
            );
          })}
        </View>
      </View>
    );
  }

  return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
        }}
      >
        {/* <HeaderBar>right={true}</HeaderBar> */}
        <ScrollView>
          <View style={{ flex: 1, paddingBottom: SIZES.padding }}></View>
          {renderChart()}
        </ScrollView>
        <DropDown
        crime={crime}
        sharedState={selectedArea}
        updateSharedState={updateSharedState}
      ></DropDown>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default ChartDetail;
