import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

export enum DateTimeFormatEnum {
    FULL_DATE_TIME = 'YYYY-MM-DDTHH:mm:ss.SSSSS',
    TILL_DATE = 'YYYYMMDD',
    TILL_MONTH = 'YYYYMM',
    TILL_HOUR = 'YYYYMMDDHH',
    TILL_SECOND = 'YYYYMMDDHHmmss',
    TILL_YEAR = 'YYYY',
    TILL_MINUTE = 'YYYYMMDDHHmm',
    TILL_WEEK = 'YYYYww',
    ONLY_MINUTE = 'mm',
    ONLY_HOUR_MINUTE = 'HHmm',
    ONLY_WEEK_DAY_HOUR_MINUTE = 'dHHmm',
    ONLY_DAY_HOUR_MINUTE = 'DDHHmm',
    ONLY_SECOND = 'ss',
    FORMAT_HOUR_MINUTE_MERIDIEM = 'h:mm a',
    FOMAT_DAY_MONTH_YEAR = 'DD MMM, YYYY',
    FORMAT_FULL_DETAILS_V_1 = 'dddd, MMM Do, h:mm a'

}

@Injectable({
    'providedIn':'root'
})
export class DateTimeProvider {
    constructor() {
        moment.tz.setDefault('Asia/Kolkata');
    }

    getCurrentMillis(): number {
        return moment.now();
    }

    getCurrentDateTime(format = DateTimeFormatEnum.FULL_DATE_TIME): string {
        return moment().format(format);
    }

    static getStaticCurrentDateTime(format = DateTimeFormatEnum.FULL_DATE_TIME): string {
        return moment().format(format);
    }

    getMillis(dateTime: string, format = DateTimeFormatEnum.FULL_DATE_TIME): number {
        if (format == DateTimeFormatEnum.ONLY_WEEK_DAY_HOUR_MINUTE) {
            return this.weekDayHourMinute(dateTime);
        }
        return moment(dateTime, format).valueOf();
    }

    private weekDayHourMinute(dateTime: string): number {
        const hourMinute = moment(dateTime.slice(1, dateTime.length), DateTimeFormatEnum.ONLY_HOUR_MINUTE);
        return moment().day(parseInt(dateTime.slice(0, 1))).startOf('day').add(hourMinute.hour(), 'hour').add(hourMinute.minute(), 'minute').valueOf();
    }

    getDay(dateTime: string, format = DateTimeFormatEnum.FULL_DATE_TIME): number {
        return moment(dateTime, format).day();
    }

    getDateTime(millis: number, format = DateTimeFormatEnum.FULL_DATE_TIME): string {
        return moment(millis).format(format);
    }

    convertDateTimeFormat(currentDateTime: string, currentFormat = DateTimeFormatEnum.FULL_DATE_TIME, newFormat = DateTimeFormatEnum.FULL_DATE_TIME): string {
        return this.getDateTime(this.getMillis(currentDateTime, currentFormat), newFormat);
    }

    addDays(days: number, format = DateTimeFormatEnum.FULL_DATE_TIME): string {
        return moment().add(days, 'days').format(format);
    }

    checkIsBetween(format = DateTimeFormatEnum.FULL_DATE_TIME, first: string, middle: string, last: string): boolean {
        const time = moment(middle, format);
        const beforeTime = moment(first, format);
        const afterTime = moment(last, format);
        return moment(time).isBetween(beforeTime, afterTime);
    }

    checkIsBefore(first: string, last: string) {
        return moment(first).isBefore(last);
    }

    checkIsAfter(first: string, last: string) {
        return moment(first).isAfter(last);
    }

}