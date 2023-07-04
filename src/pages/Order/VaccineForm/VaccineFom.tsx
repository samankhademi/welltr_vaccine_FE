import Page from "components/Page/Page";
import React, { ReactElement, useEffect, useState } from "react";
import { Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import OrderLayout from "../OrderLayout/OrderLayout";
import baseStyles from "styles/base.module.css";
import styles from "./VaccineForm.module.css";
import { setVaccine, VaccineFormData, vaccineInitialForm } from "../orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { RouteComponentProps } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Api from "api";
import {VaccineCenter, VaccineType, HotelPackageApi} from "api";


type VaccineFormProps = {} & RouteComponentProps;

function VaccineForm(props: VaccineFormProps): ReactElement {

    const {t, i18n} = useTranslation();

    const [vaccineFormData, setVaccineFormData] = useState<VaccineFormData>(vaccineInitialForm);

    const [vaccineCenters, setVaccineCenters] = useState<VaccineCenter[]>([]);

    const [vaccineTypes, setVaccineTypes] = useState<VaccineType[]>([]);

    const dispatch = useDispatch();

    const vaccineData = useSelector((state: RootState) => state.registration.vaccine);

    const personData = useSelector((state: RootState) => state.registration.persons);

    const [groupedPackages, setGroupedPackages] = useState(new Map());

    //check on nights change

    //initial load
    useEffect(() => {
        //check for data

        if(!personData || personData.length < 1 || !personData[0].name || personData[0].name === '') props.history.replace('/order/person')
        setVaccineFormData(vaccineData);
        Api.fetchVaccineTypes().then(response => {
            setVaccineTypes(response.data.content);
        });

        Api.fetchPackages(personData.length).then(response => {
            let groupedData = response.data.content.reduce((r: any, a: any) => {
                r[a.nights_num] = [...r[a.nights_num] || [], a];
                return r;
            }, {});
            const mapGroupedData: any = new Map(Object.entries(groupedData));
            setGroupedPackages(mapGroupedData);

            //check if first time or data was set
            if(!vaccineData.package_uid || vaccineData.package_uid === '') {
                try {
                    setVaccineFormData({
                        ...vaccineFormData,
                        package_uid: mapGroupedData.get(response.data.content[0].nights_num.toString())[0].uuid,
                        selected_night: response.data.content[0].nights_num.toString()
                    })

                }catch (e){
                    setVaccineFormData({
                        ...vaccineFormData,
                        package_uid: "",
                        selected_night: "1"
                    })

                }
            }
        })
    }, []);
    //todo: check validation
    const onNextClickHandler = () => {
        dispatch(setVaccine(vaccineFormData));
        props.history.push("/order/contact");
    }

    const isVaccineFormValid = () => {
        if (vaccineFormData.package_uid === "") {
            return false;
        }
        return true;
    }
    const fallBackLang = function (lang:string){
        return lang === 'es' ? 'en' : lang
    }
    const getRoomTypeText = (hotelPackage: HotelPackageApi) => {
        switch(i18n.language) {
            case "es":
                return hotelPackage.room_type_en
            case "fa":
                return hotelPackage.room_type_fa
            case "tr":
                return hotelPackage.room_type_tr
            default:
                return hotelPackage.room_type_en
        }
    }
    function getSelectedHotel():HotelPackageApi | any{
        return groupedPackages.get(vaccineFormData.selected_night)?.find((hotel: HotelPackageApi) => hotel.uuid === vaccineFormData.package_uid)
    }
    return (
        <Page>
            <OrderLayout
                disableNextButton={!isVaccineFormValid()}
                clearText={t("back")}
                enableSteps={["1", "2"]}
                onNextClick={() => onNextClickHandler()}
                onClearClick={() => props.history.push("/order/person")}>
                <div className={styles.container}>
                    <Row className={styles.title_container}>
                        <Col className='text-center mt-5'>
                            <p className={styles.title_container__text}>
                                {t("vaccineTitle")}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={7}>
                            <Row>
                                <Col md={12}>
                                    <div className={styles.title}>{t('chooseTravelInfo')}</div>
                                </Col>
                                <Col md={12} className={styles.fields}>
                                    <label
                                        className={baseStyles.input_label}
                                        htmlFor="basic-url">
                                        {t("nights")}
                                    </label>
                                    <InputGroup className="mb-2">
                                        <FormControl
                                            value={vaccineFormData.selected_night}
                                            name="night"
                                            onChange={(event) => setVaccineFormData({
                                                ...vaccineFormData,
                                                selected_night: event.target.value,
                                                // todo: check for user chosen
                                                package_uid: ""
                                            })}
                                            className={baseStyles.select}
                                            as="select">
                                            <option>{t("selectNight")}</option>
                                            {
                                                Array.from(groupedPackages.keys()).map(item => (
                                                    <option key={item} value={item}>
                                                        {String(item) === "0" ? t('withoutHotel') : `${item} ${t("night")}`}</option>
                                                ))
                                            }
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col md={12} className={styles.fields}>
                                    <label
                                        className={baseStyles.input_label}
                                        htmlFor="basic-url">
                                        {t("package")}
                                    </label>
                                    <InputGroup className="mb-2">
                                        <FormControl
                                            value={vaccineFormData.package_uid}
                                            name="package"
                                            onChange={(event) => setVaccineFormData({
                                                ...vaccineFormData,
                                                package_uid: event.target.value
                                            })}
                                            className={baseStyles.select}
                                            as="select"
                                        >
                                            <option>{t("selectPackage")}</option>
                                            {
                                                groupedPackages.get(vaccineFormData.selected_night)?.map((item: HotelPackageApi) => (
                                                    <option className="vaccineOption" key={item.uuid} value={item.uuid}>
                                                        {item.hotel_name} - {getRoomTypeText(item)}</option>
                                                ))
                                            }
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                                <Col md={12} className={styles.fields}>
                                    <label
                                        className={baseStyles.input_label}
                                        htmlFor="basic-url">
                                        {t("vaccineType")}
                                    </label>
                                    <InputGroup className="mb-2">
                                        <FormControl
                                            value={vaccineFormData.type}
                                            name="type"
                                            onChange={(event) => setVaccineFormData({
                                                ...vaccineFormData,
                                                type: event.target.value
                                            })}
                                            className={baseStyles.select}
                                            as="select"
                                        >
                                            {/*<option>{t("selectVaccine")}</option>*/}
                                            {
                                                vaccineTypes.map(center => (
                                                    <option
                                                        key={center.id}
                                                        value={center.id}>
                                                        {center.vaccine_type}</option>
                                                ))
                                            }
                                        </FormControl>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={5}>
                            {/*Summery Table*/}
                            <div>
                                {(groupedPackages && vaccineFormData.package_uid && getSelectedHotel()) && (
                                    <div className={styles.summeryPanelHolder}>
                                        <div className={styles.fullPrice}>
                                            {t("€")}{(getSelectedHotel()) ? getSelectedHotel().price : ""}
                                        </div>
                                        <div className={styles.personPrice}>
                                            {t("€")}{(getSelectedHotel()) ? (getSelectedHotel().price / personData.length).toFixed(2) : ""} <span>{t('perPerson')}</span>
                                        </div>
                                        <div className={styles.summeryTable}>
                                            <div className={styles.summeryBar}>
                                                <div className={styles.summeryRow}>
                                                    <div className={styles.summeryItemFirst}>
                                                        <label className={styles.summeryItemLabel}>
                                                            <div className={styles.summeryItemLabelField}>
                                                                {t('stayingAt')}
                                                            </div>
                                                            <div className={styles.summeryItemLabelValue}>
                                                                {getSelectedHotel().hotel_name}
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className={styles.summeryRow}>
                                                    <div className={styles.summeryItem}>
                                                        <label className={styles.summeryItemLabel}>
                                                            <div className={styles.summeryItemLabelField}>
                                                                {t('duration')}
                                                            </div>
                                                            <div className={styles.summeryItemLabelValue}>
                                                                {String(getSelectedHotel().nights_num) === "0" ? t('withoutHotel') : `${getSelectedHotel().nights_num} ${t('night(s)')}`}
                                                            </div>
                                                        </label>
                                                        <div className={styles.summeryItemLabelSep}/>
                                                        <label className={styles.summeryItemLabel}>
                                                            <div className={styles.summeryItemLabelField}>
                                                                {t('rooms')}
                                                            </div>
                                                            <div className={styles.summeryItemLabelValue}>
                                                                {getSelectedHotel()['room_type_' + fallBackLang(i18n.language)]}
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className={styles.summeryRow}>
                                                    <div className={styles.summeryItem}>
                                                        <label className={styles.summeryItemLabel}>
                                                            <div className={styles.summeryItemLabelField}>
                                                                {t('description')}
                                                            </div>
                                                            <div className={styles.summeryItemLabelValue}>
                                                                {getSelectedHotel()['desc_' + fallBackLang(i18n.language)]}
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className={styles.summeryRow}>
                                                    <div className={styles.summeryItemLast}>
                                                        <label className={styles.summeryItemLabel}>
                                                            <div className={styles.summeryItemLabelField}>
                                                                {t('address')}
                                                            </div>
                                                            <div className={styles.summeryItemLabelValue}>
                                                                {getSelectedHotel()['address_' + fallBackLang(i18n.language)]}
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                </div>
            </OrderLayout>
        </Page>
    )
}

export default VaccineForm;
