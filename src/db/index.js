/* eslint-disable require-jsdoc */
const mongoose = require('mongoose');
const DB_URI = process.env.DB_URI

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
                .then((_res, err) => {
                  if (err) return reject(err);
                  resolve();
                })
          })
    } else {
      mongoose.set('useNewUrlParser', true)
      mongoose.set('useCreateIndex', true)
      mongoose.set('useUnifiedTopology', true)
      mongoose.set('useFindAndModify', false)
      mongoose.connect(DB_URI)
          .then((_res, err) => {
            if (err) return reject(err);
            resolve();
          })
    }
  });
}

function close() {
  return mongoose.disconnect();
}

function drop(done) {
  if (process.env.NODE_ENV === 'test') {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connection.close(done)
    })
  }
}

export default {connect, close, drop}
