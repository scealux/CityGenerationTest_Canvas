//Global Variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var buildings = [];
var sites = [];
var hostL = [],
  tagL = [],
  toolL = [],
  topicL = [],
  categoryL = [];

//Setup Buttons
var fromJSONButton = document.getElementById("fromJSON");
fromJSONButton.addEventListener("click", fromJSON);

var toJSONButton = document.getElementById("toJSON");
toJSONButton.addEventListener("click", toJSON);

var addButton = document.getElementById("addButton");
addButton.addEventListener("click", addNewSite);

var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearFields);

var logButton = document.getElementById("logData");
logButton.addEventListener("click", logData);

//Get input from text fields on demand
var sub = {
  method: function() {
    return document.getElementById("title").value;
  },
  title: function() {
    return document.getElementById("title").value;
  },
  host: function() {
    return document.getElementById("host").value;
  },
  tags: function() {
    return document.getElementById("tags").value.split(",");
  },
  tool: function() {
    return document.getElementById("tool").value;
  },
  topic: function() {
    return document.getElementById("topic").value;
  },
  category: function() {
    return document.getElementById("category").value;
  }
};

//Weights for categories
var titleW = 0.5;
var hostW = 0.5;
var tagW = 0.5;
var toolW = 0.5;
var topicW = 0.5;
var categoryW = 0.5;

//Objects
function building(id, isCapital, x, y, numSites) {
  this.id = id;
  this.isCapital = isCapital;
  this.x = x;
  this.y = y;
  this.numSites = numSites;
}

function site(building, title, host, tags, tool, topic, category, isCapital) {
  this.building = building;
  this.title = title;
  this.host = host;
  this.tags = tags;
  this.tool = tool;
  this.topic = topic;
  this.category = category;
  this.isFixed = isCapital;
  this.floor = 0;
  this.xy = function() {
    return [building.x, building.y];
  };
}

//
function init() {
  //Set up canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 200;

  //Clear variables
  buildings = [];
  sites = [];

  //Populate city
  //For the 9ish chunks surrounding the user...
  //fromJSON();

  //Begin update loop
  window.requestAnimationFrame(draw);
}

function draw() {
  ctx.globalCompositeOperation = "destination-over";

  //Clear Canvas before new drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //DRAW HERE
  //drawFoundations();
  //Make 3D() ?

  //Draw next frame
  //window.requestAnimationFrame(draw);
}

function addNewSite() {
  if (sub.title() !== "") {
    console.log("Adding new node...");
    var nSite = new site(
      0, //building
      sub.title(),
      sub.host(),
      sub.tags(),
      sub.tool(),
      sub.topic(),
      sub.category(),
      false //isCapital
    );

    var influences = getInfluences();
    console.log("With influences: ");
    console.log(influences);
    var numBuildings = buildings.length;

    if (numBuildings === 0) {
      //If it's the first building...
      //Add it in the center and make it the capital of its highest weighted influence
      //Find heighest weighted influence
      var nBuild = new building(influences[1], true, 0, 0, 1); //id, isCapital, x, y, numSites
      [];
    } else {
      //Read textbox values
      // var info = {};
      //Read checkbox values into "info"
      //if (x.checked){
      //info.push(x[i].id)
      //}
      //New NODE with VALUES
      //Find capitals for checked inputs
      //var R = [];
    }
  } else {
    console.log("Didn't add, no title.");
  }
}

function getInfluences() {
  //Collect influences as well as higest weighted one.
  var checks = document.getElementsByClassName("nodeCheck");
  var highest = 0;
  var infs = [];
  for (var i = 0; i < checks.length; i++) {
    if (checks[i].checked === true) {
      //If an influence is checked
      var cat = checks[i].id.split("-")[0]; //Derive the category
      var z = new influ(cat, sub[cat]()); //Create new influence
      infs.push(z); //Add it to the influences

      //START HERE
      console.log([String(cat + "W")]);
      // if ([String(cat + "W")] > highest){

      // }
    }
  }
  return infs;
}

function influ(category, value) {
  this.category = category;
  this.value = value;
}

function centroidOfPoints(points) {
  //NOT TESTED
  //add all the poitns together and
  var xs = 0; //totals x values
  var ys = 0; //totals y values
  var tot = points.length / 2; //number of coordinates
  for (var i = 0; i < tot; i += 2) {
    //add each to the total
    xs += points[i];
    ys += points[i + 1];
  }
  return [xs / tot, ys / tot]; //return average
}

function findInfoinData(x, y, info) {
  for (var i = 0; i < y.length; i++) {
    if (y[i][info] == x) {
      return y[i];
    }
  }
  return false;
}

function calculateCentroid(x1, y1, x2, y2, x3, y3) {
  var cx = (x1 + x2 + x3) / 3;
  var cy = (y1 + y2 + y3) / 3;
  return [cx, cy];
}

function clearFields() {
  var fields = document.getElementsByClassName("nodeField");
  for (var i = 0; i < fields.length; i++) {
    fields[i].value = "";
  }
  var checks = document.getElementsByClassName("nodeCheck");
  //console.log(checks);
  for (var i = 0; i < checks.length; i++) {
    checks[i].checked = false;
  }
  console.log("Fields Cleared");
}

function toJSON() {
  console.log("To JSON");
  //Export sites to JSON
}

function fromJSON() {
  console.log("From JSON");
  //Place Anchors at Points from storage
  //Read JSON for "chunk"
  //For each building in JSON, convert it to object and push to buildings[]
  //For each site in JSON, convert to object and push to sites[];
}

function logData() {
  console.log(sites);
}

window.onresize = function(event) {
  init();
};

//Initialize
init();
