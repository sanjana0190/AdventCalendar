// Theme definitions
export const themes = [
  { id: "default", colors: ["#AFA276", "#D2C7A3"] },
  { id: "brown", colors: ["#85756E", "#CAADA0"] },
  { id: "pink", colors: ["#EFA8B8", "#FFCFDA"] },
  { id: "blue", colors: ["#1B4079", "#5677AA"] },
  { id: "darkGreen", colors: ["#254441", "#406965"] },
  { id: "red", colors: ["#92140C", "#A8453F"] },
  { id: "orange", colors: ["#DB7F67", "#F8A089"] },
  { id: "gray", colors: ["#776871", "#9D8A95"] },
  { id: "lilac", colors: ["#D1B3C4", "#E3C7D8"] },
];

// Helper function to get theme colors by theme ID
export const getThemeColors = (themeId: string | null) => {
  if (!themeId) return themes[0].colors; // Default theme
  const theme = themes.find(t => t.id === themeId);
  return theme?.colors || themes[0].colors;
}; 