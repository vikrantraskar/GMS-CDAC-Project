import React from 'react';
import { useSelector } from 'react-redux';

const MemberDashboard = (props) => {
    
    const authData = useSelector((state) => state.auth.authData);
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

export default MemberDashboard;