const express = require('express');
const mongoose = require('mongoose');
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require('./config/config');
const session = require('express-session');
const redis = require('redis');
let RedisStore = require('connect-redis')(session);

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
let redisClient = redis.createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
  legacyMode: true,
});
redisClient.connect();
redisClient.on('connect', (err) => {
  if (err) throw err;
  else console.log('Redis Connected..!');
});

const app = express();

const connectWithRetry = () => {
  mongoose
    .connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mydb?authSource=admin`,
    )
    .then(() => console.log('Successfully connected'))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

app.enable('trust proxy');
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 60 * 1000,
      // maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
app.use(express.json());
app.get('/api/v1', (req, res) => {
  res.send('<h2>Hi</h2>');
  console.log('yeah it ran');
});

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('I am always running: ', port);
});
