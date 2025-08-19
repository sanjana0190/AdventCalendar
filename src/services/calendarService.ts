import { client } from '../config/apollo-client';
import { 
  CREATE_ADVENT_CALENDAR, 
  CREATE_CALENDAR_ENTRIES,
  CREATE_USER_CALENDAR_ENTRIES 
} from '../graphql/mutations';

interface CalendarData {
  title: string;
  description?: string;
  numberOfDays: number;
}

export const createCalendar = async (calendarData: CalendarData) => {
  try {
    // Step 1: Create the advent calendar
    const calendarResult = await client.mutate({
      mutation: CREATE_ADVENT_CALENDAR,
      variables: {
        title: calendarData.title,
        description: calendarData.description
      }
    });

    const calendarId = calendarResult.data.insert_advent_calendars_one.id;

    // Step 2: Create calendar entries for each day
    const calendarEntries = Array.from({ length: calendarData.numberOfDays }, (_, index) => ({
      advent_calendar_id: calendarId,
      day: index + 1,
      title: `Day ${index + 1}`,
      content: `Content for day ${index + 1}`,
      unlock_date: new Date(2024, 11, index + 1), // December 2024
      is_unlocked: false
    }));

    const entriesResult = await client.mutate({
      mutation: CREATE_CALENDAR_ENTRIES,
      variables: {
        objects: calendarEntries
      }
    });

    // Step 3: Create user calendar entries
    const userCalendarEntries = entriesResult.data.insert_calendar_entries.returning.map(
      (entry: { id: string }) => ({
        user_id: "00000000-0000-0000-0000-000000000000",
        calendar_entry_id: entry.id
      })
    );

    await client.mutate({
      mutation: CREATE_USER_CALENDAR_ENTRIES,
      variables: {
        objects: userCalendarEntries
      }
    });

    return calendarResult.data.insert_advent_calendars_one;
  } catch (error) {
    console.error('Error creating calendar:', error);
    throw error;
  }
};