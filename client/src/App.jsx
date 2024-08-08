import React, { useState, useEffect } from "react";
import Register from "./pages/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./utils/scrollToTop";
import Home from "./pages/home";
import Login from "./pages/login";
import Logout from "./pages/logout";
import ErrorPage from "./pages/errorPage";
import TwoFactorSetup from "./pages/TwoFactorSetup";
import Courses from "./pages/courses";
import CourseVideos from "./pages/courseVideos";
import CourseDetailsPage from "./pages/coursedetails";
import CreateCourse from "./pages/instructor/createcourse";
import Goals from "./pages/instructor/goals";
import Curriculum from "./pages/instructor/curriculum";
import Quesionnaire from "./pages/certificationTest/quesionnaire";
import CourseEditor from "./pages/instructor/courseEditor";
import SetQuestions from "./pages/instructor/setQuestions";
import EditQuestionsPage from "./pages/instructor/editQuestions";
import TeacherDetails from "./pages/instructor/details";
import Dashboard from "./pages/Profile/dashboard";
import EditProfile from "./pages/Profile/editprofile";
import Chat from "./pages/chat/chat";
import UploadedCourses from "./pages/Profile/teacher/uploadedCourses";

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setToken(token);
      localStorage.setItem("token", token);
    }
  }, []);
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/2fa/setup" element={<TwoFactorSetup token={token} />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:course_id/videos" element={<CourseVideos />} />
        <Route path="/coursedetails/:id" element={<CourseDetailsPage />} />
        <Route path="/create/course" element={<CreateCourse />} />
        <Route path="/instructor/course/:course_id/manage/goals" element={<Goals />} />
        <Route path="/instructor/course/:course_id/manage/curriculum" element={<Curriculum />} />
        <Route path="/instructor/editCourse/:course_id" element={< CourseEditor/>}/>
        <Route path="/instructor/setQuestions/:course_id" element={<SetQuestions />} />
        <Route path="/instructor/updateQuestions/:course_id" element={<EditQuestionsPage />} />
        <Route path="/questionnaire/:course_id" element={<Quesionnaire />} />
        <Route path="/instructor/:teacher_id/details" element={<TeacherDetails />} />
        <Route path="/profile/dashboard" element={<Dashboard />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/uploaded-courses" element={<UploadedCourses />} />
        <Route path="/profile/chat/:id" element={<Chat />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
