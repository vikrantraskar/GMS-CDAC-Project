import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody, Table
} from "reactstrap"
import { toast } from 'react-toastify'
import config from "../../../../config";

const ManageShifts = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [time_slot, setTimeSlot] = useState("");
  const [vacancy, setVacancy] = useState(0);

  const [typeArray, setTypeArray] = useState([]);

  // Modal open state
  const [modal, setModal] = React.useState(false);

  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [status, setStatus] = useState()
  
  // const{id} = request.params

 const [inputFields, setInputFields] = useState({
  time_slot: {
         value: '',
         isError: false
     },
     vacancy: {
         value: 0,
         isError: false
     }
 })
 
 const resetForm = () => {
     let currentInput = { ...inputFields }
     currentInput.time_slot.value = '';
     currentInput.time_slot.isError = false;
     currentInput.vacancy.value = 0;
     currentInput.vacancy.isError = false;
     setInputFields(currentInput);
     
     setIsSubmitForm(false);
 };

  //on typing this will execute
  const onInputValueChange = (event) => {
     let currentInput = { ...inputFields }
     if (event.target.name === 'time_slot') {
         currentInput.time_slot.value = event.target.value;
     } 
     else if (event.target.name === 'vacancy') {
         currentInput.vacancy.value = event.target.value;
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
     if (currentInput.time_slot.value !== '') {
         if (currentInput.time_slot.value) {// regex validatepassword
             currentInput.time_slot.isError = false;
         } else {
             currentInput.time_slot.isError = true;
         }
     } else {
         currentInput.time_slot.isError = true;
     }

     if (currentInput.vacancy.value !== 0 && currentInput.vacancy.value > 0) {
         if (currentInput.vacancy.value) {// regex validatepassword
             currentInput.vacancy.isError = false;
         } else {
             currentInput.vacancy.isError = true;
         }
     } else {
         currentInput.vacancy.isError = true;
     }

   

     if (currentInput.time_slot.isError || currentInput.vacancy.isError ) {
         isNoError = false;
     } else {
         isNoError = true;
     }

     return isNoError;
 }

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitForm(true)

    console.log("TOKEN " + authData.token);
    if(validateForm()){
      axios
      .post(
        config.serverURL+"/admin/addShift",
        { time_slot:inputFields.time_slot.value, vacancy: inputFields.vacancy.value },
        {
          headers: {
            token: authData?.token,
          },
        }
      )
      .then((resposne) => {
        toggle()
        const result = resposne.data;
        console.log("res " + result);
        resetForm();
        fetch()
        if (result.status == "error" ) {
          toast.error(result.error);
          console.log("result: "+ result.error)
        } else {
          toast.success(`Shift added successfully`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  useEffect(() => {
    fetch()
  }, [])

  const toggle = () => setModal(!modal);




  const fetch = () => {
    axios
      .get(config.serverURL+"/user/getAllShifts", {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res " + result["data"]);
        setTypeArray(result["data"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteFunct = (shift_id) => {
    // e.preventDefault()
    // console.log("TOKEN "+authData.token);
    axios
      .delete(config.serverURL+`/admin/deleteSpecificShift/${shift_id}`, {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        fetch();
        if (result.status == "error" ) {
          toast.error(result.error);
          console.log("result: "+ result.error)
        } else {
          toast.success(`Shift deleted successfully`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClose = () => {
    resetForm()
    toggle()
  }

  const closeBtn = (
    <button className="close" onClick={onClose}>
      &times;
    </button>
  );

  return (
    <div>
      <div className="screen-wrapper">
        <div className="screen-heading">Manage Shifts</div>

        <div className="screen-content">
          <div className="subheader">
            <div onClick={toggle} className="positive-btn">+ Add Shift</div>
          </div>
          <Table responsive hover striped className="table table-resposne">
            <thead>
              <th>Time Slot</th>
              <th>Vacancy</th>
              <th>Operation</th>
            </thead>
            <tbody>
              {typeArray && typeArray.length ?
                typeArray.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{type["time_slot"]}</td>
                      <td>{type["vacancy"]}</td>
                      <td>
                        <button className="btn btn-danger text-white" onClick={() => deleteFunct(type['shift_id'])}>Delete</button>
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
              Add New Shift
            </ModalHeader>
            <ModalBody className="text-left border-0">
              {/* add your form fields here */}
              <p className="modal-label">Please enter new Shift</p>
              <input
                    name="time_slot"
                    id="time_slot" 
                    placeholder="Xam-Ypm"
                    type={"text"} 
                    onChange={(e) => { onInputValueChange(e) }} 
                    value={inputFields.time_slot.value} />
              {inputFields.time_slot.isError ?
                <div className='error-wrapper'>
                  {inputFields.time_slot.value === '' ? 'time slot is required.' : null}
                </div> : null}
              <p className="modal-label">Please enter vacancy</p>
              <input 
                    name="vacancy"
                    id="vacancy"
                    type={"number"} 
                    onChange={(e) => { onInputValueChange(e) }} 
                    value={inputFields.vacancy.value} />
              {inputFields.vacancy.isError ?
                <div className='error-wrapper'>
                  {inputFields.vacancy.value === 0 ? 'vacancy is required.' : inputFields.vacancy.value < 0 ? 'cannot be negative' : null}
                </div> : null}
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
  );
};

export default ManageShifts;
