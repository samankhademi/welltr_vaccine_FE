import React, { ReactElement } from "react"
import { Col, Row } from "react-bootstrap";
import styles from "./OrderInfoItem.module.css"

type OrderInfoItemProps = {
    title: string,
    items: {title: string, values: string[], size?: number}[],
    margin?: string
}


const OrderInfoItem = ({title, items, margin}: OrderInfoItemProps): ReactElement => {
    return (
        <div style={{margin: margin}}>
            <div className={styles.info_title}>{title}</div>
            <div className={styles.info_line}></div>
            <Row>
                {
                    items.map((item, index) => (
                        <Col md={item.size ? item.size : 4} key={index}>
                            <div className={styles.info_item_title}>{item.title}</div>
                            {
                                item.values.map((value, index) => (
                                    <div
                                        key={index}
                                        className={styles.info_item_value}>{value}</div>
                                ))
                            }
                        </Col>
                    ))
                }
            </Row>
        </div>
    )
}

export default OrderInfoItem;
