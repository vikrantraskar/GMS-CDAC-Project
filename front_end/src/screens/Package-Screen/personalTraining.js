import React from "react";
import AppHeader from "../../components/AppHeader";
import BackgroundImg from '../../assets/images/landing_background.jpg';
import './style.css'
import AppFooter from "../../components/AppFooter";
import { useNavigate } from "react-router-dom";

const PersonalTraning  = () =>{
    return(
        <div className="screen-wrapper">
    <div className="screen-heading">Programs</div>

    <div className="screen-content"></div>

     {/** Abt Personal Traning */}
  <div className="our-story">
  <div className="story-placeholder"></div>
  <div className="story-content">
      <div>
          <div className="heading">Personal Training </div>
          <p className="about-content">
            Personal training is the most effective way to grow and excel in our life. Personal training isn’t something that only rich people or athletes need, but it has to be accessible to all as everyone has their problems or issues where personal training can help. Being healthy is not anything else than a necessity.

          
          </p>
          <p className="about-content">
            A personal trainer also helps and guides you in monitoring your progress and the direction you are heading, which can help you track and control your journey of becoming more healthy. As they are certified to give training, they focus more on their client’s nutrition, goals, aspirations, exercise, diet, sleep cycle, etc.
          </p>

          <button className="read-more-story">Read more</button>
      </div>
  </div>
</div>
</div>
    )
}
export default PersonalTraning
 