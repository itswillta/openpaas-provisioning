const ICAL = require('@linagora/ical.js');
const _ = require('lodash');
const Chance = require('chance');
const moment = require('moment');
const { v4: uuidV4 } = require('uuid');
const { events: fakeEvents } = require('./constants');

module.exports = {
  generateFakeEvents
};

function eventAsICal({ location, summary, start, organizer, domainName, duration = 1, numOfAttendees = 0 }) {
  const vCalendar = new ICAL.Component(['vcalendar', [], []]);
  const vEvent = new ICAL.Component('vevent');
  const event = new ICAL.Event(vEvent);

  event.uid = uuidV4();
  event.summary = summary;
  event.location = location;
  event.startDate = ICAL.Time.fromJSDate(start.toDate(), true);
  event.endDate = ICAL.Time.fromJSDate(start.add(duration, 'hour').toDate(), true);

  for (let index = 0; index < numOfAttendees; index++) {
    const attendee = vEvent.addPropertyWithValue('attendee', `MAILTO:user${index}@${domainName}`);

    attendee.setParameter('partstat', 'NEEDS-ACTION');
    attendee.setParameter('rsvp', 'true');
    attendee.setParameter('cn', `John Doe ${index}`);
  }

  vCalendar.addSubcomponent(vEvent);

  vEvent.addPropertyWithValue('organizer', `MAILTO:${organizer.email}`).setParameter('cn', organizer.cn);

  return vCalendar;
}

function generateFakeEvents({ numOfEvents, organizer, domainName, maxNumOfAttendees = 0, weeks = 0 }) {
  const chance = new Chance();
  const events = Array(numOfEvents)
    .fill(0)
    .map(() => ({ ...fakeEvents[_.random(0, fakeEvents.length - 1)] }))
    .map((event) => {
      const start = moment().startOf('isoweek');

      start.add(_.random(0, weeks), 'week');
      start.add(_.random(4), 'day');
      start.hour(event.start ? event.start + _.random(1) : _.random(8, 20));
      event.start = start.startOf('hour');
      event.duration = event.duration || _.random(1, 2);
      event.summary = _.random(1) ? event.title : `${event.title} with ${chance.name()}`;
      event.location = chance.address();

      return event;
    })
    .map(({ location, start, summary, duration }) =>
      eventAsICal({
        location,
        start,
        summary,
        duration,
        organizer,
        domainName,
        numOfAttendees: _.random(0, maxNumOfAttendees),
      })
    );

  return events;
}
