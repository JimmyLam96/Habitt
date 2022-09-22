import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Overview from "screens/Overview";
import AddHabit from "screens/AddHabit";
import CalendarView from "screens/CalendarView";
import React from "react";
import TabButton from "components/buttons/TabButton";
import { Octicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import colors from "config/colors";
import AddHabitButton from "components/buttons/AddHabitButton";
import { color } from "react-native-reanimated";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopColor: "transparent",
          backgroundColor: colors.background,
          height: 105,
          elevation: 0,
        },
      }}
      sceneContainerStyle={{
        backgroundColor: colors.background,
        paddingTop: "10%",
        paddingRight: "10%",
        paddingLeft: "10%",
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton
              active={focused}
              icon={<Octicons name="home" size={24} color={colors.primary} />}
            />
          ),
        }}
        name="Overview"
        component={Overview}
      />
      <Tab.Screen
        name="AddHabit"
        options={{
          tabBarIcon: () => (
            <AddHabitButton>
              <Entypo name="plus" size={24} color={colors.primary} />
            </AddHabitButton>
          ),
        }}
        component={AddHabit}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("CreateNew");
          },
        })}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton
              active={focused}
              icon={<Entypo name="calendar" size={24} color={color.primary} />}
            />
          ),
        }}
        name="CalendarView"
        component={CalendarView}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
