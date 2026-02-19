import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: "700px",
          margin: "2rem auto",
          padding: "0 1rem",
          lineHeight: "1.7",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>About Nirvana 🌿</h1>

        <p>
          Nirvana is a mindful content-sharing platform where users can post
          thoughts, articles, media, and books in a clean and distraction-free
          environment.
        </p>

        <p>
          The goal of Nirvana is simple — to create a peaceful digital space
          where ideas matter more than noise. Users can share meaningful
          content, rate posts, and explore knowledge without unnecessary
          clutter.
        </p>

        <h3 style={{ marginTop: "1.5rem" }}>✨ Key Features</h3>
        <ul>
          <li>Create and share posts (text, images, videos, audio, PDFs)</li>
          <li>Rate content using a 5-star system</li>
          <li>Infinite scrolling feed</li>
          <li>Clean and minimal UI</li>
          <li>Role-based permissions (user/admin)</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}>🚀 Built With</h3>
        <ul>
          <li>React.js (Frontend)</li>
          <li>Node.js & Express (Backend)</li>
          <li>MongoDB (Database)</li>
          <li>JWT Authentication</li>
        </ul>

        <p style={{ marginTop: "1.5rem", fontStyle: "italic" }}>
          “Nirvana is not just an app — it’s a calm corner of the internet.”
        </p>
      </main>
    </>
  );
};

export default About;
