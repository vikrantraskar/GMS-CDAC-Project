import React from "react";
import AppHeader from "../../components/AppHeader";
import BackgroundImg from '../../assets/images/landing_background.jpg';
import './style.css'
import AppFooter from "../../components/AppFooter";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    const goToSignUpPage = () => {
        navigate('/signup')
    }

    return (
        <>
            <div className="landing-container">
                {/** Placeholder Background Image View */}
                <div className="background-image-wrapper">
                    <div className="left-wrapper">
                        <div>
                            <div className="text-wrapper">MAKE IT SHAPE</div>
                            <div className="join-btn-wrapper">
                                <button onClick={() => goToSignUpPage()}>JOIN US NOW</button>
                            </div>
                        </div>
                    </div>
                    <div className="right-wrapper"></div>
                </div>

                {/** Story About Us */}
                <div className="our-story">
                    <div className="story-placeholder"></div>
                    <div className="story-content">
                        <div>
                            <div className="heading">STORY ABOUT US</div>
                            <p className="about-content">
                            In 1988, the first GMS opened in CDAC in the Republic of Pune. Over the next decades , GMS was present in over 16 countries, including India making it a leader in the global fitness industry.

                            
                            </p>
                            <p className="about-content">
                            In 2022, GMS was acquired by fitness.in, India's largest chain of fitness centres that offers energetic group workouts and multiple workout formats to choose from.
                            </p>

                            <button className="read-more-story">Read more</button>
                        </div>
                    </div>
                </div>

                <div className="facilities-wrapper">

                </div>
                <AppFooter />
            </div>
        </>
    )
};

export default LandingPage;