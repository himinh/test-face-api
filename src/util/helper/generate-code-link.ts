export const generateCodeLink = () => {
  const timestamp = new Date().getTime();
  const ma1 = Math.random().toString(36).substring(2, 6);
  const ma2 = Math.random().toString(36).substring(2, 6);

  return `${ma1}_${ma2}_${timestamp}`;
};
