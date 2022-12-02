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

const GetMemberPackages = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [typeArray, setTypeArray] = useState([]);
  const [trainer, setTrainer] = useState('')
  const [errorRes, setErrorRes] = useState("")
  

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log("TOKEN "+authData.token);
    fetch();
  };

  const fetchTrainer = () => {
    axios
      .get(config.serverURL + "/member/getMyTrainer", {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res " + result["data"]);
        
        if (result.status == "error") {
          setErrorRes("error")
          // toast.error(result.error);
        } else {
          setTrainer(result["data"][0]);
          // toast.success("Your package list display successfully");
          setErrorRes("")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const fetch = () => {
    console.log("inside fetch");
    axios
      .get(config.serverURL + "/member/memberPackages", {
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
          // toast.error(result.error);
        } else {
          // toast.success("Your package list display successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetch();
    fetchTrainer()
  }, []);
  

  return (
    <div>
      <div className="screen-wrapper">
        <div className="screen-heading">Manage Membership</div>

        <div className="screen-content">
          <div style={{ fontSize: "22px", fontWeight: "600", paddingBottom: "10px" }}>Active Plans</div>
          <hr />
          {
            authData?.status === 0
              ?
              <div className="empty-view">
                YOU DONT HAVE ANY ACTIVE PLAN.&nbsp;<Link to={"/dashboard/member/membership"}> APPLY FOR MEMBERSHIP</Link>
              </div>
              :
              <Table responsive hover striped className="table table-resposne">
                <thead>
                  <th>Package Name</th>
                  <th>Duration</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  {/* <th>Renewal</th> */}
                  <th>Trainer</th>
                </thead>
                <tbody>
                  {typeArray && typeArray.length ?
                    typeArray.map((type, index) => {
                      return (
                        <>
                          <tr key={index}>
                          <td>{type["package_name"]}</td>
                          <td>{type["duration"]} months</td>
                          <td>{type["start_date"]}</td>
                          <td>{type["end_date"]}</td>
                          {/*   <td></td> */}
                          {/* <td>{type["end_date"] === new Date() ? "matched" : new Date()}</td> */}
                          <td>{type["package_id"] === 1 ? errorRes === "error" ? "Contact Admin" : trainer["firstname"] : "NA"}</td>
                        </tr>

                        </>

                      )
                    })
                    : <div className="empty-view">
                      NO DATA FOUND
                    </div>
                  }
                </tbody>
              </Table>
          }
          
         {
          authData?.status === 1 
          ?
          <>
          <hr />
            <div className="d-flex flex-wrap ">
          <div className="mx-auto" style={{ fontWeight: "600", fontSize: "15px" }}>
            ADD NEW &nbsp;<Link to={"/dashboard/member/addPackage"}> PLANS</Link>
          </div>
        </div>
          </>
          :
          <div></div>
         }

        </div>
      </div>
    </div>
  );
};

export default GetMemberPackages;
