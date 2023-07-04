import React, {ReactElement, Fragment} from "react";
import styles from "./StepBar.module.css";
import Step, {StepStatus} from "./Step/Step";
import Line from "./Line/Line";


function makeUuid(): string {
    let text: string = "";
    const possible: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }


export type StepItem = {
    id: string,
    text: string,
    status: StepStatus,
    isTextSelected: boolean
}

export type StepBarProps = {
    steps: StepItem[],
    onStepClick: (id: string) => void
}

function StepBar(props: StepBarProps): ReactElement {
    return (
        <div className={styles.step_bar}>
            {
                props.steps.map((step, stepIndex) => (
                    <Fragment key={makeUuid()}>
                        <Step
                            id={stepIndex + 1}
                            onClick={() => props.onStepClick(step.id)}
                            status={step.status}
                            isTextSelected={step.isTextSelected}
                            text={step.text}/>
                        {
                            (stepIndex + 1 !== props.steps.length) &&
                                <Line isDone={(step.status === StepStatus.DONE)}/>
                        }
                    </Fragment>
                ))
            }
        </div>
    )
}

export default StepBar;
