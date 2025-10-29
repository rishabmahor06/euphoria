import React from "react";
import sarees from "../assets/Collage/sarees.jpg";
import lehanga from "../assets/Collage/lehanga.jpg";
import kurta from "../assets/Collage/kurta.jpg";
// import cord from "../assets/Collage/cord.jpg";
import menKurta3 from "../assets/Collage/menKurta3.webp";
import menKurta4 from "../assets/Collage/menKurta4.webp";
import { FaArrowRight } from "react-icons/fa6";


const Category = () => {
  return (
    <div>
      <div className="text-center text-3xl  mt-10">
        <h1>SHOP BY CATEGORY</h1>
      </div>
      <div>
        <ul className="flex gap-10 text-center rounded-xl justify-center font-bold  p-20 ">
          <li className="cursor-pointer  duration-300 shadow-lg rounded-xl ">
            <a href="#">
              <img className="rounded-xl " src={sarees} alt="" />
              SAREES
            </a>
          </li>
          <li className="cursor-pointer  duration-300 shadow-lg rounded-xl ">
            <a href="#">
              <img className="rounded-xl" src={lehanga} alt="" />
              LEHANGA SETS
            </a>
          </li>
          <li className="cursor-pointer  duration-300 shadow-lg rounded-xl ">
            <a href="#">
              <img className="rounded-xl" src={kurta} alt="" />
              KURTA SETS
            </a>
          </li>
          <li className="cursor-pointer  duration-300 shadow-lg rounded-xl ">
            <a href="#">
              <img className="rounded-xl" src={kurta} alt="" />
              CO-ORDS SETS
            </a>
          </li>
        </ul>
      </div>

      <div>
        <div>
          <h1 className="text-center text-4xl  mt-10 ">MENSWEAR</h1>
        </div>
        <div className="flex gap-10 text-center rounded-xl justify-center p-10 ">
          <img className="h-[40vw] w-[35vw]" src={menKurta4} alt="" />
          <img className="h-[40vw] w-[35vw] " src={menKurta3} alt="" />
        </div>

        <div className="flex items-center justify-center mb-5  ">
          <button className=" text-lg mt-0 flex justify-center text-green-900 font-bold items-cente px-9 transition-all hover:text-white hover:bg-green-900 py-2 border border-green-900 ">
            SHOP THE COLLECTION <FaArrowRight className=" ml-2 mt-1  text-center" />

          </button>
        </div>
      </div>
    </div>
  );
};

export default Category;
