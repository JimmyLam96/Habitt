import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "navigation/TabNavigation";
import AddHabit from "screens/AddHabit";
import EditHabit from "screens/EditHabit";
import ProgressionHabits from "screens/ProgressionHabits";

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigation} />
        <Stack.Screen name="CreateNew" component={AddHabit} />
        <Stack.Screen name="EditHabit" component={EditHabit} />
        <Stack.Screen name="ProgressionHabits" component={ProgressionHabits} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
