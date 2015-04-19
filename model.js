Notes = new Mongo.Collection('notes');

// disable iron-router on the client because we don't use it
Restivus.configure({
  prettyJson: true,
  useClientRouter: false
});
