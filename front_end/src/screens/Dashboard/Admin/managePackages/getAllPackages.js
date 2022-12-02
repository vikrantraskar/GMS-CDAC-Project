import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody, Table
} from "reactstrap"
import { toast } from 'react-toastify'
import config from "../../../../config";

const ManagePackages = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [typeArray, setTypeArray] = useState([]);

  // Modal open state
  const [modal, setModal] = React.useState(false);

  // isUpdate or Not
  const [isUpdate, setIsUpdate] = React.useState(false);

  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [status, setStatus] = useState()

  // const{id} = request.params

  const [inputFields, setInputFields] = useState({
    package_name: {
      value: '',
      isError: false
    },
    package_id: {
      value: 0,
      isError: false
    },
    package_amount: {
      value: 0,
      isError: false
    },
    duration: {
      value: 0,
      isError: false
    }
  })

  const resetForm = () => {
    let currentInput = { ...inputFields }
    currentInput.package_id.value = 0;
    currentInput.package_id.isError = false;
    currentInput.package_name.value = '';
    currentInput.package_name.isError = false;
    currentInput.package_amount.value = 0;
    currentInput.package_amount.isError = false;
    currentInput.duration.value = 0;
    currentInput.duration.isError = false;

    setInputFields(currentInput);

    setIsSubmitForm(false);
    setIsUpdate(false)
  };

  //on typing this will execute
  const onInputValueChange = (event) => {
    let currentInput = { ...inputFields }
    if (event.target.name === 'package_name') {
      currentInput.package_name.value = event.target.value;
    }
    else if (event.target.name === 'package_amount') {
      currentInput.package_amount.value = event.target.value;
    }
    else if (event.target.name === 'duration') {
      currentInput.duration.value = event.target.value;
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
    if (currentInput.package_name.value !== '') {
      if (currentInput.package_name.value) {// regex validatepassword
        currentInput.package_name.isError = false;
      } else {
        currentInput.package_name.isError = true;
      }
    } else {
      currentInput.package_name.isError = true;
    }

    if (currentInput.package_amount.value !== 0 && currentInput.package_amount.value > 0) {
      if (currentInput.package_amount.value) {// regex validatepassword
        currentInput.package_amount.isError = false;
      } else {
        currentInput.package_amount.isError = true;
      }
    } else {
      currentInput.package_amount.isError = true;
    }




    if (currentInput.duration.value !== 0 && currentInput.duration.value > 0) {
      if (currentInput.duration.value) {// regex validatepassword
        currentInput.duration.isError = false;
      } else {
        currentInput.duration.isError = true;
      }
    } else {
      currentInput.duration.isError = true;
    }



    if (currentInput.package_amount.isError || currentInput.package_name.isError || currentInput.duration.isError) {
      isNoError = false;
    } else {
      isNoError = true;
    }

    return isNoError;
  }



  const toggle = () => setModal(!modal);


  const updateForm = (type) => {
    let currentInput = { ...inputFields };
    setIsUpdate(true)
    currentInput.package_id.value = type.package_id
    currentInput.package_name.value = type.package_name
    currentInput.duration.value = type.duration
    currentInput.package_amount.value = type.package_amount
    setInputFields(currentInput)
    toggle()

  }


  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitForm(true)
    // console.log("TOKEN "+authData.token);
    if (validateForm()) {
      if (!isUpdate) {
      axios
        .post(config.serverURL+"/admin/addPackage",
          { package_name: inputFields.package_name.value, package_amount: inputFields.package_amount.value, duration: inputFields.duration.value },
          {
            headers: {
              token: authData?.token,
            },
          })
        .then((resposne) => {
          const result = resposne.data;
          console.log("res " + JSON.stringify(result["data"]));
          // console.log("res " + result["data"]);
          toggle()
          fetch()
          resetForm()
          if (result.status == "error" ) {
            toast.error(result.error);
            console.log("result: "+ result.error)
          } else {
            toast.success(`package added successfully`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }
      else{
        console.log("inside update call")
        let package_id = inputFields.package_id.value
        axios
        .put(config.serverURL+`/admin/updateSpecificPackage/${package_id}`,
          { package_name: inputFields.package_name.value, package_amount: inputFields.package_amount.value, duration: inputFields.duration.value },
          {
            headers: {
              token: authData?.token,
            },
          })
        .then((resposne) => {
          const result = resposne.data;
          console.log("res " + JSON.stringify(result["data"]));
          // console.log("res " + result["data"]);
          toggle()
          fetch()
          resetForm()
          if (result.status == "error" ) {
            toast.error(result.error);
            console.log("result: "+ result.error)
          } else {
            toast.success(`Package updated successfully`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }
  };

  const fetch = () => {
    axios
      .get(config.serverURL+"/user/getAllPackages", {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res " + result["data"]);
        setTypeArray(result["data"]);
        if (result.status == "error"  ) {
          toast.error(result.error);
        } else {
            toast.success("All package list display successfully");
          
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteFunct = (package_id) => {
    // e.preventDefault()
    // console.log("TOKEN "+authData.token);
    axios
      .delete(
        config.serverURL+`/admin/deleteSpecificPackage/${package_id}`,
        {
          headers: {
            token: authData?.token,
          },
        }
      )
      .then((resposne) => {
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        fetch();
        if (result.status == "error"  ) {
          toast.error(result.error);
        } else {
            toast.success("Package deleted successfully");
          
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

  useEffect(() => {
    fetch()
  }, [])

  return (
    <div>
      <div className="screen-wrapper">
        <div className="screen-heading">Manage Package</div>

        <div className="screen-content">
          <div className="subheader">
            <div onClick={toggle} className="positive-btn">+ Add Package</div>
          </div>
          <Table responsive hover striped className="table table-resposne">
            <thead>
              <th>Package Name</th>
              <th>Package Amount</th>
              <th>Duration</th>
            </thead>
            <tbody>
              {typeArray && typeArray.length ?
                typeArray.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{type["package_name"]}</td>
                      <td>{type["package_amount"]}</td>
                      <td>{type["duration"]}</td>
                      <td>
                        <button className="btn btn-danger text-white" onClick={() => deleteFunct(type['package_id'])}>Delete</button>
                        <button className="btn btn-warning m-1" onClick={() => updateForm(type)}>Update</button>
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
            {isUpdate ? 'Update Package ' : 'Add Package'}
            </ModalHeader>
            <ModalBody className="text-left border-0">
              {/* add your form fields here */}
              <p className="modal-label">Please enter package name</p>
              <input 
                    type={"text"} 
                    name={"package_name"}
                    id={"package_name"}
                    onChange={(e) => onInputValueChange(e)} 
                    value={inputFields.package_name.value} />
              {inputFields.package_name.isError ?
                <div className='error-wrapper'>
                  {inputFields.package_name.value === '' ? 'package_name is required.' : null}
                </div> : null}
              <p className="modal-label">Please enter duration</p>
              <input 
                    type={"number"}  
                    name={"duration"}
                    id={"duration"}
                    onChange={(e) => { onInputValueChange(e) }} 
                    value={inputFields.duration.value} />
              {inputFields.duration.isError ?
                <div className='error-wrapper'>
                  {inputFields.duration.value === 0 ? 'duration is required.' : inputFields.duration.value < 0 ? 'cannot be negative' : null}
                </div> : null}
              <p className="modal-label">Please enter price</p>
              <input 
                    type={"number"}  
                    name={"package_amount"}
                    id={"package_amount"}
                    onChange={(e) => { onInputValueChange(e) }} 
                    value={inputFields.package_amount.value} />
              {inputFields.package_amount.isError ?
                <div className='error-wrapper'>
                  {inputFields.package_amount.value === 0 ? 'package_amount is required.' : inputFields.package_amount.value < 0 ? 'cannot be negative' : null}
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

export default ManagePackages;
