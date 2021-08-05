import React from "react";
import { StyleSheet, Text, View } from "react-native";
import dayjs from 'dayjs'
import { timeFormatter } from "../../../../../common/functions/timeFormatter";
import { _dateFormatter } from "../../../../../common/functions/_dateFormatter";
// const getBackgroundColor = () => {
//   let color;
//   if (1) {
//     color = '#F0F2F2';
//     // color = 'green';
//   } else if (2) {
//     color = '#808080';
//   }
//   return color;
// };

function ListCard({ data }) {

  const renderDayStatus = (item) => {
    if (item ?.ysnPresent) {
      return (
        <View style={[styles.attendanceInfo]}>
          <Text style={styles.presentText}>Present</Text>
        </View>
      )
    }

    if (item ?.ysnAbsent) {
      return (
        <View style={[styles.attendanceInfo, styles.absent]}>
          <Text style={styles.absentText}>Absent</Text>
        </View>
      )
    }

    if (item ?.ysnLeave) {
      return (
        <View style={[styles.attendanceInfo, styles.leave]}>
          <Text style={styles.lateText}>Leave</Text>
        </View>
      )
    }

    if (item ?.ysnPresent) {
      return (
        <View style={styles.attendanceInfo}>
          <Text>Present</Text>
        </View>
      )
    }

    if (item ?.ysnLate) {
      return (
        <View style={[styles.attendanceInfo, { backgroundColor: "#F5A328" }]}>
          <Text style={styles.lateText}>Late</Text>
        </View>
      )
    }

    if (item ?.ysnOffday) {
      return (
        <View style={[styles.attendanceInfo, { backgroundColor: "#DCDCDC" }]}>
          <Text style={styles.lateText}>Off Day</Text>
        </View>
      )
    }

    if (item ?.ysnHoliday) {
      return (
        <View style={[styles.attendanceInfo, { backgroundColor: "#6EC3F3" }]}>
          <Text style={styles.lateText}>Holiday</Text>
        </View>
      )
    }

  }

  return (
    <>

      <View style={styles.card}>

        <View style={styles.cardContent}>
          <View style={{ width: 50, justifyContent: "center", alignItems: "center", backgroundColor: '#FFFFFF', borderRadius: 5, flexDirection: 'row' }} >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={[styles.fontWeight, { color: '#121E44' }]}>
                {dayjs(_dateFormatter(data ?.dteAttendanceDate)).format("DD")}
              </Text>
              <Text style={[styles.fontWeight, { color: '#121E44' }]}>
                {dayjs(_dateFormatter(data ?.dteAttendanceDate)).format("ddd")}
              </Text>

            </View>
          </View>

          <View style={{ flex: 1, flexDirection: "column", backgroundColor: '#F0F2F299', borderRadius: 5, marginLeft: 5 }}>
            <View style={{ justifyContent: "flex-end", alignItems: 'center', flexDirection: 'row' }}>
              
              {renderDayStatus(data)}
              <Text style={{ color: data ?.ysnEaryLeave ? "black" : "transparent", marginLeft: 8 }}>Early Leave</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 8 }}>
              <View style={styles.timeMargin}>
                <Text style={[styles.fontWeight, { color: '#121E44' }]}>In Time</Text>
                <Text>{data ?.checkInTime ? timeFormatter(data?.checkInTime ) : "00.00"}</Text>
              </View>

              <View style={styles.timeMargin}>
                <Text style={[styles.fontWeight, { color: '#121E44' }]}>Out Time</Text>
                <Text>{data?.checkOutTime ? timeFormatter(data?.checkOutTime ) : "00.00"}</Text>
              </View>

              <View style={styles.timeMargin}>
                <Text style={[styles.fontWeight, { color: '#121E44' }]}>Over Time</Text>
                <Text>00:00</Text>
              </View>


            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    backgroundColor: '#F0F2F2',

    marginHorizontal: 12,
    marginVertical: 6,

  },
  cardContent: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 10,
  },
  attendanceInfo: {
    backgroundColor: "#33D449" || "#F75A5A",
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  fontWeight: {
    fontWeight: "bold"
  },
  dateStyle: {
    fontSize: 19,
    marginTop: -10,
    marginBottom: 10
  },
  timeMargin: {
    // marginRight: 14
  },
  absent: {
    backgroundColor: '#F75A5A'
  },
  absentText: {
    color: "#ffffff"
  },
  late: {
    backgroundColor: "#FFF2D1"
  },
  lateText: {
    color: "#ffffff"
  },
  present: {
    backgroundColor: "#33D449"
  },
  presentText: {
    color: "#ffffff"
  },
  leave: {
    backgroundColor: "#AC88D5"
  }
});

export default ListCard;
