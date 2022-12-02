import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../../../config";

const CreateDietPlanForSpecificUser = () => {
  const authData = useSelector((state) => state.auth.authData);

  const location = useLocation()

  const navigate = useNavigate()

  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [dietList, setDietList] = useState([]);
  const [inputFields, setInputFields] = useState({
    user_id: {
      value: 0,
      isError: false,
    },
    diet_id: {
      value: 0,
      isError: false,
    },
    qty: {
      value: 0,
      isError: false,
    },
  });
  const [user_id, setUserId] = useState(0);
  const [diet_id, setDietId] = useState(0);
  const [qty, setQuantity] = useState(0);
  const [status, setStatus] = useState("");

  const resetForm = () => {
    setUserId(0);
    setDietId(0);
    setQuantity(0);
    // setStatus('')
    let currentInput = { ...inputFields };
    currentInput.user_id.value = "";
    currentInput.user_id.isError = false;
    currentInput.diet_id.value = 0;
    currentInput.diet_id.isError = false;
    currentInput.qty.value = "";
    currentInput.qty.isError = false;
    setInputFields(currentInput);

    setIsSubmitForm(false);
  };
  //on typing this will execute
  const onInputValueChange = (event) => {
    let currentInput = { ...inputFields };
    if (event.target.name === "user_id") {
      currentInput.user_id.value = event.target.value;
    } else if (event.target.name === "diet_id") {
      currentInput.diet_id.value = event.target.value;
    } else if (event.target.name === "qty") {
      currentInput.qty.value = event.target.value;
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

    if (currentInput.diet_id.value !== 0) {
      if (currentInput.diet_id.value) {
        // regex validatepassword
        currentInput.diet_id.isError = false;
      } else {
        currentInput.diet_id.isError = true;
      }
    } else {
      currentInput.diet_id.isError = true;
    }

    //-------------------------------------------------------------------------------

    if (currentInput.qty.value !== 0) {
      if (currentInput.qty.value) {
        // regex validatepassword
        currentInput.qty.isError = false;
      } else {
        currentInput.qty.isError = true;
      }
    } else {
      currentInput.qty.isError = true;
    }

    //-------------------------------------------------------------------------------

    if (
      currentInput.user_id.isError ||
      currentInput.diet_id.isError ||
      currentInput.qty.isError
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
          config.serverURL+ "/trainer/dietPlan",
          {
            user_id: inputFields.user_id.value,
            diet_id: inputFields.diet_id.value,
            qty: inputFields.qty.value,
          },
          {
            headers: {
              token: authData?.token,
            },
          }
        )
        .then((resposne) => {
          const result = resposne.data;
          console.log("res " + result);
          setStatus(resposne.data.status);
          resetForm();
          fetch();

          if (result.status === "error") {
            toast.error(result.error);
          } else {
            toast.success("diet item added successfully");
            navigate('/dashboard/trainer/getmystudents')
          }
        })
        .catch((error) => {
          toast.error("user don't have PT program");
          console.log(error);
        });
    }
  };
  const fetch = (user_id) => {
    axios
      .post(config.serverURL+ "/trainer/getUnusedDietItemOfSpecificMember", 
      {user_id},
      {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        console.log("res " + JSON.stringify(result["data"]));
        // console.log("res "+result["data"])
        setDietList(result["data"]);
        let currentInput = {...inputFields}
        currentInput.diet_id.value = result['data'][0].diet_id
        setInputFields(currentInput)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //lifecycle hook to load data on event
  useEffect(() => {
    const { user_id } = location.state
    let currentInput = { ...inputFields }
    console.log("type "+user_id)
    currentInput.user_id.value = user_id
    setInputFields(currentInput)
    fetch(user_id)
}, [])

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
      <div className="screen-heading">Create Diet Plan</div>
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
                <label htmlFor="diet_id">Item : </label>
              </div>
              

              <select
                name="diet_id"
                id="diet_id"
                onChange={(e) => {
                  onInputValueChange(e);
                }}
                value={inputFields.diet_id.value}
              >
                <option selected disabled>
                  None
                </option>
                {dietList && dietList.length
                  ? dietList.map((element, index) => {
                      return (
                        <option
                          key={index}
                          value={element.diet_id}
                        >{`${element.item_name} `}</option>
                      );
                    })
                  : null}
              </select>
              {inputFields.diet_id.isError ? (
                <div className="error-wrapper">
                  {inputFields.diet_id.value === 0
                    ? "Item is required."
                    : "Please enter valid diet_id."}
                </div>
              ) : null}
            </div>
          </div>

          <div className="col">
            <div className="form-field">
              <div>
                <label htmlFor="qty"> Quntity : </label>
              </div>
              <input
                onChange={(e) => {
                  onInputValueChange(e);
                }}
                name="qty"
                type="number"
                id="qty"
                class="feedback-input"
                value={inputFields.qty.value}
              />
              {inputFields.qty.isError ? (
                <div className="error-wrapper">
                  {inputFields.qty.value === 0
                    ? "qty is required."
                    : "Please enter valid qty."}
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateDietPlanForSpecificUser;
