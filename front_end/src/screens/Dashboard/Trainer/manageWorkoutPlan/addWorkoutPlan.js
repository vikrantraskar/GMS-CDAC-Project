
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import config from "../../../../config";

const AddWorkoutPlan = () => {
    const authData = useSelector((state) => state.auth.authData);
    const navigate = useNavigate()
    const location = useLocation()

    //false : update is not clicked yet for first time
    const [isSubmitForm, setIsSubmitForm] = useState(false);
    const [status, setStatus] = useState()
    const [workoutTypes, setWorkoutType] = useState([])

    const [inputFields, setInputFields] = useState({
        user_id: {
            value: 0,
            isError: false
        },
        Day: {
            value: '',
            isError: false
        },
        wType_id: {
            value: 0,
            isError: false
        },
        set: {
            value: 0,
            isError: false
        },
        reps: {
            value: 0,
            isError: false
        }
    })

    //user_id | Day     | wType_id | sets | reps |
    const [user_id, setUser_id] = useState('')
    const [Day, setDay] = useState('')
    const [wType_id, setWType_id] = useState('')
    const [set, setSet] = useState(0)
    const [reps, setReps] = useState('')

    const resetForm = () => {
        setUser_id(0);
        setDay("");
        setWType_id(0);
        setSet(0);
        setReps(0);
        let currentInput = { ...inputFields }
        currentInput.user_id.value = 0;
        currentInput.user_id.isError = false;
        currentInput.Day.value = '';
        currentInput.Day.isError = false;
        currentInput.wType_id.value = 0;
        currentInput.wType_id.isError = false;
        currentInput.set.value = 0;
        currentInput.set.isError = false;
        currentInput.reps.value = 0;
        currentInput.reps.isError = false;

        setInputFields(currentInput);

        setIsSubmitForm(false);
    };

    //on typing this will execute
    const onInputValueChange = (event) => {
        let currentInput = { ...inputFields }
        if (event.target.name === 'user_id') {
            currentInput.user_id.value = event.target.value;
        }
        else if (event.target.name === 'Day') {
            currentInput.Day.value = event.target.value;
        }
        else if (event.target.name === 'wType_id') {
            currentInput.wType_id.value = event.target.value;
        }
        else if (event.target.name === 'set') {
            currentInput.set.value = event.target.value;
        }
        else if (event.target.name === 'reps') {
            currentInput.reps.value = event.target.value;
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
        if (currentInput.user_id.value !== 0) {
            if (currentInput.user_id.value) {// regex validatepassword
                currentInput.user_id.isError = false;
            } else {
                currentInput.user_id.isError = true;
            }
        } else {
            currentInput.user_id.isError = true;
        }


        if (currentInput.Day.value !== '') {
            if (currentInput.Day.value) {// regex validatepassword
                currentInput.Day.isError = false;
            } else {
                currentInput.Day.isError = true;
            }
        } else {
            currentInput.Day.isError = true;
        }


        if (currentInput.wType_id.value !== 0) {
            if (currentInput.wType_id.value) {// regex validatepassword
                currentInput.wType_id.isError = false;
            } else {
                currentInput.wType_id.isError = true;
            }
        } else {
            currentInput.wType_id.isError = true;
        }


        if (currentInput.set.value !== 0) {
            if (currentInput.set.value) {// regex validatepassword
                currentInput.set.isError = false;
            } else {
                currentInput.set.isError = true;
            }
        } else {
            currentInput.set.isError = true;
        }


        if (currentInput.reps.value !== 0) {
            if (currentInput.reps.value) {// regex validatepassword
                currentInput.reps.isError = false;
            } else {
                currentInput.reps.isError = true;
            }
        } else {
            currentInput.reps.isError = true;
        }


        if (currentInput.user_id.isError || currentInput.Day.isError || currentInput.wType_id.isError || currentInput.set.isError || currentInput.reps.isError) {
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
                .post(config.serverURL+ '/trainer/workoutPlan', { user_id: inputFields.user_id.value, Day: inputFields.Day.value, wType_id: inputFields.wType_id.value, set: inputFields.set.value, reps: inputFields.reps.value }, {
                    headers: {
                        'token': authData?.token
                    }
                })
                .then((resposne) => {
                    const result = resposne.data
                    console.log("res " + result)
                    setStatus(resposne.data.status)
                    resetForm();
                    if (status === "error" || status === '') {
                        toast.error("user don't have PT program")

                    } else {

                        toast.success("workout plan added successfully")
                        navigate("/dashboard/trainer/getmystudents")
                    }
                }).catch((error) => {

                    toast.error("user don't have PT program")
                    console.log(error)
                })
        }
    }
    // to get list
    const fetch = () => {
        axios
            .get(config.serverURL+ '/trainer/getAllwtype', {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + JSON.stringify(result["data"]))
                // console.log("res "+result["data"])
                setWorkoutType(result["data"])
                let currentInput = { ...inputFields }
                currentInput.wType_id.value = result.data[0].wType_id
                setInputFields(currentInput)
            }).catch((error) => {
                console.log(error)
            })
    }

    //lifecycle hook to load data on event
    useEffect(() => {
        fetch()
        const { user_id } = location.state
        let currentInput = { ...inputFields }
        console.log("type " + user_id)
        currentInput.user_id.value = user_id
        setInputFields(currentInput)
    }, [])

    return (

        <div className="screen-wrapper">
            <div className="screen-heading">Add Workout Plan</div>
            <div className="screen-content">
                <div className="row">
                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="user_id">User Id </label></div>

                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="user_id"
                                type="number"
                                id="user_id"
                                class="feedback-input"
                                value={inputFields.user_id.value}
                            />
                            {inputFields.user_id.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.user_id.value === 0 ? 'user_id is required.' : 'Please enter valid user_id.'}
                                </div> : null}

                        </div>
                    </div>

                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="Day">Day</label></div>

                            {/* <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="Day"
                                type="text"
                                id="Day"
                                class="feedback-input"
                                value={inputFields.Day.value}
                            /> */}
                            <select name="Day" id="Day" onChange={(e) => { onInputValueChange(e) }} value={inputFields.Day.value} >
                                <option disabled value={''} selected>select</option>

                                <option value={"Monday"}>Monday</option>
                                <option value={"Tuesday"}>Tuesday</option>
                                <option value={"Wednesday"}>Wednesday</option>
                                <option value={"Thursday"}>Thursday</option>
                                <option value={"Friday"}>Friday</option>
                                <option value={"Saturday"}>Saturday</option>
                                <option value={"Sunday"}>Sunday</option>
                            </select>

                            {inputFields.Day.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.Day.value === '' ? 'Day is required.' : 'Please enter valid Day.'}
                                </div> : null}

                        </div>
                    </div>

                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="wType_id">workout type id</label></div>

                            <select 
                                name="wType_id" 
                                id="wType_id" 
                                onChange={(e) => { onInputValueChange(e) }} 
                                value={inputFields.wType_id.value} >
                                <option selected disabled>Select</option>
                                {
                                    workoutTypes && workoutTypes.length ?
                                        workoutTypes.map((element, index) => {
                                            return (
                                                <option key={index} value={element.wType_id}>{`${element.type} `}</option>
                                            )
                                        })
                                        :
                                        null
                                }


                            </select>

                            {inputFields.wType_id.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.wType_id.value === 0 ? 'wType_id is required.' : 'Please enter valid Wtype_id.'}
                                </div> : null}
                        </div>
                    </div>


                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="reps">Reps </label></div>

                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="reps"
                                type="number"
                                id="reps"
                                class="feedback-input"
                                value={inputFields.reps.value}
                            />
                            {inputFields.reps.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.reps.value === 0 ? 'reps is required.' : 'Please enter valid reps.'}
                                </div> : null}
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="set">Set</label></div>

                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="set"
                                type="number"
                                id="set"
                                class="feedback-input"
                                value={inputFields.set.value}
                            />
                            {inputFields.reps.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.set.value === 0 ? 'set is required.' : 'Please enter valid set.'}
                                </div> : null}

                        </div>
                    </div>


                    <div className="col"></div>
                </div>

                <div className="action-div">
                    <button onClick={resetForm} className="negative-btn">Cancel</button>
                    <buttom onClick={onSubmit} className="positive-btn">Add</buttom>
                </div>
            </div>
        </div>
    )

}
export default AddWorkoutPlan

