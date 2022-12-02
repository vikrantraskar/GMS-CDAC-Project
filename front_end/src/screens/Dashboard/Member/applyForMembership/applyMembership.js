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
import { updateAuthdata } from "../../../../slices/authSlice";

const ApplyForMembership = () => {
  const authData = useSelector((state) => state.auth.authData);

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [package_id, setPackageId] = useState(0)
  const [amount, setAmount] = useState(0)
  const [payment_method, setPaymentMethod] = useState('GPay')
  const [package_name, setPackageName] = useState('')
  // const [status, setStatus] = useState(false)
  const [errorResponse, setErrorResponse] = useState('')
  const [typeArray, setTypeArray] = useState([]);

  // Modal open state
  const [modal, setModal] = React.useState(false);

  const resetForm = () => {
    setAmount(0)
    setPackageId(0)
    setPaymentMethod('GPay')
    setPackageName("")
  }

  const toggle = () => setModal(!modal);

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        config.serverURL+`/member/membership`, { package_id, amount, payment_method },
        {
          headers: {
            token: authData?.token,
          },
        }
      )
      .then((resposne) => {
        toggle()
        const result = resposne.data;
        // setStatus(resposne.data.status)
        setErrorResponse(resposne.data.error)
        console.log("res " + JSON.stringify(result["data"]));
        if (result.status == "error"  ) {
          toast.error(result.error);
        } else {
            toast.success("Membership get successfully");
            dispatch(updateAuthdata(1))
            navigate("/dashboard/member/getMyShift")
        }
        resetForm()
        fetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };

 

  const fetch = () => {
    axios
      .get(config.serverURL+`/user/getAllPackages`, {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res " + result["data"]);
        setTypeArray(result["data"]);
        
        resetForm()
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

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      {/* <div>
        <h3 className="text-white bg-success">
          Proceed with any of the belowing package to continue Membership
        </h3>
      </div> */}

      <div className="screen-wrapper">
        <div className="screen-heading">Apply For Membership</div>

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
              {/* <input type={"text"} onChange={(e) => { setPaymentMethod(e.target.value) }} value={payment_method} /> */}
              <select onChange={(e) => setPaymentMethod(e.target.value)} value={payment_method}>
                <option selected disabled>select</option>
                <option value={"Gpay"}>GPay</option>
                <option value={"PhonePay"}>PhonePay</option>
                <option value={"PayPal"}>PayPal</option>
              </select>
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
  );
};

export default ApplyForMembership;
