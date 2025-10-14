import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    propertiesEvent: { total: 0, data: [], events: [] },
    selectedEvent: "",
};

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        handlePropertyEvent: (state, action) => {
            const { total, data, events } = action.payload;
            return {
                ...state,
                propertiesEvent: {
                    ...state.propertiesEvent,
                    total,
                    data,
                    events,
                },
            };
        },
        handleSelectedEvent: (state, action) => {
            return {
                ...state,
                selectedEvent: action.payload,
            };
        },
        toggleEventFavouriteStatus: (state, { payload }) => {
            // const updatedData = state.propertiesEvent.events.map((ele) =>
            //     ele.id === payload ? { ...ele, liked: !ele.liked } : ele
            // );
            return {
                ...state,
                propertiesEvent: {
                    ...state.propertiesEvent,
                    events: payload,
                },
            };
        },
    },
});

export const {
    handlePropertyEvent,
    handleSelectedEvent,
    toggleEventFavouriteStatus,
} = eventSlice.actions;
export default eventSlice;
