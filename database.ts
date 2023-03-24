import { MongoClient, Db } from 'mongodb';

let _db: Db;

const mongoConnect = (callback: () => void) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.hg6gnp5.mongodb.net/?retryWrites=true&w=majority`,
  )
    .then((client) => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

export { mongoConnect, getDb };
