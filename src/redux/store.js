import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import verificationSlice from "./slice/verificationSlice";
import developerProjectSlice from "./slice/developerProjectSlice";
import profileSlice from "./slice/profileSlice";
import sellerSlice from "./slice/sellerSlice";
import translationSlice from "./slice/translationSlice";
import buyerSlice from "./slice/buyerSlice";
import discoverSlice from "./slice/discoverSlice";
import socketSlice from "./slice/socketSlice";
import socketMiddleware from "../middleware/socketMiddleware";
import bidSlice from "./slice/bidSlice";
import { bidHistorySlice } from "./slice/bidHistorySlice";
import modalSlice from "./slice/modalSlice";
import notificationSlice from "./slice/notificationSlice";
import eventSlice from "./slice/eventSlice";
import paymentSlice from "./slice/paymentSlice";
import inboxSlice from "./slice/inboxSlice";
import termsAndConditionsSlice from "./slice/terms&ConditionsSlice";
import keyVaultSlice from "./slice/keyVaultSlice";
import faqSlice from "./slice/faqSlice";
import { broadcastMiddleware } from "./broadcastMiddleware";

export default configureStore({
    reducer: {
        auth: authSlice.reducer,
        verification: verificationSlice.reducer,
        project: developerProjectSlice.reducer,
        profile: profileSlice.reducer,
        seller: sellerSlice.reducer,
        translation: translationSlice.reducer,
        buyer: buyerSlice.reducer,
        discover: discoverSlice.reducer,
        bidHistory: bidHistorySlice.reducer,
        socket: socketSlice.reducer,
        bid: bidSlice.reducer,
        modal: modalSlice.reducer,
        notification: notificationSlice.reducer,
        event: eventSlice.reducer,
        payment: paymentSlice.reducer,
        inbox: inboxSlice.reducer,
        keyVault: keyVaultSlice.reducer,
        termsAndConditions: termsAndConditionsSlice.reducer,
        faq: faqSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware, broadcastMiddleware),
});
