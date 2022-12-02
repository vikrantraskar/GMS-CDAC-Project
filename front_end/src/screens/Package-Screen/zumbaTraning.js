import React from "react";
import AppHeader from "../../components/AppHeader";
import BackgroundImg from '../../assets/images/landing_background.jpg';
import './style.css'
import AppFooter from "../../components/AppFooter";
import { useNavigate } from "react-router-dom";

const ZumbaTraning  = () =>{
    return(
        <div className="screen-wrapper">
    <div className="screen-heading">Programs</div>

    <div className="screen-content"></div>

    {/** Abt Zumba Traning */}
  <div className="our-story">
  <div className="story-placeholder"></div>
  <div className="story-content">
      <div>
          <div className="heading"> Zumba Training </div>
          <p className="about-content">
          Zumba Class provides Participants a Cardio Workout and Strength Training. Zumba is an Interval Workout. The Classes move between high and low Intensity Dance moves designed to get your heart rate up and boost cardio endurance. Working up a Sweat in the 60 Minutes Classes burns an average of 369 calories - more than cardio kickboxing or step aerobics.

          
          </p>
          <p className="about-content">
          After Completion of the Course, Certification will be Provided. Zumba is one of the most fun and versatile fitness crazes to come along in the long Time.
          </p>

          <button className="read-more-story">Read more</button>
      </div>
  </div>
</div>
</div>
    )
}
export default ZumbaTraning
  