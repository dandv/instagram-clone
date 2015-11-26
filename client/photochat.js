Meteor.subscribe('notes');

var cameraOptions = {
  width: 800,
  height: 600
};

// We only have one template, and it only has one helper.
Template.body.helpers({
  // Provide the value for `notes` in {{#each notes}} in the HTML template.
  notes: function () {
    return Notes.find(
      { },
      {
        sort: { timestamp: -1 }
      }
    );
  }
});

// Return a friendly user name
function userName() {
  var user = Meteor.user();
  if (!user) return 'Anonymous';
  return user.profile && user.profile.name || user.username || user.emails[0].address || 'Anonymous';
}


// Define the event map - http://docs.meteor.com/#/full/eventmaps
Template.body.events({
  'click #take-photo': function () {
    MeteorCamera.getPicture(cameraOptions, function (error, data) {
      if (error) {
        // e.g. camera permission denied, or unsupported browser (Safari on iOS, looking at you)
        console.log(error);
      } else {
        // Insert a note in the client's collection; Meteor will persist it on the server.
        Notes.insert({
          photo: data,
          timestamp: new Date(),
          position: Geolocation.latLng(),
          userId: Meteor.userId(),
          userName: userName()  // denormalize so we don't have to look up the user's name separately
        });
      }
    });
  },

  'submit form': function (event, template) {
    var noteText = template.find('#message-input').value;
    if (noteText) {
      // Client-side collection operations are secured by allow/deny rules in ../server/notes.js.
      // Better yet, see https://www.discovermeteor.com/blog/meteor-methods-client-side-operations/
      Notes.insert({
        note: noteText,
        timestamp: new Date(),
        position: Geolocation.latLng(),
        userId: Meteor.userId(),
        userName: userName()
      });
      template.find('#message-input').value = '';  // clear the field after saving
    }
    return false;  // calls preventDefault() to not submit the form
  }
  
});


Template.body.helpers({
  photoMapOptions: function() {
    // Make sure the maps API has loaded.
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(31.24227, 121.49695),  // Shanghai
        zoom: 8
      };
    }
  }
});

Template.body.onCreated(function() {
  // When the `ready` callback is called, the map API is ready to interact with.
  GoogleMaps.ready('photoMap', function(map) {
    // local mirror of google.maps.Marker *objects*, used to remove or move them from/on the map
    var markers = {};

    // Get notified of changes to the Notes collection: added, changed or removed note.
    Notes.find().observe({
      added: function (note) {
        console.log('New note arrived');
        if (note.position) {
          // If the user allowed geolocation and we have a position, create a marker for this document.
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(note.position.lat, note.position.lng),
            map: map.instance,
            id: note._id  // store _id in marker to be able to update the Note doc in 'dragend' below
          });

          // This listener lets us drag markers on the map and update their corresponding document.
          google.maps.event.addListener(marker, 'dragend', function(event) {
            Notes.update(marker.id, {
              $set: {
                'position.lat': event.latLng.lat(),
                'position.lng': event.latLng.lng()
              }
            });
          });

          // Pan the map to the new note.
          map.instance.panTo(note.position);

          // Store this marker instance within the markers object.
          markers[note._id] = marker;

        }
      },

      // Handle location changes, such as when the user drag and drops a marker.
      changed: function (newDocument, oldDocument) {
        if (newDocument.position) {
          markers[newDocument._id].setPosition(newDocument.position);
          map.instance.panTo(newDocument.position);
        }
      },

      // Handle deleting a note.
      removed: function (note) {
        if (note.position) {
          map.instance.panTo(note.position);

          // Remove the marker from the map
          markers[note._id].setMap(null);

          // Clear the event listener
          google.maps.event.clearInstanceListeners(markers[note._id]);

          // Remove the reference to this marker instance
          delete markers[note._id];
        }
      }
    });

  });
});


Template.note.events({
  'click .delete': function (event, template) {
    // template.data holds the data context, i.e. the current Note object - http://docs.meteor.com/#/full/template_data
    Notes.remove(template.data._id, function (error) {
      if (error)
        sAlert.error(error.toString(), {effect: 'slide', position: 'top-right', timeout: 3000});
    });
  }
});


Meteor.startup(function() {
  GoogleMaps.load();
  Geolocation.latLng();  // start getting the position so by the time a photo/note is posted, the position is available

  // Shake to undo
  shake.startWatch(function removeLastUserNote() {
    if (Meteor.user()) {

      var lastNoteId = Notes.findOne({
        userId: Meteor.userId()
      }, {
        sort: { timestamp: -1 },
        fields: { _id: 1 }  // don't need any other fields, especially a large `photo`
      })._id;

      Notes.remove(lastNoteId);

      sAlert.success('UNDO - your last note was removed.', {effect: 'jelly', position: 'top', timeout: 5000});
    } else {
      sAlert.error('Please log in to use "Shake to undo"!', {effect: 'slide', position: 'top-right', timeout: 3000});
    }
  });
});
