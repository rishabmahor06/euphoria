import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ban1 from "../assets/Collage/ban1.jpg";
import ban2 from "../assets/Collage/ban2.jpg";
import slide3 from "../assets/Collage/slide3.webp";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Craft from "./Craft";
import Category from "./Category";
import Wedding from "./Wedding";

const Home = () => {

  const images = [
    {
      id: 1,
      first: ban1,
    },
    {
      id: 2,
      first: ban2,
    },
    {
      id: 3,
      first: slide3,
    },
    
  ];

  return (
    <div>
      <Navbar />
      <Swiper
        className="mySwiper"
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {images.map((img) => (
          <SwiperSlide key={img.id} className="">
            <div>
              <img
                src={img.first} alt="Craft 1"
              />
              
            </div>
           
          </SwiperSlide>
        ))}
      </Swiper>

      <Category />
      <Craft />
      <Wedding/>
      <Footer />
    </div>
  );
};

export default Home;
