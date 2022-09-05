export const goodUrls = [
  'example.com',
  'WWW.example.com',
  'example.co',
  'www.example.co',
  'https://example.com',
  'http://example.com',
  'Https://example.com',
  'Http://example.com',
  'www.example.com',
  'https://www.example.com',
  'http://www.example.com',
  'Https://www.example.com',
  'Http://www.example.com',
];

export const urlThatShouldRemainUnchanged = 'http://Bitly.ly/IsCaseSensitive';

export const goodUrlsWithScheme = goodUrls.filter(val => val.toLocaleLowerCase().startsWith('http'));
export const goodUrlsWithHTTPScheme = goodUrlsWithScheme.filter(val=>val.startsWith('http:'));
export const goodUrlsWithHTTPSScheme = goodUrlsWithScheme.filter(val=>val.startsWith('https:'));
export const goodUrlsWithoutScheme = goodUrls.filter(val => !val.toLocaleLowerCase().startsWith('http'));