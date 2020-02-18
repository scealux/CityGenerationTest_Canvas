//Global Variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var capA = []; //active capitals
var capD = []; //dormant capitals
var sites = []; //websites & related info
var buildings = []; // buildings on the map

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
    return document.getElementById("title").value.toLowerCase();
  },
  title: function() {
    return document.getElementById("title").value.toLowerCase();
  },
  host: function() {
    return document.getElementById("host").value.toLowerCase();
  },
  tags: function() {
    return document
      .getElementById("tags")
      .value.split(",")
      .forEach(function(val) {
        val = val.toLowerCase();
      });
  },
  tool: function() {
    return document.getElementById("tool").value.toLowerCase();
  },
  topic: function() {
    return document.getElementById("topic").value.toLowerCase();
  },
  category: function() {
    return document.getElementById("category").value.toLowerCase();
  }
};

//Weights for categories
var weights = [
  0.1, //host
  0.2, //tags
  0.3, //tool
  0.4, //topic
  0.5 //category
];

//Objects
function capital(id, x, y) {
  this.id = id; //Keyword
  this.x = x;
  this.y = y;
}

function site(capital, title, host, tags, tool, topic, category) {
  this.capital = capital;
  this.title = title;
  this.host = host;
  this.tags = tags;
  this.tool = tool;
  this.topic = topic;
  this.category = category;
  this.floor = 0;
  this.xy = function() {
    return [capital.x, capital.y];
  };
}

function building(x, y, sites, height) {
  this.x = x;
  this.y = y;
  this.sites = sites;
  this.height = function() {
    return this.sites.length;
  };
}

//
function init() {
  //Set up canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 200;

  //Clear variables
  capA = [];
  capD = [];
  sites = [];
  buildings = [];

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
      0, //capital
      sub.title(),
      sub.host(),
      sub.tags(),
      sub.tool(),
      sub.topic(),
      sub.category()
    );

    var influences = getInfluences();
    console.log(influences);

    //Find "anchor" capitals
    var anchors = findAnchors(influences);

    //For influences, add them as new capitals (AROUND ANCHORS)
    for (var i = 0; i < influences.length; i++) {
      //Make capitals for each of the unique influences
      var newCoords = capCoords();
      var nCap = new capital(
        influences[i].value, //IDs as influence
        newCoords.x, //
        newCoords.y
      );
      capA.push(nCap);
    }

    var capCoords = [];
    for (i = 0; i < influences.length; i++) {}
    //Then find the capitals coordinates
    //Feed them into centroid

    //Check for buildings around centroid;
    //if none, create one.
    //Add site with reference to building

    //Find capitals
    for (var i = 0; i < capA.length; i++) {}
  } else {
    console.log("Didn't add, no title.");
  }
}

function findAnchors(influences) {
  var anchors = [];
  for (var i = 0; i < influences.length; i++) {
    var found = findInCaps(influences[i].value);
    if (found !== undefined) {
      //ADD FOUND TO ANCHOR ARRAY
      anchors.push(found);
      //REMOVE FROM INFLUENCE ARRAY
      //influences.splice(i,1)
    }
  }
  return anchors;
}

function capCoords() {
  var newCoords = [];
  var inDonut = false;
  var outer = 60;
  var inner = 30;
  var rnd = randInt(0, capA.length);
  for (var i = 0; i < 50; i++) {
    while (!inDonut) {
      newCoords = [
        //Create a new coordinate in a range from the center one
        randInt(capA[rnd].x - outer, capA[rnd].x + outer),
        randInt(capA[rnd].y - outer, capA[rnd].y + outer)
      ];
      var dist = distance(capA[rnd].x, capA[rnd].y, newCoords[0], newCoords[1]);
      if (dist < outer && dist > inner) {
        inDonut = true;
      }
    }
    //For each point in the donut, check the distance to each active capital...
    var passActive = true;
    for (var j = 0; j < capA.length; j++) {
      dist = distance(capA[j].x, capA[j].y, newCoords[0], newCoords[1]);

      if (dist < inner) {
        //if it's too close to any point, stop.
        passActive = false;
        break;
      }
    }

    if (passActive) {
      var passDormant = true;
      //Passed all the active points
      for (j = 0; j < capD.length; j++) {
        //For each capital
        dist = distance(capD[j].x, capD[j].y, newCoords[0], newCoords[1]);

        if (dist < inner) {
          //if it's too close to any point, stop.
          passDormant = false;
          break;
        }
      }
    }

    if (passDormant && passActive) {
      return newCoords; //If it passed both tests, it's a valid point
    }
    // If it didn't pass, try again with a new point
  }
  // Makes it here if it tried 50 times and couldn't find a valid point.
  capD.push(capA[rnd]); // Move that capital to dormant list
  capA.splice(rnd, 1); // Deletes that capital from the active list
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function randInt(min, max) {
  return Math.floor(Math.random * (max - min) + min);
}

function getInfluences() {
  // Collect influences
  var checks = document.getElementsByClassName("nodeCheck");
  var infs = [];
  for (var i = 0; i < checks.length; i++) {
    if (checks[i].checked === true) {
      // If an influence is checked
      var cat = checks[i].id.split("-")[0]; // Derive the category
      var z = new influ(cat, sub[cat](), weights[i]); // Create new influence
      infs.push(z); // Add it to the influences
    }
  }
  return infs;
}

function influ(category, value, weight) {
  this.category = category;
  this.value = value;
  this.weight = weight;
}

function centroidOfPoints(points) {
  // NOT TESTED
  // add all the poitns together and
  var xs = 0; // totals x values
  var ys = 0; // totals y values
  var tot = points.length / 2; // number of coordinates
  for (var i = 0; i < tot; i += 2) {
    // add each to the total
    xs += points[i];
    ys += points[i + 1];
  }
  return [xs / tot, ys / tot]; // return average
}

function findInCaps(value) {
  // Find a capital where its value matches
  var cap = capD.find(element => element.id == value); // Check dormant
  if (cap == undefined) {
    cap = capA.find(element => element.id == value); // Check active
  }
  return cap; // Return the found value (could be undefined)
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
  for (i = 0; i < checks.length; i++) {
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
  //For each capital in JSON, convert it to object and push to capitals[]
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
