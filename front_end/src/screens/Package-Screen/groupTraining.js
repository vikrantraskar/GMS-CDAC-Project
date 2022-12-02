import React from "react";
import AppHeader from "../../components/AppHeader";
import BackgroundImg from '../../assets/images/landing_background.jpg';
import './style.css'
import AppFooter from "../../components/AppFooter";
import { useNavigate } from "react-router-dom";

const GroupTraning = () =>{
    return(
        <div className="screen-wrapper">
    <div className="screen-heading">Programs</div>

    <div className="screen-content"></div>

     {/** Abt Group Traning */}
  <div className="our-story">
  <div className="story-placeholder"></div>
  <div className="story-content">
      <div>
          <div className="heading"> Group Training </div>
          <p className="about-content">
          Group training sessions are essentially the same as personal training, but instead of being one-on-one, members work out in a group of ten or less under one trainer. It's a popular choice for many people because of its relative affordability and the fact you can train with friends. A group training session consists of anywhere between four to ten people training together.

          
          </p>
          <p className="about-content">
          It's best described as the quality of a personal trainer (PT), at a better price-point, with a small, like-minded community to share experiences and motivation.
          </p>

          <button className="read-more-story">Read more</button>
      </div>
  </div>
</div>
</div>
    )


}

export default GroupTraning

 