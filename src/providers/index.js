import React from "react";
import { TailwindProvider } from "tailwindcss-react-native";
import OverviewProvider from "./OverviewProvider";
import UserProvider from "./UserProvider";

const Providers = ({ children }) => {
  const providers = [TailwindProvider, UserProvider, OverviewProvider];
  return providers.reduceRight((acc, Comp) => <Comp>{acc}</Comp>, children);
};

export default Providers;
