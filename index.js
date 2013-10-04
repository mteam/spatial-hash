var Set = require('set');
var List = require('linked-list');

function SpatialHash(getRect, size) {
  this.getRect = getRect;
  this.size = size || 50;
  this.buckets = {};
  this._colls = new Set();
  this._bounds = {};
}

SpatialHash.prototype.insert = function(obj) {
  var rect = this.getRect(obj);
  var bs = this.bounds(rect);

  for (var x = bs.left; x <= bs.right; x++) {
    for (var y = bs.top; y <= bs.bottom; y++) {
      this.bucket(x, y).append(obj);
    }
  }
};

SpatialHash.prototype.empty = function() {
  for (var key in this.buckets) {
    this.buckets[key].empty();
  }
};

SpatialHash.prototype.collisions = function(obj) {
  var rect = this.getRect(obj);
  var bs = this.bounds(rect);
  var set = this._colls;

  set.clear();

  for (var x = bs.left; x <= bs.right; x++) {
    for (var y = bs.top; y <= bs.bottom; y++) {
      var bucket = this.bucket(x, y);
      bucket.each(set.add, set);
    }
  }

  set.remove(obj);
  return set.values();
};

SpatialHash.prototype.bucket = function(x, y) {
  var hash = x + ';' + y;
  return this.buckets[hash] || (this.buckets[hash] = new List());
};

SpatialHash.prototype.bounds = function(rect) {
  var bs = this._bounds;

  bs.left = Math.floor(rect.left / this.size);
  bs.top = Math.floor(rect.top / this.size);
  bs.right = Math.ceil(rect.right / this.size) - 1;
  bs.bottom = Math.ceil(rect.bottom / this.size) - 1;

  return bs;
};

module.exports = SpatialHash;
