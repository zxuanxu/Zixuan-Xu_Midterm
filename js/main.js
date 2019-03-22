/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [41.878, -87.6298],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//Firstly map the dataset
var dataset = "https://gist.githubusercontent.com/zxuanxu/dccdfc773995a4d657a29921a83c8488/raw/56aa5a1282ee982cd6a54f0f5bd1221bf879a00f/Divvystations.geojson";

var featureGroup;
var parsedData;

//set up the properties of markers for slide 1
var geojsonMarkerOptions0 = {
    radius: 8,
    fillColor: "#d7191c",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//set up the function to add popup information for each marker
var popupName = function onEachFeature(feature, layer) {
    // does this feature have a name?
    if (feature.properties.Name) {
        layer.bindPopup('<h1>'+feature.properties.Name+'</h1>');
    }
}

$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData,{
      pointToLayer: function (feature, latlng) {
       return L.circleMarker(latlng, geojsonMarkerOptions0);
     },
   onEachFeature: function (feature, layer) {
       // does this feature have a name?
       if (feature.properties['Station Name']) {
           layer.bindPopup(feature.properties['Station Name']);
       }}
 }).addTo(map);
  });
});

//create all the slides
var slide1 = {
  slideNumber: 1,
  title: "The Divvy Stations",
  text: "This map shows all the Divvy bike share stations in Chicago."
};
var slide2 = {
  slideNumber: 2,
  title: "The Divvy Stations in Service",
  text: "This map shows all the Divvy stations that are in service now in Chicago.",
  filter: function(feature) {return feature.properties.Status == 'In Service';}
};
var slide3 = {
  slideNumber: 3,
  title: "The Divvy Stations with Large Capacity",
  text: "This map shows all the in-service Divvy stations that have at least 15 docks available.",
  filter: function(feature) {return feature.properties.Status == 'In Service' && feature.properties['Total Docks'] >= '15';}
};
var slide4 = {
  slideNumber: 4,
  title: "The Divvy Stations with Broken Docks",
  text: "This map shows all the in-service Divvy stations that have broken/unavailable docks.",
  filter: function(feature) {return feature.properties.Status == 'In Service' && feature.properties['Total Docks'] !== feature.properties['Docks in Service'];}
};

var slides = [slide1, slide2, slide3, slide4];

//set up the properties of markers for slide 2
var geojsonMarkerOptions1 = {
    radius: 8,
    fillColor: "#fdae61",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//set up the properties of markers for slide 3
var geojsonMarkerOptions2 = {
    radius: 8,
    fillColor: "#abdda4",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//set up the properties of markers for slide 3
var geojsonMarkerOptions3 = {
    radius: 8,
    fillColor: "#2b83ba",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//set the current slide
var currentSlide = 0;

var addTitle = (title) => {
  $('.sidebar').append(`<h1 id='title'>${title}</h1>`)
};

var addText = (text) => {
  $('.sidebar').append(`<p id='text'>${text}</p>`)
};

var setColor = (color) => {
  $('#map').css('background-color', color)
};

var cleanup = () => {
  $('#title').remove()
  $('#text').remove()
};

//set up the function to remove layer to prepare for a new slide
 var remove = () => {
   map.removeLayer(featureGroup)
 }

//set up the function to add data for the new slide
 var addData = () => {
  featureGroup = L.geoJson(parsedData,{
       filter: function(feature) {
         switch (currentSlide) {
           //return all data points
           case 0: return feature.properties.Status !== '';
           //return in-service stations
           case 1: return feature.properties.Status == 'In Service';
           //return in-service stations with at least 15 docks
           case 2: return feature.properties.Status == 'In Service' && feature.properties['Total Docks'] >= '15';
           //return in-service stations with broken docks: in-service docks > all docks
           case 3: return feature.properties.Status == 'In Service' && feature.properties['Total Docks'] !== feature.properties['Docks in Service'];
         }},
       pointToLayer: function (feature, latlng) {
        //set up the marker options for each slide
         switch (currentSlide) {
           case 0: return L.circleMarker(latlng, geojsonMarkerOptions0);
           case 1: return L.circleMarker(latlng, geojsonMarkerOptions1);
           case 2: return L.circleMarker(latlng, geojsonMarkerOptions2);
           case 3: return L.circleMarker(latlng, geojsonMarkerOptions3);
         }},
         onEachFeature: function (feature, layer) {
             // does this feature have a name?
             if (feature.properties['Station Name']) {
                 layer.bindPopup(feature.properties['Station Name']);
             }}
       }).addTo(map);
 };


//set up the function to show or hide the "next" and "previous" button
//on different slides
var hideShow1 = () => {
  if(currentSlide == 0) {
    $('#next').show();
    $('#previous').show();
  }
  if(currentSlide == 1) {
    $('#next').show();
    $('#previous').show();
  }
  if(currentSlide == 2) {
    $('#next').hide();
    $('#previous').show();
  }
};

var hideShow2 = () => {
  if(currentSlide == 1) {
    $('#next').show();
    $('#previous').hide();
  }
  if(currentSlide == 2) {
    $('#next').show();
    $('#previous').show();
  }
  if(currentSlide == 3) {
    $('#next').show();
    $('#previous').show();
  }
  if(currentSlide == 4) {
    $('#next').hide();
    $('#previous').show();
  }
};

//set up the function to build slide
var buildSlide = (slideObject) => {
  cleanup();
  addTitle(slideObject.title);
  addText(slideObject.text);
  setColor(slideObject.color);
};

//set up the function to change the zoom for slide 3
var zoomIn = () => {
  if (currentSlide == 3) {
    map.setZoom(11.5);
  } else {
    map.setZoom(11);
  }
}


$("#next").click(() => {
  hideShow1();
  currentSlide = currentSlide + 1;
  buildSlide(slides[currentSlide]);
  remove();
  addData();
  zoomIn();
});


$("#previous").click(() => {
  hideShow2();
  currentSlide = currentSlide - 1;
  buildSlide(slides[currentSlide]);
  remove();
  addData();
  zoomIn();
});
