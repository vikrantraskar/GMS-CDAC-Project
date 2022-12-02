import React from "react";
import AppHeader from "../../components/AppHeader";
import BackgroundImg from '../../assets/images/landing_background.jpg';
import './style.css'
import AppFooter from "../../components/AppFooter";
import { useNavigate } from "react-router-dom";

const AboutUs = () =>{

    return (
    <div className="screen-wrapper">
    <div className="screen-heading">About Us</div>

    <div className="screen-content"></div>

     {/** Abt Group Traning */}
  <div className="our-story">
  <div className="story-placeholder"></div>
  <div className="story-content">
      <div>
          <div className="heading"> About us </div>
          <p className="about-content">
          We know that building a positive culture is incredibly important. We believe in encouraging, supporting, challenging, learning and growing to be the best! Our flexible working solutions, gym rebates and educational opportunities create a positive work/life balance for all our employees.
          We believe in giving back and offering time, money and products to volunteer services and community organisations. We’re committed to improving individuals' health, fitness, and well-being by supporting global and local charities, local sports teams, and events..

          
          </p>
          <p className="about-content">
          Instead of being just another gym equipment retailer, our founders wanted to be the best in the industry and set their minds to doing so! Over the last two decades Gym and Fitness has grown into one of Australia’s largest online fitness equipment retailers, helping thousands of customers live longer, happier and healthier lives.   </p>

          <button className="read-more-story">Read more</button>
      </div>
  </div>
</div>
</div>

    )
}

export default AboutUs

 