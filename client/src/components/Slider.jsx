import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "../assets/css/SwiperStyles.css";
import "swiper/css/bundle";

import { useSelector } from "react-redux";
import {SliderCard} from "../components";


const Slider = () => {
    const products = useSelector((state) => state.products);
    const [dinner, setDinner] = useState(null);

    useEffect(() => {
        setDinner(products?.filter((data) => data.product_category === "dinner"));
        console.log(dinner);
    }, [products]);
    
  return <div className="w-full pt-24">
    <Swiper
        slidesPerView={4}
        centeredSlides={false}
        spaceBetween={30}
        grabCursor={true}
        className="mySwiper"
      >
        {dinner 
        && dinner.map((data, i) => (<SwiperSlide key={i}>
            <SliderCard key={i} data={data} index={i}/>
        </SwiperSlide>
        ))}
    </Swiper>
  </div>;
};

export default Slider;
