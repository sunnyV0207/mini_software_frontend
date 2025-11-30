import React, { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"
import Swal from "sweetalert2"

const AddClass = () => {
const {schoolCode} = useParams();
const navigate = useNavigate()

  const [classNumber, setClassNumber] = useState("");
  const [section, setSection] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);

  const addSubject = () => {
    if (subjectInput.trim() !== "" && !subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const removeSubject = (subject) => {
    setSubjects(subjects.filter((sub) => sub !== subject));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const classData = {
      classNumber,
      section,
      subjects
    };

    console.log("Final Class Data:", classData);

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/school/${schoolCode}/add-class`,classData)
    .then((res)=>{
        // console.log(res)
        navigate('/school')
    })
    .catch((err)=>{
        console.log(err)
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: err.response.data.message
        })
    })
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-100 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 md:p-10">
        
        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Class
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* CLASS NUMBER */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Class Number
            </label>
            <select
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Class</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Section</option>
              {["A", "B", "C", "D"].map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT INPUT */}
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Add Subjects
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="Enter subject name"
                className="flex-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addSubject}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <FaPlus /> Add
              </button>
            </div>

            {/* SUBJECT LIST */}
            <div className="flex flex-wrap gap-3 mt-4">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                >
                  {subject}
                  <FaTimes
                    onClick={() => removeSubject(subject)}
                    className="cursor-pointer hover:text-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Save Class
          </button>
        </form>
      </div>
    </div>
  );
};

export {AddClass};
