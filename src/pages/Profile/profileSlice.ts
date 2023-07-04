import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContactFormData, PersonFormData, VaccineFormData } from "pages/Order/orderSlice";
import * as Api from "api";
import { OrderStatus, VaccineCenter, HotelPackageApi } from "api";

export type Order = {
    data: {
        id?: number,
        persons: PersonFormData[],
        vaccine: VaccineFormData,
        contact: ContactFormData,
        status?: OrderStatus,
        amount?: any,
        is_used_coupon?: boolean,
        paid_amount?: any,
        hotel_package?: HotelPackageApi | any,
        dose1?: {
            arrival_date?: string,
            flight_number?: string,
            transport_company_name?: string,
            next_vaccination_date?: string,
            vaccination_date?: string,
            vaccine_type?: any,
            vaccine_center?: VaccineCenter,
        },
        dose2?: {
            arrival_date?: string,
            flight_number?: string,
            transport_company_name?: string,
            next_vaccination_date?: string,
            vaccination_date?: string,
            vaccine_center?: VaccineCenter,
            vaccine_type?: string,
        },
        code?: string,
        user?: {
            country: string,
            email: string,
            id: number,
            phone: string
        },
        usdt_token?: string
        dose1_vaccination_date?: string
    },
    fetching: boolean,
    fetched: boolean,
    error: boolean,
    errorMessage: string
}

const orderInitialState: Order = {
    data: {
        amount: 0,
        persons: [],
        vaccine: {
            center: "",
            type: ""
        },
        contact: {
            country: "",
            email: "",
            phoneNumber: ""
        },
        is_used_coupon: false,
        paid_amount: 0,
    },
    fetching: false,
    fetched: false,
    error: false,
    errorMessage: ""
}

export interface ProfileState {
    order: Order
}

const initialState: ProfileState = {
    order: orderInitialState
}


export const fetchOrder = createAsyncThunk(
    'profile/fetchOrder',
    async (thunkAPI) => {
      const response = await Api.fetchOrder();
      return response.data
    }
)

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrder.fulfilled, (state, action) => {
            const order = action.payload.content;
            state.order = {
                data: {
                    id: order.id,
                    contact: {
                        country: "",
                        email: "",
                        phoneNumber: ""
                    },
                    persons: order.persons.map(item => {
                        return {
                            name: item.name,
                            surname: item.surname,
                            birthCountry: item.birth_country,
                            birthDate: item.birth_date,
                            gender: item.gender,
                            nationalId: item.national_id,
                            nationality: item.nationality,
                            passportExpiry: item.passport_exp_date,
                            passportNumber: item.passport_number,
                            uuid: item.uuid,
                            passport_image: item.passport_image
                        }
                    }),
                    hotel_package: order.hotel_package,
                    vaccine: {
                        center: (order.vaccine_center) ? String(order.vaccine_center.id) : "",
                        center_name: (order.vaccine_center) ? order.vaccine_center.name : "",
                        type: order.vaccine_type.vaccine_type
                    },
                    status: order.status,
                    dose1: {
                        arrival_date: order.dose1_arrival_date,
                        flight_number: order.dose1_flight_number,
                        transport_company_name: order.dose1_transport_company_name,
                        next_vaccination_date: order.dose1_next_vaccination_date,
                        vaccination_date: order.dose1_vaccination_date,
                        vaccine_center: order.dose1_vaccine_center,
                        vaccine_type: order.dose1_vaccine_type
                    },
                    dose2: {
                        arrival_date: order.dose2_arrival_date,
                        flight_number: order.dose2_flight_number,
                        transport_company_name: order.dose2_transport_company_name,
                        next_vaccination_date: order.dose2_next_vaccination_date,
                        vaccination_date: order.dose2_vaccination_date,
                        vaccine_center: order.dose2_vaccine_center,
                        vaccine_type: order.dose2_vaccine_type
                    },
                    amount: order.amount,
                    user: order.user,
                    is_used_coupon: order.is_used_coupon,
                    paid_amount: order.paid_amount,
                    code: order.code,
                    usdt_token: order.usdt_token,
                    dose1_vaccination_date: order.dose1_vaccination_date

                },
                error: false,
                errorMessage: "",
                fetched: true,
                fetching: false
            } 
        });
        builder.addCase(fetchOrder.pending, (state, action) => {
            state.order = {
                data: {...state.order.data},
                error: false,
                errorMessage: "",
                fetched: false,
                fetching: true
            }
        });
        builder.addCase(fetchOrder.rejected, (state, action) => {
            state.order = {
                data: {...initialState.order.data},
                error: true,
                errorMessage: (action.error.message) ? action.error.message: "",
                fetched: false,
                fetching: false
            }
        })
    }
  })
  
  // Action creators are generated for each case reducer function
  export const { } = profileSlice.actions;
  
  export default profileSlice.reducer
