import { TextInput, View, Text } from "react-native";
import React, { useState } from "react";
import colors from "config/colors";
import Animated, { Layout } from "react-native-reanimated";
import ConditionalError from "components/text/ConditionalError";

const Input = ({
  className = "",
  label = "",
  onChangeText,
  error,
  placeholder = "Hit the gym",
  ...rest
}) => {
  const [active, setActive] = useState(false);
  return (
    <Animated.View
      className={`flex w-full ${label !== "" && "space-y-2"} ${className}`}
      {...rest}
    >
      {label !== "" ? (
        <Animated.Text
          layout={Layout.easing()}
          className={`text-text_primary text-lg font-bold ${
            error && "text-error"
          }`}
        >
          {label}
        </Animated.Text>
      ) : (
        <></>
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.text_secondary}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className={`rounded-xl font-medium bg-tertiary ${
          error !== undefined
            ? "border-error"
            : active
            ? "border-highlight_primary"
            : "border-secondary"
        } border-2 p-3`}
        onChangeText={onChangeText}
      />
      <ConditionalError error={error} />
    </Animated.View>
  );
};

export default Input;
