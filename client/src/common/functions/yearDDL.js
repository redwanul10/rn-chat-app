import dayjs from "dayjs";

export const yearDDL = (prevYear = 5, nextYear = 5) => {
  const prevFiveYears = +dayjs().format("YYYY") - prevYear;
  const nextFiveYears = +dayjs().format("YYYY") + nextYear;
  let yearDDLList = [];
  for (let i = prevFiveYears; i <= nextFiveYears; i++) {
    const element = i;
    yearDDLList.push({
      value: i,
      label: `${element}`,
    });
  }
  return yearDDLList;
};