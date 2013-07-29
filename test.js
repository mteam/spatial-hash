var assert = require('assert');
var SpatialHash = require('spatial-hash');

describe('Spatial hash', function() {

  function id(obj) { return obj; }
  
  describe('#bounds', function() {

    var sh = new SpatialHash(id, 100);
    
    it('works for overlaping rects', function() {
      var bs = sh.bounds({
        left: 30, top: 20,
        right: 140, bottom: 230
      });

      assert(bs.left == 0);
      assert(bs.top == 0);
      assert(bs.right == 1);
      assert(bs.bottom == 2);
    });

    it('works for bordering rects', function() {
      var bs = sh.bounds({
        top: 0, left: 0,
        bottom: 100, right: 100
      });

      assert(bs.left == 0);
      assert(bs.top == 0);
      assert(bs.right == 0);
      assert(bs.bottom == 0);
    });

    it('works for negative rects', function() {
      var bs = sh.bounds({
        left: -50, top: -50,
        right: 50, bottom: 50
      });

      assert(bs.left == -1);
      assert(bs.top == -1);
      assert(bs.right == 0);
      assert(bs.bottom == 0);
    });
  
  });

  describe('#insert', function() {
    
    it('puts objects into buckets', function() {
      var sh = new SpatialHash(id, 50);

      sh.insert({
        left: 25, top: 25,
        right: 75, bottom: 75
      });

      sh.insert({
        left: 75, top: 75,
        right: 125, bottom: 125
      });

      assert(sh.buckets['0;0'].length == 1);
      assert(sh.buckets['1;1'].length == 2);
      assert(sh.buckets['2;2'].length == 1);
    });
  
  });

  describe('#empty', function() {
    
    it('empties the grid', function() {
      var sh = new SpatialHash(id);

      sh.insert({
        left: 20, top: 30,
        right: 80, bottom: 90
      });

      sh.empty();

      assert(sh.bucket(0, 0).length == 0);
      assert(sh.bucket(1, 1).length == 0);
    });
  
  });

  describe('#collisions', function() {
    
    it('finds possible collisions', function() {
      var sh = new SpatialHash(id, 50);
      var object, possible;

      sh.insert(object = {
        left: 10, top: 10,
        right: 60, bottom: 60
      });

      sh.insert(possible = {
        left: 25, top: 75,
        right: 75, bottom: 125
      });

      sh.insert({
        left: 100, top: 20,
        right: 200, bottom: 70
      });

      sh.insert({
        left: -50, top: -50,
        right: 0, bottom: 0
      });

      var collisions = sh.collisions(object);

      assert(collisions.length == 1);
      assert(collisions[0] == possible);
    });
  
  });

});
