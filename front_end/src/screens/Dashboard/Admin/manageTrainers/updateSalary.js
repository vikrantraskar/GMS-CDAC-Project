
import axios from "axios";
import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../../../config";


const UpdateTrainerSalary = () =>{
    const authData = useSelector((state) => state.auth.authData);
     //false : update is not clicked yet for first time
     const [isSubmitForm, setIsSubmitForm] = useState(false);
     const [status, setStatus] = useState()
     const location = useLocation()
     const navigate = useNavigate()
     // const{id} = request.params
   
    const [inputFields, setInputFields] = useState({
        id: {
            value: 0,
            isError: false
        },
        percentage: {
            value: 0,
            isError: false
        }
       
    })
    
    const resetForm = () => {
        let currentInput = { ...inputFields }
        currentInput.id.value = 0;
        currentInput.id.isError = false;
        currentInput.percentage.value = 0;
        currentInput.percentage.isError = false;
        
        
        setInputFields(currentInput);
        
        setIsSubmitForm(false);
    };

     //on typing this will execute
     const onInputValueChange = (event) => {
        let currentInput = { ...inputFields }
        if (event.target.name === 'id') {
            currentInput.id.value = event.target.value;
        } 
        else if (event.target.name === 'percentage') {
            currentInput.percentage.value = event.target.value;
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
        if (currentInput.id.value !== '') {
            if (currentInput.id.value) {// regex validatepassword
                currentInput.id.isError = false;
            } else {
                currentInput.id.isError = true;
            }
        } else {
            currentInput.id.isError = true;
        }

        if (currentInput.percentage.value !== 0 && currentInput.percentage.value > 0  && currentInput.percentage.value <= 30) {
            if (currentInput.percentage.value) {// regex validatepassword
                currentInput.percentage.isError = false;
            } else {
                currentInput.percentage.isError = true;
            }
        } else {
            currentInput.percentage.isError = true;
        }

      
        if (currentInput.id.isError || currentInput.percentage.isError) {
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
          let id = inputFields.id.value
        axios
            .post(config.serverURL+`/admin/hikeTsal/${id}`, 
            { percentage:inputFields.percentage.value, 
                percentage:inputFields.percentage.value, 
                
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
                if(result.status === "error" )
                {
                    toast.error(result.error)

                }else{

                    toast.success("salary updated successfully")
                    navigate("/dashboard/admin/getAllTrainer")
                }
                resetForm();
            }).catch((error) => {  
                console.log(error)
            })
        }
    }

    useEffect(() => {
      const { trainer_id } = location.state
      let currentInput = { ...inputFields }
      currentInput.id.value = trainer_id
      setInputFields(currentInput)
    }, []);

return (      
   
        <div className="screen-wrapper">
            <div className="screen-heading">Update Salary</div>
            <div className="screen-content">
                <div className="row">
                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="firstname">Id </label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="id"
                                type="number"
                                id="id"
                                class="feedback-input"
                                value={inputFields.id.value}
                            />
                            {inputFields.id.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.id.value === 0 ? 'id is required.' : null}
                                </div> : null}
                            
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="percentage">Percentage </label></div>
                            <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="percentage"
                                type="number"
                                id="percentage"
                                class="feedback-input"
                                value={inputFields.percentage.value}
                            />
                            {inputFields.percentage.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.percentage.value === 0 ? 'percentage is required.' : inputFields.percentage.value < 0 ? 'cannot be negative' : inputFields.percentage.value > 30 ? 'cannot be greater than 30' : null}
                                </div> : null}
                            
                        </div>
                    </div>

                    
                </div>
           
                <div className="action-div">
                    <button onClick={resetForm} className="negative-btn">Cancel</button>
                    <buttom onClick={()=> onSubmit()} className="positive-btn">Update</buttom>
                </div>
            </div>
        </div>

        )  
                         

}
export default UpdateTrainerSalary
