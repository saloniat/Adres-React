import { emailRegExp } from "../helpers/index";
import * as Yup from "yup";

//signin
export const SignInValidationSchema = Yup.object().shape({
    email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Email is required")
        .matches(emailRegExp, "Email is invalid"),
    password: Yup.string()
        .strict()
        .trim("The password cannot include leading and trailing spaces")
        .required("Password is required"),
});

//forgot password
export const ForgotPswdValidationSchema = Yup.object().shape({
    email: Yup.string()
        .strict()
        .trim("The email cannot include leading and trailing spaces")
        .required("Email is required")
        .matches(emailRegExp, "Email is invalid"),
});

//reset password
export const resetPswdValidationSchema = Yup.object().shape({
    password: Yup.string()
        .strict()
        .trim("The password cannot include leading and trailing spaces")
        .required("Password is required")
        .min(6, "Password min length text")
        .max(12, "Max length text")
        .test('uppercase', 'Must include at least one uppercase letter', value =>
            /[A-Z]/.test(value || '')
        )
        .test('lowercase', 'Must include at least one lowercase letter', value =>
            /[a-z]/.test(value || '')
        )
        .test('number', 'Must include at least one number', value =>
            /\d/.test(value || '')
        )
        .test('specialChar', 'Must include at least one special character (!@#$%^&*)', value =>
            /[!@#$%^&*]/.test(value || '')
        ),
    confirmPassword: Yup.string()
        .strict()
        .trim("The confirm password cannot include leading and trailing spaces")
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Unmatched Password"),
});

export const changePswdValidationSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .strict()
        .trim("The current password cannot include leading and trailing spaces")
        .required("Current password is required")
        .min(6, "Current password must be at least 6 characters")
        .max(12, "Maximum length is 12 characters"),
    newPassword: Yup.string()
        .strict()
        .trim("The password cannot include leading and trailing spaces")
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(12, "Maximum length is 12 characters")
        .test('uppercase', 'Upper Case text', value =>
            /[A-Z]/.test(value || '')
        )
        .test('lowercase', 'Lower Case text', value =>
            /[a-z]/.test(value || '')
        )
        .test('number', 'Number Case text', value =>
            /\d/.test(value || '')
        )
        .test('specialChar', 'Special Case text', value =>
            /[!@#$%^&*]/.test(value || '')
        ),
    confirmPassword: Yup.string()
        .strict()
        .trim("The confirm password cannot include leading and trailing spaces")
        .required("Confirm password is required")
        .oneOf([Yup.ref("newPassword"), null], "Unmatched Password"),
});

export const passwordSchema = Yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .test('uppercase', 'Upper Case text', value =>
        /[A-Z]/.test(value || '')
    )
    .test('lowercase', 'Lower Case text', value =>
        /[a-z]/.test(value || '')
    )
    .test('number', 'Number Case text', value =>
        /\d/.test(value || '')
    )
    .test('specialChar', 'Special Case text', value =>
        /[!@#$%^&*]/.test(value || '')
    );