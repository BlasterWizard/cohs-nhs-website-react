import React from "react";
import ashton from "../officerpics/ashton.jpg";
import cathy from "../officerpics/cathy.jpg";
import emily from "../officerpics/emily.jpg";
import gabie from "../officerpics/gabie.jpg";
import justin from "../officerpics/justin.jpg";
import kayla from "../officerpics/kayla.jpg";
import lauren from "../officerpics/lauren.jpg";
import marjan from "../officerpics/marjan.jpg";
import mslew from "../officerpics/mslew.jpg";
import profile from "../officerpics/profile.jpg";
import rhianna from "../officerpics/rhianna.jpg";
import sadie from "../officerpics/sadie.jpg";
import sammy from "../officerpics/sammy.jpg";
import sophia from "../officerpics/sophia.jpg";

const Officers = () => {
  return (
    <main>
      <h2 className="text-4xl font-bold">Officers</h2>

      <div className="space-y-10 flex flex-col items-center">
        <h3 className="text-2xl font-bold mt-3">Advisors</h3>

        <div className="flex items-center space-x-10 bg-white/60 p-5 rounded-lg">
          <div className="flex flex-col items-center">
            <h5 className="font-bold">Ms. Chase</h5>
            <h6 className="position">Advisor</h6>
          </div>

          <div className="flex flex-col items-center">
            <h5 className="font-bold">Mr. Summers</h5>
            <h6>Co-Advisor</h6>
          </div>
        </div>

        <h3 className="text-2xl font-bold">Junior Officers</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-10 lg:grid-cols-3 space-y-10 bg-white/60 p-20 rounded-lg">
          <div className="flex flex-col items-center mt-10">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={kayla} alt="Kayla" />
            <h5 className="font-bold">Kayla Ha</h5>
            <h6 className="position">President</h6>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={justin} alt="Justin" />
            <h5 className="font-bold">Justin Wong</h5>
            <h6 className="position">Vice President & Webmaster</h6>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={lauren} alt="Lauren" />
            <h5 className="font-bold">Lauren Kimura</h5>
            <h6 className="position">Project Secretary</h6>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={emily} alt="Emily" />
            <h5 className="font-bold">Emily Wu</h5>
            <h6 className="position">Attendance Secretary</h6>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={cathy} alt="Cathy" />
            <h5 className="font-bold">Cathy Liu</h5>
            <h6 className="position">Treasurer</h6>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={ashton} alt="Ashton" />
            <h5 className="font-bold">Ashton Simbol</h5>
            <h6 className="position">Public Relations</h6>
          </div>
        </div>

        <h3 className="text-2xl font-bold">Executive Council</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-10 lg:grid-cols-3 space-y-10 bg-white/60 p-20 rounded-lg">
          <div className="flex flex-col items-center mt-10">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={gabie} alt="Gabrielle" />
            <h5>Gabrielle Bambalan</h5>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={rhianna} alt="Rhianna" />
            <h5>Rhianna Daquis</h5>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={sadie} alt="Sadie" />
            <h5>Sadie Sodergren</h5>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={sammy} alt="Sammy" />
            <h5>Sammy Chew</h5>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={sophia} alt="Sophia" />
            <h5>Sophia Lao</h5>
          </div>
          <div className="flex flex-col items-center">
            <img className="object-cover rounded-full sm:w-60 sm:h-60" src={marjan} alt="Marjan" />
            <h5>Marjan Omar</h5>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Officers;
