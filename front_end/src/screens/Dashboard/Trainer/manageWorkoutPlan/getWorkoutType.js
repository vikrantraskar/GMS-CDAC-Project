import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
    Button, Modal, ModalFooter,
    ModalHeader, ModalBody, Table
} from "reactstrap"
import config from "../../../../config";


const GetWorkoutType = () => {
    const authData = useSelector((state) => state.auth.authData);
    // add your states here
    const [wType_id, setWType_id] = useState(0)

    const [type, setType] = useState('')

    const [isNoError, setIsNoError] = useState(true)
    // ----------------------------------------------
    //to get data
    const [typeArray, setTypeArray] = useState([])

    // Modal open state
    const [modal, setModal] = React.useState(false);

    // isUpdate or Not
    const [isUpdate, setIsUpdate] = React.useState(false);

    //lifecycle hook to load data on event
    useEffect(() => {
        fetch()
    }, [])

    const toggle = () => setModal(!modal);


    const updateForm = (type) => {
        // set your states here
        setWType_id(type["wType_id"])
        setType(type["type"])
        // ------------------------
        setIsUpdate(true)
        toggle()

    }

    //resetForm
    const resetForm = () => {
        setIsUpdate(false)
        setIsNoError(true)
        setType("")
    }

    const validated = () => {
        if(type === '' || !type)
        {
            console.log("inside if");
            setIsNoError(false)
        }
        return isNoError
    }

    const onSubmit = (e) => {
        e.preventDefault()
        //insert call
        if (!isUpdate) {
            console.log("iSUpdate false ");
            if(validated()){
                axios
                .post(config.serverURL+'/trainer/addwtype', { type }, {
                    headers: {
                        'token': authData?.token
                    }
                })
                .then((resposne) => {
                    toggle()
                    const result = resposne.data
                    console.log("res " + result["data"])
                    fetch()
                    if (result.status == "error" ) {
                        toast.error(result.error);
                        console.log("result: "+ result.error)
                      } else {
                        toast.success(`${type} added successfully`);
                      }
                    // alert(`${type} Added successfully`);
                    // you can give a call to resetForm() here
                    resetForm()
                }).catch((error) => {
                    console.log(error)
                })
            }
            else{
                setIsNoError(false)
                console.log("inside else")
            }
        }
        //update call
        else {
            console.log("iSUpdate true ");
            axios
                .put(config.serverURL+`/trainer/updatewtype/${wType_id}`, { type }, {
                    headers: {
                        'token': authData?.token
                    }
                })
                .then((resposne) => {
                    toggle()
                    const result = resposne.data
                    console.log("res " + result["data"])
                    console.log("id is " + wType_id + " and inside")
                    fetch()
                    if (result.status == "error" ) {
                        toast.error(result.error);
                        console.log("result: "+ result.error)
                      } else {
                        toast.success(`${type} updated successfully`);
                      }
                    // alert(`${type} updated successfully`);
                    // resetForm()
                    resetForm()
                }).catch((error) => {
                    console.log(error)
                })
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



    // to get list
    const fetch = () => {
        axios
            .get(config.serverURL+'/trainer/getAllwtype', {
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

    const deleteFunct = (id) => {
        // e.preventDefault()
        // console.log("TOKEN "+authData.token);
        axios
            .delete(config.serverURL+`/trainer/deletewtype/${id}`, {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + JSON.stringify(result["data"]))
                fetch()
                if (result.status == "error" ) {
                    toast.error(result.error);
                    console.log("result: "+ result.error)
                  } else {
                    toast.success(`Workouttype deleted successfully`);
                  }
            }).catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className="screen-wrapper">
            <div className="screen-heading">Manage Workout Type</div>

            <div className="screen-content">
                <div className="subheader">
                    <div onClick={toggle} className="positive-btn">+ Add Workout Type</div>
                </div>
                <Table responsive hover striped className="table table-resposne">
                    <thead>
                        <th>Workout Type</th>
                        <th>Operation</th>
                    </thead>
                    <tbody>
                        { typeArray && typeArray.length ?
                            typeArray.map((type, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{type["type"]}</td>
                                        <td>
                                            <button className="btn btn-danger margin10" onClick={() => deleteFunct(type['wType_id'])}>Delete</button>
                                            <button className="btn btn-warning margin10" onClick={() => updateForm(type)}>Update</button>
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

                <div>
                    {/* <div onClick={toggle} className="btn btn-primary">Add</div> */}
                    <Modal isOpen={modal} toggle={onclose} centered>
                        <form onSubmit={onSubmit}>
                            <ModalHeader className=" border-0" toggle={onclose} close={onClose}>
                                {isUpdate ? 'Update Form ' : 'Add Form'}
                            </ModalHeader>
                            <ModalBody className="text-left border-0">
                                {/* add your form fields here */}
                                <p className="modal-label">Please enter new Workout Type</p>
                                <input type={"text"} onChange={(e) => { setType(e.target.value) }} value={type} />
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
        </div>
    )
}

export default GetWorkoutType