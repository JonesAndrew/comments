/*
(c) by Thomas Konings
Random Name Generator for Javascript
*/
//https://gist.github.com/tkon99/4c98af713acc73bed74c
function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function generateName(){
   var name1 = ["abandoned","able","absolute","adorable","adventurous","academic","acceptable"];
   var name2 = ["people","history","way","art","world","information","map","family","government","health","system","computer","meat","year","thanks"];
   var name = capFirst(name1[getRandomInt(0, name1.length)]) + ' ' + capFirst(name2[getRandomInt(0, name2.length)]);
   return name;
}

let CURRRENT_NAME = generateName();
