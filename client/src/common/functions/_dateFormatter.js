export const _dateFormatter = (param) => {
  const date = new Date(param);
  
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return [year, month, day].join('-');
 
  return '';
};
