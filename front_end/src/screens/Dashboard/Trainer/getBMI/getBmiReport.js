import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Table,
} from "reactstrap";
import config from "../../../../config";



const ManageBmi = () => {
  const authData = useSelector((state) => state.auth.authData);

  const navigate = useNavigate()
  const location = useLocation()
  const [typeArray, setTypeArray] = useState([]);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log("TOKEN "+authData.token);
    fetch();
  };

  const [isSubmitForm, setIsSubmitForm] = useState(false);

  const [inputFields, setInputFields] = useState({
    userId: {
      value: "",
      isError: false,
    },
  });

  const resetForm = () => {
    let currentInput = { ...inputFields };
    currentInput.userId.value = "";
    currentInput.userId.isError = false;
    setInputFields(currentInput);

    setIsSubmitForm(false);
  };

  //on typing this will execute
  const onInputValueChange = (event) => {
    let currentInput = { ...inputFields };
    if (event.target.name === "userId") {
      currentInput.userId.value = event.target.value;
    }

    setInputFields(currentInput);
    //this will check if you are performing it first time without clicking on update
    if (isSubmitForm) {
      validateForm();
    }
  };

  const validateForm = () => {
    let currentInput = { ...inputFields };
    //isNoError == true  :::: it means there is no error in this form
    let isNoError = true;
    if (currentInput.userId.value !== "") {
      if (currentInput.userId.value) {
        // regex validatepassword
        currentInput.userId.isError = false;
      } else {
        currentInput.userId.isError = true;
      }
    } else {
      currentInput.userId.isError = true;
    }
    // ---------------------------------------------------------------------

    if (currentInput.userId.isError) {
      isNoError = false;
    } else {
      isNoError = true;
    }

    return isNoError;
  };

  

  const search = () => {
    setIsSubmitForm(true)
    console.log("id: "+ inputFields.userId.value)
    if(validateForm()){
      axios
      .post(
        config.serverURL+"/trainer/getMemberBmiReport",
        { id: inputFields.userId.value },
        {
          headers: {
            token: authData?.token,
          },
        }
      )
      .then((resposne) => {
        console.log(resposne.data);
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        
        setTypeArray(result["data"]);
        if (result.status == "error" ) {
          toast.error(result.error);
          console.log("result: "+ result.error)
        } else {
          toast.success("Bmi report displayed successfully");
          setHeight(result["data"][0].height)
        setWeight(result["data"][0].weight)
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };


  const create = (id) => {
    navigate('/dashboard/trainer/createbmi', { state: { user_id: id } })
  }

  const updatebmi = (id) => {
    navigate('/dashboard/trainer/updatebmi', { state: { user_id: id, height: height, weight: weight } })
  }

  useEffect(() => {
    // const { user_id } = location.state
    // console.log("user_id : "+user_id)
    // let currentInput = { ...inputFields }
    // currentInput.userId.value = user_id
    // setInputFields(currentInput)
  }, []);

  return (
    <div>
      <div className="screen-wrapper">
        <div className="screen-heading">BMI Report</div>

        <div className="screen-content">
          <div className="row">
            <div className="col">
              <div className="form-field">
                <div>
                  <label htmlFor="firstname">User Id</label>
                </div>
                <input
                  onChange={(e) => {
                    onInputValueChange(e);
                  }}
                  name="userId"
                  type="userId"
                  id="userId"
                  class="feedback-input"
                  value={inputFields.userId.value}
                />
                {inputFields.userId.isError ? (
                  <div className="error-wrapper">
                    {inputFields.userId.value === ""
                      ? "User Id is required."
                      : "Please enter valid User Id."}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="col">
            <div className="form-field">
              <div className="action-div">
                <buttom onClick={() => search()} className="positive-btn">
                  Search
                </buttom>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="action-div">
                <buttom onClick={() => create(inputFields.userId.value)} className="positive-btn">
                  Create
                </buttom>
              </div>
            </div>

            <div className="col">
              <div className="action-div">
                <buttom onClick={() => updatebmi(inputFields.userId.value)} className="positive-btn">
                  Update
                </buttom>
              </div>
            </div>
            </div>
            <div className="row">
            </div>
          <Table responsive hover striped className="table table-resposne">
            <thead>
              <th>Height(in cm)</th>
              <th>Weight(in kg)</th>
              <th>Score</th>
              <th>Status</th>
            </thead>
            <tbody>
              {typeArray && typeArray.length ? (
                typeArray.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{type["height"]}</td>
                      <td>{type["weight"]}</td>
                      <td>{type["score"]}</td>
                      <td>{type["status"]}</td>
                    </tr>
                  );
                })
              ) : (
                <div className="empty-view">NO DATA FOUND</div>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManageBmi;
