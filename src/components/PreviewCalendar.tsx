import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_CALENDAR_DAYS,
  GET_CALENDAR_DETAILS,
} from "../graphql/queries/calendar";
import House from "./House";
import {
  getCurrentCalendarId,
  setCurrentCalendarId,
} from "../utils/sessionUtils";
import { WindowContent } from "../types/calendar";
import Header from "./Header";
import { getThemeColors } from "../utils/constants";

const PreviewCalendar = () => {
  const { calendarId: urlCalendarId } = useParams<{ calendarId?: string }>();
  const sessionCalendarId = getCurrentCalendarId();
  const calendarId = urlCalendarId || sessionCalendarId;

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Set the calendar ID in session storage if it came from URL
  if (urlCalendarId && urlCalendarId !== sessionCalendarId) {
    setCurrentCalendarId(urlCalendarId);
  }

  // Query for calendar details
  const { data: calendarData } = useQuery(GET_CALENDAR_DETAILS, {
    variables: { id: calendarId },
    skip: !calendarId,
  });

  // Query for specific day when selected
  const { data: selectedDayData } = useQuery(GET_CALENDAR_DAYS, {
    variables: {
      calendar_id: calendarId,
      day_number: selectedDay || 0,
    },
    skip: !calendarId || !selectedDay,
  });

  const handleWindowClick = (day: number) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const windowContents: WindowContent[] = Array(
    calendarData?.calendars[0]?.num_days || 0
  )
    .fill(null)
    .map((_, index) => ({
      day: index + 1,
      title: "",
      description: "",
      imageUrl: undefined,
      link: undefined,
    }));

  const selectedDayContent = selectedDayData?.calendar_days[0];

  const handleShareCalendar = () => {
    const themeId = calendarData.calendars[0]?.theme_id;
    navigate("/share", {
      state: {
        numberOfDays: calendarData.calendars[0]?.num_days || 0,
        windowContents,
        themeId: themeId,
        themeColors: getThemeColors(themeId),
      },
    });
  };

  if (!calendarData) {
    return (
      <div className="min-h-screen bg-[#F2E5B9] p-8 flex items-center justify-center">
        <div className="font-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2E5B9] p-8">
      <Header />
      <div
        className="rounded-lg p-8 w-full border-2 border-[#E73B0D]"
        style={{ minHeight: "calc(100vh - 160px)" }}
      >
        <h1 className="font-header text-center mb-8 text-[#E73B0D] text-3xl font-extrabold">
          {calendarData.calendars[0]?.title || "Advent Calendar"}
        </h1>

        <div className="flex justify-center">
          <House
            numberOfDays={calendarData.calendars[0]?.num_days || 0}
            onWindowClick={handleWindowClick}
            windowContents={windowContents}
            selectedWindow={selectedDay || 1}
            isPreview={true}
            themeId={calendarData.calendars[0]?.theme_id}
            themeColors={getThemeColors(calendarData.calendars[0]?.theme_id)}
          />
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleShareCalendar}
            className="font-button bg-[#E73B0D] text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Share Calendar
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedDayContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-[#E73B0D] font-header">
              {selectedDayContent.title}
            </h2>
            <p className="font-body text-gray-700 mb-4">
              {selectedDayContent.description}
            </p>

            {selectedDayContent.image_url && (
              <div className="w-full flex justify-center">
                <img
                  src={selectedDayContent.image_url}
                  alt={selectedDayContent.title}
                  className="max-h-[60vh] w-auto object-contain rounded-lg mb-4"
                />
              </div>
            )}

            {selectedDayContent.link_url && (
              <a
                href={selectedDayContent.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-link text-[#E73B0D] hover:underline"
              >
                Click here to learn more
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewCalendar;
