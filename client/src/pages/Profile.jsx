import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: "600px",
          margin: "1.5rem auto",
          padding: "0 1rem",
        }}
      >
        <div className="card">
          <h2>My Profile 🌱</h2>

          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            {user?.isAdmin ? "Admin" : "User"}
          </p>

          <button
            className="button-primary"
            onClick={logout}
            style={{ marginTop: "1rem" }}
          >
            Logout
          </button>
        </div>
      </main>
    </>
  );
};

export default Profile;
