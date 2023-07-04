import Line from "components/Line/Line";
import i18n from "i18n/i18n";
import React, {
    ReactElement,
    PropsWithChildren,
    ReactNode
} from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./Popup.module.css";

type PopupProps = {
    onSubmitClick?: () => void,
    onCancelClick?: () => void,
    loading?: boolean,
    width?: string,
    submitText?: string,
    disabled?: boolean
} & PropsWithChildren<ReactNode>;

const Popup = ({
    children,
    loading = false,
    width = "70%",
    onSubmitClick = () => {},
    onCancelClick = () => {},
    disabled = false,
    submitText = i18n.t("save")
}: PopupProps): ReactElement => {

    const {t} = useTranslation();

    return (
        <div className={styles.backdrop}>
            <div style={{width: width}} className={`${styles.content} popup_holder`}>
                {children}
                <Row>
                    <Col md={{span: 12}}>
                        <Line/>
                    </Col>
                </Row>
                <div className={styles.actionArea}>
                    <Button
                        onClick={() => onCancelClick()}
                        className={styles.vaccine_info_button}
                        variant="outline-secondary">
                        {t("cancel")}
                    </Button>
                    <Button
                        disabled={loading || disabled}
                        onClick={() => onSubmitClick()}
                        className={styles.vaccine_info_button}>
                            {
                                loading ? <Spinner animation="border"/>
                                : submitText
                            }
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Popup;
