import React from "react";
import { ReactElement } from "react";
import {  Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import styles from "./OrderCard.module.css";
import OrderInfoItem from "./OrderInfoItem/OrderInfoItem";
import { OrderStatus } from "api";


interface DoseInfo {
    vaccineDate?: string,
    vaccineCenter?: string,
    vaccineType?: string
}

type OrderCardProps = {
    margin?: string
}

const OrderCard = ({margin = "0"}: OrderCardProps): ReactElement => {

    const order = useSelector((state: RootState) => state.profile.order);


    const {t, i18n} = useTranslation();

    async function downloadImage(imageSrc: string) {
        const image = await fetch(imageSrc)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)
      
        const link = document.createElement('a')
        link.href = imageURL
        link.download = 'qrcode.jpg'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getDoseInfo = (): DoseInfo => {
        switch(order.data.status) {
            case OrderStatus.WAITING_FOR_RECEIVING_FIRST_DOSE:
                return {
                    vaccineCenter: (order.data.vaccine.center_name) ?
                        order.data.vaccine.center_name : "",
                    vaccineType: order.data.vaccine.type,
                    vaccineDate: (order.data.dose1) ? order.data.dose1.arrival_date : ""
                }
                case OrderStatus.DONE:
                    return {
                        vaccineCenter: "",
                        vaccineDate: order.data.dose1_vaccination_date,
                        vaccineType: ""
                    }

            default:
                return {
                    vaccineCenter: (order.data.dose1) ? order.data.dose1.vaccine_center?.name : "",
                }
        }
    }
    const getDoseTitle = (): DoseInfo => {
        switch(order.data.status) {
            case OrderStatus.WAITING_FOR_RECEIVING_FIRST_DOSE:
                return t('arrivalDate')
            case OrderStatus.DONE:
                    return t('vaccinationDate')
            default:
                return t('arrivalDate')
        }
    }
    const fallBackLang = function (lang:string){
        return lang === 'es' ? 'en' : lang
    }

    return (
        <Container style={{margin: margin}} className={styles.order_card}>
            <Row>
                <Col md={9}>
                    <div className={styles.dose_container}>
                        <div className={styles.dose_date}>
                            {getDoseTitle()}: {getDoseInfo().vaccineDate}
                        </div>
                    </div>
                    <div className={styles.info_container}>
                        <OrderInfoItem
                            // items={[
                            //     {
                            //         title: t("vaccineCenterTitle"),
                            //         values: [
                            //             getFirstDoseInfo().vaccineCenter
                            //         ]
                            //     },
                            //     {
                            //         title: t("vaccineTypeTitle"),
                            //         values: [
                            //             getFirstDoseInfo().vaccineType
                            //         ]
                            //     }
                            // ]}
                            items={[
                                {
                                    title: t("hotelName"),
                                    values: [order.data.hotel_package?.hotel_name],
                                    size: 6
                                },
                                {
                                    title: t("package"),
                                    values: order.data.hotel_package ? [order.data.hotel_package['room_type_' + fallBackLang(i18n.language)]] : [],
                                    size: 6
                                },
                                {
                                    title: t("description"),
                                    values: order.data.hotel_package ? [order.data.hotel_package['desc_' + fallBackLang(i18n.language)]] : [],
                                    size: 12
                                },
                                {
                                    title: t("address"),
                                    values: order.data.hotel_package ? [order.data.hotel_package['address_' + fallBackLang(i18n.language)]] : [],
                                    size: 12
                                },

                            ]}
                            title={t("vaccineInfo")}/>
                        
                        <OrderInfoItem
                            margin="40px 0 0 0"
                            items={[
                                {
                                    title: t("name"),
                                    values: order.data.persons.map(person => person.name)
                                },
                                {
                                    title: t("passportNo"),
                                    values: order.data.persons
                                        .map(person => person.passportNumber)
                                }
                            ]}
                            title={t("recipients")}/>
                    </div>
                </Col>
                <Col md={3}>
                    <div className={styles.qr_container}>
                        {
                            order.data.id && 
                            <img src={"/api/v1/order/qrcode/" + order.data.id}/>
                        }
                        {/* <div className={styles.health_code_container}>
                            <div>89Df56</div>
                            <div style={{marginLeft:"auto"}}><CopyIcon/></div>
                        </div> */}
                        <div onClick={() => downloadImage("/api/v1/order/qrcode/" + order.data.id)} className={styles.download_button}>
                            {t("downloadQR")}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default OrderCard;
