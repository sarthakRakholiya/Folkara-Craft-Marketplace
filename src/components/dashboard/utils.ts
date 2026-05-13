export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const getInitials = (firstName?: string | null, lastName?: string | null) => {
  if (!firstName) return "A";
  const f = firstName.charAt(0).toUpperCase();
  const l = lastName ? lastName.charAt(0).toUpperCase() : "";
  return f + l;
};
