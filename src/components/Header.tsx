import React from "react";

interface HeaderProps {
  overrideMonth?: string;
  overrideYear?: number;
}

const Header: React.FC<HeaderProps> = ({ overrideMonth, overrideYear }) => {
  const currentDate = new Date();

  const getMonthName = (monthIndex: number): string => {
    const months = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ];
    return months[monthIndex];
  };

  const monthName = overrideMonth || getMonthName(currentDate.getMonth());
  const year = overrideYear || currentDate.getFullYear();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-baseline gap-4">
          <h1
            className="text-7xl font-bold font-date"
            style={{ color: "#E73B0D" }}
          >
            {monthName}
          </h1>
          <span className="text-3xl font-date" style={{ color: "#E73B0D" }}>
            {year}
          </span>
        </div>

        <h2
          className="text-2xl font-semibold text-right font-date"
          style={{ color: "#E73B0D" }}
        >
          Digital Advent
          <br />
          Calendar
        </h2>
      </div>
    </div>
  );
};

export default Header;
