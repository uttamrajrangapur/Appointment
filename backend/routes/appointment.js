const express = require('express');
const router = express.Router();
const requestSchemaValidator = require('../validator/index');
const AppointmentRequestSchema = require('../validator/schema/appointment');
const {
  getFreeSlots, createEvents, getEvents,
  healthCheck,
} = require('../controller/appointment');

router.get('/free_slots', requestSchemaValidator(AppointmentRequestSchema.freeSlotRequestSchema()), getFreeSlots);
router.put('/events', requestSchemaValidator(AppointmentRequestSchema.createEvents()), createEvents);
router.get('/events', requestSchemaValidator(AppointmentRequestSchema.getEvents()), getEvents);
router.get('/health-check', healthCheck);
module.exports = router;