'use strict'

const {MongoClient} = require( 'mongodb' );

var _url = "mongodb://ilmappuser:HnVKCpogmWcE8yU7@0.0.0.0:27017/?authSource=ilmappdata";
// var _url = 'mongodb+srv://ilmappdata:WueTEjO9me3fEb15@ilmappdata.8ynet1r.mongodb.net/';
var _database = "ilmappdata";

const client = new MongoClient(_url);
client.connect();

const db = client.db(_database, {useUnifiedTopology: true});

module.exports = {db}













