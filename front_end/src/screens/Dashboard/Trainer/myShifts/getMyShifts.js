import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody, Table
} from "reactstrap"
import config from "../../../../config";

const GetMyShiftOfSpecificTrainer = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [typeArray, setTypeArray] = useState([]);

  useEffect(() => {
   fetch()
  }, []);

  const fetch = () => {
    axios
      .get(config.serverURL+"/trainer/getmyshifts", {
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

  return (

    <div className="screen-wrapper">
      <div className="screen-heading">My Shifts</div>

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
      </div>
    </div>
  );
};

export default GetMyShiftOfSpecificTrainer;
