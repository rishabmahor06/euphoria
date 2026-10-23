import React from "react";
import sarees from "../assets/Collage/sarees.jpg";
import lehanga from "../assets/Collage/lehanga.jpg";
import kurta from "../assets/Collage/kurta.jpg";
// import cord from "../assets/Collage/cord.jpg";
import { useCatalog } from "../context/catalogContext";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

const categories = [
  { name: "SAREES", img: sarees },
  { name: "LEHANGA SETS", img: lehanga },
  { name: "KURTA SETS", img: kurta },
  { name: "CO-ORDS SETS", img: kurta },
];


const Category = () => {
  const { men, bannersFor } = useCatalog();
  const mensBanners = bannersFor("menswear");
  const menImgs = [
    mensBanners[0] || men[0]?.first,
    mensBanners[1] || men[2]?.first || men[1]?.first,
  ];
  return (
    <div>
      <div className="text-center text-2xl sm:text-3xl mt-10">
        <h1>SHOP BY CATEGORY</h1>
      </div>
      <div>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-4 sm:px-10 lg:px-20 py-8 sm:py-12">
          {categories.map((c) => (
            <li key={c.name}>
              <Link
                to="/shop"
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
              >
                <img
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={c.img}
                  alt={c.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 text-center text-white">
                  <p className="font-bold tracking-wider text-sm sm:text-lg">
                    {c.name}
                  </p>
                  <p className="flex items-center justify-center gap-1 text-xs sm:text-sm opacity-90 sm:opacity-0 sm:translate-y-2 transition-all duration-300 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                    Shop Now <FaArrowRight />
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div>
          <h1 className="text-center text-3xl sm:text-4xl mt-10 ">MENSWEAR</h1>
        </div>
        <div className="flex gap-4 sm:gap-10 text-center rounded-xl justify-center p-4 sm:p-10 ">
          <img className="w-[45%] max-w-xl aspect-[7/8] object-cover" src={menImgs[0]} alt="Menswear" />
          <img className="w-[45%] max-w-xl aspect-[7/8] object-cover" src={menImgs[1]} alt="Menswear" />
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
