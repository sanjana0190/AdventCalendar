import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { WindowContent } from "../types/calendar";
import House from "./House";
import WindowEditPanel from "./WindowEditPanel";
import Header from "./Header";
import { CREATE_CALENDAR_DAY } from "../graphql/mutations/calendar";
import { getCurrentCalendarId } from "../utils/sessionUtils";

interface LocationState {
  numberOfDays: number;
  title: string;
  calendarId: string;
}

const EditCalendar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { numberOfDays } = location.state as LocationState;
  const [selectedWindow, setSelectedWindow] = useState<number | null>(1);
  const [windowContents, setWindowContents] = useState<WindowContent[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const theme = location.state?.theme;
  //const theme= JSON.parse(sessionStorage.getItem("calendarTheme") || "null");

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

  // Initialize the create calendar day mutation
  const [createCalendarDay] = useMutation(CREATE_CALENDAR_DAY);

  const checkAllWindowsFilled = () => {
    return (
      windowContents.length === numberOfDays &&
      windowContents.every(
        (content) =>
          content.title.trim() !== "" && content.description.trim() !== ""
      )
    );
  };

  const handleWindowClick = (day: number) => {
    setSelectedWindow(day);
  };

  const handleSaveWindow = async (content: WindowContent) => {
    const calendarId = getCurrentCalendarId();

    if (!calendarId) {
      console.error("No calendar ID found in session");
      return;
    }

    try {
      let imageUrl = content.imageUrl;

      // No S3 upload logic here; just use the imageUrl from content

      // Call the create calendar day mutation
      const { data } = await createCalendarDay({
        variables: {
          calendar_id: calendarId,
          title: content.title,
          description: content.description,
          day_number: content.day,
          image_url: imageUrl,
          link_url: content.link || null,
        },
      });

      if (data?.insert_calendar_days_one?.id) {
        setWindowContents((prev) => {
          const newContents = [...prev];
          const index = newContents.findIndex((w) => w.day === content.day);
          if (index >= 0) {
            newContents[index] = { ...content, imageUrl };
          } else {
            newContents.push({ ...content, imageUrl });
          }
          return newContents;
        });

        const allFilled = checkAllWindowsFilled();
        if (allFilled) {
          setIsComplete(true);
          setSelectedWindow(null);
          navigate("/preview");
        } else if (selectedWindow !== null && selectedWindow < numberOfDays) {
          setSelectedWindow(selectedWindow + 1);
        }
      }
    } catch (error) {
      console.error("Error in handleSaveWindow:", error);
    }
  };

  return (
    <div className="m-h-screen bg-[#F2E5B9]  p-8 flex flex-col items-center">
      <div className="w-full">
        <Header />

        <div
          className="mt-8 w-full flex items-stretch gap-6"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
          {/* Left: bordered area with header + house */}
          <div className="flex-1 rounded-lg border-2 border-[#E73B0D] p-8 relative">
            {/* Header pinned to top center */}
            <h2 className="font-body text-2xl font-bold text-[#E73B0D] absolute top-4 left-1/2 -translate-x-1/2">
              Add Gifts
            </h2>
            {/* House centered perfectly within the bordered area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <House
                numberOfDays={numberOfDays}
                onWindowClick={handleWindowClick}
                windowContents={windowContents}
                selectedWindow={selectedWindow ?? undefined}
                themeId={theme?.id}
                themeColors={parseThemeColors(theme?.colors)}
              />
            </div>
          </div>

          {/* Right: edit panel adjacent, matching height via flex stretch */}
          {!isComplete && selectedWindow && (
            <div className="w-96 bg-white shadow-lg rounded-lg overflow-hidden flex">
              <div className="flex-1">
                <WindowEditPanel
                  key={selectedWindow}
                  day={selectedWindow}
                  content={windowContents.find((w) => w.day === selectedWindow)}
                  onSave={handleSaveWindow}
                  onClose={() => {}}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCalendar;
