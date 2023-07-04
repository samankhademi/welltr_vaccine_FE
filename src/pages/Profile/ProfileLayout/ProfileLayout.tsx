import React, { PropsWithChildren, ReactNode } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ReactElement } from "react-bootstrap/node_modules/@types/react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "store/store";
import styles from "./ProfileLayout.module.css";

type ProfileLayoutProps = {
    
} & PropsWithChildren<ReactNode>;

const ProfileLayout = (props: ProfileLayoutProps): ReactElement => {

    const order = useSelector((state: RootState) => state.profile.order);

    const history = useHistory();

    const {t, i18n} = useTranslation();

    const isMenuActive = (route: string): boolean => {
        return route === history.location.pathname;
    }

    return <Container className={styles.containerHolder}>
        {props.children}
    </Container>
}

export default ProfileLayout;
