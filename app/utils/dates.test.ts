import { differenceInMilliseconds } from "date-fns";

import { toISO8601, fromISO8601, formatDate } from './dates';

describe('date utils', () => {
  it('should translate a date to string and back consistently', () => {
    const date = new Date('2021-12-31T16:30:45-06:00');
    const isoString = toISO8601(date);
    const newDate = fromISO8601(isoString);
    expect(differenceInMilliseconds(newDate, date)).to.equal(0);
  })
  it('should translate a date to string and back consistently', () => {
    const dateString = '2021-12-31T17:00:00-06:00';
    const date = fromISO8601(dateString);
    expect(differenceInMilliseconds(date, new Date(dateString))).to.equal(0);
  })
  it('should format a date based on the tokens provided', () => {
    const date = new Date('2021-12-31T12:00:45-05:00');
    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    expect(formattedDate).to.equal('2021-12-31');
  })
  it('should throw an error if the date format is invalid', () => {
    expect(() => formatDate('invalid', 'yyyy-MM-dd')).to.throw('Invalid date invalid');
  })
})
