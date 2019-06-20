// eslint-disable-next-line prefer-destructuring
const MongoClient = require('mongodb').MongoClient;

const uri =
  'mongodb+srv://MikevPeeren:lvvOzjNXyjsnfRW2@learningnode-6g8uf.mongodb.net/test?retryWrites=true&w=majority';

let database;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true });

const mongoConnect = callback => {
  mongoClient
    .connect()
    .then(client => {
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB!');

      database = client.db();
      callback();
    })
    .catch(() => {});
};

const getDatabase = () => {
  if (database) {
    return database;
  }
  throw new Error('No Database Found!');
};

exports.mongoConnect = mongoConnect;
exports.database = database;
