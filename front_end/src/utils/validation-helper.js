export const validateEmail = (email) => {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email);
};

export const validatePassword = (password) => {
    let regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/
    return regex.test(password);
};

export const validateFirstname = (firstName) => {
    let regex = /^(?=.{1,50}$)[a-zA-Z]+(?:['][a-z]+)*$/
    return regex.test(firstName);
};

export const validateLastName = (lastName) => {
    let regex = /^(?=.{1,50}$)[a-zA-Z]+(?:['][a-z]+)*$/
    return regex.test(lastName);
};

export const validatePhoneNumber = (phoneNumber) => {
    let regex = /\d{10}$/
    return regex.test(phoneNumber);
};