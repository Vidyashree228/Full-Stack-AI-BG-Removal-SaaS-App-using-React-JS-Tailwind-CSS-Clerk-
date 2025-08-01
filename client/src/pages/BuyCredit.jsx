import React, { useContext, useEffect, useState } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const BuyCredit = () => {
  const { backendUrl, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);

  // Load Razorpay script on component mount
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const initPay = async (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Please refresh the page.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const token = await getToken();

          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razor`,
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (data.success) {
            await loadCreditsData();
            navigate("/");
            toast.success("Credits added successfully!");
          } else {
            toast.error(data.message || "Payment verification failed.");
          }
        } catch (error) {
          console.log("Verification error: ", error);
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Error verifying payment."
          );
        } finally {
          setLoading(false);
        }
      },
      // Optional: You can add prefill, theme, etc here
    };

    const rzp = new window.Razorpay(options);

    // Add failure handler
    rzp.on("payment.failed", (response) => {
      toast.error("Payment failed or cancelled.");
      console.error("Payment failed:", response.error);
      setLoading(false);
    });

    rzp.open();
  };

  const paymentRazorPay = async (planId) => {
    try {
      setLoading(true);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-razor`,
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        initPay(data.order);
      } else {
        setLoading(false);
        toast.error(data.message || "Failed to create order.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Payment error: ", error);
      toast.error(
        error.response?.data?.message || error.message || "Payment error."
      );
    }
  };

  return (
    <div className="min-h-[82vh] text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold mt-4 bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-8 sm:mb-10">
        Choose the plan that's right for you
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500"
            key={index}
          >
            <img src={assets.logo_icon} alt="" />
            <p className="mt-3 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price}</span>/{" "}
              {item.credits} credits
            </p>
            <button
              onClick={() => paymentRazorPay(item.id)}
              className="w-full text-white text-sm mt-8 bg-gray-800 rounded-md min-w-52 py-2.5"
              disabled={loading}
            >
              {loading ? "Processing..." : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredit;
