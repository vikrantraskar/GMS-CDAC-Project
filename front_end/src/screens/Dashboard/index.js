import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import './style.css';


const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //getting roleID from sessionStorage
    let roleId = sessionStorage.getItem('role_id');
    
    const [isErrorView, setIsErrorView] = useState(false);
    console.log(roleId);
    // eslint-disable-next-line no-undef
    const authData = useSelector((state) => state.auth.authData);
    console.log(authData);
    const renderErrorView = () => {
        return (
            <div>
                You don't have any access to this account. Please contact to admin...
            </div>
        )
    }
    useEffect(() => {
        if ( location.pathname === '/dashboard') {
            if (authData?.roleId === 1) {
                navigate('/dashboard/admin')
            } else if (authData?.roleId === 2 ) {
                navigate('/dashboard/trainer')
            } else if (authData?.roleId === 3) {
                navigate('/dashboard/member')
            } else {
                setIsErrorView(true);
            }
        }
        
    }, [])
    return (
        <>
            <div className="dashboard-container">
                    {/* {authData?.roleId === 1 ? <AdminDashboard /> 
                    : authData?.roleId === 2 || true ? <TrainerDashboard /> 
                    : authData?.roleId === 3 ? <MemberDashboard />
                    : renderErrorView()
                } */}
                {isErrorView ? renderErrorView() : null}
                <Outlet />
                
            </div>
        </>
    )
};

export default Dashboard;