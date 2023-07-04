import { StepStatus } from "components/StepBar/Step/Step";
import StepBar from "components/StepBar/StepBar";
import React, { ReactElement, ReactNode } from "react";
import { PropsWithChildren } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./OrderLayout.module.css";
import i18n from "i18next";

type OrderLayoutProps = {
    onNextClick?: () => void,
    onClearClick?: () => void,
    nextText?: string,
    clearText?: string,
    enableSteps: string[],
    hideClearButton?: boolean,
    hideNextButton?: boolean,
    isLoading?: boolean,
    disableNextButton?: boolean,
    onNextDisableClick?: () => void
} & PropsWithChildren<ReactNode>;

function OrderLayout({
    enableSteps,
    clearText = i18n.t("clear"),
    nextText = i18n.t("next"),
    onNextClick = () => {},
    onClearClick = () => {},
    onNextDisableClick = () => {},
    hideClearButton = false,
    hideNextButton = false,
    isLoading = false,
    disableNextButton = false,
    children
}: OrderLayoutProps): ReactElement {

    const {t} = useTranslation();

    return <Container>
        <div className={styles.holder}>
            <div className={styles.step_container}>
                <p className={styles.step_container_title}>{t("orderTitle")}</p>
                <div>
                    <StepBar
                        steps={[
                            {
                                id: "1",
                                text: t("personalInfo"),
                                status: (enableSteps.includes("1")) ?
                                    StepStatus.DONE : StepStatus.UNDONE,
                                isTextSelected: enableSteps.includes("1")
                            },
                            {
                                id: "2",
                                text: t("vaccine"),
                                status: (enableSteps.includes("2")) ?
                                    StepStatus.DONE : StepStatus.UNDONE,
                                isTextSelected: enableSteps.includes("1")
                            },
                            {
                                id: "3",
                                text: t("contact"),
                                status: (enableSteps.includes("3")) ?
                                    StepStatus.DONE : StepStatus.UNDONE,
                                isTextSelected: enableSteps.includes("1")
                            }
                        ]}
                        onStepClick={() => {}} />
                </div>
            </div>
            <div>
                {
                    children
                }
            </div>
            <div className={styles.step_container_buttons}>
                <Button
                    disabled={isLoading}
                    onClick={onClearClick}
                    color={"red"}
                    className={`${styles.step_container_button} ${hideClearButton ? styles.step_container_hide_button : ''}`}
                    variant="outline-dark"
                >
                    {clearText}
                </Button>
                {
                    !hideNextButton &&
                    <Button
                        disabled={isLoading || disableNextButton}
                        onClick={onNextClick}
                        className={styles.step_container_button}
                        variant="primary">
                        <div onClick={onNextDisableClick}>
                            {
                                isLoading ?
                                    <Spinner className={styles.spinner} animation="border"/> :
                                    nextText
                            }
                        </div>
                    </Button>
                }
            </div>
        </div>
    </Container>
}

export default OrderLayout;
