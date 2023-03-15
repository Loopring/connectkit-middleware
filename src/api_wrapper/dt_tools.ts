
const covertLocale = (rawLocale: string = 'en') => {
  return rawLocale.replace("_", "-");
};

export function getLocaleDtFromTs(
  ts: number | string,
  locale: string = 'en'
) {
  if (typeof ts === "string") {
    ts = parseInt(ts);
  }
  const dt = new Date(ts).toLocaleString(covertLocale(locale));
  return dt;
}

export function getLocaleDt(dt?: Date, locale: string = 'en') {
  if (dt) {
    return dt.toLocaleString(covertLocale(locale));
  }
  return "";
}

export function getTimestampDaysLater(days: number, date: Date = new Date()) {
  const ts = Math.round(date.getTime() / 1000) + days * 86400;
  return ts;
}

export function getContactInfo(
  _subject: string = "report to loopring website",
  _body: string = "Body Content"
) {
  // const email = process.env.CONTACT_US_EMAIL ?? 'contact@loopring.io'
  return `https://loopring.zohodesk.com/portal/en/newticket`;
}
