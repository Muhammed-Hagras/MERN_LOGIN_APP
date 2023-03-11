import toast from "react-hot-toast"
import { authenticate } from "./helper";

// Validate login page username 
export async function usernameValidate(values){
    const errors = usernameVerify({}, values);

    if(values.username){
        // check user exist or not 
        const { status } = await authenticate(values.username)
        if(status !== 200){
            errors.exist = toast.error("User does not exist...!")
        }
    }

    return errors;
}

// Validate login page password
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);
    return errors;
}

// Validate Reset page
export async function resetPasswordValidation( values){
    const errors = passwordVerify({}, values);
    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Password not match...!")
    }

    return errors;
}

// Validate register form 
export async function registerValidation(values){
    const errors = usernameVerify({},values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

// Validate profile page 
export default function profileValidation(values){
    const errors = emailVerify({}, values);
    return errors;
}

/** ************************************************* */


// Validate password
function passwordVerify(errors={}, values){
    const specialChars = /[!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/;
    if(!values.password){
        errors.password = toast.error("Password Required...!");
    }else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password, must not have spaces...!");
    }else if(values.password.length < 4) {
        errors.password = toast.error("Wrong password, nust be more than 4 characters...!");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("wrong password must have special character...!");
    }

    return errors;
}

// Validate username
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error("Username Required...!");
    } else if(values.username.includes(" ")){
        error.username = toast.error("Invalid Username...!");
    }

    return error
}


// Validate email
function emailVerify(errors={}, values){
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!values.email){
        errors.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        errors.email = toast.error("Wrong email, must not have spaces...!");
    }else if(!emailRegex.test(values.email)){
        errors.email = toast.error("Invalid email address...!");
    }

    return errors;
}