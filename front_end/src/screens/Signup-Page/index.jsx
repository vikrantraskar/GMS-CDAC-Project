import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../config";
import { showCommonSpinner } from "../../utils/common-helper";
import { validateEmail, validatePassword, validatePhoneNumber } from "../../utils/validation-helper";
import "./style.css";

const SignupPage = () => {
    const navigate = useNavigate();

    const goTOpage = (path) => {
        navigate(path)
    }

    const [inputFields, setInputFields] = useState({
        firstname: {
            value: '',
            isError: false
        },
        lastname: {
            value: '',
            isError: false
        },
        mobile: {
            value: '',
            isError: false
        },
        age: {
            value: 0,
            isError: false
        },
        gender: {
            value: '',
            isError: false
        },
        email: {
            value: '',
            isError: false
        },
        password: {
            value: '',
            isError: false
        }
    });
    const [isSubmitForm, setIsSubmitForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onInputValueChange = (event) => {
        let currentInput = { ...inputFields }
        if (event.target.name === 'email') {
            currentInput.email.value = event.target.value;
        }
         else if (event.target.name === 'password') {
            currentInput.password.value = event.target.value;
        } 
        else if (event.target.name === 'firstname') {
            currentInput.firstname.value = event.target.value;
        }
         else if (event.target.name === 'lastname') {
            currentInput.lastname.value = event.target.value;
        }
        
         else if (event.target.name === 'mobile') {
            currentInput.mobile.value = event.target.value;
        } 
       
         else if (event.target.name === 'age') {
            currentInput.age.value = event.target.value;
        } 

         else if (event.target.name === 'gender') {
            currentInput.gender.value = event.target.value;
        }
        setInputFields(currentInput);
        if (isSubmitForm) {
            validateForm();
        }
    }

    const validateForm = () => {
        let currentInput = { ...inputFields };
        let isNoError = true;
        // console.log('validateEmail(currentInput.email.value) ==> ', currentInput.email.value === '' || validateEmail(currentInput.email.value));
        if (currentInput.email.value !== '') {
            if (validateEmail(currentInput.email.value)) {
                currentInput.email.isError = false;
            } else {
                currentInput.email.isError = true;
            }
        } else {
            currentInput.email.isError = true;
        }

        if (currentInput.password.value !== '') {
            if (validatePassword(currentInput.password.value)) {
                currentInput.password.isError = false;
            } else {
                currentInput.password.isError = true;
            }
        } else {
            currentInput.password.isError = true;
        }

        if (currentInput.firstname.value !== '') {
            if (currentInput.firstname.value) {// regex validatepassword
                currentInput.firstname.isError = false;
            } else {
                currentInput.firstname.isError = true;
            }
        } else {
            currentInput.firstname.isError = true;
        }

        if (currentInput.lastname.value !== '') {
            if (currentInput.lastname.value) {// regex validatepassword
                currentInput.lastname.isError = false;
            } else {
                currentInput.lastname.isError = true;
            }
        } else {
            currentInput.lastname.isError = true;
        }

         if (currentInput.mobile.value !== '') {
            if (validatePhoneNumber(currentInput.mobile.value)) {// regex validatepassword
                currentInput.mobile.isError = false;
            } else {
                currentInput.mobile.isError = true;
            }
        } else {
            currentInput.mobile.isError = true;
        }


        if (currentInput.age.value !== 0 && currentInput.age.value >= 18 && currentInput.age.value <= 60) {
            if (currentInput.age.value) {// regex validatepassword
                currentInput.age.isError = false;
            } else {
                currentInput.age.isError = true;
            }
        } else {
            currentInput.age.isError = true;
        }


        if (currentInput.gender.value !== '') {
            if (currentInput.gender.value) {// regex validatepassword
                currentInput.gender.isError = false;
            } else {
                currentInput.gender.isError = true;
            }
        } else {
            currentInput.gender.isError = true;
        }

        if (currentInput.email.isError || currentInput.password.isError || currentInput.firstname.isError || currentInput.lastname.isError || currentInput.mobile.isError || currentInput.age.isError || currentInput.gender.isError) {
            isNoError = false;
        } else {
            isNoError = true;
        }
        return isNoError;
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setIsSubmitForm(true);
        setIsLoading(true);
        console.log('validateForm() => ', validateForm(), inputFields);
        if (validateForm()) {
            axios
            .post(config.serverURL+'/user/signup', 
            { 
                email:inputFields.email.value,
                password:inputFields.password.value,
                firstname:inputFields.firstname.value,
                lastname:inputFields.lastname.value,
                mobile:inputFields.mobile.value,
                age:inputFields.age.value,
                gender:inputFields.gender.value

            })
            .then((resposne) => {
                const result = resposne.data
                if ( result['status'] === 'error') {
                    toast.error(result.error)
                }
                else{
                    toast.success("Registration successful")
                    
                    navigate('/signin')
                }
            }).catch((error)=> {
                console.log(error)
            })
            setTimeout(() => {
                setIsLoading(false);
            }, 3000)
        } else {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="main-div signup-wrapper">
                <div className="form-div">
                    <form onSubmit={onSubmit}>
                        <div  className="heading">
                            <h3>Signup Page</h3>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Enter First Name</label>
                            <input
                                type="text"
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.firstname.isError ? 'error-input' : ''}`}
                                id="firstname"
                                name="firstname"
                                placeholder="First Name"
                            />
                            {inputFields.firstname.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.firstname.value === '' ? 'First Name is required.' : null }
                                </div> : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Enter Last Name</label>
                            <input
                                type="text"
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.lastname.isError ? 'error-input' : ''}`}
                                id="lastname"
                                name="lastname"
                                placeholder="Last Name"
                            />
                            {inputFields.lastname.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.lastname.value === '' ? 'Last Name is required.' : null }
                                </div> : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Enter Mobile Number</label>
                            <input
                                type="text"
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.mobile.isError ? 'error-input' : ''}`}
                                id="mobile"
                                name="mobile"
                                placeholder="Mobile No"
                            />
                            {inputFields.mobile.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.mobile.value === '' ? 'Mobile Number is required.' : null }
                                </div> : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Enter Age</label>
                            <input
                                type="number"
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.age.isError ? 'error-input' : ''}`}
                                id="age"
                                name="age"
                                placeholder="Age"
                            />
                            {inputFields.age.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.age.value === 0 ? 'Age is required.' : inputFields.age.value < 18 || inputFields.age.value > 60 ?'Age must be within 18 to 60' : null}
                                </div> : null}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Select Gender</label>
                           <div>
                           <input
                                type="radio"
                                onChange={(e) => onInputValueChange(e)}
                                className={` ${inputFields.gender.isError ? 'error-input' : ''}`}
                                id="gender"
                                name="gender"
                                value="M"
                            /> Male
                            <input
                                type="radio"
                                onChange={(e) => onInputValueChange(e)}
                                className={`m-3   ${inputFields.gender.isError ? 'error-input' : ''}`}
                                id="gender"
                                name="gender"
                                value="F"
                            /> Female
                            {inputFields.gender.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.gender.value === '' ? 'Gender is required.' : null }
                                </div> : null}
                           </div>
                        </div>


                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                            <input
                                type="text"
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.email.isError ? 'error-input' : ''}`}
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                            />
                            {inputFields.email.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.email.value === '' ? 'Email is required.' : 'Please enter valid email.'}
                                </div> : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Password</label>
                            <input
                                type="password"
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.password.isError ? 'error-input' : ''}`}
                                id="password"
                                name="password"
                                placeholder="" />
                            {inputFields.password.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.password.value === '' ? 'Password is required.' : 'Please enter valid password.'}
                                </div> : null}
                        </div>
                        <div className="btn-div">
                            <button
                                type='submit'
                                className="btn btn-block btn-primary">
                                Submit
                            </button>
                        </div>
                        <div>
                            Already registered... <Link className="text-primary" to='/signin'>Login</Link> here
                        </div>
                    </form>
                </div>
            </div>
            {showCommonSpinner(isLoading)}
        </>
    )
};

export default SignupPage;