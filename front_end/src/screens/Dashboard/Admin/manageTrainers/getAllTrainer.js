import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import {
    Button, Modal, ModalFooter,
    ModalHeader, ModalBody, Table
} from "reactstrap"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail, validatePassword, validatePhoneNumber } from "../../../../utils/validation-helper";
import config from "../../../../config";



const GetAllTrainer = () => {
    const authData = useSelector((state) => state.auth.authData);
    const [isSubmitForm, setIsSubmitForm] = useState(false);
    // add your states here
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
        },
       role_id: {
            value: 0,
            isError: false
        },
       salary: {
            value: 0,
            isError: false
        }
    })
    
    // ----------------------------------------------
    //to get data
    const [typeArray, setTypeArray] = useState([])

    // Modal open state
    const [modal, setModal] = React.useState(false);

    // isUpdate or Not
    const [isUpdate, setIsUpdate] = React.useState(false);

    const navigate = useNavigate()

    //lifecycle hook to load data on event
    useEffect(() => {
        fetch()
    }, [])

    const toggle = () => setModal(!modal);


    const updateForm = (id) => {
        // set your states here
        navigate('/dashboard/admin/getAllTrainer/updateSalary', { state: { trainer_id: id } })
        // ------------------------
        setIsUpdate(true)
        toggle()


    }

    //resetForm
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
        currentInput.email.value = '';
        currentInput.email.isError = false;
        currentInput.password.value = '';
        currentInput.password.isError = false;
        currentInput.role_id.value = 0;
        currentInput.role_id.isError = false;
        currentInput.salary.value = 0;
        currentInput.salary.isError = false;
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
            else if (event.target.name === 'email') {
               currentInput.email.value = event.target.value;
           }
            else if (event.target.name === 'password') {
               currentInput.password.value = event.target.value;
           }
            else if (event.target.name === 'role_id') {
               currentInput.role_id.value = event.target.value;
           }
             else if (event.target.name === 'salary') {
               currentInput.salary.value = event.target.value;
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
            if (validatePhoneNumber(currentInput.mobile.value)) {// regex validatepassword
                currentInput.mobile.isError = false;
            } else {
                currentInput.mobile.isError = true;
            }
        } else {
            currentInput.mobile.isError = true;
        }


        if (currentInput.age.value !== 0 && currentInput.age.value > 0) {
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
        
         if (currentInput.email.value !== '') {
            if (validateEmail(currentInput.email.value)) {// regex validatepassword
                currentInput.email.isError = false;
            } else {
                currentInput.email.isError = true;
            }
        } else {
            currentInput.email.isError = true;
        }
      
          if (currentInput.password.value !== '') {
            if (validatePassword(currentInput.password.value)) {// regex validatepassword
                currentInput.password.isError = false;
            } else {
                currentInput.password.isError = true;
            }
        } else {
            currentInput.password.isError = true;
        }
      
        if (currentInput.role_id.value !== 0) {
            if (currentInput.role_id.value) {// regex validatepassword
                currentInput.role_id.isError = false;
            } else {
                currentInput.role_id.isError = true;
            }
        } else {
            currentInput.role_id.isError = true;
        }

         if (currentInput.salary.value !== 0) {
            if (currentInput.salary.value) {// regex validatepassword
                currentInput.salary.isError = false;
            } else {
                currentInput.salary.isError = true;
            }
        } else {
            currentInput.salary.isError = true;
        }

        if (currentInput.firstname.isError || currentInput.lastname.isError || currentInput.mobile.isError || currentInput.age.isError 
            || currentInput.gender.isError || currentInput.email.isError || currentInput.password.isError || currentInput.role_id.isError || currentInput.salary.isError) {
            isNoError = false;
        } else {
            isNoError = true;
        }

        return isNoError;
    }


    const onSubmit = (e) => {
        e.preventDefault()
        setIsSubmitForm(true)
        //insert call
        if(validateForm()){

            if (!isUpdate) {
                console.log("iSUpdate false ");
                axios
                    .post(config.serverURL+'/admin/addTrainer',
                    {   firstname:inputFields.firstname.value, 
                        lastname:inputFields.lastname.value, 
                        mobile:inputFields.mobile.value, 
                        age:inputFields.age.value,
                        gender:inputFields.gender.value,
                        email:inputFields.email.value,
                        password:inputFields.password.value,
                        role_id:inputFields.role_id.value,
                        salary:inputFields.salary.value
                     },
                    {
                        headers: {
                            'token': authData?.token
                        }
                    })
                    .then((resposne) => {
                        toggle()
                        fetch()
                        const result = resposne.data
                        console.log("res " + result)
                        resetForm();
                        if (result.status == "error"  ) {
                            toast.error(result.error);
                          } else {
                            toast.success('Trainer added successfully')
                            
                          }
                       
                    }).catch((error) => {
                        console.log(error)
                    })
            }
            // call
            else {
                // console.log("iSUpdate true ");
                // axios
                //     .put(`http://localhost:5000/trainer/updatewtype/${wType_id}`, { type }, {
                //         headers: {
                //             'token': authData?.token
                //         }
                //     })
                //     .then((resposne) => {
                //         toggle()
                //         const result = resposne.data
                //         console.log("res " + result["data"])
                //         console.log("id is " + wType_id + " and inside")
                //         fetch()
                //         alert(`${type} updated successfully`);
                //         // resetForm()
                //         resetForm()
                //     }).catch((error) => {
                //         console.log(error)
                //     })
            }
        } 
    }

    const onClose = () => {
        resetForm()
        toggle()
    }

    const closeBtn = (
        <button className="close" onClick={onClose}>
            &times;
        </button>
    );

    const navigateToPage = (path, id) => {
        navigate(path, {state: { trainer_id: id }})
    }



    // to get list
    const fetch = () => {
        axios
            .get(config.serverURL+'/admin/getTrainer', {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + JSON.stringify(result["data"]))
                // console.log("res "+result["data"])
                setTypeArray(result["data"])
                if (result.status == "error"  ) {
                    toast.error(result.error);
                  } else {
                    toast.success('Trainer list load successfully')
                    
                  }
               
            }).catch((error) => {
                console.log(error)
            })
    }

    const deleteFunct = (id) => {
        // e.preventDefault()
        // console.log("TOKEN "+authData.token);
        axios
            .delete(config.serverURL+`/admin/deleteTrainer/${id}`, {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + JSON.stringify(result["data"]))
                fetch()
                if (result.status == "error"  ) {
                    toast.error(result.error);
                  } else {
                    toast.success('Trainer deleted successfully')
                }
             }).catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <div className="screen-wrapper">
                <div className="screen-heading">Manage Trainer</div>

                <div className="screen-content">
                    <div className="subheader">
                        <div onClick={toggle} className="positive-btn">+ Add Trainer</div>
                    </div>
                    <Table responsive hover striped className="table table-resposne">
                        <thead>
                            <th>Trainer Id</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Salary</th>
                        </thead>
                        <tbody>
                            {typeArray && typeArray.length ?
                                typeArray.map((type, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{type["user_id"]}</td>
                                            <td>{type["firstname"]}</td>
                                            <td>{type["lastname"]}</td>
                                            <td>{type["email"]}</td>
                                            <td>{type["salary"]}</td>
                                            <td>
                                                <button className="btn btn-danger text-white m-1 "  onClick={() => deleteFunct(type["user_id"])}>Delete</button>
                                                <button className="btn btn-warning" onClick={() => updateForm(type["user_id"])}>Update Salary</button>
                                                <button className="btn btn-secondary m-2" onClick={() => navigateToPage("/dashboard/admin/getAllShiftofAllTrainers", type["user_id"])}>View Shift</button>                                                   
                                            </td>
                                        </tr>
                                    )
                                })
                                : <div className="empty-view">
                                    NO DATA FOUND
                                </div>
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
            <div>
                
                <Modal isOpen={modal} toggle={onclose} centered>
                    <form onSubmit={onSubmit}>
                        <ModalHeader className=" border-0" toggle={onclose} close={onClose}>
                            Add Trainer
                        </ModalHeader>
                        <ModalBody className="text-left border-0">
                            {/* add your form fields here */}

                            <p className="modal-label"> Enter First Name : </p>
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
                            
                            
                            <p className="modal-label"> Enter Last Name : </p>
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
                            <p className="modal-label"> Enter Mobile No : </p>
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
                                    {inputFields.mobile.value === '' ? 'mobile is required.' : inputFields.mobile.value < 0 ? 'cannot be negative' : null}
                                </div> : null}
                            <p className="modal-label"> Enter Age : </p>
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
                                    {inputFields.age.value === 0 ? 'age is required.' : inputFields.age.value < 0 ? 'cannot be negative' : null}
                                </div> : null}
                            <p className="modal-label"> Select Gender : </p>
                           <input
                                type="radio"
                                onChange={(e) => onInputValueChange(e)}
                                className={`m-1 ${inputFields.gender.isError ? 'error-input' : ''}`}
                                id="gender"
                                name="gender"
                                value="M"
                            /> Male
                            <input
                                type="radio"
                                onChange={(e) => onInputValueChange(e)}
                                className={`m-1   ${inputFields.gender.isError ? 'error-input' : ''}`}
                                id="gender"
                                name="gender"
                                value="F"
                            /> Female
                            {inputFields.gender.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.gender.value === '' ? 'Gender is required.' : null }
                                </div> : null}
                           {/* </div> */}
                            <p className="modal-label"> Enter Email id : </p>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="email"
                                type="text"
                                id="email"
                                class="feedback-input"
                                value={inputFields.email.value}
                            />
                            {inputFields.email.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.email.value === '' ? 'email is required.' : null}
                                </div> : null}
                            <p className="modal-label"> Enter Password : </p>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="password"
                                type="text"
                                id="password"
                                class="feedback-input"
                                value={inputFields.password.value}
                            />
                            {inputFields.password.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.password.value === '' ? 'password is required.' : null}
                                </div> : null}
                            <p className="modal-label">  Role Id : </p>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="role_id"
                                type="number"
                                id="role_id"
                                class="feedback-input"
                                value={inputFields.role_id.value}
                            />
                            {inputFields.role_id.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.role_id.value === 0 ? 'role id is required.' : null}
                                </div> : null}
                            <p className="modal-label">  Salary : </p>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="salary"
                                type="number"
                                id="salary"
                                class="feedback-input"
                                value={inputFields.salary.value}
                            />
                            {inputFields.salary.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.salary.value === 0 ? 'salary is required.' : null}
                                </div> : null}

                            {/* ------------------------------------------ */}
                        </ModalBody>
                        <ModalFooter className="modal-footer border-0">
                            <Button className="btn_secondary modal-btn" onClick={onClose}>
                                Cancel
                            </Button>{" "}
                            &nbsp;&nbsp;
                            <Button
                                className="btn btn_primary modal-btn"
                                type="submit"
                            >Submit</Button>{" "}
                        </ModalFooter>
                    </form>
                </Modal>
            </div>

        </div>
    )
}

export default GetAllTrainer