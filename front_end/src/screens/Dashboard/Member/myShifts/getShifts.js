import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody, Table
} from "reactstrap"
import config from "../../../../config";

const GetMyShift = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [typeArray, setTypeArray] = useState([]);
  const [shift, setShift] = useState(0);
  const [status, setStatus] = useState('')
  const [errorResponse, setErrorResponse] = useState('')

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log("TOKEN "+authData.token);
    fetch();
  };

  useEffect(() => {
    fetch()
    getActiveShift()
  }, [])

  const getActiveShift = () => {
    axios
      .get(config.serverURL+"/member/getMyShift", {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        console.log(resposne.data);
        const result = resposne.data;

        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res " + result["data"]);
        setShift(result["data"][0].shift_id);
        // console.log(shift[0].shift_id)

      })
      .catch((error) => {

        console.log(error);
      });
  }

  const fetch = () => {
    axios
      .get(config.serverURL+"/user/getAllShifts", {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        // console.log(resposne.data);
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res " + result["data"]);
        setTypeArray(result["data"]);
      })
      .catch((error) => {
        console.log(error);
      });

    //get my shift  call to be written
  };

  const addType = (shift_id) => {
    // e.preventDefault()
    // console.log("TOKEN "+authData.token);
    // console.log(shift_id, user_id);
    axios
      .post(
        config.serverURL+"/member/selectShift",
        { shift_id },
        {
          headers: {
            token: authData?.token,
          },
        }
      )
      .then((resposne) => {
        const result = resposne.data;
        setStatus(resposne.data.status)
        setErrorResponse(resposne.data.error)
        console.log("res " + JSON.stringify(result["data"]));
        fetch();
        getActiveShift()
        if (result.status == "error" ) {
          toast.error(result.error);
        } else {
          toast.success("shift allocated to you successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        {/* <div>
        {
          !shift ? <h3 className="text-white bg-secondary">You dont have any active shift...You can select below shift only once </h3> 
          : <h3 className="text-white bg-warning">If you wish to change it ... please contact admin</h3>
        }
      </div> */}

        <div className="screen-wrapper">
          <div className="screen-heading">Active Shift</div>

          <div className="screen-content">
            {
              authData?.status === 1 
              ?
              <div>
              <Table responsive hover striped className="table table-resposne">
              <thead>
                <th>Time Slot</th>
                <th>Vacancy</th>
                <th>Active Shift</th>
              </thead>
              <tbody>
                {typeArray && typeArray.length ?
                  typeArray.map((type, index) => {
                    return (
                      <tr key={index}>
                        <td>{type["time_slot"]}</td>
                        <td>{type["vacancy"]}</td>
                        <td>
                            {
                              !shift ? <input
                                type="button"
                                className="positive-btn"
                                value="Select"
                                onClick={() => addType(type["shift_id"])}
                              /> : <p></p>
                            }
                            {
                              shift === type['shift_id'] 
                              ? 
                              <p 
                                className="text-white bg-success" 
                                style={{borderRadius:"5px", width:"70px", padding:"3px", paddingLeft:"5px"}}>
                                  Active
                              </p> 
                              : <p></p>
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
            <div style={{fontWeight:"500"}}>** Select one of the above shift. If you wish to change the shift please contact admin.</div>
            </div>
              :
              <div className="empty-view">
                YOU DONT HAVE ANY ACTIVE PLAN.&nbsp;<Link to={"/dashboard/member/membership"}> APPLY FOR MEMBERSHIP</Link>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default GetMyShift;
