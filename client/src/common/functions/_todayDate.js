export const _todayDate = () => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);
  return todayDate;
};
// today.getFullYear() +
//     "-" +
//     ("0" + (today.getMonth() + 1)).slice(-2) +
//     "-" +
//     ("0" + today.getDate()).slice(-2);
