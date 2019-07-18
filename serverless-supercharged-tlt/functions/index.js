const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = {};

const WATCH_REF = '/messages/{messageId}';
const LOG_REF = '/messages_logs';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://serverless-supercharged-tlt.firebaseio.com'
});

exports.transactionLog = functions.database.ref(WATCH_REF).onWrite((change, context) =>
    admin.database().ref(LOG_REF).push().set({
        type: change.before.exists() ? (change.after.exists() ? 'update' : 'delete') : 'create',
        resource: context.resource,
        author: context.auth.uid,
        occuredAt: context.timestamp,
        id: context.eventId
    }));
