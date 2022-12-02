import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody, Table
} from "reactstrap"
import { toast } from "react-toastify";
import config from "../../../../config";
import { Link } from "react-router-dom";


const GetMemberSpecificBmi = () =>{
const authData = useSelector((state) => state.auth.authData);

const[typeArray, setTypeArray] = useState([])
const [status, setStatus] = useState('')
const [errorResponse, setErrorResponse] = useState('')


const onSubmit = (e) => {
    e.preventDefault()
        // console.log("TOKEN "+authData.token);
   // fetch()
}

useEffect(() => {
  if (authData?.status === 1) {
    fetch()
  }
}, [authData?.status])

const fetch = () => {
    axios
        .get(config.serverURL+'/member/getBmiReport',{ headers: {
            'token': authData?.token
          }})
        .then((resposne) => {
          console.log(resposne.data)
          setErrorResponse(resposne.data.error)
            const result = resposne.data
            console.log("res "+JSON.stringify(result["data"]))
            //  console.log("res "+result["data"])
            setTypeArray(result["data"])
            if (result.status == "error" ) {
                toast.error("Your Bmi report is not created yet");
              } else {
                console.log("inside toast after successfull")
                toast.success("Bmi report get successfully");
              }
        }).catch((error)=> {
            toast.error("user does not exist");
            console.log(error)
        })
}


    return (
        <div>
          <div className="screen-wrapper">
            <div className="screen-heading">BMI Report</div>

            <div className="screen-content">
            <Table responsive hover striped className="table table-resposne">
                    <thead>
                        <th>Height</th>
                        <th>Weight</th>
                        <th>Score</th>
                        <th>Status</th>
                    </thead>
                    <tbody>
                        { typeArray && typeArray.length ?
                            typeArray.map((type, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{type["height"]}</td>
                                        <td>{type["weight"]}</td>
                                        <td>{type["score"]}</td>
                                        <td>{type["status"]}</td>
                                    </tr>
                                )
                            })
                            : 
                          authData?.status === 0  ?
                            <div className="empty-view">
                              YOU DONT HAVE ANY ACTIVE PLAN.&nbsp;<Link to={"/dashboard/member/membership"}> APPLY FOR MEMBERSHIP</Link>
                            </div>
                            :
                              <div className="empty-view">
                                NO DATA FOUND
                              </div>

                        }
                    </tbody>
                </Table>
            </div>
          </div>
        </div>
    )
}

    export default GetMemberSpecificBmi