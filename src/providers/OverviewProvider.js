import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, onSnapshot } from "@firebase/firestore";
import { useUserSettings } from "./UserProvider";

const OverviewContext = createContext();

// Provider that fetches all habits on mount
const OverviewProvider = ({ children }) => {
  const [habits, setHabits] = useState();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const { innerHabitId, middleHabitId, outerHabitId } = useUserSettings();
  const [innerHabit, setInnerHabit] = useState();
  const [middleHabit, setMiddleHabit] = useState();
  const [outerHabit, setOuterHabit] = useState();

  useEffect(() => {
    let isMounted = true;

    if (isMounted && innerHabitId) {
      const docRef = doc(db, "habits", innerHabitId);
      const unsub = onSnapshot(docRef, (doc) => {
        console.log(doc);
        if (doc.exists()) {
          setInnerHabit({ ...doc.data(), id: doc.id });
        }
      });
      return () => {
        isMounted = false;
        unsub();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [innerHabitId]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted && middleHabitId) {
      const docRef = doc(db, "habits", middleHabitId);
      const unsub = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setMiddleHabit({ ...doc.data(), id: doc.id });
        }
      });
      return () => {
        isMounted = false;
        unsub();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [middleHabitId]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted && outerHabitId) {
      const docRef = doc(db, "habits", outerHabitId);
      const unsub = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setOuterHabit({ ...doc.data(), id: doc.id });
        }
      });
      return () => {
        isMounted = false;
        unsub();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [outerHabitId]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getAndSetAllHabits();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const getAndSetAllHabits = async () => {
    const colRef = collection(db, "habits");

    try {
      const docRef = await getDocs(colRef);

      const docs = [];
      docRef.forEach((doc) => {
        if (innerHabitId === doc.id)
          setInnerHabit({
            ...doc.data(),
            id: doc.id,
          });

        if (middleHabitId === doc.id)
          setMiddleHabit({
            ...doc.data(),
            id: doc.id,
          });

        if (outerHabitId === doc.id)
          setOuterHabit({
            ...doc.data(),
            id: doc.id,
          });

        docs.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      setHabits(docs);
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  };

  return (
    <OverviewContext.Provider
      value={{
        habits,
        innerHabit,
        middleHabit,
        outerHabit,
        selectedDay,
        setSelectedDay,
      }}
    >
      {children}
    </OverviewContext.Provider>
  );
};

export const useOverview = () => useContext(OverviewContext);

export default OverviewProvider;
