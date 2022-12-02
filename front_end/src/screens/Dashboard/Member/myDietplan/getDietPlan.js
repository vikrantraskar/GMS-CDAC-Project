import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody, Table
} from "reactstrap"
import { toast } from "react-toastify";
import config from "../../../../config";
import { Link } from "react-router-dom";

const GetDietPlan = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [typeArray, setTypeArray] = useState([]);
  const [id, setUserId] = useState(0);
  const [status, setStatus] = useState()
  const [errorResponse, setErrorResponse] = useState('')

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log("TOKEN "+authData.token);
    fetch();
  };

  useEffect(() => {
    if (authData?.status === 1) {
      fetch()
    }
  }, [authData?.status]);

  const fetch = () => {
    axios
      .get(config.serverURL+"/member/dietPlan", {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        setStatus(resposne.data.status)
        setErrorResponse(resposne.data.error)
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res " + result["data"]);
        setTypeArray(result["data"]);
        if (result.status == "error" ) {
          toast.error("Your diet plan is not created yet");
        } else {
          toast.success("Your diet plan get successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="screen-wrapper">
        <div className="screen-heading">View Diet Plan</div>

        <div className="screen-content">
          <Table responsive hover striped className="table table-resposne">
            <thead>
              <th>Item Name</th>
              <th>Quantity</th>
            </thead>
            <tbody>
              {typeArray && typeArray.length ?
                typeArray.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{type["item_name"]}</td>
                      <td>{type["qty"]}</td>
                    </tr>
                  )
                })
                : 
                authData?.status === 0  ?
                            <div className="empty-view">
                              YOU DONT HAVE ANY ACTIVE PLAN.&nbsp;<Link to={"/dashboard/member/membership"}> APPLY FOR MEMBERSHIP</Link>
                            </div>
                            :
                              <div className="empty-view">
                                NO DATA FOUND
                              </div>
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GetDietPlan;
