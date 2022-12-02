import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';



const TrainerDashboard = (props) => {
    const location = useLocation();
    console.log(location);
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')

    const authData = useSelector((state) => state.auth.authData);
    useEffect(() => {

    }, [])


    return (
        //    <div className="common-dashboard">
        //         {/** Placeholder Background Image View */}
        //             <div className="left-wrapper">
        //                 <div>
        //                     <div className="text-wrapper">WELCOME {`${authData.firstname} ${authData.lastname}`}</div>
        //                     <div className="join-btn-wrapper">

        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="right-wrapper"></div>
        //     </div>

        <div className="screen-wrapper">
            <div className="screen-heading">Home</div>

            <div className="screen-content">
                <div style={{fontWeight:'300', fontSize:'5px'}}>Welcome, {`${authData.firstname} ${authData.lastname} !!`}
                
                </div>
                <div style={{fontFamily:"sans-serif", paddingTop:'10px'}}>
                    {new Date().toDateString()}
                </div>
            </div>
        </div>
    )
};

export default TrainerDashboard;