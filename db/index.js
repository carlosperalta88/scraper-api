const mongoose = require('mongoose');
const DB_URI = 'mongodb://localhost:27017/test-scraper';

function connect() {
  return new Promise((resolve, reject) => {

    if (process.env.NODE_ENV === 'test') {
      const Mockgoose = require('mockgoose').Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage()
        .then(() => {
          mongoose.set('useNewUrlParser', true)
          mongoose.set('useCreateIndex', true)
          mongoose.set('useUnifiedTopology', true)
          mongoose.connect(DB_URI)
            .then((res, err) => {

              if (err) return reject(err);
              resolve();
            })
        })
    } else {
      mongoose.set('useNewUrlParser', true)
      mongoose.set('useCreateIndex', true)
      mongoose.set('useUnifiedTopology', true)
      mongoose.connect(DB_URI)
        .then((res, err) => {
          if (err) return reject(err);
          resolve();
        })
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };