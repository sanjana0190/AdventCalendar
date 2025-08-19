// Get the logged-in user's ID
export const getUserId = (): string | null => {
  return sessionStorage.getItem('userId');
};

// Check if a user is logged in
export const isLoggedIn = (): boolean => {
  return !!sessionStorage.getItem('userId');
};

// Log out the user
export const logout = (): void => {
  sessionStorage.removeItem('userId');
};

// Set user session
export const setUserSession = (userId: string): void => {
  sessionStorage.setItem('userId', userId);
};

// Get the current calendar ID
export const getCurrentCalendarId = (): string | null => {
  return sessionStorage.getItem('currentCalendarId');
};

// Set the current calendar ID
export const setCurrentCalendarId = (calendarId: string): void => {
  sessionStorage.setItem('currentCalendarId', calendarId);
};

// Clear the current calendar ID
export const clearCurrentCalendarId = (): void => {
  sessionStorage.removeItem('currentCalendarId');
}; 