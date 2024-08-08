import React from 'react';
import { useNavigate } from 'react-router-dom';
import LeftNavbar from './leftnavbar';

const Goals = () => {
  const navigate = useNavigate();

  const handlenext = (e) => {
    e.preventDefault();
    navigate('/instructor/course/course_id/manage/curriculum');
  };

  return (
    <div className='flex'>
        {/* <LeftNavbar /> */}
        <div className="p-8 md:p-24 bg-gray-50 min-h-screen w-full">
      <h1 className="text-4xl md:text-5xl mb-6 md:mb-10 font-bold text-gray-800">Intended Learners</h1>

      <div className="mb-10">
        <h2 className="text-2xl mb-2 text-gray-700">Write Your Course Learning Outcomes</h2>
        <p className="mb-4 text-gray-600">Add at least four learning outcomes</p>
        {['courseoutcome1', 'courseoutcome2', 'courseoutcome3', 'courseoutcome4'].map((name, index) => (
          <input
            key={name}
            className="border border-gray-300 rounded-md w-full md:w-[49%] mb-4 p-2 mr-2"
            name={name}
            type="text"
            placeholder={`Eg. ${[
              'Develop proficiency in problem-solving techniques.',
              'Gain understanding of foundational programming concepts.',
              'Enhance skills in effective communication strategies.',
              'Master basic principles of project management.'
            ][index]}`}
          />
        ))}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl mb-2 text-gray-700">Write Course Prerequisites</h2>
        <input
          className="border border-gray-300 rounded-md w-full md:w-[49%] mb-2 p-2"
          name="coursedesc"
          type="text"
          placeholder="Prerequisites"
        />
      </div>

      <button
        onClick={handlenext}
        className="bg-blue-500 text-white rounded-md px-6 py-2 mt-4 hover:bg-blue-600 transition-colors duration-300"
      >
        Next
      </button>
    </div>
    </div>
  );
};

export default Goals;

