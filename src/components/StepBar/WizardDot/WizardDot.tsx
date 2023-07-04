import React from "react";
// import { Sprite } from "components/UI";
// styles
// import "./WizardDot.scss";

interface WizardDotProps {
  variant: string;
}

const WizardDot = ({ variant }: WizardDotProps) => {
  if (variant === "current")
    // return <Sprite name={"sprite"} imageName={"current-step"} />;
    return <span>current</span>;
  if (variant === "completed")
    // return <Sprite name={"sprite"} imageName={"completed-step"} />;
    return <span>completed</span>;
  // return <Sprite name={"sprite"} imageName={"next-steps"} />;
  return <span>next</span>;
};

export default WizardDot;
