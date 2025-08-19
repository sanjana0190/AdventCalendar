import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_CALENDARS } from "../graphql/queries/calendar";
import Header from "./Header";
import housePreview from "../images/1WindowHouse.png";
import { setCurrentCalendarId } from "../utils/sessionUtils";

const MyCalendars = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  const { data, loading, error } = useQuery(GET_USER_CALENDARS, {
    variables: { user_id: userId },
    skip: !userId,
  });

  if (!userId) {
    return (
      <div className="text-center mt-12 text-lg font-body">
        Please log in to view your calendars.
      </div>
    );
  }
  if (loading) return <div className="font-body">Loading...</div>;
  if (error) return <div className="font-body">Error loading calendars.</div>;

  const calendars = data?.calendars || [];

  const handleCalendarClick = (calendar: any) => {
    setCurrentCalendarId(calendar.id);
    navigate(`/preview/${calendar.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F2E5B9] p-8">
      <Header />

      <div
        className="rounded-lg p-8 border-2 border-[#E73B0D]"
        style={{ minHeight: "calc(100vh - 160px)" }}
      >
        {/* Header section with title and button */}
        <div className="relative mb-8">
          <h2 className="font-header text-2xl font-bold text-[#E73B0D] text-center">
            My Calendars
          </h2>
          <button
            onClick={() => navigate("/create")}
            className="font-button bg-[#E73B0D] text-white px-6 py-2 rounded-lg hover:opacity-90 absolute right-0 top-0"
          >
            + CREATE CALENDAR
          </button>
        </div>

        {/* Calendars list - responsive centered layout */}
        <div className="w-full">
          <div className="flex flex-wrap justify-center gap-16 mx-auto">
            {calendars.map((calendar: any) => (
              <div
                key={calendar.id}
                className="flex flex-col items-center cursor-pointer group w-[16rem]"
                onClick={() => handleCalendarClick(calendar)}
              >
                <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={housePreview}
                    alt="Calendar Preview"
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-200 group-hover:animate-wiggle"
                  />
                </div>
                <div className="text-xl font-extrabold mb-2 font-body text-[#E73B0D] text-center">
                  {calendar.title}
                </div>
                <div className="text-sm text-gray-600 mb-2 font-body">
                  {calendar.num_days} days
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCalendars;
