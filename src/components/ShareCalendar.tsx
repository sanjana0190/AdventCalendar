import React, { useState } from "react";
import House from "./House";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function generateRandomLink() {
  return (
    window.location.origin +
    "/calendar/share/" +
    Math.random().toString(36).substring(2, 10)
  );
}

interface ShareCalendarProps {
  numberOfDays: number;
  windowContents: any[];
  themeId?: string;
  themeColors?: any;
}

const ShareCalendar: React.FC<ShareCalendarProps> = ({
  numberOfDays,
  windowContents,
  themeId,
  themeColors,
}) => {
  const [shareLink] = useState(generateRandomLink());
  const [oneGiftPerDay, setOneGiftPerDay] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Parse theme colors if they're stored as JSON string
  const parseThemeColors = (themeColors: any) => {
    if (typeof themeColors === "string") {
      try {
        return JSON.parse(themeColors);
      } catch (e) {
        console.error("Error parsing theme colors:", e);
        return ["#AFA276", "#D2C7A3"]; // Default colors
      }
    }
    return themeColors || ["#AFA276", "#D2C7A3"]; // Default colors
  };

  // Get theme from sessionStorage if not passed via props
  const getThemeFromStorage = () => {
    try {
      const storedTheme = sessionStorage.getItem("calendarTheme");
      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme);
        return {
          id: parsedTheme.id,
          colors: parseThemeColors(parsedTheme.colors),
        };
      }
    } catch (e) {
      console.error("Error getting theme from storage:", e);
    }
    return null;
  };

  // Use theme from props or fallback to sessionStorage
  const finalThemeId = themeId || getThemeFromStorage()?.id || "default";
  const finalThemeColors = parseThemeColors(themeColors) ||
    getThemeFromStorage()?.colors || ["#AFA276", "#D2C7A3"];

  console.log("ShareCalendar theme data:", {
    themeId,
    themeColors,
    finalThemeId,
    finalThemeColors,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F2E5B9] p-8">
      <Header />
      <div className="w-full flex flex-col items-center">
        <div
          className="text-center mt-8 rounded-lg p-8 w-full border-2 border-[#E73B0D]"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
          <div className="flex justify-end mb-6">
            <button
              onClick={() => navigate("/my-calendars")}
              className="font-button bg-[#E73B0D] text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center justify-center"
              aria-label="Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M12 3.172 2.293 12.879a1 1 0 0 0 1.414 1.414L5 13.999V20a2 2 0 0 0 2 2h3v-6h4v6h3a2 2 0 0 0 2-2v-6.001l1.293 1.294a1 1 0 1 0 1.414-1.414L12 3.172z" />
              </svg>
              <span className="sr-only">Home</span>
            </button>
          </div>
          <h2 className="font-header font-bold text-[#E73B0D] mb-4">
            Share Your Advent Calendar
          </h2>
          <p className="font-body mt-4 text-lg text-gray-700 mb-8">
            Your calendar is ready. Share it with your favorite people!
          </p>
          <div className="mb-8 flex justify-center">
            <House
              numberOfDays={numberOfDays}
              windowContents={windowContents}
              selectedWindow={-1}
              themeId={finalThemeId}
              themeColors={finalThemeColors}
              onWindowClick={() => {}}
            />
          </div>
          <div className="mb-6 flex items-center justify-center gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="p-2 border rounded-lg text-gray-700"
              style={{ maxWidth: "1000px" }}
            />
            <button
              onClick={handleCopy}
              className="bg-[#E73B0D] text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <div className="flex items-center gap-2 mb-8 justify-center">
            <input
              type="checkbox"
              id="oneGiftPerDay"
              checked={oneGiftPerDay}
              onChange={() => setOneGiftPerDay((v) => !v)}
              className="w-5 h-5 accent-[#E73B0D]"
            />
            <label
              htmlFor="oneGiftPerDay"
              className="text-lg text-gray-700 font-body"
            >
              Allow recipient to view only one gift per day
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCalendar;
