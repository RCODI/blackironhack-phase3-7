var elevator;
var map;
var washedData = [];

String.prototype.capitalizeFirstLetter = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.0902, lng: -95.7192},
	zoom : 4
    });

    var infowindow = new google.maps.InfoWindow({
       content : ""
    });

    var xmlhttp = new XMLHttpRequest();
    var url = "https://data.cdc.gov/api/views/rpjd-ejph/rows.json?accessType=DOWNLOAD";
    xmlhttp.open("GET",url,true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
       if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         var myArr = xmlhttp.responseText;
	 var text = myArr;
	 json = JSON.parse(text);
	 //alert(json.data[10][11]);
	 //document.getElementById("id01").innerHTML = myArr;
       
       for (var i = 10; i<50; i++) {
                var dataLine = [];
                //latitude - 0
                dataLine.push(json.data[i][25][1]);
                //longitude - 1
                dataLine.push(json.data[i][25][2]);
                //name - 2
                dataLine.push(json.data[i][8]);
                //DeadAll - 3
                dataLine.push(json.data[i][11]);
                //DeadYoung - 4
		dataLine.push(json.data[i][17]);
                washedData.push(dataLine);
            };
            //alert(washedData);
	    var numberOfCities = washedData.length;

	    var markers = [];
	    google.maps.event.addListener(map,'idle',function() {
                elevator = new google.maps.ElevationService();
		$.each(markers,function(key,value) {
                   value.setMap(null);
		});

	    var boundBox = map.getBounds();
	    var southWest = boundBox.getSouthWest();
	    var northEast = boundBox.getNorthEast();
	    var lngSpan = northEast.lng() - southWest.lng();
	    var latSpan = northEast.lat() - southWest.lat();

	    var locations = [];
	    for (var j = 0;j < numberOfCities;j++) {
               var location = new google.maps.LatLng(
		       southWest.lat() + latSpan * Math.random(),
		       southWest.lng() + lngSpan * Math.random()
		       );
	       locations.push(location);
	    }

	    var positionalRequest = {
	       'locations':locations
	    };
            
	    elevator.getElevationForLocations(positionalRequest, function(results,status) {
	        if (status === google.maps.ElevationStatus.OK) {
                   var prev_infowindow = false;

	           $.each(results,function(key,value) {
	              //alert(key);
		      markers[key] = new google.maps.Marker({
		          position:{lat:Number(washedData[key][0]),lng:Number(washedData[key][1])},
			  map : map
		      });
			  google.maps.event.addListener(markers[key],'click',function(){
			     if (prev_infowindow) {
			        prev_infowindow.close();
			     }
			     infowindow.setContent(washedData[key][2]);
			     infowindow.open(map,markers[key]);
			     document.getElementById("city-name").innerHTML = "<b>City Name</b>:" + washedData[key][2] + "</em>";
			     var deadAll = washedData[key][3];
			     if (deadAll == null) {
                               deadAll = "No Data Provided";
			     }
			     document.getElementById("DeadAll").innerHTML = "<b>Death toll all causes all age all year</b>: <em>" + deadAll + "</em>";
			     var deadYouth = washedData[key][4];
			      if (deadYouth == null) {
                               deadYouth = "No Data Provided";
			     }
			     document.getElementById("DeathYouth").innerHTML = "<b>Death toll all causes age 25-44 all year</b>: <em>" + deadYouth + "</em>";
                             var w = 200,
                            h = 250;
                            var array  = [];
                            for (var i = 0; i<9; i++) {
                                array[i] = Math.random();
                            }
                            var d = [
                                [
                                    {axis:"Open hours",value:array[0]},
                                    {axis:"Availability",value:array[1]},
                                    {axis:"Freshness",value:array[2]},
                                    {axis:"Distance",value:array[3]},
                                    {axis:"Prices",value:array[4]},
                                    {axis:"Customer ratings",value:array[5]},
                                    {axis:"Personal preference",value:array[6]},
                                    {axis:"Other",value:array[7]},
                                    {axis:"service",value:array[8]}
                                ]
                            ];

                            //document.getElementById("scores").innerHTML = "The final score for this market is <b><em>" + parseInt(score(array)*100) + "</b></em> out of <b><em>100</b></em>";   

			   var mycfg = {
			      w:w,
			      h:h,
			      maxValue:0.6,
			      levels:6,
			      ExtraWidthX:200
			   }
			  //Call function to draw the Radar chart
			  //Will expect that data is in %'s 
			  // RadarChart.draw("#chart",d,mycfg);
			     });
			  });
		      }
	           });
	        });
	    
	    
	    }
	    };
    
}
//show the request function in the text format
function myRequestFunction(arr) {
        var out = "";
        var i;
        for(i = 0; i < arr.length; i++) {
            out += '<a href="' + arr[i].url + '">' + 
            arr[i].display + '</a><br>';
        }
        document.getElementById("id01").innerHTML = out;
    }
// Add a listener for idle event and call getElevation on a random set of marker in the bound

//get the result of whether contains a substring
function contain(str, substr) {
    if(str.indexOf(substr) > -1)
        return "open";
    else
        return "closed";
}

//get the day in a week by the number
function day() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[d.getDay()];
}

//the algorithm for scoring
//you should create your own reasonable methods for calculating scores
function score(data) {
    return data[0]*0.1 + data[2]*0.01 + data[3]*0.11 + data[1]*0.1 + data[4]*0.2 + data[5]*0.1 + data[6]*0.2 + data[7]*0.01 + data[8]*0.01;
}



