import { useState } from "react";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER } from "./graphql/queries/auth";
import { useLazyQuery } from "@apollo/client";

const pulseGlowAnimation = `
 @keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 5px #E73B0D, 0 0 10px #E73B0D, 0 0 15px #E73B0D;
  }
  50% {
    box-shadow: 0 0 12px #E73B0D, 0 0 25px #E73B0D, 0 0 30px #E73B0D;
  }
}
`;

const Calendar = () => {
  const [currentDate] = useState(new Date());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const [loginUser] = useLazyQuery(LOGIN_USER);

  const getCurrentMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return { year, month, firstDay, lastDay };
  };

  const renderCalendarGrid = () => {
    const { firstDay, lastDay } = getCurrentMonthData();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }

    const rows: (number | null)[][] = [];
    let cells: (number | null)[] = [];

    days.forEach((day, index) => {
      if (index % 7 === 0 && cells.length > 0) {
        rows.push(cells);
        cells = [];
      }
      cells.push(day);
      if (index === days.length - 1) {
        rows.push(cells);
      }
    });

    while (rows[rows.length - 1].length < 7) {
      rows[rows.length - 1].push(null);
    }
    return rows;
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleAuth = async (
    email: string,
    password: string,
    isSignUp: boolean
  ) => {
    if (isSignUp) {
      // try{
      //   const { data } = await insertUser({
      //     variables: {
      //       object: {
      //         email,
      //         password, // Note: In a real app, you should hash the password
      //       },
      //     },
      //   });
      //   setIsAuthModalOpen(false);
      // }
      // catch (error) {
      //   console.error("Signup error:", error);
      // }
    } else {
      try {
        const { data } = await loginUser({ variables: { email, password } });
        if (data?.users.length > 0) {
          navigate("/my-calendars");
        } else {
          alert("Invalid email password");
        }
      } catch (error) {
        console.error("login error: ", error);
      }
    }
  };

  const calendarRows = renderCalendarGrid();

  return (
    <div className="min-h-screen bg-[#F2E5B9]">
      <style>
        {pulseGlowAnimation}
        {`
    .hover-container:hover .hover-text {
      opacity: 1;
    }
    .hover-text {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .glow-effect {
      animation: pulseGlow 2s infinite;
    }
  `}
      </style>

      <div className="rounded-lg shadow-lg p-6">
        <Header />

        <div className="calendar-grid max-w-6xl mx-auto">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["sun", "mon", "tue", "wed", "thur", "fri", "sat"].map(
              (day, index) => (
                <div
                  key={index}
                  className="text-right pr-2 font-date"
                  style={{
                    color: "#E73B0D",
                  }}
                >
                  {day}
                </div>
              )
            )}
          </div>

          {calendarRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-7 gap-1 h-20 md:h-24 lg:h-32"
            >
              {row.map((day, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`
                    border border-[#E73B0D] rounded-lg p-2 relative min-h-[80px]
                    ${
                      isToday(day)
                        ? "bg-[#E73B0D] text-[#F2E5B9] cursor-pointer glow-effect"
                        : "bg-[#F2E5B9]"
                    }
                    hover-container
                  `}
                  onClick={() => {
                    if (isToday(day)) {
                      setIsAuthModalOpen(true);
                    }
                  }}
                >
                  {day && (
                    <>
                      <div
                        className={`text-lg text-right font-date ${
                          isToday(day) ? "text-[#F2E5B9]" : "text-[#E73B0D]"
                        }`}
                      >
                        {day < 10 ? `0${day}` : day}
                      </div>
                      {isToday(day) && (
                        <div className="hover-text absolute inset-0 flex items-center justify-center bg-[#E73B0D] bg-opacity-90 rounded-lg text-[#F2E5B9] text-center p-2 font-body">
                          Create an Advent Calendar
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSubmit={handleAuth}
      />
    </div>
  );
};

export default Calendar;
