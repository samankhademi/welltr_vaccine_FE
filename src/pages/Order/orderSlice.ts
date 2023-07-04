import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PersonFormData = {
  uuid?: string,
  passport_image?: string,
  name: string,
  surname: string,
  gender: string,
  nationality: string,
  passportNumber: string,
  passportExpiry: string,
  birthDate: string,
  birthCountry: string,
  nationalId: string
}

export const personInitialForm: PersonFormData = {
      name: "",
      birthCountry: "",
      birthDate: "",
      gender: "",
      nationalId: "",
      nationality: "",
      passportExpiry: "",
      passportNumber: "",
      surname: ""
}

export type VaccineFormData = {
  center: string,
  center_name?: string,
  package_uid?:string,
  type: string,
  selected_night?: string
}

export const vaccineInitialForm: VaccineFormData = {
  center: "",
  type: "1",
  package_uid: "",
  selected_night: "1"
}

export type ContactFormData = {
  phoneNumber: string,
  email: string,
  country: string
}

export const contactInitialForm: ContactFormData = {
  phoneNumber: "",
  email: "",
  country: "Iran, Islamic Republic of Iran"
}

export interface OrderState {
  persons: PersonFormData[],
  vaccine: VaccineFormData,
  contact: ContactFormData
}

const initialState: OrderState = {
  persons: [personInitialForm],
  vaccine: vaccineInitialForm,
  contact: contactInitialForm
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setPersons: (state, action: PayloadAction<PersonFormData[]>) => {
      state.persons = action.payload
    },
    initPersons: (state) => {
      state.persons = [personInitialForm];
    },
    setVaccine: (state, action: PayloadAction<VaccineFormData>) => {
      state.vaccine = action.payload
    },
    setContact: (state, action: PayloadAction<ContactFormData>) => {
      state.contact = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setPersons, setVaccine, setContact, initPersons } = orderSlice.actions

export default orderSlice.reducer