import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { socialLogin } from "../../redux/action/authAction";
import { signInWithGoogle } from "../../Service/firebase";
import { useNavigate } from "react-router-dom";

const LoginWithSocialMedia = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const responseFromSocialMedia = useCallback(
        async ({ idToken }) => {
            const formData = {
                idToken,
                domain_id: 3,
                signup_step: 1,
                signup_source: 2,
            };
            dispatch(socialLogin(formData, navigate));
        },
        // eslint-disable-next-line
        []
    );

    return (
        <div className="">
            <button
                className="btn btn-white btn-full"
                onClick={async () => {
                    const idToken = await signInWithGoogle();
                    if (idToken) responseFromSocialMedia({ idToken });
                }}
            >
                <img src="img/google-icon.svg" alt="" />
            </button>
        </div>
    );
};

export default LoginWithSocialMedia;
