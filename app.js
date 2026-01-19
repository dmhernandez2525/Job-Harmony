const mongoose = require('mongoose');
const express = require("express");
const app = express();
const db = require('./config/keys').mongoURI;
const likes = require('./routes/api/likes');
const users = require('./routes/api/users');
const passport = require('passport');
const resumes = require('./routes/api/resumes');
const preferences = require('./routes/api/preferences');
const matches = require('./routes/api/matches');
const seeds = require('./routes/api/seeds');
const path = require('path');
const matchers = require('./routes/api/matchers');

const onePages = require('./routes/api/onePages');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

// Use Express built-in middleware instead of body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MongoDB (Mongoose 8.x - no deprecated options needed)
mongoose
  .connect(db)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);

const port = process.env.PORT || 5000;

app.use("/api/resumes", resumes);
app.use("/api/preferences", preferences);
app.use("/api/onePages", onePages);
app.use("/api/users", users);
app.use("/api/matches", matches);
app.use("/api/likes", likes);
app.use("/api/matchers", matchers);
app.use("/api/seeds", seeds);
app.use(express.static('public'))

app.listen(port, () => console.log(`Server is running on port ${port}`));
