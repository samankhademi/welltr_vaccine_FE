import Page from "components/Page/Page";
import React, {ReactElement} from "react";
import { Carousel, Col, Container, Row, Button } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import Banner from "./assets/Banner.jpg";
import styles from "./Home.module.css";
import {ReactComponent as PrevIcon} from "./assets/prev.svg";
import {ReactComponent as NextIcon} from "./assets/next.svg";
import Slider1 from "./assets/slider1.png";
import Slider2 from "./assets/slider2.png";
// import Slider3 from "./assets/slider3.png";
import { useTranslation } from "react-i18next";
import { getDirectionByLang } from "utils/base";
import i18n from "i18n/i18n";

type HomeProps = {} & RouteComponentProps;

function Home(props: HomeProps): ReactElement {

    const {t} = useTranslation();

    return (
        <Page isRegisterEnable={true}>
            <Container fluid>
                <Row>
                    <Col md={{span:8, offset:2}}>
                        <Row>
                            <Col>
                                <img className={styles.banner} src={Banner}/>
                                <div dir="auto" className={styles.banner_desc}>
                                    {t("homeDesc1")}<br></br>
                                    {t("homeDesc2")}<br></br>
                                    <span style={{fontWeight:"bold"}}>{t("homeDesc3")}</span><br></br>
                                    {t("homeDesc4")}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={styles.carousel_container}>
                                <Carousel
                                    prevIcon={<PrevIcon/>}
                                    nextIcon={<NextIcon/>}>
                                    <Carousel.Item>
                                        <Row className={styles.carousel_item}>
                                            <Col dir="auto" className={styles.carousel_text} md={{span:5, offset:1}}>
                                                {t("homeSlide1")}
                                            </Col>
                                            <Col md={{span:5}}>
                                                <img className={styles.carousel_image} src={Slider1}/>
                                            </Col>
                                        </Row>
                                    </Carousel.Item>
                                    {/*<Carousel.Item>*/}
                                    {/*    <Row className={styles.carousel_item}>*/}
                                    {/*        <Col dir="auto" className={styles.carousel_text} md={{span:5, offset:1}}>*/}
                                    {/*        {t("homeSlide2")}*/}
                                    {/*        </Col>*/}
                                    {/*        <Col md={{span:5}}>*/}
                                    {/*            <img*/}
                                    {/*                className={styles.carousel_image}*/}
                                    {/*                src={Slider2}/>*/}
                                    {/*        </Col>*/}
                                    {/*    </Row>*/}
                                    {/*</Carousel.Item>*/}
                                    <Carousel.Item>
                                        <Row className={styles.carousel_item}>
                                            <Col dir="auto" className={styles.carousel_text} md={{span:5, offset:1}}>
                                            {t("homeSlide2")}
                                            </Col>
                                            <Col md={{span:5}}>
                                                <img
                                                    className={styles.carousel_image}
                                                    src={Slider2}/>
                                            </Col>
                                        </Row>
                                    </Carousel.Item>
                                </Carousel>
                            </Col>
                        </Row>
                        <Row className={styles.line}></Row>
                        <Row>
                            <Col className={styles.book_title}>
                               {t("homeBookTitle")}
                            </Col>
                        </Row>
                        <Row className={styles.book_container}>
                            <Col md={{offset:1}}>
                                <div
                                    className={styles.book_item}>
                                    <div className={styles.book_item_circle_container}>
                                        <div className={styles.book_item_circle}>1</div>
                                        {t("Signup")}
                                    </div>
                                    <div className={styles.book_item_desc_container}>
                                        <ul style={{direction:getDirectionByLang(i18n.language)}}>
                                            <li>
                                                {t("homeInfoDesc1")}
                                            </li>
                                            <li>
                                                {t("homeInfoDesc2")}
                                            </li>
                                            <li>
                                                {t("homeInfoDesc3")}
                                            </li>
                                            <li>
                                                {t("homeInfoDesc4")}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className={styles.book_container}>
                            <Col md={{offset: 3}}>
                                <div
                                    className={styles.book_item}>
                                    <div className={styles.book_item_circle_container}>
                                        <div className={styles.book_item_circle}>2</div>
                                        {t("homeDoseTitle")}
                                    </div>
                                    <div className={styles.book_item_desc_container}>
                                        <ul style={{direction:getDirectionByLang(i18n.language)}}>
                                            <li>
                                                {t("homeDoseDesc1")}
                                            </li>
                                            <li>
                                                {t("homeDoseDesc2")}
                                            </li>
                                            <li>
                                                {t("homeDoseDesc3")}
                                            </li>
                                            <li>
                                                {t("homeDoseDesc4")}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className={styles.book_container}>
                            <Col md={{offset:5}}>
                                <div
                                    className={styles.book_item}>
                                    <div className={styles.book_item_circle_container}>
                                        <div className={styles.book_item_circle}>3</div>
                                        {t("homeDoneTitle")}
                                    </div>
                                    <div className={styles.book_item_desc_container}>
                                        <ul style={{direction:getDirectionByLang(i18n.language)}}>
                                            <li>
                                                {t("homeDoneDesc1")}
                                            </li>
                                            <li>
                                                {t("homeDoneDesc2")}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{span: 6, offset: 3}}>
                                <Button
                                    className={styles.register_button}
                                    onClick={() => props.history.push("/order/person")}
                                    color={"red"}
                                    variant="primary">
                                    {t("register")}
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Page>
    )
}

export default Home;
