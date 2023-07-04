import React, {ReactElement} from "react";
import styles from "./Line.module.css";

export type LineProps = {
    isDone: boolean
}

export default function (props: LineProps): ReactElement {
    return (
        <div className={[styles.line, props.isDone && styles.line__done].join(" ")}/>
    )
}
