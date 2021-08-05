export const _IDatePickerFormatter = (param) => {
  const date = new Date(param);
  
  if(param){
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return [day, month, year].join('-');
  }

  return ""
  
};
