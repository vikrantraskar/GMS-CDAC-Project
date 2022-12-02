import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../../../config";

const AssignShiftToSpecificTrainer = () =>{
    const authData = useSelector((state) => state.auth.authData);

    const location = useLocation()

    const navigate = useNavigate()

    const [isSubmitForm, setIsSubmitForm] = useState(false);
    //to get data
  const [shiftArray, setShiftArray] = useState([]);

  // Modal open state
  const [modal, setModal] = React.useState(false);
  const [inputFields, setInputFields] = useState({
    user_id: {
        value: 0,
        isError: false
    },
    shift_id: {
        value: 0,
        isError: false
    }
  })

  const toggle = () => setModal(!modal);

   //resetForm
   const resetForm = () => {
    let currentInput = { ...inputFields }
    currentInput.user_id.value = 0;
    currentInput.user_id.isError = false;
    currentInput.shift_id.value = 0;
    currentInput.shift_id.isError = false;
    setInputFields(currentInput);
        
    setIsSubmitForm(false);
  };
  //on typing this will execute
  const onInputValueChange = (event) => {
    let currentInput = { ...inputFields }
    if (event.target.name === 'user_id') {
        currentInput.user_id.value = event.target.value;
    }  else if (event.target.name === 'shift_id') {
        currentInput.shift_id.value = event.target.value;
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
    if (currentInput.user_id.value !== 0 && currentInput.user_id.value > 0) {
        if (currentInput.user_id.value) {// regex validatepassword
            currentInput.user_id.isError = false;
        } else {
            currentInput.user_id.isError = true;
        }
    } else {
        currentInput.user_id.isError = true;
    }

    if (currentInput.shift_id.value !== 0 && currentInput.shift_id.value > 0) {
        if (currentInput.shift_id.value) {// regex validatepassword
            currentInput.shift_id.isError = false;
        } else {
            currentInput.shift_id.isError = true;
        }
    } else {
        currentInput.shift_id.isError = true;
    }

    if (currentInput.user_id.isError || currentInput.shift_id.isError) {
        isNoError = false;
    } else {
        isNoError = true;
    }
    
    return isNoError;

}
const onSubmit = () => {
    setIsSubmitForm(true)
    //insert call
    
    if(validateForm()){
      axios
      .post(
        config.serverURL+`/admin/allotShift`,
        { user_id:inputFields.user_id.value,
          shift_id:inputFields.shift_id.value },
        {
          headers: {
            token: authData?.token,
          },
        }
      
      )
      .then((resposne) => {
        toggle()
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        fetchNonSelectedShift();
        if (result.status == "error"  ) {
          toast.error(result.error);
        } else 
        {
           toast.success("Shift Alloted Successfully");
           navigate("/dashboard/admin/getAllShiftofAllTrainers", {state:{ trainer_id: inputFields.user_id.value}})
        }
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
  };

  const onClose = () => {
    toggle();
  };

  const closeBtn = (
    <button className="close" onClick={onClose}>
      &times;
    </button>
  );
 // to get shift_id list
 const fetchNonSelectedShift = ()=>{
    axios
    .post(config.serverURL+'/admin/nonSelectedShifts', { user_id: inputFields.user_id.value}, {
        headers: {
            'token': authData?.token
        }
    })
    .then((resposne) => {
        const result = resposne.data
        console.log("res " + JSON.stringify(result["data"]))
        // console.log("res "+result["data"])
        setShiftArray(result["data"])
    }).catch((error) => {
        console.log(error)
    })

 };

   //lifecycle hook to load data on event
   useEffect(() => {
    fetchNonSelectedShift();
    const { trainer_id } = location.state
    let currentInput = {...inputFields};
    currentInput.user_id.value = trainer_id;
    setInputFields(currentInput);
  }, [location.state]);

 return (
    <div className="screen-wrapper">
        <div className="screen-heading">Assign Shift</div>
        <div className="screen-content">
            <div className="row">
                <div className="col">
                    <div className="form-field">
                        <div><label htmlFor="user_id" >  User Id :  </label> </div>
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
                                    {inputFields.user_id.value === 0 ? 'User_id is required.' : 'Please enter valid user_id.'}
                                </div> : null}
                    </div>
                </div>
                <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="shift_id">Shift Id</label></div>
                            <select
                                name="shift_id"
                                id="shift_id"
                                onChange={(e) => { onInputValueChange(e) }}
                                value={inputFields.shift_id.value}
                            >
                                <option value={0} disabled>
                                    None
                                </option>
                                {shiftArray && shiftArray.length
                                    ? shiftArray.map((element, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={element.shift_id}
                                            >{`${element.time_slot} `}</option>
                                        );
                                    })
                                    : null}
                            </select>
                        </div>
                    </div>
                   
               </div>
               <div>
                <div className="col">
                <div className="action-div">
                        <buttom onClick={() => onSubmit()} className="positive-btn">Add</buttom>
                    </div> 
                </div>
                <div className="col"></div>
                <div className="col"></div>
            </div>
        </div>
    </div>
)
}

export default AssignShiftToSpecificTrainer