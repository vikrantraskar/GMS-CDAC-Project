import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalFooter, ModalHeader, ModalBody, Table } from "reactstrap";
import { toast } from "react-toastify";
import config from "../../../../config";
import { Link } from "react-router-dom";

const PayDues = () => {
  const authData = useSelector((state) => state.auth.authData);
  const [isSubmitForm, setIsSubmitForm] = useState(false);
  // add your states here
  const [amount, setAmount] = useState(0);
  // ----------------------------------------------
  //to get data
  const [typeArray, setTypeArray] = useState([]);

  // Modal open state
  const [modal, setModal] = React.useState(false);

  const [status, setStatus] = useState('')
  const [errorResponse, setErrorResponse] = useState('')
  const [inputFields, setInputFields] = useState({
    due: {
        value: 0,
        isError: false
    }
  })

  //lifecycle hook to load data on event
  useEffect(() => {
    fetchMyBill();
  }, []);

  const toggle = () => setModal(!modal);

  //resetForm
  const resetForm = () => {
    let currentInput = { ...inputFields }
    currentInput.due.value = 0;
    currentInput.due.isError = false;
    setInputFields(currentInput);
        
    setIsSubmitForm(false);
  };

   //on typing this will execute
   const onInputValueChange = (event) => {
    let currentInput = { ...inputFields }
    if (event.target.name === 'due') {
        currentInput.due.value = event.target.value;
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
  if (currentInput.due.value !== 0 && currentInput.due.value > 0) {
      if (currentInput.due.value) {// regex validatepassword
          currentInput.due.isError = false;
      } else {
          currentInput.due.isError = true;
      }
  } else {
      currentInput.due.isError = true;
  }

  if (currentInput.due.isError ) {
    isNoError = false;
} else {
    isNoError = true;
}

return isNoError;
}

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitForm(true)
    //insert call
    
    if(validateForm()){
      axios
      .post( config.serverURL+`/member/payDue`,
        { amount:inputFields.due.value },
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
        fetchMyBill();
        if (result.status == "error"  ) {
          toast.error(result.error);
        } else 
        {
           toast.success("Dues paid successfully");
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

  // to get list
  const fetchMyBill = () => {
    // console.log("inside fetch");
    axios
      .get(config.serverURL+`/member/getBillStatus`, {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        let currentInput = { ...inputFields };
        const result = resposne.data;
        currentInput.due.value = result.data[0].due
        setInputFields(currentInput)
        setStatus(resposne.data.status)
        setErrorResponse(resposne.data.error)
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res "+result["data"])
        setTypeArray(result["data"]);
        // console.log("typeArray : " + typeArray[0]['due'])
        setAmount(typeArray[0]['due'])
        if (result.status == "error"  ) {
          toast.error(result.error);
        } else
          {
            toast.success("Dues paid successfully");
          }
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="screen-wrapper">
        <div className="screen-heading">Billing and Dues</div>

        <div className="screen-content">
          <div className="subheader">
            <div onClick={toggle} className="positive-btn">+ Pay</div>
          </div>
          <Table responsive hover striped className="table table-resposne">
            <thead>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Due</th>
            </thead>
            <tbody>
              {typeArray && typeArray.length ?
                typeArray.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{type["total_amount"]}</td>
                      <td>{type["paid_amount"]}</td>
                      <td>{type["due"]}</td>
                    </tr>
                  )
                })
                : <div className="empty-view">
                  YOU DONT HAVE ANY ACTIVE PLAN.&nbsp;<Link to={"/dashboard/member/membership"}> APPLY FOR MEMBERSHIP</Link>
                </div>
              }
            </tbody>
          </Table>
          <Modal isOpen={modal} toggle={onclose} centered>
            <form onSubmit={onSubmit}>
              <ModalHeader className=" border-0" toggle={onclose} close={onClose}>
                Due Form
              </ModalHeader>
              <ModalBody className="text-left border-0">
                {/* add your form fields here */}
                <p className="modal-label">Please enter due amount</p>
                <input
                                onChange={(e) => { onInputValueChange(e) }}
                                name="due"
                                type="number"
                                id="due"
                                class="feedback-input"
                                value={inputFields.due.value}
                            />
                            {inputFields.due.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.due.value === 0 ? 'DueAmount is required.' : inputFields.due.value < 0 ? 'due cannot be negative' : null}
                                </div> : null}
              </ModalBody>
              <ModalFooter className="modal-footer border-0">
                <Button className="btn_secondary modal-btn" onClick={onClose}>
                  Cancel
                </Button>{" "}
                &nbsp;&nbsp;
                <Button className="btn btn_primary modal-btn" type="submit">
                  Pay
                </Button>{" "}
              </ModalFooter>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PayDues;
