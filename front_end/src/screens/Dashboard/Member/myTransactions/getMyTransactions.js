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

const GetMyTransactions = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [typeArray, setTypeArray] = useState([]);
  const [status, setStatus] = useState('')
  const [errorResponse, setErrorResponse] = useState('')

  useEffect(() => {
    fetch();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log("TOKEN "+authData.token);
    fetch();
  };

  const fetch = () => {
    console.log("inside fetch");
    axios
      .get(config.serverURL+"/member/transactions", {
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
          // toast.error("You don't have any transaction");
        } else {
          toast.success("Your transaction details successfully display");
        }

      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="screen-wrapper">
        <div className="screen-heading">Transactions</div>

        <div className="screen-content">
          <Table responsive hover striped className="table table-resposne">
            <thead>
              <th>Package Name</th>
              <th>Transactions Date</th>
              <th>Transaction Amount</th>
              <th>Payment Method</th>
            </thead>
            <tbody>
              {typeArray && typeArray.length ?
                typeArray.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{type["package_name"]}</td>
                      <td>{type["t_date"]}</td>
                      <td>{type["t_amount"]}</td>
                      <td>{type["payment_method"]}</td>
                    </tr>
                  )
                })
                : <div className="empty-view">
                   YOU DONT HAVE ANY ACTIVE PLAN.&nbsp;<Link to={"/dashboard/member/membership"}> APPLY FOR MEMBERSHIP</Link>
                </div>
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GetMyTransactions;
