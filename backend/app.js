const express = require('express');
const jsonErrorHandler = require('./packages/error-handler');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
const router = require('./routes/appointment');
const port = 3000;

app.use('/api', router);
app.use(jsonErrorHandler); 
app.listen(port, () => {
  console.log(`Appointment is listening at ${port}`);
});