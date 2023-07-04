import React, { ReactElement } from "react";
import PersonForm from "./Order/PersonForm/PersonForm";
import {Switch, BrowserRouter as Router, Route} from "react-router-dom";
import Home from "./Home/Home";
import VaccineForm from "./Order/VaccineForm/VaccineFom";
import ContactForm from "./Order/ContactForm/ContactForm";
import Result from "./Order/Result/Result";
import SignIn from "./Auth/Signin/SignIn";
import Otp from "./Auth/Otp/Otp";
import Payment from "./Profile/Payment/Payment";
import Login from "./Auth/Login/Login";
import CompleteOrder from "./Profile/CompleteOrder/CompleteOrder";
import PaymentSuccess from "./Payment/Success/Success";
import PaymentFailed from "./Payment/Failed/Failed";
import Orders from "./Profile/Orders/Orders";

export type RoutesProps = {}

function Routes(props: RoutesProps): ReactElement {
    return <Router>
        <Switch>
            <Route path="/" component={Home} exact/>
            <Route path={"/order/person"} component={PersonForm} exact/>
            <Route path={"/order/vaccine"} component={VaccineForm} exact/>
            <Route path={"/order/contact"} component={ContactForm} exact/>
            <Route path={"/order/result"} component={Result} exact/>
            <Route path={"/auth/otp"} component={Otp} exact/>
            <Route path={"/auth/signin/:email"} component={SignIn} exact/>
            <Route path={"/auth/login"} component={Login} exact/>
            <Route path={"/profile/payment"} component={Payment} exact/>
            <Route path={"/profile/complete-order"} component={CompleteOrder} exact/>
            <Route path={"/profile/orders"} component={Orders} exact/>
            <Route path={"/payment/success/"} component={PaymentSuccess} exact/>
            <Route path={"/payment/failed/"} component={PaymentFailed} exact/>
        </Switch>
    </Router>
}

export default Routes;
