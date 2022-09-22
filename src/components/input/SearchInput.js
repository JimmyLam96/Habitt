import { View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import colors from "config/colors";
import ConditionalError from "components/text/ConditionalError";

const SearchInput = ({
  className = "",
  placeholder = "Search",
  onChangeText = (input = "") => {},
  error = undefined,
  ...rest
}) => {
  const [active, setActive] = useState(false);
  return (
    <View className="space-y-2">
      <View
        className={`flex flex-row flex-1 border-2 rounded-xl space-x-2 p-2 items-center ${
          active
            ? "border-highlight_primary"
            : error
            ? "border-error"
            : "border-secondary"
        } ${className}`}
        {...rest}
      >
        <FontAwesome name="search" size={18} color={colors.secondary} />
        <TextInput
          onChangeText={onChangeText}
          placeholder={placeholder}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        />
      </View>
      <ConditionalError error={error} />
    </View>
  );
};

export default SearchInput;
