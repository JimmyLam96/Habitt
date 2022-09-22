import React from "react";
import MainProviders from "providers/index";
import Navigation from "navigation/StackNavigation";

const App = () => {
  return (
    <MainProviders>
      <Navigation />
    </MainProviders>
  );
};

export default App;
