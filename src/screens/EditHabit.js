import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import ReturnButton from "components/buttons/ReturnButton";
import randomColor from "randomcolor";
import { TouchableOpacity } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from "react-native-reanimated";
import moment from "moment";
import TextInput from "components/input/TextInput";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import RepeatOnView from "components/views/RepeatOnView";
import Checkbox from "components/buttons/Checkbox";

const colors = randomColor({ count: 200 });

const EditHabit = ({
  route: {
    params: {
      id,
      title,
      completed,
      startDate,
      endDate,
      repeatOn,
      color,
      startTime,
      endTime,
    },
    ...rest
  },
}) => {
  const [selectedColor, setSelectedColor] = useState(color);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [timeModalActive, setTimeModalActive] = useState(false);
  const [timeType, setTimeType] = useState("anytime");

  const [edited, setEdited] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editStartDate, setEditStartDate] = useState(false);
  const [editEndDate, setEditEndDate] = useState(false);
  const [editStartTime, setEditStartTime] = useState(false);
  const [editEndTime, setEditEndTime] = useState(false);

  const [editedTitle, setEditedTitle] = useState();
  const [editedStartDate, setEditedStartDate] = useState(startDate.toDate());
  const [editedEndDate, setEditedEndDate] = useState(endDate.toDate());
  const [editedRepeatOn, setEditedRepeatOn] = useState(repeatOn);
  const [editedStartTime, setEditedStartTime] = useState(
    startTime ? startTime.toDate() : new Date()
  );
  const [editedEndTime, setEditedEndTime] = useState(
    endTime ? endTime.toDate() : new Date()
  );

  const navigation = useNavigation();

  const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

  useEffect(() => {
    let isMounted = true;

    if (isMounted)
      setEdited(
        (editedTitle && editedTitle !== title) ||
          editedStartDate.getTime() !== startDate.toDate().getTime() ||
          editedEndDate.getTime() !== endDate.toDate().getTime() ||
          editedRepeatOn.length !== repeatOn.length ||
          editedRepeatOn.some(
            (x) => !repeatOn.includes(x) || selectedColor !== color
          ) ||
          (startTime &&
            editedStartTime.getTime() !== startTime.toDate().getTime()) ||
          (endTime && editedEndTime.getTime() !== endTime.toDate().getTime())
      );

    return () => {
      isMounted = false;
    };
  }, [
    editedTitle,
    editedStartDate,
    editedEndDate,
    editedRepeatOn,
    selectedColor,
  ]);

  const handleEdit = async () => {
    setLoading(true);
    if (verifyInput && edited) {
      const docRef = doc(db, "habits", id);

      const update = {
        ...(editedTitle && editedTitle !== title && { title: editedTitle }),
        ...(editedStartDate.getTime() !== startDate.toDate().getTime() && {
          startDate: editedStartDate,
        }),
        ...(editedEndDate.getTime() !== endDate.toDate().getTime() && {
          endDate: editedEndDate,
        }),
        ...(selectedColor !== color && { color: selectedColor }),
        ...((editedRepeatOn.length !== repeatOn.length ||
          editedRepeatOn.some((x) => !repeatOn.includes(x))) && {
          repeatOn: editedRepeatOn,
        }),
      };

      try {
        await updateDoc(docRef, update);

        setLoading(false);
        navigation.goBack();
      } catch (e) {
        console.error(e);
      }
    } else {
      setLoading(false);
    }
  };

  const verifyInput = () => {
    // Validate
    let errors = {};

    if (editTitle && (!editedTitle || editedTitle) === "") {
      errors.title = "Title can not be empty";
    }

    setErrors(errors);

    // return true if there are no errors else false
    return Object.keys(errors).length === 0;
  };

  const handleSetDays = (day) => {
    if (editedRepeatOn.some((x) => x === day)) {
      setEditedRepeatOn(editedRepeatOn.filter((x) => x !== day));
    } else {
      setEditedRepeatOn([...editedRepeatOn, day]);
    }
  };

  const showAlert = () =>
    Alert.alert(
      "Delete habit?",
      "Are you sure you would like to delete this habit?",
      [
        {
          text: "Cancel",
        },
        { text: "Delete", onPress: handleDelete },
      ]
    );

  const handleDelete = async () => {
    const docRef = doc(db, "habits", id);
    try {
      await deleteDoc(docRef);
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="flex-1 justify-between">
      <ReturnButton />

      <View className="space-y-4 p-7 flex-1 justify-end">
        {/* Header */}
        <Animated.Text
          layout={Layout.easing()}
          className="font-bold text-4xl text-text_primary pt-10"
        >
          Edit habit
        </Animated.Text>

        {/* Color section */}
        <Animated.Text layout={Layout.easing()} className="text-lg font-bold">
          Color
        </Animated.Text>
        <Animated.View layout={Layout.easing()} className="overflow-visible">
          <AnimatedFlatlist
            layout={Layout.easing()}
            contentContainerStyle={{
              paddingLeft: 10,
              paddingBottom: 15,
            }}
            ItemSeparatorComponent={() => <View className="mx-2" />}
            data={[color, ...colors]}
            horizontal
            renderItem={({ item }) => (
              <View className="flex items-center space-y-2">
                <TouchableOpacity
                  className={`w-36 h-36 rounded-full shadow-md ${
                    selectedColor === item && "border-4 border-primary"
                  }`}
                  style={{
                    backgroundColor: item,
                  }}
                  onPress={() => setSelectedColor(item)}
                />
              </View>
            )}
          />
        </Animated.View>

        {/* Title section */}
        <Animated.View
          layout={Layout.easing()}
          className="flex flex-row justify-between items-center space-x-4"
        >
          <View className="flex-1 space-y-2">
            <Text className="text-lg font-bold">Title</Text>
            {editTitle ? (
              <TextInput
                placeholder={title}
                error={errors.title}
                onChangeText={(input) => {
                  if (input !== "") {
                    setErrors({ ...errors, title: undefined });
                  }
                  setEditedTitle(input);
                }}
              />
            ) : (
              <Text className="font-bold text-base text-text_secondary">
                {title}
              </Text>
            )}
          </View>
          <TouchableOpacity
            className={`${
              editTitle
                ? "bg-error self-end border-error border-2"
                : "bg-secondary"
            } rounded-xl p-3  justify-center`}
            onPress={() => {
              setEditedTitle(undefined);
              setEditTitle(!editTitle);
            }}
          >
            <Text className="text-background">
              {editTitle ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Date section */}
        <Animated.View
          layout={Layout.easing()}
          className="flex flex-row justify-between space-x-3"
        >
          <View className="flex-1 flex-row justify-between items-center space-x-2">
            <View className="space-y-2">
              <Text className="text-lg font-bold">Start date</Text>
              <Text className="font-bold text-base text-text_secondary">
                {moment(editedStartDate).format("DD-MM-YYYY")}
              </Text>
            </View>
            <TouchableOpacity
              className={`${
                editedStartDate.getTime() !== startDate.toDate().getTime()
                  ? "bg-error"
                  : "bg-secondary"
              } rounded-xl p-3 justify-center`}
              onPress={() => {
                if (
                  editedStartDate.getTime() !== startDate.toDate().getTime()
                ) {
                  setEditedStartDate(startDate.toDate());
                } else {
                  setEditStartDate(true);
                  setModalActive(true);
                }
              }}
            >
              <Text className="text-background">
                {editedStartDate.getTime() !== startDate.toDate().getTime()
                  ? "Cancel"
                  : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 flex-row justify-between items-center space-x-2">
            <View className="space-y-2">
              <Text className="text-lg font-bold">End date</Text>
              <Text className="font-bold text-base text-text_secondary">
                {moment(editedEndDate).format("DD-MM-YYYY")}
              </Text>
            </View>
            <TouchableOpacity
              className={`${
                editedEndDate.getTime() !== endDate.toDate().getTime()
                  ? "bg-error"
                  : "bg-secondary"
              } rounded-xl p-3 justify-center`}
              onPress={() => {
                if (editedEndDate.getTime() !== endDate.toDate().getTime()) {
                  setEditedEndDate(endDate.toDate());
                } else {
                  setEditEndDate(true);
                  setModalActive(true);
                }
              }}
            >
              <Text className="text-background">
                {editedEndDate.getTime() !== endDate.toDate().getTime()
                  ? "Cancel"
                  : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Time section */}
        <Animated.Text
          layout={Layout.easing()}
          className="text-text_primary text-lg font-bold"
        >
          Time
        </Animated.Text>
        <Animated.View layout={Layout.easing()} className="flex flex-row">
          <Checkbox
            label="Any time"
            className="w-1/2"
            value={timeType === "anytime"}
            onPress={() => {
              setTimeType("anytime");
            }}
          />
          <Checkbox
            label="Specific"
            className="w-1/2"
            value={timeType === "specific"}
            onPress={() => {
              setTimeType("specific");
            }}
          />
        </Animated.View>

        {timeType === "specific" ? (
          <Animated.View
            layout={Layout.easing()}
            entering={FadeInDown}
            exiting={FadeOutDown}
            className="flex flex-row justify-between space-x-3"
          >
            <View className="flex-1 flex-row justify-between items-center space-x-2">
              <View className="space-y-2">
                <Text className="text-lg font-bold">Start time</Text>
                <Text className="font-bold text-base text-text_secondary">
                  {moment(editedStartTime).format("HH:mm")}
                </Text>
              </View>
              <TouchableOpacity
                className={`${
                  startTime &&
                  editedStartTime.getTime() !== startTime.toDate().getTime()
                    ? "bg-error"
                    : "bg-secondary"
                } rounded-xl p-3 justify-center`}
                onPress={() => {
                  if (
                    startTime &&
                    editedStartTime.getTime() !== startTime.toDate().getTime()
                  ) {
                    setEditedStartTime(startTime.toDate());
                  } else {
                    setEditStartTime(true);
                    setTimeModalActive(true);
                  }
                }}
              >
                <Text className="text-background">
                  {startTime &&
                  editedStartTime.getTime() !== startTime.toDate().getTime()
                    ? "Cancel"
                    : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 flex-row justify-between items-center space-x-2">
              <View className="space-y-2">
                <Text className="text-lg font-bold">End time</Text>
                <Text className="font-bold text-base text-text_secondary">
                  {moment(editedEndTime).format("HH:mm")}
                </Text>
              </View>
              <TouchableOpacity
                className={`${
                  endTime &&
                  editedEndTime.getTime() !== endTime.toDate().getTime()
                    ? "bg-error"
                    : "bg-secondary"
                } rounded-xl p-3 justify-center`}
                onPress={() => {
                  if (
                    endDate &&
                    editedEndTime.getTime() !== endDate.toDate().getTime()
                  ) {
                    setEditedEndTime(endDate.toDate());
                  } else {
                    setEditEndTime(true);
                    setTimeModalActive(true);
                  }
                }}
              >
                <Text className="text-background">
                  {endDate &&
                  editedEndDate.getTime() !== endDate.toDate().getTime()
                    ? "Cancel"
                    : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <></>
        )}

        {/* Repeat on section */}
        <View className="space-y-2">
          <Text className="text-lg font-bold">Repeat on</Text>
          <RepeatOnView days={editedRepeatOn} setDays={handleSetDays} />
        </View>

        {/* Return and Delete buttons */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex justify-center items-center py-3 rounded-2xl bg-error w-1/2"
            onPress={showAlert}
          >
            <Text className="font-semibold">Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex justify-center items-center py-3 rounded-2xl w-1/2 ${
              !loading && "bg-highlight_primary shadow-lg"
            }`}
            onPress={() => {
              edited ? handleEdit() : navigation.goBack();
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text className="font-semibold">
                {edited ? "Save" : "Return"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Date picker modal */}
        <DateTimePickerModal
          isVisible={modalActive}
          onCancel={() => setModalActive(false)}
          onConfirm={(selectedDate) => {
            if (editStartDate) {
              setEditStartDate(false);
              setEditedStartDate(selectedDate);
            } else if (editEndDate) {
              setEditEndDate(false);
              setEditedEndDate(selectedDate);
            }
            setModalActive(false);
          }}
        />

        {/* Time picker modal */}
        <DateTimePickerModal
          mode="time"
          isVisible={timeModalActive}
          onCancel={() => setTimeModalActive(false)}
          onConfirm={(selectedDate) => {
            if (editStartTime) {
              setEditStartTime(false);
              setEditedStartTime(selectedDate);
            } else if (editEndTime) {
              setEditEndTime(false);
              setEditedEndTime(selectedDate);
            }
            setTimeModalActive(false);
          }}
        />
      </View>
    </View>
  );
};

export default EditHabit;
