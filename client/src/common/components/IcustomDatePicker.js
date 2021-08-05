import dayjs from 'dayjs';
import React, {useState, useEffect} from 'react';
import { Text } from 'react-native'
import Col from './Col';
import ICustomPicker from './ICustomPicker';
import Row from './Row';

const monthDDL = [
  {
    value: '01',
    label: 'Jan',
  },
  {
    value: '02',
    label: 'Feb',
  },
  {
    value: '03',
    label: 'Mar',
  },
  {
    value: '04',
    label: 'Apr',
  },
  {
    value: '05',
    label: 'May',
  },
  {
    value: '06',
    label: 'Jun',
  },
  {
    value: '07',
    label: 'Jul',
  },
  {
    value: '08',
    label: 'Aug',
  },
  {
    value: '09',
    label: 'Sep',
  },
  {
    value: '10',
    label: 'Oct',
  },
  {
    value: '11',
    label: 'Nov',
  },
  {
    value: '12',
    label: 'Dec',
  },
];

const ICustomDatePicker = ({name, value, formikprops,label}) => {
  const [date, setDate] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  const [yearDDL, setYearDDL] = useState([]);
  const [daysDDL, setDayDDL] = useState([]);

  const [curDayOfMonth, setCurDayOfMonth] = useState(
    Number(dayjs().endOf('month').format('D')),
  );

  useEffect(() => {
    const dated = new Date().getFullYear();
    let yearDDL = [];
    for (let i = 1900; i <= dated; i++) {
      yearDDL = [{value: i, label: i}, ...yearDDL];
    }
    let daysDDL = [];
    for (let i = 1; i <= curDayOfMonth; i++) {
      daysDDL = [...daysDDL, {value: i <= 9 ? `0${i}` : i, label: i}];
    }
    setYearDDL(yearDDL);
    setDayDDL(daysDDL);
  }, []);

  useEffect(() => {
    if (date && month && year) {
      formikprops?.setFieldValue(
        name,
        `${year?.value}-${month?.value}-${date?.value}`,
      );
    }
  }, [date, month, year]);

  useEffect(() => {
    if (value?.length > 0) {
      const splitArr = value.split('-');
      setDate({value: splitArr[2], label: splitArr[2]});
      setMonth({value: splitArr[1], label: monthDDL[+splitArr[1] - 1]?.label});
      setYear({value: splitArr[0], label: splitArr[0]});
    }
  }, [value]);

  return (
    <>
      <Text style={[{fontFamily: 'OpenSans-Bold', color: 'black'}]}>
        {label}
      </Text>

      <Row colGap={5}>
        <Col width="33.33%">
          <ICustomPicker
            placeholder="Year"
            name="approve"
            options={yearDDL}
            onChange={(valueOption) => {
              setYear(valueOption);
            }}
            value={year}
          />
        </Col>

        <Col width="33.33%">
          <ICustomPicker
            placeholder="Month"
            name="approve"
            options={monthDDL}
            onChange={(valueOption) => {
              setMonth(valueOption);
              setCurDayOfMonth(
                Number(
                  dayjs()
                    .month(valueOption?.value - 1)
                    .endOf('month')
                    .format('D'),
                ),
              );
            }}
            value={month}
          />
        </Col>

        <Col width="33.33%">
          <ICustomPicker
            placeholder="Day"
            name="approve"
            options={daysDDL}
            onChange={(valueOption) => {
              setDate(valueOption);
            }}
            value={date}
          />
        </Col>
      </Row>
    </>
  );
};

export default ICustomDatePicker;
