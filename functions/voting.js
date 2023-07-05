//get the vote count suffix
const getCountSuffix = (countNum) => {
  if (countNum < 1000) return `${countNum}`;
  if (countNum >= 1000 && countNum < 1000000)
    return `${(countNum / 1000).toFixed(1)}k`;
  if (countNum >= 1000000) return `${(countNum / 1000000).toFixed(1)}m`;
};

//get post time passing
const getTimePassing = (dateTime) => {
  const timePassingInHrs = (new Date() - dateTime) / 1000 / 60 / 60;

  if (timePassingInHrs > 24) {
    return `${Math.floor(timePassingInHrs / 24)}d`;
  } else if (timePassingInHrs < 1) {
    const timePassingInMin = timePassingInHrs * 60;
    return timePassingInMin > 1 ? `${Math.ceil(timePassingInMin)}m` : "now";
  } else {
    return `${Math.ceil(timePassingInHrs)}h`;
  }
};

export { getCountSuffix, getTimePassing };
