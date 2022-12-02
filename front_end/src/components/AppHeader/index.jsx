import React from "react";
import { Link, useNavigate } from "react-router-dom";
// use the dispatch to update the redux store about the signin state
import { useDispatch, useSelector } from 'react-redux'
import { signin, signout } from "../../slices/authSlice"
import "./style.css"

const AppHeader = (props) => {
    // get the dispatcher
    const dispatch = useDispatch()
    const authData = useSelector((state) => state.auth.authData);
    console.log('authData in header :: ', authData);

    const navigate = useNavigate();

    const gotoSignin = () => {
        navigate('/signin');
    }
    const gotoSignout = () => {
        //sessionStorage.clear();
        dispatch(signout());
        navigate('/');
    }

    const goTOpage = (path) => {
        navigate(path)
    }

    let isLoggedIn = sessionStorage.getItem('token') && sessionStorage['token'] != "" ? true : false
    return (
        <div className="main-container">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <div className="logo-circle">
                    <Link className="navbar-brand" to="/" style={{fontSize:"25px", fontWeight:"800",padding:"1px", marginLeft:"14px"}}>GMS</Link>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    OUR PACKAGES
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {/* <li><a className="dropdown-item" onClick={() => goTOpage("/personaltraining")}>Personal Training</a></li>
                                    <li><a className="dropdown-item" onClick={() => goTOpage("/zumbatraining")}>Zumba Training</a></li>
                                    <li><a className="dropdown-item" onClick={() => goTOpage("/grouptraining")}>Group Training</a></li>
                                    <li><a className="dropdown-item" onClick={() => goTOpage("/yogatraining")}>Yoga Training</a></li> */}
                                    {/* <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li> */}
                                    <li><Link className="dropdown-item" to="/personaltraining">Personal Training</Link></li>
                                    <li><Link className="dropdown-item" to="/zumbatraining">Zumba Training</Link></li>
                                    <li><Link className="dropdown-item" to="/grouptraining">Group Training</Link></li>
                                    <li><Link className="dropdown-item" to="/yogatraining">Yoga Training</Link></li>
                                    
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/contactus">CONTACT US</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/aboutus">ABOUT US</Link>
                            </li>
                        </ul>
                        
                            {
                                isLoggedIn
                                        ?  <button onClick={gotoSignout} className="btn btn-danger signin-btn common-btn" type={"button"}>SignOut</button>
                                        : <button onClick={gotoSignin} className="btn btn-primary signin-btn common-btn" type={"button"}>SignIn</button>
                            }
                    </div>
                </div>
            </nav>
        </div>

        // <div className="container-fluid wrapper">
        //     <div className="brand"> Gold's GYM</div>
        //     {/* <ul className="navbar-nav mr-auto">
        //         <li className="nav-item active">
        //             <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
        //         </li>
        //         <li className="nav-item">
        //             <a className="nav-link" href="#">Link</a>
        //         </li>
        //     </ul> */}
        //     <div className="menu-container">
        //         <div className="menu-list">
        //             <div className="menu-item">Courses</div>
        //             <div className="menu-item">About Us</div>
        //             <div className="menu-item">Gallary</div>
        //             <div className="menu-item">Contact</div>
        //         </div>
        //         <div className="action-wrapper">
        //             <button onClick={gotoSignin} type="button" class="btn btn-primary">SignIn</button>
        //         </div>
        //     </div>
        // </div>
    )
}

export default AppHeader;