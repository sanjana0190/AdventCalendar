import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import House from "./House";
import { CREATE_CALENDAR, UPDATE_CALENDAR_THEME } from "../graphql/mutations";
import { getUserId } from "../utils/sessionUtils";
import { useMutation } from "@apollo/client";
import { themes } from "../utils/constants";

const CreateCalendar = () => {
  const [numberOfDays, setNumberOfDays] = useState<number>(25);
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [seelctedTheme, setSelectedTheme] = useState<string>("default");
  const [createCalendar] = useMutation(CREATE_CALENDAR);
  const [updateCalendarTheme] = useMutation(UPDATE_CALENDAR_THEME);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    console.log(`Theme selected: ${themeId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      // First create the calendar
      const { data } = await createCalendar({
        variables: {
          title: "Untitled Calendar",
          num_days: numberOfDays,
          user_id: userId,
        },
      });

      if (data?.insert_calendars_one?.id) {
        // Then update the theme
        await updateCalendarTheme({
          variables: {
            id: data.insert_calendars_one.id,
            theme: seelctedTheme,
          },
        });

        const selectedThemeColors = themes.find(
          (t) => t.id === seelctedTheme
        )?.colors;
        const calendarData = {
          id: data.insert_calendars_one.id,
          numberOfDays,
          title: "Untitled Calendar",
          theme: {
            id: seelctedTheme,
            colors: selectedThemeColors,
          },
        };

        sessionStorage.setItem(
          "currentCalendarId",
          data.insert_calendars_one.id
        );

        sessionStorage.setItem(
          "calendarTheme",
          JSON.stringify({ id: seelctedTheme, colors: selectedThemeColors })
        );
        navigate("/edit-calendar", {
          state: calendarData,
        });
      }
    } catch (error) {
      console.log("Error creating calendar", error);
    }
  };

  const renderStep1 = () => (
    <>
      <div
        className="rounded-lg p-8 w-full border-2 border-[#E73B0D]"
        style={{ minHeight: "calc(100vh - 160px)" }}
      >
        <h1 className="font-body text-3xl font-extrabold mb-6 text-center text-[#E73B0D]">
          Step 1: Choose the number of days
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
          className="flex flex-col h-full"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Slider to select number of days */}
            <input
              type="range"
              min="1"
              max="30"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
              className="w-64"
            />
            <span className="text-xl text-[#E73B0D] font-date font-bold">
              {numberOfDays} {numberOfDays === 1 ? "day" : "days"}
            </span>
          </div>
          <House numberOfDays={numberOfDays} />

          <div className="flex justify-between mt-auto pt-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-[#E73B0D] text-[#F2E5B9] px-6 py-2 rounded hover:opacity-90"
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </>
  );

  const renderStep2 = () => {
    const selectedThemeColors =
      themes.find((t) => t.id === seelctedTheme)?.colors || themes[0].colors;

    return (
      <>
        <div
          className="rounded-lg p-8 w-full border-2 border-[#E73B0D]"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
          <h1 className="font-body text-3xl font-extrabold mb-6 text-center text-[#E73B0D]">
            Step 2: Choose your theme
          </h1>
          <div className="flex gap-8 items-start justify-center">
            {/* Left spacer to balance theme panel width so house stays centered under header */}
            <div className="w-64 p-4 hidden md:block" />
            <div className="flex-1 flex justify-center">
              <House
                numberOfDays={numberOfDays}
                themeColors={selectedThemeColors}
                themeId={seelctedTheme}
              />
            </div>
            <div className="w-64 p-4">
              <h2 className="text-lg mb-4 font-body text-[#E73B0D]">
                Select a theme
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`w-full aspect-square relative ${
                      seelctedTheme === theme.id ? "ring-2 ring-[#E73B0D]" : ""
                    }`}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors[0]} 50%, ${theme.colors[1]} 50%)`,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-auto pt-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#E73B0D] text-[#F2E5B9] px-6 py-2 rounded hover:opacity-90"
            >
              Create Calendar
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="m-h-screen ng-[#F2E5B9] p-8 flex flex-col items-center">
      <div className="w-full">
        <Header />
        {step === 1 ? renderStep1() : renderStep2()}
      </div>
    </div>
  );
};

export default CreateCalendar;
