import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    termsAndConditionsData: "",
    privacyPolicyData: "",
    aboutUsData: {},
};

export const termsAndConditionsSlice = createSlice({
    name: "termsAndConditions",
    initialState,
    reducers: {
        setTermsAndConditions: (state, action) => {
            return {
                ...state,
                termsAndConditionsData: action.payload,
            };
        },
        setPrivacyPolicy: (state, action) => {
            return {
                ...state,
                privacyPolicyData: action.payload,
            };
        },
        setAboutUsData: (state, action) => {
            return {
                ...state,
                aboutUsData: action.payload,
            };
        },
    },
});
export const { setTermsAndConditions, setPrivacyPolicy, setAboutUsData } =
    termsAndConditionsSlice.actions;
export default termsAndConditionsSlice;
