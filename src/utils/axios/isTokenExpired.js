// import jwt from "jsonwebtoken";
// import authSlice from "../../redux/slice/authSlice";

// export const authActions = authSlice.actions;

// const isTokenExpired = (token) => {
//     if (!token) return Promise.resolve(false);
//     const now = new Date();
//     const decodedToken = jwt.decode(token);

//     if (decodedToken) {
//         const { exp } = decodedToken;
//         return Promise.resolve(now.getTime() < (exp - 10) * 1000);
//     }

//     return Promise.resolve(false);
// };

// /* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
// export default isTokenExpired;
