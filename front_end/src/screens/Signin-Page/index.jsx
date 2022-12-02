import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { showCommonSpinner } from "../../utils/common-helper";
import { validateEmail, validatePassword } from "../../utils/validation-helper";

// use the dispatch to update the redux store about the signin state
import { useDispatch } from 'react-redux'
import { signin } from "../../slices/authSlice"
import "./style.css";
import config from "../../config";

const SigninPage = () => {
      // get the dispatcher
  const dispatch = useDispatch()
  

    const navigate = useNavigate();
  
    const goTOpage = (path) => {
        navigate(path)
    }

    const [inputFields, setInputFields] = useState({
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
        } else if (event.target.name === 'password') {
            currentInput.password.value = event.target.value;
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
            if ((currentInput.password.value)) {
                currentInput.password.isError = false;
            } else {
                currentInput.password.isError = true;
            }
        } else {
            currentInput.password.isError = true;
        }

        if (currentInput.email.isError || currentInput.password.isError) {
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
        //console.log('validateForm() => ', validateForm(), inputFields);
        // navigate('/dashboard')
        if (validateForm()) {
            axios
            .post(config.serverURL+'/user/signin', { email:inputFields.email.value, password:inputFields.password.value })
            .then((resposne) => {
                const result = resposne.data
                if ( result['status'] === 'error') {
                    // toast.error("no user exist")
                }
                else{
                    // get the logged in user's info
                    const user = result['data']

                    // send the action
                    dispatch(signin(user))

                    // sessionStorage['email'] = result['data']['email']
                    // sessionStorage['token'] = result['data']['token']
                    // sessionStorage['role_id'] = result['data']['role_id']
                    // toast.success("signin successful")
                    navigate('/dashboard')
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
            <div className="main-div signin-wrapper">
                <div className="form-div">
                    <form onSubmit={onSubmit}>
                        <div className="heading">
                            <h3>Signin Page</h3>
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
                        <div>New user can <Link className="text-primary" to="/signup">register</Link> here!!</div>
                    </form>
                </div>
            </div>
            {showCommonSpinner(isLoading)}
        </>
    )
};

export default SigninPage;
