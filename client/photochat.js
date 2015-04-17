Meteor.subscribe('notes');

var cameraOptions = {
  width: 800,
  height: 600
};

// provide the value for `notes` in {{#each notes}} in the HTML
Template.body.helpers({
  notes: function () {
    return Notes.find(
      { },
      {
        sort: { timestamp: -1 }
      }
    );
  }  
});

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
        // insert a note in the client's collection; Meteor will persist it on the server
        Notes.insert({
          photo: data,
          timestamp: new Date(),
          position: Geolocation.latLng(),
          userId: Meteor.userId(),
          userName: userName()
        });
      }  
    });
  },
  
  'submit form': function (event, template) {
    var noteText = template.find('#message-input').value;
    if (noteText) {
      // this is obviously insecure, but works great for demo purposes; allow/deny rules can be specified on the server
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
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(31.24227, 121.49695),
        zoom: 8
      };
    }
  }
});

Template.body.onCreated(function() {
  // When the `ready` callback is called, the map API is ready to interact with
  GoogleMaps.ready('photoMap', function(map) {
    // local mirror of google.maps.Marker *objects*, used to remove or move them from/on the map
    var markers = {};

    Notes.find().observe({
      added: function (note) {
        console.log('New note arrived');
        if (note.position) {
          // Create a marker for this document
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(note.position.lat, note.position.lng),
            map: map.instance,
            // We store the document _id on the marker in order
            // to update the document within the 'dragend' event below.
            id: note._id
          });

          // This listener lets us drag markers on the map and update their corresponding document.
          google.maps.event.addListener(marker, 'dragend', function(event) {
            Notes.update(marker.id, { $set: { 'position.lat': event.latLng.lat(), 'position.lng': event.latLng.lng() }});
          });

          // pan the map to the new note
          map.instance.panTo(note.position);

          // Store this marker instance within the markers object.
          markers[note._id] = marker;

        }
      },
      
      // We haven't implemented user-modifiable locations yet, but this is how we'd handle that:
      changed: function (newDocument, oldDocument) {
        if (newDocument.position) {
          markers[newDocument._id].setPosition(newDocument.position);
          map.instance.panTo(newDocument.position);
        }  
      },

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

Meteor.startup(function() {
  GoogleMaps.load();
  Geolocation.latLng();  // start getting the position so by the time a photo/note is posted, the position is available
});
