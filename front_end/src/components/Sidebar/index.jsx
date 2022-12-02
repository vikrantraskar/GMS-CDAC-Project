import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import './style.css';
import { SidebarData } from "../../utils/sidebar-helper";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Sidebar = (props) => {
    const location = useLocation();
    const authData = useSelector((state) => state.auth.authData);
    const [selectedMenu, setSelectedMenu] = useState('Home');

    const navigate = useNavigate()

    const onMenuClick = (menu) => {
        setSelectedMenu(menu.taskName)
        navigate(menu.pathName)
    }

    // const firstName = authData.firstname;
    const firstLetter = authData.firstname.slice(0, 1);
    // console.log("FL ::: "+firstLetter)
    const lastLetter = authData.lastname.slice(0, 1);

    return (
        <div className="sidebar-container">
            <div className="sidebar-subwrapper">
                <div className="personal-wrapper">
                    <div className="circle-wrapper">
                        <div className="circle-text">{`${firstLetter} ${lastLetter}`}</div>
                    </div>
                    
                    <div style={{fontFamily:"sans-serif",fontWeight:'600', fontSize:'20px', paddingTop:'10px'}}>
                        {`${authData.firstname} ${authData.lastname}`}
                        
                    </div>
                    <div style={{fontFamily:"serif"}}>({authData?.roleId === 1 ? "Admin" : authData?.roleId === 2 ? "Trainer" : "Member"})</div>
                    <div style={{fontFamily:"sans-serif", paddingTop:'10px'}}>
                    {new Date().toDateString()}
                </div>
                    
                </div>
                {/* <hr style={{backgroundColor:"#674fa3"}}/> */}
                {
                    SidebarData[(authData?.roleId) - 1].task.map((menu, index) => {
                        // console.log('location.pathname === menu.taskName', location.pathname, menu.pathName, location.pathname === menu.pathName)
                        return (
                            <div
                                onClick={() => onMenuClick(menu)}
                                key={index}
                                className={`menu-wrapper ${location.pathname === menu.pathName ? 'menu-wrapper-selected' : ''}`}>
                                
                                <div className='menu-text'>
                                    {menu.taskName}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Sidebar;