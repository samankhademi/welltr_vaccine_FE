import { OrderStatus } from "api";
import OrderCard from "components/OrderCard/OrderCard";
import Page from "components/Page/Page";
import React from "react";
import { useEffect } from "react";
import { ReactElement } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "store/store";
import { useGuard } from "utils/hooks";
import ProfileLayout from "../ProfileLayout/ProfileLayout";
import { fetchOrder } from "../profileSlice";
import styles from "./Orders.module.css";
import {ReactComponent as Success} from "../../../assets/icons/success.svg";

const Orders = (): ReactElement => {

    useGuard();

    const {t} = useTranslation();

    const dispatch = useDispatch();

    const order = useSelector((state: RootState) => state.profile.order.data);

    const history = useHistory();

    useEffect(() => {
        dispatch(fetchOrder());
    }, []);

    useEffect(() => {
        if (order.status && order.status === OrderStatus.OPEN) {
            history.push("/profile/payment");
        } else if (order.status && order.status === OrderStatus.WAITING_FOR_SETTING_FIRST_DOSE) {
            history.push("/profile/complete-order");
        }
    });

    const getOrderTitle = (): string => {
        switch (order.status) {
            case OrderStatus.WAITING_FOR_RECEIVING_FIRST_DOSE:
                return t("dose1Info");
            case OrderStatus.WAITING_FOR_SETTING_SECOND_DOSE:
                return t("dose2SetInfo");
            case OrderStatus.WAITING_FOR_RECEIVING_SECOND_DOSE:
                return t("dose2Info");
            case OrderStatus.DONE:
                return t("doseDoneInfo");
            default:
                return "";
        }
    }

    return (
        <Page
            isSignInEnable={false}
            isSignOutEnable={true}>
            <ProfileLayout>
                <div>
                <Row>
                    <Col md={12}>
                        <Success className={styles.icon}/>
                    </Col>
                    <Col
                        className={styles.order_title}
                        md={{span: 8, offset: 2}}>
                        {getOrderTitle()}
                    </Col>
                </Row>
                
                <OrderCard margin="40px 0 40px 0"/>
                </div>
            </ProfileLayout>
        </Page>
    )
}

export default Orders;
