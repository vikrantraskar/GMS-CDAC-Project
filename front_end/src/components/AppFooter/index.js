import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './style.css'

const AppFooter = () => {
    const navigate = useNavigate()

    const goTopage = (path) => {
        navigate(path)
    }

    return(
        <div className="footer-container">
            <div className="top-section">
                <div className="content-col">
                    <div className="footer-heading">Address</div>
                    <div className="footer-content add-content">Main Branch - B-23, Amber Park, Near Hotel GreenWays, Wakad, Pune-411057 </div>
                    <div className="footer-content">Branch 2 - B-23, Amber Park, Near Hotel GreenWays, Wakad, Pune-411057 </div>
                </div>
                <div className="content-col">
                    <div className="footer-heading">Contact</div>
                    <div className="footer-content">+91 1231231231</div>
                    <div className="footer-content">+91 1231231232</div>
                    <div className="footer-content">gms@testmail.com</div>
                </div>
                <div className="content-col">
                    <div className="footer-heading">Quick Menu</div>
                    <div className="footer-content">
                    <Link className="nav-link" aria-current="page" to="/">Home</Link>
                    <Link className="nav-link" aria-current="page" to="/contactus">Contact</Link>
                    <Link className="nav-link" aria-current="page" to="/aboutus">About</Link>
                        {/* <div><a className="click-item">Home</a></div>
                        <div><a className="click-item">About</a></div>
                        <div><a className="click-item">News</a></div>
                        <div><a className="click-item">Program</a></div> */}
                    </div>
                </div>
                <div className="content-col">
                    <div className="footer-heading">Program</div>
                    <div className="footer-content">
                        <div><Link className="click-item" to="/personaltraining">Personal Training</Link></div>
                        <div><Link className="click-item" to="/zumbatraining" >Zumba Training</Link></div>
                        <div><Link className="click-item" to="/grouptraining">Group Training</Link></div>
                        <div><Link className="click-item" to="/yogatraining">Yoga Training</Link></div>
                    </div>
                </div>
            </div>
            <div className="copyright-content">Copyright © 2022 All Rights Reserved | GMS Group</div>
        </div>
    )
}

export default AppFooter;