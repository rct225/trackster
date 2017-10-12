var Trackster = {};

const API_KEY = config.API_KEY;

$(document).ready(function() {
  $('#search-button').click(function() {
    Trackster.searchTracksByTitle($('#search-input').val());
  });

})
/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  $('#track-list').empty("");
  for (let i = 0; i < tracks.length; i++) {
    function callback(data){
      var albumArt = tracks[i].image[1]["#text"];
      var albumMbid = tracks[i].mbid;
      var albumName;
      if (data.error) {
        albumName = "";
      } else {
        albumName = data.track.album.title;
      }
      //albumName = data;
      var trackRowHtml = `<div class="row track">
        <div class="col-xs-offset-1 col-xs-1">
          <a href="${tracks[i].url}" target="_blank">
            <i class="fa fa-play-circle-o fa-2x play-button" aria-hidden="true"></i>
          </a>
        </div>
        <div class="col-xs-2">${tracks[i].name}</div>
        <div class="col-xs-2">${tracks[i].artist}</div>
        <div class="col-xs-2">${albumName}</div>
        <div class="col-xs-2">
          <img src="${albumArt}">
        </div>
        <div class="col-xs-2">${tracks[i].listeners}</div>
      </div>`;
      $('#track-list').append(trackRowHtml);
    };

    $.ajax ({
        //async: false,
        // url: "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&mbid=" + albumMbid + "&api_key=" + API_KEY + "&format=json",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&artist=" + tracks[i].artist + "&track=" + tracks[i].name + "&api_key=" + API_KEY + "&format=json",
    }).done( function(data) {
      callback(data);
    })
    //console.log(albumName);
  }
};

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
  $.ajax({
    url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + title + "&api_key=" + API_KEY + "&format=json",
    success: function(response) {
      Trackster.renderTracks(response.results.trackmatches.track);
    }
  })
};
