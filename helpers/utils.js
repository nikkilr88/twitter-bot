exports.rand = function(max) {
   return Math.floor(Math.random() * max);
}

exports.setIntervalImediate = function(fn, delay) {
   fn();
   return setInterval(fn, delay);
}