import { Injectable } from '@nestjs/common';

@Injectable()
export class Util {
  /**
   * 며칠간격으로 시작날짜와 끝날짜를 구해야 할 때. 목표 시간은 일단 KTC로 받음. return 은 UTC로 startTime과 endTime 알려줌. ex) KTC 기준 시작시간 : 7시,  5월 30일 6시에 조회 : startTime : 5월 29일 7시 (UTC : 5월 28일 22시) endTime 5월 30일 7시 (UTC : 5월 29일 22시), 5월 30일 14시에 조회 : startTime : 5월 30일 7시(UTC startTime : 5월 29일 22시) endTime : 5월 31일 7시(UTC endTime : 5월 30일 22시)
   * @param dayTerm : 며칠간격으로 할건지
   * @param referenceDate : 기준일 (시작일)
   * @param startHour : 시작 시간
   * @param startMinutes : 시작 분
   */
  getStartTimeAndEndTimeRangeDayTerm(
    dayTerm: number,
    referenceDate: Date,
    startHour: number,
    startMinutes: number,
  ) {
    // 목표시간은 KTC로 되어있으므로 UTC로 바꿔줌
    const goalTimeUtc =
      startHour - 9 < 0 ? 24 + (startHour - 9) : startHour - 9;

    const startTime = referenceDate;
    if (referenceDate.getHours() < goalTimeUtc) {
      startTime.setUTCDate(startTime.getUTCDate() - 1);
    }

    const endTime = new Date();
    endTime.setUTCDate(startTime.getUTCDate() + dayTerm);

    // 시간 설정. UTC 타입으로 맞춰주기. 목표시간 - 9시간(KTC)가 -가 나오면, 하루를 빼주고, 시간은 24시 + (목표시간 - 9시간)(음수가 나오기 때문에, +를 해줬다.).
    if (startHour - 9 < 0) {
      // yesterdayStartTime
      startTime.setUTCHours(24 + (startHour - 9), startMinutes, 0, 0);

      // todayStartTime
      endTime.setUTCHours(24 + (startHour - 9), startMinutes, 0, 0);
    } else {
      startTime.setUTCHours(startHour - 9, startMinutes, 0, 0);
      endTime.setUTCHours(startHour - 9, startMinutes, 0, 0);
    }

    return { startTime, endTime };
  }
}
