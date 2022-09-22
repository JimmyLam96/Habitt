import { ActivityIndicator, View } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import colors from "config/colors";
import { db } from "../../firebase";
import { doc, getDoc } from "@firebase/firestore";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [innerHabitId, setInnerHabitId] = useState();
  const [middleHabitId, setMiddleHabitId] = useState();
  const [outerHabitId, setOuterHabitId] = useState();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) getAndSetUserSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const getAndSetUserSettings = async () => {
    setLoading(true);

    const docRef = doc(db, "userSettings", "demo-user");

    try {
      const docSnap = await getDoc(docRef);
      Object.entries(docSnap.data()).forEach(([key, value]) => {
        switch (key) {
          case "innerHabit":
            setInnerHabitId(value);
            break;
          case "middleHabit":
            setMiddleHabitId(value);
            break;
          case "outerHabit":
            setOuterHabitId(value);
            break;
          default:
            console.log(key, value);
        }
      });
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        innerHabitId,
        setInnerHabitId,
        middleHabitId,
        setMiddleHabitId,
        outerHabitId,
        setOuterHabitId,
      }}
    >
      {loading ? (
        <View className="flex-1">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

export const useUserSettings = () => useContext(UserContext);

export default UserProvider;
