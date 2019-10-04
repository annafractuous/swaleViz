var admin = require("firebase-admin");
var firebase = require("firebase");
var moment = require("moment");
var fs = require('fs');


var firebaseConfig = {
  apiKey: "AIzaSyC-aun8ltGul15OdpFWtH2uC9938Z0FxoI",
  authDomain: "swale-b9a9b.firebaseapp.com",
  databaseURL: "https://swale-b9a9b.firebaseio.com",
  projectId: "swale-b9a9b",
  storageBucket: "swale-b9a9b.appspot.com",
  messagingSenderId: "876545422849",
  appId: "1:876545422849:web:8958e52439e039b5"
};
firebase.initializeApp(firebaseConfig);

const rootRef = firebase.database().ref('chronological/tower');
// const rootRef = firebase.database().ref('sources/tower');
var key = rootRef.key;
var arr = [];
var values = [];
var keys = [];
var entries = [];
var indices = [];
var finalArray = [];

//pulling chronological data
rootRef.once('value').then(function(snapshot){
    var obj = snapshot.val();
    
    values = Object.values(obj);
    keys = Object.keys(obj);
    entries = Object.entries(obj);
    

    // for (var [time,obj] of entries){
    //   time = time.substring(0,10);
    // }

    // keys.forEach(function(element) {
    //   element = element.substring(0,10);
    // });

    removeMinutes(entries, onlyUnique);

    setTimeout(function(){ 
  
      fs.writeFile("./dummyData2.json", JSON.stringify(finalArray), function(err) {
              console.log("done!");
          })
    
           },5000);
    
});


function removeMinutes(entries, callback){
  
  // for (var [time,obj] of entries){
  //   entries.time = time.substring(0,10);
  // }
  entries.map(a =>
    
    a[0] = a[0].substring(0,10)
  );
  keys.map(a =>
    a = a.substring(0,10)
  ).map((v, i, arr) => arr.indexOf(v) === i && indices.push(i));
  // console.log(keys);
  // renameDate = entries.filter((v, i, arr) => 
  //   // console.log(arr)
  //   arr.indexOf(v[0]) === i
  //   );
  callback();
}
// function findUnique(entries){
//   console.log("HEY!", entries)
// }
function onlyUnique() { 
  // console.log(entries);
  //v[0]-dates
  //i
  indices.map(a => finalArray.push(entries[a]));

  // console.log(indices);
  // keys.filter((v, i, a) => a.indexOf(v) === i); 
  // return self.indexOf(value) === index;
  // return self.indexOf(value.includes(temp)) === index;
}

function Avg () {
    // console.log(arr.map(d => d.date));
    var sums = arr.reduce(function(acc, obj) {

        var date = new Date(obj.date);
        var format = moment(date).format("YYYYMMDDHH");

        if (!acc[format]) {
          acc[format] = {sum:0, count:0};
        }
        acc[format].sum += +obj.temperature_f;
        acc[format].count++;
        return acc;
    }, Object.create(null));
    return Object.keys(sums).map(function(date) {
      return {"date": [date], "average": sums[date].sum/sums[date].count };
    });
}


// //how I pulled dummy data above
// rootRef.once('value').then(function(snapshot){
//     var obj = snapshot.val();
//     arr = Object.values(obj);
//     data = Avg();
//     console.log()
//     fs.writeFile("./dummyData.js", JSON.stringify(data), function(err) {
//       console.log("done!");
//   }); 
// });
// export {data as Data};