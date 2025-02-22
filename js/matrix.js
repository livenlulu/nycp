var ntaNames = [];
var currMatrixNTA;
var geo = $.getJSON( "data/cfa.geojson", function(data) {
  for (var item in geo.responseJSON.features){
    var prop = geo.responseJSON.features[item].properties;
    ntaNames.push(prop.NTAName);
    //ntaDict[prop.NTAName] = item;
};});

var chart3Data = [];
chart3Data[0]={};
var chart3;

var xLabels = ["Inefficient", "Efficient"];

$(function updateChart3() {
    chart3Data[0].key = 'prop.NTAName';
    chart3Data[0].values = 'this.series.yAxis.categories';

        $.get('data/nta2.csv', function(csv) {
         $('#matrix').highcharts({


        chart: {
            type: 'heatmap',
            marginTop: 30,
            marginBottom: 50,
            // width: 1300,
            // height: 250,
            backgroundColor: '#fff',
            style: {
               fontFamily: "Maven Pro"
                }
        },

        exporting: { 
            enabled: false 
        },

        itemStyle: {
           color: '#E0E0E3'
        },

        itemHoverStyle: {
           color: '#FFF'
        },

        itemHiddenStyle: {
           color: '#365775'
        },

        title: {
            text: ''
        },

        xAxis: {
            minorTickLength: 0,
            tickLength: 0,
            categories: ntaNames,
            labels: {
                format: '{value}'
            }
        },

        yAxis: {
            categories: ['Daycare','Youth','Parks','Library'],
            title: null,
            style: {
               fontFamily: "Maven Pro"
                }
        },


        colorAxis: {
            stops: [
                                       
            [0,'#9E0142'],
            [0.05,'#F46D43'],
            [0.25,'#FDAE61'],
            [0.4,'#E6F598'],
            [0.5,'#ABDDA4'],
            [1,'#0C2943']

            ],
            
            min: 0,
            

            labels: {
                formatter: function() {
                    return xLabels[this.value];
                    }
                }

            },

            style: {
              plotBorderColor: '#FFFFFF'
            },

            plotOptions: {
                candlestick: {
                lineColor: '#ffffff'
            }
        },

        legend: {
            align: 'top',
            layout: 'horizontal',
            
            margin: 0,
            verticalAlign: 'middle',
            y: 118,
            x: 45,
            
            symbolHeight: 8
        },

        tooltip: {
            formatter: function () {
                //console.log(currMatrixNTA);

                if (currMatrixNTA){
                    //if there's previous value
                    resetHighlightNTA(currMatrixNTA);
                }
                
                if (this.series.xAxis.categories[this.point.x]){
                    var curr = this.series.xAxis.categories[this.point.x];
                    currMatrixNTA = NTAleaflet[curr];
                    console.log(NTAleaflet[curr]);
                    highlightNTA(NTAleaflet[curr]);
                }
                //highlight corresponding polygon

                return 'The <b>' + this.series.yAxis.categories[this.point.y] + '</b> rate is <br><b>' +
                Math.round((this.point.value) * 100) + '</b>% in <br><b>' + this.series.xAxis.categories[this.point.x] + '</b>';
            }
        },

        credits : {
            enabled: false
        },

        data: {
            csv: csv
        },

        plotOptions: {
            series: {
                states: {
                    hover: {
                        color: '#365775',
            borderWidth: 2// or what ever colour you want 'rgb(255,0,0)'
        }
    }
}
},

series: [{
    name: 'Sales per employee',
    borderWidth: 1,
    borderColor: '#F5F5F3',

            // borderRadius: '30px',
            dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                    textShadow: 'none',
                    HcTextStroke: null
                }
            }


        }]

    });
});

});