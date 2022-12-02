import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../../../config";
import { useDispatch, useSelector } from "react-redux";
import "../style.css";
import { toast } from "react-toastify";

const GiveFeedbackT = () => {
   const authData = useSelector((state) => state.auth.authData);
 
  const [inputFields, setInputFields] = useState({
   f_text: {
      value: "",
      isError: false,
    },
  });

  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    console.log("resetForm()")
    let currentInput = { ...inputFields };
   currentInput.f_text.value = "";
    currentInput.f_text.isError = false;
    setInputFields(currentInput);

    setIsSubmitForm(false);
  };

  const onInputValueChange = (event) => {
    let currentInput = { ...inputFields };
    if (event.target.name === "f_text") {
      currentInput.f_text.value = event.target.value;
    }
    setInputFields(currentInput);
    if (isSubmitForm) {
      validateForm();
    }
  };

  const validateForm = () => {
    let currentInput = { ...inputFields };
    let isNoError = true;
    // console.log('validateEmail(currentInput.email.value) ==> ', currentInput.email.value === '' || validateEmail(currentInput.email.value));
    if (currentInput.f_text.value !== "") {
      if (currentInput.f_text.value) {
        currentInput.f_text.isError = false;
      } else {
        currentInput.f_text.isError = true;
      }
    } else {
      currentInput.f_text.isError = true;
    }
    if (currentInput.f_text.isError) {
      isNoError = false;
    } else {
      isNoError = true;
    }
    return isNoError;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitForm(true);
    console.log('validateForm() => ', validateForm());
    // navigate('/dashboard')
    if (validateForm()) {
      axios
        .post(config.serverURL + "/trainer/giveFeedback", 
        {f_text: inputFields.f_text.value},
          {
            headers: {
              token: authData?.token,
            },
          })
        .then((resposne) => {
          const result = resposne.data;
          console.log("result = " + JSON.stringify(result));
          //fetch();
          console.log("status = " + result.status);

          if (result.status == "error") {
            toast.error(result.error);
          } else {
            toast.success("feedback added successfully");
            resetForm();
            // console.log("sucess elese")
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div className="main-div signin-wrapper">
        <div className="form-div">
          <form onSubmit={onSubmit}>
            <div className="heading">
              <h3>Feedback </h3>
            </div>

            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                
              </label>
              <input
                type="f_text"
                onChange={(e) => onInputValueChange(e)}
                className={`form-control ${
                  inputFields.f_text.isError ? "error-input" : ""
                }`}
                id="f_text"
                name="f_text"
                placeholder="Write Your Feedback Here..."
                value={inputFields.f_text.value}
              />
              {inputFields.f_text.isError ? (
                <div className="error-wrapper">
                  {inputFields.f_text.value === ""
                    ? "feedback is required."
                    : null}
                </div>
              ) : null}
            </div>
            <div className="btn-div">
              <button type={"submit"}  className="btn btn-block btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GiveFeedbackT ;
