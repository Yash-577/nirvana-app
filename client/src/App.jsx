import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import AdminDashboard from "./pages/AdminDashboard";
import Chats from "./pages/Chats";
import ChatRoom from "./pages/ChatRoom";
import About from "./pages/About";
import Edit from "./pages/Edit";


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user?.isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
   
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/edit/:id" element={<Edit />} />


          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
  path="/chats"
  element={
    <PrivateRoute>
      <Chats />
    </PrivateRoute>
  }
/>

<Route
  path="/chats/:chatId"
  element={
    <PrivateRoute>
      <ChatRoom />
    </PrivateRoute>
  }
/>

        </Routes>
      </Router>
   
  );
}

export default App;
