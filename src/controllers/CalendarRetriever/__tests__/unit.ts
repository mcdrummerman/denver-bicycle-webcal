import { CalendarRetriever } from '..';
import { expect } from 'chai';
import {
  goodUrls,
  goodUrlsWithHTTPScheme,
  goodUrlsWithHTTPSScheme,
  goodUrlsWithoutScheme,
  urlThatShouldRemainUnchanged
} from './data';
import { CalendarItem, SimpleEvent, DataResponse, JsonResponse, CalendarResponse } from '../../../types';
import { ICalendarRetriever } from '../../../interfaces';

interface ICalendarRetrieverTest extends ICalendarRetriever {
  _createDateString(date: Date): string;
  _getDaysInMiliseconds(days: number): number;
  _getStartDate(): string;
  _getEndDate(): string;
  url: string
  _createSimpleEvent(item: CalendarItem): SimpleEvent
  _isNullOrUrl(location: string): boolean
  _formatJSON(data: DataResponse): JsonResponse
  _formatUrl(url: string | null | undefined): string
  _orderJsonBy(json: JsonResponse, orderby: 'start' | 'end'): JsonResponse
  _getResponse(): Promise<CalendarResponse>
}

describe('CalendarRetriever', () => {
  const calRetriever = new CalendarRetriever() as unknown as ICalendarRetrieverTest;
  describe('_isNullOrUrl', () => {
    it('should return true for good urls', () => {
      goodUrls.forEach((url) => {
        expect(calRetriever._isNullOrUrl(url)).to.equal(true);
      })
    })
  })
  describe('_formatUrl', () => {
    it('should return lower case SCHEME for HTTP urls', () => {
      goodUrlsWithHTTPScheme.forEach((url) => {
        expect(calRetriever._formatUrl(url)).to.equal(url.replace(/^http/i, 'http'));
      })
    })
    it('should return lower case SCHEME for HTTPS urls', () => {
      goodUrlsWithHTTPSScheme.forEach((url) => {
        expect(calRetriever._formatUrl(url)).to.equal(url.replace(/^https/i, 'https'));
      })
    })
    it('should not change the caseing of the URL body', () => {
      expect(calRetriever._formatUrl(urlThatShouldRemainUnchanged)).to.equal(urlThatShouldRemainUnchanged);
    })
    it('should return empty string for null or undefinied', () => {
      expect(calRetriever._formatUrl(null)).to.equal('');
      expect(calRetriever._formatUrl(undefined)).to.equal('');
    })
    it('should add http to strings missing the scheme', () => {
      goodUrlsWithoutScheme.forEach((url) => {
        expect(calRetriever._formatUrl(url)).to.equal(`http://${url}`);
      })
    })
  })
})


