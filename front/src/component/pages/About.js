import React from 'react';
import kidan from "../../asset/kidan.png";

function About() {
  return (
    <section className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg shadow-lg">
      <article className="w-full flex flex-col lg:flex-row gap-8 items-center justify-evenly">
        <div className="text-center lg:text-left lg:w-2/3 space-y-4">
          <h1 className="text-2xl font-bold text-cyan-900">About the Project</h1>
          <p className="text-lg text-gray-700">
            This school management system is designed and developed by full-stack developer Gebrekidan Mequanint.
            It provides an efficient platform for managing profiles, assessments, and communication within the school community.
          </p>
          <button 
            className="mt-4 px-6 py-2 bg-cyan-900 text-white font-semibold rounded-lg  hover:bg-yellow-700 transition duration-500 shadow-md"
            onClick={() => window.location.href = 'mailto:gebrekidan@example.com'}
          >
            Contact Me
          </button>
        </div>
        <img 
          src={kidan} 
          className="w-36 shadow-md" 
          alt="Portrait of Gebrekidan Mequanint" 
        />
      </article>

      <hr className="my-6 border-t border-cyan-300"/>

      <div className="ml-4 mt-6">
        <h2 className="text-xl font-semibold text-cyan-800">Key Features</h2>
        <ul className="ml-6 mt-4 space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Profiles for students, parents, teachers, and admins
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Assessment results management by teachers
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Student count and tracking
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Class organization by grade and section
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Teacher dashboard for student result management
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Student and parent portals for viewing results
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Director dashboard for managing registrations and staff
          </li>
        </ul>
      </div>
    </section>
  );
}

export default About;
