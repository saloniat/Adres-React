import { axiosUnauth } from "../../utils/axios/axios";
import { setAzureToken } from "../slice/keyVaultSlice";

export const getOAuthToken = () => {
    return async (dispatch) => {
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        params.append("client_id", process.env.REACT_APP_AZURE_CLIENT_ID);
        params.append(
            "client_secret",
            process.env.REACT_APP_AZURE_CLIENT_SECRET
        );
        params.append("scope", "https://vault.azure.net/.default");
        try {
            const response = await axiosUnauth({
                baseURL: process.env.REACT_APP_AZURE_VAULT_AUTH_URL,
                url: `/${process.env.REACT_APP_AZURE_TENANT_ID}/oauth2/v2.0/token`,
                method: "POST",
                data: params,
            });
            const { status, data } = response || {};
            if (status === 200) {
                dispatch(setAzureToken(data.access_token));
            }
            return data.access_token;
        } catch (error) {
            console.error("OAuth Token Error:", error);
            return null;
        }
    };
};

export const getSecretByName = (secretName) => {
    return async (dispatch, getState) => {
        let token = getState().keyVault.azureToken;
        const fetchToken = async () => {
            token = await dispatch(getOAuthToken());
            if (!token) throw new Error("Failed to fetch OAuth token");
        };
        const isTokenExpired = (token) => {
            try {
                const [, payload] = token.split(".");
                const { exp } = JSON.parse(atob(payload));
                return new Date().getTime() > exp * 1000;
            } catch {
                return true;
            }
        };
        try {
            if (!token || isTokenExpired(token)) {
                await fetchToken();
            }
            const makeRequest = async () => {
                return axiosUnauth({
                    method: "GET",
                    baseURL: `https://${process.env.REACT_APP_AZURE_KEY_VAULT_NAME}.vault.azure.net`,
                    url: `/secrets/${secretName}?api-version=7.5`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            };
            let response;
            try {
                response = await makeRequest();
            } catch (error) {
                if (error.response?.status === 401) {
                    await fetchToken();
                    response = await makeRequest();
                } else {
                    throw error;
                }
            }
            const { status, data } = response || {};
            if (status === 200) {
                return data.value;
            } else {
                console.error("Failed to fetch secret:", response);
                return null;
            }
        } catch (error) {
            console.error("Key Vault Secret Error:", error);
            return null;
        }
    };
};
