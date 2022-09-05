import { CalendarRetriever } from './controllers';
import { S3 } from 'aws-sdk';
import { Context, S3Event } from 'aws-lambda';
import { ICalendarRetriever } from './interfaces';

const calRetriever: ICalendarRetriever = new CalendarRetriever(),
  s3 = new S3({
    region: 'us-west-2'
  });

export const handler = async (e: S3Event, ctx: Context): Promise<void> => {
  const json = await calRetriever.getJson(true);

  try {
    await s3.upload({
      Bucket: 'denverbicyclelobby.com',
      Key: 'dbl-events.json',
      Body: JSON.stringify(json),
      ContentType: 'application/json',
      CacheControl: 'no-store,max-age=0'
    }).promise();
  } catch (e) {
    console.log(e);
  }
}
