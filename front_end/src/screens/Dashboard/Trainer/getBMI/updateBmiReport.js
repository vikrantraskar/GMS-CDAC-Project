import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../../../config";

const UpdateBmiReport = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const authData = useSelector((state) => state.auth.authData);

  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [status, setStatus] = useState('');
  const [inputFields, setInputFields] = useState({
    user_id: {
      value: 0,
      isError: false,
    },
    height: {
      value: 0,
      isError: false,
    },
    weight: {
      value: 0,
      isError: false,
    },
  });
  const [user_id, setUserId] = useState(0)
const[height, setHeight] = useState(0)
const[weight, setWeight] = useState(0)

  const resetForm = () => {
    setUserId(0);
    setHeight(0);
    setWeight(0);
    setStatus('')
    let currentInput = { ...inputFields };
    currentInput.user_id.value = "";
    currentInput.user_id.isError = false;
    currentInput.height.value = "";
    currentInput.height.isError = false;
    currentInput.weight.value = "";
    currentInput.weight.isError = false;
    setInputFields(currentInput);

    setIsSubmitForm(false);
  };
  //on typing this will execute
  const onInputValueChange = (event) => {
    let currentInput = { ...inputFields };
    if (event.target.name === "user_id") {
      currentInput.user_id.value = event.target.value;
    } else if (event.target.name === "height") {
      currentInput.height.value = event.target.value;
    } else if (event.target.name === "weight") {
      currentInput.weight.value = event.target.value;
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
    if (currentInput.user_id.value !== 0) {
      if (currentInput.user_id.value) {
        // regex validatepassword
        currentInput.user_id.isError = false;
      } else {
        currentInput.user_id.isError = true;
      }
    } else {
      currentInput.user_id.isError = true;
    }
    // ---------------------------------------------------------------------

    if (currentInput.height.value !== 0) {
      if (currentInput.height.value) {
        // regex validatepassword
        currentInput.height.isError = false;
      } else {
        currentInput.height.isError = true;
      }
    } else {
      currentInput.height.isError = true;
    }

    //-------------------------------------------------------------------------------

    if (currentInput.weight.value !== 0) {
      if (currentInput.weight.value) {
        // regex validatepassword
        currentInput.weight.isError = false;
      } else {
        currentInput.weight.isError = true;
      }
    } else {
      currentInput.weight.isError = true;
    }

    //-------------------------------------------------------------------------------

    if (
      currentInput.user_id.isError ||
      currentInput.height.isError ||
      currentInput.weight.isError
    ) {
      isNoError = false;
    } else {
      isNoError = true;
    }

    return isNoError;
  };

  const onSubmit = () => {
    console.log("TOKEN " + authData.token);
    setIsSubmitForm(true);
    if (validateForm()) {
      axios
        .post(
          config.serverURL+ "/trainer/updateBmiReport",
          {
            user_id: inputFields.user_id.value,
            height: inputFields.height.value,
            weight: inputFields.weight.value,
          },
          {
            headers: {
              token: authData?.token,
            },
          }
        )
        .then((resposne) => {
          const result = resposne.data;
          console.log("result = " + JSON.stringify(result));
          setStatus(result.status);
          
          fetch();
          console.log("status = " + result.status);

          if (result.status == "error" ) {
            toast.error("user does not exist");
          } else {
            toast.success("Bmi report updated successfully");
            
            navigate('/dashboard/trainer/managebmi', {state: {user_id: inputFields.user_id.value}})
            resetForm();
          }
         
        })
        .catch((error) => {
          toast.error("user does not exist");
          console.log(error);
        });
    }
  };
//   const fetch = () => {
//     axios
//       .post("http://localhost:5000/trainer/getUnusedDietItemOfSpecificMember", {
//         headers: {
//           token: authData?.token,
//         },
//       })
//       .then((resposne) => {
//         const result = resposne.data;
//         console.log("res " + JSON.stringify(result["data"]));
//         // console.log("res "+result["data"])
//         setDietList(result["data"]);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   //lifecycle hook to load data on event
useEffect(() => {
  const { user_id, height, weight } = location.state
  let currentInput = { ...inputFields }
  console.log("type "+user_id)
  currentInput.user_id.value = user_id
  currentInput.height.value = height 
  currentInput.weight.value = weight
  setInputFields(currentInput)
}, []);

  return (
    // <div>
    //     <form onSubmit={onSubmit}>
    //         <h2> Update Profile </h2>
    //         <label htmlFor="firstname"> Enter First Name : </label>
    //         <input onChange={(e) => { setFirstname(e.target.value) }} name="firstname" type="text" id="firstname" class="feedback-input" value={firstname} />
    //         <label htmlFor="lastname"> Enter Last Name : </label>
    //         <input onChange={(e) => { setLasttname(e.target.value) }} name="lastname" type="text" id="lasttname" class="feedback-input" value={lastname} />
    //         <label htmlFor="mobile"> Enter Mobile No : </label>
    //         <input onChange={(e) => { setMobile(e.target.value) }} name="mobile" type="text" id="mobile" class="feedback-input" value={mobile} />
    //         <label htmlFor="age"> Enter Age : </label>
    //         <input onChange={(e) => { setAge(e.target.value) }} name="age" type="number" id="age" class="feedback-input" value={age} />
    //         <label htmlFor="gender"> Enter Gender : </label>
    //         <input onChange={(e) => { setGender(e.target.value) }} name="gender" type="text" id="gender" class="feedback-input" value={gender} />
    //         <input type="submit" value="Add" />
    //     </form>
    // </div>
    <div className="screen-wrapper">
      <div className="screen-heading"> Update Bmi Report</div>
      <div className="screen-content">
        <div className="row">
          <div className="col">
            <div className="form-field">
              <div>
                <label htmlFor="user_id"> User Id : </label>
              </div>
              <input
                onChange={(e) => {
                  onInputValueChange(e);
                }}
                name="user_id"
                type="number"
                id="user_id"
                class="feedback-input"
                value={inputFields.user_id.value}
              />
              {inputFields.user_id.isError ? (
                <div className="error-wrapper">
                  {inputFields.user_id.value === 0
                    ? "User_id is required."
                    : "Please enter valid User_id."}
                </div>
              ) : null}
            </div>
          </div>

          <div className="col">
            <div className="form-field">
              <div>
                <label htmlFor="height"> Height(in cm) : </label>
              </div>
               <input
                name="height"
                id="height"
                onChange={(e) => {
                  onInputValueChange(e);
                }}
                value={inputFields.height.value}
              >
               
              </input>
              {inputFields.height.isError ? (
                <div className="error-wrapper">
                  {inputFields.height.value === 0
                    ? "height is required."
                    : "Please enter valid height."}
                </div>
              ) : null}
            </div>
          </div>

          <div className="col">
            <div className="form-field">
              <div>
                <label htmlFor="weight"> Weight(in kg) : </label>
              </div>
              <input
                onChange={(e) => {
                  onInputValueChange(e);
                }}
                name="weight"
                type="number"
                id="weight"
                class="feedback-input"
                value={inputFields.weight.value}
              />
              {inputFields.weight.isError ? (
                <div className="error-wrapper">
                  {inputFields.weight.value === 0
                    ? "weight is required."
                    : "Please enter valid weight."}
                </div>
              ) : null}
            </div>
          </div>

          <div className="col"></div>
        </div>

        <div className="action-div">
          <button onClick={resetForm} className="negative-btn">
            Cancel
          </button>
          <button onClick={onSubmit} className="positive-btn">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
export default UpdateBmiReport;
