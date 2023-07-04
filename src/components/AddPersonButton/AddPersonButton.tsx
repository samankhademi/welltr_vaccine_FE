import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import styles from "./AddPersonButton.module.css";
import {ReactComponent as PlusIcon} from "./assets/plus.svg";

type AddPersonButtonProps = {
    onClick: () => void
}

function AddPersonButton(props: AddPersonButtonProps): ReactElement {

    const {t} = useTranslation();

    return <div 
                onClick={props.onClick}
                className={styles.button_container}>
        <PlusIcon className={styles.add_icon}/>
        {t("addPerson")}
    </div>
}

export default AddPersonButton;
