import Axios from 'axios';
import { CalendarItem, CalendarResponse, DataResponse, JsonResponse, SimpleEvent } from '../../types';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import { ICalendarRetriever } from '../../interfaces';
import {
  dblRegex,
  spaceRegex,
  urlregex
} from '../../shared';
export class CalendarRetriever implements ICalendarRetriever {
  constructor() { }

  private _createDateString(date: Date): string {
    const currMonth = date.getMonth() + 1;
    const month = currMonth < 10 ? `0${currMonth}` : `${(currMonth).toString()}`,
      day = date.getDate() < 10 ? `0${date.getDate()}` : `${(date.getDate()).toString()}`;;

    return `${date.getFullYear()}-${month}-${day}`;
  }

  private _getDaysInMiliseconds(days: number): number {
    return days/*days*/ * 24/*hours*/ * 60/*minutes*/ * 60/*seconds*/ * 1000/*miliseconds*/
  }

  private _getStartDate(): string {
    const twoDaysAgo = new Date((new Date()).getTime() + this._getDaysInMiliseconds(-2));
    return this._createDateString(twoDaysAgo);
  }

  private _getEndDate(): string {
    const milisecondsIntoTheFuture = (new Date().getTime() + this._getDaysInMiliseconds(90));
    const futurDate = new Date(milisecondsIntoTheFuture);
    return this._createDateString(futurDate);
  }

  private get url(): string {
    const start = this._getStartDate();
    const end = this._getEndDate();
    return `https://clients6.google.com/calendar/v3/calendars/nosquish.com_qnc0aue18807gi2j7gn7m5hdhg@group.calendar.google.com/events?calendarId=nosquish.com_qnc0aue18807gi2j7gn7m5hdhg%40group.calendar.google.com&singleEvents=true&timeZone=America%2FDenver&maxAttendees=1&maxResults=500&sanitizeHtml=true&timeMin=${start}T00%3A00%3A00-07%3A00&timeMax=${end}T00%3A00%3A00-07%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`
  }
  private _createSimpleEvent(item: CalendarItem): SimpleEvent {
    const { description,
      location,
      start,
      end,
      summary
    } = item;
    const dayDiff = Math.abs(dayjs(end.dateTime ?? <string>end.date).diff(dayjs(start.dateTime ?? <string>start.date), 'days'));
    return {
      title: summary,
      description: description?.replace(dblRegex, '') ?? '',
      location: this._isNullOrUrl(location) ? this._formatUrl(location) : `https://www.google.com/maps/search/${location.replace(spaceRegex, '+')}?hl=en`, // check for a url, otherwise assume it's an address
      startIsoString: (new Date(start.dateTime ?? <string>start.date)).toISOString(),
      endIsoString: (new Date(end.dateTime ?? <string>end.date)).toISOString(),
      id: v4(),
      type: dblRegex.test(description) ? 'dbl-meetup' : 'upcoming-event',
      isMultiDay: dayDiff >= 1
    }
  }

  private _isNullOrUrl(location: string): boolean {
    return (location === undefined || location === null) || (new RegExp(urlregex).test(location));
  }

  private _formatUrl(url: string | null | undefined): string {
    if (url === undefined || url === null) { return '' };
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `http://${formattedUrl}`;
    }
    else if(formattedUrl.toLowerCase().startsWith('http://')){
      formattedUrl = formattedUrl.replace(/^http/i,'http');
    }
    else if(formattedUrl.toLowerCase().startsWith('https://')){
      formattedUrl = formattedUrl.replace(/^https/i,'https');
    }
    return formattedUrl;
  }
  private _formatJSON(data: DataResponse) {
    const json: JsonResponse = { upcomingEvents: [], dblMeetups: [] };

    for (let item of data.items) {
      if (dblRegex.test(item.description)) {
        // it's a meetup
        json.dblMeetups.push(this._createSimpleEvent(item));
      }
      else {
        // it's an upcoming events
        json.upcomingEvents.push(this._createSimpleEvent(item));
      }
    }
    return json;
  }

  private _orderJsonBy(json: JsonResponse, orderby: 'start' | 'end') {
    const sortFunc = (ev1: SimpleEvent, ev2: SimpleEvent) => {
      const d1 = orderby === 'start' ? new Date(ev1.startIsoString) : new Date(ev1.startIsoString),
        d2 = orderby === 'start' ? new Date(ev2.endIsoString) : new Date(ev2.endIsoString),
        d1Milliseconds = d1.getTime(),
        d2Milliseconds = d2.getTime();
      if (d1Milliseconds - d2Milliseconds < 0) {
        return -1;
      }
      if (d1Milliseconds - d2Milliseconds > 0) {
        return 1;
      }
      return 0;
    }
    json.upcomingEvents.sort(sortFunc);
    json.dblMeetups.sort(sortFunc);
    return json;
  }

  private async _getResponse(): Promise<CalendarResponse> {
    const resp = await Axios.get<CalendarResponse>(this.url);
    return resp as unknown as CalendarResponse;

  }
  /**
   * Retrieves Google Calendar events and returns them in a simplified result array
   * @param order whether or to order the results
   */
  async getJson(order: boolean = true): Promise<JsonResponse> {
    const data = (await this._getResponse()).data;
    return order ? this._orderJsonBy(this._formatJSON(data), "start") : this._formatJSON(data);
  }
}