const Joi = require("joi");
const moment = require('moment-timezone');

class AppointmentRequestValidation {
  static freeSlotRequestSchema() {
    return Joi.object().keys({
      date: Joi.date().iso(),
      timezone: Joi.string().valid(...moment.tz.names())
    });
  }
  static createEvents() {
    return Joi.object().keys({
      date: Joi.date().iso(),
      timezone: Joi.string().valid(...moment.tz.names()),
      duration: Joi.number().integer().positive(),
      dateTime: Joi.date().iso(),
    });
  }
  static getEvents() {
    return Joi.object().keys({
      startDate: Joi.date().iso(),
      endDate: Joi.date().min(Joi.ref('startDate')).iso(),
    })
  }
}

module.exports = AppointmentRequestValidation;
