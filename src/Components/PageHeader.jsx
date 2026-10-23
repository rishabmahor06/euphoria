import React from "react";

const PageHeader = ({ title, subtitle }) => (
  <div className="bg-[#1E381E] text-white text-center px-4 py-10 sm:py-16">
    <h1 className="text-3xl sm:text-5xl tracking-wide">{title}</h1>
    {subtitle && (
      <p className="mt-3 text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

export default PageHeader;
