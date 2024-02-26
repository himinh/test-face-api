export const ONE_SECOND_MILLISECONDS = 1000;
export const ONE_MINUTE_MILLISECONDS = 60 * ONE_SECOND_MILLISECONDS;

export const getMillisecondsFromMinutes = (minutes: number) => {
  return minutes * ONE_MINUTE_MILLISECONDS;
};

export const getMinutesFromMilliseconds = (milliseconds: number) => {
  return milliseconds / ONE_MINUTE_MILLISECONDS;
};
