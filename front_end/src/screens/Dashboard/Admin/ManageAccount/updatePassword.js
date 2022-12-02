
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { validatePassword } from "../../../../utils/validation-helper";
import { toast } from "react-toastify";
import config from "../../../../config";

const UpdatePassword = () => {
    const authData = useSelector((state) => state.auth.authData);
    //false : update is not clicked yet for first time
    const [isSubmitForm, setIsSubmitForm] = useState(false);

    const [inputFields, setInputFields] = useState({
        password: {
            value: '',
            isError: false
        },
        confirmPassword: {
            value: '',
            isError: false
        }
    })

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const resetForm = () => {
        setPassword("");
        setConfirmPassword("");
        let currentInput = { ...inputFields }
        currentInput.password.value = '';
        currentInput.password.isError = false;
        currentInput.confirmPassword.value = '';
        currentInput.confirmPassword.isError = false;
        setInputFields(currentInput);
        
        setIsSubmitForm(false);
    };
    //on typing this will execute
    const onInputValueChange = (event) => {
        let currentInput = { ...inputFields }
        if (event.target.name === 'password') {
            currentInput.password.value = event.target.value;
        } else if (event.target.name === 'confirmPassword') {
            currentInput.confirmPassword.value = event.target.value;
        }
        setInputFields(currentInput);
        //this will check if you are performing it first time without clicking on update
        if (isSubmitForm) {
            validateForm();
        }
    }

    const validateForm = () => {
        let currentInput = { ...inputFields };
        //isNoError == true  :::: it means there is no error in this form
        let isNoError = true;
        if (currentInput.password.value !== '') {
            if (currentInput.password.value) {// regex validatepassword
                currentInput.password.isError = false;
            } else {
                currentInput.password.isError = true;
            }
        } else {
            currentInput.password.isError = true;
        }
        // ---------------------------------------------------------------------

        if (currentInput.confirmPassword.value !== '') {
            if (currentInput.confirmPassword.value) { // regex validatepassword
                if (currentInput.confirmPassword.value !== currentInput.password.value) {
                    //isNoError = false;
                    currentInput.confirmPassword.isError = true;
                } else {
                    currentInput.confirmPassword.isError = false;
                }
            } else {
                currentInput.confirmPassword.isError = true;
            }
        } else {
            currentInput.confirmPassword.isError = true;
        }
        //-------------------------------------------------------------------------------

        if (currentInput.confirmPassword.isError || currentInput.password.isError) {
            isNoError = false;
        } else {
            isNoError = true;
        }

        return isNoError;
    }

    const onSubmit = () => {
        //form is submitted NOW()
        setIsSubmitForm(true);
        // console.log('validateForm() ::: ', validateForm());
        if (validateForm()) {
            axios
            .post(config.serverURL+`/admin/updatePassword`, { password: inputFields.password.value }, {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + result)
                if (result.status == "error"  ) {
                    toast.error(result.error);
                  } else {
                      toast.success("Password get update successfully");
                    
                  }
                resetForm();
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    return (
        <div className="screen-wrapper">
            <div className="screen-heading">Update Profile</div>
            <div className="screen-content">
                <div className="row">
                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="firstname">Password</label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="password"
                                type="password"
                                id="password"
                                class="feedback-input"
                                value={inputFields.password.value}
                            />
                            {inputFields.password.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.password.value === '' ? 'Password is required.' : 'Please enter valid password.'}
                                </div> : null}
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="firstname">Confirm Password</label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="confirmPassword"
                                type="password"
                                id="confirmPassword"
                                class="feedback-input"
                                value={inputFields.confirmPassword.value}
                            />
                            {inputFields.confirmPassword.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.confirmPassword.value === '' ? 'Confirm Password is required.' : inputFields.confirmPassword.value !== inputFields.password.value ? 'Password & Confirm password should be same' : 'Please enter valid confirm password.'}
                                </div> : null}
                        </div>
                    </div>
                    <div className="col"></div>
                    <div className="action-div">
                        <button onClick={resetForm} className="negative-btn">Cancel</button>
                        <buttom onClick={onSubmit} className="positive-btn">Update</buttom>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default UpdatePassword

