import React, { useState, useEffect } from "react";
import { FaCopy, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

function SafariTour({ tourId, userId }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
const [pointToDelete, setPointToDelete] = useState(null);

  const [points, setPoints] = useState([]);
  const [newPoint, setNewPoint] = useState({ tourId, userId, description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (tourId && userId) {
      fetch(`http://localhost:8080/api/safari/points/${tourId}/${userId}`)
        .then((res) => res.json())
        .then(setPoints)
        .catch(console.error);
    }
  }, [tourId, userId]);

  const addPoint = () => {
    if (!newPoint.description.trim()) return alert("Description can't be empty");
    fetch("http://localhost:8080/api/safari/point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPoint),
    })
      .then((res) => res.json())
      .then((savedPoint) => {
        setPoints((prev) => [...prev, savedPoint]);
        setNewPoint({ ...newPoint, description: "" });
      })
      .catch(console.error);
  };

  const deletePoint = (id) => {
    fetch(`http://localhost:8080/api/safari/point/${id}`, { method: "DELETE" })
      .then(() => setPoints((prev) => prev.filter((p) => p.id !== id)))
      .catch(console.error);
  };

  const generateCaption = () => {
  if (!imageFile && points.length === 0) {
    return alert("Add points and/or select an image to generate a caption.");
  }

  if (imageFile && imageFile.size > 5 * 1024 * 1024) {
    return alert("Image size must be less than 5MB.");
  }

  setLoadingCaption(true);

  const formData = new FormData();
  if (imageFile) formData.append("file", imageFile);
  formData.append("points", JSON.stringify(points.map((p) => p.description)));

  fetch("http://localhost:8080/api/safari/image-caption", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then(async (data) => {
      setCaption(data?.caption || "No caption received.");

      // 🧹 Delete points from the database
      await fetch(
        `http://localhost:8080/api/safari/points/${tourId}/${userId}`,
        { method: "DELETE" }
      );

      // The useEffect will re-fetch and clear the list automatically
      setLoadingCaption(false);
    })
    .catch((err) => {
      console.error(err);
      setCaption("Try Again!");
      setLoadingCaption(false);
    });
};


  const shareOn = (platform) => {
    if (!caption) return alert("Generate a caption first.");

    const encoded = encodeURIComponent(caption);
    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encoded}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?quote=${encoded}`;
        break;
      case "instagram":
        alert("Instagram does not support direct text sharing. Please copy the caption manually.");
        return;
      default:
        return;
    }

    window.open(url, "_blank");
  };

  const containerStyle = {
    position: "relative",
    maxWidth: 800, // Adjust width as needed
    margin: "0 auto",
   
    padding: 50,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    border: "2px solid #d6c9f2",
    boxShadow: "0 4px 20px rgba(123, 47, 247, 0.5)",
    zIndex: 1,
    
  };

  const headerStyle = {
    fontSize: isMobile ? "1rem" : "1.6rem",
    
    color: "#7b2ff7",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  };

  const subHeaderStyle = {
    color: "#333",
    fontSize: isMobile ? "0.8rem" : "1rem",
    marginTop: 8,
    marginBottom: 40,
    fontWeight: "500",
    textAlign: "center",
    fontStyle: "italic"
  };

  const listItemStyle = {
    marginBottom: 8,
    padding: "8px 12px",
    backgroundColor: "#f0e6ff",
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: isMobile ? 14 : 16,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        AI Caption Generator powered by
        <img
          src="/assets/gemini.png"
          alt="Gemini"
          style={{ height: isMobile ? 18 : 22 }}
        />
      </div>

      {/* Subheader */}
      <div style={subHeaderStyle}>Generate your own caption</div>

      {/* Safari Points */}
      <div>
        {/* Point List */}
        <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
          {points.map((p) => (
            <li key={p.id} style={listItemStyle}>
              <span>{p.description}</span>
              
              <button
  onClick={() => {
    setPointToDelete(p.id);
    setShowConfirm(true);
  }}
  style={{
    background: "transparent",
    border: "none",
    color: "#e63946",
    fontWeight: "bold",
    fontSize: 18,
    cursor: "pointer",
  }}
>
  &times;
</button>


            </li>
          ))}
        </ul>
        <div
  style={{
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: 10,
    marginTop: 10,
  }}
>
  <input
    type="text"
    placeholder="Add a special moment"
    value={newPoint.description}
    onChange={(e) =>
      setNewPoint({ ...newPoint, description: e.target.value })
    }
    style={{
      flex: 1,
      padding: isMobile ? 8 : 12,
      borderRadius: 8,
      border: "2px solid #7b2ff7",
      fontSize: isMobile ? 14 : 16,
      marginTop:isMobile?4:4,
      marginBottom:isMobile?3:4,
    }}
  />
  <button
    onClick={addPoint}
    style={{
      whiteSpace: "nowrap",
      backgroundColor: "#7b2ff7",
      color: "white",
      padding: isMobile ? 8 : 20,
      borderRadius: 8,
      fontWeight: "bold",
      fontSize: isMobile ? 11 : 16,
      border: "none",
      cursor: "pointer",
    }}
  >
    Add
  </button>
</div>


        
      </div>

      {/* Image Upload */}
      <div style={{ marginTop: 25,textAlign:"center" }}>
       <label style={{color: "#7b2ff7", fontStyle: "italic",marginRight:"30px",marginLeft:"20px",marginBottom:"10px"}}>Select an Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <small style={{ color: "orange", fontStyle: "italic" }}>
          Max size 5MB
        </small>
      </div>

      {/* Generate Caption */}
      <button
        onClick={generateCaption}
        disabled={loadingCaption}
        style={{
          marginTop: 30,
          backgroundColor: "#7b2ff7",
          color: "white",
          width: "100%",
          padding: isMobile ? 10 : 14,
          fontSize: isMobile ? 14 : 16,
          borderRadius: 8,
          border: "none",
          fontWeight: "bold",
          cursor: loadingCaption ? "not-allowed" : "pointer",
        }}
      >
        {loadingCaption ? "Generating..." : "Generate Caption"}
      </button>

      {/* Caption Output */}
      {caption && (
        <div
          style={{
            marginTop: 20,
            backgroundColor: "#fdfcff",
            borderRadius: 12,
            padding: 16,
            border: "2px solid #e2d6fa",
            boxShadow: "0 4px 12px rgba(123, 47, 247, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <strong style={{ fontSize: isMobile ? 16 : 18 }}>
              Your Safari Post
            </strong>
            <div style={{ textAlign: "right" }}>
              <button
               onClick={() => {
  navigator.clipboard.writeText(caption).then(() => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000); // hide after 2s
  });
}}

                title="Copy Caption"
                style={{
                  background: "none",
                  border: "none",
                  color: "#6a0dad",
                  fontSize: isMobile ? 18 : 20,
                  cursor: "pointer",
                }}
              >
                <FaCopy />
              </button>
              <div
                style={{
                  fontSize: 10,
                  color: "#999",
                  marginTop: 2,
                }}
              >
                Copy Caption
              </div>
            </div>
          </div>
                {copySuccess && (
  <div
    style={{
      marginTop: 6,
      backgroundColor: "#7c0460ff",
      color: "#f6f1f5ff",
      padding: "8px 10px",
      borderRadius: 6,
      fontSize: 15,
      fontWeight: "500",
      border: "1px solid #f9f4f9ff",
      width: "fit-content",
      marginLeft: "auto",
    }}
  >
    ✅ Caption copied!
  </div>
)}

          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Uploaded"
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 12,
              }}
            />
          )}

          <p
            style={{
              background: "#f0e6ff",
              padding: 12,
              borderRadius: 10,
              fontStyle: "italic",
              whiteSpace: "pre-wrap",
              boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)",
            }}
          >
            {caption}
          </p>

          {/* Share Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 12,
              gap: 50,
            }}
          >
            <button
              onClick={() => shareOn("whatsapp")}
              title="WhatsApp"
              style={{
                backgroundColor: "#25D366",
                borderRadius: "50%",
                width: 42,
                height: 42,
                color: "white",
                fontSize: 20,
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <FaWhatsapp />
            </button>
            <button
              onClick={() => shareOn("facebook")}
              title="Facebook"
              style={{
                backgroundColor: "#046bf3ff",
                borderRadius: "50%",
                width: 42,
                height: 42,
                color: "white",
                fontSize: 20,
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <FaFacebookF />
            </button>
            <button
              onClick={() => shareOn("instagram")}
              title="Instagram"
              style={{
                background:
                  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                borderRadius: "50%",
                width: 42,
                height: 42,
                color: "white",
                fontSize: 20,
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <FaInstagram />
            </button>
          </div>
        </div>
      )}
      {showConfirm && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        maxWidth: 320,
        textAlign: "center",
      }}
    >
      <p style={{ fontWeight: "bold", marginBottom: 20 }}>
        Are you sure you want to delete this point?
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        <button
          onClick={() => {
            deletePoint(pointToDelete);
            setShowConfirm(false);
          }}
          style={{
            backgroundColor: "#fa0834ff",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
           Delete
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            setPointToDelete(null);
          }}
          style={{
            backgroundColor: "#ccc",
            color: "#333",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default SafariTour;
