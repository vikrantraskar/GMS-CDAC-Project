import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import {
    Button, Modal, ModalFooter,
    ModalHeader, ModalBody, Table
} from "reactstrap"

import { toast } from 'react-toastify'
import config from "../../../../config";

const GetDietItemList = () => {
    const authData = useSelector((state) => state.auth.authData);
    const [item_name, setType] = useState('')
    const [typeArray, setTypeArray] = useState([])
    

    // Modal open state
    const [modal, setModal] = React.useState(false);

    const [isSubmitForm, setIsSubmitForm] = useState(false);
    const [status, setStatus] = useState()
    
    // const{id} = request.params
  
   const [inputFields, setInputFields] = useState({
    item_name: {
           value: '',
           isError: false
       },
      
   })
   
   const resetForm = () => {
       let currentInput = { ...inputFields }
       currentInput.item_name.value = '';
       currentInput.item_name.isError = false;
       setInputFields(currentInput);
       
       setIsSubmitForm(false);
   };

    //on typing this will execute
    const onInputValueChange = (event) => {
       let currentInput = { ...inputFields }
       if (event.target.name === 'item_name') {
           currentInput.item_name.value = event.target.value;
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
       if (currentInput.item_name.value !== '') {
           if (currentInput.item_name.value) {// regex validatepassword
               currentInput.item_name.isError = false;
           } else {
               currentInput.item_name.isError = true;
           }
       } else {
           currentInput.item_name.isError = true;
       }

       if (currentInput.item_name.isError) {
           isNoError = false;
       } else {
           isNoError = true;
       }

       return isNoError;
   }



    //lifecycle hook to load data on event
    useEffect(() => {
        fetch()
    }, [])


    const toggle = () => setModal(!modal);


    const onSubmit = (e) => {
        e.preventDefault();
        setIsSubmitForm(true)
        console.log("TOKEN " + authData.token);
        if(validateForm())
        {
            axios
            .post(
                config.serverURL+ "/trainer/addItem",
                { item_name: inputFields.item_name.value },
                {
                    headers: {
                        token: authData?.token,
                    },
                }
            )
            .then((resposne) => {
                const result = resposne.data
                toggle()
                console.log("res " + JSON.stringify(result))
                setStatus(result.status)
                fetch();
                console.log("status = " + result.status);
                if(status === "error" || status === '')
                {
                    toast.error("diet item not added")

                }else{

                    toast.success("diet item added successfully")
                }
                resetForm();
                fetch()
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    const fetch = () => {
        axios
            .get(config.serverURL+ '/trainer/getItemList', {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + JSON.stringify(result["data"]))
                // console.log("res "+result["data"])
                setTypeArray(result["data"])
            }).catch((error) => {
                console.log(error)
            })
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


    return (
        <div className="screen-wrapper">
            <div className="screen-heading">Manage Diet Item</div>

            <div className="screen-content">
                <div>
                <div className="subheader">
                    <div onClick={toggle} className="positive-btn">+ Add Diet Item</div>
                </div>
                <Table responsive hover striped className="table table-resposne">
                    <thead>
                    <th>Diet_id</th>
                            <th>Item Name</th>
                    </thead>
                    <tbody>
                        { typeArray && typeArray.length ?
                            typeArray.map((type, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{type["diet_id"]}</td>
                                        <td>{type["item_name"]}</td>
                                    </tr>
                                );
                            })
                            : <div className="empty-view">
                                NO DATA FOUND
                            </div>
                        }
                    </tbody>
                </Table>

                    <div>
                        <Modal isOpen={modal} toggle={onclose} centered>
                            <form onSubmit={onSubmit}>
                                <ModalHeader className=" border-0" toggle={onclose} close={onClose}>
                                    Add Diet Item
                                </ModalHeader>
                                <ModalBody className="text-left border-0">
                                    {/* add your form fields here */}
                                    <p className="modal-label">Please enter new diet item name</p>
                                    <input name="item_name" id="item_name"  type={"text"} onChange={(e) => { onInputValueChange(e) }} value={inputFields.item_name.value} />

                                    {inputFields.item_name.isError ?
                                <div className='error-wrapper'>
                                    {inputFields.item_name.value === '' ? 'item name is required.' : null}
                                </div> : null}
                                </ModalBody>
                                <ModalFooter className="modal-footer border-0">
                                    <Button className="btn_secondary modal-btn" onClick={onClose}>
                                        Cancel
                                    </Button>{" "}
                                    &nbsp;&nbsp;
                                    <button
                                        className="positive-btn"
                                        type="submit"
                                    >Submit</button>{" "}
                                </ModalFooter>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GetDietItemList