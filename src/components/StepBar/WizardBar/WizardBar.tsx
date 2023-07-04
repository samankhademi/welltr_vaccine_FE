import React from "react";

// styles
import "./WizardBar.css";

const WizardBar = ({ percentage = 0, count = 3 }) => {
  const gp = 100 / count;
  return (
    <div
      className="wizard-bar"
      style={{ left: `calc(${gp}% / 2)`, width: `calc(100% - ${gp}%)` }}
    >
      <div
        style={{ width: `${percentage}% ` }}
        className="wizard-bar-progress"
      />
    </div>
  );
};

export default WizardBar;
