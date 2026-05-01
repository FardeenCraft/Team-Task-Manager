import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import AddTask from "./pages/AddTask";
import AddProject from "./pages/AddProject";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboards */}
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        <Route path="/dashboard-member" element={<MemberDashboard />} />

        {/* Actions */}
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/add-project" element={<AddProject />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;