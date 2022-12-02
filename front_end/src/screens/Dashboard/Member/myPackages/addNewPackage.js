import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody, Table
} from "reactstrap"
import { toast } from "react-toastify";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";

const AddPackages = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [package_id, setPackageId] = useState(0)
  const [amount, setAmount] = useState(0)
  const [payment_method, setPaymentMethod] = useState('GPay')
  const [package_name, setPackageName] = useState('')
  const [status, setStatus] = useState('')
  const [errorResponse, setErrorResponse] = useState('')
  const [typeArray, setTypeArray] = useState([]);

  // Modal open state
  const [modal, setModal] = React.useState(false);

  const navigate = useNavigate()

  const resetForm = () => {
    setAmount(0)
    setPackageId(0)
    setPaymentMethod('')
    setPackageName("")
  }

  const toggle = () => setModal(!modal);

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        config.serverURL+`/member/addPackage`, { package_id, amount, payment_method },
        {
          headers: {
            token: authData?.token,
          },
        }
      )
      .then((resposne) => {
        toggle()
        const result = resposne.data;
        setStatus(resposne.data.status)
        setErrorResponse(resposne.data.error)
        console.log("res " + JSON.stringify(result["data"]));
       
        fetch();
        if (result.status == "error" ) {
          toast.error(result.error);
        } else {
          toast.success("Your package get successfully added");
          navigate("/dashboard/member")
        }
        resetForm()
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  const fetch = () => {
    axios
      .get(config.serverURL+"/user/getAllPackages", {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res " + result["data"]);
        setTypeArray(result["data"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addType = (type) => {
    toggle()
    setPackageId(type["package_id"])
    setAmount(type["package_amount"])
    setPackageName(type['package_name'])
  };

  const onClose = () => {
    resetForm()
    toggle()
  }

  const closeBtn = (
    <button className="close" onClick={onClose}>
      &times;
    </button>
  );

  return (
    <div>
      <div className="screen-wrapper">
        <div className="screen-heading">Add New package</div>

        <div className="screen-content">
          <Table responsive hover striped className="table table-resposne">
            <thead>
              <th>Package Name</th>
              <th>Package Amount</th>
              <th>Duration</th>
              <th>Operation</th>
            </thead>
            <tbody>
              {typeArray && typeArray.length ?
                typeArray.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{type["package_name"]}</td>
                      <td>{type["package_amount"]}</td>
                      <td>{type["duration"]}</td>
                      <td>
                        <input
                          type="button"
                          className="positive-btn"
                          value="Add"
                          onClick={() => addType(type)}
                        />

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
      {/* <div>
        {status == 'error' ? <h5 className="text-danger">{errorResponse}</h5> : <h3></h3>}
      </div> */}

      <div>
        <Modal isOpen={modal} toggle={onclose} centered>
          <form onSubmit={onSubmit}>
            <ModalHeader className=" border-0" toggle={onclose} close={onClose}>
              Add Package
            </ModalHeader>
            <ModalBody className="text-left border-0">
              {/* add your form fields here */}
              <h3>{package_name}</h3>
              <input type={"hidden"} value={package_id} />
              <p className="modal-label">Please enter amount</p>
              <input type={"number"} onChange={(e) => { setAmount(e.target.value) }} value={amount} />
              <p className="modal-label">Please enter payment Method</p>
              <select onChange={(e) => setPaymentMethod(e.target.value)} value={payment_method}>
                <option selected disabled>select</option>
                <option value={"GPay"}>GPay</option>
                <option value={"PhonePay"}>PhonePay</option>
                <option value={"PayPal"}>PayPal</option>
              </select>
            </ModalBody>
            <ModalFooter className="modal-footer border-0">
              <Button className="btn_secondary modal-btn" onClick={onClose}>
                Cancel
              </Button>{" "}
              &nbsp;&nbsp;
              <button
                className="positive-btn"
                type="submit"
              >Submit</button>{" "}
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AddPackages;
