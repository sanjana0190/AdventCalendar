import { gql } from '@apollo/client';

export const CREATE_CALENDAR = gql`
  mutation createCalendar($title: String!, $num_days: Int!, $user_id: uuid!) {
    insert_calendars_one(object: {title: $title, num_days: $num_days, user_id: $user_id}) {
      id
      num_days
      title
      user_id
    }
  }
`;

export const CREATE_CALENDAR_DAY = gql`
  mutation createCalendarDay($calendar_id: uuid!, $title: String!, $description: String!, $day_number: Int, $image_url: String, $link_url: String) {
    insert_calendar_days_one(object: { calendar_id: $calendar_id, title: $title, description: $description, day_number: $day_number, image_url: $image_url, link_url: $link_url}) {
      id
    }
  }
`;

export const UPDATE_CALENDAR_THEME = gql`
  mutation updateCalendarTheme($id: uuid!, $theme: String) {
    update_calendars_by_pk(pk_columns: {id: $id}, _set: {theme_id: $theme}) {
      theme_id
    }
  }
`;

export const UPDATE_CALENDAR_SHARING = gql`
  mutation updateCalendarSharing($id: uuid!, $one_per_day: Boolean!) {
    update_calendars_by_pk(pk_columns: {id: $id}, _set: {one_per_day: $one_per_day}) {
      id
      one_per_day
    }
  }
`;

export const GET_USER_CALENDARS = gql`
  query getUserCalendars($user_id: uuid!) {
    calendars(where: {user_id: {_eq: $user_id}}) {
      id
      title
      created_at
    }
  }
`;

export const UPDATE_CALENDAR_TITLE = gql`
  mutation updateCalendarTitle($id: uuid!, $title: String!) {
    update_calendars_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
      title
    }
  }
`;
