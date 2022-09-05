import { JsonResponse } from "../types";

export interface ICalendarRetriever {
  getJson(order: boolean): Promise<JsonResponse>
}