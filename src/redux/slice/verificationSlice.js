import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    verification_step: 1,
    file_uploaded_status: {
        passport: false,
        front_EID: false,
        back_EID: false,
    },
    account_status: "",
};

export const verificationSlice = createSlice({
    name: "verification",
    initialState,
    reducers: {
        handleVerificationStep: (state, action) => {
            return {
                ...state,
                verification_step: action.payload,
            };
        },
        updateFileUploadStatus: (state, action) => {
            return {
                ...state,
                file_uploaded_status: {
                    ...state.file_uploaded_status,
                    ...action.payload,
                },
            };
        },
        handleAccountStatus: (state, action) => {
            return {
                ...state,
                account_status: action.payload,
            };
        },
    },
});

export default verificationSlice;
