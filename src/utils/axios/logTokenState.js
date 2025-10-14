// Create a debug logger that can be easily enabled/disabled
const DEBUG = process.env.REACT_APP_WEB_URL !== "https://adres.com";

export const logTokenState = (message, token, error) => {
    if (!DEBUG) return;

    const tokenPreview = token
        ? `${token.slice(0, 10)}...${token.slice(-10)}`
        : "no token";
    // console.group("Token State Update");
    // console.log(`Time: ${new Date().toISOString()}`);
    // console.log(`Event: ${message}`);
    // console.log(`Token Preview: ${tokenPreview}`);
    if (error) console.error("Error:", error);
    // console.groupEnd();
};

export default logTokenState;
