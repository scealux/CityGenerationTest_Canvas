//Global Variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var buildings = [];
var sites = [];

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
  canvas.height = 400;

  //Populate city
  //For the 9ish chunks surrounding the user...
  cityFromJSON();

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

function cityFromJSON() {
  //Place Anchors at Points from storage
  //Read JSON for "chunk"
  //For each building in JSON, convert it to object and push to buildings[]
  //For each site in JSON, convert to object and push to sites[];
}

function tester() {
  console.log(sub.category());
}

function addNewSite() {
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

  console.log(nSite);

  var numInfluences = countInfluences();
  var numNodes = buildings.length;

  if (numNodes == 0) {
    var nBuild = new building(id, true, 0, 0, 1); //id, isCapital, x, y, numSites
    //Add node in center
    //Read textbox values
    //Add values as capitals
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
}

function countInfluences() {
  var checks = document.getElementsByClassName("nodeCheck");
  var counter = 0;
  for (var i = 0; i < checks.length; i++) {
    if (checks[i].checked === true) {
      counter++;
    }
  }
  return counter;
}

function findInfoinData(x, y, info) {
  for (var i = 0; i < y.length; i++) {
    if (y[i][info] == x) {
      return y[i];
    }
  }
  return false;
}

function addNewNode() {
  console.log("Adding new node...");
  //Title Host Tags Tool Topic Category

  //Find number of possible anchors.

  if (document.getElementById("tagsCheck").checked) {
    //Add each tag to influences
    numInfluences += tags.length - 1;
  }

  //Put together array of anchor nodes
  var nodeAnchors = [];
  for (var i = 0; i < 3; i++) {}

  function findXinY(string, array) {
    for (var i = 0; i < array.length; i++) {}
  }

  function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  //Find selected anchors
  //Create three springs and attach them
  //
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
}

function logData() {
  console.log(nodeData);
}

window.onresize = function(event) {
  init();
};
var addButton = document.getElementById("addButton");
addButton.addEventListener("click", addNewSite);

var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clearFields);

var logButton = document.getElementById("logData");
logButton.addEventListener("click", logData);
init();
