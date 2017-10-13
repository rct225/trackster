var Trackster = {};

const API_KEY = config.API_KEY;

$(document).ready(function() {
  $('#search-button').click(function() {
    Trackster.searchTracksByTitle($('#search-input').val());
  });
  $('#search-input').keypress( function (e) {
    var key = e.which;
    if (key == 13) {
        Trackster.searchTracksByTitle($('#search-input').val());
    }
  });
  sorttable.makeSortable($("#songs"));
})

/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  $('h1').removeClass("animated shake")
  $('#track-list').empty("");
  for (let i = 0; i < tracks.length; i++) {
    function callback(data){
      var albumArt = tracks[i].image[1]["#text"];
      var albumMbid = tracks[i].mbid;
      var albumName;
      if (data.error) {
        albumName = "";
      } else if (data.track.album) {
        albumName = data.track.album.title;
      } else {
        albumName = ""
      }
      var trackRowHtml = `<tr class="track">
        <td class="col-xs-1">
          <a href="${tracks[i].url}" target="_blank">
            <i class="fa fa-play-circle-o fa-2x play-button" aria-hidden="true"></i>
          </a>
        </td>
        <td class="col-xs-2">${tracks[i].name}</td>
        <td class="col-xs-2">${tracks[i].artist}</td>
        <td class="col-xs-2">${albumName}</td>
        <td lass="col-xs-2">
          <img src="${albumArt}">
        </td>
        <td class="col-xs-2">${numeral(tracks[i].listeners).format('0,0')}</td>
      </tr>`
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
  $('h1').addClass("animated shake");
  $.ajax({
    url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + title + "&api_key=" + API_KEY + "&format=json",
    success: function(response) {
      Trackster.renderTracks(response.results.trackmatches.track);
    }
  });
};
