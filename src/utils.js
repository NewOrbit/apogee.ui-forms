var uid = 0;

var utils = {
  isUndefined: function(v){ return typeof v === 'undefined'; },
  first: function(v) { return (v && v.length) ? v[0] : null; },
  last: function(v) { return (v && v.length) ? v[v.length - 1] : null; },
  uniqueId: function(){ return uid++; }
};
