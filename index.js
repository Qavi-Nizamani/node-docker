const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h2>Hi 2!!!</h2>');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('I am always running: ', port);
});
