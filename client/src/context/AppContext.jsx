import React, { createContext, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Create AppContext
export const AppContext = createContext();

// AppContextProvider Component
const AppContextProvider = (props) => {
  const [credit, setCredit] = useState(0);
  const [image, setImage] = useState(null);             // Uploaded image
  const [resultImage, setResultImage] = useState(null); // Processed image
  const backendUrl = import.meta.env.VITE_BACKEND_URI;

  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser(); // ✅ Fix: user and isSignedIn
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  // Load user credits securely from backend
  const loadCreditsData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Missing authentication token.");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCredit(data.credits);
        console.log("Credits loaded:", data.credits);
      } else {
        toast.warning(data.message || "Could not load credits.");
      }
    } catch (error) {
      console.error("Error loading credits:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to load credits");
    }
  };

  // Upload image and send to backend for background removal
  const removeBg = async (imageFile) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }

      const token = await getToken();
      if (!token) {
        toast.error("Please sign in first.");
        return;
      }

      setImage(imageFile);
      setResultImage(null);
      navigate("/result");

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("clerkId", user.id); // ✅ Required for backend validation

      const response = await axios.post(`${backendUrl}/api/image/remove-bg`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      if (data.success) {
        setResultImage(data.resultImage);
        if (data.creditBalance !== undefined) {
          setCredit(data.creditBalance);
        }
        toast.success("Background removed successfully!");
      } else {
        if (data.creditBalance !== undefined) {
          setCredit(data.creditBalance);
        }
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
        toast.error(data.message || "Background removal failed.");
      }
    } catch (error) {
      console.error("Error removing background:", error);
      toast.error("Something went wrong while removing background.");
    }
  };

  // Context Value
  const contextValue = {
    credit,
    setCredit,
    loadCreditsData,
    backendUrl,
    image,
    setImage,
    resultImage,
    setResultImage,
    removeBg,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
