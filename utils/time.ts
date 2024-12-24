import  { Dayjs } from 'dayjs'
export const roundToNearestNMinutes = (time:Dayjs,n:number=5) => {
    const roundedMinute = Math.round(time.minute() / n) * n;
    return time.startOf("minute").add(roundedMinute, "minute");
};

// const calculateTimeDifference = (startTime:string, endTime:string) => {
//     if (startTime && endTime) {
//       const roundedStartTime = roundToNearest5Minutes(dayjs(startTime));
//       const roundedEndTime = roundToNearest5Minutes(dayjs(endTime));
//       const diffInSeconds = roundedEndTime.diff(
//         roundedStartTime,
//         "second",
//         true
//       );
//       const diffInHours = diffInSeconds / 3600;
//     //   setTimeDifference(diffInHours.toFixed(2));
//     }
// }