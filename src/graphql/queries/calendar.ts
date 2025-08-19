import { gql } from '@apollo/client';

// calendarDetails query
export const GET_CALENDAR_DETAILS = gql`
  query calendarDetails($id: uuid!) {
    calendars(where: {id: {_eq: $id}}) {
      id
      num_days
      title
      user_id
      theme_id
    }
  }
`;

// getCalendarDays query
export const GET_CALENDAR_DAYS = gql`
  query getCalendarDays($calendar_id: uuid!, $day_number: Int) {
    calendar_days(
      where: {
        calendar_id: {_eq: $calendar_id}
        day_number: {_eq: $day_number}
      }
    ) {
      day_number
      description
      id
      image_url
      link_url
      title
    }
  }
`;

export const GET_USER_CALENDARS = gql`
  query getUserCalendars($user_id: uuid!) {
    calendars(where: {user_id: {_eq: $user_id}}) {
      id
      title
      num_days
      theme_id
      created_at
    }
  }
`;