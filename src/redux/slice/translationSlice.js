import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lang: sessionStorage.getItem("i18nextLng") || "en",
};

export const translationSlice = createSlice({
    name: "translation",
    initialState,
    reducers: {
        handleLanguageSwitch: (state, action) => {
            return {
                ...state,
                lang: action.payload,
            };
        },
    },
});

export default translationSlice;
