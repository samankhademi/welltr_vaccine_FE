import axios, { AxiosResponse } from "axios"
import { getCountryCode } from "components/PersonCard/countries";
import { OrderState, PersonFormData } from "pages/Order/orderSlice";
import { FlightForm } from "pages/Profile/CompleteOrder/CompleteOrder";
import { PaymentTypes } from "pages/Profile/Payment/Payment";

export const baseUrl = "";

export type ApiResponse<T = any> = {
    statusCode: number,
    statusMessage: string,
    traceMessage: string,
    content: T
}

export type OrderApi = {
    persons: PersonApi[],
    user: UserApi,
    location: string,
    vaccine_type: string,
    vaccine_center: string,
    package_uid: string
  }
  
  export type PersonApi = {
    uuid?: string,
    passport_image?: string,
    name: string,
    surname: string,
    gender: string,
    nationality: string,
    passport_number: string,
    passport_exp_date: string,
    birth_date: string,
    birth_country: string,
    national_id: string
}

export type UserApi = {
    email: string,
    phone: string,
    country: string
}

const registration = (order: OrderState): Promise<AxiosResponse<ApiResponse>> => {
    const orderApiData: OrderApi = {
        persons: order.persons.map(person => (
            {
                birth_country: getCountryCode(person.birthCountry),
                birth_date: person.birthDate,
                gender: person.gender,
                name: person.name,
                national_id: person.nationalId,
                nationality: getCountryCode(person.nationality),
                passport_exp_date: person.passportExpiry,
                passport_number: person.passportNumber,
                surname: person.surname
            }
        )),
        user: {
            email: order.contact.email,
            phone: order.contact.phoneNumber,
            country: getCountryCode(order.contact.country)
        },
        location: getCountryCode(order.contact.country),
        vaccine_type: order.vaccine.type,
        vaccine_center: order.vaccine.center,
        package_uid: (order.vaccine.package_uid) ? order.vaccine.package_uid : ""
    }
    return axios.post<ApiResponse>(baseUrl + "/api/v1/auth/signup/", orderApiData);
}

const sendOtp = (email: string): Promise<AxiosResponse<ApiResponse>> => {
    const otpApiData = {
        email: email
    }
    return axios.post<ApiResponse>(baseUrl + "/api/v1/auth/otp/", otpApiData);
}

export type AuthData = {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
    issued_at: number
}

const login = (email: string, otp: string):
    Promise<AxiosResponse<ApiResponse<AuthData>>> => {
    const loginApiData = {
        email: email,
        otp: otp
    }
    return axios.post<ApiResponse<AuthData>>(baseUrl + "/api/v1/auth/login/", loginApiData)
}

export enum OrderStatus {
    OPEN = "OPEN",/* when user shall fill person data & flight info */
    WAITING_FOR_DATA_SUBMISSION = "WAITING_FOR_DATA_SUBMISSION",
    FULL_PAID = "FULL_PAID",
    PAID_20_PERCENT = "PAID_20_PERCENT",
    WAITING_FOR_SETTING_FIRST_DOSE = "WAITING_FOR_SETTING_FIRST_DOSE",
    WAITING_FOR_PAY = "WAITING_FOR_PAY",/* user submit person & flight info and shall user pay */
    WAITING_FOR_RECEIVING_FIRST_DOSE = "WAITING_FOR_RECEIVING_FIRST_DOSE",/* user can see finalization order*/
    WAITING_FOR_SETTING_SECOND_DOSE = "WAITING_FOR_SETTING_SECOND_DOSE",
    WAITING_FOR_RECEIVING_SECOND_DOSE = "WAITING_FOR_RECEIVING_SECOND_DOSE",
    DONE = "DONE"
}

export type FetchOrderApi = {
    hotel_package: HotelPackageApi;
    id: number,
    arrival_date: string,
    status: OrderStatus,
    transport_company_name: string,
    user: {
        country: string,
        email: string,
        id: number,
        phone: string
    },
    vaccine_center: VaccineCenter,
    vaccine_type: {
        id: number,
        is_available: boolean,
        uuid: string,
        vaccine_type: string
    },
    persons: PersonApi[],
    dose1_arrival_date: string,
    dose1_flight_number: string,
    dose1_next_vaccination_date: string,
    dose1_transport_company_name: string,
    dose1_vaccination_date: string,
    dose1_vaccine_type: string,
    dose1_vaccine_center: VaccineCenter,
    dose2_arrival_date: string,
    dose2_flight_number: string,
    dose2_transport_company_name: string,
    dose2_next_vaccination_date: string,
    dose2_vaccination_date: string,
    dose2_vaccine_center: VaccineCenter,
    dose2_vaccine_type: string,
    amount: number,
    code: string,
    is_used_coupon: boolean,
    paid_amount: any,
    usdt_token: string
}

const fetchOrder = (): Promise<AxiosResponse<ApiResponse<FetchOrderApi>>> => {
    return axios.post<ApiResponse<FetchOrderApi>>(baseUrl + "/api/v1/order/");
}

export type VaccineCenter = {
    uuid: string,
    name: string,
    id: number
}

export type VaccineType = {
    id: number,
    vaccine_type: string
}

const fetchVaccineCenters = (): Promise<AxiosResponse<ApiResponse<VaccineCenter[]>>> => {
    return axios.post<ApiResponse<VaccineCenter[]>>(baseUrl + "/api/v1/order/vaccine-center/");
}

const fetchVaccineTypes = (): Promise<AxiosResponse<ApiResponse<VaccineType[]>>> => {
    return axios.post<ApiResponse<VaccineType[]>>(baseUrl + "/api/v1/order/vaccine-type/");
}

const editOrder = (vaccineCenter: string, vaccineType: string): Promise<AxiosResponse> => {
    const orderEdit = {
        vaccine_center: vaccineCenter,
        vaccine_type: vaccineType
    }
    return axios.post<ApiResponse>(baseUrl + "/api/v1/order/edit/", orderEdit);
}

const editPerson = (person: PersonFormData): 
    Promise<AxiosResponse<ApiResponse>> => {
        const personEdit = {
            uuid: person.uuid,
            name: person.name,
            surname: person.surname,
            gender: person.gender,
            nationality: person.nationality,
            passport_number: person.passportNumber,
            passport_exp_date: person.passportExpiry,
            birth_date: person.birthDate,
            birth_country: person.birthCountry,
            national_id: person.nationalId
        }
        return axios.post<ApiResponse>(baseUrl + "/api/v1/auth/persons/edit", personEdit);
}

const deletePerson = (uuid?: string) => {
    return axios.post<ApiResponse>(baseUrl + "/api/v1/auth/persons/delete", {uuid: uuid});
}

export type GetPaymentLinkResponse = {
    BaseWebApiResponse: {
        ReturnStatus: number,
        ReturnStatusVerbal: string,
        Token: string,
        Exception: string
    }
    PaymentLink: string,
    TransactionLinkId: string
}

const getPaymentLink = (orderId?: number, paymentType?: PaymentTypes):
    Promise<AxiosResponse<ApiResponse>> => {
    const getLinkData = {
        order_id: orderId,
        payment_type: paymentType
    }
    return axios.post<ApiResponse<GetPaymentLinkResponse>>(baseUrl + "/api/v1/pay/get-link/", getLinkData);
}

const paymentByUsdt = (usdt_token: string): Promise<AxiosResponse<ApiResponse>> => {
    const getLinkData = {
        usdt_token: usdt_token
    }
    return axios.post<ApiResponse<GetPaymentLinkResponse>>(baseUrl + "/api/v1/pay/usdt-transaction/", getLinkData);
}

const paymentCallBack = (orderUid: string): Promise<AxiosResponse> => {
    const callBackData = {
        order_uuid: orderUid
    }
    return axios.post<ApiResponse>(baseUrl + "/api/v1/pay/callback/", callBackData);
}

const completeOrder = (flightForm: FlightForm, coupons: string[]) => {
    const flightData = {
        flight_number: flightForm.flightNumber,
        transport_company_name: flightForm.companyName,
        arrival_date: flightForm.arrivalDate,
        pins: coupons
    }
    return axios.post<ApiResponse>(baseUrl + "/api/v1/order/complete-order/", flightData);
}

export type ExhangeListApi = {
    id: number,
    name: string,
    state: string,
    address: string,
    phone: string
}

const fetchExchangeList = (): Promise<AxiosResponse<ApiResponse<ExhangeListApi[]>>> => {
    return axios.post<ApiResponse<ExhangeListApi[]>>(baseUrl + "/api/v1/exchange/list/");
}

export type ApplyCouponsApi = {
    total_off: number
}

const applyCoupons = (pins: any): Promise<AxiosResponse<ApiResponse<ApplyCouponsApi>>> => {
    return axios.post<ApiResponse<ApplyCouponsApi>>(baseUrl + "/api/v1/order/coupons/inquiry/", pins);
}

export type HotelPackageApi = {
    uuid: string,
    total_person: number,
    hotel_name: string,
    nights_num: number,
    price: number,
    desc_fa: string,
    desc_en: string,
    desc_tr: string,
    address_fa: string,
    address_en: string,
    address_tr: string,
    room_type_fa: string,
    room_type_en: string,
    room_type_tr: string
}

const fetchPackages = (total_person: number, nights?: number): Promise<AxiosResponse<ApiResponse<HotelPackageApi[]>>> => {
    let filters = "?total_person=" + String(total_person);
    if (nights && nights !== 0) {
        filters += "&nights_num=" + String(nights);
    }
    return axios.get<ApiResponse<HotelPackageApi[]>>(baseUrl + "/api/v1/order/packages/" + filters);
}

export {
    registration,
    sendOtp,
    login,
    fetchOrder,
    fetchVaccineCenters,
    editOrder,
    editPerson,
    deletePerson,
    getPaymentLink,
    paymentCallBack,
    completeOrder,
    fetchExchangeList,
    fetchVaccineTypes,
    applyCoupons,
    fetchPackages,
    paymentByUsdt
}
