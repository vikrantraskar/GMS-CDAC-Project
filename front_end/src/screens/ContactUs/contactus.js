import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCommonSpinner } from "../../utils/common-helper";
import { validateEmail, validatePassword } from "../../utils/validation-helper";

// use the dispatch to update the redux store about the signin state
import { useDispatch } from 'react-redux'
import { signin } from "../../slices/authSlice"
import "./style.css";
import config from "../../config";
import { toast } from "react-toastify";

const ContactUs = () => {
  

    const navigate = useNavigate();
    
    const [inputFields, setInputFields] = useState({
        fullname: {
            value: '',
            isError: false
        },
        email: {
            value: '',
            isError: false
        },
        message: {
            value: '',
            isError: false
        }
    });

    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const resetForm = () => {
    
        let currentInput = { ...inputFields };
        currentInput.fullname.value = "";
        currentInput.fullname.isError = false;
        currentInput.email.value = "";
        currentInput.email.isError = false;
        currentInput.message.value = "";
        currentInput.message.isError = false;
        setInputFields(currentInput);
        setIsSubmitForm(false);
      };

    const onInputValueChange = (event) => {
        let currentInput = { ...inputFields }
        if (event.target.name === 'fullname') {
            currentInput.fullname.value = event.target.value;
        } else if (event.target.name === 'email') {
            currentInput.email.value = event.target.value;
        } else if (event.target.name === 'message') {
            currentInput.message.value = event.target.value;
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
        if (currentInput.fullname.value !== '') {
            if ((currentInput.fullname.value)) {
                currentInput.fullname.isError = false;
            } else {
                currentInput.fullname.isError = true;
            }
        } else {
            currentInput.fullname.isError = true;
        }
        
        if (currentInput.email.value !== '') {
            if (validateEmail(currentInput.email.value)) {
                currentInput.email.isError = false;
            } else {
                currentInput.email.isError = true;
            }
        } else {
            currentInput.email.isError = true;
        }

        if (currentInput.message.value !== '') {
            if ((currentInput.message.value)) {
                currentInput.message.isError = false;
            } else {
                currentInput.message.isError = true;
            }
        } else {
            currentInput.message.isError = true;
        }

        if (currentInput.fullname.isError ||currentInput.email.isError || currentInput.message.isError) {
            isNoError = false;
        } else {
            isNoError = true;
        }
        return isNoError;
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setIsSubmitForm(true);

        if (validateForm()) {
            axios
            .post(config.serverURL+'/user/contactus', { fullname:inputFields.fullname.value, email:inputFields.email.value, message:inputFields.message.value })
            .then((resposne) => {
                const result = resposne.data
                if ( result['status'] === 'error') {
                    // toast.error("no user exist")
                }
                else{
                    resetForm()
                    toast.success("Query submitted successfully")
                }
            }).catch((error)=> {
                console.log(error)
            })
        } 
    }

    return (
        <>
        
            <div className="main-div signin-wrapper">
                <div className="form-div">
                    <form onSubmit={onSubmit}>
                        <div className="heading">
                            <h3>Contact Us</h3>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Fullname</label>
                            <input
                                type={"text"}
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.fullname.isError ? 'error-input' : ''}`}
                                id="fullname"
                                name="fullname"
                                placeholder="" 
                                value={inputFields.fullname.value}/>
                            {inputFields.fullname.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.fullname.value === '' ? 'please fill  your full name.' : null}
                                </div> : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Email</label>
                            <input
                                type={"email"}
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.email.isError ? 'error-input' : ''}`}
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                value={inputFields.email.value}
                            />
                            {inputFields.email.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.email.value === '' ? 'Email is required.' : 'Please enter valid email.'}
                                </div> : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Message</label>
                            <input
                                type={"text"}
                                onChange={(e) => onInputValueChange(e)}
                                className={`form-control ${inputFields.message.isError ? 'error-input' : ''}`}
                                id="message"
                                name="message"
                                placeholder=""
                                value={inputFields.message.value} />
                            
                            {inputFields.message.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.message.value === '' ? 'Message is required.' : null}
                                </div> : null}
                        </div>
                        <div className="btn-div">
                            <button
                                type='submit'
                                className="btn btn-block btn-primary">
                                Submit
                            </button>
                        </div>
                       
                    </form>
                </div>
            </div>
        </>
    )
};

export default ContactUs;
