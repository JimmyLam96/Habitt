import React from "react";
import Animated, {
  FadeInDown,
  FadeOutDown,
  FadeOutUp,
} from "react-native-reanimated";

const ConditionalError = ({ className, error, ...rest }) => {
  if (!error) return null;

  return (
    <Animated.Text
      className={`text-error font-semibold ${className}`}
      entering={FadeInDown}
      exiting={FadeOutDown}
      {...rest}
    >
      {error}
    </Animated.Text>
  );
};

export default ConditionalError;
