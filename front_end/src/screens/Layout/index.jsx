import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import Sidebar from "../../components/Sidebar";
import Navigator from "../../navigation";
import './style.css';

const Layout = (props) => {

    const isAuthenticated = useSelector((state) => state.auth.status);
    console.log('isAuthenticated in layout :: ', isAuthenticated);

    return (
        <>
            <div className="layout-container">
                <AppHeader />
                {isAuthenticated ? <Sidebar /> : null}
                <div className={isAuthenticated ? "protected-screen-view" : "default-screen-view"}>
                    {/* all components render here */}
                    <Navigator />
                </div>
            </div>
        </>
        
    )
};

export default Layout;