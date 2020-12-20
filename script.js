// used as a reference: https://proulxp.github.io/CS290-How-To-Guide/rover.html
var URL;
var sol;
var camera;
var photoNumber = -1;
var response;
var apiKey = 'S3AhPnemtoazzzbgHkarE4Jr6LovQcXe1GrRsBiH';
var request;
var dictionary;

var roverNames;
var roverDates;
var roverDescription;

function getManifestEndpoint(){
    var URL = "https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity";

    request = new XMLHttpRequest(); 
    request.open('GET', URL + '?api_key=' + apiKey, true);

    request.addEventListener('load',function(){
        if(request.status >= 200 && request.status < 400){
            response = JSON.parse(request.responseText);
            dictionary = Array(response.photo_manifest.max_sol + 1);
            var counter = 0;
            for (var i = 0; counter < response.photo_manifest.max_sol; i++){
                counter = response.photo_manifest.photos[i].sol;
                dictionary[counter] = response.photo_manifest.photos[i];
            }

        } 
        else {
             console.log("Error in network request: " + request.statusText);
        }
    });
    request.send(null);
}

$(document).ready(function(){ 
    // method of getting information from xml was taken from the code from Professor Wergeles' lecture over XML
    $("#rovers").css("color", "ghostwhite");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function(){
        var xmlDoc = xmlHttp.responseXML;

        roverNames = xmlDoc.getElementsByTagName("name");
        roverDates = xmlDoc.getElementsByTagName("launch_date");
        roverDescription = xmlDoc.getElementsByTagName("description");

        var string = "<option disabled selected>select a rover</option>";

        for (var i = 0; i < roverNames.length; i++){
            string += "<option>" + roverNames[i].childNodes[0].nodeValue + "</option>";
        }
        $("#infoMenu").html(string);
    }
    xmlHttp.open("GET", "https://www.professorwergeles.com/webService.php?content=data&format=xml", true);
    xmlHttp.send();

    $("#infoMenu").change(function(){
        $("#rovers").html("<br><br><br><br><br><br><br><br><br><br>");
        $("#infoLoader").css("display", "block");
        var output = "";
        var roverNumber = 0;
        while ($("#infoMenu").val() != roverNames[roverNumber].childNodes[0].nodeValue){
            roverNumber++;
        }
        output += "<h4>" + roverNames[roverNumber].childNodes[0].nodeValue + ", ";
        output += roverDates[roverNumber].childNodes[0].nodeValue + "</h4>";
        output += '<div><p><img class="photo" src="images/rover' + roverNumber + '.png" alt="' + roverNames[roverNumber].childNodes[0].nodeValue + ' Rover">';
        output += roverDescription[roverNumber].childNodes[0].nodeValue + '</p></div>'
        output += "<br>";
        setTimeout(function(){
            $("#infoLoader").css("display", "none");
            $("#rovers").html(output);
        }, 250);
    });


    $("#sol").change(function(){
        if ($("#sol").val() != "" && dictionary[$("#sol").val()] == null){
            alert("Inputted sol contains no photos.");
            sol = -1;
        }
        else {
            sol = $("#sol").val();
            var counter = 0;
            $("#camera").html("");
            dictionary[sol].cameras.forEach(function(){
                var string = "<option>" + dictionary[sol].cameras[counter] + "</option>";
                $("#camera").append(string);
                counter++;
            });
        }    
    });


    $("#queryAPI").click(function(){
        if ($("#sol").val() == "" || sol == -1){
            alert("Please enter a valid sol");
        }
        else{
            $("#content").html("");
            $("#photoLoader").css("display", "block");
            $("#content").css("color", "ghostwhite");
            camera = $("#camera").val();
            photoNumber = 0;
            URL = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=";
            request = new XMLHttpRequest(); 
            request.open('GET', URL + sol + "&camera=" + camera + '&api_key=' + apiKey, true);

            request.addEventListener('load',function(){
                if(request.status >= 200 && request.status < 400){

                    response = JSON.parse(request.responseText);
                    var string = '<img id="photo" src=' + response.photos[photoNumber].img_src + ' alt="NASA Photo">';
                    $("#content").html(string);
                    $("#photo").css("width", "400px");
                    $("#photoLoader").css("display", "none");
                } 
                else {
                     console.log("Error in network request: " + request.statusText);
                }
            });
            request.send(null);
        }
    });

    $("#rightArrow").click(function(){
        if (photoNumber == -1){
            alert("Please select a sol & camera to view photos.");
            return;
        }

        photoNumber++;
        if (photoNumber < response.photos.length){
            $("#content").html("");
            $("#photoLoader").css("display", "block");
            setTimeout(function(){
                var string = '<img id="photo" src=' + response.photos[photoNumber].img_src + ' alt="NASA Photo">';
                $("#content").html(string);
                $("#photo").css("width", "400px");
                $("#photoLoader").css("display", "none");
            }, 250);
        }
        else {
            alert("This is the last picture in the set.");
            photoNumber--;
        }
    });

    $("#leftArrow").click(function(){
        if (photoNumber == -1){
            alert("Please select a sol & camera to view photos.");
            return;
        }

        photoNumber--;
        if (photoNumber >= 0){
            $("#content").html("");
            $("#photoLoader").css("display", "block");
            setTimeout(function(){
                var string = '<img id="photo" src=' + response.photos[photoNumber].img_src + ' alt="NASA Photo">';
                $("#content").html(string);
                $("#photo").css("width", "400px");
                $("#photoLoader").css("display", "none");
            }, 250);
        }
        else {
            alert("This is the first picture in the set.");
            photoNumber++;
        }
    });

    /* loader code was taken from Professor Wergeles' lecture 'loadingFeedback.html' */
    var tick = 1;
    setInterval(function() {
        var loadNodes = document.querySelectorAll(".loadNode");
        if (tick == 1) {
            backgroundColors = ["#333", "#aaa", "#777"];
            tick = 2;
        }
        else if (tick == 2) {
            backgroundColors = ["#777", "#333", "#aaa"];
            tick = 3
        }
        else {
            backgroundColors = ["#aaa", "#777", "#333"];
            tick = 1;
        }
        loadNodes[0].style.backgroundColor = backgroundColors[0];
        loadNodes[1].style.backgroundColor = backgroundColors[1];
        loadNodes[2].style.backgroundColor = backgroundColors[2];
        loadNodes[3].style.backgroundColor = backgroundColors[0];
        loadNodes[4].style.backgroundColor = backgroundColors[1];
        loadNodes[5].style.backgroundColor = backgroundColors[2];
    }, 200);
});