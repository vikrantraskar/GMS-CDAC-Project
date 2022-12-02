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



const GetAllInactiveMember = () => {
    const authData = useSelector((state) => state.auth.authData);
    // add your states here
    const [id, setId] = useState(0)
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


    // isUpdate or Not
    const [isUpdate, setIsUpdate] = React.useState(false);

    const navigate = useNavigate()

    //lifecycle hook to load data on event
    useEffect(() => {
        fetch()
    }, [])

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

    const onClose = () => {
        resetForm()
    }

    const closeBtn = (
        <button className="close" onClick={onClose}>
            &times;
        </button>
    );



    // to get list
    const fetch = () => {
        axios
            .get(config.serverURL+'/admin/getAllInactiveMembers', {
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

    const activateFunct = (id) => {
        // e.preventDefault()
        // console.log("TOKEN "+authData.token);
        axios
            .post(config.serverURL+`/admin/activateMember/${id}`, {},{
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

    return (
        <div>
            <div className="screen-wrapper">
                <div className="screen-heading">Manage Inactive Trainer</div>

                <div className="screen-content">
                    
                    <Table responsive hover striped className="table table-resposne">
                        <thead>
                            <th>Member Id</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Gender</th>
                        </thead>
                        <tbody>
                            {typeArray && typeArray.length ?
                                typeArray.map((type, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{type['user_id']}</td>
                                            <td>{type["firstname"]}</td>
                                            <td>{type["lastname"]}</td>
                                            <td>{type["mobile"]}</td>
                                            <td>{type["email"]}</td>
                                            <td>{type["age"]}</td>
                                            <td>{type["gender"]}</td>
                                            <td>
                                            <button type={"button"} className="btn btn-success text-white" onClick={() => activateFunct(type["user_id"])}>Activate</button>
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
                
  
            </div>

        </div>
    )
}

export default GetAllInactiveMember