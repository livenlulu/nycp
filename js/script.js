var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

var NTAleaflet = {};

var map = L.map('myMap',{tap:false}).setView( [40.731649,-73.924255], 11);
map.addLayer(layer);

var rentData = [];
rentData[0]={};
var currid=0;
var med=0;
var currNTAname;
    
var chart;
var chart2;

  $("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
    });

var geojson;

  $.getJSON('data/dem.geojson', function(data) {
    geojson = L.geoJson(data, {
    	style: style,
    	onEachFeature: onEachFeature
    }).addTo(map);
    updateChart(data.features[currid].properties);
    updateChart2(data.features[currid].properties);
  });

  function getColor(d) {

    return d > 10000000 ? '#444' :
           d > 8000000  ? '#444' :
           d > 6000000  ? '#444' :
           d > 3000000  ? '#444' :
           d > 800000  ? '#444' :
           d > 500000  ? '#444' :
           d > 200000  ? '#444' :
                     '#444' ;

     // return d > 10000000 ? '#900410' :
     //       d > 8000000  ? '#BD0026' :
     //       d > 6000000  ? '#E31A1C' :
     //       d > 3000000  ? '#FC4E2A' :
     //       d > 800000  ? '#FD8D3C' :
     //       d > 500000  ? '#FEB24C' :
     //       d > 200000  ? '#FED976' :
     //                 '#FFEDA0' ;
  }

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.ALLOCATED_FUNDS),
        weight: .6,
        opacity: 1,
        color: '#fff',
        dashArray: '0',
        fillOpacity: 0.9
    };
  }

  function highlightNTA(leafletid){
    var layer = geojson._layers[leafletid];
    layer.setStyle({
        weight: 5,
        opacity: 0.5,
        color: '#FFF000',
        dashArray: '',
        fillOpacity: 0.7
    });
    updateChart(layer.feature.properties);
    updateChart2(layer.feature.properties);
    $('#side2').html('<h3>' + layer.feature.properties.Name + ' ' + layer.feature.properties.NTACode + '</h3>');
  }

  function resetHighlightNTA(leafletid) {
    geojson.resetStyle(geojson._layers[leafletid]);
  }

  function mouseoverFunction(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        opacity: 0.5,
        color: '#000',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    // try updatechart
    updateChart(e.target.feature.properties);
    updateChart2(e.target.feature.properties);
    //updateChart3(e.target.this.series.xAxis.categories);

    currNTAname = e.target.feature.properties.NTAName;
    console.log(currNTAname);

    // console.log(layer.feature.properties.VALUE2);
    $('#side').html('<h3>' + layer.feature.properties.Name + ' ' + layer.feature.properties.NTACode +'</h3>' + '<h4>' + 'Total Population' + '</h4>'); 	
    $('#side2').html('<h3>' + layer.feature.properties.Name + ' ' + layer.feature.properties.NTACode + '</h3>');}
   

    function resetHighlight(e) {
    geojson.resetStyle(e.target);
    }

    function onEachFeature(feature, layer) {
    NTAleaflet[feature.properties.NTAName] = layer._leaflet_id;
    //console.log(feature);
    //console.log(layer);
    layer.on({
        mouseover: mouseoverFunction,
        mouseout: resetHighlight
        //click: zoomToFeature
    });
  }

  //dropdown scroll
  $(".dropdown-menu li a").click(function(){
  var selText = $(this).text();
  $(this).parents('.dropdown').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
  });

  //bar chart
  nv.addGraph(function() {
    chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .staggerLabels(true)
      .showValues(true)
      .margin({left:0,right:0})
      .color(['rgb(189, 195, 199)','rgb(166, 172, 175)','rgb(144, 148, 151)','rgb(121, 125, 127)'])

      .valueFormat(function(d){
          return Math.round(d * 10)/10;
        });
      ;
    nv.utils.windowResize(chart.update);

    return chart;
  });


  //Each bar represents a single discrete quantity.
  function updateChart(f){

    rentData[0].key = "vacancyrent";
    rentData[0].values =
      [
          { 
            "label" : "Total Population 2010" , 
            "value" : f.pop10
          } , 
          { 
            "label" : "Total Population 2015" , 
            "value" : f.pop15
          } ,
           { 
            "label" : "Projected Population 2020" , 
            "value" : f.pop20
          },
          { 
            "label" : "Projected Population 2025" , 
            "value" : f.pop25
          } 
        ]
      d3.select('#chart svg')
      .datum(rentData)
      .transition().duration(500)
      .call(chart);
  }

  nv.addGraph(function() {
    chart2 = nv.models.discreteBarChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .staggerLabels(true)
      .showValues(true)
      .margin({left:0,right:0})
      .color(['rgb(189, 195, 199)','rgb(166, 172, 175)','rgb(144, 148, 151)','rgb(121, 125, 127)'])
      .valueFormat(function(d){
          return Math.round(d * 10)/10;
        });
      ;

    nv.utils.windowResize(chart2.update);

    return chart2;
  });


  //Each bar represents a single discrete quantity.
  function updateChart2(f2){

    rentData[0].key = "vacancyrent";
    rentData[0].values =
      [
          { 
            "label" : "Child (<5)" , 
            "value" : f2.child
          } , 
          { 
            "label" : "Youth (5-19)" , 
            "value" : f2.youth
          } ,
           { 
            "label" : "Adult (20-60)" , 
            "value" : f2.adult
          },
          { 
            "label" : "Senior (>60)" , 
            "value" : f2.senior
          } 
        ]
      d3.select('#chart2 svg')
      .datum(rentData)
      .transition().duration(0)
      .call(chart2);
    
  }
