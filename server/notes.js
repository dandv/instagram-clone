Meteor.publish('notes', function () {
  return Notes.find(
    { },
    { sort: { timestamp: -1 } }
  )
});
