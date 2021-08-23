const db = require('./index');
const { v4: uuidv4 } = require('uuid');
const { intersectionBy } = require('lodash');
const moment = require('moment-timezone');

async function createEvent(id, data) {
  const docRef = db.collection('events').doc(uuidv4());
  return docRef.set(data);
}

function convertDatabaseObjectToJsonObject(arr) {
  let result = [];
  arr.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
    result.push({
      id: doc.id,
      data: doc.data()
    })
  });
  result = result.map(res => {
    return {
      id: res.id,
      data: {
        date: res.data.date,
        endTime: res.data.endTime.toDate(),
        startTime: res.data.startTime.toDate(),
      }
    }
  })
  return result;
}

async function getEvents(from, to) {
  let events1 = await db.collection('events').where(...from).get();
  events1 = convertDatabaseObjectToJsonObject(events1);
  let events2 = await db.collection('events').where(...to).get();
  events2 = convertDatabaseObjectToJsonObject(events2);
  const events = intersectionBy(events1, events2, (obj) => obj.id);
  return events;
}

async function isSlotBooked(from, to, date) {
  let events1 = await db.collection('events').where('date', '==', date).where(...from).get();
  events1 = convertDatabaseObjectToJsonObject(events1);
  let events2 = await db.collection('events').where(['date', '==', date]).where(...to).get();
  events2 = convertDatabaseObjectToJsonObject(events2);
  const events = intersectionBy(events1, events2, (obj) => obj.id);
  return events;
}

module.exports = {
  createEvent,
  getEvents,
  isSlotBooked,
}