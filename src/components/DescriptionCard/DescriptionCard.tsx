import React, { ReactElement } from "react";
import styles from "./DescriptionCard.module.css";

type DescriptionCardProps ={
    title: string,
    text: string
}

function DescriptionCard(props: DescriptionCardProps): ReactElement {
    return (
        <div className={styles.desc_container}>
            <div className={styles.desc_title}>
                {props.title}
            </div>
            <div className={styles.desc_text}>
                {props.text}
            </div>
        </div>
    )
}

export default DescriptionCard;
