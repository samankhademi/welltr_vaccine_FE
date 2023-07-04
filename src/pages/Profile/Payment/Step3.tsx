import React, {ReactElement, useEffect, useRef, useState} from "react";
import {Button, Col, Container, FormControl, InputGroup, Modal, Row, Table} from "react-bootstrap";
import styles from "./Step2.module.css";
import baseStyles from "styles/base.module.css";

import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import Toaster, { ToasterHandleMethods } from "components/Toaster/Toaster";
import {PaymentTypes} from "./Payment";
import CopyToClipboard from "react-copy-to-clipboard";
import {ReactComponent as CopyIcon} from "../../../assets/copy.svg";
import Ellipsis from "../../../components/Ellipsis/Ellipsis";
import * as API from "../../../api";
import {ReactComponent as Offline} from "./assets/offline.svg";
import {ReactComponent as Online} from "./assets/online.svg";
import {ReactComponent as Usdt} from "./assets/usdt.svg";
import {fetchOrder} from "../profileSlice";
import QrCode from "assets/qrcode.png";

let pullOrderInterval: any;
const maxOrderInquiry: number = 40;

type PropsTypes = {
    onNext?: any,
}

const Step3 = (props: PropsTypes): ReactElement => {

    const {t} = useTranslation();

    const dispatch = useDispatch();

    const [showError, setShowError] = useState({
        show: false,
        message: "",
        title: ""
    });
    const order = useSelector((state: RootState) => state.profile.order.data);
    const toasterRef = useRef<ToasterHandleMethods>(null);
    const [paymentType, setPaymentType] = useState<PaymentTypes>(PaymentTypes.USDT);
    const [exhanges, setExchanges] = useState<API.ExhangeListApi[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [transactionCode, setTransactionCode] = useState("");
    const [showUsdtMessage, setShowUsdtMessage] = useState(false);
    const [exchangeError, setExchangeError] = useState({
        error: false,
        message: ""
    });
    const [showExchangeDetail, setShowExchangeDetail] = useState<boolean>(false);
    const [loadingCounter, setLoadingCounter] = useState(0);
    const orderLoading = useSelector((state: RootState) => state.profile.order.fetching);

    useEffect(() => {
        if (orderLoading) {
            setLoadingCounter(loadingCounter + 1);
        }
    }, [orderLoading]);

    useEffect(() => {
//        dispatch(fetchOrder());
        fetchExhanges();
        pullOrderInterval = setInterval(() => {
            if (loadingCounter < maxOrderInquiry) {
                dispatch(fetchOrder());
            }
        }, 5000);
        return () => {
            clearInterval(pullOrderInterval);
        }
    }, []);

    const handleClose = () => {
        setShowError({
            show: false,
            message: "",
            title: ""
        })
    }
    function isFloat(n: number | undefined){
        if (n) {
            let regexPattern = /^-?[0-9]+$/;
            // check if the passed number is integer or float
            let result = regexPattern.test(String(n));
            return !result;
        }
        return 0
    }

    const getPaymentAmount = (): number => {
        if (paymentType === PaymentTypes.PARTIAL) {
            return Number(order.amount) * 0.2;
        }
        if (paymentType === PaymentTypes.USDT) {
            if (isFloat(Number(order.amount) * 1.15)) {
                const num: any = Number(Number(order.amount) * 1.15);
                return num.toFixed(2);
            }
            return Number(order.amount) * 1.15;
        }
        return (order.amount) ? order.amount : 0;
    }

    const onPaymentClickHandler = () => {
        handleClose();
        setLoading(true);
        API.getPaymentLink(order.id, paymentType).then(response => {
            if (response.data.statusCode === 200) {
                window.location.href = response.data.content.PaymentLink;
            } else {
                setShowError({
                    show: true,
                    message: response.data.statusMessage,
                    title: t("paymentError")
                })
            }
        }).catch((error) => {
            if (error.response) {
                setShowError({
                    show: true,
                    message: error.response.data.statusMessage,
                    title: t("paymentError")
                })
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    const fetchExhanges = (): void => {
        setLoading(true);
        API.fetchExchangeList()
            .then(response => {
                if (response.data.statusCode === 200) {
                    setExchanges(response.data.content);
                } else {
                    setShowError({
                        show: true,
                        message: response.data.statusMessage,
                        title: t("getExchangesError")
                    })
                }
            }).catch(error => {
            if (error.response) {
                setExchangeError({
                    error: true,
                    message: error.response.data.statusMessage
                })
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    function setUsdtTransaction(): void {
        API.paymentByUsdt(transactionCode).then(response => {
            setShowUsdtMessage(true);
        }).catch((error) => {
            if (error.response) {
                setShowError({
                    show: true,
                    message: error.response.data.statusMessage,
                    title: t("usdtPaymentError")
                })
            }
        })
    }

    return (
            <>
                <Modal show={showError.show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{showError.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{showError.message}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            {t("close")}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={
                                (showError.title === t("paymentError")) ? onPaymentClickHandler : setUsdtTransaction
                            }
                        >
                            {t("tryAgain")}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {
                    showUsdtMessage &&
                    <Modal show={true} onHide={() => setShowUsdtMessage(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("usdtPayment")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{t("usdtPaymentMessage")}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowUsdtMessage(false)}>
                                {t("close")}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                }

                <Toaster ref={toasterRef}/>
                    <>
                    <div className={styles.price_desc}>
                        {t("paymentText")}
                    </div>
                    <div className={styles.payment_type}>
                        <div className={styles.payment_item}>
                            <div
                                style={{height: "auto"}}
                                onClick={() => setPaymentType(PaymentTypes.USDT)}
                                className={paymentType === PaymentTypes.USDT ? styles.payment_item_active : ''}
                            >
                                <Usdt className={styles.payIcon} />
                                {t("usdtPayment")}
                            </div>
                        </div>

                        <div className={styles.payment_item}>
                            <div
                                style={{height: "auto"}}
                                onClick={() => setPaymentType(PaymentTypes.OFFLINE)}
                                className={paymentType === PaymentTypes.OFFLINE ? styles.payment_item_active : ''}
                            >
                                <Offline className={styles.payIcon} />
                                {t("offlinePayment")}
                            </div>
                        </div>
                        <div className={`${styles.payment_item} ${styles.payment_item_disabled}`}>
                            <div
                                style={{height: "auto"}}
                                onClick={() => setPaymentType(PaymentTypes.FULL)}
                                className={paymentType === PaymentTypes.FULL ? styles.payment_item_active : ''}
                            >
                                <Online className={styles.payIcon} />
                                {t("fullPayment")}
                            </div>
                        </div>

                    </div>
                    {
                        (paymentType === PaymentTypes.FULL) && <div>
                            <div dir="auto" className={styles.price}>
                                {t("payableAmount")} : <span dir="auto" style={{color: "#1a759f"}}>€{getPaymentAmount()}</span>
                            </div>

                            <div className={`${styles.actionHolder} ${styles.finalize}`}>
                                <Button
                                    className={styles.next_step}
                                    variant="primary">
                                    {t('Finalize & Pay')}
                                </Button>
                            </div>

                        </div>
                    }
                    {
                        (paymentType === PaymentTypes.OFFLINE) &&
                            <div>
                                <div dir="auto" className={styles.price}>
                                    {t("payableAmount")}: <span dir="auto" style={{color: "#1a759f"}}>€{getPaymentAmount()}</span>
                                </div>

                                <div className={styles.price_desc2}>
                                    {t("offlineTitle")}
                                </div>
                                <CopyToClipboard
                                    text={
                                        (order.code) ?
                                            order.code : ""
                                    }
                                    onCopy={
                                        () => {
                                            toasterRef.current?.onShowToaster(t("textCopied"))
                                        }
                                    }>
                                    <div className={styles.copy_container}>
                                        <div>{order.code}</div>
                                        <div style={{marginLeft:"auto"}}>
                                            <CopyIcon/>
                                        </div>
                                    </div>
                                </CopyToClipboard>
                                {(exhanges.length !== 0 && paymentType === PaymentTypes.OFFLINE) && loading ?
                                    <Ellipsis marginTop="50px"/>
                                    :
                                    <div style={{width: "100%", overflow: "auto"}}>
                                        <Table
                                            className={styles.exchange_table}
                                            striped bordered hover>
                                            <thead>
                                            <tr>
                                                <th>{t("name")}</th>
                                                <th>{t("state")}</th>
                                                <th>{t("address")}</th>
                                                <th>{t("phoneNumber")}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                exhanges.map((exchange) => (
                                                    <tr key={exchange.id}>
                                                        <td>{exchange.name}</td>
                                                        <td>{exchange.state}</td>
                                                        <td>{exchange.address}</td>
                                                        <td>{exchange.phone}</td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </Table>
                                    </div>
                                }

                            </div>
                    }
                    {
                        paymentType === PaymentTypes.USDT &&
                        <>
                            {
                                (order.usdt_token) ?
                                    <div style={{color: "orangered", fontWeight:"bold"}} className={styles.price_desc}>
                                        {t("usdtPaymentMessage")}
                                    </div>
                                    :
                                    <>
                                        <div dir="auto" className={styles.price}>
                                            {t("payableAmount")}: <span dir="auto" style={{color: "#1a759f"}}>
                                                    {
                                                        getPaymentAmount()
                                                    } {t("usdt")}</span>
                                        </div>

                                        <div className={styles.price_desc}>
                                            {t("usdtStep1Title")}
                                            <div className={styles.price_desc_sub}>
                                                {t("usdtStep1Text")}
                                            </div>
                                        </div>
                                        <div className={styles.price_desc}>

                                            <img src={QrCode} style={{
                                                display: "block",
                                                width: "200px",
                                                height: "200px",
                                                margin: "auto"
                                            }}/>

                                        </div>
                                        <CopyToClipboard
                                            text={
                                                "TUMLAZvL9cPZNq4AedS94hPp7dYwGwDAi3"
                                            }
                                            onCopy={
                                                () => {
                                                    toasterRef.current?.onShowToaster(t("textCopied"))
                                                }
                                            }>
                                            <div className={styles.copy_container}>
                                                <Container fluid>
                                                    <Row>
                                                        <Col md={10}>
                                                            <div style={{overflowWrap: "break-word"}}>TUMLAZvL9cPZNq4AedS94hPp7dYwGwDAi3</div>
                                                        </Col>
                                                        <Col md={2} style={{display: "flex"}}>
                                                            <div style={{marginLeft:"auto"}}>
                                                                <CopyIcon/>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </div>
                                        </CopyToClipboard>
                                        <div className={styles.price_desc}>
                                            {t("usdtStep2Title")}
                                            <div className={styles.price_desc_sub}>
                                                {t("usdtStep2Text")}
                                            </div>

                                        </div>
                                        <div className={styles.price_desc}>
                                            <Row>
                                                <Col md={8}>
                                                    <label
                                                        className={baseStyles.input_label}
                                                        htmlFor="basic-url">{t("transactionCode")}</label>
                                                    <InputGroup>
                                                        <FormControl
                                                            value={transactionCode}
                                                            name="transactionCode"
                                                            onChange={(event) => setTransactionCode(event.target.value)}
                                                            className={baseStyles.input}
                                                            id="basic-url"
                                                            aria-describedby="basic-addon3" />
                                                        <InputGroup.Append>
                                                            <Button
                                                                onClick={() => setUsdtTransaction()}
                                                                variant="success">
                                                                {t("iPaid")}
                                                            </Button>
                                                        </InputGroup.Append>

                                                    </InputGroup>
                                                </Col>
                                                <Col md={3}>
                                                </Col>
                                            </Row>
                                        </div>
                                    </>
                            }
                        </>
                    }
                    </>
            </>
    )
}

export default Step3;
