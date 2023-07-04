import React, {ReactElement} from "react";
import styles from "./Step.module.css";

export enum StepStatus {
    UNDONE = "0",
    SELECTED = "1",
    DONE = "2"
}

export type StepProps = {
    status: StepStatus,
    isTextSelected: boolean,
    text: string,
    onClick: () => void,
    id: number
}

export default function (props: StepProps): ReactElement {

    function getStepClass() {
        switch (props.status) {
            case StepStatus.DONE:
                return styles.step__done;
            case StepStatus.SELECTED:
                return styles.step__selected;
            default:
                return null;
        }
    }

    return (
        <div onClick={() => props.onClick()} className={styles.step_wrapper}>
            <div className={[styles.step, getStepClass()].join(" ")}>
                {props.id}
            </div>
            <div className={[styles.text, props.isTextSelected && styles.text__selected].join(" ")}>
                { props.text }
            </div>
        </div>
    )
}
