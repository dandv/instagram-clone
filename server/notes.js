Meteor.publish('notes', function () {
  return Notes.find(
    { },
    { sort: { timestamp: -1 } }
  )
});

Meteor.startup(function () {
  Restivus.addCollection(Notes, {
    endpoints: {
      get: {
        action: function () {
          var note = Notes.findOne(this.urlParams.id);
          if (note.photo) note.photo = '/api/notes/' + note._id + '/photo';
          return note;
        }
      },
      getAll: {
        action: function () {
          return {
            status: "success",
            data: Notes.find(
              { },
              { sort: {timestamp: -1},
                transform: function (note) {
                  if (note.photo)
                    note.photo = '/api/notes/' + note._id + '/photo';
                  return note;
                }
              }
            ).fetch()
          };
        }
      }
    }
  });

  Restivus.addRoute('notes/:id/photo', {authRequired: false}, {
    get: function () {
      var note = Notes.findOne(this.params.id);
      if (note) {
        return 'foo"bar';
        return {
          headers: {
            'Content-Type': 'text/plain'
          },
          //body: new Buffer(note.photo.slice(0), 'base64').toString()  // var buf = new Buffer(b64string, 'base64');
          // http://stackoverflow.com/questions/6182315/how-to-do-base64-encoding-in-node-js
          // or https://github.com/meteor/meteor/tree/devel/packages/base64
          body: '<img src=' + note.photo + '>'
        };
      }
      return {
        statusCode: 404,
        body: {status: 'fail', message: 'Note not found'}
      };
    }
  });

});