import React from "react";
import { ReactElement } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Line.module.css";

const Line = (): ReactElement => {
    return <Row>
        <Col md={{span: 12, offset: 0}}>
            <div className={styles.line}></div>
        </Col>
    </Row>
}

export default Line;
