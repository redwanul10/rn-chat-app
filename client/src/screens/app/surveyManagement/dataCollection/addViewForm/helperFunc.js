// AnswerMaker
export const answermaker = (id, value, num, row) => {
  let newRow = [...row];
  newRow?.forEach((item, indx) => {
    if (item?.lineRowId === id) {
      if (num === 0) {
        // If Only Answer
        if (Number(value)) {
          newRow[indx].answer = +value; // If the answer is number then makes value to number
        } else {
          newRow[indx].answer = value; // If the answer is string then makes value string
        }
      } else {
        // If ObjAttributes List
        const foundData = item?.objAttributes?.some(
          (i) => i?.linelistId === num,
        );
        if (foundData) {
          let li = newRow[indx]?.objAttributes;
          newRow[indx].objAttributes = isSelectMaker(num, li);
        } else {
          newRow[indx].objAttributes = [];
        }
      }
    }
  });
  return newRow;
};

// It will be make true all of the objAttributes by id
const isSelectMaker = (id, row) => {
  const lis = row?.map((item) => {
    if (item?.linelistId === id) {
      return {
        ...item,
        isSelect: true,
      };
    } else {
      return item;
    }
  });
  return lis;
};
