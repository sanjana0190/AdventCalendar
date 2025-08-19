import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_CALENDARS } from "../graphql/mutations/calendar";
import { getUserId } from "../utils/sessionUtils";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import house from "../images/house.png";

const CalendarsList = () => {
  const userId = getUserId();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_USER_CALENDARS, {
    variables: { user_id: userId },
    skip: !userId,
  });

  if (loading) return <div className="font-body">Loading...</div>;
  if (error) return <div className="font-body">Error: {error.message}</div>;
  if (!data?.calendars?.length)
    return (
      <div className="min-h-screen bg-[#F2E5B9] p-8">
        <Header />
        <div className="text-center mt-8">
          <h2 className="text-2xl text-[#E73B0D] font-header">
            No calendars yet
          </h2>
          <button
            onClick={() => navigate("/create")}
            className="mt-4 bg-[#E73B0D] text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Create Your First Calendar
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F2E5B9] p-8">
      <Header />
      <div className="max-w-6xl mx-auto">
        <h1 className="font-header text-3xl font-bold text-[#E73B0D] mb-8">
          Your Calendars
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.calendars.map((calendar: any) => (
            <div
              key={calendar.id}
              className="bg-white/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/calendar/${calendar.id}`)}
            >
              <div className="bg-[#F2E5B9]/50 p-4">
                <img
                  src={house}
                  alt={calendar.title}
                  className="w-full h-auto object-contain transition-transform duration-300 hover:animate-wiggle"
                  style={{ maxHeight: "200px" }}
                />
              </div>
              <div className="p-4 bg-[#F2E5B9]/50">
                <h2 className="font-header text-xl font-semibold text-[#E73B0D] text-center">
                  {calendar.title}
                </h2>
                <p className="font-body text-gray-600 text-sm mt-2 text-center">
                  Created on{" "}
                  {new Date(calendar.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/create")}
            className="font-button bg-[#E73B0D] text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Create New Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarsList;
