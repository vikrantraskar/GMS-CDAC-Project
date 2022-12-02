import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const AdminDashboard = (props) => {
    const location = useLocation();
    
    const authData = useSelector((state) => state.auth.authData);
    console.log(location);
    return (
        <div className="screen-wrapper">
            <div className="screen-heading">Home</div>

            <div className="screen-content">
                <div style={{fontWeight:'600', fontSize:'30px'}}>Welcome, {`${authData.firstname} ${authData.lastname} !!`}
                
                </div>
                <div style={{fontFamily:"sans-serif", paddingTop:'10px'}}>
                    {new Date().toDateString()}
                </div>
            </div>
        </div>
    )
};

export default AdminDashboard;