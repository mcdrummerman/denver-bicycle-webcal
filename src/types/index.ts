export type CalendarItem = {
  kind: string,
  etag: string,
  id: string,
  status: string,
  htmlLink: string,
  created: string, // ISO Date String
  updated: string,// ISO Date String
  summary: string,
  description: string, // event description
  location: string,
  creator: {
    email: string
  },
  organizer: {
    email: string,
    displayName: string,
    self: boolean
  },
  start: {
    dateTime?: string,
    date?: string
  },
  end: {
    dateTime?: string,
    date?: string
  },
  iCalUID: string,
  sequence: number,
  extendedProperties: {
    shared: {
      zmMeetingNum: number
    }
  },
  hangoutLink: string,
  conferenceData: {
    entryPoints: [
      {
        entryPointType: "video" | string,
        uri: string,
        label: string
      },
      {
        entryPointType: "more" | string,
        uri: string,
        pin: number
      },
      {
        regionCode: "US",
        entryPointType: "phone",
        uri: string,
        label: string,
        pin: number
      }
    ],
    conferenceSolution: {
      key: {
        type: "hangoutsMeet"
      },
      name: string,
      iconUri: string
    },
    conferenceId: string,
    signature: string
  },
  guestsCanInviteOthers: boolean
};
export type DataResponse = {
  kind: string,
  description: string,
  etag: string,
  summary: string,
  updated: string, // ISO STRING DATE
  timeZone: string, // America/Denver,
  nextSyncToken: string
  items: CalendarItem[]
};
export type CalendarResponse = {
  data: DataResponse,
  headers: any
};

export type SimpleEvent = {
  startIsoString: string,
  endIsoString: string,
  description: string,
  location: string,
  title: string,
  id: string,
  type: MeetingType,
  isMultiDay: boolean;
}

export type MeetingType = 'dbl-meetup' | 'upcoming-event';

export type JsonResponse = { upcomingEvents: SimpleEvent[], dblMeetups: SimpleEvent[] };
