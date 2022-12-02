import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody, Table
} from "reactstrap"
import { toast } from "react-toastify";
import config from "../../../../config";


const QueryMessages = () =>{
const authData = useSelector((state) => state.auth.authData);

const[typeArray, setTypeArray] = useState([])
const [status, setStatus] = useState('')
const [errorResponse, setErrorResponse] = useState('')


// const onSubmit = (e) => {
//     e.preventDefault()
//         // console.log("TOKEN "+authData.token);
//    // fetch()
// }

useEffect(() => {
  fetch()
}, [])

const fetch = () => {
    axios
        .get(config.serverURL+'/admin/getMessages',{ headers: {
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
                toast.error(result.error);
              } else {
                toast.success("Query's of peoples load successfully");
              }
        }).catch((error)=> {
            console.log(error)
        })
}


    return (
        <div>
          <div className="screen-wrapper">
            <div className="screen-heading">Query Report</div>

            <div className="screen-content">
            <Table responsive hover striped className="table table-resposne">
                    <thead>
                        <th>Query_id</th>
                        <th>FullName</th>
                        <th>Email</th>
                        <th>Message</th>
                    </thead>
                    <tbody>
                        { typeArray && typeArray.length ?
                            typeArray.map((type, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{type["query_id"]}</td>
                                        <td>{type["fullname"]}</td>
                                        <td>{type["email"]}</td>
                                        <td>{type["message"]}</td>
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
        </div>
    )
}

    export default QueryMessages