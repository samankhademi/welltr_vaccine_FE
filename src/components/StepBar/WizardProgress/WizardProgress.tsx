import React from "react";

// components
import WizardDot from "../WizardDot";
import WizardBar from "../WizardBar";

// styles
import "./WizardProgress.css";

interface WizardProgressProps {
  count: number;
  step: number;
}

const WizardProgress = ({ count = 5, step = 0 }: WizardProgressProps) => {
  const getVariant = (id: number): string => {
    if (id < step) return "completed";
    else if (id === step) return "current";
    else return "next-steps";
  };

  return (
    <div className="wizard-progress">
      <ul className={"wizard-progress_list"}>
        <WizardBar count={count} percentage={(100 / (count - 1)) * step} />

        {Array.from(Array(count), (e, i) => (
          <li key={i} className={"wizard-progress_list_item"}>
            <WizardDot variant={getVariant(i)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WizardProgress;
