import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import {
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Table,
} from "reactstrap";
import config from "../../../../config";

const GetMyStudents = () => {
  const authData = useSelector((state) => state.auth.authData);

  const [item_name, setType] = useState("");
  const [typeArray, setTypeArray] = useState([]);
  const [dietArray, setDietArray] = useState([]);
  const [workoutArray, setWorkoutArray] = useState([]);
  const [user_id, setUserId] = useState(0);
  const [isWorkout, setIsWorkout] = React.useState(true);

  const navigate = useNavigate()

  // Modal open state
  const [modal, setModal] = React.useState(false);

  const toggle = () => setModal(!modal);

  //resetForm
  const resetForm = () => {
    setType("");
    setIsWorkout(false)
  };

  const onClose = () => {
    resetForm();
    toggle();
  };

  const closeBtn = (
    <button className="close" onClick={onClose}>
      &times;
    </button>
  );





  const fetch = () => {
    axios
      .get(config.serverURL+"/trainer/getmystudents", {
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

  const fetchDiet = (user_id) => {
    // e.preventDefault()
    // console.log("TOKEN "+authData.token);
    toggle();
    setIsWorkout(false)
    setUserId(user_id)
    axios
      .get(config.serverURL+`/trainer/getDietPlan/${user_id}`, {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        setDietArray(result["data"]);
        if (result.status == "error" ) {
          toast.error("Diet list is empty");
        } else {
          toast.success("Items displayed successfully");
        }
        console.log("res " + JSON.stringify(result["data"]));
        fetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchWorkout = (user_id, from) => {
    // e.preventDefault()
    // console.log("TOKEN "+authData.token);
    if (from !== 'fromDelete') {
      toggle()
    }
    setIsWorkout(true)
    setUserId(user_id)
    axios
      .get(config.serverURL+`/trainer/getWorkoutPlan/${user_id}`, {
        headers: {
          token: authData?.token,
        },
      })
      .then((resposne) => {
        const result = resposne.data;
        setWorkoutArray(result["data"]);
        console.log("res " + JSON.stringify(result["data"]));
        if (result.status == "error" ) {
          toast.error("Workout Plan does not exist");
        } else {
          toast.success("Workoutplan displayed successfully");
        }
        fetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const deleteWorkout = (type) => {
    // e.preventDefault()
    // console.log("TOKEN "+authData.token);
    let user_id = type.user_id
    axios
        .post(config.serverURL+`/trainer/deleteDayWorkoutplanofSpecificMember/${user_id}`, 
        {wType_id: type.wType_id, Day: type.Day},
        {
            headers: {
                'token': authData?.token
            }
        })
        .then((resposne) => {
            const result = resposne.data
            console.log("res " + JSON.stringify(result["data"]))
            fetchWorkout(user_id, "fromDelete")
            if (result.status == "error" ) {
              toast.error(result.error);
            } else {
              toast.success("workouttype deleted successfully");
            }
        }).catch((error) => {
            console.log(error)
        })
}


const updateDiet = (type) => {
    console.log("TYPE :::: "+type.diet_id)
    navigate('/dashboard/trainer/getmystudents/updateDietPlan', { state: { user_id: user_id, diet_id: type.diet_id } })
}


const onSubmit = (e) => {
    e.preventDefault()
    //insert call
    if (!isWorkout) {
        navigate('/dashboard/trainer/getmystudents/createDietPlan', { state: { user_id: user_id } })
    }
    //update call
    else {
        console.log("inside navigation: "+user_id)
        navigate('/dashboard/trainer/getmystudents/addWorkoutPlan', { state: { user_id: user_id } })
    }
        
}



  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="screen-wrapper">
      <div className="screen-heading">Manage Members</div>

      <div className="screen-content">
        <Table responsive hover striped className="table table-resposne">
          <thead>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Gender</th>
          </thead>
          <tbody>
            {typeArray && typeArray.length ? (
              typeArray.map((type, index) => {
                return (
                  <tr key={index["user_id"]}>
                    <td>{type["firstname"]}</td>
                    <td>{type["lastname"]}</td>
                    <td>{type["age"]}</td>
                    <td>{type["mobile"]}</td>
                    <td>{type["email"]}</td>
                    <td>{type["gender"]}</td>
                    <td>
                      <button
                        className="positive-btn"
                        onClick={() => fetchDiet(type.user_id)}
                      >
                        View Diet Plan
                      </button>
                      <button
                        className="positive-btn"
                        onClick={() => fetchWorkout(type.user_id)}
                      >
                        View Workout Plan
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <div className="empty-view">NO MEMBER ALLOTED YET</div>
            )}
          </tbody>
        </Table>
      </div>
      <Modal isOpen={modal} toggle={onclose} centered>
        <form onSubmit={onSubmit}>
        <ModalHeader className=" border-0" toggle={onclose} close={onClose}>
        {isWorkout ? 'Workout Plan' : 'Diet Plan'}
        </ModalHeader>
        <ModalBody className="text-left border-0">
          {/* add your form fields here */}
          {isWorkout === true && isWorkout 
                ?
                <Table responsive hover striped className="table table-resposne">
                <thead>
                  <th>Day</th>
                  <th>Type</th>
                  <th>Set</th>
                  <th>Reps</th>
                </thead>
                <tbody>
                  {workoutArray && workoutArray.length ? (
                    workoutArray.map((type, index) => {
                      return (
                        <tr key={index}>
                          <td>{type["Day"]}</td>
                          <td>{type["type"]}</td>
                          <td>{type["sets"]}</td>
                          <td>{type["reps"]}</td>
                          <td>
                          &nbsp;&nbsp;
                            <button className="positive-btn" type="button" onClick={() => deleteWorkout(type)}>
                                Delete
                            </button>{" "}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <div className="empty-view">NO DATA FOUND</div>
                  )}
                </tbody>
              </Table>

                :
                
          <Table responsive hover striped className="table table-resposne">
            <thead>
              <th>Item Name</th>
              <th>Quantity</th>
            </thead>
            <tbody>
              {dietArray && dietArray.length ? (
                dietArray.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{type["item_name"]}</td>
                      <td>{type["qty"]}</td>
                      <td>
                      &nbsp;&nbsp;
                        <button className="positive-btn" type="button" onClick={() => updateDiet(type)}>
                            Update
                        </button>{" "}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div className="empty-view">NO DATA FOUND</div>
              )}
            </tbody>
          </Table>
}
        </ModalBody>
        <ModalFooter className="modal-footer border-0">
          <Button className="btn_secondary modal-btn" onClick={onClose}>
            Cancel
          </Button>{" "}
          &nbsp;&nbsp;
          <button className="positive-btn" type="submit">
            Add
          </button>{" "}
        </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default GetMyStudents;
