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
          Nirvana is a platform where people can share and explore articles, blogs,
          photos, videos, audio and books to help each other grow in the journey
          of discovering the self.
        </p>

        <p>
          It is a content sharing and messaging platform where people can find and share meaningful
          thoughts and experiences to move forward on the path of enlightenment.
          Many people walk on the path to discover themselves in the search for nirvana,
          this platform is designed for those people to find other dedicated people, connect
          with them and find some spiritual content to grow in their journey of discovering 
          the truth.
    
        </p>

        <h3 style={{ marginTop: "1.5rem" }}>✨ Key Features</h3>
        <ul>
          <li>Create and share posts (text, images, videos, audio, PDFs)</li>
          <li>Rate content using a 5-star system</li>
          <li>Infinite scrolling feed</li>
          <li>Private chats section</li>
          <li>Dark & light modes</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}>🚀 Built for</h3>
        <ul>
          <li>Uplifting Consciousness</li>
          <li>Discovering truth, nirvana, salvation, moksha or enlightenment</li>
          <li>Helping each other</li>
          <li>Growing together</li>
        </ul>

        <p style={{ marginTop: "1.5rem", fontStyle: "italic" }}>
          “Enlightenment is not an achievement, it is an understanding that there
          is nothing to achieve, nowhere to go.” - osho
        </p>
      </main>
    </>
  );
};

export default About;
