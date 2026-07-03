import React from "react";

const OutlinedButton = ({text} : any) => {
  return (
    <>
      <div className="text-center mt-10">
        <a
          href="#"
          className="inline-block border border-heading/30 text-heading px-8 sm:px-10 py-3 sm:py-3.5 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-heading hover:text-white transition-all duration-400"
        >
         {text}
        </a>
      </div>
    </>
  );
};

export default OutlinedButton;
