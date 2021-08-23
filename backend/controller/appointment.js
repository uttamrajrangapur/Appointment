const AppointmentConfig = require('../config/appointment-config');
const minToMillisecondsConverter = 60 * 1000;
const moment = require('moment-timezone');
const eventCollection = require('../models/events');

function getPossibleSlots(date, startInterval) {
  const endInterval = moment(startInterval).add(1, 'd');
  const result = [];
  const startTime = moment(startInterval).tz(AppointmentConfig.get('timezone')).hour(0).minute(0).second(0).millisecond(AppointmentConfig.get('start_hour_in_milliseconds')).subtract(2, 'days');
  const endTime = moment(startInterval).tz(AppointmentConfig.get('timezone')).hour(0).minute(0).second(0).millisecond(AppointmentConfig.get('end_hour_in_milliseconds')).subtract(2, 'days');
  for(let i = 0; i < 5; i++) {
    while(startTime.isBefore(endTime)) {
      if(startTime.isSameOrAfter(startInterval) && startTime.isBefore(endInterval))
        result.push(startTime.toISOString());
      startTime.add(AppointmentConfig.get('duration'), 'ms');
    }
    startTime.add(1, 'd').hour(0).minute(0).second(0).millisecond(AppointmentConfig.get('start_hour_in_milliseconds'));;
    endTime.add(1, 'd').hour(0).minute(0).second(0).millisecond(AppointmentConfig.get('end_hour_in_milliseconds'));
  }
  return result;
}

function convertIntoRequiredTimezone(slots, timezone = 'UTC') {
  const requiredSlots = [];
  slots.forEach(slot => {
    requiredSlots.push(moment(slot).tz(timezone).format());
  })
  return requiredSlots;
}

async function getFreeSlots(req, res, next) {
  try {
    const date = req.query.date;
    const startInterval = moment.tz(req.query.date, req.query.timezone).hour(0).minute(0).second(0).millisecond(0);
    let result = getPossibleSlots(date, startInterval);
    result = convertIntoRequiredTimezone(result);
    
    let events = await eventCollection.getEvents(
      ['startTime', '>', moment.tz(date, req.query.timezone).hour(0).minute(0).second(0).millisecond(0).toDate()], 
      ['endTime', '<', moment.tz(date, req.query.timezone).hour(23).minute(59).second(59).millisecond(999).toDate()]
    );
    result = result.filter(res => {
      return !events.find(e =>  {
        if(moment(res).isSameOrAfter(moment(e.data.startTime)) && moment(res).add(AppointmentConfig.get('duration'), 'ms').isSameOrBefore(moment(e.data.endTime)))
          return true;
      })
    })
    result = convertIntoRequiredTimezone(result, req.query.timezone);
    res.status(200);
    return res.json({ slots: result});
  } catch (error) {
    next(error);
  }
}

async function createEvents(req, res, next) {
  try {
    const data = req.body;
    if(data.duration % Number(AppointmentConfig.get('duration'))  !== 0) {
      res.status(400);
      return res.json({ error: `Duration should be ${AppointmentConfig.get('duration')} Milliseconds`});
    }
    const date = moment(data.dateTime).utc();
    const slotBooked = await eventCollection.getEvents(
      ['startTime', '>=', date.toDate()],
      ['endTime', '<=', date.add(AppointmentConfig.get('duration'), 'ms').toDate()]
    )
    if(slotBooked.length) {
      res.status(400);
      return res.json({ error: `Slot already booked`});
    }
    await eventCollection.createEvent(data, {
      date: date.format('YYYY-MM-DD'),
      startTime: moment(data.dateTime).utc().toDate(),
      endTime: moment(data.dateTime).utc().add(AppointmentConfig.get('duration'), 'ms').toDate(),
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function getEvents(req, res, next) {
  try {
    const data = req.query;
    const events = await eventCollection.getEvents(['startTime', '>=', moment(data.startDate).toDate()], ['endTime', '<=', moment(data.endDate).toDate()]);
    res.status(200);
    res.json({ data: { events }});
  } catch (error) {
    next(error);
  }
}

async function healthCheck(req, res, next) {
    res.sendStatus(204);
}

module.exports = {
  getFreeSlots,
  createEvents,
  getEvents,
  healthCheck,
};