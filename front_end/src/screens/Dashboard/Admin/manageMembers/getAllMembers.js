import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import {
    Button, Modal, ModalFooter,
    ModalHeader, ModalBody, Table
} from "reactstrap"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../../../config";



const GetAllMember = () => {
    const authData = useSelector((state) => state.auth.authData);
    // add your states here
    const [user_id, setId] = useState(0)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLasttname] = useState('')
    const [mobile, setMobile] = useState('')
    const [age, setAge] = useState(0)
    const [gender, setGender] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role_id, setRole_id] = useState(2)
    const [salary, setSalary] = useState(2)
    const [old_shift_id, setOld_shift_id] = useState(0)
    const [new_shift_id, setNew_shift_id] = useState(0)
    // ----------------------------------------------
    //to get data
    const [typeArray, setTypeArray] = useState([])

    const [shiftArray, setShiftArray] = useState([])

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


    const updateForm = (type) => {
        // ------------------------
        setId(type.user_id)
        setOld_shift_id(type.shift_id)
        fetchList(type.user_id)
        setIsUpdate(true)
        toggle()
    }

    //resetForm
    const resetForm = () => {
        setIsUpdate(false)
        setFirstname("");
        setLasttname("");
        setMobile("");
        setAge(0);
        setGender("");
        setEmail("");
        setPassword("");
        setRole_id(2);
        setSalary(0)
        setId(0)
        setOld_shift_id(0)
        setNew_shift_id(0)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        //insert call
        if (!isUpdate) {
            console.log("iSUpdate false ");
            axios
                .post(config.serverURL+'/admin/addTrainer', { firstname, lastname, mobile, age, gender, email, password, role_id, salary }, {
                    headers: {
                        'token': authData?.token
                    }
                })
                .then((resposne) => {
                    toggle()
                    const result = resposne.data
                    console.log("res " + result)
                    resetForm();
                    toast.success('Trainer List fetched')
                }).catch((error) => {
                    console.log(error)
                })
        }
        //update call
        else {
            console.log("iSUpdate true ");
            axios
                .put(config.serverURL+`/admin//updateMemberShift/${user_id}`, { old_shift_id, new_shift_id }, {
                    headers: {
                        'token': authData?.token
                    }
                })
                .then((resposne) => {
                    toggle()
                    const result = resposne.data
                    console.log("res " + result["data"])
                    fetch()
                    // resetForm()
                    if (result.status == "error") {
                        toast.error(result.error)
                    } else {
                        toast.success("Shift changed successfully")
                    }
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
            .get(config.serverURL+'/admin/getAllMembers', {
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

    // to get non-selectedShiftlist
    const fetchList = (id) => {
        axios
            .post(config.serverURL+'/admin/nonSelectedShifts', { user_id: id }, {
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
    }

    const deleteFunct = (id) => {
        // e.preventDefault()
        // console.log("TOKEN "+authData.token);
        axios
            .post(config.serverURL+`/admin/deactivateUser/${id}`, {}, {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + JSON.stringify(result["data"]))
                fetch()
            }).catch((error) => {
                console.log(error)
            })
    }

    const activateFunct = (id) => {
        // e.preventDefault()
        // console.log("TOKEN "+authData.token);
        axios
            .post(config.serverURL+`/admin/activateMember/${id}`, {}, {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + JSON.stringify(result["data"]))
                fetch()
            }).catch((error) => {
                console.log(error)
            })
    }

    const assignTrainer = (id) => {
        navigate('/dashboard/admin/assignTrainer', { state: { user_id: id} })
    }

    return (
        <div>
            <div className="screen-wrapper">
                <div className="screen-heading">Manage Active Members</div>

                <div className="screen-content">
                    
                    <Table responsive hover striped className="table table-resposne">
                        <thead>
                            <th>Member Id</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Trainer</th>
                            <th>Shift</th>
                            <th>Status</th>
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
                                            <td>{type["trainer_id"] ? type["trainer_id"] : "NA"}</td>
                                            <td>{type["time_slot"]}</td>
                                            <td>{type["status"] === 1 ? <h6>Active</h6> : <h6>Inactive</h6>}</td>
                                            <td>
                                                {type['status'] === 1
                                                    ?
                                                    <>
                                                        <button type={"button"} className="btn btn-danger text-white" onClick={() => deleteFunct(type["user_id"])}>Deactivate</button>
                                                        <button className="btn btn-warning m-2" onClick={() => updateForm(type)}>Update Shift</button>
                                                    </>
                                                    :
                                                    null
                                                }
                                                {
                                                    type['trainer_id'] === null || type['trainer_id'] === 0 
                                                        ?
                                                        <button type={"button"} className="btn btn-success text-white" onClick={() => assignTrainer(type["user_id"])}>Assign Trainer</button>
                                                        :
                                                        null
                                                }

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
                            Update Shift
                        </ModalHeader>
                        <ModalBody className="text-left border-0">
                            {/* add your form fields here */}

                            <p className="modal-label">  Old Shift : </p>
                            <input onChange={(e) => { setOld_shift_id(e.target.value) }} name="old_shift_id" type="number" id="old_shift_id" value={old_shift_id} />
                            <p className="modal-label">  New Shift : </p>
                            {/* <input onChange={(e) => { setNew_shift_id(e.target.value) }} name="new_shift_id" type="number" id="new_shift_id"  value={new_shift_id} /> */}
                            <select
                                name="new_shift_id"
                                id="new_shift_id"
                                onChange={(e) => {
                                    setNew_shift_id(e.target.value);
                                }}
                                value={new_shift_id}
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

export default GetAllMember