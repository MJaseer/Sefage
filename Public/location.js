// const Location = require('../Model/state');

// let subject = (async(data)=>{
//   return await Location.find({})
// });

// subject.forEach(element => {
//   return element
// });

// console.log(subject)

var subjectObject = 
{
    "Kerala": {
      "Kozhikode ": ["Sky line ", "Hilite",  "LandMark"],
      "Kochi": ["Marina One", "Purva Grandbay", "Skyline Imperial Gardens"],
    },
    "Maharashtra": {
      "Pune": ["Marvel Aurum", "Ganga Nakshatra", "Presidia "],
      "Mumbai": ["Nathani Heights", "Lodha Altamount", "Park Royale"],
      "Nagpur": ["Kukreja Infinity", "Royal Homes", "Pyramid City 6"]
    },
    "Delhi": {
      "New Delhi": ["DLF King's Court", "The Amaryllis", "Goyal Properties"],
      "Old Delhi": ["Indraprastha", "Statesman House", "Haveli Dharampura"],
    }
  }

  window.onload = function() {
    var subjectSel = document.getElementById("state");
    var topicSel = document.getElementById("city");
    var chapterSel = document.getElementById("flat");
    for (var x in subjectObject) {
      subjectSel.options[subjectSel.options.length] = new Option(x, x);
    }
    subjectSel.onchange = function() {
      //empty Chapters- and Topics- dropdowns
      chapterSel.length = 1;
      topicSel.length = 1;
      //display correct values
      for (var y in subjectObject[this.value]) {
        topicSel.options[topicSel.options.length] = new Option(y, y);
      }
    }
    topicSel.onchange = function() {
      //empty Chapters dropdown
      chapterSel.length = 1;
      //display correct values
      var z = subjectObject[subjectSel.value][this.value];
      for (var i = 0; i < z.length; i++) {
        chapterSel.options[chapterSel.options.length] = new Option(z[i], z[i]);
      }
    }
  }

//   var subjectObject = 
// {
//     "Kerala": {
//       "Kozhikode ": ["Sky line ", "Hilite",  "LandMark"],
//       "Kochi": ["Marina One", "Purva Grandbay", "Skyline Imperial Gardens"],
//     },
//     "Maharashtra": {
//       "Pune": ["Marvel Aurum", "Ganga Nakshatra", "Presidia "],
//       "Mumbai": ["Nathani Heights", "Lodha Altamount", "Park Royale"],
//       "Nagpur": ["Kukreja Infinity", "Royal Homes", "Pyramid City 6"]
//     },
//     "Delhi": {
//       "New Delhi": ["DLF King's Court", "The Amaryllis", "Goyal Properties"],
//       "Old Delhi": ["Indraprastha", "Statesman House", "Haveli Dharampura"],
//     }
//   };

// var stateSelect = document.getElementById("stateSelect");
// var citySelect = document.getElementById("citySelect");
// var flatSelect = document.getElementById("flatSelect");

// stateSelect.addEventListener("change", function() {
//   var selectedState = stateSelect.value;
//   citySelect.innerHTML = "<option value=''>Select City</option>";
//   flatSelect.innerHTML = "<option value=''>Select Flat</option>";

//   if (!selectedState) {
//     return;
//   }

//   var cities = Object.keys(subjectObject[selectedState]);
//   for (var i = 0; i < cities.length; i++) {
//     var cityOption = document.createElement("option");
//     cityOption.value = cities[i];
//     cityOption.text = cities[i];
//     citySelect.appendChild(cityOption);
//   }
// });

// citySelect.addEventListener("change", function() {
//   var selectedCity = citySelect.value;
//   flatSelect.innerHTML = "<option value=''>Select Flat</option>";

//   if (!selectedCity) {
//     return;
//   }

//   var selectedState = stateSelect.value;
//   var flats = subjectObject[selectedState][selectedCity];
//   for (var i = 0; i < flats.length; i++) {
//     var flatOption = document.createElement("option");
//     flatOption.value = flats[i];
//     flatOption.text = flats[i];
//     flatSelect.appendChild(flatOption);
//   }
// });


