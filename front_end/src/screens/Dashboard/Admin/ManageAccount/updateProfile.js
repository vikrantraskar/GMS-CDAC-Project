
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import config from "../../../../config";

const UpdateProfile = () =>{
    const authData = useSelector((state) => state.auth.authData);
     //false : update is not clicked yet for first time
     const [isSubmitForm, setIsSubmitForm] = useState(false);
     const [status, setStatus] = useState()
     
     // const{id} = request.params
   
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
        }
    })
    
    const resetForm = () => {
        let currentInput = { ...inputFields }
        currentInput.firstname.value = '';
        currentInput.firstname.isError = false;
        currentInput.lastname.value = '';
        currentInput.lastname.isError = false;
        currentInput.mobile.value = '';
        currentInput.mobile.isError = false;
        currentInput.age.value = 0;
        currentInput.age.isError = false;
        currentInput.gender.value = '';
        currentInput.gender.isError = false;
        
        setInputFields(currentInput);
        
        setIsSubmitForm(false);
    };

     //on typing this will execute
     const onInputValueChange = (event) => {
        let currentInput = { ...inputFields }
        if (event.target.name === 'firstname') {
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
        //this will check if you are performing it first time without clicking on update
        if (isSubmitForm) {
            validateForm();
        }
    }

    const validateForm = () => {
        let currentInput = { ...inputFields };
        //isNoError == true  :::: it means there is no error in this form
        let isNoError = true;
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
            if (currentInput.mobile.value) {// regex validatepassword
                currentInput.mobile.isError = false;
            } else {
                currentInput.mobile.isError = true;
            }
        } else {
            currentInput.mobile.isError = true;
        }


        if (currentInput.age.value >= 18 && currentInput.age.value <= 60) {
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
      

        if (currentInput.firstname.isError || currentInput.lastname.isError || currentInput.mobile.isError || currentInput.age.isError|| currentInput.gender.isError) {
            isNoError = false;
        } else {
            isNoError = true;
        }

        return isNoError;
    }
    const onSubmit = () => {
        //form is submitted NOW()
        setIsSubmitForm(true);
         console.log('validateForm() ::: '+ validateForm());
        if (validateForm()) {
        axios
            .post(config.serverURL+'/admin/updateProfile', 
            { firstname:inputFields.firstname.value, 
                lastname:inputFields.lastname.value, 
                mobile:inputFields.mobile.value, 
                age:inputFields.age.value,
                gender:inputFields.gender.value
             }, 
                {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + JSON.stringify(result))
                setStatus(result.status)
                fetch();
                console.log("status = " + result.status);
                if(status === "error" || status === '')
                {
                    toast.error("profile not updated")

                }else{

                    toast.success("profile updated successfully")
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
                            <div><label htmlFor="firstname">First Name </label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="firstname"
                                type="text"
                                id="firstname"
                                class="feedback-input"
                                value={inputFields.firstname.value}
                            />
                            {inputFields.firstname.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.firstname.value === '' ? 'firstname is required.' : null}
                                </div> : null}
                            
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="lastname">Last Name </label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="lastname"
                                type="text"
                                id="lastname"
                                class="feedback-input"
                                value={inputFields.lastname.value}
                            />
                            {inputFields.lastname.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.lastname.value === '' ? 'lastname is required.' : null}
                                </div> : null}
                            
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="mobile">Mobile </label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="mobile"
                                type="text"
                                id="mobile"
                                class="feedback-input"
                                value={inputFields.mobile.value}
                            />
                            {inputFields.mobile.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.mobile.value === '' ? 'mobile is required.' : null}
                                </div> : null}
                        </div>
                    </div>
                    
                </div>

                <div className="row">
                <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="age">Age </label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="age"
                                type="number"
                                id="age"
                                class="feedback-input"
                                value={inputFields.age.value}
                            />
                             {inputFields.age.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.age.value === 0 ? 'Age is required.' : inputFields.age.value < 18 || inputFields.age.value > 60 ?'Age must be within 18 to 60' : null}
                                </div> : null}
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="gender">Gender </label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="gender"
                                type="text"
                                id="gender"
                                class="feedback-input"
                                placeholder="M/F"
                                value={inputFields.gender.value}
                            />
                            {inputFields.gender.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.gender.value === '' ? 'gender is required.' : null}
                                </div> : null}
                        </div>
                    </div>
                    <div className="col"></div>
                </div>

                <div className="action-div">
                    <button onClick={resetForm} className="negative-btn">Cancel</button>
                    <buttom onClick={()=> onSubmit()} className="positive-btn">Update</buttom>
                </div>
            </div>
        </div>

        )  
                         

}
export default UpdateProfile

    