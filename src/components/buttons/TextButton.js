import React from "react";
import { TouchableOpacity } from "react-native";

const TextButton = ({ className, children, ...rest }) => {
  return (
    <TouchableOpacity
      className={`flex items-center justify-center text-center space-y-1 ${className}`}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

export default TextButton;
