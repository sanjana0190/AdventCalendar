import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./calendar";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo-client";
import { CreateCalendar, EditCalendar, CalendarsList } from "./components";
import PreviewCalendar from "./components/PreviewCalendar";
import ShareCalendar from "./components/ShareCalendar";
import { useLocation } from "react-router-dom";
import MyCalendars from "./components/MyCalendars";

function ShareCalendarWrapper() {
  const location = useLocation();
  const { numberOfDays, windowContents, themeId, themeColors } =
    location.state || {};
  return (
    <ShareCalendar
      numberOfDays={numberOfDays}
      windowContents={windowContents}
      themeId={themeId}
      themeColors={themeColors}
    />
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/calendars" element={<CalendarsList />} />
          <Route path="/create" element={<CreateCalendar />} />
          <Route path="/edit-calendar" element={<EditCalendar />} />
          <Route path="/preview" element={<PreviewCalendar />} />
          <Route path="/preview/:calendarId" element={<PreviewCalendar />} />
          <Route path="/share" element={<ShareCalendarWrapper />} />
          <Route path="/my-calendars" element={<MyCalendars />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
