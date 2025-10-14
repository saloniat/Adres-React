import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    azureToken: sessionStorage.getItem("azureToken") || null,
};

export const keyVaultSlice = createSlice({
    name: "keyVault",
    initialState,
    reducers: {
        setAzureToken: (state, { payload }) => {
            sessionStorage.setItem("azureToken", payload);
            state.azureToken = payload;
        },
    },
});

export const { setAzureToken } = keyVaultSlice.actions;

export default keyVaultSlice;
