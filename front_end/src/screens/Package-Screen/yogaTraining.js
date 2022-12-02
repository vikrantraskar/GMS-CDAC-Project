import React from "react";
import AppHeader from "../../components/AppHeader";
import BackgroundImg from '../../assets/images/landing_background.jpg';
import './style.css'
import AppFooter from "../../components/AppFooter";
import { useNavigate } from "react-router-dom";

const YogaTraning = () =>{

    return(
        <div className="screen-wrapper">
    <div className="screen-heading">Programs</div>

    <div className="screen-content">
     {/** Abt Yoga Traning */}

  <div className="our-story">
  <div className="story-placeholder"></div>
  <div className="story-content">
      <div>
          <div className="heading">Yoga Training </div>
          <p className="about-content">
                Doing yoga or hitting the gym - too difficult a choice to make? Let's make things easier and look at both not as rivals but close allies. Yes, yoga can be a perfect complement to your body workout and actually add to the benefits you derive from it.

          
          </p>
          <p className="about-content">
                The best part is, you can continue with your daily workout routine just the way it is now and simply add a few minutes of yoga practice to it for better results.
          </p>

          <button className="read-more-story">Read more</button>
      </div>
  </div>
</div>
</div>
</div>
    )

}

export default YogaTraning