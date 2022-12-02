import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Button, Modal, ModalFooter,
    ModalHeader, ModalBody, Table
} from "reactstrap"
import config from "../../../../config";

const GetAllShiftOfSpecificTrainer = () => {
    const authData = useSelector((state) => state.auth.authData);

    const [typeArray, setTypeArray] = useState([]);

    const location = useLocation()

    const [userId, setUserId] = useState(0)

    const navigate = useNavigate()

    const fetch = (user_id) => {
        console.log("fetch ::: " + user_id)
        axios
            .get(config.serverURL + `/admin/getAllShiftofAllTrainers/${user_id}`, {
                headers: {
                    token: authData?.token,
                },
            })
            .then((resposne) => {
                const result = resposne.data;
                console.log("res " + JSON.stringify(result["data"]));
                // console.log("res " + result["data"]);
                setTypeArray(result["data"]);
                if (result.status == "error") {
                    toast.error(result.error)
                } else {
                    toast.success("Shifts fetched successfully")
                }
                
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const navigateToPage = (path) => {
        navigate(path)
    }

    useEffect(() => {
        const { trainer_id } = location.state
        console.log("userEffect ::" + parseInt(trainer_id))
        setUserId(parseInt(trainer_id));
        fetch(parseInt(trainer_id))
    }, []);

    return (

        <div className="screen-wrapper">
            <div className="screen-heading">Trainer Shifts</div>

            <div className="screen-content">
                <Table responsive hover striped className="table table-resposne">
                    <thead>
                        <th>Shift Id</th>
                        <th>Time Slot</th>
                    </thead>
                    <tbody>
                        {typeArray && typeArray.length ?
                            typeArray.map((type, index) => {
                                return (
                                    <tr key={index["user_id"]}>
                                        <td>{type["shift_id"]}</td>
                                        <td>{type["time_slot"]}</td>
                                    </tr>
                                );
                            })
                            : <div className="empty-view">
                                NO DATA FOUND
                            </div>
                        }
                    </tbody>
                </Table>
                <hr />
                <div className="d-flex flex-wrap " style={{zIndex: 100}}>
                    <div className="mx-auto" style={{ fontWeight: "600", fontSize: "15px",zIndex:101 }}>
                       <button className="btn btn-secondary m-2" type={"button"} onClick={() => {navigateToPage("/dashboard/admin/getAllTrainer")}}>Back To Manage Trainer </button>
                       <button className="btn btn-primary allot-shift-btn" type={"button"} onClick={() => navigate("/dashboard/admin/assignShiftToSpecificTrainer", {state: { trainer_id: userId }})}>Allot Shift</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetAllShiftOfSpecificTrainer;
