import React from "react";
import { WindowContent } from "../types/calendar";
import lightgreenWindow from "../images/lightgreenWindow.png";
import brownWindow from "../images/brownWindow.png";
import pinkWindow from "../images/pinkWindow.png";
import blueWindow from "../images/blueWindow.png";
import darkgreenWindow from "../images/darkgreenWindow.png";
import redWindow from "../images/redWindow.png";
import orangeWindow from "../images/orangeWindow.png";
import greyWindow from "../images/greyWindow.png";
import lavendarWindow from "../images/lavendarWindow.png";

interface HouseProps {
  numberOfDays: number;
  onWindowClick?: (day: number) => void;
  windowContents?: WindowContent[];
  selectedWindow?: number;
  themeColors?: string[];
  themeId?: string;
  isPreview?: boolean;
}

const House: React.FC<HouseProps> = ({
  numberOfDays,
  onWindowClick,
  windowContents = [],
  selectedWindow,
  themeColors = ["#AFA276", "#D2C7A3"],
  themeId = "default",
  isPreview = false,
}) => {
  // Debug theme colors
  console.log("House component theme data:", { themeId, themeColors });

  const getWindowImage = () => {
    switch (themeId) {
      case "default":
        return lightgreenWindow;
      case "brown":
        return brownWindow;
      case "pink":
        return pinkWindow;
      case "blue":
        return blueWindow;
      case "darkGreen":
        return darkgreenWindow;
      case "red":
        return redWindow;
      case "orange":
        return orangeWindow;
      case "gray":
        return greyWindow;
      case "lilac":
        return lavendarWindow;
      default:
        return lightgreenWindow;
    }
  };
  const calculateHouseDimensions = () => {
    const columns = Math.min(7, numberOfDays);
    const rows = Math.ceil(numberOfDays / 7);
    const houseWidth = columns * 90 + (columns - 1) * 30;
    const houseHeight = rows * 100 + (rows - 1) * 30;
    const roofWidth = houseWidth + 40;
    const roofHeight = roofWidth * 0.2;

    return {
      houseWidth: `${houseWidth}px`,
      houseHeight: `${houseHeight}px`,
      roofWidth: `${roofWidth}px`,
      roofHeight: `${roofHeight}px`,
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
    };
  };

  const dimensions = calculateHouseDimensions();

  return (
    <div className="mt-8 flex flex-col items-center">
      {/* Roof with shadow */}
      <div
        className="relative flex justify-center"
        style={{ width: dimensions.roofWidth }}
      >
        {/* Roof shadow */}
        <div
          className="w-0 h-0 absolute"
          style={{
            top: "5px",
            borderLeft: `${
              parseInt(dimensions.roofWidth) / 2
            }px solid transparent`,
            borderRight: `${
              parseInt(dimensions.roofWidth) / 2
            }px solid transparent`,
            borderBottom: `${parseInt(
              dimensions.roofHeight
            )}px solid rgba(0,0,0,0.3)`,
            filter: "blur(2px)",
            zIndex: 0,
          }}
        />

        {/* Roof */}
        <div
          className="w-0 h-0 relative z-10"
          style={{
            borderLeft: `${
              parseInt(dimensions.roofWidth) / 2
            }px solid transparent`,
            borderRight: `${
              parseInt(dimensions.roofWidth) / 2
            }px solid transparent`,
            borderBottom: `${dimensions.roofHeight} solid ${themeColors[0]}`,
            marginBottom: "-1px",
            zIndex: 1,
          }}
        />
      </div>

      {/* House Body */}
      <div
        className="p-8 rounded-b-lg flex items-center justify-center"
        style={{
          width: dimensions.houseWidth,
          height: dimensions.houseHeight,
          backgroundColor: themeColors[0],
          backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-dark.png")`,
        }}
      >
        {/* Windows Grid */}
        <div
          className="grid"
          style={{
            display: "grid",
            gap: "30px",
            gridTemplateColumns: dimensions.gridTemplateColumns,
          }}
        >
          {/* Generate window elements */}
          {Array.from({ length: numberOfDays }, (_, index) => (
            <div
              key={index}
              className="relative group cursor-pointer transition-transform hover:scale-110 hover:animate-wiggle"
              onClick={() => onWindowClick?.(index + 1)}
              style={{
                animation: "none",
              }}
            >
              {/* Window Design */}
              <div
                className={`aspect-square rounded-lg p-1 flex items-center justify-center ${
                  selectedWindow === index + 1
                    ? "shadow-lg transform -translate-y-1 animate-pulse"
                    : ""
                }`}
                style={{
                  width: "80px",
                  height: "80px",
                }}
              >
                <div
                  className="h-full w-full bg-[#D2C7A3] rounded-md flex items-center justify-center"
                  style={{
                    backgroundColor: themeColors[1],
                    boxShadow: "0px 6px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {isPreview && windowContents[index]?.title && (
                    <span className="text-xs text-center text-white font-bold drop-shadow-md px-1 font-body">
                      {windowContents[index].title}
                    </span>
                  )}
                </div>
                <img
                  src={getWindowImage()}
                  alt="Window"
                  className="absolute inset-0 w-[130%] h-[120%] object-cover scale-125"
                />
                <span className="absolute z-10 text-white font-date drop-shadow-md">
                  {" "}
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default House;
