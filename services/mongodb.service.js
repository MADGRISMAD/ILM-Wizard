'use strict'

const MongoClient = require( 'mongodb' ).MongoClient;

var _db;
var _url;
var _database;
let _useUnifiedTopology = false;

let client = null;

module.exports = {
    setUrl: function(urlConnection, dataBaseName, unifiedTopology) {
        _url = urlConnection;
        _database = dataBaseName;
        _useUnifiedTopology = unifiedTopology;

        client = new MongoClient(_url, {
            useNewUrlParser: true,
            useUnifiedTopology: unifiedTopology,
        });

        const eventName = "serverDescriptionChanged";
        client.on(eventName, event => {
            console.log(`received ${eventName}: ${JSON.stringify(event, null, 2)}`);
        });
        client.on("serverOpening", event => {
            console.log(`received serverOpening: ${JSON.stringify(event, null, 2)}`);
        });
        client.on("topologyOpening", event => {
            console.log(`received topologyOpening: ${JSON.stringify(event, null, 2)}`);
        });
        client.on("topologyClosed", event => {
            console.log(`received topologyClosed: ${JSON.stringify(event, null, 2)}`);
        });
    },
    connectToServer: async function( callback ) {
        MongoClient.connect( _url,  { useNewUrlParser: true, useUnifiedTopology: _useUnifiedTopology }, function( err, client ) {
            _db  = client.db(_database);
            // console.log("_db", _db);

            // const test = require('assert');

            // const adminDb = client.db(_database).admin();
            // if (_useUnifiedTopology && false) {

            //  adminDb.replSetGetStatus(function(err, callback) {
            //      console.log("callback", callback);
            //      console.log("err", err);
            //  });
            // }
            // adminDb.listDatabases(function(err, callback) {
            //  console.log("callback", callback);
            //  console.log("err", err);
            // });

            return callback( ((err !== null && err !== undefined)? error : null), client);
        });
    },
    getDb: function() {
        return _db;
    },
    getConnectionString:  function () {
        return _url;
    }
};
