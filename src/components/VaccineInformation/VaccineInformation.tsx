import React, { forwardRef, Ref } from "react";
import { ReactElement } from "react";
import { Container, Row, Col, InputGroup, FormControl, Button, Spinner } from "react-bootstrap";
import styles from "./VaccineInformation.module.css";
import { useTranslation } from "react-i18next";
import baseStyles from "styles/base.module.css";
import { useState } from "react";
import { VaccineFormData } from "pages/Order/orderSlice";
import { useImperativeHandle } from "react";
import { useEffect } from "react";
import * as API from "api";

type VaccineInformationProps = {
    vaccineInitialData: VaccineFormData
}

export type VaccineInformationHandleMethods = {
    getVaccineForm: () => VaccineFormData
}

const VaccineInformation = ({vaccineInitialData}: VaccineInformationProps,
    ref: Ref<VaccineInformationHandleMethods>): ReactElement => {

    const [loading, setLoading] = useState<boolean>(false);

    const [vaccineForm, setVaccineForm] = useState<VaccineFormData>({
        center: "",
        type: ""
    });
    
    const [vaccibeCenters, setVaccineCenters] = useState<API.VaccineCenter[]>([]);

    const [vaccineTypes, setVaccineTypes] = useState<API.VaccineType[]>([]);

    useImperativeHandle(ref, () => ({
        getVaccineForm(): VaccineFormData {
            return vaccineForm;
        },
    }));

    useEffect(() => {
        setVaccineForm(vaccineInitialData);
        setLoading(true);
        API.fetchVaccineCenters().then(response => {
            setVaccineCenters(response.data.content);
        }).finally(() => {
            setLoading(false);
        });
        API.fetchVaccineTypes().then(response => {
            setVaccineTypes(response.data.content);
        });
    }, [])
    
    const {t} = useTranslation();

    return <Container>
                <Row className={styles.vaccine_info_item}>
                    <Col className={styles.vaccine_info_title}>
                        {t("vaccineInfo")}
                    </Col>
                </Row>
                <Row className={styles.vaccine_info_item}>
                    <Col md={{span: 8, offset: 2}}>
                        {t("vaccineDesc")}
                    </Col>
                </Row>
                <Row className={styles.vaccine_info_item}>
                    <Col md={{span: 8, offset: 2}}>
                        <Row>
                            <Col md={6}>
                                {
                                    loading ?
                                        <div style={{marginTop: "20px"}}>
                                            <Spinner animation="border"/>
                                        </div>
                                        :
                                        <>
                                            <label
                                                className={baseStyles.input_label}
                                                htmlFor="basic-url">
                                                    {t("vaccineCenter")}
                                                </label>
                                            <InputGroup className="mb-3">
                                                <FormControl
                                                    value={vaccineForm.center}
                                                    name="center"
                                                    onChange={(event) => setVaccineForm({
                                                        ...vaccineForm,
                                                        center: event.target.value
                                                    })}
                                                    className={baseStyles.input}
                                                    as="select">
                                                    <option>{t("selectAirport")}</option>
                                                    {
                                                        vaccibeCenters.map(item => (
                                                            <option value={item.id}>{item.name}</option>
                                                        ))
                                                    }
                                                </FormControl>
                                            </InputGroup>
                                        </>
                                }
                            </Col>
                            <Col md={6}>
                                <label
                                    className={baseStyles.input_label}
                                    htmlFor="basic-url">
                                        {t("vaccineType")}
                                    </label>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        value={vaccineForm.type}
                                        name="type"
                                        onChange={(event) => setVaccineForm({
                                            ...vaccineForm,
                                            type: event.target.value
                                        })}
                                        className={baseStyles.input}
                                        as="select">
                                        <option>{t("selectVaccine")}</option>
                                        {
                                            vaccineTypes.map(item => (
                                                <option value={item.id}>{item.vaccine_type}</option>
                                            ))
                                        }
                                    </FormControl>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
        </Container>
}

export default forwardRef(VaccineInformation);
