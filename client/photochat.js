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
  return user.profile && user.profile.name || user.username || user.emails[0].address || 'Anonymous';
}


// Define the event map - http://docs.meteor.com/#/full/eventmaps
Template.body.events({
  'click #take-photo': function () {
    MeteorCamera.getPicture(cameraOptions, function (error, data) {
      Session.set("photo", data);
      if (error) {
        // e.g. camera permission denied, or unsupported browser (Safari on iOS, looking at you)
        console.log(error);
      } else {
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
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('photoMap', function(map) {
    // Add markers to the map once it's ready

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
      changed: function (newDocument, oldDocument) {
        markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        map.instance.panTo(note.position);
      },

      removed: function (oldDocument) {
        map.instance.panTo(note.position);

        // Remove the marker from the map
        markers[oldDocument._id].setMap(null);

        // Clear the event listener
        google.maps.event.clearInstanceListeners(markers[oldDocument._id]);

        // Remove the reference to this marker instance
        delete markers[oldDocument._id];
      }
    });

  });
});

Meteor.startup(function() {
  GoogleMaps.load();
});
