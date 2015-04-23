Meteor.publish('notes', function () {
  return Notes.find(
    { },
    { sort: { timestamp: -1 } }
  )
});

Meteor.startup(function () {
  // All values listed below are default
  collectionApi = new CollectionAPI({
    apiPath: 'api',                   // API path prefix
    standAlone: false,                // Run as a stand-alone HTTP(S) server
    allowCORS: true                   // Allow CORS (Cross-Origin Resource Sharing)
  });

  // Add the collection Notes to the API "/notes" path
  collectionApi.addCollection(Notes, 'notes', {
    // All values listed below are default
    authToken: undefined,                   // Require this string to be passed in on each request.
    authenticate: undefined, // function(token, method, requestMetadata) {return true/false}; More details can found in [Authenticate Function](#Authenticate-Function).
    methods: ['POST','GET','PUT','DELETE']  // Allow creating, reading, updating, and deleting
  });

  // Starts the API server
  collectionApi.start();
});