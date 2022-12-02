import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../../../config";
// import "./manageTrainer.css"



const AssignTrainerToSpecificMember = () => {
    const authData = useSelector((state) => state.auth.authData);
    //trainer_id, member_id
    const [trainer_id, setTrainerId] = useState(0)
    const [member_id, setMemberId] = useState(0)
    const [trainerList, setTrainerList] = useState([])
    const location = useLocation()
    const navigate = useNavigate()

    const resetForm = () => {
        setTrainerId(0)
        setMemberId(0)

    }

    const onSubmit = () => {
        console.log("TOKEN " + authData.token);
        axios
            .post(config.serverURL+`/admin/assignTrainer`, { trainer_id, member_id }, {
                headers: {
                    'token': authData?.token
                }
            })
            .then((resposne) => {
                const result = resposne.data
                console.log("res " + result)
                if (result.status == "error"  ) {
                    toast.error(result.error);
                  } else {
                      toast.success("Trainer get assign successfully");
                      navigate("/dashboard/admin/getAllMember")
                    
                  }
                resetForm()
            }).catch((error) => {
                console.log(error)
            })

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
                setTrainerList(result["data"])
               
            }).catch((error) => {
                console.log(error)
            })
    }


    //lifecycle hook to load data on event
    useEffect(() => {
        const { user_id } = location.state
        setMemberId(user_id)
        fetch()
    }, [])

    return (
        <div className="screen-wrapper">
            <div className="screen-heading">Update Profile</div>
            <div className="screen-content">
                <div className="row">
                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="member_id" >  Member Id :  </label> </div>
                            <input onChange={(e) => { setMemberId(e.target.value) }} class="feedback-input" type="number" id="member_id" name="member_id" value={member_id} />
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-field">
                            <div><label htmlFor="type" >  Trainer  </label></div>
                            <select onChange={(e) => setTrainerId(e.target.value)}>
                                <option selected disabled>None</option>
                                {
                                    trainerList && trainerList.length ?
                                        trainerList.map((element, index) => {
                                            return (
                                                <option key={index} value={element.user_id}>{`${element.firstname} ${element.lastname}`}</option>
                                            )
                                        })
                                        :
                                        null
                                }
                            </select>
                        </div>
                    </div>
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

export default AssignTrainerToSpecificMember