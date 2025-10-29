import Navbar from "./Navbar";
import Footer from "./Footer";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { woomen } from "../Data/women";
import { CiCircleList, CiGrid41 } from "react-icons/ci";

const women = () => {
  return (
    <div>
      <Navbar />
      <div className="pr-2 px-5">
        <div className="pb-6 pt-2">
          <div className="flex gap-2">
            <h1>Home</h1>
            <h1>women</h1>
          </div>
          <div className="pt-10 flex justify-between">
            <div className="flex gap-5">
              <h3 className="flex gap-1 ">
                Category
                <MdKeyboardArrowDown className=" mt-1" />
              </h3>
              <div className=" ml-5 w-56 border hidden border-gray-600 bg-white rounded-lg p-2">
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">Kurta Sets </span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">Sarees & Blouses</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">Lehenga Sets</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">Kaftans</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">Gowns</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">Dresses & Jumpsuits</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">Co-Ord Sets</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">Vanna Sets</span>
                </p>
              </div>

              <h3 className="flex gap-1">
                Price
                <MdKeyboardArrowDown className=" mt-1" />
              </h3>
              <div className="ml-5 w-56 border hidden  border-gray-600 bg-white rounded-lg p-2">
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">1000-10000</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">10000-50000</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">50000-100000</span>
                </p>
                <p>
                  <input type="checkbox" className="ml-5" />
                  <span className="ml-5">100000-200000</span>
                </p>
              </div>

              <div>
                <h3 className="flex  gap-1">
                  Color
                  <MdKeyboardArrowDown className=" mt-1" />
                </h3>
                <div className="hidden ml-5 w-56 border border-gray-600 bg-white rounded-lg p-2">
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Red</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Blue</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Green</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Yellow</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Pink</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Black</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">White</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Beige</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Purple</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="flex gap-1">
                  Size
                  <MdKeyboardArrowDown className=" mt-1" />
                </h3>
                <div className="hidden ml-5 w-56 border border-gray-600 bg-white rounded-lg p-2">
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">XS</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">S</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">M</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">L</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">XL</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">XXL</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="flex gap-1">
                  Brand
                  <MdKeyboardArrowDown className=" mt-1" />
                </h3>
                <div className="hidden ml-5 w-56 border border-gray-600 bg-white rounded-lg p-2">
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">FabIndia</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Biba</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">W for Women</span>
                  </p>
                  <p>
                    <input type="checkbox" className="ml-5" />
                    <span className="ml-5">Manish Malhotra</span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-3 justify-center items-center">
                <h1>14Result</h1>
                <CiGrid41 className="text-lg h-7 w-7 rounded-md px-1 py-1 border border-gray-600 hover:bg-[#F3F4F6]" />

                <CiCircleList className="text-lg h-7 w-7 rounded-md px-1 py-1 border border-gray-600 hover:bg-[#F3F4F6]" />
                <div>
                  <h3 className="flex justify-center items-center gap-1">
                    Sort by: <MdKeyboardArrowDown className=" mt-1 " />
                  </h3>
                  <div className=" ml-5 w-52 border hidden border-gray-600 bg-white rounded-lg p-2">
                    <p className="py-1 hover:bg-[#F3F4F6]">
                      <span className="ml-5">Price: Low to High</span>
                    </p>
                    <p className="py-1 hover:bg-[#F3F4F6]">
                      <span className="ml-5">Price: High to Low </span>
                    </p>
                    <p className="py-1 hover:bg-[#F3F4F6]">
                      <span className="ml-5">Newest Arrivals </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <hr />

        <div>
          <div className=" px-4 py-10 w-full h-full">
            <div className="grid grid-cols-4 gap-1 justify-center  ">
              {woomen.map((img) => (
                <div key={img.id} className="">
                  <div className="relative w-[22rem] h-[35vw]  group overflow-hidden cursor-pointer">
                    <Link
                      to={`/productdetails/${img.title.replace(/\s+/g, "-")}/${
                        img.id
                      }`}
                    >
                      <img
                        src={img.first}
                        className="absolute w-full inset-0 h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                        alt="Craft 1"
                      />
                      <img
                        src={img.second}
                        className="absolute inset-0  h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                        alt="Craft 2"
                      />
                    </Link>
                  </div>
                  <div className="text-left mt-2">
                    <h2 className="text-lg font-semibold">{img.title}</h2>
                    <p className="text-green-900 font-bold">₹ {img.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default women;
