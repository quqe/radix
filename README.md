# radix
radix tree javascript

How to use:

Save radix.js file to your project folder.

const radix = require('./radix');

var rtree = new radix();

rtree.set("This is an example", {a:1,b:2});
rtree.set("This is an example 2", [2]);
rtree.set("This IS an example 3", []);

console.log(rtree.get("This is an example 2"));

rtree.forEach((k,v)=>{
  console.log("PATH: "+k);
  console.log("VALUE: "+v);
});
