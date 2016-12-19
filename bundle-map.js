/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _d = __webpack_require__(1);

	var d3 = _interopRequireWildcard(_d);

	var _topojson = __webpack_require__(2);

	var topojson = _interopRequireWildcard(_topojson);

	var _world110m = __webpack_require__(3);

	var _world110m2 = _interopRequireDefault(_world110m);

	var _centroids = __webpack_require__(4);

	var _centroids2 = _interopRequireDefault(_centroids);

	var _world110mCountryNames = __webpack_require__(5);

	var _world110mCountryNames2 = _interopRequireDefault(_world110mCountryNames);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	__webpack_require__(6);

	var width = 900;
	var height = 600;
	var colors = ['#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'];
	var myArcdata = void 0;

	var projection = d3.geoMercator().center([0, 45]).scale(140).translate([width / 2, height / 2]);

	var path = d3.geoPath().projection(projection);

	var svg = d3.select(".map").append("svg").attr("width", width).attr("height", height);

	d3.queue().defer(d3.json, "world-110m2.json").defer(d3.tsv, "world-110m-country-names.tsv").defer(d3.json, "centroids.json").defer(d3.json, "data.json").await(ready);

	var cities = [];
	function ready(error, world, names, centroids, goc) {

	  var arcdata = [];
	  var centroidData = [];

	  var countries = topojson.feature(world, world.objects.countries).features;
	  countries = countries.filter(function (d) {
	    return names.some(function (n) {
	      if (d.id == n.id) return d.name = n.name;
	    });
	  });

	  for (var i in centroids) {
	    var country = centroids[i];
	    var obj = {};
	    obj.LAT = country.LAT;
	    obj.LONG = country.LONG;
	    obj.FIPS10 = country.FIPS10;
	    obj.ISO3136 = country.ISO3136;
	    centroidData[centroids[i].SHORT_NAME] = obj;
	  }

	  goc = goc.filter(function (d) {
	    return names.some(function (n) {
	      if (d.Country == n.name) {
	        return d.id = n.id;
	      }
	    });
	  });

	  var GocData = [];
	  for (var _i in goc) {
	    if (GocData[goc[_i].Country] == undefined) {
	      var _country = {
	        sourceLocation: [34.911546, 39.059012],
	        targetLocation: [],
	        people: [],
	        percent: 0
	      };
	      var centroidCountry = centroidData[goc[_i].Country];
	      _country.targetLocation.push(centroidCountry.LONG);
	      _country.targetLocation.push(centroidCountry.LAT);
	      _country.name = goc[_i].Country;
	      var _obj = {};
	      _obj = goc[_i];
	      _country.people.push(_obj);
	      GocData[goc[_i].Country] = _country;
	      GocData[goc[_i].Country].percent = GocData[goc[_i].Country].people.length / goc.length * 100;
	    } else {
	      GocData[goc[_i].Country].people.push(goc[_i]);
	      GocData[goc[_i].Country].percent = GocData[goc[_i].Country].people.length / goc.length * 100;
	    }
	  }

	  function calcTopSector(arr) {
	    var result = [];
	    for (var _i2 in arr) {
	      if (result[arr[_i2].Sector] == undefined) {
	        var Sector = {
	          arr: [],
	          name: "",
	          count: 0
	        };
	        Sector.arr.push(arr[_i2]);
	        Sector.name = arr[_i2].Sector;
	        result[arr[_i2].Sector] = Sector;
	        result[arr[_i2].Sector].count = result[arr[_i2].Sector].arr.length;
	      } else {
	        result[arr[_i2].Sector].arr.push(arr[_i2]);
	        result[arr[_i2].Sector].count = result[arr[_i2].Sector].arr.length;
	      }
	    }
	    result = Object.keys(result).map(function (i) {
	      var obj = {};
	      obj.Sector = result[i].name;
	      obj.Count = result[i].count;
	      return obj;
	    });
	    result.sort(function (a, b) {
	      return b.Count - a.Count;
	    });
	    return result;
	  }
	  for (var _i3 in goc) {
	    var _obj2 = {
	      sourceLocation: [34.911546, 39.059012],
	      targetLocation: [],
	      name: ""
	    };
	    var gocCountry = goc[_i3].Country;
	    var _centroidCountry = centroidData[gocCountry];
	    _obj2.targetLocation.push(_centroidCountry.LONG);
	    _obj2.targetLocation.push(_centroidCountry.LAT);
	    _obj2.name = goc[_i3].Country;
	    arcdata.push(_obj2);
	  }
	  var country_group = svg.append("g").attr("class", "countries");
	  var arcGroup = svg.append("g").attr("class", "arcs");
	  var pinGroup = svg.append("g").attr("class", "pins");

	  var point_group = svg.append("g");

	  var tooltip = d3.select('body').append('div').attr('class', 'hidden tooltip');

	  country_group.append('g').selectAll("path").data(countries).enter().append("path").attr("class", "country").attr('data-name', function (d) {
	    return d.name;
	  }).style("fill", function (d) {
	    if (GocData[d.name]) {
	      var percent = GocData[d.name].percent;
	      if (percent > 15) {
	        return colors[4];
	      } else if (percent < 15 && percent > 10) {
	        return colors[3];
	      } else if (percent < 10 && percent > 7) {
	        return colors[2];
	      } else if (percent < 7 && percent > 1) {
	        return colors[1];
	      } else if (percent < 1 && percent > 0) {
	        return colors[0];
	      }
	    }
	    return "#fff7f3";
	  }).attr("d", path).on('mouseover', function (d) {
	    arcGroup.select("g").remove();
	    pinGroup.select("g").remove();
	    myArcdata = [];
	    for (var _i4 in GocData) {
	      if (GocData[_i4].name == d.name) {
	        myArcdata.push(GocData[_i4]);
	      }
	    }
	    drawArc(myArcdata);
	  }).on('mousemove', function (d) {
	    var top = "";
	    top = calcTopSector(myArcdata[0].people);
	    top = top.slice(0, 4);
	    var mouse = d3.mouse(svg.node()).map(function (d) {
	      return parseInt(d);
	    });
	    tooltip.classed('hidden', false).attr('style', 'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 95) + 'px').html(function () {
	      var data = [];
	      data = top.map(function (i) {
	        return i.Sector + " :" + i.Count;
	      });

	      data.unshift(d.name, "TOTAL :" + myArcdata[0].people.length);
	      data = data.join("<br/> ");
	      return data;
	    });
	  }).on('mouseout', function () {
	    tooltip.classed('hidden', true);
	    arcGroup.select("g").remove();
	    pinGroup.select("g").remove();
	    myArcdata = [];
	    for (var _i5 in GocData) {
	      myArcdata.push(GocData[_i5]);
	    }
	    drawCircle(myArcdata);
	  });

	  function drawArc(data) {
	    arcGroup.append('g').selectAll("path").data(data).enter().append("path").attr("class", "arc").attr("d", function (d) {
	      return lngLatToArc(d, 'sourceLocation', 'targetLocation', 1);
	    });
	  }
	  function drawCircle(data) {
	    pinGroup.append('g').selectAll("path").data(data).enter().append("circle", ".pin").attr("r", 2).attr("transform", function (d) {
	      return "translate(" + projection([d.targetLocation[0], d.targetLocation[1]]) + ")";
	    }).attr('opacity', 0).transition().delay(function (d, i) {
	      return i * 50;
	    }).attr('opacity', 0.4);
	  }
	}

	function lngLatToArc(d, sourceName, targetName, bend) {
	  // If no bend is supplied, then do the plain square root
	  bend = bend || 1;
	  // `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
	  // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`
	  var sourceLngLat = d[sourceName],
	      targetLngLat = d[targetName];
	  if (targetLngLat && sourceLngLat) {
	    var sourceXY = projection(sourceLngLat),
	        targetXY = projection(targetLngLat);
	    // Uncomment this for testing, useful to see if you have any null lng/lat values
	    // if (!targetXY) console.log(d, targetLngLat, targetXY)
	    var sourceX = sourceXY[0],
	        sourceY = sourceXY[1];
	    var targetX = targetXY[0],
	        targetY = targetXY[1];
	    var dx = targetX - sourceX,
	        dy = targetY - sourceY,
	        dr = Math.sqrt(dx * dx + dy * dy) * bend;
	    // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
	    var west_of_source = targetX - sourceX < 0;
	    if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
	    return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
	  } else {
	    return "M0,0,l0,0z";
	  }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org Version 4.4.0. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, (function (exports) { 'use strict';

	var version = "4.4.0";

	var ascending = function(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	};

	var bisector = function(compare) {
	  if (compare.length === 1) compare = ascendingComparator(compare);
	  return {
	    left: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) < 0) lo = mid + 1;
	        else hi = mid;
	      }
	      return lo;
	    },
	    right: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) > 0) hi = mid;
	        else lo = mid + 1;
	      }
	      return lo;
	    }
	  };
	};

	function ascendingComparator(f) {
	  return function(d, x) {
	    return ascending(f(d), x);
	  };
	}

	var ascendingBisect = bisector(ascending);
	var bisectRight = ascendingBisect.right;
	var bisectLeft = ascendingBisect.left;

	var descending = function(a, b) {
	  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	};

	var number = function(x) {
	  return x === null ? NaN : +x;
	};

	var variance = function(array, f) {
	  var n = array.length,
	      m = 0,
	      a,
	      d,
	      s = 0,
	      i = -1,
	      j = 0;

	  if (f == null) {
	    while (++i < n) {
	      if (!isNaN(a = number(array[i]))) {
	        d = a - m;
	        m += d / ++j;
	        s += d * (a - m);
	      }
	    }
	  }

	  else {
	    while (++i < n) {
	      if (!isNaN(a = number(f(array[i], i, array)))) {
	        d = a - m;
	        m += d / ++j;
	        s += d * (a - m);
	      }
	    }
	  }

	  if (j > 1) return s / (j - 1);
	};

	var deviation = function(array, f) {
	  var v = variance(array, f);
	  return v ? Math.sqrt(v) : v;
	};

	var extent = function(array, f) {
	  var i = -1,
	      n = array.length,
	      a,
	      b,
	      c;

	  if (f == null) {
	    while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
	    while (++i < n) if ((b = array[i]) != null) {
	      if (a > b) a = b;
	      if (c < b) c = b;
	    }
	  }

	  else {
	    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
	    while (++i < n) if ((b = f(array[i], i, array)) != null) {
	      if (a > b) a = b;
	      if (c < b) c = b;
	    }
	  }

	  return [a, c];
	};

	var array = Array.prototype;

	var slice = array.slice;
	var map = array.map;

	var constant$1 = function(x) {
	  return function() {
	    return x;
	  };
	};

	var identity = function(x) {
	  return x;
	};

	var range = function(start, stop, step) {
	  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

	  var i = -1,
	      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
	      range = new Array(n);

	  while (++i < n) {
	    range[i] = start + i * step;
	  }

	  return range;
	};

	var e10 = Math.sqrt(50);
	var e5 = Math.sqrt(10);
	var e2 = Math.sqrt(2);

	var ticks = function(start, stop, count) {
	  var step = tickStep(start, stop, count);
	  return range(
	    Math.ceil(start / step) * step,
	    Math.floor(stop / step) * step + step / 2, // inclusive
	    step
	  );
	};

	function tickStep(start, stop, count) {
	  var step0 = Math.abs(stop - start) / Math.max(0, count),
	      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	      error = step0 / step1;
	  if (error >= e10) step1 *= 10;
	  else if (error >= e5) step1 *= 5;
	  else if (error >= e2) step1 *= 2;
	  return stop < start ? -step1 : step1;
	}

	var sturges = function(values) {
	  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
	};

	var histogram = function() {
	  var value = identity,
	      domain = extent,
	      threshold = sturges;

	  function histogram(data) {
	    var i,
	        n = data.length,
	        x,
	        values = new Array(n);

	    for (i = 0; i < n; ++i) {
	      values[i] = value(data[i], i, data);
	    }

	    var xz = domain(values),
	        x0 = xz[0],
	        x1 = xz[1],
	        tz = threshold(values, x0, x1);

	    // Convert number of thresholds into uniform thresholds.
	    if (!Array.isArray(tz)) tz = ticks(x0, x1, tz);

	    // Remove any thresholds outside the domain.
	    var m = tz.length;
	    while (tz[0] <= x0) tz.shift(), --m;
	    while (tz[m - 1] >= x1) tz.pop(), --m;

	    var bins = new Array(m + 1),
	        bin;

	    // Initialize bins.
	    for (i = 0; i <= m; ++i) {
	      bin = bins[i] = [];
	      bin.x0 = i > 0 ? tz[i - 1] : x0;
	      bin.x1 = i < m ? tz[i] : x1;
	    }

	    // Assign data to bins by value, ignoring any outside the domain.
	    for (i = 0; i < n; ++i) {
	      x = values[i];
	      if (x0 <= x && x <= x1) {
	        bins[bisectRight(tz, x, 0, m)].push(data[i]);
	      }
	    }

	    return bins;
	  }

	  histogram.value = function(_) {
	    return arguments.length ? (value = typeof _ === "function" ? _ : constant$1(_), histogram) : value;
	  };

	  histogram.domain = function(_) {
	    return arguments.length ? (domain = typeof _ === "function" ? _ : constant$1([_[0], _[1]]), histogram) : domain;
	  };

	  histogram.thresholds = function(_) {
	    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant$1(slice.call(_)) : constant$1(_), histogram) : threshold;
	  };

	  return histogram;
	};

	var threshold = function(array, p, f) {
	  if (f == null) f = number;
	  if (!(n = array.length)) return;
	  if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
	  if (p >= 1) return +f(array[n - 1], n - 1, array);
	  var n,
	      h = (n - 1) * p,
	      i = Math.floor(h),
	      a = +f(array[i], i, array),
	      b = +f(array[i + 1], i + 1, array);
	  return a + (b - a) * (h - i);
	};

	var freedmanDiaconis = function(values, min, max) {
	  values = map.call(values, number).sort(ascending);
	  return Math.ceil((max - min) / (2 * (threshold(values, 0.75) - threshold(values, 0.25)) * Math.pow(values.length, -1 / 3)));
	};

	var scott = function(values, min, max) {
	  return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
	};

	var max = function(array, f) {
	  var i = -1,
	      n = array.length,
	      a,
	      b;

	  if (f == null) {
	    while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	    while (++i < n) if ((b = array[i]) != null && b > a) a = b;
	  }

	  else {
	    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	    while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
	  }

	  return a;
	};

	var mean = function(array, f) {
	  var s = 0,
	      n = array.length,
	      a,
	      i = -1,
	      j = n;

	  if (f == null) {
	    while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
	  }

	  else {
	    while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) s += a; else --j;
	  }

	  if (j) return s / j;
	};

	var median = function(array, f) {
	  var numbers = [],
	      n = array.length,
	      a,
	      i = -1;

	  if (f == null) {
	    while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
	  }

	  else {
	    while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
	  }

	  return threshold(numbers.sort(ascending), 0.5);
	};

	var merge = function(arrays) {
	  var n = arrays.length,
	      m,
	      i = -1,
	      j = 0,
	      merged,
	      array;

	  while (++i < n) j += arrays[i].length;
	  merged = new Array(j);

	  while (--n >= 0) {
	    array = arrays[n];
	    m = array.length;
	    while (--m >= 0) {
	      merged[--j] = array[m];
	    }
	  }

	  return merged;
	};

	var min = function(array, f) {
	  var i = -1,
	      n = array.length,
	      a,
	      b;

	  if (f == null) {
	    while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	    while (++i < n) if ((b = array[i]) != null && a > b) a = b;
	  }

	  else {
	    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	    while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
	  }

	  return a;
	};

	var pairs = function(array) {
	  var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
	  while (i < n) pairs[i] = [p, p = array[++i]];
	  return pairs;
	};

	var permute = function(array, indexes) {
	  var i = indexes.length, permutes = new Array(i);
	  while (i--) permutes[i] = array[indexes[i]];
	  return permutes;
	};

	var scan = function(array, compare) {
	  if (!(n = array.length)) return;
	  var i = 0,
	      n,
	      j = 0,
	      xi,
	      xj = array[j];

	  if (!compare) compare = ascending;

	  while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;

	  if (compare(xj, xj) === 0) return j;
	};

	var shuffle = function(array, i0, i1) {
	  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
	      t,
	      i;

	  while (m) {
	    i = Math.random() * m-- | 0;
	    t = array[m + i0];
	    array[m + i0] = array[i + i0];
	    array[i + i0] = t;
	  }

	  return array;
	};

	var sum = function(array, f) {
	  var s = 0,
	      n = array.length,
	      a,
	      i = -1;

	  if (f == null) {
	    while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
	  }

	  else {
	    while (++i < n) if (a = +f(array[i], i, array)) s += a;
	  }

	  return s;
	};

	var transpose = function(matrix) {
	  if (!(n = matrix.length)) return [];
	  for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
	    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
	      row[j] = matrix[j][i];
	    }
	  }
	  return transpose;
	};

	function length(d) {
	  return d.length;
	}

	var zip = function() {
	  return transpose(arguments);
	};

	var prefix = "$";

	function Map() {}

	Map.prototype = map$1.prototype = {
	  constructor: Map,
	  has: function(key) {
	    return (prefix + key) in this;
	  },
	  get: function(key) {
	    return this[prefix + key];
	  },
	  set: function(key, value) {
	    this[prefix + key] = value;
	    return this;
	  },
	  remove: function(key) {
	    var property = prefix + key;
	    return property in this && delete this[property];
	  },
	  clear: function() {
	    for (var property in this) if (property[0] === prefix) delete this[property];
	  },
	  keys: function() {
	    var keys = [];
	    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
	    return keys;
	  },
	  values: function() {
	    var values = [];
	    for (var property in this) if (property[0] === prefix) values.push(this[property]);
	    return values;
	  },
	  entries: function() {
	    var entries = [];
	    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
	    return entries;
	  },
	  size: function() {
	    var size = 0;
	    for (var property in this) if (property[0] === prefix) ++size;
	    return size;
	  },
	  empty: function() {
	    for (var property in this) if (property[0] === prefix) return false;
	    return true;
	  },
	  each: function(f) {
	    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
	  }
	};

	function map$1(object, f) {
	  var map = new Map;

	  // Copy constructor.
	  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

	  // Index array by numeric index or specified key function.
	  else if (Array.isArray(object)) {
	    var i = -1,
	        n = object.length,
	        o;

	    if (f == null) while (++i < n) map.set(i, object[i]);
	    else while (++i < n) map.set(f(o = object[i], i, object), o);
	  }

	  // Convert object to map.
	  else if (object) for (var key in object) map.set(key, object[key]);

	  return map;
	}

	var nest = function() {
	  var keys = [],
	      sortKeys = [],
	      sortValues,
	      rollup,
	      nest;

	  function apply(array, depth, createResult, setResult) {
	    if (depth >= keys.length) return rollup != null
	        ? rollup(array) : (sortValues != null
	        ? array.sort(sortValues)
	        : array);

	    var i = -1,
	        n = array.length,
	        key = keys[depth++],
	        keyValue,
	        value,
	        valuesByKey = map$1(),
	        values,
	        result = createResult();

	    while (++i < n) {
	      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
	        values.push(value);
	      } else {
	        valuesByKey.set(keyValue, [value]);
	      }
	    }

	    valuesByKey.each(function(values, key) {
	      setResult(result, key, apply(values, depth, createResult, setResult));
	    });

	    return result;
	  }

	  function entries(map, depth) {
	    if (++depth > keys.length) return map;
	    var array, sortKey = sortKeys[depth - 1];
	    if (rollup != null && depth >= keys.length) array = map.entries();
	    else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
	    return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
	  }

	  return nest = {
	    object: function(array) { return apply(array, 0, createObject, setObject); },
	    map: function(array) { return apply(array, 0, createMap, setMap); },
	    entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
	    key: function(d) { keys.push(d); return nest; },
	    sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
	    sortValues: function(order) { sortValues = order; return nest; },
	    rollup: function(f) { rollup = f; return nest; }
	  };
	};

	function createObject() {
	  return {};
	}

	function setObject(object, key, value) {
	  object[key] = value;
	}

	function createMap() {
	  return map$1();
	}

	function setMap(map, key, value) {
	  map.set(key, value);
	}

	function Set() {}

	var proto = map$1.prototype;

	Set.prototype = set.prototype = {
	  constructor: Set,
	  has: proto.has,
	  add: function(value) {
	    value += "";
	    this[prefix + value] = value;
	    return this;
	  },
	  remove: proto.remove,
	  clear: proto.clear,
	  values: proto.keys,
	  size: proto.size,
	  empty: proto.empty,
	  each: proto.each
	};

	function set(object, f) {
	  var set = new Set;

	  // Copy constructor.
	  if (object instanceof Set) object.each(function(value) { set.add(value); });

	  // Otherwise, assume it’s an array.
	  else if (object) {
	    var i = -1, n = object.length;
	    if (f == null) while (++i < n) set.add(object[i]);
	    else while (++i < n) set.add(f(object[i], i, object));
	  }

	  return set;
	}

	var keys = function(map) {
	  var keys = [];
	  for (var key in map) keys.push(key);
	  return keys;
	};

	var values = function(map) {
	  var values = [];
	  for (var key in map) values.push(map[key]);
	  return values;
	};

	var entries = function(map) {
	  var entries = [];
	  for (var key in map) entries.push({key: key, value: map[key]});
	  return entries;
	};

	var uniform = function(min, max) {
	  min = min == null ? 0 : +min;
	  max = max == null ? 1 : +max;
	  if (arguments.length === 1) max = min, min = 0;
	  else max -= min;
	  return function() {
	    return Math.random() * max + min;
	  };
	};

	var normal = function(mu, sigma) {
	  var x, r;
	  mu = mu == null ? 0 : +mu;
	  sigma = sigma == null ? 1 : +sigma;
	  return function() {
	    var y;

	    // If available, use the second previously-generated uniform random.
	    if (x != null) y = x, x = null;

	    // Otherwise, generate a new x and y.
	    else do {
	      x = Math.random() * 2 - 1;
	      y = Math.random() * 2 - 1;
	      r = x * x + y * y;
	    } while (!r || r > 1);

	    return mu + sigma * y * Math.sqrt(-2 * Math.log(r) / r);
	  };
	};

	var logNormal = function() {
	  var randomNormal = normal.apply(this, arguments);
	  return function() {
	    return Math.exp(randomNormal());
	  };
	};

	var irwinHall = function(n) {
	  return function() {
	    for (var sum = 0, i = 0; i < n; ++i) sum += Math.random();
	    return sum;
	  };
	};

	var bates = function(n) {
	  var randomIrwinHall = irwinHall(n);
	  return function() {
	    return randomIrwinHall() / n;
	  };
	};

	var exponential = function(lambda) {
	  return function() {
	    return -Math.log(1 - Math.random()) / lambda;
	  };
	};

	function linear(t) {
	  return +t;
	}

	function quadIn(t) {
	  return t * t;
	}

	function quadOut(t) {
	  return t * (2 - t);
	}

	function quadInOut(t) {
	  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
	}

	function cubicIn(t) {
	  return t * t * t;
	}

	function cubicOut(t) {
	  return --t * t * t + 1;
	}

	function cubicInOut(t) {
	  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
	}

	var exponent = 3;

	var polyIn = (function custom(e) {
	  e = +e;

	  function polyIn(t) {
	    return Math.pow(t, e);
	  }

	  polyIn.exponent = custom;

	  return polyIn;
	})(exponent);

	var polyOut = (function custom(e) {
	  e = +e;

	  function polyOut(t) {
	    return 1 - Math.pow(1 - t, e);
	  }

	  polyOut.exponent = custom;

	  return polyOut;
	})(exponent);

	var polyInOut = (function custom(e) {
	  e = +e;

	  function polyInOut(t) {
	    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
	  }

	  polyInOut.exponent = custom;

	  return polyInOut;
	})(exponent);

	var pi = Math.PI;
	var halfPi = pi / 2;

	function sinIn(t) {
	  return 1 - Math.cos(t * halfPi);
	}

	function sinOut(t) {
	  return Math.sin(t * halfPi);
	}

	function sinInOut(t) {
	  return (1 - Math.cos(pi * t)) / 2;
	}

	function expIn(t) {
	  return Math.pow(2, 10 * t - 10);
	}

	function expOut(t) {
	  return 1 - Math.pow(2, -10 * t);
	}

	function expInOut(t) {
	  return ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) / 2;
	}

	function circleIn(t) {
	  return 1 - Math.sqrt(1 - t * t);
	}

	function circleOut(t) {
	  return Math.sqrt(1 - --t * t);
	}

	function circleInOut(t) {
	  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
	}

	var b1 = 4 / 11;
	var b2 = 6 / 11;
	var b3 = 8 / 11;
	var b4 = 3 / 4;
	var b5 = 9 / 11;
	var b6 = 10 / 11;
	var b7 = 15 / 16;
	var b8 = 21 / 22;
	var b9 = 63 / 64;
	var b0 = 1 / b1 / b1;

	function bounceIn(t) {
	  return 1 - bounceOut(1 - t);
	}

	function bounceOut(t) {
	  return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
	}

	function bounceInOut(t) {
	  return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
	}

	var overshoot = 1.70158;

	var backIn = (function custom(s) {
	  s = +s;

	  function backIn(t) {
	    return t * t * ((s + 1) * t - s);
	  }

	  backIn.overshoot = custom;

	  return backIn;
	})(overshoot);

	var backOut = (function custom(s) {
	  s = +s;

	  function backOut(t) {
	    return --t * t * ((s + 1) * t + s) + 1;
	  }

	  backOut.overshoot = custom;

	  return backOut;
	})(overshoot);

	var backInOut = (function custom(s) {
	  s = +s;

	  function backInOut(t) {
	    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
	  }

	  backInOut.overshoot = custom;

	  return backInOut;
	})(overshoot);

	var tau = 2 * Math.PI;
	var amplitude = 1;
	var period = 0.3;

	var elasticIn = (function custom(a, p) {
	  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	  function elasticIn(t) {
	    return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
	  }

	  elasticIn.amplitude = function(a) { return custom(a, p * tau); };
	  elasticIn.period = function(p) { return custom(a, p); };

	  return elasticIn;
	})(amplitude, period);

	var elasticOut = (function custom(a, p) {
	  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	  function elasticOut(t) {
	    return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
	  }

	  elasticOut.amplitude = function(a) { return custom(a, p * tau); };
	  elasticOut.period = function(p) { return custom(a, p); };

	  return elasticOut;
	})(amplitude, period);

	var elasticInOut = (function custom(a, p) {
	  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	  function elasticInOut(t) {
	    return ((t = t * 2 - 1) < 0
	        ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
	        : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
	  }

	  elasticInOut.amplitude = function(a) { return custom(a, p * tau); };
	  elasticInOut.period = function(p) { return custom(a, p); };

	  return elasticInOut;
	})(amplitude, period);

	var area = function(polygon) {
	  var i = -1,
	      n = polygon.length,
	      a,
	      b = polygon[n - 1],
	      area = 0;

	  while (++i < n) {
	    a = b;
	    b = polygon[i];
	    area += a[1] * b[0] - a[0] * b[1];
	  }

	  return area / 2;
	};

	var centroid = function(polygon) {
	  var i = -1,
	      n = polygon.length,
	      x = 0,
	      y = 0,
	      a,
	      b = polygon[n - 1],
	      c,
	      k = 0;

	  while (++i < n) {
	    a = b;
	    b = polygon[i];
	    k += c = a[0] * b[1] - b[0] * a[1];
	    x += (a[0] + b[0]) * c;
	    y += (a[1] + b[1]) * c;
	  }

	  return k *= 3, [x / k, y / k];
	};

	// Returns the 2D cross product of AB and AC vectors, i.e., the z-component of
	// the 3D cross product in a quadrant I Cartesian coordinate system (+x is
	// right, +y is up). Returns a positive value if ABC is counter-clockwise,
	// negative if clockwise, and zero if the points are collinear.
	var cross = function(a, b, c) {
	  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
	};

	function lexicographicOrder(a, b) {
	  return a[0] - b[0] || a[1] - b[1];
	}

	// Computes the upper convex hull per the monotone chain algorithm.
	// Assumes points.length >= 3, is sorted by x, unique in y.
	// Returns an array of indices into points in left-to-right order.
	function computeUpperHullIndexes(points) {
	  var n = points.length,
	      indexes = [0, 1],
	      size = 2;

	  for (var i = 2; i < n; ++i) {
	    while (size > 1 && cross(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <= 0) --size;
	    indexes[size++] = i;
	  }

	  return indexes.slice(0, size); // remove popped points
	}

	var hull = function(points) {
	  if ((n = points.length) < 3) return null;

	  var i,
	      n,
	      sortedPoints = new Array(n),
	      flippedPoints = new Array(n);

	  for (i = 0; i < n; ++i) sortedPoints[i] = [+points[i][0], +points[i][1], i];
	  sortedPoints.sort(lexicographicOrder);
	  for (i = 0; i < n; ++i) flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];

	  var upperIndexes = computeUpperHullIndexes(sortedPoints),
	      lowerIndexes = computeUpperHullIndexes(flippedPoints);

	  // Construct the hull polygon, removing possible duplicate endpoints.
	  var skipLeft = lowerIndexes[0] === upperIndexes[0],
	      skipRight = lowerIndexes[lowerIndexes.length - 1] === upperIndexes[upperIndexes.length - 1],
	      hull = [];

	  // Add upper hull in right-to-l order.
	  // Then add lower hull in left-to-right order.
	  for (i = upperIndexes.length - 1; i >= 0; --i) hull.push(points[sortedPoints[upperIndexes[i]][2]]);
	  for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i) hull.push(points[sortedPoints[lowerIndexes[i]][2]]);

	  return hull;
	};

	var contains = function(polygon, point) {
	  var n = polygon.length,
	      p = polygon[n - 1],
	      x = point[0], y = point[1],
	      x0 = p[0], y0 = p[1],
	      x1, y1,
	      inside = false;

	  for (var i = 0; i < n; ++i) {
	    p = polygon[i], x1 = p[0], y1 = p[1];
	    if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside;
	    x0 = x1, y0 = y1;
	  }

	  return inside;
	};

	var length$1 = function(polygon) {
	  var i = -1,
	      n = polygon.length,
	      b = polygon[n - 1],
	      xa,
	      ya,
	      xb = b[0],
	      yb = b[1],
	      perimeter = 0;

	  while (++i < n) {
	    xa = xb;
	    ya = yb;
	    b = polygon[i];
	    xb = b[0];
	    yb = b[1];
	    xa -= xb;
	    ya -= yb;
	    perimeter += Math.sqrt(xa * xa + ya * ya);
	  }

	  return perimeter;
	};

	var pi$1 = Math.PI;
	var tau$1 = 2 * pi$1;
	var epsilon = 1e-6;
	var tauEpsilon = tau$1 - epsilon;

	function Path() {
	  this._x0 = this._y0 = // start of current subpath
	  this._x1 = this._y1 = null; // end of current subpath
	  this._ = "";
	}

	function path() {
	  return new Path;
	}

	Path.prototype = path.prototype = {
	  constructor: Path,
	  moveTo: function(x, y) {
	    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
	  },
	  closePath: function() {
	    if (this._x1 !== null) {
	      this._x1 = this._x0, this._y1 = this._y0;
	      this._ += "Z";
	    }
	  },
	  lineTo: function(x, y) {
	    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  quadraticCurveTo: function(x1, y1, x, y) {
	    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
	    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  arcTo: function(x1, y1, x2, y2, r) {
	    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
	    var x0 = this._x1,
	        y0 = this._y1,
	        x21 = x2 - x1,
	        y21 = y2 - y1,
	        x01 = x0 - x1,
	        y01 = y0 - y1,
	        l01_2 = x01 * x01 + y01 * y01;

	    // Is the radius negative? Error.
	    if (r < 0) throw new Error("negative radius: " + r);

	    // Is this path empty? Move to (x1,y1).
	    if (this._x1 === null) {
	      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
	    }

	    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
	    else if (!(l01_2 > epsilon)) {}

	    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
	    // Equivalently, is (x1,y1) coincident with (x2,y2)?
	    // Or, is the radius zero? Line to (x1,y1).
	    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
	      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
	    }

	    // Otherwise, draw an arc!
	    else {
	      var x20 = x2 - x0,
	          y20 = y2 - y0,
	          l21_2 = x21 * x21 + y21 * y21,
	          l20_2 = x20 * x20 + y20 * y20,
	          l21 = Math.sqrt(l21_2),
	          l01 = Math.sqrt(l01_2),
	          l = r * Math.tan((pi$1 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
	          t01 = l / l01,
	          t21 = l / l21;

	      // If the start tangent is not coincident with (x0,y0), line to.
	      if (Math.abs(t01 - 1) > epsilon) {
	        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
	      }

	      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
	    }
	  },
	  arc: function(x, y, r, a0, a1, ccw) {
	    x = +x, y = +y, r = +r;
	    var dx = r * Math.cos(a0),
	        dy = r * Math.sin(a0),
	        x0 = x + dx,
	        y0 = y + dy,
	        cw = 1 ^ ccw,
	        da = ccw ? a0 - a1 : a1 - a0;

	    // Is the radius negative? Error.
	    if (r < 0) throw new Error("negative radius: " + r);

	    // Is this path empty? Move to (x0,y0).
	    if (this._x1 === null) {
	      this._ += "M" + x0 + "," + y0;
	    }

	    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
	    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
	      this._ += "L" + x0 + "," + y0;
	    }

	    // Is this arc empty? We’re done.
	    if (!r) return;

	    // Is this a complete circle? Draw two arcs to complete the circle.
	    if (da > tauEpsilon) {
	      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
	    }

	    // Otherwise, draw an arc!
	    else {
	      if (da < 0) da = da % tau$1 + tau$1;
	      this._ += "A" + r + "," + r + ",0," + (+(da >= pi$1)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
	    }
	  },
	  rect: function(x, y, w, h) {
	    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
	  },
	  toString: function() {
	    return this._;
	  }
	};

	var tree_add = function(d) {
	  var x = +this._x.call(null, d),
	      y = +this._y.call(null, d);
	  return add(this.cover(x, y), x, y, d);
	};

	function add(tree, x, y, d) {
	  if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

	  var parent,
	      node = tree._root,
	      leaf = {data: d},
	      x0 = tree._x0,
	      y0 = tree._y0,
	      x1 = tree._x1,
	      y1 = tree._y1,
	      xm,
	      ym,
	      xp,
	      yp,
	      right,
	      bottom,
	      i,
	      j;

	  // If the tree is empty, initialize the root as a leaf.
	  if (!node) return tree._root = leaf, tree;

	  // Find the existing leaf for the new point, or add it.
	  while (node.length) {
	    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
	    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
	    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
	  }

	  // Is the new point is exactly coincident with the existing point?
	  xp = +tree._x.call(null, node.data);
	  yp = +tree._y.call(null, node.data);
	  if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

	  // Otherwise, split the leaf node until the old and new point are separated.
	  do {
	    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
	    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
	    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
	  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
	  return parent[j] = node, parent[i] = leaf, tree;
	}

	function addAll(data) {
	  var d, i, n = data.length,
	      x,
	      y,
	      xz = new Array(n),
	      yz = new Array(n),
	      x0 = Infinity,
	      y0 = Infinity,
	      x1 = -Infinity,
	      y1 = -Infinity;

	  // Compute the points and their extent.
	  for (i = 0; i < n; ++i) {
	    if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
	    xz[i] = x;
	    yz[i] = y;
	    if (x < x0) x0 = x;
	    if (x > x1) x1 = x;
	    if (y < y0) y0 = y;
	    if (y > y1) y1 = y;
	  }

	  // If there were no (valid) points, inherit the existing extent.
	  if (x1 < x0) x0 = this._x0, x1 = this._x1;
	  if (y1 < y0) y0 = this._y0, y1 = this._y1;

	  // Expand the tree to cover the new points.
	  this.cover(x0, y0).cover(x1, y1);

	  // Add the new points.
	  for (i = 0; i < n; ++i) {
	    add(this, xz[i], yz[i], data[i]);
	  }

	  return this;
	}

	var tree_cover = function(x, y) {
	  if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

	  var x0 = this._x0,
	      y0 = this._y0,
	      x1 = this._x1,
	      y1 = this._y1;

	  // If the quadtree has no extent, initialize them.
	  // Integer extent are necessary so that if we later double the extent,
	  // the existing quadrant boundaries don’t change due to floating point error!
	  if (isNaN(x0)) {
	    x1 = (x0 = Math.floor(x)) + 1;
	    y1 = (y0 = Math.floor(y)) + 1;
	  }

	  // Otherwise, double repeatedly to cover.
	  else if (x0 > x || x > x1 || y0 > y || y > y1) {
	    var z = x1 - x0,
	        node = this._root,
	        parent,
	        i;

	    switch (i = (y < (y0 + y1) / 2) << 1 | (x < (x0 + x1) / 2)) {
	      case 0: {
	        do parent = new Array(4), parent[i] = node, node = parent;
	        while (z *= 2, x1 = x0 + z, y1 = y0 + z, x > x1 || y > y1);
	        break;
	      }
	      case 1: {
	        do parent = new Array(4), parent[i] = node, node = parent;
	        while (z *= 2, x0 = x1 - z, y1 = y0 + z, x0 > x || y > y1);
	        break;
	      }
	      case 2: {
	        do parent = new Array(4), parent[i] = node, node = parent;
	        while (z *= 2, x1 = x0 + z, y0 = y1 - z, x > x1 || y0 > y);
	        break;
	      }
	      case 3: {
	        do parent = new Array(4), parent[i] = node, node = parent;
	        while (z *= 2, x0 = x1 - z, y0 = y1 - z, x0 > x || y0 > y);
	        break;
	      }
	    }

	    if (this._root && this._root.length) this._root = node;
	  }

	  // If the quadtree covers the point already, just return.
	  else return this;

	  this._x0 = x0;
	  this._y0 = y0;
	  this._x1 = x1;
	  this._y1 = y1;
	  return this;
	};

	var tree_data = function() {
	  var data = [];
	  this.visit(function(node) {
	    if (!node.length) do data.push(node.data); while (node = node.next)
	  });
	  return data;
	};

	var tree_extent = function(_) {
	  return arguments.length
	      ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
	      : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
	};

	var Quad = function(node, x0, y0, x1, y1) {
	  this.node = node;
	  this.x0 = x0;
	  this.y0 = y0;
	  this.x1 = x1;
	  this.y1 = y1;
	};

	var tree_find = function(x, y, radius) {
	  var data,
	      x0 = this._x0,
	      y0 = this._y0,
	      x1,
	      y1,
	      x2,
	      y2,
	      x3 = this._x1,
	      y3 = this._y1,
	      quads = [],
	      node = this._root,
	      q,
	      i;

	  if (node) quads.push(new Quad(node, x0, y0, x3, y3));
	  if (radius == null) radius = Infinity;
	  else {
	    x0 = x - radius, y0 = y - radius;
	    x3 = x + radius, y3 = y + radius;
	    radius *= radius;
	  }

	  while (q = quads.pop()) {

	    // Stop searching if this quadrant can’t contain a closer node.
	    if (!(node = q.node)
	        || (x1 = q.x0) > x3
	        || (y1 = q.y0) > y3
	        || (x2 = q.x1) < x0
	        || (y2 = q.y1) < y0) continue;

	    // Bisect the current quadrant.
	    if (node.length) {
	      var xm = (x1 + x2) / 2,
	          ym = (y1 + y2) / 2;

	      quads.push(
	        new Quad(node[3], xm, ym, x2, y2),
	        new Quad(node[2], x1, ym, xm, y2),
	        new Quad(node[1], xm, y1, x2, ym),
	        new Quad(node[0], x1, y1, xm, ym)
	      );

	      // Visit the closest quadrant first.
	      if (i = (y >= ym) << 1 | (x >= xm)) {
	        q = quads[quads.length - 1];
	        quads[quads.length - 1] = quads[quads.length - 1 - i];
	        quads[quads.length - 1 - i] = q;
	      }
	    }

	    // Visit this point. (Visiting coincident points isn’t necessary!)
	    else {
	      var dx = x - +this._x.call(null, node.data),
	          dy = y - +this._y.call(null, node.data),
	          d2 = dx * dx + dy * dy;
	      if (d2 < radius) {
	        var d = Math.sqrt(radius = d2);
	        x0 = x - d, y0 = y - d;
	        x3 = x + d, y3 = y + d;
	        data = node.data;
	      }
	    }
	  }

	  return data;
	};

	var tree_remove = function(d) {
	  if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

	  var parent,
	      node = this._root,
	      retainer,
	      previous,
	      next,
	      x0 = this._x0,
	      y0 = this._y0,
	      x1 = this._x1,
	      y1 = this._y1,
	      x,
	      y,
	      xm,
	      ym,
	      right,
	      bottom,
	      i,
	      j;

	  // If the tree is empty, initialize the root as a leaf.
	  if (!node) return this;

	  // Find the leaf node for the point.
	  // While descending, also retain the deepest parent with a non-removed sibling.
	  if (node.length) while (true) {
	    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
	    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
	    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
	    if (!node.length) break;
	    if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
	  }

	  // Find the point to remove.
	  while (node.data !== d) if (!(previous = node, node = node.next)) return this;
	  if (next = node.next) delete node.next;

	  // If there are multiple coincident points, remove just the point.
	  if (previous) return (next ? previous.next = next : delete previous.next), this;

	  // If this is the root point, remove it.
	  if (!parent) return this._root = next, this;

	  // Remove this leaf.
	  next ? parent[i] = next : delete parent[i];

	  // If the parent now contains exactly one leaf, collapse superfluous parents.
	  if ((node = parent[0] || parent[1] || parent[2] || parent[3])
	      && node === (parent[3] || parent[2] || parent[1] || parent[0])
	      && !node.length) {
	    if (retainer) retainer[j] = node;
	    else this._root = node;
	  }

	  return this;
	};

	function removeAll(data) {
	  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
	  return this;
	}

	var tree_root = function() {
	  return this._root;
	};

	var tree_size = function() {
	  var size = 0;
	  this.visit(function(node) {
	    if (!node.length) do ++size; while (node = node.next)
	  });
	  return size;
	};

	var tree_visit = function(callback) {
	  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
	  if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
	  while (q = quads.pop()) {
	    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
	      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
	      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
	      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
	      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
	      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
	    }
	  }
	  return this;
	};

	var tree_visitAfter = function(callback) {
	  var quads = [], next = [], q;
	  if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
	  while (q = quads.pop()) {
	    var node = q.node;
	    if (node.length) {
	      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
	      if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
	      if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
	      if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
	      if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
	    }
	    next.push(q);
	  }
	  while (q = next.pop()) {
	    callback(q.node, q.x0, q.y0, q.x1, q.y1);
	  }
	  return this;
	};

	function defaultX(d) {
	  return d[0];
	}

	var tree_x = function(_) {
	  return arguments.length ? (this._x = _, this) : this._x;
	};

	function defaultY(d) {
	  return d[1];
	}

	var tree_y = function(_) {
	  return arguments.length ? (this._y = _, this) : this._y;
	};

	function quadtree(nodes, x, y) {
	  var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
	  return nodes == null ? tree : tree.addAll(nodes);
	}

	function Quadtree(x, y, x0, y0, x1, y1) {
	  this._x = x;
	  this._y = y;
	  this._x0 = x0;
	  this._y0 = y0;
	  this._x1 = x1;
	  this._y1 = y1;
	  this._root = undefined;
	}

	function leaf_copy(leaf) {
	  var copy = {data: leaf.data}, next = copy;
	  while (leaf = leaf.next) next = next.next = {data: leaf.data};
	  return copy;
	}

	var treeProto = quadtree.prototype = Quadtree.prototype;

	treeProto.copy = function() {
	  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
	      node = this._root,
	      nodes,
	      child;

	  if (!node) return copy;

	  if (!node.length) return copy._root = leaf_copy(node), copy;

	  nodes = [{source: node, target: copy._root = new Array(4)}];
	  while (node = nodes.pop()) {
	    for (var i = 0; i < 4; ++i) {
	      if (child = node.source[i]) {
	        if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
	        else node.target[i] = leaf_copy(child);
	      }
	    }
	  }

	  return copy;
	};

	treeProto.add = tree_add;
	treeProto.addAll = addAll;
	treeProto.cover = tree_cover;
	treeProto.data = tree_data;
	treeProto.extent = tree_extent;
	treeProto.find = tree_find;
	treeProto.remove = tree_remove;
	treeProto.removeAll = removeAll;
	treeProto.root = tree_root;
	treeProto.size = tree_size;
	treeProto.visit = tree_visit;
	treeProto.visitAfter = tree_visitAfter;
	treeProto.x = tree_x;
	treeProto.y = tree_y;

	var slice$1 = [].slice;

	var noabort = {};

	function Queue(size) {
	  if (!(size >= 1)) throw new Error;
	  this._size = size;
	  this._call =
	  this._error = null;
	  this._tasks = [];
	  this._data = [];
	  this._waiting =
	  this._active =
	  this._ended =
	  this._start = 0; // inside a synchronous task callback?
	}

	Queue.prototype = queue.prototype = {
	  constructor: Queue,
	  defer: function(callback) {
	    if (typeof callback !== "function" || this._call) throw new Error;
	    if (this._error != null) return this;
	    var t = slice$1.call(arguments, 1);
	    t.push(callback);
	    ++this._waiting, this._tasks.push(t);
	    poke(this);
	    return this;
	  },
	  abort: function() {
	    if (this._error == null) abort(this, new Error("abort"));
	    return this;
	  },
	  await: function(callback) {
	    if (typeof callback !== "function" || this._call) throw new Error;
	    this._call = function(error, results) { callback.apply(null, [error].concat(results)); };
	    maybeNotify(this);
	    return this;
	  },
	  awaitAll: function(callback) {
	    if (typeof callback !== "function" || this._call) throw new Error;
	    this._call = callback;
	    maybeNotify(this);
	    return this;
	  }
	};

	function poke(q) {
	  if (!q._start) {
	    try { start(q); } // let the current task complete
	    catch (e) {
	      if (q._tasks[q._ended + q._active - 1]) abort(q, e); // task errored synchronously
	      else if (!q._data) throw e; // await callback errored synchronously
	    }
	  }
	}

	function start(q) {
	  while (q._start = q._waiting && q._active < q._size) {
	    var i = q._ended + q._active,
	        t = q._tasks[i],
	        j = t.length - 1,
	        c = t[j];
	    t[j] = end(q, i);
	    --q._waiting, ++q._active;
	    t = c.apply(null, t);
	    if (!q._tasks[i]) continue; // task finished synchronously
	    q._tasks[i] = t || noabort;
	  }
	}

	function end(q, i) {
	  return function(e, r) {
	    if (!q._tasks[i]) return; // ignore multiple callbacks
	    --q._active, ++q._ended;
	    q._tasks[i] = null;
	    if (q._error != null) return; // ignore secondary errors
	    if (e != null) {
	      abort(q, e);
	    } else {
	      q._data[i] = r;
	      if (q._waiting) poke(q);
	      else maybeNotify(q);
	    }
	  };
	}

	function abort(q, e) {
	  var i = q._tasks.length, t;
	  q._error = e; // ignore active callbacks
	  q._data = undefined; // allow gc
	  q._waiting = NaN; // prevent starting

	  while (--i >= 0) {
	    if (t = q._tasks[i]) {
	      q._tasks[i] = null;
	      if (t.abort) {
	        try { t.abort(); }
	        catch (e) { /* ignore */ }
	      }
	    }
	  }

	  q._active = NaN; // allow notification
	  maybeNotify(q);
	}

	function maybeNotify(q) {
	  if (!q._active && q._call) {
	    var d = q._data;
	    q._data = undefined; // allow gc
	    q._call(q._error, d);
	  }
	}

	function queue(concurrency) {
	  return new Queue(arguments.length ? +concurrency : Infinity);
	}

	var constant$2 = function(x) {
	  return function constant() {
	    return x;
	  };
	};

	var epsilon$1 = 1e-12;
	var pi$2 = Math.PI;
	var halfPi$1 = pi$2 / 2;
	var tau$2 = 2 * pi$2;

	function arcInnerRadius(d) {
	  return d.innerRadius;
	}

	function arcOuterRadius(d) {
	  return d.outerRadius;
	}

	function arcStartAngle(d) {
	  return d.startAngle;
	}

	function arcEndAngle(d) {
	  return d.endAngle;
	}

	function arcPadAngle(d) {
	  return d && d.padAngle; // Note: optional!
	}

	function asin(x) {
	  return x >= 1 ? halfPi$1 : x <= -1 ? -halfPi$1 : Math.asin(x);
	}

	function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
	  var x10 = x1 - x0, y10 = y1 - y0,
	      x32 = x3 - x2, y32 = y3 - y2,
	      t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
	  return [x0 + t * x10, y0 + t * y10];
	}

	// Compute perpendicular offset line of length rc.
	// http://mathworld.wolfram.com/Circle-LineIntersection.html
	function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
	  var x01 = x0 - x1,
	      y01 = y0 - y1,
	      lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
	      ox = lo * y01,
	      oy = -lo * x01,
	      x11 = x0 + ox,
	      y11 = y0 + oy,
	      x10 = x1 + ox,
	      y10 = y1 + oy,
	      x00 = (x11 + x10) / 2,
	      y00 = (y11 + y10) / 2,
	      dx = x10 - x11,
	      dy = y10 - y11,
	      d2 = dx * dx + dy * dy,
	      r = r1 - rc,
	      D = x11 * y10 - x10 * y11,
	      d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)),
	      cx0 = (D * dy - dx * d) / d2,
	      cy0 = (-D * dx - dy * d) / d2,
	      cx1 = (D * dy + dx * d) / d2,
	      cy1 = (-D * dx + dy * d) / d2,
	      dx0 = cx0 - x00,
	      dy0 = cy0 - y00,
	      dx1 = cx1 - x00,
	      dy1 = cy1 - y00;

	  // Pick the closer of the two intersection points.
	  // TODO Is there a faster way to determine which intersection to use?
	  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

	  return {
	    cx: cx0,
	    cy: cy0,
	    x01: -ox,
	    y01: -oy,
	    x11: cx0 * (r1 / r - 1),
	    y11: cy0 * (r1 / r - 1)
	  };
	}

	var arc = function() {
	  var innerRadius = arcInnerRadius,
	      outerRadius = arcOuterRadius,
	      cornerRadius = constant$2(0),
	      padRadius = null,
	      startAngle = arcStartAngle,
	      endAngle = arcEndAngle,
	      padAngle = arcPadAngle,
	      context = null;

	  function arc() {
	    var buffer,
	        r,
	        r0 = +innerRadius.apply(this, arguments),
	        r1 = +outerRadius.apply(this, arguments),
	        a0 = startAngle.apply(this, arguments) - halfPi$1,
	        a1 = endAngle.apply(this, arguments) - halfPi$1,
	        da = Math.abs(a1 - a0),
	        cw = a1 > a0;

	    if (!context) context = buffer = path();

	    // Ensure that the outer radius is always larger than the inner radius.
	    if (r1 < r0) r = r1, r1 = r0, r0 = r;

	    // Is it a point?
	    if (!(r1 > epsilon$1)) context.moveTo(0, 0);

	    // Or is it a circle or annulus?
	    else if (da > tau$2 - epsilon$1) {
	      context.moveTo(r1 * Math.cos(a0), r1 * Math.sin(a0));
	      context.arc(0, 0, r1, a0, a1, !cw);
	      if (r0 > epsilon$1) {
	        context.moveTo(r0 * Math.cos(a1), r0 * Math.sin(a1));
	        context.arc(0, 0, r0, a1, a0, cw);
	      }
	    }

	    // Or is it a circular or annular sector?
	    else {
	      var a01 = a0,
	          a11 = a1,
	          a00 = a0,
	          a10 = a1,
	          da0 = da,
	          da1 = da,
	          ap = padAngle.apply(this, arguments) / 2,
	          rp = (ap > epsilon$1) && (padRadius ? +padRadius.apply(this, arguments) : Math.sqrt(r0 * r0 + r1 * r1)),
	          rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
	          rc0 = rc,
	          rc1 = rc,
	          t0,
	          t1;

	      // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
	      if (rp > epsilon$1) {
	        var p0 = asin(rp / r0 * Math.sin(ap)),
	            p1 = asin(rp / r1 * Math.sin(ap));
	        if ((da0 -= p0 * 2) > epsilon$1) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
	        else da0 = 0, a00 = a10 = (a0 + a1) / 2;
	        if ((da1 -= p1 * 2) > epsilon$1) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
	        else da1 = 0, a01 = a11 = (a0 + a1) / 2;
	      }

	      var x01 = r1 * Math.cos(a01),
	          y01 = r1 * Math.sin(a01),
	          x10 = r0 * Math.cos(a10),
	          y10 = r0 * Math.sin(a10);

	      // Apply rounded corners?
	      if (rc > epsilon$1) {
	        var x11 = r1 * Math.cos(a11),
	            y11 = r1 * Math.sin(a11),
	            x00 = r0 * Math.cos(a00),
	            y00 = r0 * Math.sin(a00);

	        // Restrict the corner radius according to the sector angle.
	        if (da < pi$2) {
	          var oc = da0 > epsilon$1 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
	              ax = x01 - oc[0],
	              ay = y01 - oc[1],
	              bx = x11 - oc[0],
	              by = y11 - oc[1],
	              kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
	              lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
	          rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
	          rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
	        }
	      }

	      // Is the sector collapsed to a line?
	      if (!(da1 > epsilon$1)) context.moveTo(x01, y01);

	      // Does the sector’s outer ring have rounded corners?
	      else if (rc1 > epsilon$1) {
	        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
	        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

	        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

	        // Have the corners merged?
	        if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);

	        // Otherwise, draw the two corners and the ring.
	        else {
	          context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
	          context.arc(0, 0, r1, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
	          context.arc(t1.cx, t1.cy, rc1, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
	        }
	      }

	      // Or is the outer ring just a circular arc?
	      else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

	      // Is there no inner ring, and it’s a circular sector?
	      // Or perhaps it’s an annular sector collapsed due to padding?
	      if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);

	      // Does the sector’s inner ring (or point) have rounded corners?
	      else if (rc0 > epsilon$1) {
	        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
	        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

	        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

	        // Have the corners merged?
	        if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);

	        // Otherwise, draw the two corners and the ring.
	        else {
	          context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
	          context.arc(0, 0, r0, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
	          context.arc(t1.cx, t1.cy, rc0, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
	        }
	      }

	      // Or is the inner ring just a circular arc?
	      else context.arc(0, 0, r0, a10, a00, cw);
	    }

	    context.closePath();

	    if (buffer) return context = null, buffer + "" || null;
	  }

	  arc.centroid = function() {
	    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
	        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$2 / 2;
	    return [Math.cos(a) * r, Math.sin(a) * r];
	  };

	  arc.innerRadius = function(_) {
	    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$2(+_), arc) : innerRadius;
	  };

	  arc.outerRadius = function(_) {
	    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$2(+_), arc) : outerRadius;
	  };

	  arc.cornerRadius = function(_) {
	    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$2(+_), arc) : cornerRadius;
	  };

	  arc.padRadius = function(_) {
	    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$2(+_), arc) : padRadius;
	  };

	  arc.startAngle = function(_) {
	    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$2(+_), arc) : startAngle;
	  };

	  arc.endAngle = function(_) {
	    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$2(+_), arc) : endAngle;
	  };

	  arc.padAngle = function(_) {
	    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$2(+_), arc) : padAngle;
	  };

	  arc.context = function(_) {
	    return arguments.length ? ((context = _ == null ? null : _), arc) : context;
	  };

	  return arc;
	};

	function Linear(context) {
	  this._context = context;
	}

	Linear.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; // proceed
	      default: this._context.lineTo(x, y); break;
	    }
	  }
	};

	var curveLinear = function(context) {
	  return new Linear(context);
	};

	function x(p) {
	  return p[0];
	}

	function y(p) {
	  return p[1];
	}

	var line = function() {
	  var x$$1 = x,
	      y$$1 = y,
	      defined = constant$2(true),
	      context = null,
	      curve = curveLinear,
	      output = null;

	  function line(data) {
	    var i,
	        n = data.length,
	        d,
	        defined0 = false,
	        buffer;

	    if (context == null) output = curve(buffer = path());

	    for (i = 0; i <= n; ++i) {
	      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
	        if (defined0 = !defined0) output.lineStart();
	        else output.lineEnd();
	      }
	      if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
	    }

	    if (buffer) return output = null, buffer + "" || null;
	  }

	  line.x = function(_) {
	    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$2(+_), line) : x$$1;
	  };

	  line.y = function(_) {
	    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$2(+_), line) : y$$1;
	  };

	  line.defined = function(_) {
	    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), line) : defined;
	  };

	  line.curve = function(_) {
	    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
	  };

	  line.context = function(_) {
	    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
	  };

	  return line;
	};

	var area$1 = function() {
	  var x0 = x,
	      x1 = null,
	      y0 = constant$2(0),
	      y1 = y,
	      defined = constant$2(true),
	      context = null,
	      curve = curveLinear,
	      output = null;

	  function area(data) {
	    var i,
	        j,
	        k,
	        n = data.length,
	        d,
	        defined0 = false,
	        buffer,
	        x0z = new Array(n),
	        y0z = new Array(n);

	    if (context == null) output = curve(buffer = path());

	    for (i = 0; i <= n; ++i) {
	      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
	        if (defined0 = !defined0) {
	          j = i;
	          output.areaStart();
	          output.lineStart();
	        } else {
	          output.lineEnd();
	          output.lineStart();
	          for (k = i - 1; k >= j; --k) {
	            output.point(x0z[k], y0z[k]);
	          }
	          output.lineEnd();
	          output.areaEnd();
	        }
	      }
	      if (defined0) {
	        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
	        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
	      }
	    }

	    if (buffer) return output = null, buffer + "" || null;
	  }

	  function arealine() {
	    return line().defined(defined).curve(curve).context(context);
	  }

	  area.x = function(_) {
	    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$2(+_), x1 = null, area) : x0;
	  };

	  area.x0 = function(_) {
	    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$2(+_), area) : x0;
	  };

	  area.x1 = function(_) {
	    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$2(+_), area) : x1;
	  };

	  area.y = function(_) {
	    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$2(+_), y1 = null, area) : y0;
	  };

	  area.y0 = function(_) {
	    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$2(+_), area) : y0;
	  };

	  area.y1 = function(_) {
	    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$2(+_), area) : y1;
	  };

	  area.lineX0 =
	  area.lineY0 = function() {
	    return arealine().x(x0).y(y0);
	  };

	  area.lineY1 = function() {
	    return arealine().x(x0).y(y1);
	  };

	  area.lineX1 = function() {
	    return arealine().x(x1).y(y0);
	  };

	  area.defined = function(_) {
	    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), area) : defined;
	  };

	  area.curve = function(_) {
	    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
	  };

	  area.context = function(_) {
	    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
	  };

	  return area;
	};

	var descending$1 = function(a, b) {
	  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	};

	var identity$1 = function(d) {
	  return d;
	};

	var pie = function() {
	  var value = identity$1,
	      sortValues = descending$1,
	      sort = null,
	      startAngle = constant$2(0),
	      endAngle = constant$2(tau$2),
	      padAngle = constant$2(0);

	  function pie(data) {
	    var i,
	        n = data.length,
	        j,
	        k,
	        sum = 0,
	        index = new Array(n),
	        arcs = new Array(n),
	        a0 = +startAngle.apply(this, arguments),
	        da = Math.min(tau$2, Math.max(-tau$2, endAngle.apply(this, arguments) - a0)),
	        a1,
	        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
	        pa = p * (da < 0 ? -1 : 1),
	        v;

	    for (i = 0; i < n; ++i) {
	      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
	        sum += v;
	      }
	    }

	    // Optionally sort the arcs by previously-computed values or by data.
	    if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
	    else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

	    // Compute the arcs! They are stored in the original data's order.
	    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
	      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
	        data: data[j],
	        index: i,
	        value: v,
	        startAngle: a0,
	        endAngle: a1,
	        padAngle: p
	      };
	    }

	    return arcs;
	  }

	  pie.value = function(_) {
	    return arguments.length ? (value = typeof _ === "function" ? _ : constant$2(+_), pie) : value;
	  };

	  pie.sortValues = function(_) {
	    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
	  };

	  pie.sort = function(_) {
	    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
	  };

	  pie.startAngle = function(_) {
	    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$2(+_), pie) : startAngle;
	  };

	  pie.endAngle = function(_) {
	    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$2(+_), pie) : endAngle;
	  };

	  pie.padAngle = function(_) {
	    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$2(+_), pie) : padAngle;
	  };

	  return pie;
	};

	var curveRadialLinear = curveRadial(curveLinear);

	function Radial(curve) {
	  this._curve = curve;
	}

	Radial.prototype = {
	  areaStart: function() {
	    this._curve.areaStart();
	  },
	  areaEnd: function() {
	    this._curve.areaEnd();
	  },
	  lineStart: function() {
	    this._curve.lineStart();
	  },
	  lineEnd: function() {
	    this._curve.lineEnd();
	  },
	  point: function(a, r) {
	    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
	  }
	};

	function curveRadial(curve) {

	  function radial(context) {
	    return new Radial(curve(context));
	  }

	  radial._curve = curve;

	  return radial;
	}

	function radialLine(l) {
	  var c = l.curve;

	  l.angle = l.x, delete l.x;
	  l.radius = l.y, delete l.y;

	  l.curve = function(_) {
	    return arguments.length ? c(curveRadial(_)) : c()._curve;
	  };

	  return l;
	}

	var radialLine$1 = function() {
	  return radialLine(line().curve(curveRadialLinear));
	};

	var radialArea = function() {
	  var a = area$1().curve(curveRadialLinear),
	      c = a.curve,
	      x0 = a.lineX0,
	      x1 = a.lineX1,
	      y0 = a.lineY0,
	      y1 = a.lineY1;

	  a.angle = a.x, delete a.x;
	  a.startAngle = a.x0, delete a.x0;
	  a.endAngle = a.x1, delete a.x1;
	  a.radius = a.y, delete a.y;
	  a.innerRadius = a.y0, delete a.y0;
	  a.outerRadius = a.y1, delete a.y1;
	  a.lineStartAngle = function() { return radialLine(x0()); }, delete a.lineX0;
	  a.lineEndAngle = function() { return radialLine(x1()); }, delete a.lineX1;
	  a.lineInnerRadius = function() { return radialLine(y0()); }, delete a.lineY0;
	  a.lineOuterRadius = function() { return radialLine(y1()); }, delete a.lineY1;

	  a.curve = function(_) {
	    return arguments.length ? c(curveRadial(_)) : c()._curve;
	  };

	  return a;
	};

	var circle = {
	  draw: function(context, size) {
	    var r = Math.sqrt(size / pi$2);
	    context.moveTo(r, 0);
	    context.arc(0, 0, r, 0, tau$2);
	  }
	};

	var cross$1 = {
	  draw: function(context, size) {
	    var r = Math.sqrt(size / 5) / 2;
	    context.moveTo(-3 * r, -r);
	    context.lineTo(-r, -r);
	    context.lineTo(-r, -3 * r);
	    context.lineTo(r, -3 * r);
	    context.lineTo(r, -r);
	    context.lineTo(3 * r, -r);
	    context.lineTo(3 * r, r);
	    context.lineTo(r, r);
	    context.lineTo(r, 3 * r);
	    context.lineTo(-r, 3 * r);
	    context.lineTo(-r, r);
	    context.lineTo(-3 * r, r);
	    context.closePath();
	  }
	};

	var tan30 = Math.sqrt(1 / 3);
	var tan30_2 = tan30 * 2;

	var diamond = {
	  draw: function(context, size) {
	    var y = Math.sqrt(size / tan30_2),
	        x = y * tan30;
	    context.moveTo(0, -y);
	    context.lineTo(x, 0);
	    context.lineTo(0, y);
	    context.lineTo(-x, 0);
	    context.closePath();
	  }
	};

	var ka = 0.89081309152928522810;
	var kr = Math.sin(pi$2 / 10) / Math.sin(7 * pi$2 / 10);
	var kx = Math.sin(tau$2 / 10) * kr;
	var ky = -Math.cos(tau$2 / 10) * kr;

	var star = {
	  draw: function(context, size) {
	    var r = Math.sqrt(size * ka),
	        x = kx * r,
	        y = ky * r;
	    context.moveTo(0, -r);
	    context.lineTo(x, y);
	    for (var i = 1; i < 5; ++i) {
	      var a = tau$2 * i / 5,
	          c = Math.cos(a),
	          s = Math.sin(a);
	      context.lineTo(s * r, -c * r);
	      context.lineTo(c * x - s * y, s * x + c * y);
	    }
	    context.closePath();
	  }
	};

	var square = {
	  draw: function(context, size) {
	    var w = Math.sqrt(size),
	        x = -w / 2;
	    context.rect(x, x, w, w);
	  }
	};

	var sqrt3 = Math.sqrt(3);

	var triangle = {
	  draw: function(context, size) {
	    var y = -Math.sqrt(size / (sqrt3 * 3));
	    context.moveTo(0, y * 2);
	    context.lineTo(-sqrt3 * y, -y);
	    context.lineTo(sqrt3 * y, -y);
	    context.closePath();
	  }
	};

	var c = -0.5;
	var s = Math.sqrt(3) / 2;
	var k = 1 / Math.sqrt(12);
	var a = (k / 2 + 1) * 3;

	var wye = {
	  draw: function(context, size) {
	    var r = Math.sqrt(size / a),
	        x0 = r / 2,
	        y0 = r * k,
	        x1 = x0,
	        y1 = r * k + r,
	        x2 = -x1,
	        y2 = y1;
	    context.moveTo(x0, y0);
	    context.lineTo(x1, y1);
	    context.lineTo(x2, y2);
	    context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
	    context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
	    context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
	    context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
	    context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
	    context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
	    context.closePath();
	  }
	};

	var symbols = [
	  circle,
	  cross$1,
	  diamond,
	  square,
	  star,
	  triangle,
	  wye
	];

	var symbol = function() {
	  var type = constant$2(circle),
	      size = constant$2(64),
	      context = null;

	  function symbol() {
	    var buffer;
	    if (!context) context = buffer = path();
	    type.apply(this, arguments).draw(context, +size.apply(this, arguments));
	    if (buffer) return context = null, buffer + "" || null;
	  }

	  symbol.type = function(_) {
	    return arguments.length ? (type = typeof _ === "function" ? _ : constant$2(_), symbol) : type;
	  };

	  symbol.size = function(_) {
	    return arguments.length ? (size = typeof _ === "function" ? _ : constant$2(+_), symbol) : size;
	  };

	  symbol.context = function(_) {
	    return arguments.length ? (context = _ == null ? null : _, symbol) : context;
	  };

	  return symbol;
	};

	var noop = function() {};

	function point(that, x, y) {
	  that._context.bezierCurveTo(
	    (2 * that._x0 + that._x1) / 3,
	    (2 * that._y0 + that._y1) / 3,
	    (that._x0 + 2 * that._x1) / 3,
	    (that._y0 + 2 * that._y1) / 3,
	    (that._x0 + 4 * that._x1 + x) / 6,
	    (that._y0 + 4 * that._y1 + y) / 6
	  );
	}

	function Basis(context) {
	  this._context = context;
	}

	Basis.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 =
	    this._y0 = this._y1 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 3: point(this, this._x1, this._y1); // proceed
	      case 2: this._context.lineTo(this._x1, this._y1); break;
	    }
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
	      default: point(this, x, y); break;
	    }
	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	  }
	};

	var basis = function(context) {
	  return new Basis(context);
	};

	function BasisClosed(context) {
	  this._context = context;
	}

	BasisClosed.prototype = {
	  areaStart: noop,
	  areaEnd: noop,
	  lineStart: function() {
	    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 =
	    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 1: {
	        this._context.moveTo(this._x2, this._y2);
	        this._context.closePath();
	        break;
	      }
	      case 2: {
	        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
	        this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
	        this._context.closePath();
	        break;
	      }
	      case 3: {
	        this.point(this._x2, this._y2);
	        this.point(this._x3, this._y3);
	        this.point(this._x4, this._y4);
	        break;
	      }
	    }
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._x2 = x, this._y2 = y; break;
	      case 1: this._point = 2; this._x3 = x, this._y3 = y; break;
	      case 2: this._point = 3; this._x4 = x, this._y4 = y; this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6); break;
	      default: point(this, x, y); break;
	    }
	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	  }
	};

	var basisClosed = function(context) {
	  return new BasisClosed(context);
	};

	function BasisOpen(context) {
	  this._context = context;
	}

	BasisOpen.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 =
	    this._y0 = this._y1 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6; this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0); break;
	      case 3: this._point = 4; // proceed
	      default: point(this, x, y); break;
	    }
	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	  }
	};

	var basisOpen = function(context) {
	  return new BasisOpen(context);
	};

	function Bundle(context, beta) {
	  this._basis = new Basis(context);
	  this._beta = beta;
	}

	Bundle.prototype = {
	  lineStart: function() {
	    this._x = [];
	    this._y = [];
	    this._basis.lineStart();
	  },
	  lineEnd: function() {
	    var x = this._x,
	        y = this._y,
	        j = x.length - 1;

	    if (j > 0) {
	      var x0 = x[0],
	          y0 = y[0],
	          dx = x[j] - x0,
	          dy = y[j] - y0,
	          i = -1,
	          t;

	      while (++i <= j) {
	        t = i / j;
	        this._basis.point(
	          this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
	          this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
	        );
	      }
	    }

	    this._x = this._y = null;
	    this._basis.lineEnd();
	  },
	  point: function(x, y) {
	    this._x.push(+x);
	    this._y.push(+y);
	  }
	};

	var bundle = (function custom(beta) {

	  function bundle(context) {
	    return beta === 1 ? new Basis(context) : new Bundle(context, beta);
	  }

	  bundle.beta = function(beta) {
	    return custom(+beta);
	  };

	  return bundle;
	})(0.85);

	function point$1(that, x, y) {
	  that._context.bezierCurveTo(
	    that._x1 + that._k * (that._x2 - that._x0),
	    that._y1 + that._k * (that._y2 - that._y0),
	    that._x2 + that._k * (that._x1 - x),
	    that._y2 + that._k * (that._y1 - y),
	    that._x2,
	    that._y2
	  );
	}

	function Cardinal(context, tension) {
	  this._context = context;
	  this._k = (1 - tension) / 6;
	}

	Cardinal.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 = this._x2 =
	    this._y0 = this._y1 = this._y2 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 2: this._context.lineTo(this._x2, this._y2); break;
	      case 3: point$1(this, this._x1, this._y1); break;
	    }
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
	      case 2: this._point = 3; // proceed
	      default: point$1(this, x, y); break;
	    }
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	var cardinal = (function custom(tension) {

	  function cardinal(context) {
	    return new Cardinal(context, tension);
	  }

	  cardinal.tension = function(tension) {
	    return custom(+tension);
	  };

	  return cardinal;
	})(0);

	function CardinalClosed(context, tension) {
	  this._context = context;
	  this._k = (1 - tension) / 6;
	}

	CardinalClosed.prototype = {
	  areaStart: noop,
	  areaEnd: noop,
	  lineStart: function() {
	    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
	    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 1: {
	        this._context.moveTo(this._x3, this._y3);
	        this._context.closePath();
	        break;
	      }
	      case 2: {
	        this._context.lineTo(this._x3, this._y3);
	        this._context.closePath();
	        break;
	      }
	      case 3: {
	        this.point(this._x3, this._y3);
	        this.point(this._x4, this._y4);
	        this.point(this._x5, this._y5);
	        break;
	      }
	    }
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
	      case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
	      case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
	      default: point$1(this, x, y); break;
	    }
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	var cardinalClosed = (function custom(tension) {

	  function cardinal(context) {
	    return new CardinalClosed(context, tension);
	  }

	  cardinal.tension = function(tension) {
	    return custom(+tension);
	  };

	  return cardinal;
	})(0);

	function CardinalOpen(context, tension) {
	  this._context = context;
	  this._k = (1 - tension) / 6;
	}

	CardinalOpen.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 = this._x2 =
	    this._y0 = this._y1 = this._y2 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
	      case 3: this._point = 4; // proceed
	      default: point$1(this, x, y); break;
	    }
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	var cardinalOpen = (function custom(tension) {

	  function cardinal(context) {
	    return new CardinalOpen(context, tension);
	  }

	  cardinal.tension = function(tension) {
	    return custom(+tension);
	  };

	  return cardinal;
	})(0);

	function point$2(that, x, y) {
	  var x1 = that._x1,
	      y1 = that._y1,
	      x2 = that._x2,
	      y2 = that._y2;

	  if (that._l01_a > epsilon$1) {
	    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
	        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
	    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
	    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
	  }

	  if (that._l23_a > epsilon$1) {
	    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
	        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
	    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
	    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
	  }

	  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
	}

	function CatmullRom(context, alpha) {
	  this._context = context;
	  this._alpha = alpha;
	}

	CatmullRom.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 = this._x2 =
	    this._y0 = this._y1 = this._y2 = NaN;
	    this._l01_a = this._l12_a = this._l23_a =
	    this._l01_2a = this._l12_2a = this._l23_2a =
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 2: this._context.lineTo(this._x2, this._y2); break;
	      case 3: this.point(this._x2, this._y2); break;
	    }
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;

	    if (this._point) {
	      var x23 = this._x2 - x,
	          y23 = this._y2 - y;
	      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
	    }

	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; // proceed
	      default: point$2(this, x, y); break;
	    }

	    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
	    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	var catmullRom = (function custom(alpha) {

	  function catmullRom(context) {
	    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
	  }

	  catmullRom.alpha = function(alpha) {
	    return custom(+alpha);
	  };

	  return catmullRom;
	})(0.5);

	function CatmullRomClosed(context, alpha) {
	  this._context = context;
	  this._alpha = alpha;
	}

	CatmullRomClosed.prototype = {
	  areaStart: noop,
	  areaEnd: noop,
	  lineStart: function() {
	    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
	    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
	    this._l01_a = this._l12_a = this._l23_a =
	    this._l01_2a = this._l12_2a = this._l23_2a =
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 1: {
	        this._context.moveTo(this._x3, this._y3);
	        this._context.closePath();
	        break;
	      }
	      case 2: {
	        this._context.lineTo(this._x3, this._y3);
	        this._context.closePath();
	        break;
	      }
	      case 3: {
	        this.point(this._x3, this._y3);
	        this.point(this._x4, this._y4);
	        this.point(this._x5, this._y5);
	        break;
	      }
	    }
	  },
	  point: function(x, y) {
	    x = +x, y = +y;

	    if (this._point) {
	      var x23 = this._x2 - x,
	          y23 = this._y2 - y;
	      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
	    }

	    switch (this._point) {
	      case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
	      case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
	      case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
	      default: point$2(this, x, y); break;
	    }

	    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
	    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	var catmullRomClosed = (function custom(alpha) {

	  function catmullRom(context) {
	    return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
	  }

	  catmullRom.alpha = function(alpha) {
	    return custom(+alpha);
	  };

	  return catmullRom;
	})(0.5);

	function CatmullRomOpen(context, alpha) {
	  this._context = context;
	  this._alpha = alpha;
	}

	CatmullRomOpen.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 = this._x2 =
	    this._y0 = this._y1 = this._y2 = NaN;
	    this._l01_a = this._l12_a = this._l23_a =
	    this._l01_2a = this._l12_2a = this._l23_2a =
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;

	    if (this._point) {
	      var x23 = this._x2 - x,
	          y23 = this._y2 - y;
	      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
	    }

	    switch (this._point) {
	      case 0: this._point = 1; break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
	      case 3: this._point = 4; // proceed
	      default: point$2(this, x, y); break;
	    }

	    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
	    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	var catmullRomOpen = (function custom(alpha) {

	  function catmullRom(context) {
	    return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
	  }

	  catmullRom.alpha = function(alpha) {
	    return custom(+alpha);
	  };

	  return catmullRom;
	})(0.5);

	function LinearClosed(context) {
	  this._context = context;
	}

	LinearClosed.prototype = {
	  areaStart: noop,
	  areaEnd: noop,
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._point) this._context.closePath();
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    if (this._point) this._context.lineTo(x, y);
	    else this._point = 1, this._context.moveTo(x, y);
	  }
	};

	var linearClosed = function(context) {
	  return new LinearClosed(context);
	};

	function sign(x) {
	  return x < 0 ? -1 : 1;
	}

	// Calculate the slopes of the tangents (Hermite-type interpolation) based on
	// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
	// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
	// NOV(II), P. 443, 1990.
	function slope3(that, x2, y2) {
	  var h0 = that._x1 - that._x0,
	      h1 = x2 - that._x1,
	      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
	      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
	      p = (s0 * h1 + s1 * h0) / (h0 + h1);
	  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
	}

	// Calculate a one-sided slope.
	function slope2(that, t) {
	  var h = that._x1 - that._x0;
	  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
	}

	// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
	// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
	// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
	function point$3(that, t0, t1) {
	  var x0 = that._x0,
	      y0 = that._y0,
	      x1 = that._x1,
	      y1 = that._y1,
	      dx = (x1 - x0) / 3;
	  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
	}

	function MonotoneX(context) {
	  this._context = context;
	}

	MonotoneX.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 =
	    this._y0 = this._y1 =
	    this._t0 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 2: this._context.lineTo(this._x1, this._y1); break;
	      case 3: point$3(this, this._t0, slope2(this, this._t0)); break;
	    }
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    var t1 = NaN;

	    x = +x, y = +y;
	    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; point$3(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
	      default: point$3(this, this._t0, t1 = slope3(this, x, y)); break;
	    }

	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	    this._t0 = t1;
	  }
	};

	function MonotoneY(context) {
	  this._context = new ReflectContext(context);
	}

	(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
	  MonotoneX.prototype.point.call(this, y, x);
	};

	function ReflectContext(context) {
	  this._context = context;
	}

	ReflectContext.prototype = {
	  moveTo: function(x, y) { this._context.moveTo(y, x); },
	  closePath: function() { this._context.closePath(); },
	  lineTo: function(x, y) { this._context.lineTo(y, x); },
	  bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
	};

	function monotoneX(context) {
	  return new MonotoneX(context);
	}

	function monotoneY(context) {
	  return new MonotoneY(context);
	}

	function Natural(context) {
	  this._context = context;
	}

	Natural.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x = [];
	    this._y = [];
	  },
	  lineEnd: function() {
	    var x = this._x,
	        y = this._y,
	        n = x.length;

	    if (n) {
	      this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
	      if (n === 2) {
	        this._context.lineTo(x[1], y[1]);
	      } else {
	        var px = controlPoints(x),
	            py = controlPoints(y);
	        for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
	          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
	        }
	      }
	    }

	    if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	    this._x = this._y = null;
	  },
	  point: function(x, y) {
	    this._x.push(+x);
	    this._y.push(+y);
	  }
	};

	// See https://www.particleincell.com/2012/bezier-splines/ for derivation.
	function controlPoints(x) {
	  var i,
	      n = x.length - 1,
	      m,
	      a = new Array(n),
	      b = new Array(n),
	      r = new Array(n);
	  a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
	  for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
	  a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
	  for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
	  a[n - 1] = r[n - 1] / b[n - 1];
	  for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
	  b[n - 1] = (x[n] + a[n - 1]) / 2;
	  for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
	  return [a, b];
	}

	var natural = function(context) {
	  return new Natural(context);
	};

	function Step(context, t) {
	  this._context = context;
	  this._t = t;
	}

	Step.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x = this._y = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; // proceed
	      default: {
	        if (this._t <= 0) {
	          this._context.lineTo(this._x, y);
	          this._context.lineTo(x, y);
	        } else {
	          var x1 = this._x * (1 - this._t) + x * this._t;
	          this._context.lineTo(x1, this._y);
	          this._context.lineTo(x1, y);
	        }
	        break;
	      }
	    }
	    this._x = x, this._y = y;
	  }
	};

	var step = function(context) {
	  return new Step(context, 0.5);
	};

	function stepBefore(context) {
	  return new Step(context, 0);
	}

	function stepAfter(context) {
	  return new Step(context, 1);
	}

	var slice$2 = Array.prototype.slice;

	var none = function(series, order) {
	  if (!((n = series.length) > 1)) return;
	  for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
	    s0 = s1, s1 = series[order[i]];
	    for (var j = 0; j < m; ++j) {
	      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
	    }
	  }
	};

	var none$1 = function(series) {
	  var n = series.length, o = new Array(n);
	  while (--n >= 0) o[n] = n;
	  return o;
	};

	function stackValue(d, key) {
	  return d[key];
	}

	var stack = function() {
	  var keys = constant$2([]),
	      order = none$1,
	      offset = none,
	      value = stackValue;

	  function stack(data) {
	    var kz = keys.apply(this, arguments),
	        i,
	        m = data.length,
	        n = kz.length,
	        sz = new Array(n),
	        oz;

	    for (i = 0; i < n; ++i) {
	      for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
	        si[j] = sij = [0, +value(data[j], ki, j, data)];
	        sij.data = data[j];
	      }
	      si.key = ki;
	    }

	    for (i = 0, oz = order(sz); i < n; ++i) {
	      sz[oz[i]].index = i;
	    }

	    offset(sz, oz);
	    return sz;
	  }

	  stack.keys = function(_) {
	    return arguments.length ? (keys = typeof _ === "function" ? _ : constant$2(slice$2.call(_)), stack) : keys;
	  };

	  stack.value = function(_) {
	    return arguments.length ? (value = typeof _ === "function" ? _ : constant$2(+_), stack) : value;
	  };

	  stack.order = function(_) {
	    return arguments.length ? (order = _ == null ? none$1 : typeof _ === "function" ? _ : constant$2(slice$2.call(_)), stack) : order;
	  };

	  stack.offset = function(_) {
	    return arguments.length ? (offset = _ == null ? none : _, stack) : offset;
	  };

	  return stack;
	};

	var expand = function(series, order) {
	  if (!((n = series.length) > 0)) return;
	  for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
	    for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
	    if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
	  }
	  none(series, order);
	};

	var silhouette = function(series, order) {
	  if (!((n = series.length) > 0)) return;
	  for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
	    for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
	    s0[j][1] += s0[j][0] = -y / 2;
	  }
	  none(series, order);
	};

	var wiggle = function(series, order) {
	  if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
	  for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
	    for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
	      var si = series[order[i]],
	          sij0 = si[j][1] || 0,
	          sij1 = si[j - 1][1] || 0,
	          s3 = (sij0 - sij1) / 2;
	      for (var k = 0; k < i; ++k) {
	        var sk = series[order[k]],
	            skj0 = sk[j][1] || 0,
	            skj1 = sk[j - 1][1] || 0;
	        s3 += skj0 - skj1;
	      }
	      s1 += sij0, s2 += s3 * sij0;
	    }
	    s0[j - 1][1] += s0[j - 1][0] = y;
	    if (s1) y -= s2 / s1;
	  }
	  s0[j - 1][1] += s0[j - 1][0] = y;
	  none(series, order);
	};

	var ascending$1 = function(series) {
	  var sums = series.map(sum$1);
	  return none$1(series).sort(function(a, b) { return sums[a] - sums[b]; });
	};

	function sum$1(series) {
	  var s = 0, i = -1, n = series.length, v;
	  while (++i < n) if (v = +series[i][1]) s += v;
	  return s;
	}

	var descending$2 = function(series) {
	  return ascending$1(series).reverse();
	};

	var insideOut = function(series) {
	  var n = series.length,
	      i,
	      j,
	      sums = series.map(sum$1),
	      order = none$1(series).sort(function(a, b) { return sums[b] - sums[a]; }),
	      top = 0,
	      bottom = 0,
	      tops = [],
	      bottoms = [];

	  for (i = 0; i < n; ++i) {
	    j = order[i];
	    if (top < bottom) {
	      top += sums[j];
	      tops.push(j);
	    } else {
	      bottom += sums[j];
	      bottoms.push(j);
	    }
	  }

	  return bottoms.reverse().concat(tops);
	};

	var reverse = function(series) {
	  return none$1(series).reverse();
	};

	var define = function(constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	};

	function extend(parent, definition) {
	  var prototype = Object.create(parent.prototype);
	  for (var key in definition) prototype[key] = definition[key];
	  return prototype;
	}

	function Color() {}

	var darker = 0.7;
	var brighter = 1 / darker;

	var reI = "\\s*([+-]?\\d+)\\s*";
	var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
	var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
	var reHex3 = /^#([0-9a-f]{3})$/;
	var reHex6 = /^#([0-9a-f]{6})$/;
	var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
	var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
	var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
	var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
	var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
	var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

	var named = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};

	define(Color, color, {
	  displayable: function() {
	    return this.rgb().displayable();
	  },
	  toString: function() {
	    return this.rgb() + "";
	  }
	});

	function color(format) {
	  var m;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
	      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
	      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	      : named.hasOwnProperty(format) ? rgbn(named[format])
	      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
	      : null;
	}

	function rgbn(n) {
	  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb(r, g, b, a);
	}

	function rgbConvert(o) {
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Rgb;
	  o = o.rgb();
	  return new Rgb(o.r, o.g, o.b, o.opacity);
	}

	function rgb(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	}

	function Rgb(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define(Rgb, rgb, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb: function() {
	    return this;
	  },
	  displayable: function() {
	    return (0 <= this.r && this.r <= 255)
	        && (0 <= this.g && this.g <= 255)
	        && (0 <= this.b && this.b <= 255)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  toString: function() {
	    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	    return (a === 1 ? "rgb(" : "rgba(")
	        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
	        + (a === 1 ? ")" : ", " + a + ")");
	  }
	}));

	function hsla(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;
	  else if (l <= 0 || l >= 1) h = s = NaN;
	  else if (s <= 0) h = NaN;
	  return new Hsl(h, s, l, a);
	}

	function hslConvert(o) {
	  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Hsl;
	  if (o instanceof Hsl) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;
	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;
	    else if (g === max) h = (b - r) / s + 2;
	    else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }
	  return new Hsl(h, s, l, o.opacity);
	}

	function hsl(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hsl, hsl, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(
	      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
	      hsl2rgb(h, m1, m2),
	      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
	      this.opacity
	    );
	  },
	  displayable: function() {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
	        && (0 <= this.l && this.l <= 1)
	        && (0 <= this.opacity && this.opacity <= 1);
	  }
	}));

	/* From FvD 13.37, CSS Color Module Level 3 */
	function hsl2rgb(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60
	      : h < 180 ? m2
	      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
	      : m1) * 255;
	}

	var deg2rad = Math.PI / 180;
	var rad2deg = 180 / Math.PI;

	var Kn = 18;
	var Xn = 0.950470;
	var Yn = 1;
	var Zn = 1.088830;
	var t0 = 4 / 29;
	var t1 = 6 / 29;
	var t2 = 3 * t1 * t1;
	var t3 = t1 * t1 * t1;

	function labConvert(o) {
	  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
	  if (o instanceof Hcl) {
	    var h = o.h * deg2rad;
	    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
	  }
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var b = rgb2xyz(o.r),
	      a = rgb2xyz(o.g),
	      l = rgb2xyz(o.b),
	      x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
	      y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
	      z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
	  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
	}

	function lab(l, a, b, opacity) {
	  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
	}

	function Lab(l, a, b, opacity) {
	  this.l = +l;
	  this.a = +a;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define(Lab, lab, extend(Color, {
	  brighter: function(k) {
	    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  darker: function(k) {
	    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  rgb: function() {
	    var y = (this.l + 16) / 116,
	        x = isNaN(this.a) ? y : y + this.a / 500,
	        z = isNaN(this.b) ? y : y - this.b / 200;
	    y = Yn * lab2xyz(y);
	    x = Xn * lab2xyz(x);
	    z = Zn * lab2xyz(z);
	    return new Rgb(
	      xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
	      xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
	      xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
	      this.opacity
	    );
	  }
	}));

	function xyz2lab(t) {
	  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
	}

	function lab2xyz(t) {
	  return t > t1 ? t * t * t : t2 * (t - t0);
	}

	function xyz2rgb(x) {
	  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
	}

	function rgb2xyz(x) {
	  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
	}

	function hclConvert(o) {
	  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
	  if (!(o instanceof Lab)) o = labConvert(o);
	  var h = Math.atan2(o.b, o.a) * rad2deg;
	  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
	}

	function hcl(h, c, l, opacity) {
	  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
	}

	function Hcl(h, c, l, opacity) {
	  this.h = +h;
	  this.c = +c;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hcl, hcl, extend(Color, {
	  brighter: function(k) {
	    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
	  },
	  darker: function(k) {
	    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
	  },
	  rgb: function() {
	    return labConvert(this).rgb();
	  }
	}));

	var A = -0.14861;
	var B = +1.78277;
	var C = -0.29227;
	var D = -0.90649;
	var E = +1.97294;
	var ED = E * D;
	var EB = E * B;
	var BC_DA = B * C - D * A;

	function cubehelixConvert(o) {
	  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
	      bl = b - l,
	      k = (E * (g - l) - C * bl) / D,
	      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
	      h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
	  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
	}

	function cubehelix(h, s, l, opacity) {
	  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
	}

	function Cubehelix(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Cubehelix, cubehelix, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
	        l = +this.l,
	        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	        cosh = Math.cos(h),
	        sinh = Math.sin(h);
	    return new Rgb(
	      255 * (l + a * (A * cosh + B * sinh)),
	      255 * (l + a * (C * cosh + D * sinh)),
	      255 * (l + a * (E * cosh)),
	      this.opacity
	    );
	  }
	}));

	function basis$1(t1, v0, v1, v2, v3) {
	  var t2 = t1 * t1, t3 = t2 * t1;
	  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
	      + (4 - 6 * t2 + 3 * t3) * v1
	      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
	      + t3 * v3) / 6;
	}

	var basis$2 = function(values) {
	  var n = values.length - 1;
	  return function(t) {
	    var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
	        v1 = values[i],
	        v2 = values[i + 1],
	        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
	        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
	    return basis$1((t - i / n) * n, v0, v1, v2, v3);
	  };
	};

	var basisClosed$1 = function(values) {
	  var n = values.length;
	  return function(t) {
	    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
	        v0 = values[(i + n - 1) % n],
	        v1 = values[i % n],
	        v2 = values[(i + 1) % n],
	        v3 = values[(i + 2) % n];
	    return basis$1((t - i / n) * n, v0, v1, v2, v3);
	  };
	};

	var constant$3 = function(x) {
	  return function() {
	    return x;
	  };
	};

	function linear$1(a, d) {
	  return function(t) {
	    return a + t * d;
	  };
	}

	function exponential$1(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function hue(a, b) {
	  var d = b - a;
	  return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
	}

	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function(a, b) {
	    return b - a ? exponential$1(a, b, y) : constant$3(isNaN(a) ? b : a);
	  };
	}

	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear$1(a, d) : constant$3(isNaN(a) ? b : a);
	}

	var interpolateRgb = (function rgbGamma(y) {
	  var color$$1 = gamma(y);

	  function rgb$$1(start, end) {
	    var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
	        g = color$$1(start.g, end.g),
	        b = color$$1(start.b, end.b),
	        opacity = color$$1(start.opacity, end.opacity);
	    return function(t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb$$1.gamma = rgbGamma;

	  return rgb$$1;
	})(1);

	function rgbSpline(spline) {
	  return function(colors) {
	    var n = colors.length,
	        r = new Array(n),
	        g = new Array(n),
	        b = new Array(n),
	        i, color$$1;
	    for (i = 0; i < n; ++i) {
	      color$$1 = rgb(colors[i]);
	      r[i] = color$$1.r || 0;
	      g[i] = color$$1.g || 0;
	      b[i] = color$$1.b || 0;
	    }
	    r = spline(r);
	    g = spline(g);
	    b = spline(b);
	    color$$1.opacity = 1;
	    return function(t) {
	      color$$1.r = r(t);
	      color$$1.g = g(t);
	      color$$1.b = b(t);
	      return color$$1 + "";
	    };
	  };
	}

	var rgbBasis = rgbSpline(basis$2);
	var rgbBasisClosed = rgbSpline(basisClosed$1);

	var array$1 = function(a, b) {
	  var nb = b ? b.length : 0,
	      na = a ? Math.min(nb, a.length) : 0,
	      x = new Array(nb),
	      c = new Array(nb),
	      i;

	  for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
	  for (; i < nb; ++i) c[i] = b[i];

	  return function(t) {
	    for (i = 0; i < na; ++i) c[i] = x[i](t);
	    return c;
	  };
	};

	var date = function(a, b) {
	  var d = new Date;
	  return a = +a, b -= a, function(t) {
	    return d.setTime(a + b * t), d;
	  };
	};

	var interpolateNumber = function(a, b) {
	  return a = +a, b -= a, function(t) {
	    return a + b * t;
	  };
	};

	var object = function(a, b) {
	  var i = {},
	      c = {},
	      k;

	  if (a === null || typeof a !== "object") a = {};
	  if (b === null || typeof b !== "object") b = {};

	  for (k in b) {
	    if (k in a) {
	      i[k] = interpolate(a[k], b[k]);
	    } else {
	      c[k] = b[k];
	    }
	  }

	  return function(t) {
	    for (k in i) c[k] = i[k](t);
	    return c;
	  };
	};

	var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
	var reB = new RegExp(reA.source, "g");

	function zero(b) {
	  return function() {
	    return b;
	  };
	}

	function one(b) {
	  return function(t) {
	    return b(t) + "";
	  };
	}

	var interpolateString = function(a, b) {
	  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
	      am, // current match in a
	      bm, // current match in b
	      bs, // string preceding current number in b, if any
	      i = -1, // index in s
	      s = [], // string constants and placeholders
	      q = []; // number interpolators

	  // Coerce inputs to strings.
	  a = a + "", b = b + "";

	  // Interpolate pairs of numbers in a & b.
	  while ((am = reA.exec(a))
	      && (bm = reB.exec(b))) {
	    if ((bs = bm.index) > bi) { // a string precedes the next number in b
	      bs = b.slice(bi, bs);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }
	    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
	      if (s[i]) s[i] += bm; // coalesce with previous string
	      else s[++i] = bm;
	    } else { // interpolate non-matching numbers
	      s[++i] = null;
	      q.push({i: i, x: interpolateNumber(am, bm)});
	    }
	    bi = reB.lastIndex;
	  }

	  // Add remains of b.
	  if (bi < b.length) {
	    bs = b.slice(bi);
	    if (s[i]) s[i] += bs; // coalesce with previous string
	    else s[++i] = bs;
	  }

	  // Special optimization for only a single match.
	  // Otherwise, interpolate each of the numbers and rejoin the string.
	  return s.length < 2 ? (q[0]
	      ? one(q[0].x)
	      : zero(b))
	      : (b = q.length, function(t) {
	          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	          return s.join("");
	        });
	};

	var interpolate = function(a, b) {
	  var t = typeof b, c;
	  return b == null || t === "boolean" ? constant$3(b)
	      : (t === "number" ? interpolateNumber
	      : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
	      : b instanceof color ? interpolateRgb
	      : b instanceof Date ? date
	      : Array.isArray(b) ? array$1
	      : isNaN(b) ? object
	      : interpolateNumber)(a, b);
	};

	var interpolateRound = function(a, b) {
	  return a = +a, b -= a, function(t) {
	    return Math.round(a + b * t);
	  };
	};

	var degrees = 180 / Math.PI;

	var identity$2 = {
	  translateX: 0,
	  translateY: 0,
	  rotate: 0,
	  skewX: 0,
	  scaleX: 1,
	  scaleY: 1
	};

	var decompose = function(a, b, c, d, e, f) {
	  var scaleX, scaleY, skewX;
	  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	  return {
	    translateX: e,
	    translateY: f,
	    rotate: Math.atan2(b, a) * degrees,
	    skewX: Math.atan(skewX) * degrees,
	    scaleX: scaleX,
	    scaleY: scaleY
	  };
	};

	var cssNode;
	var cssRoot;
	var cssView;
	var svgNode;

	function parseCss(value) {
	  if (value === "none") return identity$2;
	  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
	  cssNode.style.transform = value;
	  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
	  cssRoot.removeChild(cssNode);
	  value = value.slice(7, -1).split(",");
	  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
	}

	function parseSvg(value) {
	  if (value == null) return identity$2;
	  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	  svgNode.setAttribute("transform", value);
	  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$2;
	  value = value.matrix;
	  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
	}

	function interpolateTransform(parse, pxComma, pxParen, degParen) {

	  function pop(s) {
	    return s.length ? s.pop() + " " : "";
	  }

	  function translate(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push("translate(", null, pxComma, null, pxParen);
	      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
	    } else if (xb || yb) {
	      s.push("translate(" + xb + pxComma + yb + pxParen);
	    }
	  }

	  function rotate(a, b, s, q) {
	    if (a !== b) {
	      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
	      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
	    } else if (b) {
	      s.push(pop(s) + "rotate(" + b + degParen);
	    }
	  }

	  function skewX(a, b, s, q) {
	    if (a !== b) {
	      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
	    } else if (b) {
	      s.push(pop(s) + "skewX(" + b + degParen);
	    }
	  }

	  function scale(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
	      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
	    } else if (xb !== 1 || yb !== 1) {
	      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	    }
	  }

	  return function(a, b) {
	    var s = [], // string constants and placeholders
	        q = []; // number interpolators
	    a = parse(a), b = parse(b);
	    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
	    rotate(a.rotate, b.rotate, s, q);
	    skewX(a.skewX, b.skewX, s, q);
	    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
	    a = b = null; // gc
	    return function(t) {
	      var i = -1, n = q.length, o;
	      while (++i < n) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    };
	  };
	}

	var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
	var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

	var rho = Math.SQRT2;
	var rho2 = 2;
	var rho4 = 4;
	var epsilon2 = 1e-12;

	function cosh(x) {
	  return ((x = Math.exp(x)) + 1 / x) / 2;
	}

	function sinh(x) {
	  return ((x = Math.exp(x)) - 1 / x) / 2;
	}

	function tanh(x) {
	  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	}

	// p0 = [ux0, uy0, w0]
	// p1 = [ux1, uy1, w1]
	var interpolateZoom = function(p0, p1) {
	  var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
	      ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
	      dx = ux1 - ux0,
	      dy = uy1 - uy0,
	      d2 = dx * dx + dy * dy,
	      i,
	      S;

	  // Special case for u0 ≅ u1.
	  if (d2 < epsilon2) {
	    S = Math.log(w1 / w0) / rho;
	    i = function(t) {
	      return [
	        ux0 + t * dx,
	        uy0 + t * dy,
	        w0 * Math.exp(rho * t * S)
	      ];
	    };
	  }

	  // General case.
	  else {
	    var d1 = Math.sqrt(d2),
	        b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
	        b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
	        r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
	        r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
	    S = (r1 - r0) / rho;
	    i = function(t) {
	      var s = t * S,
	          coshr0 = cosh(r0),
	          u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
	      return [
	        ux0 + u * dx,
	        uy0 + u * dy,
	        w0 * coshr0 / cosh(rho * s + r0)
	      ];
	    };
	  }

	  i.duration = S * 1000;

	  return i;
	};

	function hsl$1(hue$$1) {
	  return function(start, end) {
	    var h = hue$$1((start = hsl(start)).h, (end = hsl(end)).h),
	        s = nogamma(start.s, end.s),
	        l = nogamma(start.l, end.l),
	        opacity = nogamma(start.opacity, end.opacity);
	    return function(t) {
	      start.h = h(t);
	      start.s = s(t);
	      start.l = l(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }
	}

	var hsl$2 = hsl$1(hue);
	var hslLong = hsl$1(nogamma);

	function lab$1(start, end) {
	  var l = nogamma((start = lab(start)).l, (end = lab(end)).l),
	      a = nogamma(start.a, end.a),
	      b = nogamma(start.b, end.b),
	      opacity = nogamma(start.opacity, end.opacity);
	  return function(t) {
	    start.l = l(t);
	    start.a = a(t);
	    start.b = b(t);
	    start.opacity = opacity(t);
	    return start + "";
	  };
	}

	function hcl$1(hue$$1) {
	  return function(start, end) {
	    var h = hue$$1((start = hcl(start)).h, (end = hcl(end)).h),
	        c = nogamma(start.c, end.c),
	        l = nogamma(start.l, end.l),
	        opacity = nogamma(start.opacity, end.opacity);
	    return function(t) {
	      start.h = h(t);
	      start.c = c(t);
	      start.l = l(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }
	}

	var hcl$2 = hcl$1(hue);
	var hclLong = hcl$1(nogamma);

	function cubehelix$1(hue$$1) {
	  return (function cubehelixGamma(y) {
	    y = +y;

	    function cubehelix$$1(start, end) {
	      var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
	          s = nogamma(start.s, end.s),
	          l = nogamma(start.l, end.l),
	          opacity = nogamma(start.opacity, end.opacity);
	      return function(t) {
	        start.h = h(t);
	        start.s = s(t);
	        start.l = l(Math.pow(t, y));
	        start.opacity = opacity(t);
	        return start + "";
	      };
	    }

	    cubehelix$$1.gamma = cubehelixGamma;

	    return cubehelix$$1;
	  })(1);
	}

	var cubehelix$2 = cubehelix$1(hue);
	var cubehelixLong = cubehelix$1(nogamma);

	var quantize = function(interpolator, n) {
	  var samples = new Array(n);
	  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
	  return samples;
	};

	var noop$1 = {value: function() {}};

	function dispatch() {
	  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	    if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
	    _[t] = [];
	  }
	  return new Dispatch(_);
	}

	function Dispatch(_) {
	  this._ = _;
	}

	function parseTypenames(typenames, types) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	    return {type: t, name: name};
	  });
	}

	Dispatch.prototype = dispatch.prototype = {
	  constructor: Dispatch,
	  on: function(typename, callback) {
	    var _ = this._,
	        T = parseTypenames(typename + "", _),
	        t,
	        i = -1,
	        n = T.length;

	    // If no callback was specified, return the callback of the given type and name.
	    if (arguments.length < 2) {
	      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
	      return;
	    }

	    // If a type was specified, set the callback for the given type and name.
	    // Otherwise, if a null callback was specified, remove callbacks of the given name.
	    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
	    while (++i < n) {
	      if (t = (typename = T[i]).type) _[t] = set$2(_[t], typename.name, callback);
	      else if (callback == null) for (t in _) _[t] = set$2(_[t], typename.name, null);
	    }

	    return this;
	  },
	  copy: function() {
	    var copy = {}, _ = this._;
	    for (var t in _) copy[t] = _[t].slice();
	    return new Dispatch(copy);
	  },
	  call: function(type, that) {
	    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  },
	  apply: function(type, that, args) {
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  }
	};

	function get(type, name) {
	  for (var i = 0, n = type.length, c; i < n; ++i) {
	    if ((c = type[i]).name === name) {
	      return c.value;
	    }
	  }
	}

	function set$2(type, name, callback) {
	  for (var i = 0, n = type.length; i < n; ++i) {
	    if (type[i].name === name) {
	      type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
	      break;
	    }
	  }
	  if (callback != null) type.push({name: name, value: callback});
	  return type;
	}

	function objectConverter(columns) {
	  return new Function("d", "return {" + columns.map(function(name, i) {
	    return JSON.stringify(name) + ": d[" + i + "]";
	  }).join(",") + "}");
	}

	function customConverter(columns, f) {
	  var object = objectConverter(columns);
	  return function(row, i) {
	    return f(object(row), i, columns);
	  };
	}

	// Compute unique columns in order of discovery.
	function inferColumns(rows) {
	  var columnSet = Object.create(null),
	      columns = [];

	  rows.forEach(function(row) {
	    for (var column in row) {
	      if (!(column in columnSet)) {
	        columns.push(columnSet[column] = column);
	      }
	    }
	  });

	  return columns;
	}

	var dsv = function(delimiter) {
	  var reFormat = new RegExp("[\"" + delimiter + "\n]"),
	      delimiterCode = delimiter.charCodeAt(0);

	  function parse(text, f) {
	    var convert, columns, rows = parseRows(text, function(row, i) {
	      if (convert) return convert(row, i - 1);
	      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
	    });
	    rows.columns = columns;
	    return rows;
	  }

	  function parseRows(text, f) {
	    var EOL = {}, // sentinel value for end-of-line
	        EOF = {}, // sentinel value for end-of-file
	        rows = [], // output rows
	        N = text.length,
	        I = 0, // current character index
	        n = 0, // the current line number
	        t, // the current token
	        eol; // is the current token followed by EOL?

	    function token() {
	      if (I >= N) return EOF; // special case: end of file
	      if (eol) return eol = false, EOL; // special case: end of line

	      // special case: quotes
	      var j = I, c;
	      if (text.charCodeAt(j) === 34) {
	        var i = j;
	        while (i++ < N) {
	          if (text.charCodeAt(i) === 34) {
	            if (text.charCodeAt(i + 1) !== 34) break;
	            ++i;
	          }
	        }
	        I = i + 2;
	        c = text.charCodeAt(i + 1);
	        if (c === 13) {
	          eol = true;
	          if (text.charCodeAt(i + 2) === 10) ++I;
	        } else if (c === 10) {
	          eol = true;
	        }
	        return text.slice(j + 1, i).replace(/""/g, "\"");
	      }

	      // common case: find next delimiter or newline
	      while (I < N) {
	        var k = 1;
	        c = text.charCodeAt(I++);
	        if (c === 10) eol = true; // \n
	        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
	        else if (c !== delimiterCode) continue;
	        return text.slice(j, I - k);
	      }

	      // special case: last token before EOF
	      return text.slice(j);
	    }

	    while ((t = token()) !== EOF) {
	      var a = [];
	      while (t !== EOL && t !== EOF) {
	        a.push(t);
	        t = token();
	      }
	      if (f && (a = f(a, n++)) == null) continue;
	      rows.push(a);
	    }

	    return rows;
	  }

	  function format(rows, columns) {
	    if (columns == null) columns = inferColumns(rows);
	    return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
	      return columns.map(function(column) {
	        return formatValue(row[column]);
	      }).join(delimiter);
	    })).join("\n");
	  }

	  function formatRows(rows) {
	    return rows.map(formatRow).join("\n");
	  }

	  function formatRow(row) {
	    return row.map(formatValue).join(delimiter);
	  }

	  function formatValue(text) {
	    return text == null ? ""
	        : reFormat.test(text += "") ? "\"" + text.replace(/\"/g, "\"\"") + "\""
	        : text;
	  }

	  return {
	    parse: parse,
	    parseRows: parseRows,
	    format: format,
	    formatRows: formatRows
	  };
	};

	var csv = dsv(",");

	var csvParse = csv.parse;
	var csvParseRows = csv.parseRows;
	var csvFormat = csv.format;
	var csvFormatRows = csv.formatRows;

	var tsv = dsv("\t");

	var tsvParse = tsv.parse;
	var tsvParseRows = tsv.parseRows;
	var tsvFormat = tsv.format;
	var tsvFormatRows = tsv.formatRows;

	var request = function(url, callback) {
	  var request,
	      event = dispatch("beforesend", "progress", "load", "error"),
	      mimeType,
	      headers = map$1(),
	      xhr = new XMLHttpRequest,
	      user = null,
	      password = null,
	      response,
	      responseType,
	      timeout = 0;

	  // If IE does not support CORS, use XDomainRequest.
	  if (typeof XDomainRequest !== "undefined"
	      && !("withCredentials" in xhr)
	      && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest;

	  "onload" in xhr
	      ? xhr.onload = xhr.onerror = xhr.ontimeout = respond
	      : xhr.onreadystatechange = function(o) { xhr.readyState > 3 && respond(o); };

	  function respond(o) {
	    var status = xhr.status, result;
	    if (!status && hasResponse(xhr)
	        || status >= 200 && status < 300
	        || status === 304) {
	      if (response) {
	        try {
	          result = response.call(request, xhr);
	        } catch (e) {
	          event.call("error", request, e);
	          return;
	        }
	      } else {
	        result = xhr;
	      }
	      event.call("load", request, result);
	    } else {
	      event.call("error", request, o);
	    }
	  }

	  xhr.onprogress = function(e) {
	    event.call("progress", request, e);
	  };

	  request = {
	    header: function(name, value) {
	      name = (name + "").toLowerCase();
	      if (arguments.length < 2) return headers.get(name);
	      if (value == null) headers.remove(name);
	      else headers.set(name, value + "");
	      return request;
	    },

	    // If mimeType is non-null and no Accept header is set, a default is used.
	    mimeType: function(value) {
	      if (!arguments.length) return mimeType;
	      mimeType = value == null ? null : value + "";
	      return request;
	    },

	    // Specifies what type the response value should take;
	    // for instance, arraybuffer, blob, document, or text.
	    responseType: function(value) {
	      if (!arguments.length) return responseType;
	      responseType = value;
	      return request;
	    },

	    timeout: function(value) {
	      if (!arguments.length) return timeout;
	      timeout = +value;
	      return request;
	    },

	    user: function(value) {
	      return arguments.length < 1 ? user : (user = value == null ? null : value + "", request);
	    },

	    password: function(value) {
	      return arguments.length < 1 ? password : (password = value == null ? null : value + "", request);
	    },

	    // Specify how to convert the response content to a specific type;
	    // changes the callback value on "load" events.
	    response: function(value) {
	      response = value;
	      return request;
	    },

	    // Alias for send("GET", …).
	    get: function(data, callback) {
	      return request.send("GET", data, callback);
	    },

	    // Alias for send("POST", …).
	    post: function(data, callback) {
	      return request.send("POST", data, callback);
	    },

	    // If callback is non-null, it will be used for error and load events.
	    send: function(method, data, callback) {
	      xhr.open(method, url, true, user, password);
	      if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
	      if (xhr.setRequestHeader) headers.each(function(value, name) { xhr.setRequestHeader(name, value); });
	      if (mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(mimeType);
	      if (responseType != null) xhr.responseType = responseType;
	      if (timeout > 0) xhr.timeout = timeout;
	      if (callback == null && typeof data === "function") callback = data, data = null;
	      if (callback != null && callback.length === 1) callback = fixCallback(callback);
	      if (callback != null) request.on("error", callback).on("load", function(xhr) { callback(null, xhr); });
	      event.call("beforesend", request, xhr);
	      xhr.send(data == null ? null : data);
	      return request;
	    },

	    abort: function() {
	      xhr.abort();
	      return request;
	    },

	    on: function() {
	      var value = event.on.apply(event, arguments);
	      return value === event ? request : value;
	    }
	  };

	  if (callback != null) {
	    if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
	    return request.get(callback);
	  }

	  return request;
	};

	function fixCallback(callback) {
	  return function(error, xhr) {
	    callback(error == null ? xhr : null);
	  };
	}

	function hasResponse(xhr) {
	  var type = xhr.responseType;
	  return type && type !== "text"
	      ? xhr.response // null on error
	      : xhr.responseText; // "" on error
	}

	var type = function(defaultMimeType, response) {
	  return function(url, callback) {
	    var r = request(url).mimeType(defaultMimeType).response(response);
	    if (callback != null) {
	      if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
	      return r.get(callback);
	    }
	    return r;
	  };
	};

	var html = type("text/html", function(xhr) {
	  return document.createRange().createContextualFragment(xhr.responseText);
	});

	var json = type("application/json", function(xhr) {
	  return JSON.parse(xhr.responseText);
	});

	var text = type("text/plain", function(xhr) {
	  return xhr.responseText;
	});

	var xml = type("application/xml", function(xhr) {
	  var xml = xhr.responseXML;
	  if (!xml) throw new Error("parse error");
	  return xml;
	});

	var dsv$1 = function(defaultMimeType, parse) {
	  return function(url, row, callback) {
	    if (arguments.length < 3) callback = row, row = null;
	    var r = request(url).mimeType(defaultMimeType);
	    r.row = function(_) { return arguments.length ? r.response(responseOf(parse, row = _)) : row; };
	    r.row(row);
	    return callback ? r.get(callback) : r;
	  };
	};

	function responseOf(parse, row) {
	  return function(request$$1) {
	    return parse(request$$1.responseText, row);
	  };
	}

	var csv$1 = dsv$1("text/csv", csvParse);

	var tsv$1 = dsv$1("text/tab-separated-values", tsvParse);

	var frame = 0;
	var timeout = 0;
	var interval = 0;
	var pokeDelay = 1000;
	var taskHead;
	var taskTail;
	var clockLast = 0;
	var clockNow = 0;
	var clockSkew = 0;
	var clock = typeof performance === "object" && performance.now ? performance : Date;
	var setFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : function(f) { setTimeout(f, 17); };

	function now() {
	  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
	}

	function clearNow() {
	  clockNow = 0;
	}

	function Timer() {
	  this._call =
	  this._time =
	  this._next = null;
	}

	Timer.prototype = timer.prototype = {
	  constructor: Timer,
	  restart: function(callback, delay, time) {
	    if (typeof callback !== "function") throw new TypeError("callback is not a function");
	    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
	    if (!this._next && taskTail !== this) {
	      if (taskTail) taskTail._next = this;
	      else taskHead = this;
	      taskTail = this;
	    }
	    this._call = callback;
	    this._time = time;
	    sleep();
	  },
	  stop: function() {
	    if (this._call) {
	      this._call = null;
	      this._time = Infinity;
	      sleep();
	    }
	  }
	};

	function timer(callback, delay, time) {
	  var t = new Timer;
	  t.restart(callback, delay, time);
	  return t;
	}

	function timerFlush() {
	  now(); // Get the current time, if not already set.
	  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
	  var t = taskHead, e;
	  while (t) {
	    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
	    t = t._next;
	  }
	  --frame;
	}

	function wake() {
	  clockNow = (clockLast = clock.now()) + clockSkew;
	  frame = timeout = 0;
	  try {
	    timerFlush();
	  } finally {
	    frame = 0;
	    nap();
	    clockNow = 0;
	  }
	}

	function poke$1() {
	  var now = clock.now(), delay = now - clockLast;
	  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
	}

	function nap() {
	  var t0, t1 = taskHead, t2, time = Infinity;
	  while (t1) {
	    if (t1._call) {
	      if (time > t1._time) time = t1._time;
	      t0 = t1, t1 = t1._next;
	    } else {
	      t2 = t1._next, t1._next = null;
	      t1 = t0 ? t0._next = t2 : taskHead = t2;
	    }
	  }
	  taskTail = t0;
	  sleep(time);
	}

	function sleep(time) {
	  if (frame) return; // Soonest alarm already set, or will be.
	  if (timeout) timeout = clearTimeout(timeout);
	  var delay = time - clockNow;
	  if (delay > 24) {
	    if (time < Infinity) timeout = setTimeout(wake, delay);
	    if (interval) interval = clearInterval(interval);
	  } else {
	    if (!interval) interval = setInterval(poke$1, pokeDelay);
	    frame = 1, setFrame(wake);
	  }
	}

	var timeout$1 = function(callback, delay, time) {
	  var t = new Timer;
	  delay = delay == null ? 0 : +delay;
	  t.restart(function(elapsed) {
	    t.stop();
	    callback(elapsed + delay);
	  }, delay, time);
	  return t;
	};

	var interval$1 = function(callback, delay, time) {
	  var t = new Timer, total = delay;
	  if (delay == null) return t.restart(callback, delay, time), t;
	  delay = +delay, time = time == null ? now() : +time;
	  t.restart(function tick(elapsed) {
	    elapsed += total;
	    t.restart(tick, total += delay, time);
	    callback(elapsed);
	  }, delay, time);
	  return t;
	};

	var t0$1 = new Date;
	var t1$1 = new Date;

	function newInterval(floori, offseti, count, field) {

	  function interval(date) {
	    return floori(date = new Date(+date)), date;
	  }

	  interval.floor = interval;

	  interval.ceil = function(date) {
	    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
	  };

	  interval.round = function(date) {
	    var d0 = interval(date),
	        d1 = interval.ceil(date);
	    return date - d0 < d1 - date ? d0 : d1;
	  };

	  interval.offset = function(date, step) {
	    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	  };

	  interval.range = function(start, stop, step) {
	    var range = [];
	    start = interval.ceil(start);
	    step = step == null ? 1 : Math.floor(step);
	    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	    do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
	    return range;
	  };

	  interval.filter = function(test) {
	    return newInterval(function(date) {
	      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
	    }, function(date, step) {
	      if (date >= date) while (--step >= 0) while (offseti(date, 1), !test(date)) {} // eslint-disable-line no-empty
	    });
	  };

	  if (count) {
	    interval.count = function(start, end) {
	      t0$1.setTime(+start), t1$1.setTime(+end);
	      floori(t0$1), floori(t1$1);
	      return Math.floor(count(t0$1, t1$1));
	    };

	    interval.every = function(step) {
	      step = Math.floor(step);
	      return !isFinite(step) || !(step > 0) ? null
	          : !(step > 1) ? interval
	          : interval.filter(field
	              ? function(d) { return field(d) % step === 0; }
	              : function(d) { return interval.count(0, d) % step === 0; });
	    };
	  }

	  return interval;
	}

	var millisecond = newInterval(function() {
	  // noop
	}, function(date, step) {
	  date.setTime(+date + step);
	}, function(start, end) {
	  return end - start;
	});

	// An optimized implementation for this simple case.
	millisecond.every = function(k) {
	  k = Math.floor(k);
	  if (!isFinite(k) || !(k > 0)) return null;
	  if (!(k > 1)) return millisecond;
	  return newInterval(function(date) {
	    date.setTime(Math.floor(date / k) * k);
	  }, function(date, step) {
	    date.setTime(+date + step * k);
	  }, function(start, end) {
	    return (end - start) / k;
	  });
	};

	var milliseconds = millisecond.range;

	var durationSecond = 1e3;
	var durationMinute = 6e4;
	var durationHour = 36e5;
	var durationDay = 864e5;
	var durationWeek = 6048e5;

	var second = newInterval(function(date) {
	  date.setTime(Math.floor(date / durationSecond) * durationSecond);
	}, function(date, step) {
	  date.setTime(+date + step * durationSecond);
	}, function(start, end) {
	  return (end - start) / durationSecond;
	}, function(date) {
	  return date.getUTCSeconds();
	});

	var seconds = second.range;

	var minute = newInterval(function(date) {
	  date.setTime(Math.floor(date / durationMinute) * durationMinute);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getMinutes();
	});

	var minutes = minute.range;

	var hour = newInterval(function(date) {
	  var offset = date.getTimezoneOffset() * durationMinute % durationHour;
	  if (offset < 0) offset += durationHour;
	  date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getHours();
	});

	var hours = hour.range;

	var day = newInterval(function(date) {
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setDate(date.getDate() + step);
	}, function(start, end) {
	  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
	}, function(date) {
	  return date.getDate() - 1;
	});

	var days = day.range;

	function weekday(i) {
	  return newInterval(function(date) {
	    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step * 7);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
	  });
	}

	var sunday = weekday(0);
	var monday = weekday(1);
	var tuesday = weekday(2);
	var wednesday = weekday(3);
	var thursday = weekday(4);
	var friday = weekday(5);
	var saturday = weekday(6);

	var sundays = sunday.range;
	var mondays = monday.range;
	var tuesdays = tuesday.range;
	var wednesdays = wednesday.range;
	var thursdays = thursday.range;
	var fridays = friday.range;
	var saturdays = saturday.range;

	var month = newInterval(function(date) {
	  date.setDate(1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setMonth(date.getMonth() + step);
	}, function(start, end) {
	  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	}, function(date) {
	  return date.getMonth();
	});

	var months = month.range;

	var year = newInterval(function(date) {
	  date.setMonth(0, 1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setFullYear(date.getFullYear() + step);
	}, function(start, end) {
	  return end.getFullYear() - start.getFullYear();
	}, function(date) {
	  return date.getFullYear();
	});

	// An optimized implementation for this simple case.
	year.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
	    date.setMonth(0, 1);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step * k);
	  });
	};

	var years = year.range;

	var utcMinute = newInterval(function(date) {
	  date.setUTCSeconds(0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getUTCMinutes();
	});

	var utcMinutes = utcMinute.range;

	var utcHour = newInterval(function(date) {
	  date.setUTCMinutes(0, 0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getUTCHours();
	});

	var utcHours = utcHour.range;

	var utcDay = newInterval(function(date) {
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCDate(date.getUTCDate() + step);
	}, function(start, end) {
	  return (end - start) / durationDay;
	}, function(date) {
	  return date.getUTCDate() - 1;
	});

	var utcDays = utcDay.range;

	function utcWeekday(i) {
	  return newInterval(function(date) {
	    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step * 7);
	  }, function(start, end) {
	    return (end - start) / durationWeek;
	  });
	}

	var utcSunday = utcWeekday(0);
	var utcMonday = utcWeekday(1);
	var utcTuesday = utcWeekday(2);
	var utcWednesday = utcWeekday(3);
	var utcThursday = utcWeekday(4);
	var utcFriday = utcWeekday(5);
	var utcSaturday = utcWeekday(6);

	var utcSundays = utcSunday.range;
	var utcMondays = utcMonday.range;
	var utcTuesdays = utcTuesday.range;
	var utcWednesdays = utcWednesday.range;
	var utcThursdays = utcThursday.range;
	var utcFridays = utcFriday.range;
	var utcSaturdays = utcSaturday.range;

	var utcMonth = newInterval(function(date) {
	  date.setUTCDate(1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCMonth(date.getUTCMonth() + step);
	}, function(start, end) {
	  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	}, function(date) {
	  return date.getUTCMonth();
	});

	var utcMonths = utcMonth.range;

	var utcYear = newInterval(function(date) {
	  date.setUTCMonth(0, 1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCFullYear(date.getUTCFullYear() + step);
	}, function(start, end) {
	  return end.getUTCFullYear() - start.getUTCFullYear();
	}, function(date) {
	  return date.getUTCFullYear();
	});

	// An optimized implementation for this simple case.
	utcYear.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
	    date.setUTCMonth(0, 1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step * k);
	  });
	};

	var utcYears = utcYear.range;

	// Computes the decimal coefficient and exponent of the specified number x with
	// significant digits p, where x is positive and p is in [1, 21] or undefined.
	// For example, formatDecimal(1.23) returns ["123", 0].
	var formatDecimal = function(x, p) {
	  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
	  var i, coefficient = x.slice(0, i);

	  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
	  return [
	    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
	    +x.slice(i + 1)
	  ];
	};

	var exponent$1 = function(x) {
	  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
	};

	var formatGroup = function(grouping, thousands) {
	  return function(value, width) {
	    var i = value.length,
	        t = [],
	        j = 0,
	        g = grouping[0],
	        length = 0;

	    while (i > 0 && g > 0) {
	      if (length + g + 1 > width) g = Math.max(1, width - length);
	      t.push(value.substring(i -= g, i + g));
	      if ((length += g + 1) > width) break;
	      g = grouping[j = (j + 1) % grouping.length];
	    }

	    return t.reverse().join(thousands);
	  };
	};

	var formatDefault = function(x, p) {
	  x = x.toPrecision(p);

	  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
	    switch (x[i]) {
	      case ".": i0 = i1 = i; break;
	      case "0": if (i0 === 0) i0 = i; i1 = i; break;
	      case "e": break out;
	      default: if (i0 > 0) i0 = 0; break;
	    }
	  }

	  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
	};

	var prefixExponent;

	var formatPrefixAuto = function(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1],
	      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	      n = coefficient.length;
	  return i === n ? coefficient
	      : i > n ? coefficient + new Array(i - n + 1).join("0")
	      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
	      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	};

	var formatRounded = function(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1];
	  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
	      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
	      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	};

	var formatTypes = {
	  "": formatDefault,
	  "%": function(x, p) { return (x * 100).toFixed(p); },
	  "b": function(x) { return Math.round(x).toString(2); },
	  "c": function(x) { return x + ""; },
	  "d": function(x) { return Math.round(x).toString(10); },
	  "e": function(x, p) { return x.toExponential(p); },
	  "f": function(x, p) { return x.toFixed(p); },
	  "g": function(x, p) { return x.toPrecision(p); },
	  "o": function(x) { return Math.round(x).toString(8); },
	  "p": function(x, p) { return formatRounded(x * 100, p); },
	  "r": formatRounded,
	  "s": formatPrefixAuto,
	  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
	  "x": function(x) { return Math.round(x).toString(16); }
	};

	// [[fill]align][sign][symbol][0][width][,][.precision][type]
	var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

	var formatSpecifier = function(specifier) {
	  return new FormatSpecifier(specifier);
	};

	function FormatSpecifier(specifier) {
	  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

	  var match,
	      fill = match[1] || " ",
	      align = match[2] || ">",
	      sign = match[3] || "-",
	      symbol = match[4] || "",
	      zero = !!match[5],
	      width = match[6] && +match[6],
	      comma = !!match[7],
	      precision = match[8] && +match[8].slice(1),
	      type = match[9] || "";

	  // The "n" type is an alias for ",g".
	  if (type === "n") comma = true, type = "g";

	  // Map invalid types to the default format.
	  else if (!formatTypes[type]) type = "";

	  // If zero fill is specified, padding goes after sign and before digits.
	  if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

	  this.fill = fill;
	  this.align = align;
	  this.sign = sign;
	  this.symbol = symbol;
	  this.zero = zero;
	  this.width = width;
	  this.comma = comma;
	  this.precision = precision;
	  this.type = type;
	}

	FormatSpecifier.prototype.toString = function() {
	  return this.fill
	      + this.align
	      + this.sign
	      + this.symbol
	      + (this.zero ? "0" : "")
	      + (this.width == null ? "" : Math.max(1, this.width | 0))
	      + (this.comma ? "," : "")
	      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
	      + this.type;
	};

	var prefixes = ["y","z","a","f","p","n","\xB5","m","","k","M","G","T","P","E","Z","Y"];

	function identity$3(x) {
	  return x;
	}

	var formatLocale = function(locale) {
	  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$3,
	      currency = locale.currency,
	      decimal = locale.decimal;

	  function newFormat(specifier) {
	    specifier = formatSpecifier(specifier);

	    var fill = specifier.fill,
	        align = specifier.align,
	        sign = specifier.sign,
	        symbol = specifier.symbol,
	        zero = specifier.zero,
	        width = specifier.width,
	        comma = specifier.comma,
	        precision = specifier.precision,
	        type = specifier.type;

	    // Compute the prefix and suffix.
	    // For SI-prefix, the suffix is lazily computed.
	    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

	    // What format function should we use?
	    // Is this an integer type?
	    // Can this type generate exponential notation?
	    var formatType = formatTypes[type],
	        maybeSuffix = !type || /[defgprs%]/.test(type);

	    // Set the default precision if not specified,
	    // or clamp the specified precision to the supported range.
	    // For significant precision, it must be in [1, 21].
	    // For fixed precision, it must be in [0, 20].
	    precision = precision == null ? (type ? 6 : 12)
	        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
	        : Math.max(0, Math.min(20, precision));

	    function format(value) {
	      var valuePrefix = prefix,
	          valueSuffix = suffix,
	          i, n, c;

	      if (type === "c") {
	        valueSuffix = formatType(value) + valueSuffix;
	        value = "";
	      } else {
	        value = +value;

	        // Convert negative to positive, and compute the prefix.
	        // Note that -0 is not less than 0, but 1 / -0 is!
	        var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

	        // Perform the initial formatting.
	        value = formatType(value, precision);

	        // If the original value was negative, it may be rounded to zero during
	        // formatting; treat this as (positive) zero.
	        if (valueNegative) {
	          i = -1, n = value.length;
	          valueNegative = false;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), (48 < c && c < 58)
	                || (type === "x" && 96 < c && c < 103)
	                || (type === "X" && 64 < c && c < 71)) {
	              valueNegative = true;
	              break;
	            }
	          }
	        }

	        // Compute the prefix and suffix.
	        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	        valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

	        // Break the formatted value into the integer “value” part that can be
	        // grouped, and fractional or exponential “suffix” part that is not.
	        if (maybeSuffix) {
	          i = -1, n = value.length;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), 48 > c || c > 57) {
	              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	              value = value.slice(0, i);
	              break;
	            }
	          }
	        }
	      }

	      // If the fill character is not "0", grouping is applied before padding.
	      if (comma && !zero) value = group(value, Infinity);

	      // Compute the padding.
	      var length = valuePrefix.length + value.length + valueSuffix.length,
	          padding = length < width ? new Array(width - length + 1).join(fill) : "";

	      // If the fill character is "0", grouping is applied after padding.
	      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

	      // Reconstruct the final output based on the desired alignment.
	      switch (align) {
	        case "<": return valuePrefix + value + valueSuffix + padding;
	        case "=": return valuePrefix + padding + value + valueSuffix;
	        case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
	      }
	      return padding + valuePrefix + value + valueSuffix;
	    }

	    format.toString = function() {
	      return specifier + "";
	    };

	    return format;
	  }

	  function formatPrefix(specifier, value) {
	    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	        e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
	        k = Math.pow(10, -e),
	        prefix = prefixes[8 + e / 3];
	    return function(value) {
	      return f(k * value) + prefix;
	    };
	  }

	  return {
	    format: newFormat,
	    formatPrefix: formatPrefix
	  };
	};

	var locale$1;



	defaultLocale({
	  decimal: ".",
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	});

	function defaultLocale(definition) {
	  locale$1 = formatLocale(definition);
	  exports.format = locale$1.format;
	  exports.formatPrefix = locale$1.formatPrefix;
	  return locale$1;
	}

	var precisionFixed = function(step) {
	  return Math.max(0, -exponent$1(Math.abs(step)));
	};

	var precisionPrefix = function(step, value) {
	  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3 - exponent$1(Math.abs(step)));
	};

	var precisionRound = function(step, max) {
	  step = Math.abs(step), max = Math.abs(max) - step;
	  return Math.max(0, exponent$1(max) - exponent$1(step)) + 1;
	};

	function localDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
	    date.setFullYear(d.y);
	    return date;
	  }
	  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
	}

	function utcDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
	    date.setUTCFullYear(d.y);
	    return date;
	  }
	  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
	}

	function newYear(y) {
	  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
	}

	function formatLocale$1(locale) {
	  var locale_dateTime = locale.dateTime,
	      locale_date = locale.date,
	      locale_time = locale.time,
	      locale_periods = locale.periods,
	      locale_weekdays = locale.days,
	      locale_shortWeekdays = locale.shortDays,
	      locale_months = locale.months,
	      locale_shortMonths = locale.shortMonths;

	  var periodRe = formatRe(locale_periods),
	      periodLookup = formatLookup(locale_periods),
	      weekdayRe = formatRe(locale_weekdays),
	      weekdayLookup = formatLookup(locale_weekdays),
	      shortWeekdayRe = formatRe(locale_shortWeekdays),
	      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
	      monthRe = formatRe(locale_months),
	      monthLookup = formatLookup(locale_months),
	      shortMonthRe = formatRe(locale_shortMonths),
	      shortMonthLookup = formatLookup(locale_shortMonths);

	  var formats = {
	    "a": formatShortWeekday,
	    "A": formatWeekday,
	    "b": formatShortMonth,
	    "B": formatMonth,
	    "c": null,
	    "d": formatDayOfMonth,
	    "e": formatDayOfMonth,
	    "H": formatHour24,
	    "I": formatHour12,
	    "j": formatDayOfYear,
	    "L": formatMilliseconds,
	    "m": formatMonthNumber,
	    "M": formatMinutes,
	    "p": formatPeriod,
	    "S": formatSeconds,
	    "U": formatWeekNumberSunday,
	    "w": formatWeekdayNumber,
	    "W": formatWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatYear,
	    "Y": formatFullYear,
	    "Z": formatZone,
	    "%": formatLiteralPercent
	  };

	  var utcFormats = {
	    "a": formatUTCShortWeekday,
	    "A": formatUTCWeekday,
	    "b": formatUTCShortMonth,
	    "B": formatUTCMonth,
	    "c": null,
	    "d": formatUTCDayOfMonth,
	    "e": formatUTCDayOfMonth,
	    "H": formatUTCHour24,
	    "I": formatUTCHour12,
	    "j": formatUTCDayOfYear,
	    "L": formatUTCMilliseconds,
	    "m": formatUTCMonthNumber,
	    "M": formatUTCMinutes,
	    "p": formatUTCPeriod,
	    "S": formatUTCSeconds,
	    "U": formatUTCWeekNumberSunday,
	    "w": formatUTCWeekdayNumber,
	    "W": formatUTCWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatUTCYear,
	    "Y": formatUTCFullYear,
	    "Z": formatUTCZone,
	    "%": formatLiteralPercent
	  };

	  var parses = {
	    "a": parseShortWeekday,
	    "A": parseWeekday,
	    "b": parseShortMonth,
	    "B": parseMonth,
	    "c": parseLocaleDateTime,
	    "d": parseDayOfMonth,
	    "e": parseDayOfMonth,
	    "H": parseHour24,
	    "I": parseHour24,
	    "j": parseDayOfYear,
	    "L": parseMilliseconds,
	    "m": parseMonthNumber,
	    "M": parseMinutes,
	    "p": parsePeriod,
	    "S": parseSeconds,
	    "U": parseWeekNumberSunday,
	    "w": parseWeekdayNumber,
	    "W": parseWeekNumberMonday,
	    "x": parseLocaleDate,
	    "X": parseLocaleTime,
	    "y": parseYear,
	    "Y": parseFullYear,
	    "Z": parseZone,
	    "%": parseLiteralPercent
	  };

	  // These recursive directive definitions must be deferred.
	  formats.x = newFormat(locale_date, formats);
	  formats.X = newFormat(locale_time, formats);
	  formats.c = newFormat(locale_dateTime, formats);
	  utcFormats.x = newFormat(locale_date, utcFormats);
	  utcFormats.X = newFormat(locale_time, utcFormats);
	  utcFormats.c = newFormat(locale_dateTime, utcFormats);

	  function newFormat(specifier, formats) {
	    return function(date) {
	      var string = [],
	          i = -1,
	          j = 0,
	          n = specifier.length,
	          c,
	          pad,
	          format;

	      if (!(date instanceof Date)) date = new Date(+date);

	      while (++i < n) {
	        if (specifier.charCodeAt(i) === 37) {
	          string.push(specifier.slice(j, i));
	          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
	          else pad = c === "e" ? " " : "0";
	          if (format = formats[c]) c = format(date, pad);
	          string.push(c);
	          j = i + 1;
	        }
	      }

	      string.push(specifier.slice(j, i));
	      return string.join("");
	    };
	  }

	  function newParse(specifier, newDate) {
	    return function(string) {
	      var d = newYear(1900),
	          i = parseSpecifier(d, specifier, string += "", 0);
	      if (i != string.length) return null;

	      // The am-pm flag is 0 for AM, and 1 for PM.
	      if ("p" in d) d.H = d.H % 12 + d.p * 12;

	      // Convert day-of-week and week-of-year to day-of-year.
	      if ("W" in d || "U" in d) {
	        if (!("w" in d)) d.w = "W" in d ? 1 : 0;
	        var day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
	        d.m = 0;
	        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
	      }

	      // If a time zone is specified, all fields are interpreted as UTC and then
	      // offset according to the specified time zone.
	      if ("Z" in d) {
	        d.H += d.Z / 100 | 0;
	        d.M += d.Z % 100;
	        return utcDate(d);
	      }

	      // Otherwise, all fields are in local time.
	      return newDate(d);
	    };
	  }

	  function parseSpecifier(d, specifier, string, j) {
	    var i = 0,
	        n = specifier.length,
	        m = string.length,
	        c,
	        parse;

	    while (i < n) {
	      if (j >= m) return -1;
	      c = specifier.charCodeAt(i++);
	      if (c === 37) {
	        c = specifier.charAt(i++);
	        parse = parses[c in pads ? specifier.charAt(i++) : c];
	        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
	      } else if (c != string.charCodeAt(j++)) {
	        return -1;
	      }
	    }

	    return j;
	  }

	  function parsePeriod(d, string, i) {
	    var n = periodRe.exec(string.slice(i));
	    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortWeekday(d, string, i) {
	    var n = shortWeekdayRe.exec(string.slice(i));
	    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseWeekday(d, string, i) {
	    var n = weekdayRe.exec(string.slice(i));
	    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortMonth(d, string, i) {
	    var n = shortMonthRe.exec(string.slice(i));
	    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseMonth(d, string, i) {
	    var n = monthRe.exec(string.slice(i));
	    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseLocaleDateTime(d, string, i) {
	    return parseSpecifier(d, locale_dateTime, string, i);
	  }

	  function parseLocaleDate(d, string, i) {
	    return parseSpecifier(d, locale_date, string, i);
	  }

	  function parseLocaleTime(d, string, i) {
	    return parseSpecifier(d, locale_time, string, i);
	  }

	  function formatShortWeekday(d) {
	    return locale_shortWeekdays[d.getDay()];
	  }

	  function formatWeekday(d) {
	    return locale_weekdays[d.getDay()];
	  }

	  function formatShortMonth(d) {
	    return locale_shortMonths[d.getMonth()];
	  }

	  function formatMonth(d) {
	    return locale_months[d.getMonth()];
	  }

	  function formatPeriod(d) {
	    return locale_periods[+(d.getHours() >= 12)];
	  }

	  function formatUTCShortWeekday(d) {
	    return locale_shortWeekdays[d.getUTCDay()];
	  }

	  function formatUTCWeekday(d) {
	    return locale_weekdays[d.getUTCDay()];
	  }

	  function formatUTCShortMonth(d) {
	    return locale_shortMonths[d.getUTCMonth()];
	  }

	  function formatUTCMonth(d) {
	    return locale_months[d.getUTCMonth()];
	  }

	  function formatUTCPeriod(d) {
	    return locale_periods[+(d.getUTCHours() >= 12)];
	  }

	  return {
	    format: function(specifier) {
	      var f = newFormat(specifier += "", formats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    parse: function(specifier) {
	      var p = newParse(specifier += "", localDate);
	      p.toString = function() { return specifier; };
	      return p;
	    },
	    utcFormat: function(specifier) {
	      var f = newFormat(specifier += "", utcFormats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    utcParse: function(specifier) {
	      var p = newParse(specifier, utcDate);
	      p.toString = function() { return specifier; };
	      return p;
	    }
	  };
	}

	var pads = {"-": "", "_": " ", "0": "0"};
	var numberRe = /^\s*\d+/;
	var percentRe = /^%/;
	var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

	function pad(value, fill, width) {
	  var sign = value < 0 ? "-" : "",
	      string = (sign ? -value : value) + "",
	      length = string.length;
	  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	}

	function requote(s) {
	  return s.replace(requoteRe, "\\$&");
	}

	function formatRe(names) {
	  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
	}

	function formatLookup(names) {
	  var map = {}, i = -1, n = names.length;
	  while (++i < n) map[names[i].toLowerCase()] = i;
	  return map;
	}

	function parseWeekdayNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.w = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.U = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.W = +n[0], i + n[0].length) : -1;
	}

	function parseFullYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 4));
	  return n ? (d.y = +n[0], i + n[0].length) : -1;
	}

	function parseYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
	}

	function parseZone(d, string, i) {
	  var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
	  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
	}

	function parseMonthNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
	}

	function parseDayOfMonth(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.d = +n[0], i + n[0].length) : -1;
	}

	function parseDayOfYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
	}

	function parseHour24(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.H = +n[0], i + n[0].length) : -1;
	}

	function parseMinutes(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.M = +n[0], i + n[0].length) : -1;
	}

	function parseSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.S = +n[0], i + n[0].length) : -1;
	}

	function parseMilliseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.L = +n[0], i + n[0].length) : -1;
	}

	function parseLiteralPercent(d, string, i) {
	  var n = percentRe.exec(string.slice(i, i + 1));
	  return n ? i + n[0].length : -1;
	}

	function formatDayOfMonth(d, p) {
	  return pad(d.getDate(), p, 2);
	}

	function formatHour24(d, p) {
	  return pad(d.getHours(), p, 2);
	}

	function formatHour12(d, p) {
	  return pad(d.getHours() % 12 || 12, p, 2);
	}

	function formatDayOfYear(d, p) {
	  return pad(1 + day.count(year(d), d), p, 3);
	}

	function formatMilliseconds(d, p) {
	  return pad(d.getMilliseconds(), p, 3);
	}

	function formatMonthNumber(d, p) {
	  return pad(d.getMonth() + 1, p, 2);
	}

	function formatMinutes(d, p) {
	  return pad(d.getMinutes(), p, 2);
	}

	function formatSeconds(d, p) {
	  return pad(d.getSeconds(), p, 2);
	}

	function formatWeekNumberSunday(d, p) {
	  return pad(sunday.count(year(d), d), p, 2);
	}

	function formatWeekdayNumber(d) {
	  return d.getDay();
	}

	function formatWeekNumberMonday(d, p) {
	  return pad(monday.count(year(d), d), p, 2);
	}

	function formatYear(d, p) {
	  return pad(d.getFullYear() % 100, p, 2);
	}

	function formatFullYear(d, p) {
	  return pad(d.getFullYear() % 10000, p, 4);
	}

	function formatZone(d) {
	  var z = d.getTimezoneOffset();
	  return (z > 0 ? "-" : (z *= -1, "+"))
	      + pad(z / 60 | 0, "0", 2)
	      + pad(z % 60, "0", 2);
	}

	function formatUTCDayOfMonth(d, p) {
	  return pad(d.getUTCDate(), p, 2);
	}

	function formatUTCHour24(d, p) {
	  return pad(d.getUTCHours(), p, 2);
	}

	function formatUTCHour12(d, p) {
	  return pad(d.getUTCHours() % 12 || 12, p, 2);
	}

	function formatUTCDayOfYear(d, p) {
	  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
	}

	function formatUTCMilliseconds(d, p) {
	  return pad(d.getUTCMilliseconds(), p, 3);
	}

	function formatUTCMonthNumber(d, p) {
	  return pad(d.getUTCMonth() + 1, p, 2);
	}

	function formatUTCMinutes(d, p) {
	  return pad(d.getUTCMinutes(), p, 2);
	}

	function formatUTCSeconds(d, p) {
	  return pad(d.getUTCSeconds(), p, 2);
	}

	function formatUTCWeekNumberSunday(d, p) {
	  return pad(utcSunday.count(utcYear(d), d), p, 2);
	}

	function formatUTCWeekdayNumber(d) {
	  return d.getUTCDay();
	}

	function formatUTCWeekNumberMonday(d, p) {
	  return pad(utcMonday.count(utcYear(d), d), p, 2);
	}

	function formatUTCYear(d, p) {
	  return pad(d.getUTCFullYear() % 100, p, 2);
	}

	function formatUTCFullYear(d, p) {
	  return pad(d.getUTCFullYear() % 10000, p, 4);
	}

	function formatUTCZone() {
	  return "+0000";
	}

	function formatLiteralPercent() {
	  return "%";
	}

	var locale$2;





	defaultLocale$1({
	  dateTime: "%x, %X",
	  date: "%-m/%-d/%Y",
	  time: "%-I:%M:%S %p",
	  periods: ["AM", "PM"],
	  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	});

	function defaultLocale$1(definition) {
	  locale$2 = formatLocale$1(definition);
	  exports.timeFormat = locale$2.format;
	  exports.timeParse = locale$2.parse;
	  exports.utcFormat = locale$2.utcFormat;
	  exports.utcParse = locale$2.utcParse;
	  return locale$2;
	}

	var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

	function formatIsoNative(date) {
	  return date.toISOString();
	}

	var formatIso = Date.prototype.toISOString
	    ? formatIsoNative
	    : exports.utcFormat(isoSpecifier);

	function parseIsoNative(string) {
	  var date = new Date(string);
	  return isNaN(date) ? null : date;
	}

	var parseIso = +new Date("2000-01-01T00:00:00.000Z")
	    ? parseIsoNative
	    : exports.utcParse(isoSpecifier);

	var array$2 = Array.prototype;

	var map$3 = array$2.map;
	var slice$3 = array$2.slice;

	var implicit = {name: "implicit"};

	function ordinal(range) {
	  var index = map$1(),
	      domain = [],
	      unknown = implicit;

	  range = range == null ? [] : slice$3.call(range);

	  function scale(d) {
	    var key = d + "", i = index.get(key);
	    if (!i) {
	      if (unknown !== implicit) return unknown;
	      index.set(key, i = domain.push(d));
	    }
	    return range[(i - 1) % range.length];
	  }

	  scale.domain = function(_) {
	    if (!arguments.length) return domain.slice();
	    domain = [], index = map$1();
	    var i = -1, n = _.length, d, key;
	    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
	    return scale;
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range = slice$3.call(_), scale) : range.slice();
	  };

	  scale.unknown = function(_) {
	    return arguments.length ? (unknown = _, scale) : unknown;
	  };

	  scale.copy = function() {
	    return ordinal()
	        .domain(domain)
	        .range(range)
	        .unknown(unknown);
	  };

	  return scale;
	}

	function band() {
	  var scale = ordinal().unknown(undefined),
	      domain = scale.domain,
	      ordinalRange = scale.range,
	      range$$1 = [0, 1],
	      step,
	      bandwidth,
	      round = false,
	      paddingInner = 0,
	      paddingOuter = 0,
	      align = 0.5;

	  delete scale.unknown;

	  function rescale() {
	    var n = domain().length,
	        reverse = range$$1[1] < range$$1[0],
	        start = range$$1[reverse - 0],
	        stop = range$$1[1 - reverse];
	    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
	    if (round) step = Math.floor(step);
	    start += (stop - start - step * (n - paddingInner)) * align;
	    bandwidth = step * (1 - paddingInner);
	    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
	    var values = range(n).map(function(i) { return start + step * i; });
	    return ordinalRange(reverse ? values.reverse() : values);
	  }

	  scale.domain = function(_) {
	    return arguments.length ? (domain(_), rescale()) : domain();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range$$1 = [+_[0], +_[1]], rescale()) : range$$1.slice();
	  };

	  scale.rangeRound = function(_) {
	    return range$$1 = [+_[0], +_[1]], round = true, rescale();
	  };

	  scale.bandwidth = function() {
	    return bandwidth;
	  };

	  scale.step = function() {
	    return step;
	  };

	  scale.round = function(_) {
	    return arguments.length ? (round = !!_, rescale()) : round;
	  };

	  scale.padding = function(_) {
	    return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
	  };

	  scale.paddingInner = function(_) {
	    return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
	  };

	  scale.paddingOuter = function(_) {
	    return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
	  };

	  scale.align = function(_) {
	    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
	  };

	  scale.copy = function() {
	    return band()
	        .domain(domain())
	        .range(range$$1)
	        .round(round)
	        .paddingInner(paddingInner)
	        .paddingOuter(paddingOuter)
	        .align(align);
	  };

	  return rescale();
	}

	function pointish(scale) {
	  var copy = scale.copy;

	  scale.padding = scale.paddingOuter;
	  delete scale.paddingInner;
	  delete scale.paddingOuter;

	  scale.copy = function() {
	    return pointish(copy());
	  };

	  return scale;
	}

	function point$4() {
	  return pointish(band().paddingInner(1));
	}

	var constant$4 = function(x) {
	  return function() {
	    return x;
	  };
	};

	var number$1 = function(x) {
	  return +x;
	};

	var unit = [0, 1];

	function deinterpolateLinear(a, b) {
	  return (b -= (a = +a))
	      ? function(x) { return (x - a) / b; }
	      : constant$4(b);
	}

	function deinterpolateClamp(deinterpolate) {
	  return function(a, b) {
	    var d = deinterpolate(a = +a, b = +b);
	    return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
	  };
	}

	function reinterpolateClamp(reinterpolate) {
	  return function(a, b) {
	    var r = reinterpolate(a = +a, b = +b);
	    return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
	  };
	}

	function bimap(domain, range$$1, deinterpolate, reinterpolate) {
	  var d0 = domain[0], d1 = domain[1], r0 = range$$1[0], r1 = range$$1[1];
	  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
	  else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
	  return function(x) { return r0(d0(x)); };
	}

	function polymap(domain, range$$1, deinterpolate, reinterpolate) {
	  var j = Math.min(domain.length, range$$1.length) - 1,
	      d = new Array(j),
	      r = new Array(j),
	      i = -1;

	  // Reverse descending domains.
	  if (domain[j] < domain[0]) {
	    domain = domain.slice().reverse();
	    range$$1 = range$$1.slice().reverse();
	  }

	  while (++i < j) {
	    d[i] = deinterpolate(domain[i], domain[i + 1]);
	    r[i] = reinterpolate(range$$1[i], range$$1[i + 1]);
	  }

	  return function(x) {
	    var i = bisectRight(domain, x, 1, j) - 1;
	    return r[i](d[i](x));
	  };
	}

	function copy(source, target) {
	  return target
	      .domain(source.domain())
	      .range(source.range())
	      .interpolate(source.interpolate())
	      .clamp(source.clamp());
	}

	// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
	// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
	function continuous(deinterpolate, reinterpolate) {
	  var domain = unit,
	      range$$1 = unit,
	      interpolate$$1 = interpolate,
	      clamp = false,
	      piecewise,
	      output,
	      input;

	  function rescale() {
	    piecewise = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
	    output = input = null;
	    return scale;
	  }

	  function scale(x) {
	    return (output || (output = piecewise(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
	  }

	  scale.invert = function(y) {
	    return (input || (input = piecewise(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
	  };

	  scale.domain = function(_) {
	    return arguments.length ? (domain = map$3.call(_, number$1), rescale()) : domain.slice();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range$$1 = slice$3.call(_), rescale()) : range$$1.slice();
	  };

	  scale.rangeRound = function(_) {
	    return range$$1 = slice$3.call(_), interpolate$$1 = interpolateRound, rescale();
	  };

	  scale.clamp = function(_) {
	    return arguments.length ? (clamp = !!_, rescale()) : clamp;
	  };

	  scale.interpolate = function(_) {
	    return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
	  };

	  return rescale();
	}

	var tickFormat = function(domain, count, specifier) {
	  var start = domain[0],
	      stop = domain[domain.length - 1],
	      step = tickStep(start, stop, count == null ? 10 : count),
	      precision;
	  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
	  switch (specifier.type) {
	    case "s": {
	      var value = Math.max(Math.abs(start), Math.abs(stop));
	      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
	      return exports.formatPrefix(specifier, value);
	    }
	    case "":
	    case "e":
	    case "g":
	    case "p":
	    case "r": {
	      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
	      break;
	    }
	    case "f":
	    case "%": {
	      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
	      break;
	    }
	  }
	  return exports.format(specifier);
	};

	function linearish(scale) {
	  var domain = scale.domain;

	  scale.ticks = function(count) {
	    var d = domain();
	    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
	  };

	  scale.tickFormat = function(count, specifier) {
	    return tickFormat(domain(), count, specifier);
	  };

	  scale.nice = function(count) {
	    var d = domain(),
	        i = d.length - 1,
	        n = count == null ? 10 : count,
	        start = d[0],
	        stop = d[i],
	        step = tickStep(start, stop, n);

	    if (step) {
	      step = tickStep(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
	      d[0] = Math.floor(start / step) * step;
	      d[i] = Math.ceil(stop / step) * step;
	      domain(d);
	    }

	    return scale;
	  };

	  return scale;
	}

	function linear$2() {
	  var scale = continuous(deinterpolateLinear, interpolateNumber);

	  scale.copy = function() {
	    return copy(scale, linear$2());
	  };

	  return linearish(scale);
	}

	function identity$4() {
	  var domain = [0, 1];

	  function scale(x) {
	    return +x;
	  }

	  scale.invert = scale;

	  scale.domain = scale.range = function(_) {
	    return arguments.length ? (domain = map$3.call(_, number$1), scale) : domain.slice();
	  };

	  scale.copy = function() {
	    return identity$4().domain(domain);
	  };

	  return linearish(scale);
	}

	var nice = function(domain, interval) {
	  domain = domain.slice();

	  var i0 = 0,
	      i1 = domain.length - 1,
	      x0 = domain[i0],
	      x1 = domain[i1],
	      t;

	  if (x1 < x0) {
	    t = i0, i0 = i1, i1 = t;
	    t = x0, x0 = x1, x1 = t;
	  }

	  domain[i0] = interval.floor(x0);
	  domain[i1] = interval.ceil(x1);
	  return domain;
	};

	function deinterpolate(a, b) {
	  return (b = Math.log(b / a))
	      ? function(x) { return Math.log(x / a) / b; }
	      : constant$4(b);
	}

	function reinterpolate(a, b) {
	  return a < 0
	      ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
	      : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
	}

	function pow10(x) {
	  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
	}

	function powp(base) {
	  return base === 10 ? pow10
	      : base === Math.E ? Math.exp
	      : function(x) { return Math.pow(base, x); };
	}

	function logp(base) {
	  return base === Math.E ? Math.log
	      : base === 10 && Math.log10
	      || base === 2 && Math.log2
	      || (base = Math.log(base), function(x) { return Math.log(x) / base; });
	}

	function reflect(f) {
	  return function(x) {
	    return -f(-x);
	  };
	}

	function log() {
	  var scale = continuous(deinterpolate, reinterpolate).domain([1, 10]),
	      domain = scale.domain,
	      base = 10,
	      logs = logp(10),
	      pows = powp(10);

	  function rescale() {
	    logs = logp(base), pows = powp(base);
	    if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
	    return scale;
	  }

	  scale.base = function(_) {
	    return arguments.length ? (base = +_, rescale()) : base;
	  };

	  scale.domain = function(_) {
	    return arguments.length ? (domain(_), rescale()) : domain();
	  };

	  scale.ticks = function(count) {
	    var d = domain(),
	        u = d[0],
	        v = d[d.length - 1],
	        r;

	    if (r = v < u) i = u, u = v, v = i;

	    var i = logs(u),
	        j = logs(v),
	        p,
	        k,
	        t,
	        n = count == null ? 10 : +count,
	        z = [];

	    if (!(base % 1) && j - i < n) {
	      i = Math.round(i) - 1, j = Math.round(j) + 1;
	      if (u > 0) for (; i < j; ++i) {
	        for (k = 1, p = pows(i); k < base; ++k) {
	          t = p * k;
	          if (t < u) continue;
	          if (t > v) break;
	          z.push(t);
	        }
	      } else for (; i < j; ++i) {
	        for (k = base - 1, p = pows(i); k >= 1; --k) {
	          t = p * k;
	          if (t < u) continue;
	          if (t > v) break;
	          z.push(t);
	        }
	      }
	    } else {
	      z = ticks(i, j, Math.min(j - i, n)).map(pows);
	    }

	    return r ? z.reverse() : z;
	  };

	  scale.tickFormat = function(count, specifier) {
	    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
	    if (typeof specifier !== "function") specifier = exports.format(specifier);
	    if (count === Infinity) return specifier;
	    if (count == null) count = 10;
	    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
	    return function(d) {
	      var i = d / pows(Math.round(logs(d)));
	      if (i * base < base - 0.5) i *= base;
	      return i <= k ? specifier(d) : "";
	    };
	  };

	  scale.nice = function() {
	    return domain(nice(domain(), {
	      floor: function(x) { return pows(Math.floor(logs(x))); },
	      ceil: function(x) { return pows(Math.ceil(logs(x))); }
	    }));
	  };

	  scale.copy = function() {
	    return copy(scale, log().base(base));
	  };

	  return scale;
	}

	function raise(x, exponent) {
	  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
	}

	function pow() {
	  var exponent = 1,
	      scale = continuous(deinterpolate, reinterpolate),
	      domain = scale.domain;

	  function deinterpolate(a, b) {
	    return (b = raise(b, exponent) - (a = raise(a, exponent)))
	        ? function(x) { return (raise(x, exponent) - a) / b; }
	        : constant$4(b);
	  }

	  function reinterpolate(a, b) {
	    b = raise(b, exponent) - (a = raise(a, exponent));
	    return function(t) { return raise(a + b * t, 1 / exponent); };
	  }

	  scale.exponent = function(_) {
	    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
	  };

	  scale.copy = function() {
	    return copy(scale, pow().exponent(exponent));
	  };

	  return linearish(scale);
	}

	function sqrt() {
	  return pow().exponent(0.5);
	}

	function quantile$$1() {
	  var domain = [],
	      range$$1 = [],
	      thresholds = [];

	  function rescale() {
	    var i = 0, n = Math.max(1, range$$1.length);
	    thresholds = new Array(n - 1);
	    while (++i < n) thresholds[i - 1] = threshold(domain, i / n);
	    return scale;
	  }

	  function scale(x) {
	    if (!isNaN(x = +x)) return range$$1[bisectRight(thresholds, x)];
	  }

	  scale.invertExtent = function(y) {
	    var i = range$$1.indexOf(y);
	    return i < 0 ? [NaN, NaN] : [
	      i > 0 ? thresholds[i - 1] : domain[0],
	      i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
	    ];
	  };

	  scale.domain = function(_) {
	    if (!arguments.length) return domain.slice();
	    domain = [];
	    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
	    domain.sort(ascending);
	    return rescale();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range$$1 = slice$3.call(_), rescale()) : range$$1.slice();
	  };

	  scale.quantiles = function() {
	    return thresholds.slice();
	  };

	  scale.copy = function() {
	    return quantile$$1()
	        .domain(domain)
	        .range(range$$1);
	  };

	  return scale;
	}

	function quantize$1() {
	  var x0 = 0,
	      x1 = 1,
	      n = 1,
	      domain = [0.5],
	      range$$1 = [0, 1];

	  function scale(x) {
	    if (x <= x) return range$$1[bisectRight(domain, x, 0, n)];
	  }

	  function rescale() {
	    var i = -1;
	    domain = new Array(n);
	    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
	    return scale;
	  }

	  scale.domain = function(_) {
	    return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
	  };

	  scale.range = function(_) {
	    return arguments.length ? (n = (range$$1 = slice$3.call(_)).length - 1, rescale()) : range$$1.slice();
	  };

	  scale.invertExtent = function(y) {
	    var i = range$$1.indexOf(y);
	    return i < 0 ? [NaN, NaN]
	        : i < 1 ? [x0, domain[0]]
	        : i >= n ? [domain[n - 1], x1]
	        : [domain[i - 1], domain[i]];
	  };

	  scale.copy = function() {
	    return quantize$1()
	        .domain([x0, x1])
	        .range(range$$1);
	  };

	  return linearish(scale);
	}

	function threshold$1() {
	  var domain = [0.5],
	      range$$1 = [0, 1],
	      n = 1;

	  function scale(x) {
	    if (x <= x) return range$$1[bisectRight(domain, x, 0, n)];
	  }

	  scale.domain = function(_) {
	    return arguments.length ? (domain = slice$3.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : domain.slice();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range$$1 = slice$3.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : range$$1.slice();
	  };

	  scale.invertExtent = function(y) {
	    var i = range$$1.indexOf(y);
	    return [domain[i - 1], domain[i]];
	  };

	  scale.copy = function() {
	    return threshold$1()
	        .domain(domain)
	        .range(range$$1);
	  };

	  return scale;
	}

	var durationSecond$1 = 1000;
	var durationMinute$1 = durationSecond$1 * 60;
	var durationHour$1 = durationMinute$1 * 60;
	var durationDay$1 = durationHour$1 * 24;
	var durationWeek$1 = durationDay$1 * 7;
	var durationMonth = durationDay$1 * 30;
	var durationYear = durationDay$1 * 365;

	function date$1(t) {
	  return new Date(t);
	}

	function number$2(t) {
	  return t instanceof Date ? +t : +new Date(+t);
	}

	function calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format) {
	  var scale = continuous(deinterpolateLinear, interpolateNumber),
	      invert = scale.invert,
	      domain = scale.domain;

	  var formatMillisecond = format(".%L"),
	      formatSecond = format(":%S"),
	      formatMinute = format("%I:%M"),
	      formatHour = format("%I %p"),
	      formatDay = format("%a %d"),
	      formatWeek = format("%b %d"),
	      formatMonth = format("%B"),
	      formatYear = format("%Y");

	  var tickIntervals = [
	    [second$$1,  1,      durationSecond$1],
	    [second$$1,  5,  5 * durationSecond$1],
	    [second$$1, 15, 15 * durationSecond$1],
	    [second$$1, 30, 30 * durationSecond$1],
	    [minute$$1,  1,      durationMinute$1],
	    [minute$$1,  5,  5 * durationMinute$1],
	    [minute$$1, 15, 15 * durationMinute$1],
	    [minute$$1, 30, 30 * durationMinute$1],
	    [  hour$$1,  1,      durationHour$1  ],
	    [  hour$$1,  3,  3 * durationHour$1  ],
	    [  hour$$1,  6,  6 * durationHour$1  ],
	    [  hour$$1, 12, 12 * durationHour$1  ],
	    [   day$$1,  1,      durationDay$1   ],
	    [   day$$1,  2,  2 * durationDay$1   ],
	    [  week,  1,      durationWeek$1  ],
	    [ month$$1,  1,      durationMonth ],
	    [ month$$1,  3,  3 * durationMonth ],
	    [  year$$1,  1,      durationYear  ]
	  ];

	  function tickFormat(date) {
	    return (second$$1(date) < date ? formatMillisecond
	        : minute$$1(date) < date ? formatSecond
	        : hour$$1(date) < date ? formatMinute
	        : day$$1(date) < date ? formatHour
	        : month$$1(date) < date ? (week(date) < date ? formatDay : formatWeek)
	        : year$$1(date) < date ? formatMonth
	        : formatYear)(date);
	  }

	  function tickInterval(interval, start, stop, step) {
	    if (interval == null) interval = 10;

	    // If a desired tick count is specified, pick a reasonable tick interval
	    // based on the extent of the domain and a rough estimate of tick size.
	    // Otherwise, assume interval is already a time interval and use it.
	    if (typeof interval === "number") {
	      var target = Math.abs(stop - start) / interval,
	          i = bisector(function(i) { return i[2]; }).right(tickIntervals, target);
	      if (i === tickIntervals.length) {
	        step = tickStep(start / durationYear, stop / durationYear, interval);
	        interval = year$$1;
	      } else if (i) {
	        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
	        step = i[1];
	        interval = i[0];
	      } else {
	        step = tickStep(start, stop, interval);
	        interval = millisecond$$1;
	      }
	    }

	    return step == null ? interval : interval.every(step);
	  }

	  scale.invert = function(y) {
	    return new Date(invert(y));
	  };

	  scale.domain = function(_) {
	    return arguments.length ? domain(map$3.call(_, number$2)) : domain().map(date$1);
	  };

	  scale.ticks = function(interval, step) {
	    var d = domain(),
	        t0 = d[0],
	        t1 = d[d.length - 1],
	        r = t1 < t0,
	        t;
	    if (r) t = t0, t0 = t1, t1 = t;
	    t = tickInterval(interval, t0, t1, step);
	    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
	    return r ? t.reverse() : t;
	  };

	  scale.tickFormat = function(count, specifier) {
	    return specifier == null ? tickFormat : format(specifier);
	  };

	  scale.nice = function(interval, step) {
	    var d = domain();
	    return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
	        ? domain(nice(d, interval))
	        : scale;
	  };

	  scale.copy = function() {
	    return copy(scale, calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format));
	  };

	  return scale;
	}

	var time = function() {
	  return calendar(year, month, sunday, day, hour, minute, second, millisecond, exports.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
	};

	var utcTime = function() {
	  return calendar(utcYear, utcMonth, utcSunday, utcDay, utcHour, utcMinute, second, millisecond, exports.utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
	};

	var colors = function(s) {
	  return s.match(/.{6}/g).map(function(x) {
	    return "#" + x;
	  });
	};

	var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

	var category20b = colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

	var category20c = colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

	var category20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

	var cubehelix$3 = cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

	var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

	var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

	var rainbow = cubehelix();

	var rainbow$1 = function(t) {
	  if (t < 0 || t > 1) t -= Math.floor(t);
	  var ts = Math.abs(t - 0.5);
	  rainbow.h = 360 * t - 100;
	  rainbow.s = 1.5 - 1.5 * ts;
	  rainbow.l = 0.8 - 0.9 * ts;
	  return rainbow + "";
	};

	function ramp(range) {
	  var n = range.length;
	  return function(t) {
	    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
	  };
	}

	var viridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

	var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

	var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

	var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

	function sequential(interpolator) {
	  var x0 = 0,
	      x1 = 1,
	      clamp = false;

	  function scale(x) {
	    var t = (x - x0) / (x1 - x0);
	    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
	  }

	  scale.domain = function(_) {
	    return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
	  };

	  scale.clamp = function(_) {
	    return arguments.length ? (clamp = !!_, scale) : clamp;
	  };

	  scale.interpolator = function(_) {
	    return arguments.length ? (interpolator = _, scale) : interpolator;
	  };

	  scale.copy = function() {
	    return sequential(interpolator).domain([x0, x1]).clamp(clamp);
	  };

	  return linearish(scale);
	}

	var xhtml = "http://www.w3.org/1999/xhtml";

	var namespaces = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	var namespace = function(name) {
	  var prefix = name += "", i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
	};

	function creatorInherit(name) {
	  return function() {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml && document.documentElement.namespaceURI === xhtml
	        ? document.createElement(name)
	        : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed(fullname) {
	  return function() {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	var creator = function(name) {
	  var fullname = namespace(name);
	  return (fullname.local
	      ? creatorFixed
	      : creatorInherit)(fullname);
	};

	var nextId = 0;

	function local() {
	  return new Local;
	}

	function Local() {
	  this._ = "@" + (++nextId).toString(36);
	}

	Local.prototype = local.prototype = {
	  constructor: Local,
	  get: function(node) {
	    var id = this._;
	    while (!(id in node)) if (!(node = node.parentNode)) return;
	    return node[id];
	  },
	  set: function(node, value) {
	    return node[this._] = value;
	  },
	  remove: function(node) {
	    return this._ in node && delete node[this._];
	  },
	  toString: function() {
	    return this._;
	  }
	};

	var matcher = function(selector) {
	  return function() {
	    return this.matches(selector);
	  };
	};

	if (typeof document !== "undefined") {
	  var element = document.documentElement;
	  if (!element.matches) {
	    var vendorMatches = element.webkitMatchesSelector
	        || element.msMatchesSelector
	        || element.mozMatchesSelector
	        || element.oMatchesSelector;
	    matcher = function(selector) {
	      return function() {
	        return vendorMatches.call(this, selector);
	      };
	    };
	  }
	}

	var matcher$1 = matcher;

	var filterEvents = {};

	exports.event = null;

	if (typeof document !== "undefined") {
	  var element$1 = document.documentElement;
	  if (!("onmouseenter" in element$1)) {
	    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
	  }
	}

	function filterContextListener(listener, index, group) {
	  listener = contextListener(listener, index, group);
	  return function(event) {
	    var related = event.relatedTarget;
	    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
	      listener.call(this, event);
	    }
	  };
	}

	function contextListener(listener, index, group) {
	  return function(event1) {
	    var event0 = exports.event; // Events can be reentrant (e.g., focus).
	    exports.event = event1;
	    try {
	      listener.call(this, this.__data__, index, group);
	    } finally {
	      exports.event = event0;
	    }
	  };
	}

	function parseTypenames$1(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return {type: t, name: name};
	  });
	}

	function onRemove(typename) {
	  return function() {
	    var on = this.__on;
	    if (!on) return;
	    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	      } else {
	        on[++i] = o;
	      }
	    }
	    if (++i) on.length = i;
	    else delete this.__on;
	  };
	}

	function onAdd(typename, value, capture) {
	  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
	  return function(d, i, group) {
	    var on = this.__on, o, listener = wrap(value, i, group);
	    if (on) for (var j = 0, m = on.length; j < m; ++j) {
	      if ((o = on[j]).type === typename.type && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
	        o.value = value;
	        return;
	      }
	    }
	    this.addEventListener(typename.type, listener, capture);
	    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
	    if (!on) this.__on = [o];
	    else on.push(o);
	  };
	}

	var selection_on = function(typename, value, capture) {
	  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

	  if (arguments.length < 2) {
	    var on = this.node().__on;
	    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	      for (i = 0, o = on[j]; i < n; ++i) {
	        if ((t = typenames[i]).type === o.type && t.name === o.name) {
	          return o.value;
	        }
	      }
	    }
	    return;
	  }

	  on = value ? onAdd : onRemove;
	  if (capture == null) capture = false;
	  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
	  return this;
	};

	function customEvent(event1, listener, that, args) {
	  var event0 = exports.event;
	  event1.sourceEvent = exports.event;
	  exports.event = event1;
	  try {
	    return listener.apply(that, args);
	  } finally {
	    exports.event = event0;
	  }
	}

	var sourceEvent = function() {
	  var current = exports.event, source;
	  while (source = current.sourceEvent) current = source;
	  return current;
	};

	var point$5 = function(node, event) {
	  var svg = node.ownerSVGElement || node;

	  if (svg.createSVGPoint) {
	    var point = svg.createSVGPoint();
	    point.x = event.clientX, point.y = event.clientY;
	    point = point.matrixTransform(node.getScreenCTM().inverse());
	    return [point.x, point.y];
	  }

	  var rect = node.getBoundingClientRect();
	  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
	};

	var mouse = function(node) {
	  var event = sourceEvent();
	  if (event.changedTouches) event = event.changedTouches[0];
	  return point$5(node, event);
	};

	function none$2() {}

	var selector = function(selector) {
	  return selector == null ? none$2 : function() {
	    return this.querySelector(selector);
	  };
	};

	var selection_select = function(select) {
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	};

	function empty() {
	  return [];
	}

	var selectorAll = function(selector) {
	  return selector == null ? empty : function() {
	    return this.querySelectorAll(selector);
	  };
	};

	var selection_selectAll = function(select) {
	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, parents);
	};

	var selection_filter = function(match) {
	  if (typeof match !== "function") match = matcher$1(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	};

	var sparse = function(update) {
	  return new Array(update.length);
	};

	var selection_enter = function() {
	  return new Selection(this._enter || this._groups.map(sparse), this._parents);
	};

	function EnterNode(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}

	EnterNode.prototype = {
	  constructor: EnterNode,
	  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	  querySelector: function(selector) { return this._parent.querySelector(selector); },
	  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	};

	var constant$5 = function(x) {
	  return function() {
	    return x;
	  };
	};

	var keyPrefix = "$"; // Protect against keys like “__proto__”.

	function bindIndex(parent, group, enter, update, exit, data) {
	  var i = 0,
	      node,
	      groupLength = group.length,
	      dataLength = data.length;

	  // Put any non-null nodes that fit into update.
	  // Put any null nodes into enter.
	  // Put any remaining data into enter.
	  for (; i < dataLength; ++i) {
	    if (node = group[i]) {
	      node.__data__ = data[i];
	      update[i] = node;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Put any non-null nodes that don’t fit into exit.
	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey(parent, group, enter, update, exit, data, key) {
	  var i,
	      node,
	      nodeByKeyValue = {},
	      groupLength = group.length,
	      dataLength = data.length,
	      keyValues = new Array(groupLength),
	      keyValue;

	  // Compute the key for each node.
	  // If multiple nodes have the same key, the duplicates are added to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if (node = group[i]) {
	      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
	      if (keyValue in nodeByKeyValue) {
	        exit[i] = node;
	      } else {
	        nodeByKeyValue[keyValue] = node;
	      }
	    }
	  }

	  // Compute the key for each datum.
	  // If there a node associated with this key, join and add it to update.
	  // If there is not (or the key is a duplicate), add it to enter.
	  for (i = 0; i < dataLength; ++i) {
	    keyValue = keyPrefix + key.call(parent, data[i], i, data);
	    if (node = nodeByKeyValue[keyValue]) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue[keyValue] = null;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Add any remaining nodes that were not bound to data to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
	      exit[i] = node;
	    }
	  }
	}

	var selection_data = function(value, key) {
	  if (!value) {
	    data = new Array(this.size()), j = -1;
	    this.each(function(d) { data[++j] = d; });
	    return data;
	  }

	  var bind = key ? bindKey : bindIndex,
	      parents = this._parents,
	      groups = this._groups;

	  if (typeof value !== "function") value = constant$5(value);

	  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	    var parent = parents[j],
	        group = groups[j],
	        groupLength = group.length,
	        data = value.call(parent, parent && parent.__data__, j, parents),
	        dataLength = data.length,
	        enterGroup = enter[j] = new Array(dataLength),
	        updateGroup = update[j] = new Array(dataLength),
	        exitGroup = exit[j] = new Array(groupLength);

	    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	    // Now connect the enter nodes to their following update node, such that
	    // appendChild can insert the materialized enter node before this node,
	    // rather than at the end of the parent node.
	    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	      if (previous = enterGroup[i0]) {
	        if (i0 >= i1) i1 = i0 + 1;
	        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
	        previous._next = next || null;
	      }
	    }
	  }

	  update = new Selection(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	};

	var selection_exit = function() {
	  return new Selection(this._exit || this._groups.map(sparse), this._parents);
	};

	var selection_merge = function(selection) {

	  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Selection(merges, this._parents);
	};

	var selection_order = function() {

	  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	      if (node = group[i]) {
	        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	        next = node;
	      }
	    }
	  }

	  return this;
	};

	var selection_sort = function(compare) {
	  if (!compare) compare = ascending$2;

	  function compareNode(a, b) {
	    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	  }

	  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        sortgroup[i] = node;
	      }
	    }
	    sortgroup.sort(compareNode);
	  }

	  return new Selection(sortgroups, this._parents).order();
	};

	function ascending$2(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	var selection_call = function() {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	};

	var selection_nodes = function() {
	  var nodes = new Array(this.size()), i = -1;
	  this.each(function() { nodes[++i] = this; });
	  return nodes;
	};

	var selection_node = function() {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	};

	var selection_size = function() {
	  var size = 0;
	  this.each(function() { ++size; });
	  return size;
	};

	var selection_empty = function() {
	  return !this.node();
	};

	var selection_each = function(callback) {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	};

	function attrRemove(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant(name, value) {
	  return function() {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS(fullname, value) {
	  return function() {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);
	    else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS(fullname, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	    else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	var selection_attr = function(name, value) {
	  var fullname = namespace(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local
	        ? node.getAttributeNS(fullname.space, fullname.local)
	        : node.getAttribute(fullname);
	  }

	  return this.each((value == null
	      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
	      ? (fullname.local ? attrFunctionNS : attrFunction)
	      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
	};

	var window = function(node) {
	  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	      || (node.document && node) // node is a Window
	      || node.defaultView; // node is a Document
	};

	function styleRemove(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant(name, value, priority) {
	  return function() {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction(name, value, priority) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);
	    else this.style.setProperty(name, v, priority);
	  };
	}

	var selection_style = function(name, value, priority) {
	  var node;
	  return arguments.length > 1
	      ? this.each((value == null
	            ? styleRemove : typeof value === "function"
	            ? styleFunction
	            : styleConstant)(name, value, priority == null ? "" : priority))
	      : window(node = this.node())
	          .getComputedStyle(node, null)
	          .getPropertyValue(name);
	};

	function propertyRemove(name) {
	  return function() {
	    delete this[name];
	  };
	}

	function propertyConstant(name, value) {
	  return function() {
	    this[name] = value;
	  };
	}

	function propertyFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];
	    else this[name] = v;
	  };
	}

	var selection_property = function(name, value) {
	  return arguments.length > 1
	      ? this.each((value == null
	          ? propertyRemove : typeof value === "function"
	          ? propertyFunction
	          : propertyConstant)(name, value))
	      : this.node()[name];
	};

	function classArray(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList(node) {
	  return node.classList || new ClassList(node);
	}

	function ClassList(node) {
	  this._node = node;
	  this._names = classArray(node.getAttribute("class") || "");
	}

	ClassList.prototype = {
	  add: function(name) {
	    var i = this._names.indexOf(name);
	    if (i < 0) {
	      this._names.push(name);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  remove: function(name) {
	    var i = this._names.indexOf(name);
	    if (i >= 0) {
	      this._names.splice(i, 1);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  contains: function(name) {
	    return this._names.indexOf(name) >= 0;
	  }
	};

	function classedAdd(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.add(names[i]);
	}

	function classedRemove(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.remove(names[i]);
	}

	function classedTrue(names) {
	  return function() {
	    classedAdd(this, names);
	  };
	}

	function classedFalse(names) {
	  return function() {
	    classedRemove(this, names);
	  };
	}

	function classedFunction(names, value) {
	  return function() {
	    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	  };
	}

	var selection_classed = function(name, value) {
	  var names = classArray(name + "");

	  if (arguments.length < 2) {
	    var list = classList(this.node()), i = -1, n = names.length;
	    while (++i < n) if (!list.contains(names[i])) return false;
	    return true;
	  }

	  return this.each((typeof value === "function"
	      ? classedFunction : value
	      ? classedTrue
	      : classedFalse)(names, value));
	};

	function textRemove() {
	  this.textContent = "";
	}

	function textConstant(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	var selection_text = function(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? textRemove : (typeof value === "function"
	          ? textFunction
	          : textConstant)(value))
	      : this.node().textContent;
	};

	function htmlRemove() {
	  this.innerHTML = "";
	}

	function htmlConstant(value) {
	  return function() {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	var selection_html = function(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? htmlRemove : (typeof value === "function"
	          ? htmlFunction
	          : htmlConstant)(value))
	      : this.node().innerHTML;
	};

	function raise$1() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	var selection_raise = function() {
	  return this.each(raise$1);
	};

	function lower() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	var selection_lower = function() {
	  return this.each(lower);
	};

	var selection_append = function(name) {
	  var create = typeof name === "function" ? name : creator(name);
	  return this.select(function() {
	    return this.appendChild(create.apply(this, arguments));
	  });
	};

	function constantNull() {
	  return null;
	}

	var selection_insert = function(name, before) {
	  var create = typeof name === "function" ? name : creator(name),
	      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	  return this.select(function() {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	};

	function remove() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	var selection_remove = function() {
	  return this.each(remove);
	};

	var selection_datum = function(value) {
	  return arguments.length
	      ? this.property("__data__", value)
	      : this.node().__data__;
	};

	function dispatchEvent(node, type, params) {
	  var window$$1 = window(node),
	      event = window$$1.CustomEvent;

	  if (event) {
	    event = new event(type, params);
	  } else {
	    event = window$$1.document.createEvent("Event");
	    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
	    else event.initEvent(type, false, false);
	  }

	  node.dispatchEvent(event);
	}

	function dispatchConstant(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params);
	  };
	}

	function dispatchFunction(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params.apply(this, arguments));
	  };
	}

	var selection_dispatch = function(type, params) {
	  return this.each((typeof params === "function"
	      ? dispatchFunction
	      : dispatchConstant)(type, params));
	};

	var root = [null];

	function Selection(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection([[document.documentElement]], root);
	}

	Selection.prototype = selection.prototype = {
	  constructor: Selection,
	  select: selection_select,
	  selectAll: selection_selectAll,
	  filter: selection_filter,
	  data: selection_data,
	  enter: selection_enter,
	  exit: selection_exit,
	  merge: selection_merge,
	  order: selection_order,
	  sort: selection_sort,
	  call: selection_call,
	  nodes: selection_nodes,
	  node: selection_node,
	  size: selection_size,
	  empty: selection_empty,
	  each: selection_each,
	  attr: selection_attr,
	  style: selection_style,
	  property: selection_property,
	  classed: selection_classed,
	  text: selection_text,
	  html: selection_html,
	  raise: selection_raise,
	  lower: selection_lower,
	  append: selection_append,
	  insert: selection_insert,
	  remove: selection_remove,
	  datum: selection_datum,
	  on: selection_on,
	  dispatch: selection_dispatch
	};

	var select = function(selector) {
	  return typeof selector === "string"
	      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
	      : new Selection([[selector]], root);
	};

	var selectAll = function(selector) {
	  return typeof selector === "string"
	      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
	      : new Selection([selector == null ? [] : selector], root);
	};

	var touch = function(node, touches, identifier) {
	  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

	  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
	    if ((touch = touches[i]).identifier === identifier) {
	      return point$5(node, touch);
	    }
	  }

	  return null;
	};

	var touches = function(node, touches) {
	  if (touches == null) touches = sourceEvent().touches;

	  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
	    points[i] = point$5(node, touches[i]);
	  }

	  return points;
	};

	var emptyOn = dispatch("start", "end", "interrupt");
	var emptyTween = [];

	var CREATED = 0;
	var SCHEDULED = 1;
	var STARTING = 2;
	var STARTED = 3;
	var RUNNING = 4;
	var ENDING = 5;
	var ENDED = 6;

	var schedule = function(node, name, id, index, group, timing) {
	  var schedules = node.__transition;
	  if (!schedules) node.__transition = {};
	  else if (id in schedules) return;
	  create(node, id, {
	    name: name,
	    index: index, // For context during callback.
	    group: group, // For context during callback.
	    on: emptyOn,
	    tween: emptyTween,
	    time: timing.time,
	    delay: timing.delay,
	    duration: timing.duration,
	    ease: timing.ease,
	    timer: null,
	    state: CREATED
	  });
	};

	function init(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
	  return schedule;
	}

	function set$3(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
	  return schedule;
	}

	function get$1(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
	  return schedule;
	}

	function create(node, id, self) {
	  var schedules = node.__transition,
	      tween;

	  // Initialize the self timer when the transition is created.
	  // Note the actual delay is not known until the first callback!
	  schedules[id] = self;
	  self.timer = timer(schedule, 0, self.time);

	  function schedule(elapsed) {
	    self.state = SCHEDULED;
	    self.timer.restart(start, self.delay, self.time);

	    // If the elapsed delay is less than our first sleep, start immediately.
	    if (self.delay <= elapsed) start(elapsed - self.delay);
	  }

	  function start(elapsed) {
	    var i, j, n, o;

	    // If the state is not SCHEDULED, then we previously errored on start.
	    if (self.state !== SCHEDULED) return stop();

	    for (i in schedules) {
	      o = schedules[i];
	      if (o.name !== self.name) continue;

	      // While this element already has a starting transition during this frame,
	      // defer starting an interrupting transition until that transition has a
	      // chance to tick (and possibly end); see d3/d3-transition#54!
	      if (o.state === STARTED) return timeout$1(start);

	      // Interrupt the active transition, if any.
	      // Dispatch the interrupt event.
	      if (o.state === RUNNING) {
	        o.state = ENDED;
	        o.timer.stop();
	        o.on.call("interrupt", node, node.__data__, o.index, o.group);
	        delete schedules[i];
	      }

	      // Cancel any pre-empted transitions. No interrupt event is dispatched
	      // because the cancelled transitions never started. Note that this also
	      // removes this transition from the pending list!
	      else if (+i < id) {
	        o.state = ENDED;
	        o.timer.stop();
	        delete schedules[i];
	      }
	    }

	    // Defer the first tick to end of the current frame; see d3/d3#1576.
	    // Note the transition may be canceled after start and before the first tick!
	    // Note this must be scheduled before the start event; see d3/d3-transition#16!
	    // Assuming this is successful, subsequent callbacks go straight to tick.
	    timeout$1(function() {
	      if (self.state === STARTED) {
	        self.state = RUNNING;
	        self.timer.restart(tick, self.delay, self.time);
	        tick(elapsed);
	      }
	    });

	    // Dispatch the start event.
	    // Note this must be done before the tween are initialized.
	    self.state = STARTING;
	    self.on.call("start", node, node.__data__, self.index, self.group);
	    if (self.state !== STARTING) return; // interrupted
	    self.state = STARTED;

	    // Initialize the tween, deleting null tween.
	    tween = new Array(n = self.tween.length);
	    for (i = 0, j = -1; i < n; ++i) {
	      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
	        tween[++j] = o;
	      }
	    }
	    tween.length = j + 1;
	  }

	  function tick(elapsed) {
	    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
	        i = -1,
	        n = tween.length;

	    while (++i < n) {
	      tween[i].call(null, t);
	    }

	    // Dispatch the end event.
	    if (self.state === ENDING) {
	      self.on.call("end", node, node.__data__, self.index, self.group);
	      stop();
	    }
	  }

	  function stop() {
	    self.state = ENDED;
	    self.timer.stop();
	    delete schedules[id];
	    for (var i in schedules) return; // eslint-disable-line no-unused-vars
	    delete node.__transition;
	  }
	}

	var interrupt = function(node, name) {
	  var schedules = node.__transition,
	      schedule,
	      active,
	      empty = true,
	      i;

	  if (!schedules) return;

	  name = name == null ? null : name + "";

	  for (i in schedules) {
	    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
	    active = schedule.state > STARTING && schedule.state < ENDING;
	    schedule.state = ENDED;
	    schedule.timer.stop();
	    if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
	    delete schedules[i];
	  }

	  if (empty) delete node.__transition;
	};

	var selection_interrupt = function(name) {
	  return this.each(function() {
	    interrupt(this, name);
	  });
	};

	function tweenRemove(id, name) {
	  var tween0, tween1;
	  return function() {
	    var schedule = set$3(this, id),
	        tween = schedule.tween;

	    // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.
	    if (tween !== tween0) {
	      tween1 = tween0 = tween;
	      for (var i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1 = tween1.slice();
	          tween1.splice(i, 1);
	          break;
	        }
	      }
	    }

	    schedule.tween = tween1;
	  };
	}

	function tweenFunction(id, name, value) {
	  var tween0, tween1;
	  if (typeof value !== "function") throw new Error;
	  return function() {
	    var schedule = set$3(this, id),
	        tween = schedule.tween;

	    // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.
	    if (tween !== tween0) {
	      tween1 = (tween0 = tween).slice();
	      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1[i] = t;
	          break;
	        }
	      }
	      if (i === n) tween1.push(t);
	    }

	    schedule.tween = tween1;
	  };
	}

	var transition_tween = function(name, value) {
	  var id = this._id;

	  name += "";

	  if (arguments.length < 2) {
	    var tween = get$1(this.node(), id).tween;
	    for (var i = 0, n = tween.length, t; i < n; ++i) {
	      if ((t = tween[i]).name === name) {
	        return t.value;
	      }
	    }
	    return null;
	  }

	  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
	};

	function tweenValue(transition, name, value) {
	  var id = transition._id;

	  transition.each(function() {
	    var schedule = set$3(this, id);
	    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
	  });

	  return function(node) {
	    return get$1(node, id).value[name];
	  };
	}

	var interpolate$1 = function(a, b) {
	  var c;
	  return (typeof b === "number" ? interpolateNumber
	      : b instanceof color ? interpolateRgb
	      : (c = color(b)) ? (b = c, interpolateRgb)
	      : interpolateString)(a, b);
	};

	function attrRemove$1(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS$1(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant$1(name, interpolate$$1, value1) {
	  var value00,
	      interpolate0;
	  return function() {
	    var value0 = this.getAttribute(name);
	    return value0 === value1 ? null
	        : value0 === value00 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value1);
	  };
	}

	function attrConstantNS$1(fullname, interpolate$$1, value1) {
	  var value00,
	      interpolate0;
	  return function() {
	    var value0 = this.getAttributeNS(fullname.space, fullname.local);
	    return value0 === value1 ? null
	        : value0 === value00 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value1);
	  };
	}

	function attrFunction$1(name, interpolate$$1, value) {
	  var value00,
	      value10,
	      interpolate0;
	  return function() {
	    var value0, value1 = value(this);
	    if (value1 == null) return void this.removeAttribute(name);
	    value0 = this.getAttribute(name);
	    return value0 === value1 ? null
	        : value0 === value00 && value1 === value10 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
	  };
	}

	function attrFunctionNS$1(fullname, interpolate$$1, value) {
	  var value00,
	      value10,
	      interpolate0;
	  return function() {
	    var value0, value1 = value(this);
	    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
	    value0 = this.getAttributeNS(fullname.space, fullname.local);
	    return value0 === value1 ? null
	        : value0 === value00 && value1 === value10 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
	  };
	}

	var transition_attr = function(name, value) {
	  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate$1;
	  return this.attrTween(name, typeof value === "function"
	      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
	      : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
	      : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
	};

	function attrTweenNS(fullname, value) {
	  function tween() {
	    var node = this, i = value.apply(node, arguments);
	    return i && function(t) {
	      node.setAttributeNS(fullname.space, fullname.local, i(t));
	    };
	  }
	  tween._value = value;
	  return tween;
	}

	function attrTween(name, value) {
	  function tween() {
	    var node = this, i = value.apply(node, arguments);
	    return i && function(t) {
	      node.setAttribute(name, i(t));
	    };
	  }
	  tween._value = value;
	  return tween;
	}

	var transition_attrTween = function(name, value) {
	  var key = "attr." + name;
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  var fullname = namespace(name);
	  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
	};

	function delayFunction(id, value) {
	  return function() {
	    init(this, id).delay = +value.apply(this, arguments);
	  };
	}

	function delayConstant(id, value) {
	  return value = +value, function() {
	    init(this, id).delay = value;
	  };
	}

	var transition_delay = function(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each((typeof value === "function"
	          ? delayFunction
	          : delayConstant)(id, value))
	      : get$1(this.node(), id).delay;
	};

	function durationFunction(id, value) {
	  return function() {
	    set$3(this, id).duration = +value.apply(this, arguments);
	  };
	}

	function durationConstant(id, value) {
	  return value = +value, function() {
	    set$3(this, id).duration = value;
	  };
	}

	var transition_duration = function(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each((typeof value === "function"
	          ? durationFunction
	          : durationConstant)(id, value))
	      : get$1(this.node(), id).duration;
	};

	function easeConstant(id, value) {
	  if (typeof value !== "function") throw new Error;
	  return function() {
	    set$3(this, id).ease = value;
	  };
	}

	var transition_ease = function(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each(easeConstant(id, value))
	      : get$1(this.node(), id).ease;
	};

	var transition_filter = function(match) {
	  if (typeof match !== "function") match = matcher$1(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, this._name, this._id);
	};

	var transition_merge = function(transition) {
	  if (transition._id !== this._id) throw new Error;

	  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Transition(merges, this._parents, this._name, this._id);
	};

	function start$1(name) {
	  return (name + "").trim().split(/^|\s+/).every(function(t) {
	    var i = t.indexOf(".");
	    if (i >= 0) t = t.slice(0, i);
	    return !t || t === "start";
	  });
	}

	function onFunction(id, name, listener) {
	  var on0, on1, sit = start$1(name) ? init : set$3;
	  return function() {
	    var schedule = sit(this, id),
	        on = schedule.on;

	    // If this node shared a dispatch with the previous node,
	    // just assign the updated shared dispatch and we’re done!
	    // Otherwise, copy-on-write.
	    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

	    schedule.on = on1;
	  };
	}

	var transition_on = function(name, listener) {
	  var id = this._id;

	  return arguments.length < 2
	      ? get$1(this.node(), id).on.on(name)
	      : this.each(onFunction(id, name, listener));
	};

	function removeFunction(id) {
	  return function() {
	    var parent = this.parentNode;
	    for (var i in this.__transition) if (+i !== id) return;
	    if (parent) parent.removeChild(this);
	  };
	}

	var transition_remove = function() {
	  return this.on("end.remove", removeFunction(this._id));
	};

	var transition_select = function(select$$1) {
	  var name = this._name,
	      id = this._id;

	  if (typeof select$$1 !== "function") select$$1 = selector(select$$1);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select$$1.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	        schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, name, id);
	};

	var transition_selectAll = function(select$$1) {
	  var name = this._name,
	      id = this._id;

	  if (typeof select$$1 !== "function") select$$1 = selectorAll(select$$1);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        for (var children = select$$1.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
	          if (child = children[k]) {
	            schedule(child, name, id, k, children, inherit);
	          }
	        }
	        subgroups.push(children);
	        parents.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, parents, name, id);
	};

	var Selection$1 = selection.prototype.constructor;

	var transition_selection = function() {
	  return new Selection$1(this._groups, this._parents);
	};

	function styleRemove$1(name, interpolate$$1) {
	  var value00,
	      value10,
	      interpolate0;
	  return function() {
	    var style = window(this).getComputedStyle(this, null),
	        value0 = style.getPropertyValue(name),
	        value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
	    return value0 === value1 ? null
	        : value0 === value00 && value1 === value10 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
	  };
	}

	function styleRemoveEnd(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant$1(name, interpolate$$1, value1) {
	  var value00,
	      interpolate0;
	  return function() {
	    var value0 = window(this).getComputedStyle(this, null).getPropertyValue(name);
	    return value0 === value1 ? null
	        : value0 === value00 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value1);
	  };
	}

	function styleFunction$1(name, interpolate$$1, value) {
	  var value00,
	      value10,
	      interpolate0;
	  return function() {
	    var style = window(this).getComputedStyle(this, null),
	        value0 = style.getPropertyValue(name),
	        value1 = value(this);
	    if (value1 == null) value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
	    return value0 === value1 ? null
	        : value0 === value00 && value1 === value10 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
	  };
	}

	var transition_style = function(name, value, priority) {
	  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$1;
	  return value == null ? this
	          .styleTween(name, styleRemove$1(name, i))
	          .on("end.style." + name, styleRemoveEnd(name))
	      : this.styleTween(name, typeof value === "function"
	          ? styleFunction$1(name, i, tweenValue(this, "style." + name, value))
	          : styleConstant$1(name, i, value), priority);
	};

	function styleTween(name, value, priority) {
	  function tween() {
	    var node = this, i = value.apply(node, arguments);
	    return i && function(t) {
	      node.style.setProperty(name, i(t), priority);
	    };
	  }
	  tween._value = value;
	  return tween;
	}

	var transition_styleTween = function(name, value, priority) {
	  var key = "style." + (name += "");
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
	};

	function textConstant$1(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction$1(value) {
	  return function() {
	    var value1 = value(this);
	    this.textContent = value1 == null ? "" : value1;
	  };
	}

	var transition_text = function(value) {
	  return this.tween("text", typeof value === "function"
	      ? textFunction$1(tweenValue(this, "text", value))
	      : textConstant$1(value == null ? "" : value + ""));
	};

	var transition_transition = function() {
	  var name = this._name,
	      id0 = this._id,
	      id1 = newId();

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        var inherit = get$1(node, id0);
	        schedule(node, name, id1, i, group, {
	          time: inherit.time + inherit.delay + inherit.duration,
	          delay: 0,
	          duration: inherit.duration,
	          ease: inherit.ease
	        });
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id1);
	};

	var id = 0;

	function Transition(groups, parents, name, id) {
	  this._groups = groups;
	  this._parents = parents;
	  this._name = name;
	  this._id = id;
	}

	function transition(name) {
	  return selection().transition(name);
	}

	function newId() {
	  return ++id;
	}

	var selection_prototype = selection.prototype;

	Transition.prototype = transition.prototype = {
	  constructor: Transition,
	  select: transition_select,
	  selectAll: transition_selectAll,
	  filter: transition_filter,
	  merge: transition_merge,
	  selection: transition_selection,
	  transition: transition_transition,
	  call: selection_prototype.call,
	  nodes: selection_prototype.nodes,
	  node: selection_prototype.node,
	  size: selection_prototype.size,
	  empty: selection_prototype.empty,
	  each: selection_prototype.each,
	  on: transition_on,
	  attr: transition_attr,
	  attrTween: transition_attrTween,
	  style: transition_style,
	  styleTween: transition_styleTween,
	  text: transition_text,
	  remove: transition_remove,
	  tween: transition_tween,
	  delay: transition_delay,
	  duration: transition_duration,
	  ease: transition_ease
	};

	var defaultTiming = {
	  time: null, // Set on use.
	  delay: 0,
	  duration: 250,
	  ease: cubicInOut
	};

	function inherit(node, id) {
	  var timing;
	  while (!(timing = node.__transition) || !(timing = timing[id])) {
	    if (!(node = node.parentNode)) {
	      return defaultTiming.time = now(), defaultTiming;
	    }
	  }
	  return timing;
	}

	var selection_transition = function(name) {
	  var id,
	      timing;

	  if (name instanceof Transition) {
	    id = name._id, name = name._name;
	  } else {
	    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
	  }

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        schedule(node, name, id, i, group, timing || inherit(node, id));
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id);
	};

	selection.prototype.interrupt = selection_interrupt;
	selection.prototype.transition = selection_transition;

	var root$1 = [null];

	var active = function(node, name) {
	  var schedules = node.__transition,
	      schedule,
	      i;

	  if (schedules) {
	    name = name == null ? null : name + "";
	    for (i in schedules) {
	      if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
	        return new Transition([[node]], root$1, name, +i);
	      }
	    }
	  }

	  return null;
	};

	var slice$4 = Array.prototype.slice;

	var identity$5 = function(x) {
	  return x;
	};

	var top = 1;
	var right = 2;
	var bottom = 3;
	var left = 4;
	var epsilon$2 = 1e-6;

	function translateX(scale0, scale1, d) {
	  var x = scale0(d);
	  return "translate(" + (isFinite(x) ? x : scale1(d)) + ",0)";
	}

	function translateY(scale0, scale1, d) {
	  var y = scale0(d);
	  return "translate(0," + (isFinite(y) ? y : scale1(d)) + ")";
	}

	function center(scale) {
	  var offset = scale.bandwidth() / 2;
	  if (scale.round()) offset = Math.round(offset);
	  return function(d) {
	    return scale(d) + offset;
	  };
	}

	function entering() {
	  return !this.__axis;
	}

	function axis(orient, scale) {
	  var tickArguments = [],
	      tickValues = null,
	      tickFormat = null,
	      tickSizeInner = 6,
	      tickSizeOuter = 6,
	      tickPadding = 3;

	  function axis(context) {
	    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
	        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$5) : tickFormat,
	        spacing = Math.max(tickSizeInner, 0) + tickPadding,
	        transform = orient === top || orient === bottom ? translateX : translateY,
	        range = scale.range(),
	        range0 = range[0] + 0.5,
	        range1 = range[range.length - 1] + 0.5,
	        position = (scale.bandwidth ? center : identity$5)(scale.copy()),
	        selection = context.selection ? context.selection() : context,
	        path = selection.selectAll(".domain").data([null]),
	        tick = selection.selectAll(".tick").data(values, scale).order(),
	        tickExit = tick.exit(),
	        tickEnter = tick.enter().append("g").attr("class", "tick"),
	        line = tick.select("line"),
	        text = tick.select("text"),
	        k = orient === top || orient === left ? -1 : 1,
	        x, y = orient === left || orient === right ? (x = "x", "y") : (x = "y", "x");

	    path = path.merge(path.enter().insert("path", ".tick")
	        .attr("class", "domain")
	        .attr("stroke", "#000"));

	    tick = tick.merge(tickEnter);

	    line = line.merge(tickEnter.append("line")
	        .attr("stroke", "#000")
	        .attr(x + "2", k * tickSizeInner)
	        .attr(y + "1", 0.5)
	        .attr(y + "2", 0.5));

	    text = text.merge(tickEnter.append("text")
	        .attr("fill", "#000")
	        .attr(x, k * spacing)
	        .attr(y, 0.5)
	        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

	    if (context !== selection) {
	      path = path.transition(context);
	      tick = tick.transition(context);
	      line = line.transition(context);
	      text = text.transition(context);

	      tickExit = tickExit.transition(context)
	          .attr("opacity", epsilon$2)
	          .attr("transform", function(d) { return transform(position, this.parentNode.__axis || position, d); });

	      tickEnter
	          .attr("opacity", epsilon$2)
	          .attr("transform", function(d) { return transform(this.parentNode.__axis || position, position, d); });
	    }

	    tickExit.remove();

	    path
	        .attr("d", orient === left || orient == right
	            ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter
	            : "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter);

	    tick
	        .attr("opacity", 1)
	        .attr("transform", function(d) { return transform(position, position, d); });

	    line
	        .attr(x + "2", k * tickSizeInner);

	    text
	        .attr(x, k * spacing)
	        .text(format);

	    selection.filter(entering)
	        .attr("fill", "none")
	        .attr("font-size", 10)
	        .attr("font-family", "sans-serif")
	        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

	    selection
	        .each(function() { this.__axis = position; });
	  }

	  axis.scale = function(_) {
	    return arguments.length ? (scale = _, axis) : scale;
	  };

	  axis.ticks = function() {
	    return tickArguments = slice$4.call(arguments), axis;
	  };

	  axis.tickArguments = function(_) {
	    return arguments.length ? (tickArguments = _ == null ? [] : slice$4.call(_), axis) : tickArguments.slice();
	  };

	  axis.tickValues = function(_) {
	    return arguments.length ? (tickValues = _ == null ? null : slice$4.call(_), axis) : tickValues && tickValues.slice();
	  };

	  axis.tickFormat = function(_) {
	    return arguments.length ? (tickFormat = _, axis) : tickFormat;
	  };

	  axis.tickSize = function(_) {
	    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
	  };

	  axis.tickSizeInner = function(_) {
	    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
	  };

	  axis.tickSizeOuter = function(_) {
	    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
	  };

	  axis.tickPadding = function(_) {
	    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
	  };

	  return axis;
	}

	function axisTop(scale) {
	  return axis(top, scale);
	}

	function axisRight(scale) {
	  return axis(right, scale);
	}

	function axisBottom(scale) {
	  return axis(bottom, scale);
	}

	function axisLeft(scale) {
	  return axis(left, scale);
	}

	function defaultSeparation(a, b) {
	  return a.parent === b.parent ? 1 : 2;
	}

	function meanX(children) {
	  return children.reduce(meanXReduce, 0) / children.length;
	}

	function meanXReduce(x, c) {
	  return x + c.x;
	}

	function maxY(children) {
	  return 1 + children.reduce(maxYReduce, 0);
	}

	function maxYReduce(y, c) {
	  return Math.max(y, c.y);
	}

	function leafLeft(node) {
	  var children;
	  while (children = node.children) node = children[0];
	  return node;
	}

	function leafRight(node) {
	  var children;
	  while (children = node.children) node = children[children.length - 1];
	  return node;
	}

	var cluster = function() {
	  var separation = defaultSeparation,
	      dx = 1,
	      dy = 1,
	      nodeSize = false;

	  function cluster(root) {
	    var previousNode,
	        x = 0;

	    // First walk, computing the initial x & y values.
	    root.eachAfter(function(node) {
	      var children = node.children;
	      if (children) {
	        node.x = meanX(children);
	        node.y = maxY(children);
	      } else {
	        node.x = previousNode ? x += separation(node, previousNode) : 0;
	        node.y = 0;
	        previousNode = node;
	      }
	    });

	    var left = leafLeft(root),
	        right = leafRight(root),
	        x0 = left.x - separation(left, right) / 2,
	        x1 = right.x + separation(right, left) / 2;

	    // Second walk, normalizing x & y to the desired size.
	    return root.eachAfter(nodeSize ? function(node) {
	      node.x = (node.x - root.x) * dx;
	      node.y = (root.y - node.y) * dy;
	    } : function(node) {
	      node.x = (node.x - x0) / (x1 - x0) * dx;
	      node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
	    });
	  }

	  cluster.separation = function(x) {
	    return arguments.length ? (separation = x, cluster) : separation;
	  };

	  cluster.size = function(x) {
	    return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], cluster) : (nodeSize ? null : [dx, dy]);
	  };

	  cluster.nodeSize = function(x) {
	    return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], cluster) : (nodeSize ? [dx, dy] : null);
	  };

	  return cluster;
	};

	var node_each = function(callback) {
	  var node = this, current, next = [node], children, i, n;
	  do {
	    current = next.reverse(), next = [];
	    while (node = current.pop()) {
	      callback(node), children = node.children;
	      if (children) for (i = 0, n = children.length; i < n; ++i) {
	        next.push(children[i]);
	      }
	    }
	  } while (next.length);
	  return this;
	};

	var node_eachBefore = function(callback) {
	  var node = this, nodes = [node], children, i;
	  while (node = nodes.pop()) {
	    callback(node), children = node.children;
	    if (children) for (i = children.length - 1; i >= 0; --i) {
	      nodes.push(children[i]);
	    }
	  }
	  return this;
	};

	var node_eachAfter = function(callback) {
	  var node = this, nodes = [node], next = [], children, i, n;
	  while (node = nodes.pop()) {
	    next.push(node), children = node.children;
	    if (children) for (i = 0, n = children.length; i < n; ++i) {
	      nodes.push(children[i]);
	    }
	  }
	  while (node = next.pop()) {
	    callback(node);
	  }
	  return this;
	};

	var node_sum = function(value) {
	  return this.eachAfter(function(node) {
	    var sum = +value(node.data) || 0,
	        children = node.children,
	        i = children && children.length;
	    while (--i >= 0) sum += children[i].value;
	    node.value = sum;
	  });
	};

	var node_sort = function(compare) {
	  return this.eachBefore(function(node) {
	    if (node.children) {
	      node.children.sort(compare);
	    }
	  });
	};

	var node_path = function(end) {
	  var start = this,
	      ancestor = leastCommonAncestor(start, end),
	      nodes = [start];
	  while (start !== ancestor) {
	    start = start.parent;
	    nodes.push(start);
	  }
	  var k = nodes.length;
	  while (end !== ancestor) {
	    nodes.splice(k, 0, end);
	    end = end.parent;
	  }
	  return nodes;
	};

	function leastCommonAncestor(a, b) {
	  if (a === b) return a;
	  var aNodes = a.ancestors(),
	      bNodes = b.ancestors(),
	      c = null;
	  a = aNodes.pop();
	  b = bNodes.pop();
	  while (a === b) {
	    c = a;
	    a = aNodes.pop();
	    b = bNodes.pop();
	  }
	  return c;
	}

	var node_ancestors = function() {
	  var node = this, nodes = [node];
	  while (node = node.parent) {
	    nodes.push(node);
	  }
	  return nodes;
	};

	var node_descendants = function() {
	  var nodes = [];
	  this.each(function(node) {
	    nodes.push(node);
	  });
	  return nodes;
	};

	var node_leaves = function() {
	  var leaves = [];
	  this.eachBefore(function(node) {
	    if (!node.children) {
	      leaves.push(node);
	    }
	  });
	  return leaves;
	};

	var node_links = function() {
	  var root = this, links = [];
	  root.each(function(node) {
	    if (node !== root) { // Don’t include the root’s parent, if any.
	      links.push({source: node.parent, target: node});
	    }
	  });
	  return links;
	};

	function hierarchy(data, children) {
	  var root = new Node(data),
	      valued = +data.value && (root.value = data.value),
	      node,
	      nodes = [root],
	      child,
	      childs,
	      i,
	      n;

	  if (children == null) children = defaultChildren;

	  while (node = nodes.pop()) {
	    if (valued) node.value = +node.data.value;
	    if ((childs = children(node.data)) && (n = childs.length)) {
	      node.children = new Array(n);
	      for (i = n - 1; i >= 0; --i) {
	        nodes.push(child = node.children[i] = new Node(childs[i]));
	        child.parent = node;
	        child.depth = node.depth + 1;
	      }
	    }
	  }

	  return root.eachBefore(computeHeight);
	}

	function node_copy() {
	  return hierarchy(this).eachBefore(copyData);
	}

	function defaultChildren(d) {
	  return d.children;
	}

	function copyData(node) {
	  node.data = node.data.data;
	}

	function computeHeight(node) {
	  var height = 0;
	  do node.height = height;
	  while ((node = node.parent) && (node.height < ++height));
	}

	function Node(data) {
	  this.data = data;
	  this.depth =
	  this.height = 0;
	  this.parent = null;
	}

	Node.prototype = hierarchy.prototype = {
	  constructor: Node,
	  each: node_each,
	  eachAfter: node_eachAfter,
	  eachBefore: node_eachBefore,
	  sum: node_sum,
	  sort: node_sort,
	  path: node_path,
	  ancestors: node_ancestors,
	  descendants: node_descendants,
	  leaves: node_leaves,
	  links: node_links,
	  copy: node_copy
	};

	function Node$2(value) {
	  this._ = value;
	  this.next = null;
	}

	var shuffle$1 = function(array) {
	  var i,
	      n = (array = array.slice()).length,
	      head = null,
	      node = head;

	  while (n) {
	    var next = new Node$2(array[n - 1]);
	    if (node) node = node.next = next;
	    else node = head = next;
	    array[i] = array[--n];
	  }

	  return {
	    head: head,
	    tail: node
	  };
	};

	var enclose = function(circles) {
	  return encloseN(shuffle$1(circles), []);
	};

	function encloses(a, b) {
	  var dx = b.x - a.x,
	      dy = b.y - a.y,
	      dr = a.r - b.r;
	  return dr * dr + 1e-6 > dx * dx + dy * dy;
	}

	// Returns the smallest circle that contains circles L and intersects circles B.
	function encloseN(L, B) {
	  var circle,
	      l0 = null,
	      l1 = L.head,
	      l2,
	      p1;

	  switch (B.length) {
	    case 1: circle = enclose1(B[0]); break;
	    case 2: circle = enclose2(B[0], B[1]); break;
	    case 3: circle = enclose3(B[0], B[1], B[2]); break;
	  }

	  while (l1) {
	    p1 = l1._, l2 = l1.next;
	    if (!circle || !encloses(circle, p1)) {

	      // Temporarily truncate L before l1.
	      if (l0) L.tail = l0, l0.next = null;
	      else L.head = L.tail = null;

	      B.push(p1);
	      circle = encloseN(L, B); // Note: reorders L!
	      B.pop();

	      // Move l1 to the front of L and reconnect the truncated list L.
	      if (L.head) l1.next = L.head, L.head = l1;
	      else l1.next = null, L.head = L.tail = l1;
	      l0 = L.tail, l0.next = l2;

	    } else {
	      l0 = l1;
	    }
	    l1 = l2;
	  }

	  L.tail = l0;
	  return circle;
	}

	function enclose1(a) {
	  return {
	    x: a.x,
	    y: a.y,
	    r: a.r
	  };
	}

	function enclose2(a, b) {
	  var x1 = a.x, y1 = a.y, r1 = a.r,
	      x2 = b.x, y2 = b.y, r2 = b.r,
	      x21 = x2 - x1, y21 = y2 - y1, r21 = r2 - r1,
	      l = Math.sqrt(x21 * x21 + y21 * y21);
	  return {
	    x: (x1 + x2 + x21 / l * r21) / 2,
	    y: (y1 + y2 + y21 / l * r21) / 2,
	    r: (l + r1 + r2) / 2
	  };
	}

	function enclose3(a, b, c) {
	  var x1 = a.x, y1 = a.y, r1 = a.r,
	      x2 = b.x, y2 = b.y, r2 = b.r,
	      x3 = c.x, y3 = c.y, r3 = c.r,
	      a2 = 2 * (x1 - x2),
	      b2 = 2 * (y1 - y2),
	      c2 = 2 * (r2 - r1),
	      d2 = x1 * x1 + y1 * y1 - r1 * r1 - x2 * x2 - y2 * y2 + r2 * r2,
	      a3 = 2 * (x1 - x3),
	      b3 = 2 * (y1 - y3),
	      c3 = 2 * (r3 - r1),
	      d3 = x1 * x1 + y1 * y1 - r1 * r1 - x3 * x3 - y3 * y3 + r3 * r3,
	      ab = a3 * b2 - a2 * b3,
	      xa = (b2 * d3 - b3 * d2) / ab - x1,
	      xb = (b3 * c2 - b2 * c3) / ab,
	      ya = (a3 * d2 - a2 * d3) / ab - y1,
	      yb = (a2 * c3 - a3 * c2) / ab,
	      A = xb * xb + yb * yb - 1,
	      B = 2 * (xa * xb + ya * yb + r1),
	      C = xa * xa + ya * ya - r1 * r1,
	      r = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
	  return {
	    x: xa + xb * r + x1,
	    y: ya + yb * r + y1,
	    r: r
	  };
	}

	function place(a, b, c) {
	  var ax = a.x,
	      ay = a.y,
	      da = b.r + c.r,
	      db = a.r + c.r,
	      dx = b.x - ax,
	      dy = b.y - ay,
	      dc = dx * dx + dy * dy;
	  if (dc) {
	    var x = 0.5 + ((db *= db) - (da *= da)) / (2 * dc),
	        y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
	    c.x = ax + x * dx + y * dy;
	    c.y = ay + x * dy - y * dx;
	  } else {
	    c.x = ax + db;
	    c.y = ay;
	  }
	}

	function intersects(a, b) {
	  var dx = b.x - a.x,
	      dy = b.y - a.y,
	      dr = a.r + b.r;
	  return dr * dr > dx * dx + dy * dy;
	}

	function distance2(circle, x, y) {
	  var dx = circle.x - x,
	      dy = circle.y - y;
	  return dx * dx + dy * dy;
	}

	function Node$1(circle) {
	  this._ = circle;
	  this.next = null;
	  this.previous = null;
	}

	function packEnclose(circles) {
	  if (!(n = circles.length)) return 0;

	  var a, b, c, n;

	  // Place the first circle.
	  a = circles[0], a.x = 0, a.y = 0;
	  if (!(n > 1)) return a.r;

	  // Place the second circle.
	  b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
	  if (!(n > 2)) return a.r + b.r;

	  // Place the third circle.
	  place(b, a, c = circles[2]);

	  // Initialize the weighted centroid.
	  var aa = a.r * a.r,
	      ba = b.r * b.r,
	      ca = c.r * c.r,
	      oa = aa + ba + ca,
	      ox = aa * a.x + ba * b.x + ca * c.x,
	      oy = aa * a.y + ba * b.y + ca * c.y,
	      cx, cy, i, j, k, sj, sk;

	  // Initialize the front-chain using the first three circles a, b and c.
	  a = new Node$1(a), b = new Node$1(b), c = new Node$1(c);
	  a.next = c.previous = b;
	  b.next = a.previous = c;
	  c.next = b.previous = a;

	  // Attempt to place each remaining circle…
	  pack: for (i = 3; i < n; ++i) {
	    place(a._, b._, c = circles[i]), c = new Node$1(c);

	    // If there are only three elements in the front-chain…
	    if ((k = a.previous) === (j = b.next)) {
	      // If the new circle intersects the third circle,
	      // rotate the front chain to try the next position.
	      if (intersects(j._, c._)) {
	        a = b, b = j, --i;
	        continue pack;
	      }
	    }

	    // Find the closest intersecting circle on the front-chain, if any.
	    else {
	      sj = j._.r, sk = k._.r;
	      do {
	        if (sj <= sk) {
	          if (intersects(j._, c._)) {
	            b = j, a.next = b, b.previous = a, --i;
	            continue pack;
	          }
	          j = j.next, sj += j._.r;
	        } else {
	          if (intersects(k._, c._)) {
	            a = k, a.next = b, b.previous = a, --i;
	            continue pack;
	          }
	          k = k.previous, sk += k._.r;
	        }
	      } while (j !== k.next);
	    }

	    // Success! Insert the new circle c between a and b.
	    c.previous = a, c.next = b, a.next = b.previous = b = c;

	    // Update the weighted centroid.
	    oa += ca = c._.r * c._.r;
	    ox += ca * c._.x;
	    oy += ca * c._.y;

	    // Compute the new closest circle a to centroid.
	    aa = distance2(a._, cx = ox / oa, cy = oy / oa);
	    while ((c = c.next) !== b) {
	      if ((ca = distance2(c._, cx, cy)) < aa) {
	        a = c, aa = ca;
	      }
	    }
	    b = a.next;
	  }

	  // Compute the enclosing circle of the front chain.
	  a = [b._], c = b; while ((c = c.next) !== b) a.push(c._); c = enclose(a);

	  // Translate the circles to put the enclosing circle around the origin.
	  for (i = 0; i < n; ++i) a = circles[i], a.x -= c.x, a.y -= c.y;

	  return c.r;
	}

	var siblings = function(circles) {
	  packEnclose(circles);
	  return circles;
	};

	function optional(f) {
	  return f == null ? null : required(f);
	}

	function required(f) {
	  if (typeof f !== "function") throw new Error;
	  return f;
	}

	function constantZero() {
	  return 0;
	}

	var constant$6 = function(x) {
	  return function() {
	    return x;
	  };
	};

	function defaultRadius(d) {
	  return Math.sqrt(d.value);
	}

	var index = function() {
	  var radius = null,
	      dx = 1,
	      dy = 1,
	      padding = constantZero;

	  function pack(root) {
	    root.x = dx / 2, root.y = dy / 2;
	    if (radius) {
	      root.eachBefore(radiusLeaf(radius))
	          .eachAfter(packChildren(padding, 0.5))
	          .eachBefore(translateChild(1));
	    } else {
	      root.eachBefore(radiusLeaf(defaultRadius))
	          .eachAfter(packChildren(constantZero, 1))
	          .eachAfter(packChildren(padding, root.r / Math.min(dx, dy)))
	          .eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
	    }
	    return root;
	  }

	  pack.radius = function(x) {
	    return arguments.length ? (radius = optional(x), pack) : radius;
	  };

	  pack.size = function(x) {
	    return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
	  };

	  pack.padding = function(x) {
	    return arguments.length ? (padding = typeof x === "function" ? x : constant$6(+x), pack) : padding;
	  };

	  return pack;
	};

	function radiusLeaf(radius) {
	  return function(node) {
	    if (!node.children) {
	      node.r = Math.max(0, +radius(node) || 0);
	    }
	  };
	}

	function packChildren(padding, k) {
	  return function(node) {
	    if (children = node.children) {
	      var children,
	          i,
	          n = children.length,
	          r = padding(node) * k || 0,
	          e;

	      if (r) for (i = 0; i < n; ++i) children[i].r += r;
	      e = packEnclose(children);
	      if (r) for (i = 0; i < n; ++i) children[i].r -= r;
	      node.r = e + r;
	    }
	  };
	}

	function translateChild(k) {
	  return function(node) {
	    var parent = node.parent;
	    node.r *= k;
	    if (parent) {
	      node.x = parent.x + k * node.x;
	      node.y = parent.y + k * node.y;
	    }
	  };
	}

	var roundNode = function(node) {
	  node.x0 = Math.round(node.x0);
	  node.y0 = Math.round(node.y0);
	  node.x1 = Math.round(node.x1);
	  node.y1 = Math.round(node.y1);
	};

	var treemapDice = function(parent, x0, y0, x1, y1) {
	  var nodes = parent.children,
	      node,
	      i = -1,
	      n = nodes.length,
	      k = parent.value && (x1 - x0) / parent.value;

	  while (++i < n) {
	    node = nodes[i], node.y0 = y0, node.y1 = y1;
	    node.x0 = x0, node.x1 = x0 += node.value * k;
	  }
	};

	var partition = function() {
	  var dx = 1,
	      dy = 1,
	      padding = 0,
	      round = false;

	  function partition(root) {
	    var n = root.height + 1;
	    root.x0 =
	    root.y0 = padding;
	    root.x1 = dx;
	    root.y1 = dy / n;
	    root.eachBefore(positionNode(dy, n));
	    if (round) root.eachBefore(roundNode);
	    return root;
	  }

	  function positionNode(dy, n) {
	    return function(node) {
	      if (node.children) {
	        treemapDice(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
	      }
	      var x0 = node.x0,
	          y0 = node.y0,
	          x1 = node.x1 - padding,
	          y1 = node.y1 - padding;
	      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
	      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
	      node.x0 = x0;
	      node.y0 = y0;
	      node.x1 = x1;
	      node.y1 = y1;
	    };
	  }

	  partition.round = function(x) {
	    return arguments.length ? (round = !!x, partition) : round;
	  };

	  partition.size = function(x) {
	    return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
	  };

	  partition.padding = function(x) {
	    return arguments.length ? (padding = +x, partition) : padding;
	  };

	  return partition;
	};

	var keyPrefix$1 = "$";
	var preroot = {depth: -1};
	var ambiguous = {};

	function defaultId(d) {
	  return d.id;
	}

	function defaultParentId(d) {
	  return d.parentId;
	}

	var stratify = function() {
	  var id = defaultId,
	      parentId = defaultParentId;

	  function stratify(data) {
	    var d,
	        i,
	        n = data.length,
	        root,
	        parent,
	        node,
	        nodes = new Array(n),
	        nodeId,
	        nodeKey,
	        nodeByKey = {};

	    for (i = 0; i < n; ++i) {
	      d = data[i], node = nodes[i] = new Node(d);
	      if ((nodeId = id(d, i, data)) != null && (nodeId += "")) {
	        nodeKey = keyPrefix$1 + (node.id = nodeId);
	        nodeByKey[nodeKey] = nodeKey in nodeByKey ? ambiguous : node;
	      }
	    }

	    for (i = 0; i < n; ++i) {
	      node = nodes[i], nodeId = parentId(data[i], i, data);
	      if (nodeId == null || !(nodeId += "")) {
	        if (root) throw new Error("multiple roots");
	        root = node;
	      } else {
	        parent = nodeByKey[keyPrefix$1 + nodeId];
	        if (!parent) throw new Error("missing: " + nodeId);
	        if (parent === ambiguous) throw new Error("ambiguous: " + nodeId);
	        if (parent.children) parent.children.push(node);
	        else parent.children = [node];
	        node.parent = parent;
	      }
	    }

	    if (!root) throw new Error("no root");
	    root.parent = preroot;
	    root.eachBefore(function(node) { node.depth = node.parent.depth + 1; --n; }).eachBefore(computeHeight);
	    root.parent = null;
	    if (n > 0) throw new Error("cycle");

	    return root;
	  }

	  stratify.id = function(x) {
	    return arguments.length ? (id = required(x), stratify) : id;
	  };

	  stratify.parentId = function(x) {
	    return arguments.length ? (parentId = required(x), stratify) : parentId;
	  };

	  return stratify;
	};

	function defaultSeparation$1(a, b) {
	  return a.parent === b.parent ? 1 : 2;
	}

	// function radialSeparation(a, b) {
	//   return (a.parent === b.parent ? 1 : 2) / a.depth;
	// }

	// This function is used to traverse the left contour of a subtree (or
	// subforest). It returns the successor of v on this contour. This successor is
	// either given by the leftmost child of v or by the thread of v. The function
	// returns null if and only if v is on the highest level of its subtree.
	function nextLeft(v) {
	  var children = v.children;
	  return children ? children[0] : v.t;
	}

	// This function works analogously to nextLeft.
	function nextRight(v) {
	  var children = v.children;
	  return children ? children[children.length - 1] : v.t;
	}

	// Shifts the current subtree rooted at w+. This is done by increasing
	// prelim(w+) and mod(w+) by shift.
	function moveSubtree(wm, wp, shift) {
	  var change = shift / (wp.i - wm.i);
	  wp.c -= change;
	  wp.s += shift;
	  wm.c += change;
	  wp.z += shift;
	  wp.m += shift;
	}

	// All other shifts, applied to the smaller subtrees between w- and w+, are
	// performed by this function. To prepare the shifts, we have to adjust
	// change(w+), shift(w+), and change(w-).
	function executeShifts(v) {
	  var shift = 0,
	      change = 0,
	      children = v.children,
	      i = children.length,
	      w;
	  while (--i >= 0) {
	    w = children[i];
	    w.z += shift;
	    w.m += shift;
	    shift += w.s + (change += w.c);
	  }
	}

	// If vi-’s ancestor is a sibling of v, returns vi-’s ancestor. Otherwise,
	// returns the specified (default) ancestor.
	function nextAncestor(vim, v, ancestor) {
	  return vim.a.parent === v.parent ? vim.a : ancestor;
	}

	function TreeNode(node, i) {
	  this._ = node;
	  this.parent = null;
	  this.children = null;
	  this.A = null; // default ancestor
	  this.a = this; // ancestor
	  this.z = 0; // prelim
	  this.m = 0; // mod
	  this.c = 0; // change
	  this.s = 0; // shift
	  this.t = null; // thread
	  this.i = i; // number
	}

	TreeNode.prototype = Object.create(Node.prototype);

	function treeRoot(root) {
	  var tree = new TreeNode(root, 0),
	      node,
	      nodes = [tree],
	      child,
	      children,
	      i,
	      n;

	  while (node = nodes.pop()) {
	    if (children = node._.children) {
	      node.children = new Array(n = children.length);
	      for (i = n - 1; i >= 0; --i) {
	        nodes.push(child = node.children[i] = new TreeNode(children[i], i));
	        child.parent = node;
	      }
	    }
	  }

	  (tree.parent = new TreeNode(null, 0)).children = [tree];
	  return tree;
	}

	// Node-link tree diagram using the Reingold-Tilford "tidy" algorithm
	var tree = function() {
	  var separation = defaultSeparation$1,
	      dx = 1,
	      dy = 1,
	      nodeSize = null;

	  function tree(root) {
	    var t = treeRoot(root);

	    // Compute the layout using Buchheim et al.’s algorithm.
	    t.eachAfter(firstWalk), t.parent.m = -t.z;
	    t.eachBefore(secondWalk);

	    // If a fixed node size is specified, scale x and y.
	    if (nodeSize) root.eachBefore(sizeNode);

	    // If a fixed tree size is specified, scale x and y based on the extent.
	    // Compute the left-most, right-most, and depth-most nodes for extents.
	    else {
	      var left = root,
	          right = root,
	          bottom = root;
	      root.eachBefore(function(node) {
	        if (node.x < left.x) left = node;
	        if (node.x > right.x) right = node;
	        if (node.depth > bottom.depth) bottom = node;
	      });
	      var s = left === right ? 1 : separation(left, right) / 2,
	          tx = s - left.x,
	          kx = dx / (right.x + s + tx),
	          ky = dy / (bottom.depth || 1);
	      root.eachBefore(function(node) {
	        node.x = (node.x + tx) * kx;
	        node.y = node.depth * ky;
	      });
	    }

	    return root;
	  }

	  // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
	  // applied recursively to the children of v, as well as the function
	  // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
	  // node v is placed to the midpoint of its outermost children.
	  function firstWalk(v) {
	    var children = v.children,
	        siblings = v.parent.children,
	        w = v.i ? siblings[v.i - 1] : null;
	    if (children) {
	      executeShifts(v);
	      var midpoint = (children[0].z + children[children.length - 1].z) / 2;
	      if (w) {
	        v.z = w.z + separation(v._, w._);
	        v.m = v.z - midpoint;
	      } else {
	        v.z = midpoint;
	      }
	    } else if (w) {
	      v.z = w.z + separation(v._, w._);
	    }
	    v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
	  }

	  // Computes all real x-coordinates by summing up the modifiers recursively.
	  function secondWalk(v) {
	    v._.x = v.z + v.parent.m;
	    v.m += v.parent.m;
	  }

	  // The core of the algorithm. Here, a new subtree is combined with the
	  // previous subtrees. Threads are used to traverse the inside and outside
	  // contours of the left and right subtree up to the highest common level. The
	  // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
	  // superscript o means outside and i means inside, the subscript - means left
	  // subtree and + means right subtree. For summing up the modifiers along the
	  // contour, we use respective variables si+, si-, so-, and so+. Whenever two
	  // nodes of the inside contours conflict, we compute the left one of the
	  // greatest uncommon ancestors using the function ANCESTOR and call MOVE
	  // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
	  // Finally, we add a new thread (if necessary).
	  function apportion(v, w, ancestor) {
	    if (w) {
	      var vip = v,
	          vop = v,
	          vim = w,
	          vom = vip.parent.children[0],
	          sip = vip.m,
	          sop = vop.m,
	          sim = vim.m,
	          som = vom.m,
	          shift;
	      while (vim = nextRight(vim), vip = nextLeft(vip), vim && vip) {
	        vom = nextLeft(vom);
	        vop = nextRight(vop);
	        vop.a = v;
	        shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
	        if (shift > 0) {
	          moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
	          sip += shift;
	          sop += shift;
	        }
	        sim += vim.m;
	        sip += vip.m;
	        som += vom.m;
	        sop += vop.m;
	      }
	      if (vim && !nextRight(vop)) {
	        vop.t = vim;
	        vop.m += sim - sop;
	      }
	      if (vip && !nextLeft(vom)) {
	        vom.t = vip;
	        vom.m += sip - som;
	        ancestor = v;
	      }
	    }
	    return ancestor;
	  }

	  function sizeNode(node) {
	    node.x *= dx;
	    node.y = node.depth * dy;
	  }

	  tree.separation = function(x) {
	    return arguments.length ? (separation = x, tree) : separation;
	  };

	  tree.size = function(x) {
	    return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], tree) : (nodeSize ? null : [dx, dy]);
	  };

	  tree.nodeSize = function(x) {
	    return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], tree) : (nodeSize ? [dx, dy] : null);
	  };

	  return tree;
	};

	var treemapSlice = function(parent, x0, y0, x1, y1) {
	  var nodes = parent.children,
	      node,
	      i = -1,
	      n = nodes.length,
	      k = parent.value && (y1 - y0) / parent.value;

	  while (++i < n) {
	    node = nodes[i], node.x0 = x0, node.x1 = x1;
	    node.y0 = y0, node.y1 = y0 += node.value * k;
	  }
	};

	var phi = (1 + Math.sqrt(5)) / 2;

	function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
	  var rows = [],
	      nodes = parent.children,
	      row,
	      nodeValue,
	      i0 = 0,
	      i1 = 0,
	      n = nodes.length,
	      dx, dy,
	      value = parent.value,
	      sumValue,
	      minValue,
	      maxValue,
	      newRatio,
	      minRatio,
	      alpha,
	      beta;

	  while (i0 < n) {
	    dx = x1 - x0, dy = y1 - y0;

	    // Find the next non-empty node.
	    do sumValue = nodes[i1++].value; while (!sumValue && i1 < n);
	    minValue = maxValue = sumValue;
	    alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
	    beta = sumValue * sumValue * alpha;
	    minRatio = Math.max(maxValue / beta, beta / minValue);

	    // Keep adding nodes while the aspect ratio maintains or improves.
	    for (; i1 < n; ++i1) {
	      sumValue += nodeValue = nodes[i1].value;
	      if (nodeValue < minValue) minValue = nodeValue;
	      if (nodeValue > maxValue) maxValue = nodeValue;
	      beta = sumValue * sumValue * alpha;
	      newRatio = Math.max(maxValue / beta, beta / minValue);
	      if (newRatio > minRatio) { sumValue -= nodeValue; break; }
	      minRatio = newRatio;
	    }

	    // Position and record the row orientation.
	    rows.push(row = {value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1)});
	    if (row.dice) treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
	    else treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
	    value -= sumValue, i0 = i1;
	  }

	  return rows;
	}

	var squarify = (function custom(ratio) {

	  function squarify(parent, x0, y0, x1, y1) {
	    squarifyRatio(ratio, parent, x0, y0, x1, y1);
	  }

	  squarify.ratio = function(x) {
	    return custom((x = +x) > 1 ? x : 1);
	  };

	  return squarify;
	})(phi);

	var index$1 = function() {
	  var tile = squarify,
	      round = false,
	      dx = 1,
	      dy = 1,
	      paddingStack = [0],
	      paddingInner = constantZero,
	      paddingTop = constantZero,
	      paddingRight = constantZero,
	      paddingBottom = constantZero,
	      paddingLeft = constantZero;

	  function treemap(root) {
	    root.x0 =
	    root.y0 = 0;
	    root.x1 = dx;
	    root.y1 = dy;
	    root.eachBefore(positionNode);
	    paddingStack = [0];
	    if (round) root.eachBefore(roundNode);
	    return root;
	  }

	  function positionNode(node) {
	    var p = paddingStack[node.depth],
	        x0 = node.x0 + p,
	        y0 = node.y0 + p,
	        x1 = node.x1 - p,
	        y1 = node.y1 - p;
	    if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
	    if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
	    node.x0 = x0;
	    node.y0 = y0;
	    node.x1 = x1;
	    node.y1 = y1;
	    if (node.children) {
	      p = paddingStack[node.depth + 1] = paddingInner(node) / 2;
	      x0 += paddingLeft(node) - p;
	      y0 += paddingTop(node) - p;
	      x1 -= paddingRight(node) - p;
	      y1 -= paddingBottom(node) - p;
	      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
	      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
	      tile(node, x0, y0, x1, y1);
	    }
	  }

	  treemap.round = function(x) {
	    return arguments.length ? (round = !!x, treemap) : round;
	  };

	  treemap.size = function(x) {
	    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
	  };

	  treemap.tile = function(x) {
	    return arguments.length ? (tile = required(x), treemap) : tile;
	  };

	  treemap.padding = function(x) {
	    return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
	  };

	  treemap.paddingInner = function(x) {
	    return arguments.length ? (paddingInner = typeof x === "function" ? x : constant$6(+x), treemap) : paddingInner;
	  };

	  treemap.paddingOuter = function(x) {
	    return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
	  };

	  treemap.paddingTop = function(x) {
	    return arguments.length ? (paddingTop = typeof x === "function" ? x : constant$6(+x), treemap) : paddingTop;
	  };

	  treemap.paddingRight = function(x) {
	    return arguments.length ? (paddingRight = typeof x === "function" ? x : constant$6(+x), treemap) : paddingRight;
	  };

	  treemap.paddingBottom = function(x) {
	    return arguments.length ? (paddingBottom = typeof x === "function" ? x : constant$6(+x), treemap) : paddingBottom;
	  };

	  treemap.paddingLeft = function(x) {
	    return arguments.length ? (paddingLeft = typeof x === "function" ? x : constant$6(+x), treemap) : paddingLeft;
	  };

	  return treemap;
	};

	var binary = function(parent, x0, y0, x1, y1) {
	  var nodes = parent.children,
	      i, n = nodes.length,
	      sum, sums = new Array(n + 1);

	  for (sums[0] = sum = i = 0; i < n; ++i) {
	    sums[i + 1] = sum += nodes[i].value;
	  }

	  partition(0, n, parent.value, x0, y0, x1, y1);

	  function partition(i, j, value, x0, y0, x1, y1) {
	    if (i >= j - 1) {
	      var node = nodes[i];
	      node.x0 = x0, node.y0 = y0;
	      node.x1 = x1, node.y1 = y1;
	      return;
	    }

	    var valueOffset = sums[i],
	        valueTarget = (value / 2) + valueOffset,
	        k = i + 1,
	        hi = j - 1;

	    while (k < hi) {
	      var mid = k + hi >>> 1;
	      if (sums[mid] < valueTarget) k = mid + 1;
	      else hi = mid;
	    }

	    var valueLeft = sums[k] - valueOffset,
	        valueRight = value - valueLeft;

	    if ((y1 - y0) > (x1 - x0)) {
	      var yk = (y0 * valueRight + y1 * valueLeft) / value;
	      partition(i, k, valueLeft, x0, y0, x1, yk);
	      partition(k, j, valueRight, x0, yk, x1, y1);
	    } else {
	      var xk = (x0 * valueRight + x1 * valueLeft) / value;
	      partition(i, k, valueLeft, x0, y0, xk, y1);
	      partition(k, j, valueRight, xk, y0, x1, y1);
	    }
	  }
	};

	var sliceDice = function(parent, x0, y0, x1, y1) {
	  (parent.depth & 1 ? treemapSlice : treemapDice)(parent, x0, y0, x1, y1);
	};

	var resquarify = (function custom(ratio) {

	  function resquarify(parent, x0, y0, x1, y1) {
	    if ((rows = parent._squarify) && (rows.ratio === ratio)) {
	      var rows,
	          row,
	          nodes,
	          i,
	          j = -1,
	          n,
	          m = rows.length,
	          value = parent.value;

	      while (++j < m) {
	        row = rows[j], nodes = row.children;
	        for (i = row.value = 0, n = nodes.length; i < n; ++i) row.value += nodes[i].value;
	        if (row.dice) treemapDice(row, x0, y0, x1, y0 += (y1 - y0) * row.value / value);
	        else treemapSlice(row, x0, y0, x0 += (x1 - x0) * row.value / value, y1);
	        value -= row.value;
	      }
	    } else {
	      parent._squarify = rows = squarifyRatio(ratio, parent, x0, y0, x1, y1);
	      rows.ratio = ratio;
	    }
	  }

	  resquarify.ratio = function(x) {
	    return custom((x = +x) > 1 ? x : 1);
	  };

	  return resquarify;
	})(phi);

	var center$1 = function(x, y) {
	  var nodes;

	  if (x == null) x = 0;
	  if (y == null) y = 0;

	  function force() {
	    var i,
	        n = nodes.length,
	        node,
	        sx = 0,
	        sy = 0;

	    for (i = 0; i < n; ++i) {
	      node = nodes[i], sx += node.x, sy += node.y;
	    }

	    for (sx = sx / n - x, sy = sy / n - y, i = 0; i < n; ++i) {
	      node = nodes[i], node.x -= sx, node.y -= sy;
	    }
	  }

	  force.initialize = function(_) {
	    nodes = _;
	  };

	  force.x = function(_) {
	    return arguments.length ? (x = +_, force) : x;
	  };

	  force.y = function(_) {
	    return arguments.length ? (y = +_, force) : y;
	  };

	  return force;
	};

	var constant$7 = function(x) {
	  return function() {
	    return x;
	  };
	};

	var jiggle = function() {
	  return (Math.random() - 0.5) * 1e-6;
	};

	function x$1(d) {
	  return d.x + d.vx;
	}

	function y$1(d) {
	  return d.y + d.vy;
	}

	var collide = function(radius) {
	  var nodes,
	      radii,
	      strength = 1,
	      iterations = 1;

	  if (typeof radius !== "function") radius = constant$7(radius == null ? 1 : +radius);

	  function force() {
	    var i, n = nodes.length,
	        tree,
	        node,
	        xi,
	        yi,
	        ri,
	        ri2;

	    for (var k = 0; k < iterations; ++k) {
	      tree = quadtree(nodes, x$1, y$1).visitAfter(prepare);
	      for (i = 0; i < n; ++i) {
	        node = nodes[i];
	        ri = radii[node.index], ri2 = ri * ri;
	        xi = node.x + node.vx;
	        yi = node.y + node.vy;
	        tree.visit(apply);
	      }
	    }

	    function apply(quad, x0, y0, x1, y1) {
	      var data = quad.data, rj = quad.r, r = ri + rj;
	      if (data) {
	        if (data.index > node.index) {
	          var x = xi - data.x - data.vx,
	              y = yi - data.y - data.vy,
	              l = x * x + y * y;
	          if (l < r * r) {
	            if (x === 0) x = jiggle(), l += x * x;
	            if (y === 0) y = jiggle(), l += y * y;
	            l = (r - (l = Math.sqrt(l))) / l * strength;
	            node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
	            node.vy += (y *= l) * r;
	            data.vx -= x * (r = 1 - r);
	            data.vy -= y * r;
	          }
	        }
	        return;
	      }
	      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
	    }
	  }

	  function prepare(quad) {
	    if (quad.data) return quad.r = radii[quad.data.index];
	    for (var i = quad.r = 0; i < 4; ++i) {
	      if (quad[i] && quad[i].r > quad.r) {
	        quad.r = quad[i].r;
	      }
	    }
	  }

	  function initialize() {
	    if (!nodes) return;
	    var i, n = nodes.length, node;
	    radii = new Array(n);
	    for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
	  }

	  force.initialize = function(_) {
	    nodes = _;
	    initialize();
	  };

	  force.iterations = function(_) {
	    return arguments.length ? (iterations = +_, force) : iterations;
	  };

	  force.strength = function(_) {
	    return arguments.length ? (strength = +_, force) : strength;
	  };

	  force.radius = function(_) {
	    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$7(+_), initialize(), force) : radius;
	  };

	  return force;
	};

	function index$2(d) {
	  return d.index;
	}

	function find(nodeById, nodeId) {
	  var node = nodeById.get(nodeId);
	  if (!node) throw new Error("missing: " + nodeId);
	  return node;
	}

	var link = function(links) {
	  var id = index$2,
	      strength = defaultStrength,
	      strengths,
	      distance = constant$7(30),
	      distances,
	      nodes,
	      count,
	      bias,
	      iterations = 1;

	  if (links == null) links = [];

	  function defaultStrength(link) {
	    return 1 / Math.min(count[link.source.index], count[link.target.index]);
	  }

	  function force(alpha) {
	    for (var k = 0, n = links.length; k < iterations; ++k) {
	      for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
	        link = links[i], source = link.source, target = link.target;
	        x = target.x + target.vx - source.x - source.vx || jiggle();
	        y = target.y + target.vy - source.y - source.vy || jiggle();
	        l = Math.sqrt(x * x + y * y);
	        l = (l - distances[i]) / l * alpha * strengths[i];
	        x *= l, y *= l;
	        target.vx -= x * (b = bias[i]);
	        target.vy -= y * b;
	        source.vx += x * (b = 1 - b);
	        source.vy += y * b;
	      }
	    }
	  }

	  function initialize() {
	    if (!nodes) return;

	    var i,
	        n = nodes.length,
	        m = links.length,
	        nodeById = map$1(nodes, id),
	        link;

	    for (i = 0, count = new Array(n); i < m; ++i) {
	      link = links[i], link.index = i;
	      if (typeof link.source !== "object") link.source = find(nodeById, link.source);
	      if (typeof link.target !== "object") link.target = find(nodeById, link.target);
	      count[link.source.index] = (count[link.source.index] || 0) + 1;
	      count[link.target.index] = (count[link.target.index] || 0) + 1;
	    }

	    for (i = 0, bias = new Array(m); i < m; ++i) {
	      link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
	    }

	    strengths = new Array(m), initializeStrength();
	    distances = new Array(m), initializeDistance();
	  }

	  function initializeStrength() {
	    if (!nodes) return;

	    for (var i = 0, n = links.length; i < n; ++i) {
	      strengths[i] = +strength(links[i], i, links);
	    }
	  }

	  function initializeDistance() {
	    if (!nodes) return;

	    for (var i = 0, n = links.length; i < n; ++i) {
	      distances[i] = +distance(links[i], i, links);
	    }
	  }

	  force.initialize = function(_) {
	    nodes = _;
	    initialize();
	  };

	  force.links = function(_) {
	    return arguments.length ? (links = _, initialize(), force) : links;
	  };

	  force.id = function(_) {
	    return arguments.length ? (id = _, force) : id;
	  };

	  force.iterations = function(_) {
	    return arguments.length ? (iterations = +_, force) : iterations;
	  };

	  force.strength = function(_) {
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$7(+_), initializeStrength(), force) : strength;
	  };

	  force.distance = function(_) {
	    return arguments.length ? (distance = typeof _ === "function" ? _ : constant$7(+_), initializeDistance(), force) : distance;
	  };

	  return force;
	};

	function x$2(d) {
	  return d.x;
	}

	function y$2(d) {
	  return d.y;
	}

	var initialRadius = 10;
	var initialAngle = Math.PI * (3 - Math.sqrt(5));

	var simulation = function(nodes) {
	  var simulation,
	      alpha = 1,
	      alphaMin = 0.001,
	      alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
	      alphaTarget = 0,
	      velocityDecay = 0.6,
	      forces = map$1(),
	      stepper = timer(step),
	      event = dispatch("tick", "end");

	  if (nodes == null) nodes = [];

	  function step() {
	    tick();
	    event.call("tick", simulation);
	    if (alpha < alphaMin) {
	      stepper.stop();
	      event.call("end", simulation);
	    }
	  }

	  function tick() {
	    var i, n = nodes.length, node;

	    alpha += (alphaTarget - alpha) * alphaDecay;

	    forces.each(function(force) {
	      force(alpha);
	    });

	    for (i = 0; i < n; ++i) {
	      node = nodes[i];
	      if (node.fx == null) node.x += node.vx *= velocityDecay;
	      else node.x = node.fx, node.vx = 0;
	      if (node.fy == null) node.y += node.vy *= velocityDecay;
	      else node.y = node.fy, node.vy = 0;
	    }
	  }

	  function initializeNodes() {
	    for (var i = 0, n = nodes.length, node; i < n; ++i) {
	      node = nodes[i], node.index = i;
	      if (isNaN(node.x) || isNaN(node.y)) {
	        var radius = initialRadius * Math.sqrt(i), angle = i * initialAngle;
	        node.x = radius * Math.cos(angle);
	        node.y = radius * Math.sin(angle);
	      }
	      if (isNaN(node.vx) || isNaN(node.vy)) {
	        node.vx = node.vy = 0;
	      }
	    }
	  }

	  function initializeForce(force) {
	    if (force.initialize) force.initialize(nodes);
	    return force;
	  }

	  initializeNodes();

	  return simulation = {
	    tick: tick,

	    restart: function() {
	      return stepper.restart(step), simulation;
	    },

	    stop: function() {
	      return stepper.stop(), simulation;
	    },

	    nodes: function(_) {
	      return arguments.length ? (nodes = _, initializeNodes(), forces.each(initializeForce), simulation) : nodes;
	    },

	    alpha: function(_) {
	      return arguments.length ? (alpha = +_, simulation) : alpha;
	    },

	    alphaMin: function(_) {
	      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
	    },

	    alphaDecay: function(_) {
	      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
	    },

	    alphaTarget: function(_) {
	      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
	    },

	    velocityDecay: function(_) {
	      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
	    },

	    force: function(name, _) {
	      return arguments.length > 1 ? ((_ == null ? forces.remove(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
	    },

	    find: function(x, y, radius) {
	      var i = 0,
	          n = nodes.length,
	          dx,
	          dy,
	          d2,
	          node,
	          closest;

	      if (radius == null) radius = Infinity;
	      else radius *= radius;

	      for (i = 0; i < n; ++i) {
	        node = nodes[i];
	        dx = x - node.x;
	        dy = y - node.y;
	        d2 = dx * dx + dy * dy;
	        if (d2 < radius) closest = node, radius = d2;
	      }

	      return closest;
	    },

	    on: function(name, _) {
	      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
	    }
	  };
	};

	var manyBody = function() {
	  var nodes,
	      node,
	      alpha,
	      strength = constant$7(-30),
	      strengths,
	      distanceMin2 = 1,
	      distanceMax2 = Infinity,
	      theta2 = 0.81;

	  function force(_) {
	    var i, n = nodes.length, tree = quadtree(nodes, x$2, y$2).visitAfter(accumulate);
	    for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
	  }

	  function initialize() {
	    if (!nodes) return;
	    var i, n = nodes.length, node;
	    strengths = new Array(n);
	    for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
	  }

	  function accumulate(quad) {
	    var strength = 0, q, c, x$$1, y$$1, i;

	    // For internal nodes, accumulate forces from child quadrants.
	    if (quad.length) {
	      for (x$$1 = y$$1 = i = 0; i < 4; ++i) {
	        if ((q = quad[i]) && (c = q.value)) {
	          strength += c, x$$1 += c * q.x, y$$1 += c * q.y;
	        }
	      }
	      quad.x = x$$1 / strength;
	      quad.y = y$$1 / strength;
	    }

	    // For leaf nodes, accumulate forces from coincident quadrants.
	    else {
	      q = quad;
	      q.x = q.data.x;
	      q.y = q.data.y;
	      do strength += strengths[q.data.index];
	      while (q = q.next);
	    }

	    quad.value = strength;
	  }

	  function apply(quad, x1, _, x2) {
	    if (!quad.value) return true;

	    var x$$1 = quad.x - node.x,
	        y$$1 = quad.y - node.y,
	        w = x2 - x1,
	        l = x$$1 * x$$1 + y$$1 * y$$1;

	    // Apply the Barnes-Hut approximation if possible.
	    // Limit forces for very close nodes; randomize direction if coincident.
	    if (w * w / theta2 < l) {
	      if (l < distanceMax2) {
	        if (x$$1 === 0) x$$1 = jiggle(), l += x$$1 * x$$1;
	        if (y$$1 === 0) y$$1 = jiggle(), l += y$$1 * y$$1;
	        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
	        node.vx += x$$1 * quad.value * alpha / l;
	        node.vy += y$$1 * quad.value * alpha / l;
	      }
	      return true;
	    }

	    // Otherwise, process points directly.
	    else if (quad.length || l >= distanceMax2) return;

	    // Limit forces for very close nodes; randomize direction if coincident.
	    if (quad.data !== node || quad.next) {
	      if (x$$1 === 0) x$$1 = jiggle(), l += x$$1 * x$$1;
	      if (y$$1 === 0) y$$1 = jiggle(), l += y$$1 * y$$1;
	      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
	    }

	    do if (quad.data !== node) {
	      w = strengths[quad.data.index] * alpha / l;
	      node.vx += x$$1 * w;
	      node.vy += y$$1 * w;
	    } while (quad = quad.next);
	  }

	  force.initialize = function(_) {
	    nodes = _;
	    initialize();
	  };

	  force.strength = function(_) {
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$7(+_), initialize(), force) : strength;
	  };

	  force.distanceMin = function(_) {
	    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
	  };

	  force.distanceMax = function(_) {
	    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
	  };

	  force.theta = function(_) {
	    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
	  };

	  return force;
	};

	var x$3 = function(x) {
	  var strength = constant$7(0.1),
	      nodes,
	      strengths,
	      xz;

	  if (typeof x !== "function") x = constant$7(x == null ? 0 : +x);

	  function force(alpha) {
	    for (var i = 0, n = nodes.length, node; i < n; ++i) {
	      node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
	    }
	  }

	  function initialize() {
	    if (!nodes) return;
	    var i, n = nodes.length;
	    strengths = new Array(n);
	    xz = new Array(n);
	    for (i = 0; i < n; ++i) {
	      strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
	    }
	  }

	  force.initialize = function(_) {
	    nodes = _;
	    initialize();
	  };

	  force.strength = function(_) {
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$7(+_), initialize(), force) : strength;
	  };

	  force.x = function(_) {
	    return arguments.length ? (x = typeof _ === "function" ? _ : constant$7(+_), initialize(), force) : x;
	  };

	  return force;
	};

	var y$3 = function(y) {
	  var strength = constant$7(0.1),
	      nodes,
	      strengths,
	      yz;

	  if (typeof y !== "function") y = constant$7(y == null ? 0 : +y);

	  function force(alpha) {
	    for (var i = 0, n = nodes.length, node; i < n; ++i) {
	      node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
	    }
	  }

	  function initialize() {
	    if (!nodes) return;
	    var i, n = nodes.length;
	    strengths = new Array(n);
	    yz = new Array(n);
	    for (i = 0; i < n; ++i) {
	      strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
	    }
	  }

	  force.initialize = function(_) {
	    nodes = _;
	    initialize();
	  };

	  force.strength = function(_) {
	    return arguments.length ? (strength = typeof _ === "function" ? _ : constant$7(+_), initialize(), force) : strength;
	  };

	  force.y = function(_) {
	    return arguments.length ? (y = typeof _ === "function" ? _ : constant$7(+_), initialize(), force) : y;
	  };

	  return force;
	};

	function nopropagation() {
	  exports.event.stopImmediatePropagation();
	}

	var noevent = function() {
	  exports.event.preventDefault();
	  exports.event.stopImmediatePropagation();
	};

	var dragDisable = function(view) {
	  var root = view.document.documentElement,
	      selection$$1 = select(view).on("dragstart.drag", noevent, true);
	  if ("onselectstart" in root) {
	    selection$$1.on("selectstart.drag", noevent, true);
	  } else {
	    root.__noselect = root.style.MozUserSelect;
	    root.style.MozUserSelect = "none";
	  }
	};

	function yesdrag(view, noclick) {
	  var root = view.document.documentElement,
	      selection$$1 = select(view).on("dragstart.drag", null);
	  if (noclick) {
	    selection$$1.on("click.drag", noevent, true);
	    setTimeout(function() { selection$$1.on("click.drag", null); }, 0);
	  }
	  if ("onselectstart" in root) {
	    selection$$1.on("selectstart.drag", null);
	  } else {
	    root.style.MozUserSelect = root.__noselect;
	    delete root.__noselect;
	  }
	}

	var constant$8 = function(x) {
	  return function() {
	    return x;
	  };
	};

	function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
	  this.target = target;
	  this.type = type;
	  this.subject = subject;
	  this.identifier = id;
	  this.active = active;
	  this.x = x;
	  this.y = y;
	  this.dx = dx;
	  this.dy = dy;
	  this._ = dispatch;
	}

	DragEvent.prototype.on = function() {
	  var value = this._.on.apply(this._, arguments);
	  return value === this._ ? this : value;
	};

	// Ignore right-click, since that should open the context menu.
	function defaultFilter() {
	  return !exports.event.button;
	}

	function defaultContainer() {
	  return this.parentNode;
	}

	function defaultSubject(d) {
	  return d == null ? {x: exports.event.x, y: exports.event.y} : d;
	}

	var drag = function() {
	  var filter = defaultFilter,
	      container = defaultContainer,
	      subject = defaultSubject,
	      gestures = {},
	      listeners = dispatch("start", "drag", "end"),
	      active = 0,
	      mousemoving,
	      touchending;

	  function drag(selection$$1) {
	    selection$$1
	        .on("mousedown.drag", mousedowned)
	        .on("touchstart.drag", touchstarted)
	        .on("touchmove.drag", touchmoved)
	        .on("touchend.drag touchcancel.drag", touchended)
	        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	  }

	  function mousedowned() {
	    if (touchending || !filter.apply(this, arguments)) return;
	    var gesture = beforestart("mouse", container.apply(this, arguments), mouse, this, arguments);
	    if (!gesture) return;
	    select(exports.event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
	    dragDisable(exports.event.view);
	    nopropagation();
	    mousemoving = false;
	    gesture("start");
	  }

	  function mousemoved() {
	    noevent();
	    mousemoving = true;
	    gestures.mouse("drag");
	  }

	  function mouseupped() {
	    select(exports.event.view).on("mousemove.drag mouseup.drag", null);
	    yesdrag(exports.event.view, mousemoving);
	    noevent();
	    gestures.mouse("end");
	  }

	  function touchstarted() {
	    if (!filter.apply(this, arguments)) return;
	    var touches$$1 = exports.event.changedTouches,
	        c = container.apply(this, arguments),
	        n = touches$$1.length, i, gesture;

	    for (i = 0; i < n; ++i) {
	      if (gesture = beforestart(touches$$1[i].identifier, c, touch, this, arguments)) {
	        nopropagation();
	        gesture("start");
	      }
	    }
	  }

	  function touchmoved() {
	    var touches$$1 = exports.event.changedTouches,
	        n = touches$$1.length, i, gesture;

	    for (i = 0; i < n; ++i) {
	      if (gesture = gestures[touches$$1[i].identifier]) {
	        noevent();
	        gesture("drag");
	      }
	    }
	  }

	  function touchended() {
	    var touches$$1 = exports.event.changedTouches,
	        n = touches$$1.length, i, gesture;

	    if (touchending) clearTimeout(touchending);
	    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
	    for (i = 0; i < n; ++i) {
	      if (gesture = gestures[touches$$1[i].identifier]) {
	        nopropagation();
	        gesture("end");
	      }
	    }
	  }

	  function beforestart(id, container, point, that, args) {
	    var p = point(container, id), s, dx, dy,
	        sublisteners = listeners.copy();

	    if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
	      if ((exports.event.subject = s = subject.apply(that, args)) == null) return false;
	      dx = s.x - p[0] || 0;
	      dy = s.y - p[1] || 0;
	      return true;
	    })) return;

	    return function gesture(type) {
	      var p0 = p, n;
	      switch (type) {
	        case "start": gestures[id] = gesture, n = active++; break;
	        case "end": delete gestures[id], --active; // nobreak
	        case "drag": p = point(container, id), n = active; break;
	      }
	      customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
	    };
	  }

	  drag.filter = function(_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$8(!!_), drag) : filter;
	  };

	  drag.container = function(_) {
	    return arguments.length ? (container = typeof _ === "function" ? _ : constant$8(_), drag) : container;
	  };

	  drag.subject = function(_) {
	    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$8(_), drag) : subject;
	  };

	  drag.on = function() {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? drag : value;
	  };

	  return drag;
	};

	var constant$9 = function(x) {
	  return function() {
	    return x;
	  };
	};

	function x$4(d) {
	  return d[0];
	}

	function y$4(d) {
	  return d[1];
	}

	function RedBlackTree() {
	  this._ = null; // root node
	}

	function RedBlackNode(node) {
	  node.U = // parent node
	  node.C = // color - true for red, false for black
	  node.L = // left node
	  node.R = // right node
	  node.P = // previous node
	  node.N = null; // next node
	}

	RedBlackTree.prototype = {
	  constructor: RedBlackTree,

	  insert: function(after, node) {
	    var parent, grandpa, uncle;

	    if (after) {
	      node.P = after;
	      node.N = after.N;
	      if (after.N) after.N.P = node;
	      after.N = node;
	      if (after.R) {
	        after = after.R;
	        while (after.L) after = after.L;
	        after.L = node;
	      } else {
	        after.R = node;
	      }
	      parent = after;
	    } else if (this._) {
	      after = RedBlackFirst(this._);
	      node.P = null;
	      node.N = after;
	      after.P = after.L = node;
	      parent = after;
	    } else {
	      node.P = node.N = null;
	      this._ = node;
	      parent = null;
	    }
	    node.L = node.R = null;
	    node.U = parent;
	    node.C = true;

	    after = node;
	    while (parent && parent.C) {
	      grandpa = parent.U;
	      if (parent === grandpa.L) {
	        uncle = grandpa.R;
	        if (uncle && uncle.C) {
	          parent.C = uncle.C = false;
	          grandpa.C = true;
	          after = grandpa;
	        } else {
	          if (after === parent.R) {
	            RedBlackRotateLeft(this, parent);
	            after = parent;
	            parent = after.U;
	          }
	          parent.C = false;
	          grandpa.C = true;
	          RedBlackRotateRight(this, grandpa);
	        }
	      } else {
	        uncle = grandpa.L;
	        if (uncle && uncle.C) {
	          parent.C = uncle.C = false;
	          grandpa.C = true;
	          after = grandpa;
	        } else {
	          if (after === parent.L) {
	            RedBlackRotateRight(this, parent);
	            after = parent;
	            parent = after.U;
	          }
	          parent.C = false;
	          grandpa.C = true;
	          RedBlackRotateLeft(this, grandpa);
	        }
	      }
	      parent = after.U;
	    }
	    this._.C = false;
	  },

	  remove: function(node) {
	    if (node.N) node.N.P = node.P;
	    if (node.P) node.P.N = node.N;
	    node.N = node.P = null;

	    var parent = node.U,
	        sibling,
	        left = node.L,
	        right = node.R,
	        next,
	        red;

	    if (!left) next = right;
	    else if (!right) next = left;
	    else next = RedBlackFirst(right);

	    if (parent) {
	      if (parent.L === node) parent.L = next;
	      else parent.R = next;
	    } else {
	      this._ = next;
	    }

	    if (left && right) {
	      red = next.C;
	      next.C = node.C;
	      next.L = left;
	      left.U = next;
	      if (next !== right) {
	        parent = next.U;
	        next.U = node.U;
	        node = next.R;
	        parent.L = node;
	        next.R = right;
	        right.U = next;
	      } else {
	        next.U = parent;
	        parent = next;
	        node = next.R;
	      }
	    } else {
	      red = node.C;
	      node = next;
	    }

	    if (node) node.U = parent;
	    if (red) return;
	    if (node && node.C) { node.C = false; return; }

	    do {
	      if (node === this._) break;
	      if (node === parent.L) {
	        sibling = parent.R;
	        if (sibling.C) {
	          sibling.C = false;
	          parent.C = true;
	          RedBlackRotateLeft(this, parent);
	          sibling = parent.R;
	        }
	        if ((sibling.L && sibling.L.C)
	            || (sibling.R && sibling.R.C)) {
	          if (!sibling.R || !sibling.R.C) {
	            sibling.L.C = false;
	            sibling.C = true;
	            RedBlackRotateRight(this, sibling);
	            sibling = parent.R;
	          }
	          sibling.C = parent.C;
	          parent.C = sibling.R.C = false;
	          RedBlackRotateLeft(this, parent);
	          node = this._;
	          break;
	        }
	      } else {
	        sibling = parent.L;
	        if (sibling.C) {
	          sibling.C = false;
	          parent.C = true;
	          RedBlackRotateRight(this, parent);
	          sibling = parent.L;
	        }
	        if ((sibling.L && sibling.L.C)
	          || (sibling.R && sibling.R.C)) {
	          if (!sibling.L || !sibling.L.C) {
	            sibling.R.C = false;
	            sibling.C = true;
	            RedBlackRotateLeft(this, sibling);
	            sibling = parent.L;
	          }
	          sibling.C = parent.C;
	          parent.C = sibling.L.C = false;
	          RedBlackRotateRight(this, parent);
	          node = this._;
	          break;
	        }
	      }
	      sibling.C = true;
	      node = parent;
	      parent = parent.U;
	    } while (!node.C);

	    if (node) node.C = false;
	  }
	};

	function RedBlackRotateLeft(tree, node) {
	  var p = node,
	      q = node.R,
	      parent = p.U;

	  if (parent) {
	    if (parent.L === p) parent.L = q;
	    else parent.R = q;
	  } else {
	    tree._ = q;
	  }

	  q.U = parent;
	  p.U = q;
	  p.R = q.L;
	  if (p.R) p.R.U = p;
	  q.L = p;
	}

	function RedBlackRotateRight(tree, node) {
	  var p = node,
	      q = node.L,
	      parent = p.U;

	  if (parent) {
	    if (parent.L === p) parent.L = q;
	    else parent.R = q;
	  } else {
	    tree._ = q;
	  }

	  q.U = parent;
	  p.U = q;
	  p.L = q.R;
	  if (p.L) p.L.U = p;
	  q.R = p;
	}

	function RedBlackFirst(node) {
	  while (node.L) node = node.L;
	  return node;
	}

	function createEdge(left, right, v0, v1) {
	  var edge = [null, null],
	      index = edges.push(edge) - 1;
	  edge.left = left;
	  edge.right = right;
	  if (v0) setEdgeEnd(edge, left, right, v0);
	  if (v1) setEdgeEnd(edge, right, left, v1);
	  cells[left.index].halfedges.push(index);
	  cells[right.index].halfedges.push(index);
	  return edge;
	}

	function createBorderEdge(left, v0, v1) {
	  var edge = [v0, v1];
	  edge.left = left;
	  return edge;
	}

	function setEdgeEnd(edge, left, right, vertex) {
	  if (!edge[0] && !edge[1]) {
	    edge[0] = vertex;
	    edge.left = left;
	    edge.right = right;
	  } else if (edge.left === right) {
	    edge[1] = vertex;
	  } else {
	    edge[0] = vertex;
	  }
	}

	// Liang–Barsky line clipping.
	function clipEdge(edge, x0, y0, x1, y1) {
	  var a = edge[0],
	      b = edge[1],
	      ax = a[0],
	      ay = a[1],
	      bx = b[0],
	      by = b[1],
	      t0 = 0,
	      t1 = 1,
	      dx = bx - ax,
	      dy = by - ay,
	      r;

	  r = x0 - ax;
	  if (!dx && r > 0) return;
	  r /= dx;
	  if (dx < 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  } else if (dx > 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  }

	  r = x1 - ax;
	  if (!dx && r < 0) return;
	  r /= dx;
	  if (dx < 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  } else if (dx > 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  }

	  r = y0 - ay;
	  if (!dy && r > 0) return;
	  r /= dy;
	  if (dy < 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  } else if (dy > 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  }

	  r = y1 - ay;
	  if (!dy && r < 0) return;
	  r /= dy;
	  if (dy < 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  } else if (dy > 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  }

	  if (!(t0 > 0) && !(t1 < 1)) return true; // TODO Better check?

	  if (t0 > 0) edge[0] = [ax + t0 * dx, ay + t0 * dy];
	  if (t1 < 1) edge[1] = [ax + t1 * dx, ay + t1 * dy];
	  return true;
	}

	function connectEdge(edge, x0, y0, x1, y1) {
	  var v1 = edge[1];
	  if (v1) return true;

	  var v0 = edge[0],
	      left = edge.left,
	      right = edge.right,
	      lx = left[0],
	      ly = left[1],
	      rx = right[0],
	      ry = right[1],
	      fx = (lx + rx) / 2,
	      fy = (ly + ry) / 2,
	      fm,
	      fb;

	  if (ry === ly) {
	    if (fx < x0 || fx >= x1) return;
	    if (lx > rx) {
	      if (!v0) v0 = [fx, y0];
	      else if (v0[1] >= y1) return;
	      v1 = [fx, y1];
	    } else {
	      if (!v0) v0 = [fx, y1];
	      else if (v0[1] < y0) return;
	      v1 = [fx, y0];
	    }
	  } else {
	    fm = (lx - rx) / (ry - ly);
	    fb = fy - fm * fx;
	    if (fm < -1 || fm > 1) {
	      if (lx > rx) {
	        if (!v0) v0 = [(y0 - fb) / fm, y0];
	        else if (v0[1] >= y1) return;
	        v1 = [(y1 - fb) / fm, y1];
	      } else {
	        if (!v0) v0 = [(y1 - fb) / fm, y1];
	        else if (v0[1] < y0) return;
	        v1 = [(y0 - fb) / fm, y0];
	      }
	    } else {
	      if (ly < ry) {
	        if (!v0) v0 = [x0, fm * x0 + fb];
	        else if (v0[0] >= x1) return;
	        v1 = [x1, fm * x1 + fb];
	      } else {
	        if (!v0) v0 = [x1, fm * x1 + fb];
	        else if (v0[0] < x0) return;
	        v1 = [x0, fm * x0 + fb];
	      }
	    }
	  }

	  edge[0] = v0;
	  edge[1] = v1;
	  return true;
	}

	function clipEdges(x0, y0, x1, y1) {
	  var i = edges.length,
	      edge;

	  while (i--) {
	    if (!connectEdge(edge = edges[i], x0, y0, x1, y1)
	        || !clipEdge(edge, x0, y0, x1, y1)
	        || !(Math.abs(edge[0][0] - edge[1][0]) > epsilon$3
	            || Math.abs(edge[0][1] - edge[1][1]) > epsilon$3)) {
	      delete edges[i];
	    }
	  }
	}

	function createCell(site) {
	  return cells[site.index] = {
	    site: site,
	    halfedges: []
	  };
	}

	function cellHalfedgeAngle(cell, edge) {
	  var site = cell.site,
	      va = edge.left,
	      vb = edge.right;
	  if (site === vb) vb = va, va = site;
	  if (vb) return Math.atan2(vb[1] - va[1], vb[0] - va[0]);
	  if (site === va) va = edge[1], vb = edge[0];
	  else va = edge[0], vb = edge[1];
	  return Math.atan2(va[0] - vb[0], vb[1] - va[1]);
	}

	function cellHalfedgeStart(cell, edge) {
	  return edge[+(edge.left !== cell.site)];
	}

	function cellHalfedgeEnd(cell, edge) {
	  return edge[+(edge.left === cell.site)];
	}

	function sortCellHalfedges() {
	  for (var i = 0, n = cells.length, cell, halfedges, j, m; i < n; ++i) {
	    if ((cell = cells[i]) && (m = (halfedges = cell.halfedges).length)) {
	      var index = new Array(m),
	          array = new Array(m);
	      for (j = 0; j < m; ++j) index[j] = j, array[j] = cellHalfedgeAngle(cell, edges[halfedges[j]]);
	      index.sort(function(i, j) { return array[j] - array[i]; });
	      for (j = 0; j < m; ++j) array[j] = halfedges[index[j]];
	      for (j = 0; j < m; ++j) halfedges[j] = array[j];
	    }
	  }
	}

	function clipCells(x0, y0, x1, y1) {
	  var nCells = cells.length,
	      iCell,
	      cell,
	      site,
	      iHalfedge,
	      halfedges,
	      nHalfedges,
	      start,
	      startX,
	      startY,
	      end,
	      endX,
	      endY,
	      cover = true;

	  for (iCell = 0; iCell < nCells; ++iCell) {
	    if (cell = cells[iCell]) {
	      site = cell.site;
	      halfedges = cell.halfedges;
	      iHalfedge = halfedges.length;

	      // Remove any dangling clipped edges.
	      while (iHalfedge--) {
	        if (!edges[halfedges[iHalfedge]]) {
	          halfedges.splice(iHalfedge, 1);
	        }
	      }

	      // Insert any border edges as necessary.
	      iHalfedge = 0, nHalfedges = halfedges.length;
	      while (iHalfedge < nHalfedges) {
	        end = cellHalfedgeEnd(cell, edges[halfedges[iHalfedge]]), endX = end[0], endY = end[1];
	        start = cellHalfedgeStart(cell, edges[halfedges[++iHalfedge % nHalfedges]]), startX = start[0], startY = start[1];
	        if (Math.abs(endX - startX) > epsilon$3 || Math.abs(endY - startY) > epsilon$3) {
	          halfedges.splice(iHalfedge, 0, edges.push(createBorderEdge(site, end,
	              Math.abs(endX - x0) < epsilon$3 && y1 - endY > epsilon$3 ? [x0, Math.abs(startX - x0) < epsilon$3 ? startY : y1]
	              : Math.abs(endY - y1) < epsilon$3 && x1 - endX > epsilon$3 ? [Math.abs(startY - y1) < epsilon$3 ? startX : x1, y1]
	              : Math.abs(endX - x1) < epsilon$3 && endY - y0 > epsilon$3 ? [x1, Math.abs(startX - x1) < epsilon$3 ? startY : y0]
	              : Math.abs(endY - y0) < epsilon$3 && endX - x0 > epsilon$3 ? [Math.abs(startY - y0) < epsilon$3 ? startX : x0, y0]
	              : null)) - 1);
	          ++nHalfedges;
	        }
	      }

	      if (nHalfedges) cover = false;
	    }
	  }

	  // If there weren’t any edges, have the closest site cover the extent.
	  // It doesn’t matter which corner of the extent we measure!
	  if (cover) {
	    var dx, dy, d2, dc = Infinity;

	    for (iCell = 0, cover = null; iCell < nCells; ++iCell) {
	      if (cell = cells[iCell]) {
	        site = cell.site;
	        dx = site[0] - x0;
	        dy = site[1] - y0;
	        d2 = dx * dx + dy * dy;
	        if (d2 < dc) dc = d2, cover = cell;
	      }
	    }

	    if (cover) {
	      var v00 = [x0, y0], v01 = [x0, y1], v11 = [x1, y1], v10 = [x1, y0];
	      cover.halfedges.push(
	        edges.push(createBorderEdge(site = cover.site, v00, v01)) - 1,
	        edges.push(createBorderEdge(site, v01, v11)) - 1,
	        edges.push(createBorderEdge(site, v11, v10)) - 1,
	        edges.push(createBorderEdge(site, v10, v00)) - 1
	      );
	    }
	  }

	  // Lastly delete any cells with no edges; these were entirely clipped.
	  for (iCell = 0; iCell < nCells; ++iCell) {
	    if (cell = cells[iCell]) {
	      if (!cell.halfedges.length) {
	        delete cells[iCell];
	      }
	    }
	  }
	}

	var circlePool = [];

	var firstCircle;

	function Circle() {
	  RedBlackNode(this);
	  this.x =
	  this.y =
	  this.arc =
	  this.site =
	  this.cy = null;
	}

	function attachCircle(arc) {
	  var lArc = arc.P,
	      rArc = arc.N;

	  if (!lArc || !rArc) return;

	  var lSite = lArc.site,
	      cSite = arc.site,
	      rSite = rArc.site;

	  if (lSite === rSite) return;

	  var bx = cSite[0],
	      by = cSite[1],
	      ax = lSite[0] - bx,
	      ay = lSite[1] - by,
	      cx = rSite[0] - bx,
	      cy = rSite[1] - by;

	  var d = 2 * (ax * cy - ay * cx);
	  if (d >= -epsilon2$1) return;

	  var ha = ax * ax + ay * ay,
	      hc = cx * cx + cy * cy,
	      x = (cy * ha - ay * hc) / d,
	      y = (ax * hc - cx * ha) / d;

	  var circle = circlePool.pop() || new Circle;
	  circle.arc = arc;
	  circle.site = cSite;
	  circle.x = x + bx;
	  circle.y = (circle.cy = y + by) + Math.sqrt(x * x + y * y); // y bottom

	  arc.circle = circle;

	  var before = null,
	      node = circles._;

	  while (node) {
	    if (circle.y < node.y || (circle.y === node.y && circle.x <= node.x)) {
	      if (node.L) node = node.L;
	      else { before = node.P; break; }
	    } else {
	      if (node.R) node = node.R;
	      else { before = node; break; }
	    }
	  }

	  circles.insert(before, circle);
	  if (!before) firstCircle = circle;
	}

	function detachCircle(arc) {
	  var circle = arc.circle;
	  if (circle) {
	    if (!circle.P) firstCircle = circle.N;
	    circles.remove(circle);
	    circlePool.push(circle);
	    RedBlackNode(circle);
	    arc.circle = null;
	  }
	}

	var beachPool = [];

	function Beach() {
	  RedBlackNode(this);
	  this.edge =
	  this.site =
	  this.circle = null;
	}

	function createBeach(site) {
	  var beach = beachPool.pop() || new Beach;
	  beach.site = site;
	  return beach;
	}

	function detachBeach(beach) {
	  detachCircle(beach);
	  beaches.remove(beach);
	  beachPool.push(beach);
	  RedBlackNode(beach);
	}

	function removeBeach(beach) {
	  var circle = beach.circle,
	      x = circle.x,
	      y = circle.cy,
	      vertex = [x, y],
	      previous = beach.P,
	      next = beach.N,
	      disappearing = [beach];

	  detachBeach(beach);

	  var lArc = previous;
	  while (lArc.circle
	      && Math.abs(x - lArc.circle.x) < epsilon$3
	      && Math.abs(y - lArc.circle.cy) < epsilon$3) {
	    previous = lArc.P;
	    disappearing.unshift(lArc);
	    detachBeach(lArc);
	    lArc = previous;
	  }

	  disappearing.unshift(lArc);
	  detachCircle(lArc);

	  var rArc = next;
	  while (rArc.circle
	      && Math.abs(x - rArc.circle.x) < epsilon$3
	      && Math.abs(y - rArc.circle.cy) < epsilon$3) {
	    next = rArc.N;
	    disappearing.push(rArc);
	    detachBeach(rArc);
	    rArc = next;
	  }

	  disappearing.push(rArc);
	  detachCircle(rArc);

	  var nArcs = disappearing.length,
	      iArc;
	  for (iArc = 1; iArc < nArcs; ++iArc) {
	    rArc = disappearing[iArc];
	    lArc = disappearing[iArc - 1];
	    setEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
	  }

	  lArc = disappearing[0];
	  rArc = disappearing[nArcs - 1];
	  rArc.edge = createEdge(lArc.site, rArc.site, null, vertex);

	  attachCircle(lArc);
	  attachCircle(rArc);
	}

	function addBeach(site) {
	  var x = site[0],
	      directrix = site[1],
	      lArc,
	      rArc,
	      dxl,
	      dxr,
	      node = beaches._;

	  while (node) {
	    dxl = leftBreakPoint(node, directrix) - x;
	    if (dxl > epsilon$3) node = node.L; else {
	      dxr = x - rightBreakPoint(node, directrix);
	      if (dxr > epsilon$3) {
	        if (!node.R) {
	          lArc = node;
	          break;
	        }
	        node = node.R;
	      } else {
	        if (dxl > -epsilon$3) {
	          lArc = node.P;
	          rArc = node;
	        } else if (dxr > -epsilon$3) {
	          lArc = node;
	          rArc = node.N;
	        } else {
	          lArc = rArc = node;
	        }
	        break;
	      }
	    }
	  }

	  createCell(site);
	  var newArc = createBeach(site);
	  beaches.insert(lArc, newArc);

	  if (!lArc && !rArc) return;

	  if (lArc === rArc) {
	    detachCircle(lArc);
	    rArc = createBeach(lArc.site);
	    beaches.insert(newArc, rArc);
	    newArc.edge = rArc.edge = createEdge(lArc.site, newArc.site);
	    attachCircle(lArc);
	    attachCircle(rArc);
	    return;
	  }

	  if (!rArc) { // && lArc
	    newArc.edge = createEdge(lArc.site, newArc.site);
	    return;
	  }

	  // else lArc !== rArc
	  detachCircle(lArc);
	  detachCircle(rArc);

	  var lSite = lArc.site,
	      ax = lSite[0],
	      ay = lSite[1],
	      bx = site[0] - ax,
	      by = site[1] - ay,
	      rSite = rArc.site,
	      cx = rSite[0] - ax,
	      cy = rSite[1] - ay,
	      d = 2 * (bx * cy - by * cx),
	      hb = bx * bx + by * by,
	      hc = cx * cx + cy * cy,
	      vertex = [(cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay];

	  setEdgeEnd(rArc.edge, lSite, rSite, vertex);
	  newArc.edge = createEdge(lSite, site, null, vertex);
	  rArc.edge = createEdge(site, rSite, null, vertex);
	  attachCircle(lArc);
	  attachCircle(rArc);
	}

	function leftBreakPoint(arc, directrix) {
	  var site = arc.site,
	      rfocx = site[0],
	      rfocy = site[1],
	      pby2 = rfocy - directrix;

	  if (!pby2) return rfocx;

	  var lArc = arc.P;
	  if (!lArc) return -Infinity;

	  site = lArc.site;
	  var lfocx = site[0],
	      lfocy = site[1],
	      plby2 = lfocy - directrix;

	  if (!plby2) return lfocx;

	  var hl = lfocx - rfocx,
	      aby2 = 1 / pby2 - 1 / plby2,
	      b = hl / plby2;

	  if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;

	  return (rfocx + lfocx) / 2;
	}

	function rightBreakPoint(arc, directrix) {
	  var rArc = arc.N;
	  if (rArc) return leftBreakPoint(rArc, directrix);
	  var site = arc.site;
	  return site[1] === directrix ? site[0] : Infinity;
	}

	var epsilon$3 = 1e-6;
	var epsilon2$1 = 1e-12;
	var beaches;
	var cells;
	var circles;
	var edges;

	function triangleArea(a, b, c) {
	  return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
	}

	function lexicographic(a, b) {
	  return b[1] - a[1]
	      || b[0] - a[0];
	}

	function Diagram(sites, extent) {
	  var site = sites.sort(lexicographic).pop(),
	      x,
	      y,
	      circle;

	  edges = [];
	  cells = new Array(sites.length);
	  beaches = new RedBlackTree;
	  circles = new RedBlackTree;

	  while (true) {
	    circle = firstCircle;
	    if (site && (!circle || site[1] < circle.y || (site[1] === circle.y && site[0] < circle.x))) {
	      if (site[0] !== x || site[1] !== y) {
	        addBeach(site);
	        x = site[0], y = site[1];
	      }
	      site = sites.pop();
	    } else if (circle) {
	      removeBeach(circle.arc);
	    } else {
	      break;
	    }
	  }

	  sortCellHalfedges();

	  if (extent) {
	    var x0 = +extent[0][0],
	        y0 = +extent[0][1],
	        x1 = +extent[1][0],
	        y1 = +extent[1][1];
	    clipEdges(x0, y0, x1, y1);
	    clipCells(x0, y0, x1, y1);
	  }

	  this.edges = edges;
	  this.cells = cells;

	  beaches =
	  circles =
	  edges =
	  cells = null;
	}

	Diagram.prototype = {
	  constructor: Diagram,

	  polygons: function() {
	    var edges = this.edges;

	    return this.cells.map(function(cell) {
	      var polygon = cell.halfedges.map(function(i) { return cellHalfedgeStart(cell, edges[i]); });
	      polygon.data = cell.site.data;
	      return polygon;
	    });
	  },

	  triangles: function() {
	    var triangles = [],
	        edges = this.edges;

	    this.cells.forEach(function(cell, i) {
	      var site = cell.site,
	          halfedges = cell.halfedges,
	          j = -1,
	          m = halfedges.length,
	          s0,
	          e1 = edges[halfedges[m - 1]],
	          s1 = e1.left === site ? e1.right : e1.left;

	      while (++j < m) {
	        s0 = s1;
	        e1 = edges[halfedges[j]];
	        s1 = e1.left === site ? e1.right : e1.left;
	        if (s0 && s1 && i < s0.index && i < s1.index && triangleArea(site, s0, s1) < 0) {
	          triangles.push([site.data, s0.data, s1.data]);
	        }
	      }
	    });

	    return triangles;
	  },

	  links: function() {
	    return this.edges.filter(function(edge) {
	      return edge.right;
	    }).map(function(edge) {
	      return {
	        source: edge.left.data,
	        target: edge.right.data
	      };
	    });
	  },

	  find: function(x, y, radius) {
	    var that = this,
	        i0, i1 = that._found || 0,
	        cell = that.cells[i1] || that.cells[i1 = 0],
	        dx = x - cell.site[0],
	        dy = y - cell.site[1],
	        d2 = dx * dx + dy * dy;

	    do {
	      cell = that.cells[i0 = i1], i1 = null;
	      cell.halfedges.forEach(function(e) {
	        var edge = that.edges[e], v = edge.left;
	        if ((v === cell.site || !v) && !(v = edge.right)) return;
	        var vx = x - v[0],
	            vy = y - v[1],
	            v2 = vx * vx + vy * vy;
	        if (v2 < d2) d2 = v2, i1 = v.index;
	      });
	    } while (i1 !== null);

	    that._found = i0;

	    return radius == null || d2 <= radius * radius ? cell.site : null;
	  }
	};

	var voronoi = function() {
	  var x$$1 = x$4,
	      y$$1 = y$4,
	      extent = null;

	  function voronoi(data) {
	    return new Diagram(data.map(function(d, i) {
	      var s = [Math.round(x$$1(d, i, data) / epsilon$3) * epsilon$3, Math.round(y$$1(d, i, data) / epsilon$3) * epsilon$3];
	      s.index = i;
	      s.data = d;
	      return s;
	    }), extent);
	  }

	  voronoi.polygons = function(data) {
	    return voronoi(data).polygons();
	  };

	  voronoi.links = function(data) {
	    return voronoi(data).links();
	  };

	  voronoi.triangles = function(data) {
	    return voronoi(data).triangles();
	  };

	  voronoi.x = function(_) {
	    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$9(+_), voronoi) : x$$1;
	  };

	  voronoi.y = function(_) {
	    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$9(+_), voronoi) : y$$1;
	  };

	  voronoi.extent = function(_) {
	    return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
	  };

	  voronoi.size = function(_) {
	    return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
	  };

	  return voronoi;
	};

	var constant$10 = function(x) {
	  return function() {
	    return x;
	  };
	};

	function ZoomEvent(target, type, transform) {
	  this.target = target;
	  this.type = type;
	  this.transform = transform;
	}

	function Transform(k, x, y) {
	  this.k = k;
	  this.x = x;
	  this.y = y;
	}

	Transform.prototype = {
	  constructor: Transform,
	  scale: function(k) {
	    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
	  },
	  translate: function(x, y) {
	    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
	  },
	  apply: function(point) {
	    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
	  },
	  applyX: function(x) {
	    return x * this.k + this.x;
	  },
	  applyY: function(y) {
	    return y * this.k + this.y;
	  },
	  invert: function(location) {
	    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
	  },
	  invertX: function(x) {
	    return (x - this.x) / this.k;
	  },
	  invertY: function(y) {
	    return (y - this.y) / this.k;
	  },
	  rescaleX: function(x) {
	    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
	  },
	  rescaleY: function(y) {
	    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
	  },
	  toString: function() {
	    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	  }
	};

	var identity$6 = new Transform(1, 0, 0);

	transform.prototype = Transform.prototype;

	function transform(node) {
	  return node.__zoom || identity$6;
	}

	function nopropagation$1() {
	  exports.event.stopImmediatePropagation();
	}

	var noevent$1 = function() {
	  exports.event.preventDefault();
	  exports.event.stopImmediatePropagation();
	};

	// Ignore right-click, since that should open the context menu.
	function defaultFilter$1() {
	  return !exports.event.button;
	}

	function defaultExtent() {
	  var e = this, w, h;
	  if (e instanceof SVGElement) {
	    e = e.ownerSVGElement || e;
	    w = e.width.baseVal.value;
	    h = e.height.baseVal.value;
	  } else {
	    w = e.clientWidth;
	    h = e.clientHeight;
	  }
	  return [[0, 0], [w, h]];
	}

	function defaultTransform() {
	  return this.__zoom || identity$6;
	}

	var zoom = function() {
	  var filter = defaultFilter$1,
	      extent = defaultExtent,
	      k0 = 0,
	      k1 = Infinity,
	      x0 = -k1,
	      x1 = k1,
	      y0 = x0,
	      y1 = x1,
	      duration = 250,
	      interpolate$$1 = interpolateZoom,
	      gestures = [],
	      listeners = dispatch("start", "zoom", "end"),
	      touchstarting,
	      touchending,
	      touchDelay = 500,
	      wheelDelay = 150;

	  function zoom(selection$$1) {
	    selection$$1
	        .on("wheel.zoom", wheeled)
	        .on("mousedown.zoom", mousedowned)
	        .on("dblclick.zoom", dblclicked)
	        .on("touchstart.zoom", touchstarted)
	        .on("touchmove.zoom", touchmoved)
	        .on("touchend.zoom touchcancel.zoom", touchended)
	        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)")
	        .property("__zoom", defaultTransform);
	  }

	  zoom.transform = function(collection, transform) {
	    var selection$$1 = collection.selection ? collection.selection() : collection;
	    selection$$1.property("__zoom", defaultTransform);
	    if (collection !== selection$$1) {
	      schedule(collection, transform);
	    } else {
	      selection$$1.interrupt().each(function() {
	        gesture(this, arguments)
	            .start()
	            .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
	            .end();
	      });
	    }
	  };

	  zoom.scaleBy = function(selection$$1, k) {
	    zoom.scaleTo(selection$$1, function() {
	      var k0 = this.__zoom.k,
	          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
	      return k0 * k1;
	    });
	  };

	  zoom.scaleTo = function(selection$$1, k) {
	    zoom.transform(selection$$1, function() {
	      var e = extent.apply(this, arguments),
	          t0 = this.__zoom,
	          p0 = centroid(e),
	          p1 = t0.invert(p0),
	          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
	      return constrain(translate(scale(t0, k1), p0, p1), e);
	    });
	  };

	  zoom.translateBy = function(selection$$1, x, y) {
	    zoom.transform(selection$$1, function() {
	      return constrain(this.__zoom.translate(
	        typeof x === "function" ? x.apply(this, arguments) : x,
	        typeof y === "function" ? y.apply(this, arguments) : y
	      ), extent.apply(this, arguments));
	    });
	  };

	  function scale(transform, k) {
	    k = Math.max(k0, Math.min(k1, k));
	    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
	  }

	  function translate(transform, p0, p1) {
	    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
	    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
	  }

	  function constrain(transform, extent) {
	    var dx0 = transform.invertX(extent[0][0]) - x0,
	        dx1 = transform.invertX(extent[1][0]) - x1,
	        dy0 = transform.invertY(extent[0][1]) - y0,
	        dy1 = transform.invertY(extent[1][1]) - y1;
	    return transform.translate(
	      dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
	      dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
	    );
	  }

	  function centroid(extent) {
	    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
	  }

	  function schedule(transition$$1, transform, center) {
	    transition$$1
	        .on("start.zoom", function() { gesture(this, arguments).start(); })
	        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).end(); })
	        .tween("zoom", function() {
	          var that = this,
	              args = arguments,
	              g = gesture(that, args),
	              e = extent.apply(that, args),
	              p = center || centroid(e),
	              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
	              a = that.__zoom,
	              b = typeof transform === "function" ? transform.apply(that, args) : transform,
	              i = interpolate$$1(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
	          return function(t) {
	            if (t === 1) t = b; // Avoid rounding error on end.
	            else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
	            g.zoom(null, t);
	          };
	        });
	  }

	  function gesture(that, args) {
	    for (var i = 0, n = gestures.length, g; i < n; ++i) {
	      if ((g = gestures[i]).that === that) {
	        return g;
	      }
	    }
	    return new Gesture(that, args);
	  }

	  function Gesture(that, args) {
	    this.that = that;
	    this.args = args;
	    this.index = -1;
	    this.active = 0;
	    this.extent = extent.apply(that, args);
	  }

	  Gesture.prototype = {
	    start: function() {
	      if (++this.active === 1) {
	        this.index = gestures.push(this) - 1;
	        this.emit("start");
	      }
	      return this;
	    },
	    zoom: function(key, transform) {
	      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
	      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
	      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
	      this.that.__zoom = transform;
	      this.emit("zoom");
	      return this;
	    },
	    end: function() {
	      if (--this.active === 0) {
	        gestures.splice(this.index, 1);
	        this.index = -1;
	        this.emit("end");
	      }
	      return this;
	    },
	    emit: function(type) {
	      customEvent(new ZoomEvent(zoom, type, this.that.__zoom), listeners.apply, listeners, [type, this.that, this.args]);
	    }
	  };

	  function wheeled() {
	    if (!filter.apply(this, arguments)) return;
	    var g = gesture(this, arguments),
	        t = this.__zoom,
	        k = Math.max(k0, Math.min(k1, t.k * Math.pow(2, -exports.event.deltaY * (exports.event.deltaMode ? 120 : 1) / 500))),
	        p = mouse(this);

	    // If the mouse is in the same location as before, reuse it.
	    // If there were recent wheel events, reset the wheel idle timeout.
	    if (g.wheel) {
	      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
	        g.mouse[1] = t.invert(g.mouse[0] = p);
	      }
	      clearTimeout(g.wheel);
	    }

	    // If this wheel event won’t trigger a transform change, ignore it.
	    else if (t.k === k) return;

	    // Otherwise, capture the mouse point and location at the start.
	    else {
	      g.mouse = [p, t.invert(p)];
	      interrupt(this);
	      g.start();
	    }

	    noevent$1();
	    g.wheel = setTimeout(wheelidled, wheelDelay);
	    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent));

	    function wheelidled() {
	      g.wheel = null;
	      g.end();
	    }
	  }

	  function mousedowned() {
	    if (touchending || !filter.apply(this, arguments)) return;
	    var g = gesture(this, arguments),
	        v = select(exports.event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
	        p = mouse(this);

	    dragDisable(exports.event.view);
	    nopropagation$1();
	    g.mouse = [p, this.__zoom.invert(p)];
	    interrupt(this);
	    g.start();

	    function mousemoved() {
	      noevent$1();
	      g.moved = true;
	      g.zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = mouse(g.that), g.mouse[1]), g.extent));
	    }

	    function mouseupped() {
	      v.on("mousemove.zoom mouseup.zoom", null);
	      yesdrag(exports.event.view, g.moved);
	      noevent$1();
	      g.end();
	    }
	  }

	  function dblclicked() {
	    if (!filter.apply(this, arguments)) return;
	    var t0 = this.__zoom,
	        p0 = mouse(this),
	        p1 = t0.invert(p0),
	        k1 = t0.k * (exports.event.shiftKey ? 0.5 : 2),
	        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, arguments));

	    noevent$1();
	    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0);
	    else select(this).call(zoom.transform, t1);
	  }

	  function touchstarted() {
	    if (!filter.apply(this, arguments)) return;
	    var g = gesture(this, arguments),
	        touches$$1 = exports.event.changedTouches,
	        n = touches$$1.length, i, t, p;

	    nopropagation$1();
	    for (i = 0; i < n; ++i) {
	      t = touches$$1[i], p = touch(this, touches$$1, t.identifier);
	      p = [p, this.__zoom.invert(p), t.identifier];
	      if (!g.touch0) g.touch0 = p;
	      else if (!g.touch1) g.touch1 = p;
	    }

	    // If this is a dbltap, reroute to the (optional) dblclick.zoom handler.
	    if (touchstarting) {
	      touchstarting = clearTimeout(touchstarting);
	      if (!g.touch1) {
	        g.end();
	        p = select(this).on("dblclick.zoom");
	        if (p) p.apply(this, arguments);
	        return;
	      }
	    }

	    if (exports.event.touches.length === n) {
	      touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
	      interrupt(this);
	      g.start();
	    }
	  }

	  function touchmoved() {
	    var g = gesture(this, arguments),
	        touches$$1 = exports.event.changedTouches,
	        n = touches$$1.length, i, t, p, l;

	    noevent$1();
	    if (touchstarting) touchstarting = clearTimeout(touchstarting);
	    for (i = 0; i < n; ++i) {
	      t = touches$$1[i], p = touch(this, touches$$1, t.identifier);
	      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
	      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
	    }
	    t = g.that.__zoom;
	    if (g.touch1) {
	      var p0 = g.touch0[0], l0 = g.touch0[1],
	          p1 = g.touch1[0], l1 = g.touch1[1],
	          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
	          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
	      t = scale(t, Math.sqrt(dp / dl));
	      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
	      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
	    }
	    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
	    else return;
	    g.zoom("touch", constrain(translate(t, p, l), g.extent));
	  }

	  function touchended() {
	    var g = gesture(this, arguments),
	        touches$$1 = exports.event.changedTouches,
	        n = touches$$1.length, i, t;

	    nopropagation$1();
	    if (touchending) clearTimeout(touchending);
	    touchending = setTimeout(function() { touchending = null; }, touchDelay);
	    for (i = 0; i < n; ++i) {
	      t = touches$$1[i];
	      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
	      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
	    }
	    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
	    if (!g.touch0) g.end();
	  }

	  zoom.filter = function(_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$10(!!_), zoom) : filter;
	  };

	  zoom.extent = function(_) {
	    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$10([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
	  };

	  zoom.scaleExtent = function(_) {
	    return arguments.length ? (k0 = +_[0], k1 = +_[1], zoom) : [k0, k1];
	  };

	  zoom.translateExtent = function(_) {
	    return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], zoom) : [[x0, y0], [x1, y1]];
	  };

	  zoom.duration = function(_) {
	    return arguments.length ? (duration = +_, zoom) : duration;
	  };

	  zoom.interpolate = function(_) {
	    return arguments.length ? (interpolate$$1 = _, zoom) : interpolate$$1;
	  };

	  zoom.on = function() {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? zoom : value;
	  };

	  return zoom;
	};

	var constant$11 = function(x) {
	  return function() {
	    return x;
	  };
	};

	var BrushEvent = function(target, type, selection) {
	  this.target = target;
	  this.type = type;
	  this.selection = selection;
	};

	function nopropagation$2() {
	  exports.event.stopImmediatePropagation();
	}

	var noevent$2 = function() {
	  exports.event.preventDefault();
	  exports.event.stopImmediatePropagation();
	};

	var MODE_DRAG = {name: "drag"};
	var MODE_SPACE = {name: "space"};
	var MODE_HANDLE = {name: "handle"};
	var MODE_CENTER = {name: "center"};

	var X = {
	  name: "x",
	  handles: ["e", "w"].map(type$1),
	  input: function(x, e) { return x && [[x[0], e[0][1]], [x[1], e[1][1]]]; },
	  output: function(xy) { return xy && [xy[0][0], xy[1][0]]; }
	};

	var Y = {
	  name: "y",
	  handles: ["n", "s"].map(type$1),
	  input: function(y, e) { return y && [[e[0][0], y[0]], [e[1][0], y[1]]]; },
	  output: function(xy) { return xy && [xy[0][1], xy[1][1]]; }
	};

	var XY = {
	  name: "xy",
	  handles: ["n", "e", "s", "w", "nw", "ne", "se", "sw"].map(type$1),
	  input: function(xy) { return xy; },
	  output: function(xy) { return xy; }
	};

	var cursors = {
	  overlay: "crosshair",
	  selection: "move",
	  n: "ns-resize",
	  e: "ew-resize",
	  s: "ns-resize",
	  w: "ew-resize",
	  nw: "nwse-resize",
	  ne: "nesw-resize",
	  se: "nwse-resize",
	  sw: "nesw-resize"
	};

	var flipX = {
	  e: "w",
	  w: "e",
	  nw: "ne",
	  ne: "nw",
	  se: "sw",
	  sw: "se"
	};

	var flipY = {
	  n: "s",
	  s: "n",
	  nw: "sw",
	  ne: "se",
	  se: "ne",
	  sw: "nw"
	};

	var signsX = {
	  overlay: +1,
	  selection: +1,
	  n: null,
	  e: +1,
	  s: null,
	  w: -1,
	  nw: -1,
	  ne: +1,
	  se: +1,
	  sw: -1
	};

	var signsY = {
	  overlay: +1,
	  selection: +1,
	  n: -1,
	  e: null,
	  s: +1,
	  w: null,
	  nw: -1,
	  ne: -1,
	  se: +1,
	  sw: +1
	};

	function type$1(t) {
	  return {type: t};
	}

	// Ignore right-click, since that should open the context menu.
	function defaultFilter$2() {
	  return !exports.event.button;
	}

	function defaultExtent$1() {
	  var svg = this.ownerSVGElement || this;
	  return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
	}

	// Like d3.local, but with the name “__brush” rather than auto-generated.
	function local$1(node) {
	  while (!node.__brush) if (!(node = node.parentNode)) return;
	  return node.__brush;
	}

	function empty$1(extent) {
	  return extent[0][0] === extent[1][0]
	      || extent[0][1] === extent[1][1];
	}

	function brushSelection(node) {
	  var state = node.__brush;
	  return state ? state.dim.output(state.selection) : null;
	}

	function brushX() {
	  return brush$1(X);
	}

	function brushY() {
	  return brush$1(Y);
	}

	var brush = function() {
	  return brush$1(XY);
	};

	function brush$1(dim) {
	  var extent = defaultExtent$1,
	      filter = defaultFilter$2,
	      listeners = dispatch(brush, "start", "brush", "end"),
	      handleSize = 6,
	      touchending;

	  function brush(group) {
	    var overlay = group
	        .property("__brush", initialize)
	      .selectAll(".overlay")
	      .data([type$1("overlay")]);

	    overlay.enter().append("rect")
	        .attr("class", "overlay")
	        .attr("pointer-events", "all")
	        .attr("cursor", cursors.overlay)
	      .merge(overlay)
	        .each(function() {
	          var extent = local$1(this).extent;
	          select(this)
	              .attr("x", extent[0][0])
	              .attr("y", extent[0][1])
	              .attr("width", extent[1][0] - extent[0][0])
	              .attr("height", extent[1][1] - extent[0][1]);
	        });

	    group.selectAll(".selection")
	      .data([type$1("selection")])
	      .enter().append("rect")
	        .attr("class", "selection")
	        .attr("cursor", cursors.selection)
	        .attr("fill", "#777")
	        .attr("fill-opacity", 0.3)
	        .attr("stroke", "#fff")
	        .attr("shape-rendering", "crispEdges");

	    var handle = group.selectAll(".handle")
	      .data(dim.handles, function(d) { return d.type; });

	    handle.exit().remove();

	    handle.enter().append("rect")
	        .attr("class", function(d) { return "handle handle--" + d.type; })
	        .attr("cursor", function(d) { return cursors[d.type]; });

	    group
	        .each(redraw)
	        .attr("fill", "none")
	        .attr("pointer-events", "all")
	        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)")
	        .on("mousedown.brush touchstart.brush", started);
	  }

	  brush.move = function(group, selection$$1) {
	    if (group.selection) {
	      group
	          .on("start.brush", function() { emitter(this, arguments).beforestart().start(); })
	          .on("interrupt.brush end.brush", function() { emitter(this, arguments).end(); })
	          .tween("brush", function() {
	            var that = this,
	                state = that.__brush,
	                emit = emitter(that, arguments),
	                selection0 = state.selection,
	                selection1 = dim.input(typeof selection$$1 === "function" ? selection$$1.apply(this, arguments) : selection$$1, state.extent),
	                i = interpolate(selection0, selection1);

	            function tween(t) {
	              state.selection = t === 1 && empty$1(selection1) ? null : i(t);
	              redraw.call(that);
	              emit.brush();
	            }

	            return selection0 && selection1 ? tween : tween(1);
	          });
	    } else {
	      group
	          .each(function() {
	            var that = this,
	                args = arguments,
	                state = that.__brush,
	                selection1 = dim.input(typeof selection$$1 === "function" ? selection$$1.apply(that, args) : selection$$1, state.extent),
	                emit = emitter(that, args).beforestart();

	            interrupt(that);
	            state.selection = selection1 == null || empty$1(selection1) ? null : selection1;
	            redraw.call(that);
	            emit.start().brush().end();
	          });
	    }
	  };

	  function redraw() {
	    var group = select(this),
	        selection$$1 = local$1(this).selection;

	    if (selection$$1) {
	      group.selectAll(".selection")
	          .style("display", null)
	          .attr("x", selection$$1[0][0])
	          .attr("y", selection$$1[0][1])
	          .attr("width", selection$$1[1][0] - selection$$1[0][0])
	          .attr("height", selection$$1[1][1] - selection$$1[0][1]);

	      group.selectAll(".handle")
	          .style("display", null)
	          .attr("x", function(d) { return d.type[d.type.length - 1] === "e" ? selection$$1[1][0] - handleSize / 2 : selection$$1[0][0] - handleSize / 2; })
	          .attr("y", function(d) { return d.type[0] === "s" ? selection$$1[1][1] - handleSize / 2 : selection$$1[0][1] - handleSize / 2; })
	          .attr("width", function(d) { return d.type === "n" || d.type === "s" ? selection$$1[1][0] - selection$$1[0][0] + handleSize : handleSize; })
	          .attr("height", function(d) { return d.type === "e" || d.type === "w" ? selection$$1[1][1] - selection$$1[0][1] + handleSize : handleSize; });
	    }

	    else {
	      group.selectAll(".selection,.handle")
	          .style("display", "none")
	          .attr("x", null)
	          .attr("y", null)
	          .attr("width", null)
	          .attr("height", null);
	    }
	  }

	  function emitter(that, args) {
	    return that.__brush.emitter || new Emitter(that, args);
	  }

	  function Emitter(that, args) {
	    this.that = that;
	    this.args = args;
	    this.state = that.__brush;
	    this.active = 0;
	  }

	  Emitter.prototype = {
	    beforestart: function() {
	      if (++this.active === 1) this.state.emitter = this, this.starting = true;
	      return this;
	    },
	    start: function() {
	      if (this.starting) this.starting = false, this.emit("start");
	      return this;
	    },
	    brush: function() {
	      this.emit("brush");
	      return this;
	    },
	    end: function() {
	      if (--this.active === 0) delete this.state.emitter, this.emit("end");
	      return this;
	    },
	    emit: function(type) {
	      customEvent(new BrushEvent(brush, type, dim.output(this.state.selection)), listeners.apply, listeners, [type, this.that, this.args]);
	    }
	  };

	  function started() {
	    if (exports.event.touches) { if (exports.event.changedTouches.length < exports.event.touches.length) return noevent$2(); }
	    else if (touchending) return;
	    if (!filter.apply(this, arguments)) return;

	    var that = this,
	        type = exports.event.target.__data__.type,
	        mode = (exports.event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : (exports.event.altKey ? MODE_CENTER : MODE_HANDLE),
	        signX = dim === Y ? null : signsX[type],
	        signY = dim === X ? null : signsY[type],
	        state = local$1(that),
	        extent = state.extent,
	        selection$$1 = state.selection,
	        W = extent[0][0], w0, w1,
	        N = extent[0][1], n0, n1,
	        E = extent[1][0], e0, e1,
	        S = extent[1][1], s0, s1,
	        dx,
	        dy,
	        moving,
	        shifting = signX && signY && exports.event.shiftKey,
	        lockX,
	        lockY,
	        point0 = mouse(that),
	        point = point0,
	        emit = emitter(that, arguments).beforestart();

	    if (type === "overlay") {
	      state.selection = selection$$1 = [
	        [w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]],
	        [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]
	      ];
	    } else {
	      w0 = selection$$1[0][0];
	      n0 = selection$$1[0][1];
	      e0 = selection$$1[1][0];
	      s0 = selection$$1[1][1];
	    }

	    w1 = w0;
	    n1 = n0;
	    e1 = e0;
	    s1 = s0;

	    var group = select(that)
	        .attr("pointer-events", "none");

	    var overlay = group.selectAll(".overlay")
	        .attr("cursor", cursors[type]);

	    if (exports.event.touches) {
	      group
	          .on("touchmove.brush", moved, true)
	          .on("touchend.brush touchcancel.brush", ended, true);
	    } else {
	      var view = select(exports.event.view)
	          .on("keydown.brush", keydowned, true)
	          .on("keyup.brush", keyupped, true)
	          .on("mousemove.brush", moved, true)
	          .on("mouseup.brush", ended, true);

	      dragDisable(exports.event.view);
	    }

	    nopropagation$2();
	    interrupt(that);
	    redraw.call(that);
	    emit.start();

	    function moved() {
	      var point1 = mouse(that);
	      if (shifting && !lockX && !lockY) {
	        if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;
	        else lockX = true;
	      }
	      point = point1;
	      moving = true;
	      noevent$2();
	      move();
	    }

	    function move() {
	      var t;

	      dx = point[0] - point0[0];
	      dy = point[1] - point0[1];

	      switch (mode) {
	        case MODE_SPACE:
	        case MODE_DRAG: {
	          if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
	          if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
	          break;
	        }
	        case MODE_HANDLE: {
	          if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
	          else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
	          if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
	          else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
	          break;
	        }
	        case MODE_CENTER: {
	          if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
	          if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
	          break;
	        }
	      }

	      if (e1 < w1) {
	        signX *= -1;
	        t = w0, w0 = e0, e0 = t;
	        t = w1, w1 = e1, e1 = t;
	        if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
	      }

	      if (s1 < n1) {
	        signY *= -1;
	        t = n0, n0 = s0, s0 = t;
	        t = n1, n1 = s1, s1 = t;
	        if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
	      }

	      if (state.selection) selection$$1 = state.selection; // May be set by brush.move!
	      if (lockX) w1 = selection$$1[0][0], e1 = selection$$1[1][0];
	      if (lockY) n1 = selection$$1[0][1], s1 = selection$$1[1][1];

	      if (selection$$1[0][0] !== w1
	          || selection$$1[0][1] !== n1
	          || selection$$1[1][0] !== e1
	          || selection$$1[1][1] !== s1) {
	        state.selection = [[w1, n1], [e1, s1]];
	        redraw.call(that);
	        emit.brush();
	      }
	    }

	    function ended() {
	      nopropagation$2();
	      if (exports.event.touches) {
	        if (exports.event.touches.length) return;
	        if (touchending) clearTimeout(touchending);
	        touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
	        group.on("touchmove.brush touchend.brush touchcancel.brush", null);
	      } else {
	        yesdrag(exports.event.view, moving);
	        view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
	      }
	      group.attr("pointer-events", "all");
	      overlay.attr("cursor", cursors.overlay);
	      if (state.selection) selection$$1 = state.selection; // May be set by brush.move (on start)!
	      if (empty$1(selection$$1)) state.selection = null, redraw.call(that);
	      emit.end();
	    }

	    function keydowned() {
	      switch (exports.event.keyCode) {
	        case 16: { // SHIFT
	          shifting = signX && signY;
	          break;
	        }
	        case 18: { // ALT
	          if (mode === MODE_HANDLE) {
	            if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
	            if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
	            mode = MODE_CENTER;
	            move();
	          }
	          break;
	        }
	        case 32: { // SPACE; takes priority over ALT
	          if (mode === MODE_HANDLE || mode === MODE_CENTER) {
	            if (signX < 0) e0 = e1 - dx; else if (signX > 0) w0 = w1 - dx;
	            if (signY < 0) s0 = s1 - dy; else if (signY > 0) n0 = n1 - dy;
	            mode = MODE_SPACE;
	            overlay.attr("cursor", cursors.selection);
	            move();
	          }
	          break;
	        }
	        default: return;
	      }
	      noevent$2();
	    }

	    function keyupped() {
	      switch (exports.event.keyCode) {
	        case 16: { // SHIFT
	          if (shifting) {
	            lockX = lockY = shifting = false;
	            move();
	          }
	          break;
	        }
	        case 18: { // ALT
	          if (mode === MODE_CENTER) {
	            if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
	            if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
	            mode = MODE_HANDLE;
	            move();
	          }
	          break;
	        }
	        case 32: { // SPACE
	          if (mode === MODE_SPACE) {
	            if (exports.event.altKey) {
	              if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
	              if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
	              mode = MODE_CENTER;
	            } else {
	              if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
	              if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
	              mode = MODE_HANDLE;
	            }
	            overlay.attr("cursor", cursors[type]);
	            move();
	          }
	          break;
	        }
	        default: return;
	      }
	      noevent$2();
	    }
	  }

	  function initialize() {
	    var state = this.__brush || {selection: null};
	    state.extent = extent.apply(this, arguments);
	    state.dim = dim;
	    return state;
	  }

	  brush.extent = function(_) {
	    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$11([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), brush) : extent;
	  };

	  brush.filter = function(_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$11(!!_), brush) : filter;
	  };

	  brush.handleSize = function(_) {
	    return arguments.length ? (handleSize = +_, brush) : handleSize;
	  };

	  brush.on = function() {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? brush : value;
	  };

	  return brush;
	}

	var cos = Math.cos;
	var sin = Math.sin;
	var pi$3 = Math.PI;
	var halfPi$2 = pi$3 / 2;
	var tau$3 = pi$3 * 2;
	var max$1 = Math.max;

	function compareValue(compare) {
	  return function(a, b) {
	    return compare(
	      a.source.value + a.target.value,
	      b.source.value + b.target.value
	    );
	  };
	}

	var chord = function() {
	  var padAngle = 0,
	      sortGroups = null,
	      sortSubgroups = null,
	      sortChords = null;

	  function chord(matrix) {
	    var n = matrix.length,
	        groupSums = [],
	        groupIndex = range(n),
	        subgroupIndex = [],
	        chords = [],
	        groups = chords.groups = new Array(n),
	        subgroups = new Array(n * n),
	        k,
	        x,
	        x0,
	        dx,
	        i,
	        j;

	    // Compute the sum.
	    k = 0, i = -1; while (++i < n) {
	      x = 0, j = -1; while (++j < n) {
	        x += matrix[i][j];
	      }
	      groupSums.push(x);
	      subgroupIndex.push(range(n));
	      k += x;
	    }

	    // Sort groups…
	    if (sortGroups) groupIndex.sort(function(a, b) {
	      return sortGroups(groupSums[a], groupSums[b]);
	    });

	    // Sort subgroups…
	    if (sortSubgroups) subgroupIndex.forEach(function(d, i) {
	      d.sort(function(a, b) {
	        return sortSubgroups(matrix[i][a], matrix[i][b]);
	      });
	    });

	    // Convert the sum to scaling factor for [0, 2pi].
	    // TODO Allow start and end angle to be specified?
	    // TODO Allow padding to be specified as percentage?
	    k = max$1(0, tau$3 - padAngle * n) / k;
	    dx = k ? padAngle : tau$3 / n;

	    // Compute the start and end angle for each group and subgroup.
	    // Note: Opera has a bug reordering object literal properties!
	    x = 0, i = -1; while (++i < n) {
	      x0 = x, j = -1; while (++j < n) {
	        var di = groupIndex[i],
	            dj = subgroupIndex[di][j],
	            v = matrix[di][dj],
	            a0 = x,
	            a1 = x += v * k;
	        subgroups[dj * n + di] = {
	          index: di,
	          subindex: dj,
	          startAngle: a0,
	          endAngle: a1,
	          value: v
	        };
	      }
	      groups[di] = {
	        index: di,
	        startAngle: x0,
	        endAngle: x,
	        value: groupSums[di]
	      };
	      x += dx;
	    }

	    // Generate chords for each (non-empty) subgroup-subgroup link.
	    i = -1; while (++i < n) {
	      j = i - 1; while (++j < n) {
	        var source = subgroups[j * n + i],
	            target = subgroups[i * n + j];
	        if (source.value || target.value) {
	          chords.push(source.value < target.value
	              ? {source: target, target: source}
	              : {source: source, target: target});
	        }
	      }
	    }

	    return sortChords ? chords.sort(sortChords) : chords;
	  }

	  chord.padAngle = function(_) {
	    return arguments.length ? (padAngle = max$1(0, _), chord) : padAngle;
	  };

	  chord.sortGroups = function(_) {
	    return arguments.length ? (sortGroups = _, chord) : sortGroups;
	  };

	  chord.sortSubgroups = function(_) {
	    return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
	  };

	  chord.sortChords = function(_) {
	    return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
	  };

	  return chord;
	};

	var slice$5 = Array.prototype.slice;

	var constant$12 = function(x) {
	  return function() {
	    return x;
	  };
	};

	function defaultSource(d) {
	  return d.source;
	}

	function defaultTarget(d) {
	  return d.target;
	}

	function defaultRadius$1(d) {
	  return d.radius;
	}

	function defaultStartAngle(d) {
	  return d.startAngle;
	}

	function defaultEndAngle(d) {
	  return d.endAngle;
	}

	var ribbon = function() {
	  var source = defaultSource,
	      target = defaultTarget,
	      radius = defaultRadius$1,
	      startAngle = defaultStartAngle,
	      endAngle = defaultEndAngle,
	      context = null;

	  function ribbon() {
	    var buffer,
	        argv = slice$5.call(arguments),
	        s = source.apply(this, argv),
	        t = target.apply(this, argv),
	        sr = +radius.apply(this, (argv[0] = s, argv)),
	        sa0 = startAngle.apply(this, argv) - halfPi$2,
	        sa1 = endAngle.apply(this, argv) - halfPi$2,
	        sx0 = sr * cos(sa0),
	        sy0 = sr * sin(sa0),
	        tr = +radius.apply(this, (argv[0] = t, argv)),
	        ta0 = startAngle.apply(this, argv) - halfPi$2,
	        ta1 = endAngle.apply(this, argv) - halfPi$2;

	    if (!context) context = buffer = path();

	    context.moveTo(sx0, sy0);
	    context.arc(0, 0, sr, sa0, sa1);
	    if (sa0 !== ta0 || sa1 !== ta1) { // TODO sr !== tr?
	      context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
	      context.arc(0, 0, tr, ta0, ta1);
	    }
	    context.quadraticCurveTo(0, 0, sx0, sy0);
	    context.closePath();

	    if (buffer) return context = null, buffer + "" || null;
	  }

	  ribbon.radius = function(_) {
	    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$12(+_), ribbon) : radius;
	  };

	  ribbon.startAngle = function(_) {
	    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$12(+_), ribbon) : startAngle;
	  };

	  ribbon.endAngle = function(_) {
	    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$12(+_), ribbon) : endAngle;
	  };

	  ribbon.source = function(_) {
	    return arguments.length ? (source = _, ribbon) : source;
	  };

	  ribbon.target = function(_) {
	    return arguments.length ? (target = _, ribbon) : target;
	  };

	  ribbon.context = function(_) {
	    return arguments.length ? ((context = _ == null ? null : _), ribbon) : context;
	  };

	  return ribbon;
	};

	// Adds floating point numbers with twice the normal precision.
	// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
	// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
	// 305–363 (1997).
	// Code adapted from GeographicLib by Charles F. F. Karney,
	// http://geographiclib.sourceforge.net/

	var adder = function() {
	  return new Adder;
	};

	function Adder() {
	  this.reset();
	}

	Adder.prototype = {
	  constructor: Adder,
	  reset: function() {
	    this.s = // rounded value
	    this.t = 0; // exact error
	  },
	  add: function(y) {
	    add$1(temp, y, this.t);
	    add$1(this, temp.s, this.s);
	    if (this.s) this.t += temp.t;
	    else this.s = temp.t;
	  },
	  valueOf: function() {
	    return this.s;
	  }
	};

	var temp = new Adder;

	function add$1(adder, a, b) {
	  var x = adder.s = a + b,
	      bv = x - a,
	      av = x - bv;
	  adder.t = (a - av) + (b - bv);
	}

	var epsilon$4 = 1e-6;
	var epsilon2$2 = 1e-12;
	var pi$4 = Math.PI;
	var halfPi$3 = pi$4 / 2;
	var quarterPi = pi$4 / 4;
	var tau$4 = pi$4 * 2;

	var degrees$1 = 180 / pi$4;
	var radians = pi$4 / 180;

	var abs = Math.abs;
	var atan = Math.atan;
	var atan2 = Math.atan2;
	var cos$1 = Math.cos;
	var ceil = Math.ceil;
	var exp = Math.exp;

	var log$1 = Math.log;
	var pow$1 = Math.pow;
	var sin$1 = Math.sin;
	var sign$1 = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
	var sqrt$1 = Math.sqrt;
	var tan = Math.tan;

	function acos(x) {
	  return x > 1 ? 0 : x < -1 ? pi$4 : Math.acos(x);
	}

	function asin$1(x) {
	  return x > 1 ? halfPi$3 : x < -1 ? -halfPi$3 : Math.asin(x);
	}

	function haversin(x) {
	  return (x = sin$1(x / 2)) * x;
	}

	function noop$2() {}

	function streamGeometry(geometry, stream) {
	  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
	    streamGeometryType[geometry.type](geometry, stream);
	  }
	}

	var streamObjectType = {
	  Feature: function(feature, stream) {
	    streamGeometry(feature.geometry, stream);
	  },
	  FeatureCollection: function(object, stream) {
	    var features = object.features, i = -1, n = features.length;
	    while (++i < n) streamGeometry(features[i].geometry, stream);
	  }
	};

	var streamGeometryType = {
	  Sphere: function(object, stream) {
	    stream.sphere();
	  },
	  Point: function(object, stream) {
	    object = object.coordinates;
	    stream.point(object[0], object[1], object[2]);
	  },
	  MultiPoint: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
	  },
	  LineString: function(object, stream) {
	    streamLine(object.coordinates, stream, 0);
	  },
	  MultiLineString: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) streamLine(coordinates[i], stream, 0);
	  },
	  Polygon: function(object, stream) {
	    streamPolygon(object.coordinates, stream);
	  },
	  MultiPolygon: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) streamPolygon(coordinates[i], stream);
	  },
	  GeometryCollection: function(object, stream) {
	    var geometries = object.geometries, i = -1, n = geometries.length;
	    while (++i < n) streamGeometry(geometries[i], stream);
	  }
	};

	function streamLine(coordinates, stream, closed) {
	  var i = -1, n = coordinates.length - closed, coordinate;
	  stream.lineStart();
	  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
	  stream.lineEnd();
	}

	function streamPolygon(coordinates, stream) {
	  var i = -1, n = coordinates.length;
	  stream.polygonStart();
	  while (++i < n) streamLine(coordinates[i], stream, 1);
	  stream.polygonEnd();
	}

	var geoStream = function(object, stream) {
	  if (object && streamObjectType.hasOwnProperty(object.type)) {
	    streamObjectType[object.type](object, stream);
	  } else {
	    streamGeometry(object, stream);
	  }
	};

	var areaRingSum = adder();

	var areaSum = adder();
	var lambda00;
	var phi00;
	var lambda0;
	var cosPhi0;
	var sinPhi0;

	var areaStream = {
	  point: noop$2,
	  lineStart: noop$2,
	  lineEnd: noop$2,
	  polygonStart: function() {
	    areaRingSum.reset();
	    areaStream.lineStart = areaRingStart;
	    areaStream.lineEnd = areaRingEnd;
	  },
	  polygonEnd: function() {
	    var areaRing = +areaRingSum;
	    areaSum.add(areaRing < 0 ? tau$4 + areaRing : areaRing);
	    this.lineStart = this.lineEnd = this.point = noop$2;
	  },
	  sphere: function() {
	    areaSum.add(tau$4);
	  }
	};

	function areaRingStart() {
	  areaStream.point = areaPointFirst;
	}

	function areaRingEnd() {
	  areaPoint(lambda00, phi00);
	}

	function areaPointFirst(lambda, phi) {
	  areaStream.point = areaPoint;
	  lambda00 = lambda, phi00 = phi;
	  lambda *= radians, phi *= radians;
	  lambda0 = lambda, cosPhi0 = cos$1(phi = phi / 2 + quarterPi), sinPhi0 = sin$1(phi);
	}

	function areaPoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  phi = phi / 2 + quarterPi; // half the angular distance from south pole

	  // Spherical excess E for a spherical triangle with vertices: south pole,
	  // previous point, current point.  Uses a formula derived from Cagnoli’s
	  // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
	  var dLambda = lambda - lambda0,
	      sdLambda = dLambda >= 0 ? 1 : -1,
	      adLambda = sdLambda * dLambda,
	      cosPhi = cos$1(phi),
	      sinPhi = sin$1(phi),
	      k = sinPhi0 * sinPhi,
	      u = cosPhi0 * cosPhi + k * cos$1(adLambda),
	      v = k * sdLambda * sin$1(adLambda);
	  areaRingSum.add(atan2(v, u));

	  // Advance the previous points.
	  lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
	}

	var area$2 = function(object) {
	  areaSum.reset();
	  geoStream(object, areaStream);
	  return areaSum * 2;
	};

	function spherical(cartesian) {
	  return [atan2(cartesian[1], cartesian[0]), asin$1(cartesian[2])];
	}

	function cartesian(spherical) {
	  var lambda = spherical[0], phi = spherical[1], cosPhi = cos$1(phi);
	  return [cosPhi * cos$1(lambda), cosPhi * sin$1(lambda), sin$1(phi)];
	}

	function cartesianDot(a, b) {
	  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	function cartesianCross(a, b) {
	  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	}

	// TODO return a
	function cartesianAddInPlace(a, b) {
	  a[0] += b[0], a[1] += b[1], a[2] += b[2];
	}

	function cartesianScale(vector, k) {
	  return [vector[0] * k, vector[1] * k, vector[2] * k];
	}

	// TODO return d
	function cartesianNormalizeInPlace(d) {
	  var l = sqrt$1(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
	  d[0] /= l, d[1] /= l, d[2] /= l;
	}

	var lambda0$1;
	var phi0;
	var lambda1;
	var phi1;
	var lambda2;
	var lambda00$1;
	var phi00$1;
	var p0;
	var deltaSum = adder();
	var ranges;
	var range$1;

	var boundsStream = {
	  point: boundsPoint,
	  lineStart: boundsLineStart,
	  lineEnd: boundsLineEnd,
	  polygonStart: function() {
	    boundsStream.point = boundsRingPoint;
	    boundsStream.lineStart = boundsRingStart;
	    boundsStream.lineEnd = boundsRingEnd;
	    deltaSum.reset();
	    areaStream.polygonStart();
	  },
	  polygonEnd: function() {
	    areaStream.polygonEnd();
	    boundsStream.point = boundsPoint;
	    boundsStream.lineStart = boundsLineStart;
	    boundsStream.lineEnd = boundsLineEnd;
	    if (areaRingSum < 0) lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
	    else if (deltaSum > epsilon$4) phi1 = 90;
	    else if (deltaSum < -epsilon$4) phi0 = -90;
	    range$1[0] = lambda0$1, range$1[1] = lambda1;
	  }
	};

	function boundsPoint(lambda, phi) {
	  ranges.push(range$1 = [lambda0$1 = lambda, lambda1 = lambda]);
	  if (phi < phi0) phi0 = phi;
	  if (phi > phi1) phi1 = phi;
	}

	function linePoint(lambda, phi) {
	  var p = cartesian([lambda * radians, phi * radians]);
	  if (p0) {
	    var normal = cartesianCross(p0, p),
	        equatorial = [normal[1], -normal[0], 0],
	        inflection = cartesianCross(equatorial, normal);
	    cartesianNormalizeInPlace(inflection);
	    inflection = spherical(inflection);
	    var delta = lambda - lambda2,
	        sign$$1 = delta > 0 ? 1 : -1,
	        lambdai = inflection[0] * degrees$1 * sign$$1,
	        phii,
	        antimeridian = abs(delta) > 180;
	    if (antimeridian ^ (sign$$1 * lambda2 < lambdai && lambdai < sign$$1 * lambda)) {
	      phii = inflection[1] * degrees$1;
	      if (phii > phi1) phi1 = phii;
	    } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign$$1 * lambda2 < lambdai && lambdai < sign$$1 * lambda)) {
	      phii = -inflection[1] * degrees$1;
	      if (phii < phi0) phi0 = phii;
	    } else {
	      if (phi < phi0) phi0 = phi;
	      if (phi > phi1) phi1 = phi;
	    }
	    if (antimeridian) {
	      if (lambda < lambda2) {
	        if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
	      } else {
	        if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
	      }
	    } else {
	      if (lambda1 >= lambda0$1) {
	        if (lambda < lambda0$1) lambda0$1 = lambda;
	        if (lambda > lambda1) lambda1 = lambda;
	      } else {
	        if (lambda > lambda2) {
	          if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
	        } else {
	          if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
	        }
	      }
	    }
	  } else {
	    boundsPoint(lambda, phi);
	  }
	  p0 = p, lambda2 = lambda;
	}

	function boundsLineStart() {
	  boundsStream.point = linePoint;
	}

	function boundsLineEnd() {
	  range$1[0] = lambda0$1, range$1[1] = lambda1;
	  boundsStream.point = boundsPoint;
	  p0 = null;
	}

	function boundsRingPoint(lambda, phi) {
	  if (p0) {
	    var delta = lambda - lambda2;
	    deltaSum.add(abs(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
	  } else {
	    lambda00$1 = lambda, phi00$1 = phi;
	  }
	  areaStream.point(lambda, phi);
	  linePoint(lambda, phi);
	}

	function boundsRingStart() {
	  areaStream.lineStart();
	}

	function boundsRingEnd() {
	  boundsRingPoint(lambda00$1, phi00$1);
	  areaStream.lineEnd();
	  if (abs(deltaSum) > epsilon$4) lambda0$1 = -(lambda1 = 180);
	  range$1[0] = lambda0$1, range$1[1] = lambda1;
	  p0 = null;
	}

	// Finds the left-right distance between two longitudes.
	// This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
	// the distance between ±180° to be 360°.
	function angle(lambda0, lambda1) {
	  return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
	}

	function rangeCompare(a, b) {
	  return a[0] - b[0];
	}

	function rangeContains(range, x) {
	  return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
	}

	var bounds = function(feature) {
	  var i, n, a, b, merged, deltaMax, delta;

	  phi1 = lambda1 = -(lambda0$1 = phi0 = Infinity);
	  ranges = [];
	  geoStream(feature, boundsStream);

	  // First, sort ranges by their minimum longitudes.
	  if (n = ranges.length) {
	    ranges.sort(rangeCompare);

	    // Then, merge any ranges that overlap.
	    for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) {
	      b = ranges[i];
	      if (rangeContains(a, b[0]) || rangeContains(a, b[1])) {
	        if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
	        if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
	      } else {
	        merged.push(a = b);
	      }
	    }

	    // Finally, find the largest gap between the merged ranges.
	    // The final bounding box will be the inverse of this gap.
	    for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) {
	      b = merged[i];
	      if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0$1 = b[0], lambda1 = a[1];
	    }
	  }

	  ranges = range$1 = null;

	  return lambda0$1 === Infinity || phi0 === Infinity
	      ? [[NaN, NaN], [NaN, NaN]]
	      : [[lambda0$1, phi0], [lambda1, phi1]];
	};

	var W0;
	var W1;
	var X0;
	var Y0;
	var Z0;
	var X1;
	var Y1;
	var Z1;
	var X2;
	var Y2;
	var Z2;
	var lambda00$2;
	var phi00$2;
	var x0;
	var y0;
	var z0; // previous point

	var centroidStream = {
	  sphere: noop$2,
	  point: centroidPoint,
	  lineStart: centroidLineStart,
	  lineEnd: centroidLineEnd,
	  polygonStart: function() {
	    centroidStream.lineStart = centroidRingStart;
	    centroidStream.lineEnd = centroidRingEnd;
	  },
	  polygonEnd: function() {
	    centroidStream.lineStart = centroidLineStart;
	    centroidStream.lineEnd = centroidLineEnd;
	  }
	};

	// Arithmetic mean of Cartesian vectors.
	function centroidPoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var cosPhi = cos$1(phi);
	  centroidPointCartesian(cosPhi * cos$1(lambda), cosPhi * sin$1(lambda), sin$1(phi));
	}

	function centroidPointCartesian(x, y, z) {
	  ++W0;
	  X0 += (x - X0) / W0;
	  Y0 += (y - Y0) / W0;
	  Z0 += (z - Z0) / W0;
	}

	function centroidLineStart() {
	  centroidStream.point = centroidLinePointFirst;
	}

	function centroidLinePointFirst(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var cosPhi = cos$1(phi);
	  x0 = cosPhi * cos$1(lambda);
	  y0 = cosPhi * sin$1(lambda);
	  z0 = sin$1(phi);
	  centroidStream.point = centroidLinePoint;
	  centroidPointCartesian(x0, y0, z0);
	}

	function centroidLinePoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var cosPhi = cos$1(phi),
	      x = cosPhi * cos$1(lambda),
	      y = cosPhi * sin$1(lambda),
	      z = sin$1(phi),
	      w = atan2(sqrt$1((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
	  W1 += w;
	  X1 += w * (x0 + (x0 = x));
	  Y1 += w * (y0 + (y0 = y));
	  Z1 += w * (z0 + (z0 = z));
	  centroidPointCartesian(x0, y0, z0);
	}

	function centroidLineEnd() {
	  centroidStream.point = centroidPoint;
	}

	// See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
	// J. Applied Mechanics 42, 239 (1975).
	function centroidRingStart() {
	  centroidStream.point = centroidRingPointFirst;
	}

	function centroidRingEnd() {
	  centroidRingPoint(lambda00$2, phi00$2);
	  centroidStream.point = centroidPoint;
	}

	function centroidRingPointFirst(lambda, phi) {
	  lambda00$2 = lambda, phi00$2 = phi;
	  lambda *= radians, phi *= radians;
	  centroidStream.point = centroidRingPoint;
	  var cosPhi = cos$1(phi);
	  x0 = cosPhi * cos$1(lambda);
	  y0 = cosPhi * sin$1(lambda);
	  z0 = sin$1(phi);
	  centroidPointCartesian(x0, y0, z0);
	}

	function centroidRingPoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var cosPhi = cos$1(phi),
	      x = cosPhi * cos$1(lambda),
	      y = cosPhi * sin$1(lambda),
	      z = sin$1(phi),
	      cx = y0 * z - z0 * y,
	      cy = z0 * x - x0 * z,
	      cz = x0 * y - y0 * x,
	      m = sqrt$1(cx * cx + cy * cy + cz * cz),
	      u = x0 * x + y0 * y + z0 * z,
	      v = m && -acos(u) / m, // area weight
	      w = atan2(m, u); // line weight
	  X2 += v * cx;
	  Y2 += v * cy;
	  Z2 += v * cz;
	  W1 += w;
	  X1 += w * (x0 + (x0 = x));
	  Y1 += w * (y0 + (y0 = y));
	  Z1 += w * (z0 + (z0 = z));
	  centroidPointCartesian(x0, y0, z0);
	}

	var centroid$1 = function(object) {
	  W0 = W1 =
	  X0 = Y0 = Z0 =
	  X1 = Y1 = Z1 =
	  X2 = Y2 = Z2 = 0;
	  geoStream(object, centroidStream);

	  var x = X2,
	      y = Y2,
	      z = Z2,
	      m = x * x + y * y + z * z;

	  // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
	  if (m < epsilon2$2) {
	    x = X1, y = Y1, z = Z1;
	    // If the feature has zero length, fall back to arithmetic mean of point vectors.
	    if (W1 < epsilon$4) x = X0, y = Y0, z = Z0;
	    m = x * x + y * y + z * z;
	    // If the feature still has an undefined ccentroid, then return.
	    if (m < epsilon2$2) return [NaN, NaN];
	  }

	  return [atan2(y, x) * degrees$1, asin$1(z / sqrt$1(m)) * degrees$1];
	};

	var constant$13 = function(x) {
	  return function() {
	    return x;
	  };
	};

	var compose = function(a, b) {

	  function compose(x, y) {
	    return x = a(x, y), b(x[0], x[1]);
	  }

	  if (a.invert && b.invert) compose.invert = function(x, y) {
	    return x = b.invert(x, y), x && a.invert(x[0], x[1]);
	  };

	  return compose;
	};

	function rotationIdentity(lambda, phi) {
	  return [lambda > pi$4 ? lambda - tau$4 : lambda < -pi$4 ? lambda + tau$4 : lambda, phi];
	}

	rotationIdentity.invert = rotationIdentity;

	function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
	  return (deltaLambda %= tau$4) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
	    : rotationLambda(deltaLambda))
	    : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
	    : rotationIdentity);
	}

	function forwardRotationLambda(deltaLambda) {
	  return function(lambda, phi) {
	    return lambda += deltaLambda, [lambda > pi$4 ? lambda - tau$4 : lambda < -pi$4 ? lambda + tau$4 : lambda, phi];
	  };
	}

	function rotationLambda(deltaLambda) {
	  var rotation = forwardRotationLambda(deltaLambda);
	  rotation.invert = forwardRotationLambda(-deltaLambda);
	  return rotation;
	}

	function rotationPhiGamma(deltaPhi, deltaGamma) {
	  var cosDeltaPhi = cos$1(deltaPhi),
	      sinDeltaPhi = sin$1(deltaPhi),
	      cosDeltaGamma = cos$1(deltaGamma),
	      sinDeltaGamma = sin$1(deltaGamma);

	  function rotation(lambda, phi) {
	    var cosPhi = cos$1(phi),
	        x = cos$1(lambda) * cosPhi,
	        y = sin$1(lambda) * cosPhi,
	        z = sin$1(phi),
	        k = z * cosDeltaPhi + x * sinDeltaPhi;
	    return [
	      atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
	      asin$1(k * cosDeltaGamma + y * sinDeltaGamma)
	    ];
	  }

	  rotation.invert = function(lambda, phi) {
	    var cosPhi = cos$1(phi),
	        x = cos$1(lambda) * cosPhi,
	        y = sin$1(lambda) * cosPhi,
	        z = sin$1(phi),
	        k = z * cosDeltaGamma - y * sinDeltaGamma;
	    return [
	      atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
	      asin$1(k * cosDeltaPhi - x * sinDeltaPhi)
	    ];
	  };

	  return rotation;
	}

	var rotation = function(rotate) {
	  rotate = rotateRadians(rotate[0] * radians, rotate[1] * radians, rotate.length > 2 ? rotate[2] * radians : 0);

	  function forward(coordinates) {
	    coordinates = rotate(coordinates[0] * radians, coordinates[1] * radians);
	    return coordinates[0] *= degrees$1, coordinates[1] *= degrees$1, coordinates;
	  }

	  forward.invert = function(coordinates) {
	    coordinates = rotate.invert(coordinates[0] * radians, coordinates[1] * radians);
	    return coordinates[0] *= degrees$1, coordinates[1] *= degrees$1, coordinates;
	  };

	  return forward;
	};

	// Generates a circle centered at [0°, 0°], with a given radius and precision.
	function circleStream(stream, radius, delta, direction, t0, t1) {
	  if (!delta) return;
	  var cosRadius = cos$1(radius),
	      sinRadius = sin$1(radius),
	      step = direction * delta;
	  if (t0 == null) {
	    t0 = radius + direction * tau$4;
	    t1 = radius - step / 2;
	  } else {
	    t0 = circleRadius(cosRadius, t0);
	    t1 = circleRadius(cosRadius, t1);
	    if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau$4;
	  }
	  for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
	    point = spherical([cosRadius, -sinRadius * cos$1(t), -sinRadius * sin$1(t)]);
	    stream.point(point[0], point[1]);
	  }
	}

	// Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
	function circleRadius(cosRadius, point) {
	  point = cartesian(point), point[0] -= cosRadius;
	  cartesianNormalizeInPlace(point);
	  var radius = acos(-point[1]);
	  return ((-point[2] < 0 ? -radius : radius) + tau$4 - epsilon$4) % tau$4;
	}

	var circle$1 = function() {
	  var center = constant$13([0, 0]),
	      radius = constant$13(90),
	      precision = constant$13(6),
	      ring,
	      rotate,
	      stream = {point: point};

	  function point(x, y) {
	    ring.push(x = rotate(x, y));
	    x[0] *= degrees$1, x[1] *= degrees$1;
	  }

	  function circle() {
	    var c = center.apply(this, arguments),
	        r = radius.apply(this, arguments) * radians,
	        p = precision.apply(this, arguments) * radians;
	    ring = [];
	    rotate = rotateRadians(-c[0] * radians, -c[1] * radians, 0).invert;
	    circleStream(stream, r, p, 1);
	    c = {type: "Polygon", coordinates: [ring]};
	    ring = rotate = null;
	    return c;
	  }

	  circle.center = function(_) {
	    return arguments.length ? (center = typeof _ === "function" ? _ : constant$13([+_[0], +_[1]]), circle) : center;
	  };

	  circle.radius = function(_) {
	    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$13(+_), circle) : radius;
	  };

	  circle.precision = function(_) {
	    return arguments.length ? (precision = typeof _ === "function" ? _ : constant$13(+_), circle) : precision;
	  };

	  return circle;
	};

	var clipBuffer = function() {
	  var lines = [],
	      line;
	  return {
	    point: function(x, y) {
	      line.push([x, y]);
	    },
	    lineStart: function() {
	      lines.push(line = []);
	    },
	    lineEnd: noop$2,
	    rejoin: function() {
	      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
	    },
	    result: function() {
	      var result = lines;
	      lines = [];
	      line = null;
	      return result;
	    }
	  };
	};

	var clipLine = function(a, b, x0, y0, x1, y1) {
	  var ax = a[0],
	      ay = a[1],
	      bx = b[0],
	      by = b[1],
	      t0 = 0,
	      t1 = 1,
	      dx = bx - ax,
	      dy = by - ay,
	      r;

	  r = x0 - ax;
	  if (!dx && r > 0) return;
	  r /= dx;
	  if (dx < 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  } else if (dx > 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  }

	  r = x1 - ax;
	  if (!dx && r < 0) return;
	  r /= dx;
	  if (dx < 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  } else if (dx > 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  }

	  r = y0 - ay;
	  if (!dy && r > 0) return;
	  r /= dy;
	  if (dy < 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  } else if (dy > 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  }

	  r = y1 - ay;
	  if (!dy && r < 0) return;
	  r /= dy;
	  if (dy < 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  } else if (dy > 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  }

	  if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
	  if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
	  return true;
	};

	var pointEqual = function(a, b) {
	  return abs(a[0] - b[0]) < epsilon$4 && abs(a[1] - b[1]) < epsilon$4;
	};

	function Intersection(point, points, other, entry) {
	  this.x = point;
	  this.z = points;
	  this.o = other; // another intersection
	  this.e = entry; // is an entry?
	  this.v = false; // visited
	  this.n = this.p = null; // next & previous
	}

	// A generalized polygon clipping algorithm: given a polygon that has been cut
	// into its visible line segments, and rejoins the segments by interpolating
	// along the clip edge.
	var clipPolygon = function(segments, compareIntersection, startInside, interpolate, stream) {
	  var subject = [],
	      clip = [],
	      i,
	      n;

	  segments.forEach(function(segment) {
	    if ((n = segment.length - 1) <= 0) return;
	    var n, p0 = segment[0], p1 = segment[n], x;

	    // If the first and last points of a segment are coincident, then treat as a
	    // closed ring. TODO if all rings are closed, then the winding order of the
	    // exterior ring should be checked.
	    if (pointEqual(p0, p1)) {
	      stream.lineStart();
	      for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
	      stream.lineEnd();
	      return;
	    }

	    subject.push(x = new Intersection(p0, segment, null, true));
	    clip.push(x.o = new Intersection(p0, null, x, false));
	    subject.push(x = new Intersection(p1, segment, null, false));
	    clip.push(x.o = new Intersection(p1, null, x, true));
	  });

	  if (!subject.length) return;

	  clip.sort(compareIntersection);
	  link$1(subject);
	  link$1(clip);

	  for (i = 0, n = clip.length; i < n; ++i) {
	    clip[i].e = startInside = !startInside;
	  }

	  var start = subject[0],
	      points,
	      point;

	  while (1) {
	    // Find first unvisited intersection.
	    var current = start,
	        isSubject = true;
	    while (current.v) if ((current = current.n) === start) return;
	    points = current.z;
	    stream.lineStart();
	    do {
	      current.v = current.o.v = true;
	      if (current.e) {
	        if (isSubject) {
	          for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
	        } else {
	          interpolate(current.x, current.n.x, 1, stream);
	        }
	        current = current.n;
	      } else {
	        if (isSubject) {
	          points = current.p.z;
	          for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
	        } else {
	          interpolate(current.x, current.p.x, -1, stream);
	        }
	        current = current.p;
	      }
	      current = current.o;
	      points = current.z;
	      isSubject = !isSubject;
	    } while (!current.v);
	    stream.lineEnd();
	  }
	};

	function link$1(array) {
	  if (!(n = array.length)) return;
	  var n,
	      i = 0,
	      a = array[0],
	      b;
	  while (++i < n) {
	    a.n = b = array[i];
	    b.p = a;
	    a = b;
	  }
	  a.n = b = array[0];
	  b.p = a;
	}

	var clipMax = 1e9;
	var clipMin = -clipMax;

	// TODO Use d3-polygon’s polygonContains here for the ring check?
	// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

	function clipExtent(x0, y0, x1, y1) {

	  function visible(x, y) {
	    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
	  }

	  function interpolate(from, to, direction, stream) {
	    var a = 0, a1 = 0;
	    if (from == null
	        || (a = corner(from, direction)) !== (a1 = corner(to, direction))
	        || comparePoint(from, to) < 0 ^ direction > 0) {
	      do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
	      while ((a = (a + direction + 4) % 4) !== a1);
	    } else {
	      stream.point(to[0], to[1]);
	    }
	  }

	  function corner(p, direction) {
	    return abs(p[0] - x0) < epsilon$4 ? direction > 0 ? 0 : 3
	        : abs(p[0] - x1) < epsilon$4 ? direction > 0 ? 2 : 1
	        : abs(p[1] - y0) < epsilon$4 ? direction > 0 ? 1 : 0
	        : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
	  }

	  function compareIntersection(a, b) {
	    return comparePoint(a.x, b.x);
	  }

	  function comparePoint(a, b) {
	    var ca = corner(a, 1),
	        cb = corner(b, 1);
	    return ca !== cb ? ca - cb
	        : ca === 0 ? b[1] - a[1]
	        : ca === 1 ? a[0] - b[0]
	        : ca === 2 ? a[1] - b[1]
	        : b[0] - a[0];
	  }

	  return function(stream) {
	    var activeStream = stream,
	        bufferStream = clipBuffer(),
	        segments,
	        polygon,
	        ring,
	        x__, y__, v__, // first point
	        x_, y_, v_, // previous point
	        first,
	        clean;

	    var clipStream = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: polygonStart,
	      polygonEnd: polygonEnd
	    };

	    function point(x, y) {
	      if (visible(x, y)) activeStream.point(x, y);
	    }

	    function polygonInside() {
	      var winding = 0;

	      for (var i = 0, n = polygon.length; i < n; ++i) {
	        for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
	          a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
	          if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
	          else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
	        }
	      }

	      return winding;
	    }

	    // Buffer geometry within a polygon and then clip it en masse.
	    function polygonStart() {
	      activeStream = bufferStream, segments = [], polygon = [], clean = true;
	    }

	    function polygonEnd() {
	      var startInside = polygonInside(),
	          cleanInside = clean && startInside,
	          visible = (segments = merge(segments)).length;
	      if (cleanInside || visible) {
	        stream.polygonStart();
	        if (cleanInside) {
	          stream.lineStart();
	          interpolate(null, null, 1, stream);
	          stream.lineEnd();
	        }
	        if (visible) {
	          clipPolygon(segments, compareIntersection, startInside, interpolate, stream);
	        }
	        stream.polygonEnd();
	      }
	      activeStream = stream, segments = polygon = ring = null;
	    }

	    function lineStart() {
	      clipStream.point = linePoint;
	      if (polygon) polygon.push(ring = []);
	      first = true;
	      v_ = false;
	      x_ = y_ = NaN;
	    }

	    // TODO rather than special-case polygons, simply handle them separately.
	    // Ideally, coincident intersection points should be jittered to avoid
	    // clipping issues.
	    function lineEnd() {
	      if (segments) {
	        linePoint(x__, y__);
	        if (v__ && v_) bufferStream.rejoin();
	        segments.push(bufferStream.result());
	      }
	      clipStream.point = point;
	      if (v_) activeStream.lineEnd();
	    }

	    function linePoint(x, y) {
	      var v = visible(x, y);
	      if (polygon) ring.push([x, y]);
	      if (first) {
	        x__ = x, y__ = y, v__ = v;
	        first = false;
	        if (v) {
	          activeStream.lineStart();
	          activeStream.point(x, y);
	        }
	      } else {
	        if (v && v_) activeStream.point(x, y);
	        else {
	          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
	              b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
	          if (clipLine(a, b, x0, y0, x1, y1)) {
	            if (!v_) {
	              activeStream.lineStart();
	              activeStream.point(a[0], a[1]);
	            }
	            activeStream.point(b[0], b[1]);
	            if (!v) activeStream.lineEnd();
	            clean = false;
	          } else if (v) {
	            activeStream.lineStart();
	            activeStream.point(x, y);
	            clean = false;
	          }
	        }
	      }
	      x_ = x, y_ = y, v_ = v;
	    }

	    return clipStream;
	  };
	}

	var extent$1 = function() {
	  var x0 = 0,
	      y0 = 0,
	      x1 = 960,
	      y1 = 500,
	      cache,
	      cacheStream,
	      clip;

	  return clip = {
	    stream: function(stream) {
	      return cache && cacheStream === stream ? cache : cache = clipExtent(x0, y0, x1, y1)(cacheStream = stream);
	    },
	    extent: function(_) {
	      return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
	    }
	  };
	};

	var lengthSum = adder();
	var lambda0$2;
	var sinPhi0$1;
	var cosPhi0$1;

	var lengthStream = {
	  sphere: noop$2,
	  point: noop$2,
	  lineStart: lengthLineStart,
	  lineEnd: noop$2,
	  polygonStart: noop$2,
	  polygonEnd: noop$2
	};

	function lengthLineStart() {
	  lengthStream.point = lengthPointFirst;
	  lengthStream.lineEnd = lengthLineEnd;
	}

	function lengthLineEnd() {
	  lengthStream.point = lengthStream.lineEnd = noop$2;
	}

	function lengthPointFirst(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  lambda0$2 = lambda, sinPhi0$1 = sin$1(phi), cosPhi0$1 = cos$1(phi);
	  lengthStream.point = lengthPoint;
	}

	function lengthPoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var sinPhi = sin$1(phi),
	      cosPhi = cos$1(phi),
	      delta = abs(lambda - lambda0$2),
	      cosDelta = cos$1(delta),
	      sinDelta = sin$1(delta),
	      x = cosPhi * sinDelta,
	      y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta,
	      z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
	  lengthSum.add(atan2(sqrt$1(x * x + y * y), z));
	  lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
	}

	var length$2 = function(object) {
	  lengthSum.reset();
	  geoStream(object, lengthStream);
	  return +lengthSum;
	};

	var coordinates = [null, null];
	var object$1 = {type: "LineString", coordinates: coordinates};

	var distance = function(a, b) {
	  coordinates[0] = a;
	  coordinates[1] = b;
	  return length$2(object$1);
	};

	function graticuleX(y0, y1, dy) {
	  var y = range(y0, y1 - epsilon$4, dy).concat(y1);
	  return function(x) { return y.map(function(y) { return [x, y]; }); };
	}

	function graticuleY(x0, x1, dx) {
	  var x = range(x0, x1 - epsilon$4, dx).concat(x1);
	  return function(y) { return x.map(function(x) { return [x, y]; }); };
	}

	function graticule() {
	  var x1, x0, X1, X0,
	      y1, y0, Y1, Y0,
	      dx = 10, dy = dx, DX = 90, DY = 360,
	      x, y, X, Y,
	      precision = 2.5;

	  function graticule() {
	    return {type: "MultiLineString", coordinates: lines()};
	  }

	  function lines() {
	    return range(ceil(X0 / DX) * DX, X1, DX).map(X)
	        .concat(range(ceil(Y0 / DY) * DY, Y1, DY).map(Y))
	        .concat(range(ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return abs(x % DX) > epsilon$4; }).map(x))
	        .concat(range(ceil(y0 / dy) * dy, y1, dy).filter(function(y) { return abs(y % DY) > epsilon$4; }).map(y));
	  }

	  graticule.lines = function() {
	    return lines().map(function(coordinates) { return {type: "LineString", coordinates: coordinates}; });
	  };

	  graticule.outline = function() {
	    return {
	      type: "Polygon",
	      coordinates: [
	        X(X0).concat(
	        Y(Y1).slice(1),
	        X(X1).reverse().slice(1),
	        Y(Y0).reverse().slice(1))
	      ]
	    };
	  };

	  graticule.extent = function(_) {
	    if (!arguments.length) return graticule.extentMinor();
	    return graticule.extentMajor(_).extentMinor(_);
	  };

	  graticule.extentMajor = function(_) {
	    if (!arguments.length) return [[X0, Y0], [X1, Y1]];
	    X0 = +_[0][0], X1 = +_[1][0];
	    Y0 = +_[0][1], Y1 = +_[1][1];
	    if (X0 > X1) _ = X0, X0 = X1, X1 = _;
	    if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
	    return graticule.precision(precision);
	  };

	  graticule.extentMinor = function(_) {
	    if (!arguments.length) return [[x0, y0], [x1, y1]];
	    x0 = +_[0][0], x1 = +_[1][0];
	    y0 = +_[0][1], y1 = +_[1][1];
	    if (x0 > x1) _ = x0, x0 = x1, x1 = _;
	    if (y0 > y1) _ = y0, y0 = y1, y1 = _;
	    return graticule.precision(precision);
	  };

	  graticule.step = function(_) {
	    if (!arguments.length) return graticule.stepMinor();
	    return graticule.stepMajor(_).stepMinor(_);
	  };

	  graticule.stepMajor = function(_) {
	    if (!arguments.length) return [DX, DY];
	    DX = +_[0], DY = +_[1];
	    return graticule;
	  };

	  graticule.stepMinor = function(_) {
	    if (!arguments.length) return [dx, dy];
	    dx = +_[0], dy = +_[1];
	    return graticule;
	  };

	  graticule.precision = function(_) {
	    if (!arguments.length) return precision;
	    precision = +_;
	    x = graticuleX(y0, y1, 90);
	    y = graticuleY(x0, x1, precision);
	    X = graticuleX(Y0, Y1, 90);
	    Y = graticuleY(X0, X1, precision);
	    return graticule;
	  };

	  return graticule
	      .extentMajor([[-180, -90 + epsilon$4], [180, 90 - epsilon$4]])
	      .extentMinor([[-180, -80 - epsilon$4], [180, 80 + epsilon$4]]);
	}

	function graticule10() {
	  return graticule()();
	}

	var interpolate$2 = function(a, b) {
	  var x0 = a[0] * radians,
	      y0 = a[1] * radians,
	      x1 = b[0] * radians,
	      y1 = b[1] * radians,
	      cy0 = cos$1(y0),
	      sy0 = sin$1(y0),
	      cy1 = cos$1(y1),
	      sy1 = sin$1(y1),
	      kx0 = cy0 * cos$1(x0),
	      ky0 = cy0 * sin$1(x0),
	      kx1 = cy1 * cos$1(x1),
	      ky1 = cy1 * sin$1(x1),
	      d = 2 * asin$1(sqrt$1(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
	      k = sin$1(d);

	  var interpolate = d ? function(t) {
	    var B = sin$1(t *= d) / k,
	        A = sin$1(d - t) / k,
	        x = A * kx0 + B * kx1,
	        y = A * ky0 + B * ky1,
	        z = A * sy0 + B * sy1;
	    return [
	      atan2(y, x) * degrees$1,
	      atan2(z, sqrt$1(x * x + y * y)) * degrees$1
	    ];
	  } : function() {
	    return [x0 * degrees$1, y0 * degrees$1];
	  };

	  interpolate.distance = d;

	  return interpolate;
	};

	var identity$7 = function(x) {
	  return x;
	};

	var areaSum$1 = adder();
	var areaRingSum$1 = adder();
	var x00;
	var y00;
	var x0$1;
	var y0$1;

	var areaStream$1 = {
	  point: noop$2,
	  lineStart: noop$2,
	  lineEnd: noop$2,
	  polygonStart: function() {
	    areaStream$1.lineStart = areaRingStart$1;
	    areaStream$1.lineEnd = areaRingEnd$1;
	  },
	  polygonEnd: function() {
	    areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop$2;
	    areaSum$1.add(abs(areaRingSum$1));
	    areaRingSum$1.reset();
	  },
	  result: function() {
	    var area = areaSum$1 / 2;
	    areaSum$1.reset();
	    return area;
	  }
	};

	function areaRingStart$1() {
	  areaStream$1.point = areaPointFirst$1;
	}

	function areaPointFirst$1(x, y) {
	  areaStream$1.point = areaPoint$1;
	  x00 = x0$1 = x, y00 = y0$1 = y;
	}

	function areaPoint$1(x, y) {
	  areaRingSum$1.add(y0$1 * x - x0$1 * y);
	  x0$1 = x, y0$1 = y;
	}

	function areaRingEnd$1() {
	  areaPoint$1(x00, y00);
	}

	var x0$2 = Infinity;
	var y0$2 = x0$2;
	var x1 = -x0$2;
	var y1 = x1;

	var boundsStream$1 = {
	  point: boundsPoint$1,
	  lineStart: noop$2,
	  lineEnd: noop$2,
	  polygonStart: noop$2,
	  polygonEnd: noop$2,
	  result: function() {
	    var bounds = [[x0$2, y0$2], [x1, y1]];
	    x1 = y1 = -(y0$2 = x0$2 = Infinity);
	    return bounds;
	  }
	};

	function boundsPoint$1(x, y) {
	  if (x < x0$2) x0$2 = x;
	  if (x > x1) x1 = x;
	  if (y < y0$2) y0$2 = y;
	  if (y > y1) y1 = y;
	}

	// TODO Enforce positive area for exterior, negative area for interior?

	var X0$1 = 0;
	var Y0$1 = 0;
	var Z0$1 = 0;
	var X1$1 = 0;
	var Y1$1 = 0;
	var Z1$1 = 0;
	var X2$1 = 0;
	var Y2$1 = 0;
	var Z2$1 = 0;
	var x00$1;
	var y00$1;
	var x0$3;
	var y0$3;

	var centroidStream$1 = {
	  point: centroidPoint$1,
	  lineStart: centroidLineStart$1,
	  lineEnd: centroidLineEnd$1,
	  polygonStart: function() {
	    centroidStream$1.lineStart = centroidRingStart$1;
	    centroidStream$1.lineEnd = centroidRingEnd$1;
	  },
	  polygonEnd: function() {
	    centroidStream$1.point = centroidPoint$1;
	    centroidStream$1.lineStart = centroidLineStart$1;
	    centroidStream$1.lineEnd = centroidLineEnd$1;
	  },
	  result: function() {
	    var centroid = Z2$1 ? [X2$1 / Z2$1, Y2$1 / Z2$1]
	        : Z1$1 ? [X1$1 / Z1$1, Y1$1 / Z1$1]
	        : Z0$1 ? [X0$1 / Z0$1, Y0$1 / Z0$1]
	        : [NaN, NaN];
	    X0$1 = Y0$1 = Z0$1 =
	    X1$1 = Y1$1 = Z1$1 =
	    X2$1 = Y2$1 = Z2$1 = 0;
	    return centroid;
	  }
	};

	function centroidPoint$1(x, y) {
	  X0$1 += x;
	  Y0$1 += y;
	  ++Z0$1;
	}

	function centroidLineStart$1() {
	  centroidStream$1.point = centroidPointFirstLine;
	}

	function centroidPointFirstLine(x, y) {
	  centroidStream$1.point = centroidPointLine;
	  centroidPoint$1(x0$3 = x, y0$3 = y);
	}

	function centroidPointLine(x, y) {
	  var dx = x - x0$3, dy = y - y0$3, z = sqrt$1(dx * dx + dy * dy);
	  X1$1 += z * (x0$3 + x) / 2;
	  Y1$1 += z * (y0$3 + y) / 2;
	  Z1$1 += z;
	  centroidPoint$1(x0$3 = x, y0$3 = y);
	}

	function centroidLineEnd$1() {
	  centroidStream$1.point = centroidPoint$1;
	}

	function centroidRingStart$1() {
	  centroidStream$1.point = centroidPointFirstRing;
	}

	function centroidRingEnd$1() {
	  centroidPointRing(x00$1, y00$1);
	}

	function centroidPointFirstRing(x, y) {
	  centroidStream$1.point = centroidPointRing;
	  centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
	}

	function centroidPointRing(x, y) {
	  var dx = x - x0$3,
	      dy = y - y0$3,
	      z = sqrt$1(dx * dx + dy * dy);

	  X1$1 += z * (x0$3 + x) / 2;
	  Y1$1 += z * (y0$3 + y) / 2;
	  Z1$1 += z;

	  z = y0$3 * x - x0$3 * y;
	  X2$1 += z * (x0$3 + x);
	  Y2$1 += z * (y0$3 + y);
	  Z2$1 += z * 3;
	  centroidPoint$1(x0$3 = x, y0$3 = y);
	}

	function PathContext(context) {
	  this._context = context;
	}

	PathContext.prototype = {
	  _radius: 4.5,
	  pointRadius: function(_) {
	    return this._radius = _, this;
	  },
	  polygonStart: function() {
	    this._line = 0;
	  },
	  polygonEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line === 0) this._context.closePath();
	    this._point = NaN;
	  },
	  point: function(x, y) {
	    switch (this._point) {
	      case 0: {
	        this._context.moveTo(x, y);
	        this._point = 1;
	        break;
	      }
	      case 1: {
	        this._context.lineTo(x, y);
	        break;
	      }
	      default: {
	        this._context.moveTo(x + this._radius, y);
	        this._context.arc(x, y, this._radius, 0, tau$4);
	        break;
	      }
	    }
	  },
	  result: noop$2
	};

	function PathString() {
	  this._string = [];
	}

	PathString.prototype = {
	  _circle: circle$2(4.5),
	  pointRadius: function(_) {
	    return this._circle = circle$2(_), this;
	  },
	  polygonStart: function() {
	    this._line = 0;
	  },
	  polygonEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line === 0) this._string.push("Z");
	    this._point = NaN;
	  },
	  point: function(x, y) {
	    switch (this._point) {
	      case 0: {
	        this._string.push("M", x, ",", y);
	        this._point = 1;
	        break;
	      }
	      case 1: {
	        this._string.push("L", x, ",", y);
	        break;
	      }
	      default: {
	        this._string.push("M", x, ",", y, this._circle);
	        break;
	      }
	    }
	  },
	  result: function() {
	    if (this._string.length) {
	      var result = this._string.join("");
	      this._string = [];
	      return result;
	    }
	  }
	};

	function circle$2(radius) {
	  return "m0," + radius
	      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
	      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
	      + "z";
	}

	var index$3 = function(projection, context) {
	  var pointRadius = 4.5,
	      projectionStream,
	      contextStream;

	  function path(object) {
	    if (object) {
	      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
	      geoStream(object, projectionStream(contextStream));
	    }
	    return contextStream.result();
	  }

	  path.area = function(object) {
	    geoStream(object, projectionStream(areaStream$1));
	    return areaStream$1.result();
	  };

	  path.bounds = function(object) {
	    geoStream(object, projectionStream(boundsStream$1));
	    return boundsStream$1.result();
	  };

	  path.centroid = function(object) {
	    geoStream(object, projectionStream(centroidStream$1));
	    return centroidStream$1.result();
	  };

	  path.projection = function(_) {
	    return arguments.length ? (projectionStream = _ == null ? (projection = null, identity$7) : (projection = _).stream, path) : projection;
	  };

	  path.context = function(_) {
	    if (!arguments.length) return context;
	    contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
	    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
	    return path;
	  };

	  path.pointRadius = function(_) {
	    if (!arguments.length) return pointRadius;
	    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
	    return path;
	  };

	  return path.projection(projection).context(context);
	};

	var sum$2 = adder();

	var polygonContains = function(polygon, point) {
	  var lambda = point[0],
	      phi = point[1],
	      normal = [sin$1(lambda), -cos$1(lambda), 0],
	      angle = 0,
	      winding = 0;

	  sum$2.reset();

	  for (var i = 0, n = polygon.length; i < n; ++i) {
	    if (!(m = (ring = polygon[i]).length)) continue;
	    var ring,
	        m,
	        point0 = ring[m - 1],
	        lambda0 = point0[0],
	        phi0 = point0[1] / 2 + quarterPi,
	        sinPhi0 = sin$1(phi0),
	        cosPhi0 = cos$1(phi0);

	    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
	      var point1 = ring[j],
	          lambda1 = point1[0],
	          phi1 = point1[1] / 2 + quarterPi,
	          sinPhi1 = sin$1(phi1),
	          cosPhi1 = cos$1(phi1),
	          delta = lambda1 - lambda0,
	          sign$$1 = delta >= 0 ? 1 : -1,
	          absDelta = sign$$1 * delta,
	          antimeridian = absDelta > pi$4,
	          k = sinPhi0 * sinPhi1;

	      sum$2.add(atan2(k * sign$$1 * sin$1(absDelta), cosPhi0 * cosPhi1 + k * cos$1(absDelta)));
	      angle += antimeridian ? delta + sign$$1 * tau$4 : delta;

	      // Are the longitudes either side of the point’s meridian (lambda),
	      // and are the latitudes smaller than the parallel (phi)?
	      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
	        var arc = cartesianCross(cartesian(point0), cartesian(point1));
	        cartesianNormalizeInPlace(arc);
	        var intersection = cartesianCross(normal, arc);
	        cartesianNormalizeInPlace(intersection);
	        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin$1(intersection[2]);
	        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
	          winding += antimeridian ^ delta >= 0 ? 1 : -1;
	        }
	      }
	    }
	  }

	  // First, determine whether the South pole is inside or outside:
	  //
	  // It is inside if:
	  // * the polygon winds around it in a clockwise direction.
	  // * the polygon does not (cumulatively) wind around it, but has a negative
	  //   (counter-clockwise) area.
	  //
	  // Second, count the (signed) number of times a segment crosses a lambda
	  // from the point to the South pole.  If it is zero, then the point is the
	  // same side as the South pole.

	  return (angle < -epsilon$4 || angle < epsilon$4 && sum$2 < -epsilon$4) ^ (winding & 1);
	};

	var clip = function(pointVisible, clipLine, interpolate, start) {
	  return function(rotate, sink) {
	    var line = clipLine(sink),
	        rotatedStart = rotate.invert(start[0], start[1]),
	        ringBuffer = clipBuffer(),
	        ringSink = clipLine(ringBuffer),
	        polygonStarted = false,
	        polygon,
	        segments,
	        ring;

	    var clip = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: function() {
	        clip.point = pointRing;
	        clip.lineStart = ringStart;
	        clip.lineEnd = ringEnd;
	        segments = [];
	        polygon = [];
	      },
	      polygonEnd: function() {
	        clip.point = point;
	        clip.lineStart = lineStart;
	        clip.lineEnd = lineEnd;
	        segments = merge(segments);
	        var startInside = polygonContains(polygon, rotatedStart);
	        if (segments.length) {
	          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
	          clipPolygon(segments, compareIntersection, startInside, interpolate, sink);
	        } else if (startInside) {
	          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
	          sink.lineStart();
	          interpolate(null, null, 1, sink);
	          sink.lineEnd();
	        }
	        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
	        segments = polygon = null;
	      },
	      sphere: function() {
	        sink.polygonStart();
	        sink.lineStart();
	        interpolate(null, null, 1, sink);
	        sink.lineEnd();
	        sink.polygonEnd();
	      }
	    };

	    function point(lambda, phi) {
	      var point = rotate(lambda, phi);
	      if (pointVisible(lambda = point[0], phi = point[1])) sink.point(lambda, phi);
	    }

	    function pointLine(lambda, phi) {
	      var point = rotate(lambda, phi);
	      line.point(point[0], point[1]);
	    }

	    function lineStart() {
	      clip.point = pointLine;
	      line.lineStart();
	    }

	    function lineEnd() {
	      clip.point = point;
	      line.lineEnd();
	    }

	    function pointRing(lambda, phi) {
	      ring.push([lambda, phi]);
	      var point = rotate(lambda, phi);
	      ringSink.point(point[0], point[1]);
	    }

	    function ringStart() {
	      ringSink.lineStart();
	      ring = [];
	    }

	    function ringEnd() {
	      pointRing(ring[0][0], ring[0][1]);
	      ringSink.lineEnd();

	      var clean = ringSink.clean(),
	          ringSegments = ringBuffer.result(),
	          i, n = ringSegments.length, m,
	          segment,
	          point;

	      ring.pop();
	      polygon.push(ring);
	      ring = null;

	      if (!n) return;

	      // No intersections.
	      if (clean & 1) {
	        segment = ringSegments[0];
	        if ((m = segment.length - 1) > 0) {
	          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
	          sink.lineStart();
	          for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
	          sink.lineEnd();
	        }
	        return;
	      }

	      // Rejoin connected segments.
	      // TODO reuse ringBuffer.rejoin()?
	      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

	      segments.push(ringSegments.filter(validSegment));
	    }

	    return clip;
	  };
	};

	function validSegment(segment) {
	  return segment.length > 1;
	}

	// Intersections are sorted along the clip edge. For both antimeridian cutting
	// and circle clipping, the same comparison is used.
	function compareIntersection(a, b) {
	  return ((a = a.x)[0] < 0 ? a[1] - halfPi$3 - epsilon$4 : halfPi$3 - a[1])
	       - ((b = b.x)[0] < 0 ? b[1] - halfPi$3 - epsilon$4 : halfPi$3 - b[1]);
	}

	var clipAntimeridian = clip(
	  function() { return true; },
	  clipAntimeridianLine,
	  clipAntimeridianInterpolate,
	  [-pi$4, -halfPi$3]
	);

	// Takes a line and cuts into visible segments. Return values: 0 - there were
	// intersections or the line was empty; 1 - no intersections; 2 - there were
	// intersections, and the first and last segments should be rejoined.
	function clipAntimeridianLine(stream) {
	  var lambda0 = NaN,
	      phi0 = NaN,
	      sign0 = NaN,
	      clean; // no intersections

	  return {
	    lineStart: function() {
	      stream.lineStart();
	      clean = 1;
	    },
	    point: function(lambda1, phi1) {
	      var sign1 = lambda1 > 0 ? pi$4 : -pi$4,
	          delta = abs(lambda1 - lambda0);
	      if (abs(delta - pi$4) < epsilon$4) { // line crosses a pole
	        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi$3 : -halfPi$3);
	        stream.point(sign0, phi0);
	        stream.lineEnd();
	        stream.lineStart();
	        stream.point(sign1, phi0);
	        stream.point(lambda1, phi0);
	        clean = 0;
	      } else if (sign0 !== sign1 && delta >= pi$4) { // line crosses antimeridian
	        if (abs(lambda0 - sign0) < epsilon$4) lambda0 -= sign0 * epsilon$4; // handle degeneracies
	        if (abs(lambda1 - sign1) < epsilon$4) lambda1 -= sign1 * epsilon$4;
	        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
	        stream.point(sign0, phi0);
	        stream.lineEnd();
	        stream.lineStart();
	        stream.point(sign1, phi0);
	        clean = 0;
	      }
	      stream.point(lambda0 = lambda1, phi0 = phi1);
	      sign0 = sign1;
	    },
	    lineEnd: function() {
	      stream.lineEnd();
	      lambda0 = phi0 = NaN;
	    },
	    clean: function() {
	      return 2 - clean; // if intersections, rejoin first and last segments
	    }
	  };
	}

	function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
	  var cosPhi0,
	      cosPhi1,
	      sinLambda0Lambda1 = sin$1(lambda0 - lambda1);
	  return abs(sinLambda0Lambda1) > epsilon$4
	      ? atan((sin$1(phi0) * (cosPhi1 = cos$1(phi1)) * sin$1(lambda1)
	          - sin$1(phi1) * (cosPhi0 = cos$1(phi0)) * sin$1(lambda0))
	          / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
	      : (phi0 + phi1) / 2;
	}

	function clipAntimeridianInterpolate(from, to, direction, stream) {
	  var phi;
	  if (from == null) {
	    phi = direction * halfPi$3;
	    stream.point(-pi$4, phi);
	    stream.point(0, phi);
	    stream.point(pi$4, phi);
	    stream.point(pi$4, 0);
	    stream.point(pi$4, -phi);
	    stream.point(0, -phi);
	    stream.point(-pi$4, -phi);
	    stream.point(-pi$4, 0);
	    stream.point(-pi$4, phi);
	  } else if (abs(from[0] - to[0]) > epsilon$4) {
	    var lambda = from[0] < to[0] ? pi$4 : -pi$4;
	    phi = direction * lambda / 2;
	    stream.point(-lambda, phi);
	    stream.point(0, phi);
	    stream.point(lambda, phi);
	  } else {
	    stream.point(to[0], to[1]);
	  }
	}

	var clipCircle = function(radius, delta) {
	  var cr = cos$1(radius),
	      smallRadius = cr > 0,
	      notHemisphere = abs(cr) > epsilon$4; // TODO optimise for this common case

	  function interpolate(from, to, direction, stream) {
	    circleStream(stream, radius, delta, direction, from, to);
	  }

	  function visible(lambda, phi) {
	    return cos$1(lambda) * cos$1(phi) > cr;
	  }

	  // Takes a line and cuts into visible segments. Return values used for polygon
	  // clipping: 0 - there were intersections or the line was empty; 1 - no
	  // intersections 2 - there were intersections, and the first and last segments
	  // should be rejoined.
	  function clipLine(stream) {
	    var point0, // previous point
	        c0, // code for previous point
	        v0, // visibility of previous point
	        v00, // visibility of first point
	        clean; // no intersections
	    return {
	      lineStart: function() {
	        v00 = v0 = false;
	        clean = 1;
	      },
	      point: function(lambda, phi) {
	        var point1 = [lambda, phi],
	            point2,
	            v = visible(lambda, phi),
	            c = smallRadius
	              ? v ? 0 : code(lambda, phi)
	              : v ? code(lambda + (lambda < 0 ? pi$4 : -pi$4), phi) : 0;
	        if (!point0 && (v00 = v0 = v)) stream.lineStart();
	        // Handle degeneracies.
	        // TODO ignore if not clipping polygons.
	        if (v !== v0) {
	          point2 = intersect(point0, point1);
	          if (pointEqual(point0, point2) || pointEqual(point1, point2)) {
	            point1[0] += epsilon$4;
	            point1[1] += epsilon$4;
	            v = visible(point1[0], point1[1]);
	          }
	        }
	        if (v !== v0) {
	          clean = 0;
	          if (v) {
	            // outside going in
	            stream.lineStart();
	            point2 = intersect(point1, point0);
	            stream.point(point2[0], point2[1]);
	          } else {
	            // inside going out
	            point2 = intersect(point0, point1);
	            stream.point(point2[0], point2[1]);
	            stream.lineEnd();
	          }
	          point0 = point2;
	        } else if (notHemisphere && point0 && smallRadius ^ v) {
	          var t;
	          // If the codes for two points are different, or are both zero,
	          // and there this segment intersects with the small circle.
	          if (!(c & c0) && (t = intersect(point1, point0, true))) {
	            clean = 0;
	            if (smallRadius) {
	              stream.lineStart();
	              stream.point(t[0][0], t[0][1]);
	              stream.point(t[1][0], t[1][1]);
	              stream.lineEnd();
	            } else {
	              stream.point(t[1][0], t[1][1]);
	              stream.lineEnd();
	              stream.lineStart();
	              stream.point(t[0][0], t[0][1]);
	            }
	          }
	        }
	        if (v && (!point0 || !pointEqual(point0, point1))) {
	          stream.point(point1[0], point1[1]);
	        }
	        point0 = point1, v0 = v, c0 = c;
	      },
	      lineEnd: function() {
	        if (v0) stream.lineEnd();
	        point0 = null;
	      },
	      // Rejoin first and last segments if there were intersections and the first
	      // and last points were visible.
	      clean: function() {
	        return clean | ((v00 && v0) << 1);
	      }
	    };
	  }

	  // Intersects the great circle between a and b with the clip circle.
	  function intersect(a, b, two) {
	    var pa = cartesian(a),
	        pb = cartesian(b);

	    // We have two planes, n1.p = d1 and n2.p = d2.
	    // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
	    var n1 = [1, 0, 0], // normal
	        n2 = cartesianCross(pa, pb),
	        n2n2 = cartesianDot(n2, n2),
	        n1n2 = n2[0], // cartesianDot(n1, n2),
	        determinant = n2n2 - n1n2 * n1n2;

	    // Two polar points.
	    if (!determinant) return !two && a;

	    var c1 =  cr * n2n2 / determinant,
	        c2 = -cr * n1n2 / determinant,
	        n1xn2 = cartesianCross(n1, n2),
	        A = cartesianScale(n1, c1),
	        B = cartesianScale(n2, c2);
	    cartesianAddInPlace(A, B);

	    // Solve |p(t)|^2 = 1.
	    var u = n1xn2,
	        w = cartesianDot(A, u),
	        uu = cartesianDot(u, u),
	        t2 = w * w - uu * (cartesianDot(A, A) - 1);

	    if (t2 < 0) return;

	    var t = sqrt$1(t2),
	        q = cartesianScale(u, (-w - t) / uu);
	    cartesianAddInPlace(q, A);
	    q = spherical(q);

	    if (!two) return q;

	    // Two intersection points.
	    var lambda0 = a[0],
	        lambda1 = b[0],
	        phi0 = a[1],
	        phi1 = b[1],
	        z;

	    if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

	    var delta = lambda1 - lambda0,
	        polar = abs(delta - pi$4) < epsilon$4,
	        meridian = polar || delta < epsilon$4;

	    if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

	    // Check that the first point is between a and b.
	    if (meridian
	        ? polar
	          ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon$4 ? phi0 : phi1)
	          : phi0 <= q[1] && q[1] <= phi1
	        : delta > pi$4 ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
	      var q1 = cartesianScale(u, (-w + t) / uu);
	      cartesianAddInPlace(q1, A);
	      return [q, spherical(q1)];
	    }
	  }

	  // Generates a 4-bit vector representing the location of a point relative to
	  // the small circle's bounding box.
	  function code(lambda, phi) {
	    var r = smallRadius ? radius : pi$4 - radius,
	        code = 0;
	    if (lambda < -r) code |= 1; // left
	    else if (lambda > r) code |= 2; // right
	    if (phi < -r) code |= 4; // below
	    else if (phi > r) code |= 8; // above
	    return code;
	  }

	  return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi$4, radius - pi$4]);
	};

	var transform$1 = function(methods) {
	  return {
	    stream: transformer(methods)
	  };
	};

	function transformer(methods) {
	  return function(stream) {
	    var s = new TransformStream;
	    for (var key in methods) s[key] = methods[key];
	    s.stream = stream;
	    return s;
	  };
	}

	function TransformStream() {}

	TransformStream.prototype = {
	  constructor: TransformStream,
	  point: function(x, y) { this.stream.point(x, y); },
	  sphere: function() { this.stream.sphere(); },
	  lineStart: function() { this.stream.lineStart(); },
	  lineEnd: function() { this.stream.lineEnd(); },
	  polygonStart: function() { this.stream.polygonStart(); },
	  polygonEnd: function() { this.stream.polygonEnd(); }
	};

	function fitExtent(projection, extent, object) {
	  var w = extent[1][0] - extent[0][0],
	      h = extent[1][1] - extent[0][1],
	      clip = projection.clipExtent && projection.clipExtent();

	  projection
	      .scale(150)
	      .translate([0, 0]);

	  if (clip != null) projection.clipExtent(null);

	  geoStream(object, projection.stream(boundsStream$1));

	  var b = boundsStream$1.result(),
	      k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
	      x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
	      y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;

	  if (clip != null) projection.clipExtent(clip);

	  return projection
	      .scale(k * 150)
	      .translate([x, y]);
	}

	function fitSize(projection, size, object) {
	  return fitExtent(projection, [[0, 0], size], object);
	}

	var maxDepth = 16;
	var cosMinDistance = cos$1(30 * radians); // cos(minimum angular distance)

	var resample = function(project, delta2) {
	  return +delta2 ? resample$1(project, delta2) : resampleNone(project);
	};

	function resampleNone(project) {
	  return transformer({
	    point: function(x, y) {
	      x = project(x, y);
	      this.stream.point(x[0], x[1]);
	    }
	  });
	}

	function resample$1(project, delta2) {

	  function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
	    var dx = x1 - x0,
	        dy = y1 - y0,
	        d2 = dx * dx + dy * dy;
	    if (d2 > 4 * delta2 && depth--) {
	      var a = a0 + a1,
	          b = b0 + b1,
	          c = c0 + c1,
	          m = sqrt$1(a * a + b * b + c * c),
	          phi2 = asin$1(c /= m),
	          lambda2 = abs(abs(c) - 1) < epsilon$4 || abs(lambda0 - lambda1) < epsilon$4 ? (lambda0 + lambda1) / 2 : atan2(b, a),
	          p = project(lambda2, phi2),
	          x2 = p[0],
	          y2 = p[1],
	          dx2 = x2 - x0,
	          dy2 = y2 - y0,
	          dz = dy * dx2 - dx * dy2;
	      if (dz * dz / d2 > delta2 // perpendicular projected distance
	          || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
	          || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
	        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
	        stream.point(x2, y2);
	        resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
	      }
	    }
	  }
	  return function(stream) {
	    var lambda00, x00, y00, a00, b00, c00, // first point
	        lambda0, x0, y0, a0, b0, c0; // previous point

	    var resampleStream = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
	      polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
	    };

	    function point(x, y) {
	      x = project(x, y);
	      stream.point(x[0], x[1]);
	    }

	    function lineStart() {
	      x0 = NaN;
	      resampleStream.point = linePoint;
	      stream.lineStart();
	    }

	    function linePoint(lambda, phi) {
	      var c = cartesian([lambda, phi]), p = project(lambda, phi);
	      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
	      stream.point(x0, y0);
	    }

	    function lineEnd() {
	      resampleStream.point = point;
	      stream.lineEnd();
	    }

	    function ringStart() {
	      lineStart();
	      resampleStream.point = ringPoint;
	      resampleStream.lineEnd = ringEnd;
	    }

	    function ringPoint(lambda, phi) {
	      linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
	      resampleStream.point = linePoint;
	    }

	    function ringEnd() {
	      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
	      resampleStream.lineEnd = lineEnd;
	      lineEnd();
	    }

	    return resampleStream;
	  };
	}

	var transformRadians = transformer({
	  point: function(x, y) {
	    this.stream.point(x * radians, y * radians);
	  }
	});

	function projection(project) {
	  return projectionMutator(function() { return project; })();
	}

	function projectionMutator(projectAt) {
	  var project,
	      k = 150, // scale
	      x = 480, y = 250, // translate
	      dx, dy, lambda = 0, phi = 0, // center
	      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, projectRotate, // rotate
	      theta = null, preclip = clipAntimeridian, // clip angle
	      x0 = null, y0, x1, y1, postclip = identity$7, // clip extent
	      delta2 = 0.5, projectResample = resample(projectTransform, delta2), // precision
	      cache,
	      cacheStream;

	  function projection(point) {
	    point = projectRotate(point[0] * radians, point[1] * radians);
	    return [point[0] * k + dx, dy - point[1] * k];
	  }

	  function invert(point) {
	    point = projectRotate.invert((point[0] - dx) / k, (dy - point[1]) / k);
	    return point && [point[0] * degrees$1, point[1] * degrees$1];
	  }

	  function projectTransform(x, y) {
	    return x = project(x, y), [x[0] * k + dx, dy - x[1] * k];
	  }

	  projection.stream = function(stream) {
	    return cache && cacheStream === stream ? cache : cache = transformRadians(preclip(rotate, projectResample(postclip(cacheStream = stream))));
	  };

	  projection.clipAngle = function(_) {
	    return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians, 6 * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees$1;
	  };

	  projection.clipExtent = function(_) {
	    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity$7) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
	  };

	  projection.scale = function(_) {
	    return arguments.length ? (k = +_, recenter()) : k;
	  };

	  projection.translate = function(_) {
	    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
	  };

	  projection.center = function(_) {
	    return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees$1, phi * degrees$1];
	  };

	  projection.rotate = function(_) {
	    return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees$1, deltaPhi * degrees$1, deltaGamma * degrees$1];
	  };

	  projection.precision = function(_) {
	    return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt$1(delta2);
	  };

	  projection.fitExtent = function(extent, object) {
	    return fitExtent(projection, extent, object);
	  };

	  projection.fitSize = function(size, object) {
	    return fitSize(projection, size, object);
	  };

	  function recenter() {
	    projectRotate = compose(rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma), project);
	    var center = project(lambda, phi);
	    dx = x - center[0] * k;
	    dy = y + center[1] * k;
	    return reset();
	  }

	  function reset() {
	    cache = cacheStream = null;
	    return projection;
	  }

	  return function() {
	    project = projectAt.apply(this, arguments);
	    projection.invert = project.invert && invert;
	    return recenter();
	  };
	}

	function conicProjection(projectAt) {
	  var phi0 = 0,
	      phi1 = pi$4 / 3,
	      m = projectionMutator(projectAt),
	      p = m(phi0, phi1);

	  p.parallels = function(_) {
	    return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees$1, phi1 * degrees$1];
	  };

	  return p;
	}

	function cylindricalEqualAreaRaw(phi0) {
	  var cosPhi0 = cos$1(phi0);

	  function forward(lambda, phi) {
	    return [lambda * cosPhi0, sin$1(phi) / cosPhi0];
	  }

	  forward.invert = function(x, y) {
	    return [x / cosPhi0, asin$1(y * cosPhi0)];
	  };

	  return forward;
	}

	function conicEqualAreaRaw(y0, y1) {
	  var sy0 = sin$1(y0), n = (sy0 + sin$1(y1)) / 2;

	  // Are the parallels symmetrical around the Equator?
	  if (abs(n) < epsilon$4) return cylindricalEqualAreaRaw(y0);

	  var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt$1(c) / n;

	  function project(x, y) {
	    var r = sqrt$1(c - 2 * n * sin$1(y)) / n;
	    return [r * sin$1(x *= n), r0 - r * cos$1(x)];
	  }

	  project.invert = function(x, y) {
	    var r0y = r0 - y;
	    return [atan2(x, abs(r0y)) / n * sign$1(r0y), asin$1((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
	  };

	  return project;
	}

	var conicEqualArea = function() {
	  return conicProjection(conicEqualAreaRaw)
	      .scale(155.424)
	      .center([0, 33.6442]);
	};

	var albers = function() {
	  return conicEqualArea()
	      .parallels([29.5, 45.5])
	      .scale(1070)
	      .translate([480, 250])
	      .rotate([96, 0])
	      .center([-0.6, 38.7]);
	};

	// The projections must have mutually exclusive clip regions on the sphere,
	// as this will avoid emitting interleaving lines and polygons.
	function multiplex(streams) {
	  var n = streams.length;
	  return {
	    point: function(x, y) { var i = -1; while (++i < n) streams[i].point(x, y); },
	    sphere: function() { var i = -1; while (++i < n) streams[i].sphere(); },
	    lineStart: function() { var i = -1; while (++i < n) streams[i].lineStart(); },
	    lineEnd: function() { var i = -1; while (++i < n) streams[i].lineEnd(); },
	    polygonStart: function() { var i = -1; while (++i < n) streams[i].polygonStart(); },
	    polygonEnd: function() { var i = -1; while (++i < n) streams[i].polygonEnd(); }
	  };
	}

	// A composite projection for the United States, configured by default for
	// 960×500. The projection also works quite well at 960×600 if you change the
	// scale to 1285 and adjust the translate accordingly. The set of standard
	// parallels for each region comes from USGS, which is published here:
	// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
	var albersUsa = function() {
	  var cache,
	      cacheStream,
	      lower48 = albers(), lower48Point,
	      alaska = conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, // EPSG:3338
	      hawaii = conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, // ESRI:102007
	      point, pointStream = {point: function(x, y) { point = [x, y]; }};

	  function albersUsa(coordinates) {
	    var x = coordinates[0], y = coordinates[1];
	    return point = null,
	        (lower48Point.point(x, y), point)
	        || (alaskaPoint.point(x, y), point)
	        || (hawaiiPoint.point(x, y), point);
	  }

	  albersUsa.invert = function(coordinates) {
	    var k = lower48.scale(),
	        t = lower48.translate(),
	        x = (coordinates[0] - t[0]) / k,
	        y = (coordinates[1] - t[1]) / k;
	    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
	        : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
	        : lower48).invert(coordinates);
	  };

	  albersUsa.stream = function(stream) {
	    return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
	  };

	  albersUsa.precision = function(_) {
	    if (!arguments.length) return lower48.precision();
	    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
	    return reset();
	  };

	  albersUsa.scale = function(_) {
	    if (!arguments.length) return lower48.scale();
	    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
	    return albersUsa.translate(lower48.translate());
	  };

	  albersUsa.translate = function(_) {
	    if (!arguments.length) return lower48.translate();
	    var k = lower48.scale(), x = +_[0], y = +_[1];

	    lower48Point = lower48
	        .translate(_)
	        .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
	        .stream(pointStream);

	    alaskaPoint = alaska
	        .translate([x - 0.307 * k, y + 0.201 * k])
	        .clipExtent([[x - 0.425 * k + epsilon$4, y + 0.120 * k + epsilon$4], [x - 0.214 * k - epsilon$4, y + 0.234 * k - epsilon$4]])
	        .stream(pointStream);

	    hawaiiPoint = hawaii
	        .translate([x - 0.205 * k, y + 0.212 * k])
	        .clipExtent([[x - 0.214 * k + epsilon$4, y + 0.166 * k + epsilon$4], [x - 0.115 * k - epsilon$4, y + 0.234 * k - epsilon$4]])
	        .stream(pointStream);

	    return reset();
	  };

	  albersUsa.fitExtent = function(extent, object) {
	    return fitExtent(albersUsa, extent, object);
	  };

	  albersUsa.fitSize = function(size, object) {
	    return fitSize(albersUsa, size, object);
	  };

	  function reset() {
	    cache = cacheStream = null;
	    return albersUsa;
	  }

	  return albersUsa.scale(1070);
	};

	function azimuthalRaw(scale) {
	  return function(x, y) {
	    var cx = cos$1(x),
	        cy = cos$1(y),
	        k = scale(cx * cy);
	    return [
	      k * cy * sin$1(x),
	      k * sin$1(y)
	    ];
	  }
	}

	function azimuthalInvert(angle) {
	  return function(x, y) {
	    var z = sqrt$1(x * x + y * y),
	        c = angle(z),
	        sc = sin$1(c),
	        cc = cos$1(c);
	    return [
	      atan2(x * sc, z * cc),
	      asin$1(z && y * sc / z)
	    ];
	  }
	}

	var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
	  return sqrt$1(2 / (1 + cxcy));
	});

	azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
	  return 2 * asin$1(z / 2);
	});

	var azimuthalEqualArea = function() {
	  return projection(azimuthalEqualAreaRaw)
	      .scale(124.75)
	      .clipAngle(180 - 1e-3);
	};

	var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
	  return (c = acos(c)) && c / sin$1(c);
	});

	azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
	  return z;
	});

	var azimuthalEquidistant = function() {
	  return projection(azimuthalEquidistantRaw)
	      .scale(79.4188)
	      .clipAngle(180 - 1e-3);
	};

	function mercatorRaw(lambda, phi) {
	  return [lambda, log$1(tan((halfPi$3 + phi) / 2))];
	}

	mercatorRaw.invert = function(x, y) {
	  return [x, 2 * atan(exp(y)) - halfPi$3];
	};

	var mercator = function() {
	  return mercatorProjection(mercatorRaw)
	      .scale(961 / tau$4);
	};

	function mercatorProjection(project) {
	  var m = projection(project),
	      scale = m.scale,
	      translate = m.translate,
	      clipExtent = m.clipExtent,
	      clipAuto;

	  m.scale = function(_) {
	    return arguments.length ? (scale(_), clipAuto && m.clipExtent(null), m) : scale();
	  };

	  m.translate = function(_) {
	    return arguments.length ? (translate(_), clipAuto && m.clipExtent(null), m) : translate();
	  };

	  m.clipExtent = function(_) {
	    if (!arguments.length) return clipAuto ? null : clipExtent();
	    if (clipAuto = _ == null) {
	      var k = pi$4 * scale(),
	          t = translate();
	      _ = [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]];
	    }
	    clipExtent(_);
	    return m;
	  };

	  return m.clipExtent(null);
	}

	function tany(y) {
	  return tan((halfPi$3 + y) / 2);
	}

	function conicConformalRaw(y0, y1) {
	  var cy0 = cos$1(y0),
	      n = y0 === y1 ? sin$1(y0) : log$1(cy0 / cos$1(y1)) / log$1(tany(y1) / tany(y0)),
	      f = cy0 * pow$1(tany(y0), n) / n;

	  if (!n) return mercatorRaw;

	  function project(x, y) {
	    if (f > 0) { if (y < -halfPi$3 + epsilon$4) y = -halfPi$3 + epsilon$4; }
	    else { if (y > halfPi$3 - epsilon$4) y = halfPi$3 - epsilon$4; }
	    var r = f / pow$1(tany(y), n);
	    return [r * sin$1(n * x), f - r * cos$1(n * x)];
	  }

	  project.invert = function(x, y) {
	    var fy = f - y, r = sign$1(n) * sqrt$1(x * x + fy * fy);
	    return [atan2(x, abs(fy)) / n * sign$1(fy), 2 * atan(pow$1(f / r, 1 / n)) - halfPi$3];
	  };

	  return project;
	}

	var conicConformal = function() {
	  return conicProjection(conicConformalRaw)
	      .scale(109.5)
	      .parallels([30, 30]);
	};

	function equirectangularRaw(lambda, phi) {
	  return [lambda, phi];
	}

	equirectangularRaw.invert = equirectangularRaw;

	var equirectangular = function() {
	  return projection(equirectangularRaw)
	      .scale(152.63);
	};

	function conicEquidistantRaw(y0, y1) {
	  var cy0 = cos$1(y0),
	      n = y0 === y1 ? sin$1(y0) : (cy0 - cos$1(y1)) / (y1 - y0),
	      g = cy0 / n + y0;

	  if (abs(n) < epsilon$4) return equirectangularRaw;

	  function project(x, y) {
	    var gy = g - y, nx = n * x;
	    return [gy * sin$1(nx), g - gy * cos$1(nx)];
	  }

	  project.invert = function(x, y) {
	    var gy = g - y;
	    return [atan2(x, abs(gy)) / n * sign$1(gy), g - sign$1(n) * sqrt$1(x * x + gy * gy)];
	  };

	  return project;
	}

	var conicEquidistant = function() {
	  return conicProjection(conicEquidistantRaw)
	      .scale(131.154)
	      .center([0, 13.9389]);
	};

	function gnomonicRaw(x, y) {
	  var cy = cos$1(y), k = cos$1(x) * cy;
	  return [cy * sin$1(x) / k, sin$1(y) / k];
	}

	gnomonicRaw.invert = azimuthalInvert(atan);

	var gnomonic = function() {
	  return projection(gnomonicRaw)
	      .scale(144.049)
	      .clipAngle(60);
	};

	function scaleTranslate(kx, ky, tx, ty) {
	  return kx === 1 && ky === 1 && tx === 0 && ty === 0 ? identity$7 : transformer({
	    point: function(x, y) {
	      this.stream.point(x * kx + tx, y * ky + ty);
	    }
	  });
	}

	var identity$8 = function() {
	  var k = 1, tx = 0, ty = 0, sx = 1, sy = 1, transform = identity$7, // scale, translate and reflect
	      x0 = null, y0, x1, y1, clip = identity$7, // clip extent
	      cache,
	      cacheStream,
	      projection;

	  function reset() {
	    cache = cacheStream = null;
	    return projection;
	  }

	  return projection = {
	    stream: function(stream) {
	      return cache && cacheStream === stream ? cache : cache = transform(clip(cacheStream = stream));
	    },
	    clipExtent: function(_) {
	      return arguments.length ? (clip = _ == null ? (x0 = y0 = x1 = y1 = null, identity$7) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
	    },
	    scale: function(_) {
	      return arguments.length ? (transform = scaleTranslate((k = +_) * sx, k * sy, tx, ty), reset()) : k;
	    },
	    translate: function(_) {
	      return arguments.length ? (transform = scaleTranslate(k * sx, k * sy, tx = +_[0], ty = +_[1]), reset()) : [tx, ty];
	    },
	    reflectX: function(_) {
	      return arguments.length ? (transform = scaleTranslate(k * (sx = _ ? -1 : 1), k * sy, tx, ty), reset()) : sx < 0;
	    },
	    reflectY: function(_) {
	      return arguments.length ? (transform = scaleTranslate(k * sx, k * (sy = _ ? -1 : 1), tx, ty), reset()) : sy < 0;
	    },
	    fitExtent: function(extent, object) {
	      return fitExtent(projection, extent, object);
	    },
	    fitSize: function(size, object) {
	      return fitSize(projection, size, object);
	    }
	  };
	};

	function orthographicRaw(x, y) {
	  return [cos$1(y) * sin$1(x), sin$1(y)];
	}

	orthographicRaw.invert = azimuthalInvert(asin$1);

	var orthographic = function() {
	  return projection(orthographicRaw)
	      .scale(249.5)
	      .clipAngle(90 + epsilon$4);
	};

	function stereographicRaw(x, y) {
	  var cy = cos$1(y), k = 1 + cos$1(x) * cy;
	  return [cy * sin$1(x) / k, sin$1(y) / k];
	}

	stereographicRaw.invert = azimuthalInvert(function(z) {
	  return 2 * atan(z);
	});

	var stereographic = function() {
	  return projection(stereographicRaw)
	      .scale(250)
	      .clipAngle(142);
	};

	function transverseMercatorRaw(lambda, phi) {
	  return [log$1(tan((halfPi$3 + phi) / 2)), -lambda];
	}

	transverseMercatorRaw.invert = function(x, y) {
	  return [-y, 2 * atan(exp(x)) - halfPi$3];
	};

	var transverseMercator = function() {
	  var m = mercatorProjection(transverseMercatorRaw),
	      center = m.center,
	      rotate = m.rotate;

	  m.center = function(_) {
	    return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
	  };

	  m.rotate = function(_) {
	    return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
	  };

	  return rotate([0, 0, 90])
	      .scale(159.155);
	};

	exports.version = version;
	exports.bisect = bisectRight;
	exports.bisectRight = bisectRight;
	exports.bisectLeft = bisectLeft;
	exports.ascending = ascending;
	exports.bisector = bisector;
	exports.descending = descending;
	exports.deviation = deviation;
	exports.extent = extent;
	exports.histogram = histogram;
	exports.thresholdFreedmanDiaconis = freedmanDiaconis;
	exports.thresholdScott = scott;
	exports.thresholdSturges = sturges;
	exports.max = max;
	exports.mean = mean;
	exports.median = median;
	exports.merge = merge;
	exports.min = min;
	exports.pairs = pairs;
	exports.permute = permute;
	exports.quantile = threshold;
	exports.range = range;
	exports.scan = scan;
	exports.shuffle = shuffle;
	exports.sum = sum;
	exports.ticks = ticks;
	exports.tickStep = tickStep;
	exports.transpose = transpose;
	exports.variance = variance;
	exports.zip = zip;
	exports.entries = entries;
	exports.keys = keys;
	exports.values = values;
	exports.map = map$1;
	exports.set = set;
	exports.nest = nest;
	exports.randomUniform = uniform;
	exports.randomNormal = normal;
	exports.randomLogNormal = logNormal;
	exports.randomBates = bates;
	exports.randomIrwinHall = irwinHall;
	exports.randomExponential = exponential;
	exports.easeLinear = linear;
	exports.easeQuad = quadInOut;
	exports.easeQuadIn = quadIn;
	exports.easeQuadOut = quadOut;
	exports.easeQuadInOut = quadInOut;
	exports.easeCubic = cubicInOut;
	exports.easeCubicIn = cubicIn;
	exports.easeCubicOut = cubicOut;
	exports.easeCubicInOut = cubicInOut;
	exports.easePoly = polyInOut;
	exports.easePolyIn = polyIn;
	exports.easePolyOut = polyOut;
	exports.easePolyInOut = polyInOut;
	exports.easeSin = sinInOut;
	exports.easeSinIn = sinIn;
	exports.easeSinOut = sinOut;
	exports.easeSinInOut = sinInOut;
	exports.easeExp = expInOut;
	exports.easeExpIn = expIn;
	exports.easeExpOut = expOut;
	exports.easeExpInOut = expInOut;
	exports.easeCircle = circleInOut;
	exports.easeCircleIn = circleIn;
	exports.easeCircleOut = circleOut;
	exports.easeCircleInOut = circleInOut;
	exports.easeBounce = bounceOut;
	exports.easeBounceIn = bounceIn;
	exports.easeBounceOut = bounceOut;
	exports.easeBounceInOut = bounceInOut;
	exports.easeBack = backInOut;
	exports.easeBackIn = backIn;
	exports.easeBackOut = backOut;
	exports.easeBackInOut = backInOut;
	exports.easeElastic = elasticOut;
	exports.easeElasticIn = elasticIn;
	exports.easeElasticOut = elasticOut;
	exports.easeElasticInOut = elasticInOut;
	exports.polygonArea = area;
	exports.polygonCentroid = centroid;
	exports.polygonHull = hull;
	exports.polygonContains = contains;
	exports.polygonLength = length$1;
	exports.path = path;
	exports.quadtree = quadtree;
	exports.queue = queue;
	exports.arc = arc;
	exports.area = area$1;
	exports.line = line;
	exports.pie = pie;
	exports.radialArea = radialArea;
	exports.radialLine = radialLine$1;
	exports.symbol = symbol;
	exports.symbols = symbols;
	exports.symbolCircle = circle;
	exports.symbolCross = cross$1;
	exports.symbolDiamond = diamond;
	exports.symbolSquare = square;
	exports.symbolStar = star;
	exports.symbolTriangle = triangle;
	exports.symbolWye = wye;
	exports.curveBasisClosed = basisClosed;
	exports.curveBasisOpen = basisOpen;
	exports.curveBasis = basis;
	exports.curveBundle = bundle;
	exports.curveCardinalClosed = cardinalClosed;
	exports.curveCardinalOpen = cardinalOpen;
	exports.curveCardinal = cardinal;
	exports.curveCatmullRomClosed = catmullRomClosed;
	exports.curveCatmullRomOpen = catmullRomOpen;
	exports.curveCatmullRom = catmullRom;
	exports.curveLinearClosed = linearClosed;
	exports.curveLinear = curveLinear;
	exports.curveMonotoneX = monotoneX;
	exports.curveMonotoneY = monotoneY;
	exports.curveNatural = natural;
	exports.curveStep = step;
	exports.curveStepAfter = stepAfter;
	exports.curveStepBefore = stepBefore;
	exports.stack = stack;
	exports.stackOffsetExpand = expand;
	exports.stackOffsetNone = none;
	exports.stackOffsetSilhouette = silhouette;
	exports.stackOffsetWiggle = wiggle;
	exports.stackOrderAscending = ascending$1;
	exports.stackOrderDescending = descending$2;
	exports.stackOrderInsideOut = insideOut;
	exports.stackOrderNone = none$1;
	exports.stackOrderReverse = reverse;
	exports.color = color;
	exports.rgb = rgb;
	exports.hsl = hsl;
	exports.lab = lab;
	exports.hcl = hcl;
	exports.cubehelix = cubehelix;
	exports.interpolate = interpolate;
	exports.interpolateArray = array$1;
	exports.interpolateDate = date;
	exports.interpolateNumber = interpolateNumber;
	exports.interpolateObject = object;
	exports.interpolateRound = interpolateRound;
	exports.interpolateString = interpolateString;
	exports.interpolateTransformCss = interpolateTransformCss;
	exports.interpolateTransformSvg = interpolateTransformSvg;
	exports.interpolateZoom = interpolateZoom;
	exports.interpolateRgb = interpolateRgb;
	exports.interpolateRgbBasis = rgbBasis;
	exports.interpolateRgbBasisClosed = rgbBasisClosed;
	exports.interpolateHsl = hsl$2;
	exports.interpolateHslLong = hslLong;
	exports.interpolateLab = lab$1;
	exports.interpolateHcl = hcl$2;
	exports.interpolateHclLong = hclLong;
	exports.interpolateCubehelix = cubehelix$2;
	exports.interpolateCubehelixLong = cubehelixLong;
	exports.interpolateBasis = basis$2;
	exports.interpolateBasisClosed = basisClosed$1;
	exports.quantize = quantize;
	exports.dispatch = dispatch;
	exports.dsvFormat = dsv;
	exports.csvParse = csvParse;
	exports.csvParseRows = csvParseRows;
	exports.csvFormat = csvFormat;
	exports.csvFormatRows = csvFormatRows;
	exports.tsvParse = tsvParse;
	exports.tsvParseRows = tsvParseRows;
	exports.tsvFormat = tsvFormat;
	exports.tsvFormatRows = tsvFormatRows;
	exports.request = request;
	exports.html = html;
	exports.json = json;
	exports.text = text;
	exports.xml = xml;
	exports.csv = csv$1;
	exports.tsv = tsv$1;
	exports.now = now;
	exports.timer = timer;
	exports.timerFlush = timerFlush;
	exports.timeout = timeout$1;
	exports.interval = interval$1;
	exports.timeInterval = newInterval;
	exports.timeMillisecond = millisecond;
	exports.timeMilliseconds = milliseconds;
	exports.timeSecond = second;
	exports.timeSeconds = seconds;
	exports.timeMinute = minute;
	exports.timeMinutes = minutes;
	exports.timeHour = hour;
	exports.timeHours = hours;
	exports.timeDay = day;
	exports.timeDays = days;
	exports.timeWeek = sunday;
	exports.timeWeeks = sundays;
	exports.timeSunday = sunday;
	exports.timeSundays = sundays;
	exports.timeMonday = monday;
	exports.timeMondays = mondays;
	exports.timeTuesday = tuesday;
	exports.timeTuesdays = tuesdays;
	exports.timeWednesday = wednesday;
	exports.timeWednesdays = wednesdays;
	exports.timeThursday = thursday;
	exports.timeThursdays = thursdays;
	exports.timeFriday = friday;
	exports.timeFridays = fridays;
	exports.timeSaturday = saturday;
	exports.timeSaturdays = saturdays;
	exports.timeMonth = month;
	exports.timeMonths = months;
	exports.timeYear = year;
	exports.timeYears = years;
	exports.utcMillisecond = millisecond;
	exports.utcMilliseconds = milliseconds;
	exports.utcSecond = second;
	exports.utcSeconds = seconds;
	exports.utcMinute = utcMinute;
	exports.utcMinutes = utcMinutes;
	exports.utcHour = utcHour;
	exports.utcHours = utcHours;
	exports.utcDay = utcDay;
	exports.utcDays = utcDays;
	exports.utcWeek = utcSunday;
	exports.utcWeeks = utcSundays;
	exports.utcSunday = utcSunday;
	exports.utcSundays = utcSundays;
	exports.utcMonday = utcMonday;
	exports.utcMondays = utcMondays;
	exports.utcTuesday = utcTuesday;
	exports.utcTuesdays = utcTuesdays;
	exports.utcWednesday = utcWednesday;
	exports.utcWednesdays = utcWednesdays;
	exports.utcThursday = utcThursday;
	exports.utcThursdays = utcThursdays;
	exports.utcFriday = utcFriday;
	exports.utcFridays = utcFridays;
	exports.utcSaturday = utcSaturday;
	exports.utcSaturdays = utcSaturdays;
	exports.utcMonth = utcMonth;
	exports.utcMonths = utcMonths;
	exports.utcYear = utcYear;
	exports.utcYears = utcYears;
	exports.formatLocale = formatLocale;
	exports.formatDefaultLocale = defaultLocale;
	exports.formatSpecifier = formatSpecifier;
	exports.precisionFixed = precisionFixed;
	exports.precisionPrefix = precisionPrefix;
	exports.precisionRound = precisionRound;
	exports.isoFormat = formatIso;
	exports.isoParse = parseIso;
	exports.timeFormatLocale = formatLocale$1;
	exports.timeFormatDefaultLocale = defaultLocale$1;
	exports.scaleBand = band;
	exports.scalePoint = point$4;
	exports.scaleIdentity = identity$4;
	exports.scaleLinear = linear$2;
	exports.scaleLog = log;
	exports.scaleOrdinal = ordinal;
	exports.scaleImplicit = implicit;
	exports.scalePow = pow;
	exports.scaleSqrt = sqrt;
	exports.scaleQuantile = quantile$$1;
	exports.scaleQuantize = quantize$1;
	exports.scaleThreshold = threshold$1;
	exports.scaleTime = time;
	exports.scaleUtc = utcTime;
	exports.schemeCategory10 = category10;
	exports.schemeCategory20b = category20b;
	exports.schemeCategory20c = category20c;
	exports.schemeCategory20 = category20;
	exports.scaleSequential = sequential;
	exports.interpolateCubehelixDefault = cubehelix$3;
	exports.interpolateRainbow = rainbow$1;
	exports.interpolateWarm = warm;
	exports.interpolateCool = cool;
	exports.interpolateViridis = viridis;
	exports.interpolateMagma = magma;
	exports.interpolateInferno = inferno;
	exports.interpolatePlasma = plasma;
	exports.creator = creator;
	exports.customEvent = customEvent;
	exports.local = local;
	exports.matcher = matcher$1;
	exports.mouse = mouse;
	exports.namespace = namespace;
	exports.namespaces = namespaces;
	exports.select = select;
	exports.selectAll = selectAll;
	exports.selection = selection;
	exports.selector = selector;
	exports.selectorAll = selectorAll;
	exports.touch = touch;
	exports.touches = touches;
	exports.window = window;
	exports.active = active;
	exports.interrupt = interrupt;
	exports.transition = transition;
	exports.axisTop = axisTop;
	exports.axisRight = axisRight;
	exports.axisBottom = axisBottom;
	exports.axisLeft = axisLeft;
	exports.cluster = cluster;
	exports.hierarchy = hierarchy;
	exports.pack = index;
	exports.packSiblings = siblings;
	exports.packEnclose = enclose;
	exports.partition = partition;
	exports.stratify = stratify;
	exports.tree = tree;
	exports.treemap = index$1;
	exports.treemapBinary = binary;
	exports.treemapDice = treemapDice;
	exports.treemapSlice = treemapSlice;
	exports.treemapSliceDice = sliceDice;
	exports.treemapSquarify = squarify;
	exports.treemapResquarify = resquarify;
	exports.forceCenter = center$1;
	exports.forceCollide = collide;
	exports.forceLink = link;
	exports.forceManyBody = manyBody;
	exports.forceSimulation = simulation;
	exports.forceX = x$3;
	exports.forceY = y$3;
	exports.drag = drag;
	exports.dragDisable = dragDisable;
	exports.dragEnable = yesdrag;
	exports.voronoi = voronoi;
	exports.zoom = zoom;
	exports.zoomIdentity = identity$6;
	exports.zoomTransform = transform;
	exports.brush = brush;
	exports.brushX = brushX;
	exports.brushY = brushY;
	exports.brushSelection = brushSelection;
	exports.chord = chord;
	exports.ribbon = ribbon;
	exports.geoAlbers = albers;
	exports.geoAlbersUsa = albersUsa;
	exports.geoArea = area$2;
	exports.geoAzimuthalEqualArea = azimuthalEqualArea;
	exports.geoAzimuthalEqualAreaRaw = azimuthalEqualAreaRaw;
	exports.geoAzimuthalEquidistant = azimuthalEquidistant;
	exports.geoAzimuthalEquidistantRaw = azimuthalEquidistantRaw;
	exports.geoBounds = bounds;
	exports.geoCentroid = centroid$1;
	exports.geoCircle = circle$1;
	exports.geoClipExtent = extent$1;
	exports.geoConicConformal = conicConformal;
	exports.geoConicConformalRaw = conicConformalRaw;
	exports.geoConicEqualArea = conicEqualArea;
	exports.geoConicEqualAreaRaw = conicEqualAreaRaw;
	exports.geoConicEquidistant = conicEquidistant;
	exports.geoConicEquidistantRaw = conicEquidistantRaw;
	exports.geoDistance = distance;
	exports.geoEquirectangular = equirectangular;
	exports.geoEquirectangularRaw = equirectangularRaw;
	exports.geoGnomonic = gnomonic;
	exports.geoGnomonicRaw = gnomonicRaw;
	exports.geoGraticule = graticule;
	exports.geoGraticule10 = graticule10;
	exports.geoIdentity = identity$8;
	exports.geoInterpolate = interpolate$2;
	exports.geoLength = length$2;
	exports.geoMercator = mercator;
	exports.geoMercatorRaw = mercatorRaw;
	exports.geoOrthographic = orthographic;
	exports.geoOrthographicRaw = orthographicRaw;
	exports.geoPath = index$3;
	exports.geoProjection = projection;
	exports.geoProjectionMutator = projectionMutator;
	exports.geoRotation = rotation;
	exports.geoStereographic = stereographic;
	exports.geoStereographicRaw = stereographicRaw;
	exports.geoStream = geoStream;
	exports.geoTransform = transform$1;
	exports.geoTransverseMercator = transverseMercator;
	exports.geoTransverseMercatorRaw = transverseMercatorRaw;

	Object.defineProperty(exports, '__esModule', { value: true });

	})));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/topojson/topojson Version 2.2.0. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.topojson = global.topojson || {})));
	}(this, (function (exports) { 'use strict';

	// Computes the bounding box of the specified hash of GeoJSON objects.
	var bounds = function(objects) {
	  var x0 = Infinity,
	      y0 = Infinity,
	      x1 = -Infinity,
	      y1 = -Infinity;

	  function boundGeometry(geometry) {
	    if (geometry && boundGeometryType.hasOwnProperty(geometry.type)) boundGeometryType[geometry.type](geometry);
	  }

	  var boundGeometryType = {
	    GeometryCollection: function(o) { o.geometries.forEach(boundGeometry); },
	    Point: function(o) { boundPoint(o.coordinates); },
	    MultiPoint: function(o) { o.coordinates.forEach(boundPoint); },
	    LineString: function(o) { boundLine(o.coordinates); },
	    MultiLineString: function(o) { o.coordinates.forEach(boundLine); },
	    Polygon: function(o) { o.coordinates.forEach(boundLine); },
	    MultiPolygon: function(o) { o.coordinates.forEach(boundMultiLine); }
	  };

	  function boundPoint(coordinates) {
	    var x = coordinates[0],
	        y = coordinates[1];
	    if (x < x0) x0 = x;
	    if (x > x1) x1 = x;
	    if (y < y0) y0 = y;
	    if (y > y1) y1 = y;
	  }

	  function boundLine(coordinates) {
	    coordinates.forEach(boundPoint);
	  }

	  function boundMultiLine(coordinates) {
	    coordinates.forEach(boundLine);
	  }

	  for (var key in objects) {
	    boundGeometry(objects[key]);
	  }

	  return x1 >= x0 && y1 >= y0 ? [x0, y0, x1, y1] : undefined;
	};

	var hashset = function(size, hash, equal, type, empty) {
	  if (arguments.length === 3) {
	    type = Array;
	    empty = null;
	  }

	  var store = new type(size = 1 << Math.max(4, Math.ceil(Math.log(size) / Math.LN2))),
	      mask = size - 1;

	  for (var i = 0; i < size; ++i) {
	    store[i] = empty;
	  }

	  function add(value) {
	    var index = hash(value) & mask,
	        match = store[index],
	        collisions = 0;
	    while (match != empty) {
	      if (equal(match, value)) return true;
	      if (++collisions >= size) throw new Error("full hashset");
	      match = store[index = (index + 1) & mask];
	    }
	    store[index] = value;
	    return true;
	  }

	  function has(value) {
	    var index = hash(value) & mask,
	        match = store[index],
	        collisions = 0;
	    while (match != empty) {
	      if (equal(match, value)) return true;
	      if (++collisions >= size) break;
	      match = store[index = (index + 1) & mask];
	    }
	    return false;
	  }

	  function values() {
	    var values = [];
	    for (var i = 0, n = store.length; i < n; ++i) {
	      var match = store[i];
	      if (match != empty) values.push(match);
	    }
	    return values;
	  }

	  return {
	    add: add,
	    has: has,
	    values: values
	  };
	};

	var hashmap = function(size, hash, equal, keyType, keyEmpty, valueType) {
	  if (arguments.length === 3) {
	    keyType = valueType = Array;
	    keyEmpty = null;
	  }

	  var keystore = new keyType(size = 1 << Math.max(4, Math.ceil(Math.log(size) / Math.LN2))),
	      valstore = new valueType(size),
	      mask = size - 1;

	  for (var i = 0; i < size; ++i) {
	    keystore[i] = keyEmpty;
	  }

	  function set(key, value) {
	    var index = hash(key) & mask,
	        matchKey = keystore[index],
	        collisions = 0;
	    while (matchKey != keyEmpty) {
	      if (equal(matchKey, key)) return valstore[index] = value;
	      if (++collisions >= size) throw new Error("full hashmap");
	      matchKey = keystore[index = (index + 1) & mask];
	    }
	    keystore[index] = key;
	    valstore[index] = value;
	    return value;
	  }

	  function maybeSet(key, value) {
	    var index = hash(key) & mask,
	        matchKey = keystore[index],
	        collisions = 0;
	    while (matchKey != keyEmpty) {
	      if (equal(matchKey, key)) return valstore[index];
	      if (++collisions >= size) throw new Error("full hashmap");
	      matchKey = keystore[index = (index + 1) & mask];
	    }
	    keystore[index] = key;
	    valstore[index] = value;
	    return value;
	  }

	  function get(key, missingValue) {
	    var index = hash(key) & mask,
	        matchKey = keystore[index],
	        collisions = 0;
	    while (matchKey != keyEmpty) {
	      if (equal(matchKey, key)) return valstore[index];
	      if (++collisions >= size) break;
	      matchKey = keystore[index = (index + 1) & mask];
	    }
	    return missingValue;
	  }

	  function keys() {
	    var keys = [];
	    for (var i = 0, n = keystore.length; i < n; ++i) {
	      var matchKey = keystore[i];
	      if (matchKey != keyEmpty) keys.push(matchKey);
	    }
	    return keys;
	  }

	  return {
	    set: set,
	    maybeSet: maybeSet, // set if unset
	    get: get,
	    keys: keys
	  };
	};

	var equalPoint = function(pointA, pointB) {
	  return pointA[0] === pointB[0] && pointA[1] === pointB[1];
	};

	// TODO if quantized, use simpler Int32 hashing?

	var buffer = new ArrayBuffer(16);
	var floats = new Float64Array(buffer);
	var uints = new Uint32Array(buffer);

	var hashPoint = function(point) {
	  floats[0] = point[0];
	  floats[1] = point[1];
	  var hash = uints[0] ^ uints[1];
	  hash = hash << 5 ^ hash >> 7 ^ uints[2] ^ uints[3];
	  return hash & 0x7fffffff;
	};

	// Given an extracted (pre-)topology, identifies all of the junctions. These are
	// the points at which arcs (lines or rings) will need to be cut so that each
	// arc is represented uniquely.
	//
	// A junction is a point where at least one arc deviates from another arc going
	// through the same point. For example, consider the point B. If there is a arc
	// through ABC and another arc through CBA, then B is not a junction because in
	// both cases the adjacent point pairs are {A,C}. However, if there is an
	// additional arc ABD, then {A,D} != {A,C}, and thus B becomes a junction.
	//
	// For a closed ring ABCA, the first point A’s adjacent points are the second
	// and last point {B,C}. For a line, the first and last point are always
	// considered junctions, even if the line is closed; this ensures that a closed
	// line is never rotated.
	var join = function(topology) {
	  var coordinates = topology.coordinates,
	      lines = topology.lines,
	      rings = topology.rings,
	      indexes = index(),
	      visitedByIndex = new Int32Array(coordinates.length),
	      leftByIndex = new Int32Array(coordinates.length),
	      rightByIndex = new Int32Array(coordinates.length),
	      junctionByIndex = new Int8Array(coordinates.length),
	      junctionCount = 0, // upper bound on number of junctions
	      i, n,
	      previousIndex,
	      currentIndex,
	      nextIndex;

	  for (i = 0, n = coordinates.length; i < n; ++i) {
	    visitedByIndex[i] = leftByIndex[i] = rightByIndex[i] = -1;
	  }

	  for (i = 0, n = lines.length; i < n; ++i) {
	    var line = lines[i],
	        lineStart = line[0],
	        lineEnd = line[1];
	    currentIndex = indexes[lineStart];
	    nextIndex = indexes[++lineStart];
	    ++junctionCount, junctionByIndex[currentIndex] = 1; // start
	    while (++lineStart <= lineEnd) {
	      sequence(i, previousIndex = currentIndex, currentIndex = nextIndex, nextIndex = indexes[lineStart]);
	    }
	    ++junctionCount, junctionByIndex[nextIndex] = 1; // end
	  }

	  for (i = 0, n = coordinates.length; i < n; ++i) {
	    visitedByIndex[i] = -1;
	  }

	  for (i = 0, n = rings.length; i < n; ++i) {
	    var ring = rings[i],
	        ringStart = ring[0] + 1,
	        ringEnd = ring[1];
	    previousIndex = indexes[ringEnd - 1];
	    currentIndex = indexes[ringStart - 1];
	    nextIndex = indexes[ringStart];
	    sequence(i, previousIndex, currentIndex, nextIndex);
	    while (++ringStart <= ringEnd) {
	      sequence(i, previousIndex = currentIndex, currentIndex = nextIndex, nextIndex = indexes[ringStart]);
	    }
	  }

	  function sequence(i, previousIndex, currentIndex, nextIndex) {
	    if (visitedByIndex[currentIndex] === i) return; // ignore self-intersection
	    visitedByIndex[currentIndex] = i;
	    var leftIndex = leftByIndex[currentIndex];
	    if (leftIndex >= 0) {
	      var rightIndex = rightByIndex[currentIndex];
	      if ((leftIndex !== previousIndex || rightIndex !== nextIndex)
	        && (leftIndex !== nextIndex || rightIndex !== previousIndex)) {
	        ++junctionCount, junctionByIndex[currentIndex] = 1;
	      }
	    } else {
	      leftByIndex[currentIndex] = previousIndex;
	      rightByIndex[currentIndex] = nextIndex;
	    }
	  }

	  function index() {
	    var indexByPoint = hashmap(coordinates.length * 1.4, hashIndex, equalIndex, Int32Array, -1, Int32Array),
	        indexes = new Int32Array(coordinates.length);

	    for (var i = 0, n = coordinates.length; i < n; ++i) {
	      indexes[i] = indexByPoint.maybeSet(i, i);
	    }

	    return indexes;
	  }

	  function hashIndex(i) {
	    return hashPoint(coordinates[i]);
	  }

	  function equalIndex(i, j) {
	    return equalPoint(coordinates[i], coordinates[j]);
	  }

	  visitedByIndex = leftByIndex = rightByIndex = null;

	  var junctionByPoint = hashset(junctionCount * 1.4, hashPoint, equalPoint), j;

	  // Convert back to a standard hashset by point for caller convenience.
	  for (i = 0, n = coordinates.length; i < n; ++i) {
	    if (junctionByIndex[j = indexes[i]]) {
	      junctionByPoint.add(coordinates[j]);
	    }
	  }

	  return junctionByPoint;
	};

	// Given an extracted (pre-)topology, cuts (or rotates) arcs so that all shared
	// point sequences are identified. The topology can then be subsequently deduped
	// to remove exact duplicate arcs.
	var cut = function(topology) {
	  var junctions = join(topology),
	      coordinates = topology.coordinates,
	      lines = topology.lines,
	      rings = topology.rings,
	      next,
	      i, n;

	  for (i = 0, n = lines.length; i < n; ++i) {
	    var line = lines[i],
	        lineMid = line[0],
	        lineEnd = line[1];
	    while (++lineMid < lineEnd) {
	      if (junctions.has(coordinates[lineMid])) {
	        next = {0: lineMid, 1: line[1]};
	        line[1] = lineMid;
	        line = line.next = next;
	      }
	    }
	  }

	  for (i = 0, n = rings.length; i < n; ++i) {
	    var ring = rings[i],
	        ringStart = ring[0],
	        ringMid = ringStart,
	        ringEnd = ring[1],
	        ringFixed = junctions.has(coordinates[ringStart]);
	    while (++ringMid < ringEnd) {
	      if (junctions.has(coordinates[ringMid])) {
	        if (ringFixed) {
	          next = {0: ringMid, 1: ring[1]};
	          ring[1] = ringMid;
	          ring = ring.next = next;
	        } else { // For the first junction, we can rotate rather than cut.
	          rotateArray(coordinates, ringStart, ringEnd, ringEnd - ringMid);
	          coordinates[ringEnd] = coordinates[ringStart];
	          ringFixed = true;
	          ringMid = ringStart; // restart; we may have skipped junctions
	        }
	      }
	    }
	  }

	  return topology;
	};

	function rotateArray(array, start, end, offset) {
	  reverse(array, start, end);
	  reverse(array, start, start + offset);
	  reverse(array, start + offset, end);
	}

	function reverse(array, start, end) {
	  for (var mid = start + ((end-- - start) >> 1), t; start < mid; ++start, --end) {
	    t = array[start], array[start] = array[end], array[end] = t;
	  }
	}

	// Given a cut topology, combines duplicate arcs.
	var dedup = function(topology) {
	  var coordinates = topology.coordinates,
	      lines = topology.lines, line,
	      rings = topology.rings, ring,
	      arcCount = lines.length + rings.length,
	      i, n;

	  delete topology.lines;
	  delete topology.rings;

	  // Count the number of (non-unique) arcs to initialize the hashmap safely.
	  for (i = 0, n = lines.length; i < n; ++i) {
	    line = lines[i]; while (line = line.next) ++arcCount;
	  }
	  for (i = 0, n = rings.length; i < n; ++i) {
	    ring = rings[i]; while (ring = ring.next) ++arcCount;
	  }

	  var arcsByEnd = hashmap(arcCount * 2 * 1.4, hashPoint, equalPoint),
	      arcs = topology.arcs = [];

	  for (i = 0, n = lines.length; i < n; ++i) {
	    line = lines[i];
	    do {
	      dedupLine(line);
	    } while (line = line.next);
	  }

	  for (i = 0, n = rings.length; i < n; ++i) {
	    ring = rings[i];
	    if (ring.next) { // arc is no longer closed
	      do {
	        dedupLine(ring);
	      } while (ring = ring.next);
	    } else {
	      dedupRing(ring);
	    }
	  }

	  function dedupLine(arc) {
	    var startPoint,
	        endPoint,
	        startArcs, startArc,
	        endArcs, endArc,
	        i, n;

	    // Does this arc match an existing arc in order?
	    if (startArcs = arcsByEnd.get(startPoint = coordinates[arc[0]])) {
	      for (i = 0, n = startArcs.length; i < n; ++i) {
	        startArc = startArcs[i];
	        if (equalLine(startArc, arc)) {
	          arc[0] = startArc[0];
	          arc[1] = startArc[1];
	          return;
	        }
	      }
	    }

	    // Does this arc match an existing arc in reverse order?
	    if (endArcs = arcsByEnd.get(endPoint = coordinates[arc[1]])) {
	      for (i = 0, n = endArcs.length; i < n; ++i) {
	        endArc = endArcs[i];
	        if (reverseEqualLine(endArc, arc)) {
	          arc[1] = endArc[0];
	          arc[0] = endArc[1];
	          return;
	        }
	      }
	    }

	    if (startArcs) startArcs.push(arc); else arcsByEnd.set(startPoint, [arc]);
	    if (endArcs) endArcs.push(arc); else arcsByEnd.set(endPoint, [arc]);
	    arcs.push(arc);
	  }

	  function dedupRing(arc) {
	    var endPoint,
	        endArcs,
	        endArc,
	        i, n;

	    // Does this arc match an existing line in order, or reverse order?
	    // Rings are closed, so their start point and end point is the same.
	    if (endArcs = arcsByEnd.get(endPoint = coordinates[arc[0]])) {
	      for (i = 0, n = endArcs.length; i < n; ++i) {
	        endArc = endArcs[i];
	        if (equalRing(endArc, arc)) {
	          arc[0] = endArc[0];
	          arc[1] = endArc[1];
	          return;
	        }
	        if (reverseEqualRing(endArc, arc)) {
	          arc[0] = endArc[1];
	          arc[1] = endArc[0];
	          return;
	        }
	      }
	    }

	    // Otherwise, does this arc match an existing ring in order, or reverse order?
	    if (endArcs = arcsByEnd.get(endPoint = coordinates[arc[0] + findMinimumOffset(arc)])) {
	      for (i = 0, n = endArcs.length; i < n; ++i) {
	        endArc = endArcs[i];
	        if (equalRing(endArc, arc)) {
	          arc[0] = endArc[0];
	          arc[1] = endArc[1];
	          return;
	        }
	        if (reverseEqualRing(endArc, arc)) {
	          arc[0] = endArc[1];
	          arc[1] = endArc[0];
	          return;
	        }
	      }
	    }

	    if (endArcs) endArcs.push(arc); else arcsByEnd.set(endPoint, [arc]);
	    arcs.push(arc);
	  }

	  function equalLine(arcA, arcB) {
	    var ia = arcA[0], ib = arcB[0],
	        ja = arcA[1], jb = arcB[1];
	    if (ia - ja !== ib - jb) return false;
	    for (; ia <= ja; ++ia, ++ib) if (!equalPoint(coordinates[ia], coordinates[ib])) return false;
	    return true;
	  }

	  function reverseEqualLine(arcA, arcB) {
	    var ia = arcA[0], ib = arcB[0],
	        ja = arcA[1], jb = arcB[1];
	    if (ia - ja !== ib - jb) return false;
	    for (; ia <= ja; ++ia, --jb) if (!equalPoint(coordinates[ia], coordinates[jb])) return false;
	    return true;
	  }

	  function equalRing(arcA, arcB) {
	    var ia = arcA[0], ib = arcB[0],
	        ja = arcA[1], jb = arcB[1],
	        n = ja - ia;
	    if (n !== jb - ib) return false;
	    var ka = findMinimumOffset(arcA),
	        kb = findMinimumOffset(arcB);
	    for (var i = 0; i < n; ++i) {
	      if (!equalPoint(coordinates[ia + (i + ka) % n], coordinates[ib + (i + kb) % n])) return false;
	    }
	    return true;
	  }

	  function reverseEqualRing(arcA, arcB) {
	    var ia = arcA[0], ib = arcB[0],
	        ja = arcA[1], jb = arcB[1],
	        n = ja - ia;
	    if (n !== jb - ib) return false;
	    var ka = findMinimumOffset(arcA),
	        kb = n - findMinimumOffset(arcB);
	    for (var i = 0; i < n; ++i) {
	      if (!equalPoint(coordinates[ia + (i + ka) % n], coordinates[jb - (i + kb) % n])) return false;
	    }
	    return true;
	  }

	  // Rings are rotated to a consistent, but arbitrary, start point.
	  // This is necessary to detect when a ring and a rotated copy are dupes.
	  function findMinimumOffset(arc) {
	    var start = arc[0],
	        end = arc[1],
	        mid = start,
	        minimum = mid,
	        minimumPoint = coordinates[mid];
	    while (++mid < end) {
	      var point = coordinates[mid];
	      if (point[0] < minimumPoint[0] || point[0] === minimumPoint[0] && point[1] < minimumPoint[1]) {
	        minimum = mid;
	        minimumPoint = point;
	      }
	    }
	    return minimum - start;
	  }

	  return topology;
	};

	// Given a TopoJSON topology in absolute (quantized) coordinates,
	// converts to fixed-point delta encoding.
	// This is a destructive operation that modifies the given topology!
	var delta = function(topology) {
	  var arcs = topology.arcs,
	      i = -1,
	      n = arcs.length;

	  while (++i < n) {
	    var arc = arcs[i],
	        j = 0,
	        m = arc.length,
	        point = arc[0],
	        x0 = point[0],
	        y0 = point[1],
	        x1,
	        y1;
	    while (++j < m) {
	      point = arc[j];
	      x1 = point[0];
	      y1 = point[1];
	      arc[j] = [x1 - x0, y1 - y0];
	      x0 = x1;
	      y0 = y1;
	    }
	  }

	  return topology;
	};

	// Extracts the lines and rings from the specified hash of geometry objects.
	//
	// Returns an object with three properties:
	//
	// * coordinates - shared buffer of [x, y] coordinates
	// * lines - lines extracted from the hash, of the form [start, end]
	// * rings - rings extracted from the hash, of the form [start, end]
	//
	// For each ring or line, start and end represent inclusive indexes into the
	// coordinates buffer. For rings (and closed lines), coordinates[start] equals
	// coordinates[end].
	//
	// For each line or polygon geometry in the input hash, including nested
	// geometries as in geometry collections, the `coordinates` array is replaced
	// with an equivalent `arcs` array that, for each line (for line string
	// geometries) or ring (for polygon geometries), points to one of the above
	// lines or rings.
	var extract = function(objects) {
	  var index = -1,
	      lines = [],
	      rings = [],
	      coordinates = [];

	  function extractGeometry(geometry) {
	    if (geometry && extractGeometryType.hasOwnProperty(geometry.type)) extractGeometryType[geometry.type](geometry);
	  }

	  var extractGeometryType = {
	    GeometryCollection: function(o) { o.geometries.forEach(extractGeometry); },
	    LineString: function(o) { o.arcs = extractLine(o.coordinates); delete o.coordinates; },
	    MultiLineString: function(o) { o.arcs = o.coordinates.map(extractLine); delete o.coordinates; },
	    Polygon: function(o) { o.arcs = o.coordinates.map(extractRing); delete o.coordinates; },
	    MultiPolygon: function(o) { o.arcs = o.coordinates.map(extractMultiRing); delete o.coordinates; }
	  };

	  function extractLine(line) {
	    for (var i = 0, n = line.length; i < n; ++i) coordinates[++index] = line[i];
	    var arc = {0: index - n + 1, 1: index};
	    lines.push(arc);
	    return arc;
	  }

	  function extractRing(ring) {
	    for (var i = 0, n = ring.length; i < n; ++i) coordinates[++index] = ring[i];
	    var arc = {0: index - n + 1, 1: index};
	    rings.push(arc);
	    return arc;
	  }

	  function extractMultiRing(rings) {
	    return rings.map(extractRing);
	  }

	  for (var key in objects) {
	    extractGeometry(objects[key]);
	  }

	  return {
	    type: "Topology",
	    coordinates: coordinates,
	    lines: lines,
	    rings: rings,
	    objects: objects
	  };
	};

	// Given a hash of GeoJSON objects, replaces Features with geometry objects.
	// This is a destructive operation that modifies the input objects!
	var geometry = function(objects) {
	  var key;
	  for (key in objects) objects[key] = geomifyObject(objects[key]);
	  return objects;
	};

	function geomifyObject(object) {
	  return (object && geomifyObjectType.hasOwnProperty(object.type)
	      ? geomifyObjectType[object.type]
	      : geomifyGeometry)(object);
	}

	function geomifyFeature(feature) {
	  var geometry = feature.geometry;
	  if (geometry == null) {
	    feature.type = null;
	  } else {
	    geomifyGeometry(geometry);
	    feature.type = geometry.type;
	    if (geometry.geometries) feature.geometries = geometry.geometries;
	    else if (geometry.coordinates) feature.coordinates = geometry.coordinates;
	    if (geometry.bbox) feature.bbox = geometry.bbox;
	  }
	  delete feature.geometry;
	  return feature;
	}

	function geomifyGeometry(geometry) {
	  if (!geometry) return {type: null};
	  if (geomifyGeometryType.hasOwnProperty(geometry.type)) geomifyGeometryType[geometry.type](geometry);
	  return geometry;
	}

	var geomifyObjectType = {
	  Feature: geomifyFeature,
	  FeatureCollection: function(collection) {
	    collection.type = "GeometryCollection";
	    collection.geometries = collection.features;
	    collection.features.forEach(geomifyFeature);
	    delete collection.features;
	    return collection;
	  }
	};

	var geomifyGeometryType = {
	  GeometryCollection: function(o) {
	    var geometries = o.geometries, i = -1, n = geometries.length;
	    while (++i < n) geometries[i] = geomifyGeometry(geometries[i]);
	  },
	  MultiPoint: function(o) {
	    if (!o.coordinates.length) {
	      o.type = null;
	      delete o.coordinates;
	    } else if (o.coordinates.length < 2) {
	      o.type = "Point";
	      o.coordinates = o.coordinates[0];
	    }
	  },
	  LineString: function(o) {
	    if (!o.coordinates.length) {
	      o.type = null;
	      delete o.coordinates;
	    }
	  },
	  MultiLineString: function(o) {
	    for (var lines = o.coordinates, i = 0, N = 0, n = lines.length; i < n; ++i) {
	      var line = lines[i];
	      if (line.length) lines[N++] = line;
	    }
	    if (!N) {
	      o.type = null;
	      delete o.coordinates;
	    } else if (N < 2) {
	      o.type = "LineString";
	      o.coordinates = lines[0];
	    } else {
	      o.coordinates.length = N;
	    }
	  },
	  Polygon: function(o) {
	    for (var rings = o.coordinates, i = 0, N = 0, n = rings.length; i < n; ++i) {
	      var ring = rings[i];
	      if (ring.length) rings[N++] = ring;
	    }
	    if (!N) {
	      o.type = null;
	      delete o.coordinates;
	    } else {
	      o.coordinates.length = N;
	    }
	  },
	  MultiPolygon: function(o) {
	    for (var polygons = o.coordinates, j = 0, M = 0, m = polygons.length; j < m; ++j) {
	      for (var rings = polygons[j], i = 0, N = 0, n = rings.length; i < n; ++i) {
	        var ring = rings[i];
	        if (ring.length) rings[N++] = ring;
	      }
	      if (N) {
	        rings.length = N;
	        polygons[M++] = rings;
	      }
	    }
	    if (!M) {
	      o.type = null;
	      delete o.coordinates;
	    } else if (M < 2) {
	      o.type = "Polygon";
	      o.coordinates = polygons[0];
	    } else {
	      polygons.length = M;
	    }
	  }
	};

	var prequantize = function(objects, bbox, n) {
	  var x0 = bbox[0],
	      y0 = bbox[1],
	      x1 = bbox[2],
	      y1 = bbox[3],
	      kx = x1 - x0 ? (n - 1) / (x1 - x0) : 1,
	      ky = y1 - y0 ? (n - 1) / (y1 - y0) : 1;

	  function quantizePoint(coordinates) {
	    coordinates[0] = Math.round((coordinates[0] - x0) * kx);
	    coordinates[1] = Math.round((coordinates[1] - y0) * ky);
	    return coordinates;
	  }

	  function quantizeLine(coordinates) {
	    var i = 0,
	        j = 1,
	        n = coordinates.length,
	        pi = quantizePoint(coordinates[0]),
	        pj,
	        px = pi[0],
	        py = pi[1],
	        x,
	        y;

	    while (++i < n) {
	      pi = quantizePoint(coordinates[i]);
	      x = pi[0];
	      y = pi[1];
	      if (x !== px || y !== py) { // skip coincident points
	        pj = coordinates[j++];
	        pj[0] = px = x;
	        pj[1] = py = y;
	      }
	    }

	    coordinates.length = j;
	  }

	  function quantizeGeometry(o) {
	    if (o && quantizeGeometryType.hasOwnProperty(o.type)) quantizeGeometryType[o.type](o);
	  }

	  var quantizeGeometryType = {
	    GeometryCollection: function(o) {
	      o.geometries.forEach(quantizeGeometry);
	    },
	    Point: function(o) {
	      quantizePoint(o.coordinates);
	    },
	    MultiPoint: function(o) {
	      o.coordinates.forEach(quantizePoint);
	    },
	    LineString: function(o) {
	      var line = o.coordinates;
	      quantizeLine(line);
	      if (line.length < 2) line[1] = line[0]; // must have 2+
	    },
	    MultiLineString: function(o) {
	      for (var lines = o.coordinates, i = 0, n = lines.length; i < n; ++i) {
	        var line = lines[i];
	        quantizeLine(line);
	        if (line.length < 2) line[1] = line[0]; // must have 2+
	      }
	    },
	    Polygon: function(o) {
	      for (var rings = o.coordinates, i = 0, n = rings.length; i < n; ++i) {
	        var ring = rings[i];
	        quantizeLine(ring);
	        while (ring.length < 4) ring.push(ring[0]); // must have 4+
	      }
	    },
	    MultiPolygon: function(o) {
	      for (var polygons = o.coordinates, i = 0, n = polygons.length; i < n; ++i) {
	        for (var rings = polygons[i], j = 0, m = rings.length; j < m; ++j) {
	          var ring = rings[j];
	          quantizeLine(ring);
	          while (ring.length < 4) ring.push(ring[0]); // must have 4+
	        }
	      }
	    }
	  };

	  for (var key in objects) {
	    quantizeGeometry(objects[key]);
	  }

	  return {
	    scale: [1 / kx, 1 / ky],
	    translate: [x0, y0]
	  };
	};

	// Constructs the TopoJSON Topology for the specified hash of features.
	// Each object in the specified hash must be a GeoJSON object,
	// meaning FeatureCollection, a Feature or a geometry object.
	var topology = function(objects, quantization) {
	  var bbox = bounds(geometry(objects)),
	      transform = quantization > 0 && bbox && prequantize(objects, bbox, quantization),
	      topology = dedup(cut(extract(objects))),
	      coordinates = topology.coordinates,
	      indexByArc = hashmap(topology.arcs.length * 1.4, hashArc, equalArc);

	  objects = topology.objects; // for garbage collection
	  topology.bbox = bbox;
	  topology.arcs = topology.arcs.map(function(arc, i) {
	    indexByArc.set(arc, i);
	    return coordinates.slice(arc[0], arc[1] + 1);
	  });

	  delete topology.coordinates;
	  coordinates = null;

	  function indexGeometry(geometry$$1) {
	    if (geometry$$1 && indexGeometryType.hasOwnProperty(geometry$$1.type)) indexGeometryType[geometry$$1.type](geometry$$1);
	  }

	  var indexGeometryType = {
	    GeometryCollection: function(o) { o.geometries.forEach(indexGeometry); },
	    LineString: function(o) { o.arcs = indexArcs(o.arcs); },
	    MultiLineString: function(o) { o.arcs = o.arcs.map(indexArcs); },
	    Polygon: function(o) { o.arcs = o.arcs.map(indexArcs); },
	    MultiPolygon: function(o) { o.arcs = o.arcs.map(indexMultiArcs); }
	  };

	  function indexArcs(arc) {
	    var indexes = [];
	    do {
	      var index = indexByArc.get(arc);
	      indexes.push(arc[0] < arc[1] ? index : ~index);
	    } while (arc = arc.next);
	    return indexes;
	  }

	  function indexMultiArcs(arcs) {
	    return arcs.map(indexArcs);
	  }

	  for (var key in objects) {
	    indexGeometry(objects[key]);
	  }

	  if (transform) {
	    topology.transform = transform;
	    delta(topology);
	  }

	  return topology;
	};

	function hashArc(arc) {
	  var i = arc[0], j = arc[1], t;
	  if (j < i) t = i, i = j, j = t;
	  return i + 31 * j;
	}

	function equalArc(arcA, arcB) {
	  var ia = arcA[0], ja = arcA[1],
	      ib = arcB[0], jb = arcB[1], t;
	  if (ja < ia) t = ia, ia = ja, ja = t;
	  if (jb < ib) t = ib, ib = jb, jb = t;
	  return ia === ib && ja === jb;
	}

	var prune = function(topology) {
	  var oldArcs = topology.arcs,
	      newArcs = topology.arcs = [],
	      newArcIndex = -1,
	      newIndexByOldIndex = new Array(oldArcs.length),
	      name;

	  function pruneGeometry(o) {
	    switch (o.type) {
	      case "GeometryCollection": o.geometries.forEach(pruneGeometry); break;
	      case "LineString": pruneArcs(o.arcs); break;
	      case "MultiLineString": o.arcs.forEach(pruneArcs); break;
	      case "Polygon": o.arcs.forEach(pruneArcs); break;
	      case "MultiPolygon": o.arcs.forEach(pruneMultiArcs); break;
	    }
	  }

	  function pruneArcs(arcs) {
	    for (var i = 0, n = arcs.length; i < n; ++i) {
	      var oldIndex = arcs[i],
	          oldReverse = oldIndex < 0 && (oldIndex = ~oldIndex, true),
	          newIndex;

	      // If this is the first instance of this arc,
	      // record it under its new index.
	      if ((newIndex = newIndexByOldIndex[oldIndex]) == null) {
	        newIndexByOldIndex[oldIndex] = newIndex = ++newArcIndex;
	        newArcs[newIndex] = oldArcs[oldIndex];
	      }

	      arcs[i] = oldReverse ? ~newIndex : newIndex;
	    }
	  }

	  function pruneMultiArcs(arcs) {
	    arcs.forEach(pruneArcs);
	  }

	  for (name in topology.objects) {
	    pruneGeometry(topology.objects[name]);
	  }

	  return topology;
	};

	var filter = function(topology, filter) {
	  var name;

	  if (filter == null) filter = filterTrue;

	  function filterGeometry(o) {
	    switch (o.type) {
	      case "Polygon": {
	        o.arcs = filterRings(o.arcs);
	        if (!o.arcs) o.type = null, delete o.arcs;
	        break;
	      }
	      case "MultiPolygon": {
	        o.arcs = o.arcs.map(filterRings).filter(filterIdentity);
	        if (!o.arcs.length) o.type = null, delete o.arcs;
	        break;
	      }
	      case "GeometryCollection": {
	        o.geometries.forEach(filterGeometry);
	        o.geometries = o.geometries.filter(filterNotNull);
	        if (!o.geometries.length) o.type = null, delete o.geometries;
	        break;
	      }
	    }
	  }

	  function filterRings(arcs) {
	    return arcs.length && filterExteriorRing(arcs[0]) // if the exterior is small, ignore any holes
	        ? [arcs.shift()].concat(arcs.filter(filterInteriorRing))
	        : null;
	  }

	  function filterExteriorRing(ring) {
	    return filter(ring, false);
	  }

	  function filterInteriorRing(ring) {
	    return filter(ring, true);
	  }

	  for (name in topology.objects) {
	    filterGeometry(topology.objects[name]);
	  }

	  return prune(topology);
	};

	function filterTrue() {
	  return true;
	}

	function filterIdentity(x) {
	  return x;
	}

	function filterNotNull(geometry) {
	  return geometry.type != null;
	}

	var filterAttached = function(topology) {
	  var uniqueRingByArc = {}, // arc index -> index of unique associated ring, or -1 if used by multiple rings
	      ringIndex = 0,
	      name;

	  function testGeometry(o) {
	    switch (o.type) {
	      case "GeometryCollection": o.geometries.forEach(testGeometry); break;
	      case "Polygon": testArcs(o.arcs); break;
	      case "MultiPolygon": o.arcs.forEach(testArcs); break;
	    }
	  }

	  function testArcs(arcs) {
	    for (var i = 0, n = arcs.length; i < n; ++i, ++ringIndex) {
	      for (var ring = arcs[i], j = 0, m = ring.length; j < m; ++j) {
	        var arc = ring[j];
	        if (arc < 0) arc = ~arc;
	        var uniqueRing = uniqueRingByArc[arc];
	        if (uniqueRing >= 0 && uniqueRing !== ringIndex) uniqueRingByArc[arc] = -1;
	        else uniqueRingByArc[arc] = ringIndex;
	      }
	    }
	  }

	  for (name in topology.objects) {
	    testGeometry(topology.objects[name]);
	  }

	  return function(ring) {
	    for (var j = 0, m = ring.length, arc; j < m; ++j) {
	      if (arc = ring[j], uniqueRingByArc[arc < 0 ? ~arc : arc] < 0) {
	        return true;
	      }
	    }
	    return false;
	  };
	};

	var identity = function(x) {
	  return x;
	};

	var transform = function(topology) {
	  if ((transform = topology.transform) == null) return identity;
	  var transform,
	      x0,
	      y0,
	      kx = transform.scale[0],
	      ky = transform.scale[1],
	      dx = transform.translate[0],
	      dy = transform.translate[1];
	  return function(point, i) {
	    if (!i) x0 = y0 = 0;
	    point[0] = (x0 += point[0]) * kx + dx;
	    point[1] = (y0 += point[1]) * ky + dy;
	    return point;
	  };
	};

	var bbox = function(topology) {
	  var bbox = topology.bbox;

	  function bboxPoint(p0) {
	    p1[0] = p0[0], p1[1] = p0[1], t(p1);
	    if (p1[0] < x0) x0 = p1[0];
	    if (p1[0] > x1) x1 = p1[0];
	    if (p1[1] < y0) y0 = p1[1];
	    if (p1[1] > y1) y1 = p1[1];
	  }

	  function bboxGeometry(o) {
	    switch (o.type) {
	      case "GeometryCollection": o.geometries.forEach(bboxGeometry); break;
	      case "Point": bboxPoint(o.coordinates); break;
	      case "MultiPoint": o.coordinates.forEach(bboxPoint); break;
	    }
	  }

	  if (!bbox) {
	    var t = transform(topology), p0, p1 = new Array(2), name,
	        x0 = Infinity, y0 = x0, x1 = -x0, y1 = -x0;

	    topology.arcs.forEach(function(arc) {
	      var i = -1, n = arc.length;
	      while (++i < n) {
	        p0 = arc[i], p1[0] = p0[0], p1[1] = p0[1], t(p1, i);
	        if (p1[0] < x0) x0 = p1[0];
	        if (p1[0] > x1) x1 = p1[0];
	        if (p1[1] < y0) y0 = p1[1];
	        if (p1[1] > y1) y1 = p1[1];
	      }
	    });

	    for (name in topology.objects) {
	      bboxGeometry(topology.objects[name]);
	    }

	    bbox = topology.bbox = [x0, y0, x1, y1];
	  }

	  return bbox;
	};

	var reverse$1 = function(array, n) {
	  var t, j = array.length, i = j - n;
	  while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
	};

	var feature = function(topology, o) {
	  return o.type === "GeometryCollection"
	      ? {type: "FeatureCollection", features: o.geometries.map(function(o) { return feature$1(topology, o); })}
	      : feature$1(topology, o);
	};

	function feature$1(topology, o) {
	  var id = o.id,
	      bbox = o.bbox,
	      properties = o.properties == null ? {} : o.properties,
	      geometry = object(topology, o);
	  return id == null && bbox == null ? {type: "Feature", properties: properties, geometry: geometry}
	      : bbox == null ? {type: "Feature", id: id, properties: properties, geometry: geometry}
	      : {type: "Feature", id: id, bbox: bbox, properties: properties, geometry: geometry};
	}

	function object(topology, o) {
	  var transformPoint = transform(topology),
	      arcs = topology.arcs;

	  function arc(i, points) {
	    if (points.length) points.pop();
	    for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
	      points.push(transformPoint(a[k].slice(), k));
	    }
	    if (i < 0) reverse$1(points, n);
	  }

	  function point(p) {
	    return transformPoint(p.slice());
	  }

	  function line(arcs) {
	    var points = [];
	    for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
	    if (points.length < 2) points.push(points[0].slice());
	    return points;
	  }

	  function ring(arcs) {
	    var points = line(arcs);
	    while (points.length < 4) points.push(points[0].slice());
	    return points;
	  }

	  function polygon(arcs) {
	    return arcs.map(ring);
	  }

	  function geometry(o) {
	    var type = o.type, coordinates;
	    switch (type) {
	      case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
	      case "Point": coordinates = point(o.coordinates); break;
	      case "MultiPoint": coordinates = o.coordinates.map(point); break;
	      case "LineString": coordinates = line(o.arcs); break;
	      case "MultiLineString": coordinates = o.arcs.map(line); break;
	      case "Polygon": coordinates = polygon(o.arcs); break;
	      case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
	      default: return null;
	    }
	    return {type: type, coordinates: coordinates};
	  }

	  return geometry(o);
	}

	var stitch = function(topology, arcs) {
	  var stitchedArcs = {},
	      fragmentByStart = {},
	      fragmentByEnd = {},
	      fragments = [],
	      emptyIndex = -1;

	  // Stitch empty arcs first, since they may be subsumed by other arcs.
	  arcs.forEach(function(i, j) {
	    var arc = topology.arcs[i < 0 ? ~i : i], t;
	    if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
	      t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
	    }
	  });

	  arcs.forEach(function(i) {
	    var e = ends(i),
	        start = e[0],
	        end = e[1],
	        f, g;

	    if (f = fragmentByEnd[start]) {
	      delete fragmentByEnd[f.end];
	      f.push(i);
	      f.end = end;
	      if (g = fragmentByStart[end]) {
	        delete fragmentByStart[g.start];
	        var fg = g === f ? f : f.concat(g);
	        fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
	      } else {
	        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
	      }
	    } else if (f = fragmentByStart[end]) {
	      delete fragmentByStart[f.start];
	      f.unshift(i);
	      f.start = start;
	      if (g = fragmentByEnd[start]) {
	        delete fragmentByEnd[g.end];
	        var gf = g === f ? f : g.concat(f);
	        fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
	      } else {
	        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
	      }
	    } else {
	      f = [i];
	      fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
	    }
	  });

	  function ends(i) {
	    var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
	    if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
	    else p1 = arc[arc.length - 1];
	    return i < 0 ? [p1, p0] : [p0, p1];
	  }

	  function flush(fragmentByEnd, fragmentByStart) {
	    for (var k in fragmentByEnd) {
	      var f = fragmentByEnd[k];
	      delete fragmentByStart[f.start];
	      delete f.start;
	      delete f.end;
	      f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
	      fragments.push(f);
	    }
	  }

	  flush(fragmentByEnd, fragmentByStart);
	  flush(fragmentByStart, fragmentByEnd);
	  arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });

	  return fragments;
	};

	var mesh = function(topology) {
	  return object(topology, meshArcs.apply(this, arguments));
	};

	function meshArcs(topology, object$$1, filter) {
	  var arcs, i, n;
	  if (arguments.length > 1) arcs = extractArcs(topology, object$$1, filter);
	  else for (i = 0, arcs = new Array(n = topology.arcs.length); i < n; ++i) arcs[i] = i;
	  return {type: "MultiLineString", arcs: stitch(topology, arcs)};
	}

	function extractArcs(topology, object$$1, filter) {
	  var arcs = [],
	      geomsByArc = [],
	      geom;

	  function extract0(i) {
	    var j = i < 0 ? ~i : i;
	    (geomsByArc[j] || (geomsByArc[j] = [])).push({i: i, g: geom});
	  }

	  function extract1(arcs) {
	    arcs.forEach(extract0);
	  }

	  function extract2(arcs) {
	    arcs.forEach(extract1);
	  }

	  function extract3(arcs) {
	    arcs.forEach(extract2);
	  }

	  function geometry(o) {
	    switch (geom = o, o.type) {
	      case "GeometryCollection": o.geometries.forEach(geometry); break;
	      case "LineString": extract1(o.arcs); break;
	      case "MultiLineString": case "Polygon": extract2(o.arcs); break;
	      case "MultiPolygon": extract3(o.arcs); break;
	    }
	  }

	  geometry(object$$1);

	  geomsByArc.forEach(filter == null
	      ? function(geoms) { arcs.push(geoms[0].i); }
	      : function(geoms) { if (filter(geoms[0].g, geoms[geoms.length - 1].g)) arcs.push(geoms[0].i); });

	  return arcs;
	}

	function planarRingArea(ring) {
	  var i = -1, n = ring.length, a, b = ring[n - 1], area = 0;
	  while (++i < n) a = b, b = ring[i], area += a[0] * b[1] - a[1] * b[0];
	  return Math.abs(area); // Note: doubled area!
	}

	var merge = function(topology) {
	  return object(topology, mergeArcs.apply(this, arguments));
	};

	function mergeArcs(topology, objects) {
	  var polygonsByArc = {},
	      polygons = [],
	      groups = [];

	  objects.forEach(geometry);

	  function geometry(o) {
	    switch (o.type) {
	      case "GeometryCollection": o.geometries.forEach(geometry); break;
	      case "Polygon": extract(o.arcs); break;
	      case "MultiPolygon": o.arcs.forEach(extract); break;
	    }
	  }

	  function extract(polygon) {
	    polygon.forEach(function(ring) {
	      ring.forEach(function(arc) {
	        (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
	      });
	    });
	    polygons.push(polygon);
	  }

	  function area(ring) {
	    return planarRingArea(object(topology, {type: "Polygon", arcs: [ring]}).coordinates[0]);
	  }

	  polygons.forEach(function(polygon) {
	    if (!polygon._) {
	      var group = [],
	          neighbors = [polygon];
	      polygon._ = 1;
	      groups.push(group);
	      while (polygon = neighbors.pop()) {
	        group.push(polygon);
	        polygon.forEach(function(ring) {
	          ring.forEach(function(arc) {
	            polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
	              if (!polygon._) {
	                polygon._ = 1;
	                neighbors.push(polygon);
	              }
	            });
	          });
	        });
	      }
	    }
	  });

	  polygons.forEach(function(polygon) {
	    delete polygon._;
	  });

	  return {
	    type: "MultiPolygon",
	    arcs: groups.map(function(polygons) {
	      var arcs = [], n;

	      // Extract the exterior (unique) arcs.
	      polygons.forEach(function(polygon) {
	        polygon.forEach(function(ring) {
	          ring.forEach(function(arc) {
	            if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
	              arcs.push(arc);
	            }
	          });
	        });
	      });

	      // Stitch the arcs into one or more rings.
	      arcs = stitch(topology, arcs);

	      // If more than one ring is returned,
	      // at most one of these rings can be the exterior;
	      // choose the one with the greatest absolute area.
	      if ((n = arcs.length) > 1) {
	        for (var i = 1, k = area(arcs[0]), ki, t; i < n; ++i) {
	          if ((ki = area(arcs[i])) > k) {
	            t = arcs[0], arcs[0] = arcs[i], arcs[i] = t, k = ki;
	          }
	        }
	      }

	      return arcs;
	    })
	  };
	}

	var bisect = function(a, x) {
	  var lo = 0, hi = a.length;
	  while (lo < hi) {
	    var mid = lo + hi >>> 1;
	    if (a[mid] < x) lo = mid + 1;
	    else hi = mid;
	  }
	  return lo;
	};

	var neighbors = function(objects) {
	  var indexesByArc = {}, // arc index -> array of object indexes
	      neighbors = objects.map(function() { return []; });

	  function line(arcs, i) {
	    arcs.forEach(function(a) {
	      if (a < 0) a = ~a;
	      var o = indexesByArc[a];
	      if (o) o.push(i);
	      else indexesByArc[a] = [i];
	    });
	  }

	  function polygon(arcs, i) {
	    arcs.forEach(function(arc) { line(arc, i); });
	  }

	  function geometry(o, i) {
	    if (o.type === "GeometryCollection") o.geometries.forEach(function(o) { geometry(o, i); });
	    else if (o.type in geometryType) geometryType[o.type](o.arcs, i);
	  }

	  var geometryType = {
	    LineString: line,
	    MultiLineString: polygon,
	    Polygon: polygon,
	    MultiPolygon: function(arcs, i) { arcs.forEach(function(arc) { polygon(arc, i); }); }
	  };

	  objects.forEach(geometry);

	  for (var i in indexesByArc) {
	    for (var indexes = indexesByArc[i], m = indexes.length, j = 0; j < m; ++j) {
	      for (var k = j + 1; k < m; ++k) {
	        var ij = indexes[j], ik = indexes[k], n;
	        if ((n = neighbors[ij])[i = bisect(n, ik)] !== ik) n.splice(i, 0, ik);
	        if ((n = neighbors[ik])[i = bisect(n, ij)] !== ij) n.splice(i, 0, ij);
	      }
	    }
	  }

	  return neighbors;
	};

	var quantize = function(topology, n) {
	  if (!((n = Math.floor(n)) >= 2)) throw new Error("n must be \u22652");
	  if (topology.transform) throw new Error("already quantized");
	  var bb = bbox(topology), name,
	      dx = bb[0], kx = (bb[2] - dx) / (n - 1) || 1,
	      dy = bb[1], ky = (bb[3] - dy) / (n - 1) || 1;

	  function quantizePoint(p) {
	    p[0] = Math.round((p[0] - dx) / kx);
	    p[1] = Math.round((p[1] - dy) / ky);
	  }

	  function quantizeGeometry(o) {
	    switch (o.type) {
	      case "GeometryCollection": o.geometries.forEach(quantizeGeometry); break;
	      case "Point": quantizePoint(o.coordinates); break;
	      case "MultiPoint": o.coordinates.forEach(quantizePoint); break;
	    }
	  }

	  topology.arcs.forEach(function(arc) {
	    var i = 1,
	        j = 1,
	        n = arc.length,
	        pi = arc[0],
	        x0 = pi[0] = Math.round((pi[0] - dx) / kx),
	        y0 = pi[1] = Math.round((pi[1] - dy) / ky),
	        pj,
	        x1,
	        y1;

	    for (; i < n; ++i) {
	      pi = arc[i];
	      x1 = Math.round((pi[0] - dx) / kx);
	      y1 = Math.round((pi[1] - dy) / ky);
	      if (x1 !== x0 || y1 !== y0) {
	        pj = arc[j++];
	        pj[0] = x1 - x0, x0 = x1;
	        pj[1] = y1 - y0, y0 = y1;
	      }
	    }

	    if (j < 2) {
	      pj = arc[j++];
	      pj[0] = 0;
	      pj[1] = 0;
	    }

	    arc.length = j;
	  });

	  for (name in topology.objects) {
	    quantizeGeometry(topology.objects[name]);
	  }

	  topology.transform = {
	    scale: [kx, ky],
	    translate: [dx, dy]
	  };

	  return topology;
	};

	var untransform = function(topology) {
	  if ((transform = topology.transform) == null) return identity;
	  var transform,
	      x0,
	      y0,
	      kx = transform.scale[0],
	      ky = transform.scale[1],
	      dx = transform.translate[0],
	      dy = transform.translate[1];
	  return function(point, i) {
	    if (!i) x0 = y0 = 0;
	    var x1 = Math.round((point[0] - dx) / kx),
	        y1 = Math.round((point[1] - dy) / ky);
	    point[0] = x1 - x0, x0 = x1;
	    point[1] = y1 - y0, y0 = y1;
	    return point;
	  };
	};

	function planarTriangleArea(triangle) {
	  var a = triangle[0], b = triangle[1], c = triangle[2];
	  return Math.abs((a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]));
	}

	function planarRingArea$1(ring) {
	  var i = -1, n = ring.length, a, b = ring[n - 1], area = 0;
	  while (++i < n) a = b, b = ring[i], area += a[0] * b[1] - a[1] * b[0];
	  return Math.abs(area) / 2;
	}

	var filterWeight = function(topology, minWeight, weight) {
	  minWeight = minWeight == null ? Number.MIN_VALUE : +minWeight;

	  if (weight == null) weight = planarRingArea$1;

	  return function(ring, interior) {
	    return weight(feature(topology, {type: "Polygon", arcs: [ring]}).geometry.coordinates[0], interior) >= minWeight;
	  };
	};

	function compare(a, b) {
	  return a[1][2] - b[1][2];
	}

	var newHeap = function() {
	  var heap = {},
	      array = [],
	      size = 0;

	  heap.push = function(object) {
	    up(array[object._ = size] = object, size++);
	    return size;
	  };

	  heap.pop = function() {
	    if (size <= 0) return;
	    var removed = array[0], object;
	    if (--size > 0) object = array[size], down(array[object._ = 0] = object, 0);
	    return removed;
	  };

	  heap.remove = function(removed) {
	    var i = removed._, object;
	    if (array[i] !== removed) return; // invalid request
	    if (i !== --size) object = array[size], (compare(object, removed) < 0 ? up : down)(array[object._ = i] = object, i);
	    return i;
	  };

	  function up(object, i) {
	    while (i > 0) {
	      var j = ((i + 1) >> 1) - 1,
	          parent = array[j];
	      if (compare(object, parent) >= 0) break;
	      array[parent._ = i] = parent;
	      array[object._ = i = j] = object;
	    }
	  }

	  function down(object, i) {
	    while (true) {
	      var r = (i + 1) << 1,
	          l = r - 1,
	          j = i,
	          child = array[j];
	      if (l < size && compare(array[l], child) < 0) child = array[j = l];
	      if (r < size && compare(array[r], child) < 0) child = array[j = r];
	      if (j === i) break;
	      array[child._ = i] = child;
	      array[object._ = i = j] = object;
	    }
	  }

	  return heap;
	};

	var presimplify = function(topology, weight) {
	  var absolute = transform(topology),
	      relative = untransform(topology),
	      heap = newHeap();

	  if (weight == null) weight = planarTriangleArea;

	  topology.arcs.forEach(function(arc) {
	    var triangles = [],
	        maxWeight = 0,
	        triangle,
	        i,
	        n;

	    arc.forEach(absolute);

	    for (i = 1, n = arc.length - 1; i < n; ++i) {
	      triangle = arc.slice(i - 1, i + 2);
	      triangle[1][2] = weight(triangle);
	      triangles.push(triangle);
	      heap.push(triangle);
	    }

	    // Always keep the arc endpoints!
	    arc[0][2] = arc[n][2] = Infinity;

	    for (i = 0, n = triangles.length; i < n; ++i) {
	      triangle = triangles[i];
	      triangle.previous = triangles[i - 1];
	      triangle.next = triangles[i + 1];
	    }

	    while (triangle = heap.pop()) {
	      var previous = triangle.previous,
	          next = triangle.next;

	      // If the weight of the current point is less than that of the previous
	      // point to be eliminated, use the latter’s weight instead. This ensures
	      // that the current point cannot be eliminated without eliminating
	      // previously- eliminated points.
	      if (triangle[1][2] < maxWeight) triangle[1][2] = maxWeight;
	      else maxWeight = triangle[1][2];

	      if (previous) {
	        previous.next = next;
	        previous[2] = triangle[2];
	        update(previous);
	      }

	      if (next) {
	        next.previous = previous;
	        next[0] = triangle[0];
	        update(next);
	      }
	    }

	    arc.forEach(relative);
	  });

	  function update(triangle) {
	    heap.remove(triangle);
	    triangle[1][2] = weight(triangle);
	    heap.push(triangle);
	  }

	  return topology;
	};

	var quantile = function(topology, p) {
	  var array = [];

	  topology.arcs.forEach(function(arc) {
	    arc.forEach(function(point) {
	      if (isFinite(point[2])) { // Ignore endpoints, whose weight is Infinity.
	        array.push(point[2]);
	      }
	    });
	  });

	  return array.length && quantile$1(array.sort(descending), p);
	};

	function quantile$1(array, p) {
	  if (!(n = array.length)) return;
	  if ((p = +p) <= 0 || n < 2) return array[0];
	  if (p >= 1) return array[n - 1];
	  var n,
	      h = (n - 1) * p,
	      i = Math.floor(h),
	      a = array[i],
	      b = array[i + 1];
	  return a + (b - a) * (h - i);
	}

	function descending(a, b) {
	  return b - a;
	}

	var simplify = function(topology, minWeight) {
	  minWeight = minWeight == null ? Number.MIN_VALUE : +minWeight;

	  // Remove points whose weight is less than the minimum weight.
	  topology.arcs.forEach(topology.transform ? function(arc) {
	    var dx = 0,
	        dy = 0, // accumulate removed points
	        i = -1,
	        j = -1,
	        n = arc.length,
	        source,
	        target;

	    while (++i < n) {
	      source = arc[i];
	      if (source[2] >= minWeight) {
	        target = arc[++j];
	        target[0] = source[0] + dx;
	        target[1] = source[1] + dy;
	        dx = dy = 0;
	      } else {
	        dx += source[0];
	        dy += source[1];
	      }
	    }

	    arc.length = ++j;
	  } : function(arc) {
	    var i = -1,
	        j = -1,
	        n = arc.length,
	        point;

	    while (++i < n) {
	      point = arc[i];
	      if (point[2] >= minWeight) {
	        arc[++j] = point;
	      }
	    }

	    arc.length = ++j;
	  });

	  // Remove the computed weight for each point, and remove coincident points.
	  // This is done as a separate pass because some coordinates may be shared
	  // between arcs (such as the last point and first point of a cut line).
	  // If the entire arc is empty, retain at least two points (per spec).
	  topology.arcs.forEach(topology.transform ? function(arc) {
	    var i = 0,
	        j = 0,
	        n = arc.length,
	        p = arc[0];
	    p.length = 2;
	    while (++i < n) {
	      p = arc[i];
	      p.length = 2;
	      if (p[0] || p[1]) arc[++j] = p;
	    }
	    arc.length = (j || 1) + 1;
	  } : function(arc) {
	    var i = 0,
	        j = 0,
	        n = arc.length,
	        p = arc[0],
	        x0 = p[0],
	        y0 = p[1],
	        x1,
	        y1;
	    p.length = 2;
	    while (++i < n) {
	      p = arc[i], x1 = p[0], y1 = p[1];
	      p.length = 2;
	      if (x0 !== x1 || y0 !== y1) arc[++j] = p, x0 = x1, y0 = y1;
	    }
	    arc.length = (j || 1) + 1;
	  });

	  return topology;
	};

	var pi = Math.PI;
	var tau = 2 * pi;
	var fourPi = 4 * pi;
	var radians = pi / 180;
	var abs = Math.abs;
	var atan = Math.atan;
	var atan2 = Math.atan2;
	var cos = Math.cos;
	var max = Math.max;
	var sin = Math.sin;
	var sqrt = Math.sqrt;
	var tan = Math.tan;

	function sphericalRingArea(ring, interior) {
	  if (!ring.length) return 0;
	  var sum = 0,
	      point = ring[0],
	      lambda0, lambda1 = point[0] * radians, delta,
	      phi1 = (point[1] * radians + tau) / 2,
	      cosPhi0, cosPhi1 = cos(phi1),
	      sinPhi0, sinPhi1 = sin(phi1),
	      i, n, k;

	  for (i = 1, n = ring.length; i < n; ++i) {
	    point = ring[i];
	    lambda0 = lambda1, lambda1 = point[0] * radians, delta = lambda1 - lambda0;
	    phi1 = (point[1] * radians + tau) / 2;
	    cosPhi0 = cosPhi1, cosPhi1 = cos(phi1);
	    sinPhi0 = sinPhi1, sinPhi1 = sin(phi1);

	    // Spherical excess E for a spherical triangle with vertices: south pole,
	    // previous point, current point. Uses a formula derived from Cagnoli’s
	    // theorem. See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
	    k = sinPhi0 * sinPhi1;
	    sum += atan2(k * sin(delta), cosPhi0 * cosPhi1 + k * cos(delta));
	  }

	  sum = 2 * (sum > pi ? sum - tau : sum < -pi ? sum + tau : sum);
	  if (interior) sum *= -1;
	  return sum < 0 ? sum + fourPi : sum;
	}

	function sphericalTriangleArea(t) {
	  var lambda0 = t[0][0] * radians, phi0 = t[0][1] * radians, cosPhi0 = cos(phi0), sinPhi0 = sin(phi0),
	      lambda1 = t[1][0] * radians, phi1 = t[1][1] * radians, cosPhi1 = cos(phi1), sinPhi1 = sin(phi1),
	      lambda2 = t[2][0] * radians, phi2 = t[2][1] * radians, cosPhi2 = cos(phi2), sinPhi2 = sin(phi2),
	      a = distance(lambda0, cosPhi0, sinPhi0, lambda1, cosPhi1, sinPhi1),
	      b = distance(lambda1, cosPhi1, sinPhi1, lambda2, cosPhi2, sinPhi2),
	      c = distance(lambda2, cosPhi2, sinPhi2, lambda0, cosPhi0, sinPhi0),
	      s = (a + b + c) / 2;
	  return 4 * atan(sqrt(max(0, tan(s / 2) * tan((s - a) / 2) * tan((s - b) / 2) * tan((s - c) / 2))));
	}

	function distance(lambda0, sinPhi0, cosPhi0, lambda1, sinPhi1, cosPhi1) {
	  var delta = abs(lambda1 - lambda0),
	      cosDelta = cos(delta),
	      sinDelta = sin(delta),
	      x = cosPhi1 * sinDelta,
	      y = cosPhi0 * sinPhi1 - sinPhi0 * cosPhi1 * cosDelta,
	      z = sinPhi0 * sinPhi1 + cosPhi0 * cosPhi1 * cosDelta;
	  return atan2(sqrt(x * x + y * y), z);
	}

	exports.topology = topology;
	exports.filter = filter;
	exports.filterAttached = filterAttached;
	exports.filterWeight = filterWeight;
	exports.planarRingArea = planarRingArea$1;
	exports.planarTriangleArea = planarTriangleArea;
	exports.presimplify = presimplify;
	exports.quantile = quantile;
	exports.simplify = simplify;
	exports.sphericalRingArea = sphericalRingArea;
	exports.sphericalTriangleArea = sphericalTriangleArea;
	exports.bbox = bbox;
	exports.feature = feature;
	exports.merge = merge;
	exports.mergeArcs = mergeArcs;
	exports.mesh = mesh;
	exports.meshArcs = meshArcs;
	exports.neighbors = neighbors;
	exports.quantize = quantize;
	exports.transform = transform;
	exports.untransform = untransform;

	Object.defineProperty(exports, '__esModule', { value: true });

	})));


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
		"type": "Topology",
		"transform": {
			"scale": [
				0.03600360036003601,
				0.017366249624962495
			],
			"translate": [
				-180,
				-90
			]
		},
		"objects": {
			"land": {
				"type": "MultiPolygon",
				"arcs": [
					[
						[
							0
						]
					],
					[
						[
							1
						]
					],
					[
						[
							2
						]
					],
					[
						[
							3
						]
					],
					[
						[
							4
						]
					],
					[
						[
							5
						]
					],
					[
						[
							6
						]
					],
					[
						[
							7,
							8
						]
					],
					[
						[
							9,
							10
						]
					],
					[
						[
							11
						]
					],
					[
						[
							12
						]
					],
					[
						[
							13
						]
					],
					[
						[
							14
						]
					],
					[
						[
							15
						]
					],
					[
						[
							16
						]
					],
					[
						[
							17
						]
					],
					[
						[
							18
						]
					],
					[
						[
							19
						]
					],
					[
						[
							20
						]
					],
					[
						[
							21
						]
					],
					[
						[
							22
						]
					],
					[
						[
							23
						]
					],
					[
						[
							24
						]
					],
					[
						[
							25
						]
					],
					[
						[
							26
						]
					],
					[
						[
							27
						]
					],
					[
						[
							28,
							29
						]
					],
					[
						[
							30
						]
					],
					[
						[
							31
						]
					],
					[
						[
							32
						]
					],
					[
						[
							33
						]
					],
					[
						[
							34
						]
					],
					[
						[
							35
						]
					],
					[
						[
							36
						]
					],
					[
						[
							37
						]
					],
					[
						[
							38
						]
					],
					[
						[
							39
						]
					],
					[
						[
							40
						]
					],
					[
						[
							41,
							42
						]
					],
					[
						[
							43
						]
					],
					[
						[
							44
						]
					],
					[
						[
							45
						]
					],
					[
						[
							46,
							47,
							48,
							49
						]
					],
					[
						[
							50
						]
					],
					[
						[
							51
						]
					],
					[
						[
							52
						]
					],
					[
						[
							53
						]
					],
					[
						[
							54
						]
					],
					[
						[
							55
						]
					],
					[
						[
							56
						]
					],
					[
						[
							57
						]
					],
					[
						[
							58
						]
					],
					[
						[
							59
						]
					],
					[
						[
							60
						]
					],
					[
						[
							61,
							62
						]
					],
					[
						[
							63
						]
					],
					[
						[
							64
						]
					],
					[
						[
							65
						]
					],
					[
						[
							66
						]
					],
					[
						[
							67
						]
					],
					[
						[
							68
						]
					],
					[
						[
							69
						]
					],
					[
						[
							70
						]
					],
					[
						[
							71
						]
					],
					[
						[
							72
						]
					],
					[
						[
							73
						]
					],
					[
						[
							74
						]
					],
					[
						[
							75,
							76
						]
					],
					[
						[
							77
						]
					],
					[
						[
							78
						]
					],
					[
						[
							79
						]
					],
					[
						[
							80
						]
					],
					[
						[
							81
						]
					],
					[
						[
							82
						]
					],
					[
						[
							83
						]
					],
					[
						[
							84
						]
					],
					[
						[
							85
						]
					],
					[
						[
							86
						]
					],
					[
						[
							87
						]
					],
					[
						[
							88
						]
					],
					[
						[
							89,
							90
						]
					],
					[
						[
							91
						]
					],
					[
						[
							92
						]
					],
					[
						[
							93
						]
					],
					[
						[
							94
						]
					],
					[
						[
							95
						]
					],
					[
						[
							96
						]
					],
					[
						[
							97
						]
					],
					[
						[
							98
						]
					],
					[
						[
							99
						]
					],
					[
						[
							100
						]
					],
					[
						[
							101
						]
					],
					[
						[
							102
						]
					],
					[
						[
							103
						]
					],
					[
						[
							104
						]
					],
					[
						[
							105,
							106,
							107,
							108,
							109,
							110,
							111,
							112,
							113,
							114,
							115,
							116,
							117,
							118,
							119,
							120,
							121,
							122,
							123,
							124,
							125,
							126,
							127,
							128,
							129,
							130,
							131,
							132,
							133,
							134,
							135,
							136,
							137,
							138,
							139,
							140,
							141,
							142,
							143,
							144,
							145,
							146,
							147,
							148,
							149,
							150,
							151,
							152
						]
					],
					[
						[
							153,
							154
						]
					],
					[
						[
							155
						]
					],
					[
						[
							156
						]
					],
					[
						[
							157
						]
					],
					[
						[
							158
						]
					],
					[
						[
							159
						]
					],
					[
						[
							160
						]
					],
					[
						[
							161,
							162,
							163,
							164
						]
					],
					[
						[
							165
						]
					],
					[
						[
							166
						]
					],
					[
						[
							167
						]
					],
					[
						[
							168
						]
					],
					[
						[
							169
						]
					],
					[
						[
							170
						]
					],
					[
						[
							171
						]
					],
					[
						[
							172
						]
					],
					[
						[
							173,
							174,
							175,
							176,
							177,
							178,
							179,
							180,
							181,
							182,
							183,
							184,
							185,
							186,
							187,
							188,
							189,
							190,
							191,
							192,
							193,
							194,
							195,
							196,
							197,
							198,
							199,
							200,
							201,
							202,
							203,
							204,
							205,
							206,
							207,
							208,
							209,
							210,
							211,
							212,
							213,
							214,
							215,
							216,
							217,
							218,
							219,
							220,
							221,
							222,
							223,
							224,
							225,
							226,
							227,
							228,
							229,
							230,
							231,
							232,
							233,
							234,
							235,
							236,
							237,
							238,
							239,
							240,
							241,
							242,
							243,
							244,
							245,
							246,
							247,
							248,
							249,
							250,
							251,
							252,
							253,
							254,
							255,
							256,
							257,
							258,
							259,
							260,
							261,
							262,
							263,
							264,
							265,
							266,
							267,
							268,
							269,
							270,
							271,
							272,
							273,
							274,
							275,
							276,
							277
						],
						[
							278,
							279,
							280,
							281,
							282
						]
					],
					[
						[
							283
						]
					],
					[
						[
							284
						]
					],
					[
						[
							285
						]
					],
					[
						[
							286
						]
					],
					[
						[
							287
						]
					],
					[
						[
							288
						]
					],
					[
						[
							289
						]
					],
					[
						[
							290
						]
					],
					[
						[
							291
						]
					],
					[
						[
							292
						]
					],
					[
						[
							293
						]
					],
					[
						[
							294
						]
					],
					[
						[
							295
						]
					],
					[
						[
							296
						]
					]
				]
			},
			"countries": {
				"type": "GeometryCollection",
				"geometries": [
					{
						"type": "Polygon",
						"id": 4,
						"arcs": [
							[
								297,
								298,
								299,
								300,
								301,
								302
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 24,
						"arcs": [
							[
								[
									303,
									304,
									211,
									305
								]
							],
							[
								[
									213,
									306,
									307
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 8,
						"arcs": [
							[
								308,
								248,
								309,
								310,
								311
							]
						]
					},
					{
						"type": "Polygon",
						"id": 784,
						"arcs": [
							[
								312,
								195,
								313,
								314,
								193
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 32,
						"arcs": [
							[
								[
									315,
									10
								]
							],
							[
								[
									316,
									317,
									318,
									131,
									319,
									320
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 51,
						"arcs": [
							[
								321,
								322,
								323,
								324,
								325
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 10,
						"arcs": [
							[
								[
									0
								]
							],
							[
								[
									1
								]
							],
							[
								[
									2
								]
							],
							[
								[
									3
								]
							],
							[
								[
									4
								]
							],
							[
								[
									5
								]
							],
							[
								[
									6
								]
							],
							[
								[
									326
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 260,
						"arcs": [
							[
								327
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 36,
						"arcs": [
							[
								[
									13
								]
							],
							[
								[
									23
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 40,
						"arcs": [
							[
								328,
								329,
								330,
								331,
								332,
								333,
								334
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 31,
						"arcs": [
							[
								[
									335,
									-323
								]
							],
							[
								[
									282,
									336,
									-326,
									337,
									338
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 108,
						"arcs": [
							[
								339,
								340,
								341
							]
						]
					},
					{
						"type": "Polygon",
						"id": 56,
						"arcs": [
							[
								342,
								343,
								344,
								258,
								345
							]
						]
					},
					{
						"type": "Polygon",
						"id": 204,
						"arcs": [
							[
								346,
								347,
								348,
								219,
								349
							]
						]
					},
					{
						"type": "Polygon",
						"id": 854,
						"arcs": [
							[
								350,
								351,
								-347,
								352,
								353,
								354
							]
						]
					},
					{
						"type": "Polygon",
						"id": 50,
						"arcs": [
							[
								184,
								355,
								356
							]
						]
					},
					{
						"type": "Polygon",
						"id": 100,
						"arcs": [
							[
								245,
								357,
								358,
								359,
								360,
								361
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 44,
						"arcs": [
							[
								[
									70
								]
							],
							[
								[
									72
								]
							],
							[
								[
									73
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 70,
						"arcs": [
							[
								362,
								363,
								364
							]
						]
					},
					{
						"type": "Polygon",
						"id": 112,
						"arcs": [
							[
								365,
								366,
								367,
								368,
								369
							]
						]
					},
					{
						"type": "Polygon",
						"id": 84,
						"arcs": [
							[
								118,
								370,
								371
							]
						]
					},
					{
						"type": "Polygon",
						"id": 68,
						"arcs": [
							[
								372,
								373,
								374,
								375,
								-321
							]
						]
					},
					{
						"type": "Polygon",
						"id": 76,
						"arcs": [
							[
								376,
								-375,
								377,
								378,
								379,
								380,
								381,
								382,
								129,
								383,
								-318
							]
						]
					},
					{
						"type": "Polygon",
						"id": 96,
						"arcs": [
							[
								384,
								47
							]
						]
					},
					{
						"type": "Polygon",
						"id": 64,
						"arcs": [
							[
								385,
								386
							]
						]
					},
					{
						"type": "Polygon",
						"id": 72,
						"arcs": [
							[
								387,
								388,
								389,
								390
							]
						]
					},
					{
						"type": "Polygon",
						"id": 140,
						"arcs": [
							[
								391,
								392,
								393,
								394,
								395,
								396,
								397
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 124,
						"arcs": [
							[
								[
									83
								]
							],
							[
								[
									84
								]
							],
							[
								[
									85
								]
							],
							[
								[
									86
								]
							],
							[
								[
									398
								]
							],
							[
								[
									95
								]
							],
							[
								[
									96
								]
							],
							[
								[
									98
								]
							],
							[
								[
									100
								]
							],
							[
								[
									102
								]
							],
							[
								[
									399,
									146,
									400,
									148,
									401,
									150,
									402,
									152
								]
							],
							[
								[
									153,
									403
								]
							],
							[
								[
									155
								]
							],
							[
								[
									156
								]
							],
							[
								[
									157
								]
							],
							[
								[
									158
								]
							],
							[
								[
									160
								]
							],
							[
								[
									161,
									404,
									163,
									405
								]
							],
							[
								[
									166
								]
							],
							[
								[
									168
								]
							],
							[
								[
									169
								]
							],
							[
								[
									171
								]
							],
							[
								[
									172
								]
							],
							[
								[
									283
								]
							],
							[
								[
									284
								]
							],
							[
								[
									286
								]
							],
							[
								[
									287
								]
							],
							[
								[
									288
								]
							],
							[
								[
									294
								]
							],
							[
								[
									295
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 756,
						"arcs": [
							[
								406,
								407,
								408,
								-331
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 152,
						"arcs": [
							[
								[
									409,
									410,
									411,
									-316
								]
							],
							[
								[
									-320,
									132,
									412,
									-373
								]
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 156,
						"arcs": [
							[
								[
									63
								]
							],
							[
								[
									413,
									177,
									414,
									415,
									416,
									417,
									-386,
									418,
									419,
									420,
									421,
									-300,
									422,
									423,
									424,
									425,
									426,
									427
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 384,
						"arcs": [
							[
								428,
								429,
								430,
								-355,
								431,
								222
							]
						]
					},
					{
						"type": "Polygon",
						"id": 120,
						"arcs": [
							[
								432,
								217,
								433,
								434,
								435,
								-397,
								436,
								437
							]
						]
					},
					{
						"type": "Polygon",
						"id": 180,
						"arcs": [
							[
								438,
								-342,
								439,
								440,
								-306,
								212,
								-308,
								441,
								-395,
								442,
								443
							]
						]
					},
					{
						"type": "Polygon",
						"id": 178,
						"arcs": [
							[
								214,
								444,
								-437,
								-396,
								-442,
								-307
							]
						]
					},
					{
						"type": "Polygon",
						"id": 170,
						"arcs": [
							[
								135,
								445,
								124,
								446,
								-379,
								447,
								448
							]
						]
					},
					{
						"type": "Polygon",
						"id": 188,
						"arcs": [
							[
								449,
								122,
								450,
								137
							]
						]
					},
					{
						"type": "Polygon",
						"id": 192,
						"arcs": [
							[
								451
							]
						]
					},
					{
						"type": "Polygon",
						"id": -1,
						"arcs": [
							[
								452,
								76
							]
						]
					},
					{
						"type": "Polygon",
						"id": 196,
						"arcs": [
							[
								-453,
								75
							]
						]
					},
					{
						"type": "Polygon",
						"id": 203,
						"arcs": [
							[
								453,
								454,
								455,
								-333
							]
						]
					},
					{
						"type": "Polygon",
						"id": 276,
						"arcs": [
							[
								456,
								-454,
								-332,
								-409,
								457,
								458,
								-343,
								459,
								260,
								460,
								262
							]
						]
					},
					{
						"type": "Polygon",
						"id": 262,
						"arcs": [
							[
								461,
								462,
								463,
								203
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 208,
						"arcs": [
							[
								[
									91
								]
							],
							[
								[
									-461,
									261
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 214,
						"arcs": [
							[
								464,
								61
							]
						]
					},
					{
						"type": "Polygon",
						"id": 12,
						"arcs": [
							[
								465,
								466,
								467,
								468,
								233,
								469,
								470,
								471
							]
						]
					},
					{
						"type": "Polygon",
						"id": 218,
						"arcs": [
							[
								-449,
								472,
								134
							]
						]
					},
					{
						"type": "Polygon",
						"id": 818,
						"arcs": [
							[
								473,
								474,
								236,
								475,
								200
							]
						]
					},
					{
						"type": "Polygon",
						"id": 232,
						"arcs": [
							[
								476,
								202,
								-464,
								477
							]
						]
					},
					{
						"type": "Polygon",
						"id": 724,
						"arcs": [
							[
								478,
								254,
								479,
								256
							]
						]
					},
					{
						"type": "Polygon",
						"id": 233,
						"arcs": [
							[
								480,
								481,
								267
							]
						]
					},
					{
						"type": "Polygon",
						"id": 231,
						"arcs": [
							[
								-463,
								482,
								483,
								484,
								485,
								486,
								487,
								-478
							]
						]
					},
					{
						"type": "Polygon",
						"id": 246,
						"arcs": [
							[
								269,
								488,
								489,
								490
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 242,
						"arcs": [
							[
								[
									17
								]
							],
							[
								[
									18
								]
							],
							[
								[
									19
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 238,
						"arcs": [
							[
								491
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 250,
						"arcs": [
							[
								[
									492,
									493,
									494,
									128,
									-383
								]
							],
							[
								[
									81
								]
							],
							[
								[
									495,
									-458,
									-408,
									496,
									253,
									-479,
									257,
									-345
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 266,
						"arcs": [
							[
								497,
								-438,
								-445,
								215
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 826,
						"arcs": [
							[
								[
									498,
									89
								]
							],
							[
								[
									499,
									500,
									501,
									502
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 268,
						"arcs": [
							[
								503,
								-338,
								-325,
								504,
								241
							]
						]
					},
					{
						"type": "Polygon",
						"id": 288,
						"arcs": [
							[
								-432,
								-354,
								505,
								221
							]
						]
					},
					{
						"type": "Polygon",
						"id": 324,
						"arcs": [
							[
								506,
								225,
								507,
								508,
								509,
								-430,
								510
							]
						]
					},
					{
						"type": "Polygon",
						"id": 270,
						"arcs": [
							[
								228,
								511
							]
						]
					},
					{
						"type": "Polygon",
						"id": 624,
						"arcs": [
							[
								512,
								-508,
								226
							]
						]
					},
					{
						"type": "Polygon",
						"id": 226,
						"arcs": [
							[
								-433,
								-498,
								216
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 300,
						"arcs": [
							[
								[
									77
								]
							],
							[
								[
									247,
									-309,
									513,
									-359,
									514
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 304,
						"arcs": [
							[
								515
							]
						]
					},
					{
						"type": "Polygon",
						"id": 320,
						"arcs": [
							[
								516,
								-371,
								119,
								517,
								518,
								143
							]
						]
					},
					{
						"type": "Polygon",
						"id": 328,
						"arcs": [
							[
								519,
								-381,
								520,
								126
							]
						]
					},
					{
						"type": "Polygon",
						"id": 340,
						"arcs": [
							[
								521,
								-518,
								120,
								522,
								139
							]
						]
					},
					{
						"type": "Polygon",
						"id": 191,
						"arcs": [
							[
								-364,
								523,
								250,
								524,
								525,
								526
							]
						]
					},
					{
						"type": "Polygon",
						"id": 332,
						"arcs": [
							[
								-465,
								62
							]
						]
					},
					{
						"type": "Polygon",
						"id": 348,
						"arcs": [
							[
								527,
								528,
								529,
								530,
								-526,
								531,
								-335
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 360,
						"arcs": [
							[
								[
									25
								]
							],
							[
								[
									532,
									29
								]
							],
							[
								[
									30
								]
							],
							[
								[
									31
								]
							],
							[
								[
									34
								]
							],
							[
								[
									35
								]
							],
							[
								[
									38
								]
							],
							[
								[
									39
								]
							],
							[
								[
									533,
									42
								]
							],
							[
								[
									43
								]
							],
							[
								[
									44
								]
							],
							[
								[
									534,
									49
								]
							],
							[
								[
									45
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 356,
						"arcs": [
							[
								535,
								-419,
								-387,
								-418,
								536,
								-356,
								185,
								537,
								-421
							]
						]
					},
					{
						"type": "Polygon",
						"id": 372,
						"arcs": [
							[
								-499,
								90
							]
						]
					},
					{
						"type": "Polygon",
						"id": 364,
						"arcs": [
							[
								-302,
								538,
								187,
								539,
								540,
								-336,
								-322,
								-337,
								278,
								541
							]
						]
					},
					{
						"type": "Polygon",
						"id": 368,
						"arcs": [
							[
								188,
								542,
								543,
								544,
								545,
								546,
								-540
							]
						]
					},
					{
						"type": "Polygon",
						"id": 352,
						"arcs": [
							[
								99
							]
						]
					},
					{
						"type": "Polygon",
						"id": 376,
						"arcs": [
							[
								547,
								-476,
								237,
								548,
								549,
								550,
								551
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 380,
						"arcs": [
							[
								[
									78
								]
							],
							[
								[
									79
								]
							],
							[
								[
									552,
									252,
									-497,
									-407,
									-330
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 388,
						"arcs": [
							[
								553
							]
						]
					},
					{
						"type": "Polygon",
						"id": 400,
						"arcs": [
							[
								-545,
								554,
								199,
								-548,
								555,
								-551,
								556
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 392,
						"arcs": [
							[
								[
									74
								]
							],
							[
								[
									80
								]
							],
							[
								[
									82
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 398,
						"arcs": [
							[
								557,
								280,
								558,
								-425,
								559,
								560
							]
						]
					},
					{
						"type": "Polygon",
						"id": 404,
						"arcs": [
							[
								206,
								561,
								562,
								563,
								-485,
								564
							]
						]
					},
					{
						"type": "Polygon",
						"id": 417,
						"arcs": [
							[
								-424,
								565,
								566,
								-560
							]
						]
					},
					{
						"type": "Polygon",
						"id": 116,
						"arcs": [
							[
								567,
								568,
								569,
								179
							]
						]
					},
					{
						"type": "Polygon",
						"id": 410,
						"arcs": [
							[
								570,
								175
							]
						]
					},
					{
						"type": "Polygon",
						"id": -2,
						"arcs": [
							[
								-311,
								571,
								572,
								573
							]
						]
					},
					{
						"type": "Polygon",
						"id": 414,
						"arcs": [
							[
								574,
								-543,
								189
							]
						]
					},
					{
						"type": "Polygon",
						"id": 418,
						"arcs": [
							[
								575,
								-416,
								576,
								-569,
								577
							]
						]
					},
					{
						"type": "Polygon",
						"id": 422,
						"arcs": [
							[
								238,
								578,
								-549
							]
						]
					},
					{
						"type": "Polygon",
						"id": 430,
						"arcs": [
							[
								579,
								-511,
								-429,
								223
							]
						]
					},
					{
						"type": "Polygon",
						"id": 434,
						"arcs": [
							[
								-471,
								580,
								235,
								-475,
								581,
								582,
								583
							]
						]
					},
					{
						"type": "Polygon",
						"id": 144,
						"arcs": [
							[
								584
							]
						]
					},
					{
						"type": "Polygon",
						"id": 426,
						"arcs": [
							[
								585
							]
						]
					},
					{
						"type": "Polygon",
						"id": 440,
						"arcs": [
							[
								265,
								586,
								-370,
								587,
								588
							]
						]
					},
					{
						"type": "Polygon",
						"id": 442,
						"arcs": [
							[
								-496,
								-344,
								-459
							]
						]
					},
					{
						"type": "Polygon",
						"id": 428,
						"arcs": [
							[
								-482,
								589,
								-366,
								-587,
								266
							]
						]
					},
					{
						"type": "Polygon",
						"id": 504,
						"arcs": [
							[
								-469,
								590,
								591,
								592,
								593
							]
						]
					},
					{
						"type": "Polygon",
						"id": 498,
						"arcs": [
							[
								594,
								595
							]
						]
					},
					{
						"type": "Polygon",
						"id": 450,
						"arcs": [
							[
								596
							]
						]
					},
					{
						"type": "Polygon",
						"id": 484,
						"arcs": [
							[
								-372,
								-517,
								144,
								597,
								598
							]
						]
					},
					{
						"type": "Polygon",
						"id": 807,
						"arcs": [
							[
								599,
								-360,
								-514,
								-312,
								-574
							]
						]
					},
					{
						"type": "Polygon",
						"id": 466,
						"arcs": [
							[
								-466,
								600,
								-351,
								-431,
								-510,
								601,
								602
							]
						]
					},
					{
						"type": "Polygon",
						"id": 104,
						"arcs": [
							[
								183,
								-357,
								-537,
								-417,
								-576,
								603
							]
						]
					},
					{
						"type": "Polygon",
						"id": 499,
						"arcs": [
							[
								249,
								-524,
								-363,
								604,
								-572,
								-310
							]
						]
					},
					{
						"type": "Polygon",
						"id": 496,
						"arcs": [
							[
								-427,
								605
							]
						]
					},
					{
						"type": "Polygon",
						"id": 508,
						"arcs": [
							[
								208,
								606,
								607,
								608,
								609,
								610,
								611,
								612
							]
						]
					},
					{
						"type": "Polygon",
						"id": 478,
						"arcs": [
							[
								230,
								613,
								-467,
								-603,
								614
							]
						]
					},
					{
						"type": "Polygon",
						"id": 454,
						"arcs": [
							[
								615,
								616,
								-612
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 458,
						"arcs": [
							[
								[
									181,
									617
								]
							],
							[
								[
									-535,
									46,
									-385,
									48
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 516,
						"arcs": [
							[
								-305,
								618,
								-389,
								619,
								210
							]
						]
					},
					{
						"type": "Polygon",
						"id": 540,
						"arcs": [
							[
								620
							]
						]
					},
					{
						"type": "Polygon",
						"id": 562,
						"arcs": [
							[
								-601,
								-472,
								-584,
								621,
								-435,
								622,
								-348,
								-352
							]
						]
					},
					{
						"type": "Polygon",
						"id": 566,
						"arcs": [
							[
								-349,
								-623,
								-434,
								218
							]
						]
					},
					{
						"type": "Polygon",
						"id": 558,
						"arcs": [
							[
								-523,
								121,
								-450,
								138
							]
						]
					},
					{
						"type": "Polygon",
						"id": 528,
						"arcs": [
							[
								-460,
								-346,
								259
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 578,
						"arcs": [
							[
								[
									623,
									-490,
									624,
									271
								]
							],
							[
								[
									285
								]
							],
							[
								[
									290
								]
							],
							[
								[
									291
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 524,
						"arcs": [
							[
								-420,
								-536
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 554,
						"arcs": [
							[
								[
									14
								]
							],
							[
								[
									15
								]
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 512,
						"arcs": [
							[
								[
									625,
									626,
									-314,
									196
								]
							],
							[
								[
									-313,
									194
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 586,
						"arcs": [
							[
								-538,
								186,
								-539,
								-301,
								-422
							]
						]
					},
					{
						"type": "Polygon",
						"id": 591,
						"arcs": [
							[
								-451,
								123,
								-446,
								136
							]
						]
					},
					{
						"type": "Polygon",
						"id": 604,
						"arcs": [
							[
								133,
								-473,
								-448,
								-378,
								-374,
								-413
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 608,
						"arcs": [
							[
								[
									50
								]
							],
							[
								[
									53
								]
							],
							[
								[
									54
								]
							],
							[
								[
									55
								]
							],
							[
								[
									56
								]
							],
							[
								[
									57
								]
							],
							[
								[
									58
								]
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 598,
						"arcs": [
							[
								[
									36
								]
							],
							[
								[
									37
								]
							],
							[
								[
									-534,
									41
								]
							],
							[
								[
									40
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 616,
						"arcs": [
							[
								263,
								627,
								-588,
								-369,
								628,
								629,
								-455,
								-457
							]
						]
					},
					{
						"type": "Polygon",
						"id": 630,
						"arcs": [
							[
								630
							]
						]
					},
					{
						"type": "Polygon",
						"id": 408,
						"arcs": [
							[
								-571,
								176,
								-414,
								631,
								174
							]
						]
					},
					{
						"type": "Polygon",
						"id": 620,
						"arcs": [
							[
								255,
								-480
							]
						]
					},
					{
						"type": "Polygon",
						"id": 600,
						"arcs": [
							[
								-377,
								-317,
								-376
							]
						]
					},
					{
						"type": "Polygon",
						"id": 275,
						"arcs": [
							[
								-552,
								-556
							]
						]
					},
					{
						"type": "Polygon",
						"id": 634,
						"arcs": [
							[
								632,
								191
							]
						]
					},
					{
						"type": "Polygon",
						"id": 642,
						"arcs": [
							[
								-595,
								633,
								244,
								-362,
								634,
								-530,
								635
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 643,
						"arcs": [
							[
								[
									88
								]
							],
							[
								[
									264,
									-589,
									-628
								]
							],
							[
								[
									101
								]
							],
							[
								[
									103
								]
							],
							[
								[
									104
								]
							],
							[
								[
									159
								]
							],
							[
								[
									165
								]
							],
							[
								[
									167
								]
							],
							[
								[
									170
								]
							],
							[
								[
									173,
									-632,
									-428,
									-606,
									-426,
									-559,
									281,
									-339,
									-504,
									242,
									636,
									-367,
									-590,
									-481,
									268,
									-491,
									-624,
									637,
									638,
									639,
									640,
									274,
									641,
									276,
									642
								]
							],
							[
								[
									289
								]
							],
							[
								[
									292
								]
							],
							[
								[
									293
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 646,
						"arcs": [
							[
								-340,
								-439,
								643,
								644
							]
						]
					},
					{
						"type": "Polygon",
						"id": 732,
						"arcs": [
							[
								-468,
								-614,
								231,
								-591
							]
						]
					},
					{
						"type": "Polygon",
						"id": 682,
						"arcs": [
							[
								-555,
								-544,
								-575,
								190,
								-633,
								192,
								-315,
								-627,
								645,
								198
							]
						]
					},
					{
						"type": "Polygon",
						"id": 729,
						"arcs": [
							[
								646,
								-582,
								-474,
								201,
								-477,
								-488,
								647,
								648,
								649,
								-392
							]
						]
					},
					{
						"type": "Polygon",
						"id": 728,
						"arcs": [
							[
								-564,
								650,
								-443,
								-394,
								651,
								-649,
								652,
								-486
							]
						]
					},
					{
						"type": "Polygon",
						"id": 686,
						"arcs": [
							[
								-615,
								-602,
								-509,
								-513,
								227,
								-512,
								229
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 90,
						"arcs": [
							[
								[
									24
								]
							],
							[
								[
									26
								]
							],
							[
								[
									27
								]
							],
							[
								[
									32
								]
							],
							[
								[
									33
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 694,
						"arcs": [
							[
								-507,
								-580,
								224
							]
						]
					},
					{
						"type": "Polygon",
						"id": 222,
						"arcs": [
							[
								142,
								-519,
								-522,
								140,
								653
							]
						]
					},
					{
						"type": "Polygon",
						"id": -3,
						"arcs": [
							[
								-483,
								-462,
								204,
								654
							]
						]
					},
					{
						"type": "Polygon",
						"id": 706,
						"arcs": [
							[
								-565,
								-484,
								-655,
								205
							]
						]
					},
					{
						"type": "Polygon",
						"id": 688,
						"arcs": [
							[
								-361,
								-600,
								-573,
								-605,
								-365,
								-527,
								-531,
								-635
							]
						]
					},
					{
						"type": "Polygon",
						"id": 740,
						"arcs": [
							[
								-495,
								655,
								656,
								-382,
								-520,
								127
							]
						]
					},
					{
						"type": "Polygon",
						"id": 703,
						"arcs": [
							[
								657,
								-528,
								-334,
								-456,
								-630
							]
						]
					},
					{
						"type": "Polygon",
						"id": 705,
						"arcs": [
							[
								-532,
								-525,
								251,
								-553,
								-329
							]
						]
					},
					{
						"type": "Polygon",
						"id": 752,
						"arcs": [
							[
								-625,
								-489,
								270
							]
						]
					},
					{
						"type": "Polygon",
						"id": 748,
						"arcs": [
							[
								-608,
								658
							]
						]
					},
					{
						"type": "Polygon",
						"id": 760,
						"arcs": [
							[
								-550,
								-579,
								239,
								659,
								-546,
								-557
							]
						]
					},
					{
						"type": "Polygon",
						"id": 148,
						"arcs": [
							[
								-583,
								-647,
								-398,
								-436,
								-622
							]
						]
					},
					{
						"type": "Polygon",
						"id": 768,
						"arcs": [
							[
								-353,
								-350,
								220,
								-506
							]
						]
					},
					{
						"type": "Polygon",
						"id": 764,
						"arcs": [
							[
								-618,
								182,
								-604,
								-578,
								-568,
								180
							]
						]
					},
					{
						"type": "Polygon",
						"id": 762,
						"arcs": [
							[
								-423,
								-299,
								660,
								-566
							]
						]
					},
					{
						"type": "Polygon",
						"id": 795,
						"arcs": [
							[
								279,
								-558,
								661,
								-303,
								-542
							]
						]
					},
					{
						"type": "Polygon",
						"id": 626,
						"arcs": [
							[
								-533,
								28
							]
						]
					},
					{
						"type": "Polygon",
						"id": 780,
						"arcs": [
							[
								662
							]
						]
					},
					{
						"type": "Polygon",
						"id": 788,
						"arcs": [
							[
								234,
								-581,
								-470
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 792,
						"arcs": [
							[
								[
									-505,
									-324,
									-541,
									-547,
									-660,
									240
								]
							],
							[
								[
									-515,
									-358,
									246
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 158,
						"arcs": [
							[
								663
							]
						]
					},
					{
						"type": "Polygon",
						"id": 834,
						"arcs": [
							[
								207,
								-613,
								-617,
								664,
								-440,
								-341,
								-645,
								665,
								-562
							]
						]
					},
					{
						"type": "Polygon",
						"id": 800,
						"arcs": [
							[
								-644,
								-444,
								-651,
								-563,
								-666
							]
						]
					},
					{
						"type": "Polygon",
						"id": 804,
						"arcs": [
							[
								243,
								-634,
								-596,
								-636,
								-529,
								-658,
								-629,
								-368,
								-637
							]
						]
					},
					{
						"type": "Polygon",
						"id": 858,
						"arcs": [
							[
								130,
								-319,
								-384
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 840,
						"arcs": [
							[
								[
									64
								]
							],
							[
								[
									65
								]
							],
							[
								[
									66
								]
							],
							[
								[
									67
								]
							],
							[
								[
									68
								]
							],
							[
								[
									105,
									666,
									107,
									667,
									109,
									668,
									111,
									669,
									113,
									670,
									115,
									-598,
									671,
									672,
									673,
									-400
								]
							],
							[
								[
									92
								]
							],
							[
								[
									94
								]
							],
							[
								[
									97
								]
							],
							[
								[
									-401,
									147
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 860,
						"arcs": [
							[
								-561,
								-567,
								-661,
								-298,
								-662
							]
						]
					},
					{
						"type": "Polygon",
						"id": 862,
						"arcs": [
							[
								-521,
								-380,
								-447,
								125
							]
						]
					},
					{
						"type": "Polygon",
						"id": 704,
						"arcs": [
							[
								-570,
								-577,
								-415,
								178
							]
						]
					},
					{
						"type": "MultiPolygon",
						"id": 548,
						"arcs": [
							[
								[
									20
								]
							],
							[
								[
									21
								]
							]
						]
					},
					{
						"type": "Polygon",
						"id": 887,
						"arcs": [
							[
								-646,
								-626,
								197
							]
						]
					},
					{
						"type": "Polygon",
						"id": 710,
						"arcs": [
							[
								-620,
								-388,
								674,
								-609,
								-659,
								-607,
								209
							],
							[
								-586
							]
						]
					},
					{
						"type": "Polygon",
						"id": 894,
						"arcs": [
							[
								-611,
								675,
								-390,
								-619,
								-304,
								-441,
								-665,
								-616
							]
						]
					},
					{
						"type": "Polygon",
						"id": 716,
						"arcs": [
							[
								-391,
								-676,
								-610,
								-675
							]
						]
					}
				]
			}
		},
		"arcs": [
			[
				[
					3344,
					573
				],
				[
					-8,
					-29
				],
				[
					-8,
					-26
				],
				[
					-58,
					8
				],
				[
					-62,
					-4
				],
				[
					-35,
					19
				],
				[
					0,
					3
				],
				[
					-15,
					17
				],
				[
					62,
					-3
				],
				[
					60,
					-5
				],
				[
					21,
					23
				],
				[
					15,
					21
				],
				[
					28,
					-24
				]
			],
			[
				[
					577,
					604
				],
				[
					-53,
					-8
				],
				[
					-37,
					21
				],
				[
					-16,
					20
				],
				[
					-1,
					3
				],
				[
					-18,
					16
				],
				[
					17,
					22
				],
				[
					51,
					-9
				],
				[
					28,
					-18
				],
				[
					21,
					-21
				],
				[
					8,
					-26
				]
			],
			[
				[
					3745,
					688
				],
				[
					34,
					-25
				],
				[
					12,
					-35
				],
				[
					3,
					-25
				],
				[
					1,
					-29
				],
				[
					-43,
					-18
				],
				[
					-45,
					-15
				],
				[
					-52,
					-13
				],
				[
					-58,
					-12
				],
				[
					-66,
					4
				],
				[
					-36,
					19
				],
				[
					4,
					24
				],
				[
					60,
					15
				],
				[
					24,
					20
				],
				[
					17,
					24
				],
				[
					13,
					22
				],
				[
					16,
					20
				],
				[
					18,
					24
				],
				[
					15,
					0
				],
				[
					41,
					12
				],
				[
					42,
					-12
				]
			],
			[
				[
					1632,
					950
				],
				[
					36,
					-9
				],
				[
					33,
					10
				],
				[
					-15,
					-21
				],
				[
					-26,
					-14
				],
				[
					-39,
					4
				],
				[
					-28,
					21
				],
				[
					6,
					19
				],
				[
					33,
					-10
				]
			],
			[
				[
					1512,
					951
				],
				[
					42,
					-23
				],
				[
					-16,
					2
				],
				[
					-36,
					6
				],
				[
					-38,
					16
				],
				[
					20,
					12
				],
				[
					28,
					-13
				]
			],
			[
				[
					2250,
					1040
				],
				[
					30,
					-8
				],
				[
					31,
					7
				],
				[
					16,
					-33
				],
				[
					-22,
					4
				],
				[
					-33,
					-2
				],
				[
					-35,
					2
				],
				[
					-37,
					-3
				],
				[
					-29,
					11
				],
				[
					-14,
					24
				],
				[
					17,
					10
				],
				[
					36,
					-8
				],
				[
					40,
					-4
				]
			],
			[
				[
					3098,
					1096
				],
				[
					3,
					-26
				],
				[
					-5,
					-22
				],
				[
					-7,
					-22
				],
				[
					-33,
					-8
				],
				[
					-31,
					-11
				],
				[
					-37,
					1
				],
				[
					14,
					23
				],
				[
					-33,
					-8
				],
				[
					-31,
					-8
				],
				[
					-21,
					17
				],
				[
					-1,
					23
				],
				[
					30,
					23
				],
				[
					19,
					7
				],
				[
					32,
					-2
				],
				[
					8,
					29
				],
				[
					2,
					21
				],
				[
					-1,
					47
				],
				[
					16,
					27
				],
				[
					26,
					9
				],
				[
					14,
					-22
				],
				[
					7,
					-21
				],
				[
					12,
					-26
				],
				[
					9,
					-25
				],
				[
					8,
					-26
				]
			],
			[
				[
					108,
					339
				],
				[
					4,
					0
				],
				[
					3,
					-1
				],
				[
					41,
					-24
				],
				[
					35,
					24
				],
				[
					6,
					3
				],
				[
					82,
					11
				],
				[
					26,
					-14
				],
				[
					13,
					-7
				],
				[
					42,
					-19
				],
				[
					79,
					-15
				],
				[
					62,
					-18
				],
				[
					108,
					-13
				],
				[
					80,
					16
				],
				[
					118,
					-12
				],
				[
					66,
					-18
				],
				[
					74,
					17
				],
				[
					77,
					16
				],
				[
					6,
					27
				],
				[
					-109,
					2
				],
				[
					-90,
					14
				],
				[
					-23,
					23
				],
				[
					-75,
					12
				],
				[
					5,
					26
				],
				[
					10,
					24
				],
				[
					11,
					21
				],
				[
					-6,
					24
				],
				[
					-46,
					16
				],
				[
					-21,
					20
				],
				[
					-43,
					18
				],
				[
					67,
					-4
				],
				[
					64,
					10
				],
				[
					41,
					-20
				],
				[
					49,
					17
				],
				[
					46,
					22
				],
				[
					22,
					19
				],
				[
					-10,
					24
				],
				[
					-35,
					15
				],
				[
					-41,
					17
				],
				[
					-57,
					4
				],
				[
					-50,
					8
				],
				[
					-54,
					5
				],
				[
					-18,
					22
				],
				[
					-36,
					18
				],
				[
					-22,
					20
				],
				[
					-9,
					65
				],
				[
					14,
					-5
				],
				[
					25,
					-18
				],
				[
					46,
					5
				],
				[
					44,
					8
				],
				[
					23,
					-25
				],
				[
					44,
					6
				],
				[
					37,
					13
				],
				[
					35,
					15
				],
				[
					31,
					20
				],
				[
					42,
					5
				],
				[
					-1,
					22
				],
				[
					-10,
					21
				],
				[
					8,
					20
				],
				[
					36,
					10
				],
				[
					16,
					-19
				],
				[
					43,
					12
				],
				[
					32,
					14
				],
				[
					40,
					1
				],
				[
					37,
					6
				],
				[
					38,
					14
				],
				[
					30,
					12
				],
				[
					33,
					12
				],
				[
					22,
					-3
				],
				[
					19,
					-5
				],
				[
					42,
					8
				],
				[
					37,
					-10
				],
				[
					38,
					1
				],
				[
					36,
					8
				],
				[
					38,
					-5
				],
				[
					41,
					-6
				],
				[
					39,
					2
				],
				[
					40,
					-1
				],
				[
					41,
					-1
				],
				[
					38,
					2
				],
				[
					29,
					17
				],
				[
					33,
					9
				],
				[
					35,
					-12
				],
				[
					33,
					10
				],
				[
					30,
					20
				],
				[
					18,
					-18
				],
				[
					10,
					-20
				],
				[
					18,
					-19
				],
				[
					29,
					17
				],
				[
					33,
					-22
				],
				[
					37,
					-7
				],
				[
					33,
					-15
				],
				[
					39,
					3
				],
				[
					35,
					10
				],
				[
					42,
					-2
				],
				[
					37,
					-8
				],
				[
					39,
					-10
				],
				[
					14,
					25
				],
				[
					-18,
					19
				],
				[
					-13,
					20
				],
				[
					-36,
					5
				],
				[
					-16,
					21
				],
				[
					-6,
					22
				],
				[
					-10,
					42
				],
				[
					21,
					-7
				],
				[
					37,
					-4
				],
				[
					36,
					4
				],
				[
					32,
					-9
				],
				[
					29,
					-17
				],
				[
					12,
					-21
				],
				[
					37,
					-3
				],
				[
					36,
					8
				],
				[
					38,
					11
				],
				[
					35,
					7
				],
				[
					28,
					-14
				],
				[
					37,
					5
				],
				[
					24,
					44
				],
				[
					22,
					-26
				],
				[
					32,
					-10
				],
				[
					35,
					5
				],
				[
					23,
					-22
				],
				[
					36,
					-2
				],
				[
					34,
					-7
				],
				[
					33,
					-13
				],
				[
					22,
					22
				],
				[
					11,
					20
				],
				[
					28,
					-22
				],
				[
					38,
					5
				],
				[
					28,
					-12
				],
				[
					19,
					-19
				],
				[
					37,
					5
				],
				[
					29,
					13
				],
				[
					28,
					14
				],
				[
					34,
					8
				],
				[
					39,
					7
				],
				[
					35,
					8
				],
				[
					28,
					12
				],
				[
					16,
					18
				],
				[
					6,
					25
				],
				[
					-3,
					24
				],
				[
					-9,
					22
				],
				[
					-9,
					23
				],
				[
					-9,
					23
				],
				[
					-7,
					20
				],
				[
					-2,
					22
				],
				[
					3,
					23
				],
				[
					13,
					21
				],
				[
					11,
					24
				],
				[
					4,
					23
				],
				[
					-5,
					25
				],
				[
					-4,
					22
				],
				[
					14,
					26
				],
				[
					15,
					17
				],
				[
					18,
					21
				],
				[
					19,
					18
				],
				[
					23,
					17
				],
				[
					10,
					25
				],
				[
					16,
					16
				],
				[
					17,
					15
				],
				[
					27,
					3
				],
				[
					17,
					18
				],
				[
					20,
					11
				],
				[
					23,
					7
				],
				[
					20,
					15
				],
				[
					16,
					18
				],
				[
					21,
					7
				],
				[
					17,
					-15
				],
				[
					-11,
					-19
				],
				[
					-28,
					-17
				],
				[
					-12,
					-13
				],
				[
					-21,
					9
				],
				[
					-22,
					-5
				],
				[
					-20,
					-14
				],
				[
					-20,
					-14
				],
				[
					-13,
					-17
				],
				[
					-4,
					-23
				],
				[
					2,
					-21
				],
				[
					13,
					-19
				],
				[
					-19,
					-14
				],
				[
					-27,
					-5
				],
				[
					-15,
					-19
				],
				[
					-16,
					-18
				],
				[
					-17,
					-25
				],
				[
					-5,
					-21
				],
				[
					10,
					-24
				],
				[
					15,
					-18
				],
				[
					22,
					-13
				],
				[
					22,
					-18
				],
				[
					11,
					-23
				],
				[
					6,
					-21
				],
				[
					8,
					-23
				],
				[
					13,
					-19
				],
				[
					8,
					-22
				],
				[
					4,
					-53
				],
				[
					8,
					-21
				],
				[
					3,
					-23
				],
				[
					8,
					-22
				],
				[
					-3,
					-31
				],
				[
					-16,
					-23
				],
				[
					-16,
					-20
				],
				[
					-37,
					-7
				],
				[
					-13,
					-21
				],
				[
					-16,
					-19
				],
				[
					-42,
					-21
				],
				[
					-37,
					-9
				],
				[
					-35,
					-13
				],
				[
					-38,
					-12
				],
				[
					-22,
					-24
				],
				[
					-45,
					-2
				],
				[
					-49,
					2
				],
				[
					-44,
					-4
				],
				[
					-46,
					0
				],
				[
					8,
					-23
				],
				[
					43,
					-10
				],
				[
					31,
					-16
				],
				[
					17,
					-20
				],
				[
					-31,
					-18
				],
				[
					-48,
					5
				],
				[
					-39,
					-14
				],
				[
					-2,
					-24
				],
				[
					-1,
					-23
				],
				[
					33,
					-19
				],
				[
					6,
					-21
				],
				[
					35,
					-22
				],
				[
					59,
					-9
				],
				[
					50,
					-15
				],
				[
					39,
					-18
				],
				[
					51,
					-19
				],
				[
					69,
					-9
				],
				[
					68,
					-15
				],
				[
					47,
					-17
				],
				[
					52,
					-19
				],
				[
					27,
					-28
				],
				[
					14,
					-21
				],
				[
					34,
					20
				],
				[
					45,
					17
				],
				[
					49,
					18
				],
				[
					57,
					15
				],
				[
					50,
					16
				],
				[
					69,
					1
				],
				[
					68,
					-8
				],
				[
					56,
					-14
				],
				[
					18,
					25
				],
				[
					39,
					17
				],
				[
					70,
					1
				],
				[
					55,
					13
				],
				[
					52,
					12
				],
				[
					58,
					8
				],
				[
					61,
					10
				],
				[
					43,
					15
				],
				[
					-20,
					20
				],
				[
					-12,
					20
				],
				[
					0,
					22
				],
				[
					-53,
					-2
				],
				[
					-57,
					-9
				],
				[
					-55,
					0
				],
				[
					-8,
					21
				],
				[
					4,
					43
				],
				[
					13,
					12
				],
				[
					40,
					14
				],
				[
					46,
					13
				],
				[
					34,
					17
				],
				[
					34,
					17
				],
				[
					25,
					23
				],
				[
					38,
					10
				],
				[
					37,
					8
				],
				[
					19,
					4
				],
				[
					43,
					3
				],
				[
					41,
					8
				],
				[
					34,
					11
				],
				[
					34,
					13
				],
				[
					31,
					14
				],
				[
					38,
					18
				],
				[
					25,
					19
				],
				[
					26,
					17
				],
				[
					8,
					23
				],
				[
					-29,
					13
				],
				[
					9,
					24
				],
				[
					19,
					18
				],
				[
					29,
					11
				],
				[
					30,
					14
				],
				[
					29,
					18
				],
				[
					21,
					22
				],
				[
					14,
					27
				],
				[
					20,
					16
				],
				[
					33,
					-3
				],
				[
					14,
					-19
				],
				[
					33,
					-3
				],
				[
					1,
					22
				],
				[
					14,
					22
				],
				[
					30,
					-5
				],
				[
					7,
					-22
				],
				[
					33,
					-3
				],
				[
					36,
					10
				],
				[
					35,
					7
				],
				[
					32,
					-3
				],
				[
					12,
					-24
				],
				[
					30,
					19
				],
				[
					28,
					10
				],
				[
					32,
					8
				],
				[
					31,
					8
				],
				[
					28,
					14
				],
				[
					31,
					9
				],
				[
					24,
					12
				],
				[
					17,
					20
				],
				[
					21,
					-14
				],
				[
					29,
					8
				],
				[
					20,
					-28
				],
				[
					15,
					-20
				],
				[
					32,
					11
				],
				[
					13,
					23
				],
				[
					28,
					16
				],
				[
					36,
					-4
				],
				[
					11,
					-21
				],
				[
					23,
					21
				],
				[
					30,
					7
				],
				[
					33,
					2
				],
				[
					29,
					-1
				],
				[
					31,
					-6
				],
				[
					30,
					-4
				],
				[
					13,
					-19
				],
				[
					18,
					-17
				],
				[
					30,
					10
				],
				[
					33,
					2
				],
				[
					32,
					0
				],
				[
					31,
					2
				],
				[
					27,
					7
				],
				[
					30,
					7
				],
				[
					24,
					16
				],
				[
					26,
					10
				],
				[
					29,
					6
				],
				[
					21,
					16
				],
				[
					15,
					31
				],
				[
					16,
					19
				],
				[
					29,
					-9
				],
				[
					10,
					-20
				],
				[
					24,
					-13
				],
				[
					29,
					4
				],
				[
					20,
					-20
				],
				[
					20,
					-15
				],
				[
					29,
					14
				],
				[
					10,
					24
				],
				[
					25,
					11
				],
				[
					28,
					19
				],
				[
					28,
					8
				],
				[
					32,
					11
				],
				[
					22,
					12
				],
				[
					23,
					14
				],
				[
					22,
					12
				],
				[
					26,
					-6
				],
				[
					25,
					20
				],
				[
					18,
					16
				],
				[
					26,
					-2
				],
				[
					23,
					14
				],
				[
					5,
					20
				],
				[
					24,
					16
				],
				[
					22,
					11
				],
				[
					28,
					9
				],
				[
					26,
					5
				],
				[
					24,
					-3
				],
				[
					26,
					-6
				],
				[
					23,
					-16
				],
				[
					2,
					-25
				],
				[
					25,
					-19
				],
				[
					17,
					-16
				],
				[
					33,
					-6
				],
				[
					18,
					-16
				],
				[
					23,
					-16
				],
				[
					27,
					-3
				],
				[
					22,
					11
				],
				[
					24,
					24
				],
				[
					26,
					-13
				],
				[
					27,
					-7
				],
				[
					26,
					-6
				],
				[
					28,
					-5
				],
				[
					27,
					0
				],
				[
					23,
					-60
				],
				[
					-1,
					-14
				],
				[
					-3,
					-26
				],
				[
					-27,
					-15
				],
				[
					-22,
					-21
				],
				[
					4,
					-23
				],
				[
					31,
					1
				],
				[
					-3,
					-22
				],
				[
					-15,
					-22
				],
				[
					-13,
					-24
				],
				[
					22,
					-18
				],
				[
					32,
					-5
				],
				[
					32,
					10
				],
				[
					15,
					22
				],
				[
					9,
					22
				],
				[
					15,
					18
				],
				[
					18,
					17
				],
				[
					7,
					20
				],
				[
					15,
					28
				],
				[
					17,
					6
				],
				[
					32,
					2
				],
				[
					27,
					7
				],
				[
					29,
					9
				],
				[
					13,
					23
				],
				[
					8,
					21
				],
				[
					19,
					22
				],
				[
					28,
					14
				],
				[
					23,
					11
				],
				[
					15,
					20
				],
				[
					16,
					10
				],
				[
					20,
					9
				],
				[
					28,
					-6
				],
				[
					25,
					6
				],
				[
					27,
					7
				],
				[
					31,
					-4
				],
				[
					20,
					16
				],
				[
					14,
					38
				],
				[
					10,
					-15
				],
				[
					13,
					-27
				],
				[
					24,
					-12
				],
				[
					26,
					-4
				],
				[
					27,
					6
				],
				[
					28,
					-4
				],
				[
					26,
					-1
				],
				[
					18,
					5
				],
				[
					23,
					-3
				],
				[
					21,
					-12
				],
				[
					25,
					8
				],
				[
					30,
					0
				],
				[
					26,
					7
				],
				[
					29,
					-7
				],
				[
					18,
					19
				],
				[
					14,
					19
				],
				[
					19,
					16
				],
				[
					35,
					43
				],
				[
					18,
					-8
				],
				[
					21,
					-16
				],
				[
					19,
					-20
				],
				[
					35,
					-35
				],
				[
					27,
					-1
				],
				[
					26,
					0
				],
				[
					30,
					6
				],
				[
					30,
					8
				],
				[
					23,
					16
				],
				[
					19,
					17
				],
				[
					31,
					2
				],
				[
					20,
					13
				],
				[
					22,
					-12
				],
				[
					14,
					-18
				],
				[
					20,
					-18
				],
				[
					30,
					2
				],
				[
					19,
					-14
				],
				[
					34,
					-15
				],
				[
					34,
					-6
				],
				[
					29,
					5
				],
				[
					22,
					18
				],
				[
					18,
					18
				],
				[
					25,
					5
				],
				[
					25,
					-8
				],
				[
					29,
					-6
				],
				[
					26,
					9
				],
				[
					25,
					0
				],
				[
					25,
					-6
				],
				[
					26,
					-5
				],
				[
					25,
					10
				],
				[
					29,
					9
				],
				[
					29,
					2
				],
				[
					31,
					0
				],
				[
					26,
					6
				],
				[
					25,
					4
				],
				[
					8,
					29
				],
				[
					1,
					23
				],
				[
					17,
					-15
				],
				[
					5,
					-26
				],
				[
					9,
					-24
				],
				[
					12,
					-19
				],
				[
					23,
					-10
				],
				[
					32,
					3
				],
				[
					36,
					1
				],
				[
					25,
					3
				],
				[
					36,
					0
				],
				[
					27,
					2
				],
				[
					36,
					-3
				],
				[
					31,
					-4
				],
				[
					20,
					-18
				],
				[
					-6,
					-22
				],
				[
					18,
					-17
				],
				[
					30,
					-13
				],
				[
					31,
					-15
				],
				[
					36,
					-10
				],
				[
					37,
					-9
				],
				[
					29,
					-9
				],
				[
					31,
					-1
				],
				[
					18,
					19
				],
				[
					25,
					-16
				],
				[
					21,
					-18
				],
				[
					24,
					-13
				],
				[
					34,
					-6
				],
				[
					32,
					-7
				],
				[
					14,
					-22
				],
				[
					31,
					-14
				],
				[
					22,
					-20
				],
				[
					31,
					-9
				],
				[
					32,
					1
				],
				[
					30,
					-3
				],
				[
					33,
					1
				],
				[
					33,
					-5
				],
				[
					31,
					-8
				],
				[
					29,
					-13
				],
				[
					29,
					-12
				],
				[
					19,
					-17
				],
				[
					-3,
					-22
				],
				[
					-15,
					-20
				],
				[
					-12,
					-26
				],
				[
					-10,
					-21
				],
				[
					-13,
					-23
				],
				[
					-36,
					-9
				],
				[
					-17,
					-21
				],
				[
					-36,
					-12
				],
				[
					-12,
					-23
				],
				[
					-19,
					-21
				],
				[
					-20,
					-18
				],
				[
					-12,
					-24
				],
				[
					-7,
					-21
				],
				[
					-3,
					-26
				],
				[
					1,
					-22
				],
				[
					16,
					-22
				],
				[
					6,
					-22
				],
				[
					13,
					-20
				],
				[
					51,
					-8
				],
				[
					11,
					-25
				],
				[
					-50,
					-9
				],
				[
					-42,
					-12
				],
				[
					-53,
					-2
				],
				[
					-23,
					-33
				],
				[
					-5,
					-27
				],
				[
					-12,
					-22
				],
				[
					-15,
					-21
				],
				[
					37,
					-19
				],
				[
					14,
					-24
				],
				[
					24,
					-21
				],
				[
					34,
					-20
				],
				[
					39,
					-18
				],
				[
					41,
					-18
				],
				[
					64,
					-18
				],
				[
					14,
					-28
				],
				[
					80,
					-12
				],
				[
					6,
					-5
				],
				[
					20,
					-17
				],
				[
					77,
					15
				],
				[
					64,
					-18
				],
				[
					48,
					-14
				],
				[
					-9998,
					-1
				],
				[
					25,
					34
				],
				[
					50,
					-18
				],
				[
					3,
					2
				]
			],
			[
				[
					79,
					321
				],
				[
					8,
					5
				],
				[
					9,
					6
				],
				[
					8,
					5
				],
				[
					4,
					2
				]
			],
			[
				[
					3139,
					2021
				],
				[
					-9,
					-23
				],
				[
					-24,
					-18
				],
				[
					-30,
					6
				],
				[
					-20,
					17
				],
				[
					-29,
					9
				],
				[
					-35,
					32
				],
				[
					-28,
					31
				],
				[
					-39,
					64
				],
				[
					23,
					-12
				],
				[
					39,
					-38
				],
				[
					37,
					-21
				],
				[
					14,
					27
				],
				[
					9,
					39
				],
				[
					26,
					24
				],
				[
					20,
					-7
				]
			],
			[
				[
					3093,
					2151
				],
				[
					10,
					-27
				],
				[
					14,
					-43
				],
				[
					36,
					-34
				],
				[
					39,
					-15
				],
				[
					-12,
					-29
				],
				[
					-27,
					-2
				],
				[
					-14,
					20
				]
			],
			[
				[
					3373,
					2239
				],
				[
					22,
					-25
				],
				[
					-8,
					-21
				],
				[
					-38,
					-17
				],
				[
					-12,
					20
				],
				[
					-24,
					-26
				],
				[
					-14,
					26
				],
				[
					33,
					35
				],
				[
					24,
					-15
				],
				[
					17,
					23
				]
			],
			[
				[
					6951,
					2320
				],
				[
					-43,
					-4
				],
				[
					0,
					30
				],
				[
					4,
					24
				],
				[
					2,
					12
				],
				[
					18,
					-18
				],
				[
					26,
					-7
				],
				[
					1,
					-11
				],
				[
					-8,
					-26
				]
			],
			[
				[
					9037,
					2833
				],
				[
					27,
					-20
				],
				[
					15,
					8
				],
				[
					22,
					11
				],
				[
					17,
					-4
				],
				[
					2,
					-68
				],
				[
					-10,
					-20
				],
				[
					-3,
					-46
				],
				[
					-9,
					15
				],
				[
					-20,
					-40
				],
				[
					-5,
					3
				],
				[
					-18,
					2
				],
				[
					-17,
					50
				],
				[
					-3,
					38
				],
				[
					-16,
					50
				],
				[
					0,
					26
				],
				[
					18,
					-5
				]
			],
			[
				[
					9805,
					2826
				],
				[
					6,
					-24
				],
				[
					20,
					23
				],
				[
					8,
					-24
				],
				[
					0,
					-24
				],
				[
					-11,
					-27
				],
				[
					-18,
					-42
				],
				[
					-14,
					-24
				],
				[
					10,
					-27
				],
				[
					-21,
					-1
				],
				[
					-24,
					-22
				],
				[
					-7,
					-37
				],
				[
					-16,
					-59
				],
				[
					-22,
					-25
				],
				[
					-14,
					-17
				],
				[
					-25,
					1
				],
				[
					-18,
					19
				],
				[
					-31,
					4
				],
				[
					-4,
					22
				],
				[
					15,
					42
				],
				[
					35,
					57
				],
				[
					18,
					11
				],
				[
					20,
					22
				],
				[
					23,
					30
				],
				[
					17,
					30
				],
				[
					12,
					43
				],
				[
					11,
					14
				],
				[
					4,
					33
				],
				[
					19,
					26
				],
				[
					7,
					-24
				]
			],
			[
				[
					9849,
					3100
				],
				[
					20,
					-61
				],
				[
					1,
					40
				],
				[
					12,
					-16
				],
				[
					4,
					-44
				],
				[
					23,
					-18
				],
				[
					18,
					-5
				],
				[
					16,
					22
				],
				[
					14,
					-7
				],
				[
					-6,
					-51
				],
				[
					-9,
					-33
				],
				[
					-21,
					1
				],
				[
					-7,
					-18
				],
				[
					2,
					-24
				],
				[
					-4,
					-11
				],
				[
					-10,
					-31
				],
				[
					-14,
					-40
				],
				[
					-22,
					-23
				],
				[
					-4,
					16
				],
				[
					-12,
					8
				],
				[
					16,
					47
				],
				[
					-9,
					32
				],
				[
					-30,
					23
				],
				[
					1,
					21
				],
				[
					20,
					20
				],
				[
					4,
					44
				],
				[
					-1,
					37
				],
				[
					-11,
					39
				],
				[
					1,
					10
				],
				[
					-14,
					24
				],
				[
					-21,
					51
				],
				[
					-12,
					41
				],
				[
					10,
					4
				],
				[
					15,
					-32
				],
				[
					22,
					-15
				],
				[
					8,
					-51
				]
			],
			[
				[
					9641,
					3906
				],
				[
					-11,
					-14
				],
				[
					-15,
					16
				],
				[
					-20,
					26
				],
				[
					-18,
					30
				],
				[
					-18,
					41
				],
				[
					-4,
					19
				],
				[
					12,
					-1
				],
				[
					15,
					-19
				],
				[
					13,
					-20
				],
				[
					9,
					-16
				],
				[
					22,
					-36
				],
				[
					15,
					-26
				]
			],
			[
				[
					9953,
					4183
				],
				[
					10,
					-16
				],
				[
					-5,
					-30
				],
				[
					-17,
					-8
				],
				[
					-15,
					7
				],
				[
					-3,
					25
				],
				[
					11,
					20
				],
				[
					12,
					-7
				],
				[
					7,
					9
				]
			],
			[
				[
					9981,
					4214
				],
				[
					-18,
					-12
				],
				[
					-3,
					22
				],
				[
					13,
					12
				],
				[
					9,
					3
				],
				[
					17,
					18
				],
				[
					0,
					-28
				],
				[
					-18,
					-15
				]
			],
			[
				[
					2,
					4232
				],
				[
					-2,
					-3
				],
				[
					0,
					28
				],
				[
					5,
					2
				],
				[
					-3,
					-27
				]
			],
			[
				[
					9661,
					4234
				],
				[
					-9,
					-8
				],
				[
					-10,
					25
				],
				[
					1,
					16
				],
				[
					18,
					-33
				]
			],
			[
				[
					9640,
					4322
				],
				[
					5,
					-46
				],
				[
					-8,
					7
				],
				[
					-5,
					-3
				],
				[
					-4,
					16
				],
				[
					-1,
					44
				],
				[
					13,
					-18
				]
			],
			[
				[
					6389,
					4401
				],
				[
					5,
					-69
				],
				[
					7,
					-27
				],
				[
					-3,
					-27
				],
				[
					-5,
					-17
				],
				[
					-9,
					33
				],
				[
					-5,
					-17
				],
				[
					5,
					-42
				],
				[
					-3,
					-25
				],
				[
					-7,
					-13
				],
				[
					-2,
					-49
				],
				[
					-11,
					-67
				],
				[
					-14,
					-79
				],
				[
					-17,
					-109
				],
				[
					-10,
					-80
				],
				[
					-13,
					-67
				],
				[
					-23,
					-14
				],
				[
					-24,
					-24
				],
				[
					-16,
					14
				],
				[
					-22,
					21
				],
				[
					-7,
					30
				],
				[
					-2,
					51
				],
				[
					-10,
					46
				],
				[
					-3,
					42
				],
				[
					5,
					41
				],
				[
					13,
					10
				],
				[
					0,
					19
				],
				[
					13,
					44
				],
				[
					3,
					37
				],
				[
					-6,
					27
				],
				[
					-6,
					36
				],
				[
					-2,
					53
				],
				[
					10,
					33
				],
				[
					4,
					36
				],
				[
					13,
					2
				],
				[
					16,
					12
				],
				[
					10,
					11
				],
				[
					12,
					0
				],
				[
					16,
					33
				],
				[
					23,
					36
				],
				[
					8,
					29
				],
				[
					-3,
					24
				],
				[
					11,
					-7
				],
				[
					16,
					40
				],
				[
					0,
					35
				],
				[
					9,
					26
				],
				[
					10,
					-25
				],
				[
					7,
					-25
				],
				[
					7,
					-38
				]
			],
			[
				[
					8986,
					4389
				],
				[
					10,
					-45
				],
				[
					18,
					22
				],
				[
					9,
					-24
				],
				[
					14,
					-23
				],
				[
					-3,
					-25
				],
				[
					6,
					-50
				],
				[
					4,
					-29
				],
				[
					7,
					-7
				],
				[
					8,
					-49
				],
				[
					-3,
					-30
				],
				[
					9,
					-39
				],
				[
					30,
					-30
				],
				[
					20,
					-27
				],
				[
					18,
					-25
				],
				[
					-3,
					-14
				],
				[
					16,
					-36
				],
				[
					10,
					-63
				],
				[
					11,
					13
				],
				[
					12,
					-25
				],
				[
					6,
					9
				],
				[
					5,
					-61
				],
				[
					20,
					-35
				],
				[
					13,
					-22
				],
				[
					22,
					-47
				],
				[
					7,
					-46
				],
				[
					1,
					-33
				],
				[
					-2,
					-36
				],
				[
					13,
					-49
				],
				[
					-1,
					-51
				],
				[
					-5,
					-26
				],
				[
					-8,
					-52
				],
				[
					1,
					-33
				],
				[
					-5,
					-41
				],
				[
					-13,
					-52
				],
				[
					-20,
					-29
				],
				[
					-10,
					-44
				],
				[
					-10,
					-29
				],
				[
					-8,
					-49
				],
				[
					-11,
					-29
				],
				[
					-7,
					-43
				],
				[
					-3,
					-40
				],
				[
					1,
					-18
				],
				[
					-16,
					-20
				],
				[
					-31,
					-2
				],
				[
					-25,
					-24
				],
				[
					-13,
					-22
				],
				[
					-17,
					-25
				],
				[
					-23,
					26
				],
				[
					-17,
					10
				],
				[
					4,
					30
				],
				[
					-15,
					-11
				],
				[
					-24,
					-42
				],
				[
					-24,
					16
				],
				[
					-16,
					9
				],
				[
					-16,
					4
				],
				[
					-27,
					17
				],
				[
					-18,
					35
				],
				[
					-5,
					44
				],
				[
					-6,
					29
				],
				[
					-14,
					23
				],
				[
					-27,
					7
				],
				[
					9,
					28
				],
				[
					-6,
					43
				],
				[
					-14,
					-40
				],
				[
					-25,
					-10
				],
				[
					15,
					31
				],
				[
					4,
					34
				],
				[
					11,
					28
				],
				[
					-2,
					42
				],
				[
					-23,
					-49
				],
				[
					-17,
					-19
				],
				[
					-11,
					-46
				],
				[
					-22,
					24
				],
				[
					1,
					30
				],
				[
					-17,
					42
				],
				[
					-15,
					21
				],
				[
					5,
					14
				],
				[
					-35,
					35
				],
				[
					-20,
					1
				],
				[
					-26,
					28
				],
				[
					-50,
					-5
				],
				[
					-36,
					-21
				],
				[
					-32,
					-19
				],
				[
					-26,
					4
				],
				[
					-30,
					-30
				],
				[
					-24,
					-13
				],
				[
					-5,
					-30
				],
				[
					-10,
					-24
				],
				[
					-24,
					-1
				],
				[
					-17,
					-5
				],
				[
					-25,
					10
				],
				[
					-20,
					-6
				],
				[
					-19,
					-2
				],
				[
					-16,
					-31
				],
				[
					-9,
					2
				],
				[
					-14,
					-16
				],
				[
					-13,
					-18
				],
				[
					-20,
					2
				],
				[
					-19,
					0
				],
				[
					-29,
					37
				],
				[
					-15,
					11
				],
				[
					0,
					33
				],
				[
					14,
					8
				],
				[
					5,
					13
				],
				[
					-1,
					20
				],
				[
					3,
					41
				],
				[
					-3,
					34
				],
				[
					-14,
					58
				],
				[
					-5,
					33
				],
				[
					1,
					33
				],
				[
					-11,
					37
				],
				[
					-1,
					17
				],
				[
					-12,
					23
				],
				[
					-3,
					45
				],
				[
					-16,
					46
				],
				[
					-4,
					24
				],
				[
					12,
					-25
				],
				[
					-9,
					54
				],
				[
					14,
					-17
				],
				[
					8,
					-22
				],
				[
					-1,
					29
				],
				[
					-13,
					45
				],
				[
					-3,
					19
				],
				[
					-6,
					17
				],
				[
					3,
					33
				],
				[
					5,
					14
				],
				[
					4,
					29
				],
				[
					-3,
					34
				],
				[
					12,
					41
				],
				[
					2,
					-44
				],
				[
					11,
					40
				],
				[
					23,
					19
				],
				[
					13,
					25
				],
				[
					22,
					21
				],
				[
					12,
					4
				],
				[
					8,
					-7
				],
				[
					22,
					22
				],
				[
					17,
					6
				],
				[
					4,
					13
				],
				[
					7,
					5
				],
				[
					16,
					-1
				],
				[
					29,
					17
				],
				[
					15,
					25
				],
				[
					7,
					31
				],
				[
					16,
					29
				],
				[
					2,
					23
				],
				[
					0,
					31
				],
				[
					20,
					49
				],
				[
					11,
					-49
				],
				[
					12,
					11
				],
				[
					-10,
					27
				],
				[
					9,
					28
				],
				[
					12,
					-12
				],
				[
					4,
					44
				],
				[
					15,
					28
				],
				[
					7,
					23
				],
				[
					13,
					9
				],
				[
					1,
					17
				],
				[
					12,
					-7
				],
				[
					1,
					14
				],
				[
					12,
					9
				],
				[
					13,
					7
				],
				[
					21,
					-26
				],
				[
					15,
					-34
				],
				[
					18,
					-1
				],
				[
					17,
					-5
				],
				[
					-6,
					32
				],
				[
					14,
					46
				],
				[
					12,
					15
				],
				[
					-4,
					14
				],
				[
					12,
					33
				],
				[
					17,
					20
				],
				[
					14,
					-6
				],
				[
					23,
					10
				],
				[
					0,
					30
				],
				[
					-21,
					19
				],
				[
					15,
					8
				],
				[
					19,
					-14
				],
				[
					14,
					-24
				],
				[
					24,
					-14
				],
				[
					8,
					5
				],
				[
					17,
					-17
				],
				[
					16,
					16
				],
				[
					11,
					-5
				],
				[
					6,
					11
				],
				[
					13,
					-28
				],
				[
					-8,
					-31
				],
				[
					-10,
					-23
				],
				[
					-10,
					-2
				],
				[
					4,
					-23
				],
				[
					-9,
					-29
				],
				[
					-9,
					-28
				],
				[
					2,
					-17
				],
				[
					22,
					-31
				],
				[
					21,
					-19
				],
				[
					14,
					-20
				],
				[
					20,
					-34
				],
				[
					8,
					0
				],
				[
					15,
					-15
				],
				[
					4,
					-17
				],
				[
					26,
					-20
				],
				[
					19,
					20
				],
				[
					5,
					31
				],
				[
					6,
					25
				],
				[
					3,
					32
				],
				[
					9,
					46
				],
				[
					-4,
					27
				],
				[
					2,
					17
				],
				[
					-3,
					33
				],
				[
					3,
					44
				],
				[
					6,
					11
				],
				[
					-5,
					19
				],
				[
					7,
					31
				],
				[
					5,
					32
				],
				[
					1,
					16
				],
				[
					10,
					22
				],
				[
					8,
					-29
				],
				[
					2,
					-36
				],
				[
					7,
					-7
				],
				[
					1,
					-24
				],
				[
					10,
					-29
				],
				[
					2,
					-33
				],
				[
					-1,
					-21
				]
			],
			[
				[
					9502,
					4578
				],
				[
					8,
					-19
				],
				[
					-20,
					0
				],
				[
					-10,
					35
				],
				[
					16,
					-14
				],
				[
					6,
					-2
				]
			],
			[
				[
					8352,
					4592
				],
				[
					-12,
					-1
				],
				[
					-37,
					41
				],
				[
					26,
					11
				],
				[
					15,
					-18
				],
				[
					10,
					-17
				],
				[
					-2,
					-16
				]
			],
			[
				[
					9467,
					4613
				],
				[
					-11,
					-1
				],
				[
					-17,
					6
				],
				[
					-6,
					9
				],
				[
					2,
					23
				],
				[
					18,
					-9
				],
				[
					9,
					-12
				],
				[
					5,
					-16
				]
			],
			[
				[
					9490,
					4629
				],
				[
					-5,
					-10
				],
				[
					-20,
					49
				],
				[
					-6,
					35
				],
				[
					10,
					0
				],
				[
					10,
					-46
				],
				[
					11,
					-28
				]
			],
			[
				[
					8470,
					4670
				],
				[
					3,
					13
				],
				[
					24,
					13
				],
				[
					20,
					2
				],
				[
					8,
					8
				],
				[
					11,
					-8
				],
				[
					-10,
					-15
				],
				[
					-29,
					-25
				],
				[
					-24,
					-17
				]
			],
			[
				[
					8473,
					4641
				],
				[
					-18,
					-43
				],
				[
					-24,
					-13
				],
				[
					-3,
					7
				],
				[
					3,
					20
				],
				[
					12,
					35
				],
				[
					27,
					23
				]
			],
			[
				[
					8274,
					4716
				],
				[
					10,
					-16
				],
				[
					17,
					5
				],
				[
					7,
					-24
				],
				[
					-32,
					-12
				],
				[
					-20,
					-8
				],
				[
					-15,
					1
				],
				[
					10,
					33
				],
				[
					15,
					0
				],
				[
					8,
					21
				]
			],
			[
				[
					8413,
					4716
				],
				[
					-4,
					-32
				],
				[
					-42,
					-16
				],
				[
					-37,
					7
				],
				[
					0,
					21
				],
				[
					22,
					12
				],
				[
					17,
					-18
				],
				[
					19,
					5
				],
				[
					25,
					21
				]
			],
			[
				[
					9440,
					4702
				],
				[
					1,
					-12
				],
				[
					-22,
					25
				],
				[
					-15,
					20
				],
				[
					-11,
					20
				],
				[
					4,
					5
				],
				[
					13,
					-13
				],
				[
					23,
					-27
				],
				[
					7,
					-18
				]
			],
			[
				[
					9375,
					4759
				],
				[
					-6,
					-3
				],
				[
					-12,
					13
				],
				[
					-11,
					23
				],
				[
					1,
					10
				],
				[
					17,
					-24
				],
				[
					11,
					-19
				]
			],
			[
				[
					8016,
					4792
				],
				[
					53,
					-6
				],
				[
					6,
					24
				],
				[
					52,
					-28
				],
				[
					10,
					-37
				],
				[
					42,
					-11
				],
				[
					34,
					-34
				],
				[
					-32,
					-22
				],
				[
					-31,
					23
				],
				[
					-25,
					-1
				],
				[
					-28,
					4
				],
				[
					-26,
					10
				],
				[
					-33,
					22
				],
				[
					-20,
					6
				],
				[
					-12,
					-7
				],
				[
					-50,
					23
				],
				[
					-5,
					25
				],
				[
					-25,
					4
				],
				[
					19,
					55
				],
				[
					33,
					-3
				],
				[
					23,
					-22
				],
				[
					11,
					-5
				],
				[
					4,
					-20
				]
			],
			[
				[
					8741,
					4824
				],
				[
					-14,
					-39
				],
				[
					-3,
					43
				],
				[
					5,
					21
				],
				[
					6,
					19
				],
				[
					6,
					-16
				],
				[
					0,
					-28
				]
			],
			[
				[
					9329,
					4789
				],
				[
					-8,
					-6
				],
				[
					-12,
					23
				],
				[
					-12,
					36
				],
				[
					-6,
					44
				],
				[
					3,
					6
				],
				[
					3,
					-18
				],
				[
					9,
					-13
				],
				[
					13,
					-36
				],
				[
					13,
					-20
				],
				[
					-3,
					-16
				]
			],
			[
				[
					9220,
					4867
				],
				[
					-14,
					-5
				],
				[
					-5,
					-16
				],
				[
					-15,
					-14
				],
				[
					-14,
					-14
				],
				[
					-15,
					0
				],
				[
					-23,
					17
				],
				[
					-15,
					16
				],
				[
					2,
					18
				],
				[
					25,
					-9
				],
				[
					15,
					5
				],
				[
					4,
					28
				],
				[
					4,
					1
				],
				[
					3,
					-31
				],
				[
					16,
					5
				],
				[
					8,
					20
				],
				[
					15,
					20
				],
				[
					-3,
					34
				],
				[
					17,
					1
				],
				[
					5,
					-9
				],
				[
					0,
					-32
				],
				[
					-10,
					-35
				]
			],
			[
				[
					8533,
					4983
				],
				[
					-10,
					-19
				],
				[
					-19,
					10
				],
				[
					-6,
					25
				],
				[
					28,
					3
				],
				[
					7,
					-19
				]
			],
			[
				[
					8623,
					5004
				],
				[
					10,
					-44
				],
				[
					-24,
					24
				],
				[
					-23,
					4
				],
				[
					-15,
					-3
				],
				[
					-20,
					2
				],
				[
					7,
					31
				],
				[
					34,
					3
				],
				[
					31,
					-17
				]
			],
			[
				[
					9252,
					4923
				],
				[
					-8,
					-15
				],
				[
					-5,
					33
				],
				[
					-7,
					23
				],
				[
					-12,
					19
				],
				[
					-16,
					24
				],
				[
					-20,
					17
				],
				[
					7,
					14
				],
				[
					15,
					-16
				],
				[
					10,
					-13
				],
				[
					11,
					-14
				],
				[
					12,
					-24
				],
				[
					10,
					-18
				],
				[
					3,
					-30
				]
			],
			[
				[
					8915,
					5032
				],
				[
					48,
					-39
				],
				[
					52,
					-33
				],
				[
					19,
					-30
				],
				[
					15,
					-29
				],
				[
					5,
					-34
				],
				[
					46,
					-35
				],
				[
					7,
					-31
				],
				[
					-26,
					-6
				],
				[
					6,
					-38
				],
				[
					25,
					-38
				],
				[
					18,
					-61
				],
				[
					16,
					2
				],
				[
					-1,
					-26
				],
				[
					21,
					-10
				],
				[
					-8,
					-11
				],
				[
					30,
					-24
				],
				[
					-4,
					-16
				],
				[
					-18,
					-4
				],
				[
					-7,
					14
				],
				[
					-24,
					7
				],
				[
					-28,
					9
				],
				[
					-21,
					36
				],
				[
					-16,
					32
				],
				[
					-15,
					50
				],
				[
					-36,
					26
				],
				[
					-23,
					-17
				],
				[
					-17,
					-19
				],
				[
					3,
					-42
				],
				[
					-21,
					-20
				],
				[
					-16,
					10
				],
				[
					-29,
					2
				]
			],
			[
				[
					8916,
					4657
				],
				[
					-25,
					47
				],
				[
					-28,
					12
				],
				[
					-7,
					-17
				],
				[
					-35,
					-1
				],
				[
					12,
					46
				],
				[
					18,
					16
				],
				[
					-8,
					63
				],
				[
					-13,
					48
				],
				[
					-54,
					49
				],
				[
					-23,
					5
				],
				[
					-42,
					53
				],
				[
					-8,
					-28
				],
				[
					-10,
					-5
				],
				[
					-7,
					21
				],
				[
					0,
					25
				],
				[
					-21,
					29
				],
				[
					30,
					20
				],
				[
					20,
					-1
				],
				[
					-3,
					15
				],
				[
					-40,
					1
				],
				[
					-11,
					34
				],
				[
					-25,
					10
				],
				[
					-12,
					29
				],
				[
					38,
					14
				],
				[
					14,
					19
				],
				[
					44,
					-24
				],
				[
					5,
					-21
				],
				[
					8,
					-93
				],
				[
					28,
					-35
				],
				[
					24,
					61
				],
				[
					31,
					35
				],
				[
					25,
					0
				],
				[
					24,
					-20
				],
				[
					20,
					-21
				],
				[
					30,
					-11
				]
			],
			[
				[
					8478,
					5264
				],
				[
					-23,
					-57
				],
				[
					-21,
					-11
				],
				[
					-26,
					11
				],
				[
					-47,
					-3
				],
				[
					-24,
					-8
				],
				[
					-4,
					-44
				],
				[
					25,
					-51
				],
				[
					15,
					26
				],
				[
					52,
					20
				],
				[
					-2,
					-27
				],
				[
					-13,
					8
				],
				[
					-12,
					-33
				],
				[
					-24,
					-23
				],
				[
					26,
					-73
				],
				[
					-5,
					-20
				],
				[
					25,
					-67
				],
				[
					0,
					-38
				],
				[
					-15,
					-16
				],
				[
					-11,
					20
				],
				[
					14,
					47
				],
				[
					-28,
					-22
				],
				[
					-7,
					16
				],
				[
					4,
					22
				],
				[
					-20,
					34
				],
				[
					2,
					56
				],
				[
					-19,
					-18
				],
				[
					3,
					-67
				],
				[
					1,
					-82
				],
				[
					-18,
					-9
				],
				[
					-12,
					17
				],
				[
					8,
					53
				],
				[
					-4,
					56
				],
				[
					-12,
					0
				],
				[
					-8,
					40
				],
				[
					11,
					37
				],
				[
					4,
					46
				],
				[
					14,
					87
				],
				[
					6,
					24
				],
				[
					24,
					42
				],
				[
					21,
					-17
				],
				[
					35,
					-8
				],
				[
					32,
					3
				],
				[
					28,
					42
				],
				[
					5,
					-13
				]
			],
			[
				[
					8573,
					5247
				],
				[
					-1,
					-50
				],
				[
					-14,
					5
				],
				[
					-5,
					-35
				],
				[
					12,
					-30
				],
				[
					-8,
					-7
				],
				[
					-11,
					37
				],
				[
					-8,
					73
				],
				[
					5,
					46
				],
				[
					9,
					21
				],
				[
					2,
					-31
				],
				[
					17,
					-5
				],
				[
					2,
					-24
				]
			],
			[
				[
					7938,
					4845
				],
				[
					-31,
					-1
				],
				[
					-23,
					48
				],
				[
					-36,
					47
				],
				[
					-12,
					35
				],
				[
					-21,
					47
				],
				[
					-13,
					43
				],
				[
					-22,
					81
				],
				[
					-24,
					48
				],
				[
					-8,
					49
				],
				[
					-10,
					45
				],
				[
					-25,
					36
				],
				[
					-15,
					49
				],
				[
					-21,
					33
				],
				[
					-29,
					63
				],
				[
					-2,
					30
				],
				[
					18,
					-3
				],
				[
					43,
					-11
				],
				[
					24,
					-56
				],
				[
					22,
					-39
				],
				[
					15,
					-24
				],
				[
					26,
					-62
				],
				[
					29,
					-1
				],
				[
					23,
					-39
				],
				[
					16,
					-49
				],
				[
					21,
					-26
				],
				[
					-11,
					-47
				],
				[
					16,
					-20
				],
				[
					10,
					-2
				],
				[
					5,
					-40
				],
				[
					9,
					-32
				],
				[
					21,
					-5
				],
				[
					13,
					-36
				],
				[
					-7,
					-72
				],
				[
					-1,
					-89
				]
			],
			[
				[
					8045,
					5298
				],
				[
					20,
					-20
				],
				[
					22,
					11
				],
				[
					5,
					48
				],
				[
					12,
					11
				],
				[
					33,
					13
				],
				[
					20,
					45
				],
				[
					14,
					37
				]
			],
			[
				[
					8171,
					5443
				],
				[
					11,
					21
				],
				[
					24,
					32
				]
			],
			[
				[
					8206,
					5496
				],
				[
					21,
					40
				],
				[
					14,
					45
				],
				[
					11,
					0
				],
				[
					15,
					-29
				],
				[
					1,
					-25
				],
				[
					18,
					-16
				],
				[
					23,
					-18
				],
				[
					-2,
					-22
				],
				[
					-18,
					-3
				],
				[
					5,
					-28
				],
				[
					-21,
					-20
				]
			],
			[
				[
					8273,
					5420
				],
				[
					-16,
					-52
				],
				[
					21,
					-54
				],
				[
					-5,
					-27
				],
				[
					31,
					-53
				],
				[
					-33,
					-7
				],
				[
					-9,
					-39
				],
				[
					1,
					-52
				],
				[
					-27,
					-40
				],
				[
					0,
					-57
				],
				[
					-11,
					-88
				],
				[
					-4,
					20
				],
				[
					-32,
					-26
				],
				[
					-11,
					36
				],
				[
					-19,
					3
				],
				[
					-14,
					18
				],
				[
					-33,
					-20
				],
				[
					-10,
					28
				],
				[
					-19,
					-4
				],
				[
					-23,
					7
				],
				[
					-4,
					77
				],
				[
					-14,
					16
				],
				[
					-13,
					50
				],
				[
					-4,
					50
				],
				[
					3,
					53
				],
				[
					17,
					39
				]
			],
			[
				[
					8509,
					5667
				],
				[
					3,
					-39
				],
				[
					2,
					-32
				],
				[
					-10,
					-53
				],
				[
					-10,
					59
				],
				[
					-13,
					-29
				],
				[
					9,
					-43
				],
				[
					-8,
					-27
				],
				[
					-33,
					34
				],
				[
					-8,
					41
				],
				[
					9,
					28
				],
				[
					-18,
					27
				],
				[
					-8,
					-24
				],
				[
					-14,
					2
				],
				[
					-20,
					-32
				],
				[
					-5,
					17
				],
				[
					11,
					49
				],
				[
					18,
					16
				],
				[
					15,
					22
				],
				[
					10,
					-27
				],
				[
					21,
					16
				],
				[
					4,
					26
				],
				[
					20,
					1
				],
				[
					-2,
					45
				],
				[
					23,
					-27
				],
				[
					2,
					-29
				],
				[
					2,
					-21
				]
			],
			[
				[
					7255,
					5539
				],
				[
					-24,
					-13
				],
				[
					-14,
					45
				],
				[
					-4,
					83
				],
				[
					12,
					94
				],
				[
					19,
					-32
				],
				[
					13,
					-41
				],
				[
					14,
					-60
				],
				[
					-5,
					-60
				],
				[
					-11,
					-16
				]
			],
			[
				[
					3307,
					5764
				],
				[
					-24,
					-6
				],
				[
					-5,
					5
				],
				[
					8,
					16
				],
				[
					0,
					23
				],
				[
					16,
					7
				],
				[
					6,
					-2
				],
				[
					-1,
					-43
				]
			],
			[
				[
					8443,
					5774
				],
				[
					-10,
					-19
				],
				[
					-9,
					-36
				],
				[
					-9,
					-18
				],
				[
					-17,
					40
				],
				[
					6,
					16
				],
				[
					7,
					16
				],
				[
					3,
					36
				],
				[
					15,
					3
				],
				[
					-4,
					-39
				],
				[
					20,
					56
				],
				[
					-2,
					-55
				]
			],
			[
				[
					8290,
					5718
				],
				[
					-36,
					-54
				],
				[
					13,
					40
				],
				[
					20,
					36
				],
				[
					17,
					39
				],
				[
					14,
					58
				],
				[
					5,
					-47
				],
				[
					-18,
					-32
				],
				[
					-15,
					-40
				]
			],
			[
				[
					8384,
					5867
				],
				[
					17,
					-18
				],
				[
					18,
					0
				],
				[
					-1,
					-24
				],
				[
					-13,
					-25
				],
				[
					-17,
					-17
				],
				[
					-1,
					27
				],
				[
					2,
					29
				],
				[
					-5,
					28
				]
			],
			[
				[
					8485,
					5882
				],
				[
					8,
					-64
				],
				[
					-22,
					15
				],
				[
					1,
					-19
				],
				[
					7,
					-36
				],
				[
					-14,
					-12
				],
				[
					-1,
					40
				],
				[
					-8,
					3
				],
				[
					-4,
					35
				],
				[
					16,
					-5
				],
				[
					-1,
					22
				],
				[
					-16,
					44
				],
				[
					26,
					-1
				],
				[
					8,
					-22
				]
			],
			[
				[
					8374,
					5935
				],
				[
					-7,
					-50
				],
				[
					-12,
					29
				],
				[
					-14,
					43
				],
				[
					24,
					-2
				],
				[
					9,
					-20
				]
			],
			[
				[
					8369,
					6247
				],
				[
					17,
					-16
				],
				[
					8,
					15
				],
				[
					3,
					-15
				],
				[
					-5,
					-23
				],
				[
					10,
					-42
				],
				[
					-7,
					-48
				],
				[
					-17,
					-19
				],
				[
					-4,
					-46
				],
				[
					6,
					-46
				],
				[
					15,
					-6
				],
				[
					12,
					7
				],
				[
					35,
					-32
				],
				[
					-3,
					-32
				],
				[
					9,
					-14
				],
				[
					-3,
					-26
				],
				[
					-21,
					28
				],
				[
					-11,
					30
				],
				[
					-7,
					-21
				],
				[
					-17,
					35
				],
				[
					-26,
					-9
				],
				[
					-14,
					13
				],
				[
					2,
					24
				],
				[
					9,
					14
				],
				[
					-9,
					14
				],
				[
					-3,
					-21
				],
				[
					-14,
					33
				],
				[
					-4,
					25
				],
				[
					-1,
					55
				],
				[
					11,
					-19
				],
				[
					3,
					90
				],
				[
					9,
					53
				],
				[
					17,
					-1
				]
			],
			[
				[
					3177,
					6232
				],
				[
					-7,
					-15
				],
				[
					-21,
					0
				],
				[
					-16,
					-2
				],
				[
					-2,
					25
				],
				[
					4,
					8
				],
				[
					23,
					0
				],
				[
					14,
					-5
				],
				[
					5,
					-11
				]
			],
			[
				[
					2863,
					6211
				],
				[
					-8,
					-10
				],
				[
					-16,
					9
				],
				[
					-16,
					21
				],
				[
					4,
					14
				],
				[
					11,
					4
				],
				[
					7,
					-2
				],
				[
					18,
					-5
				],
				[
					15,
					-14
				],
				[
					5,
					-16
				],
				[
					-20,
					-1
				]
			],
			[
				[
					3007,
					6317
				],
				[
					4,
					10
				],
				[
					21,
					0
				],
				[
					17,
					-15
				],
				[
					7,
					1
				],
				[
					5,
					-20
				],
				[
					15,
					1
				],
				[
					-1,
					-17
				],
				[
					13,
					-2
				],
				[
					13,
					-21
				],
				[
					-10,
					-24
				],
				[
					-13,
					13
				],
				[
					-13,
					-3
				],
				[
					-9,
					3
				],
				[
					-5,
					-10
				],
				[
					-11,
					-4
				],
				[
					-4,
					14
				],
				[
					-9,
					-8
				],
				[
					-11,
					-40
				],
				[
					-7,
					9
				],
				[
					-2,
					17
				]
			],
			[
				[
					3007,
					6221
				],
				[
					-18,
					10
				],
				[
					-13,
					-4
				],
				[
					-17,
					4
				],
				[
					-13,
					-11
				],
				[
					-15,
					18
				],
				[
					2,
					19
				],
				[
					26,
					-8
				],
				[
					21,
					-5
				],
				[
					10,
					13
				],
				[
					-13,
					25
				],
				[
					0,
					22
				],
				[
					-17,
					9
				],
				[
					6,
					16
				],
				[
					17,
					-3
				],
				[
					24,
					-9
				]
			],
			[
				[
					8064,
					6258
				],
				[
					-24,
					-28
				],
				[
					-23,
					18
				],
				[
					-1,
					49
				],
				[
					14,
					26
				],
				[
					30,
					16
				],
				[
					16,
					-1
				],
				[
					6,
					-22
				],
				[
					-12,
					-25
				],
				[
					-6,
					-33
				]
			],
			[
				[
					679,
					6281
				],
				[
					-4,
					-10
				],
				[
					-7,
					8
				],
				[
					1,
					17
				],
				[
					-5,
					21
				],
				[
					1,
					6
				],
				[
					5,
					9
				],
				[
					-2,
					12
				],
				[
					2,
					5
				],
				[
					2,
					-1
				],
				[
					11,
					-10
				],
				[
					5,
					-5
				],
				[
					4,
					-7
				],
				[
					7,
					-21
				],
				[
					0,
					-3
				],
				[
					-11,
					-12
				],
				[
					-9,
					-9
				]
			],
			[
				[
					664,
					6371
				],
				[
					-9,
					-4
				],
				[
					-5,
					12
				],
				[
					-3,
					4
				],
				[
					-1,
					4
				],
				[
					3,
					5
				],
				[
					10,
					-6
				],
				[
					7,
					-8
				],
				[
					-2,
					-7
				]
			],
			[
				[
					645,
					6401
				],
				[
					-1,
					-6
				],
				[
					-15,
					2
				],
				[
					2,
					7
				],
				[
					14,
					-3
				]
			],
			[
				[
					620,
					6410
				],
				[
					-1,
					-4
				],
				[
					-2,
					1
				],
				[
					-10,
					2
				],
				[
					-3,
					13
				],
				[
					-2,
					3
				],
				[
					8,
					7
				],
				[
					2,
					-3
				],
				[
					8,
					-19
				]
			],
			[
				[
					573,
					6448
				],
				[
					-3,
					-6
				],
				[
					-9,
					11
				],
				[
					1,
					4
				],
				[
					4,
					5
				],
				[
					7,
					-1
				],
				[
					0,
					-13
				]
			],
			[
				[
					2786,
					6493
				],
				[
					11,
					-21
				],
				[
					26,
					6
				],
				[
					10,
					-13
				],
				[
					23,
					-36
				],
				[
					18,
					-26
				],
				[
					9,
					1
				],
				[
					16,
					-12
				],
				[
					-2,
					-16
				],
				[
					21,
					-2
				],
				[
					21,
					-24
				],
				[
					-4,
					-13
				],
				[
					-18,
					-8
				],
				[
					-19,
					-3
				],
				[
					-19,
					5
				],
				[
					-40,
					-6
				],
				[
					19,
					32
				],
				[
					-11,
					15
				],
				[
					-18,
					4
				],
				[
					-10,
					17
				],
				[
					-6,
					33
				],
				[
					-16,
					-3
				],
				[
					-26,
					16
				],
				[
					-8,
					12
				],
				[
					-37,
					9
				],
				[
					-9,
					11
				],
				[
					10,
					14
				],
				[
					-27,
					3
				],
				[
					-20,
					-30
				],
				[
					-12,
					0
				],
				[
					-4,
					-14
				],
				[
					-13,
					-7
				],
				[
					-12,
					6
				],
				[
					14,
					18
				],
				[
					7,
					20
				],
				[
					12,
					13
				],
				[
					14,
					11
				],
				[
					21,
					6
				],
				[
					7,
					6
				],
				[
					24,
					-4
				],
				[
					22,
					-1
				],
				[
					26,
					-19
				]
			],
			[
				[
					2845,
					6550
				],
				[
					-6,
					-3
				],
				[
					-7,
					33
				],
				[
					-11,
					17
				],
				[
					6,
					37
				],
				[
					9,
					-3
				],
				[
					9,
					-47
				],
				[
					0,
					-34
				]
			],
			[
				[
					8365,
					6494
				],
				[
					-12,
					-47
				],
				[
					-15,
					49
				],
				[
					-3,
					42
				],
				[
					16,
					57
				],
				[
					23,
					44
				],
				[
					12,
					-18
				],
				[
					-5,
					-34
				],
				[
					-16,
					-93
				]
			],
			[
				[
					2838,
					6713
				],
				[
					-31,
					-10
				],
				[
					-2,
					22
				],
				[
					13,
					4
				],
				[
					19,
					-2
				],
				[
					1,
					-14
				]
			],
			[
				[
					2860,
					6713
				],
				[
					-4,
					-41
				],
				[
					-6,
					8
				],
				[
					1,
					30
				],
				[
					-13,
					22
				],
				[
					0,
					7
				],
				[
					22,
					-26
				]
			],
			[
				[
					8739,
					7148
				],
				[
					3,
					-19
				],
				[
					-16,
					-35
				],
				[
					-11,
					18
				],
				[
					-14,
					-13
				],
				[
					-8,
					-34
				],
				[
					-18,
					17
				],
				[
					1,
					27
				],
				[
					15,
					34
				],
				[
					16,
					-6
				],
				[
					11,
					24
				],
				[
					21,
					-13
				]
			],
			[
				[
					5943,
					7201
				],
				[
					0,
					-5
				],
				[
					-28,
					-23
				],
				[
					-14,
					7
				],
				[
					-6,
					23
				],
				[
					13,
					2
				]
			],
			[
				[
					5908,
					7205
				],
				[
					2,
					1
				],
				[
					4,
					14
				],
				[
					20,
					-1
				],
				[
					25,
					17
				],
				[
					-18,
					-24
				],
				[
					2,
					-11
				]
			],
			[
				[
					5657,
					7238
				],
				[
					15,
					-19
				],
				[
					22,
					3
				],
				[
					21,
					-4
				],
				[
					-1,
					-10
				],
				[
					15,
					7
				],
				[
					-3,
					-17
				],
				[
					-40,
					-5
				],
				[
					0,
					9
				],
				[
					-34,
					11
				],
				[
					5,
					25
				]
			],
			[
				[
					5430,
					7383
				],
				[
					-10,
					-45
				],
				[
					4,
					-18
				],
				[
					-6,
					-29
				],
				[
					-21,
					21
				],
				[
					-14,
					7
				],
				[
					-39,
					29
				],
				[
					4,
					29
				],
				[
					33,
					-5
				],
				[
					28,
					6
				],
				[
					21,
					5
				]
			],
			[
				[
					5255,
					7555
				],
				[
					16,
					-41
				],
				[
					-3,
					-76
				],
				[
					-13,
					4
				],
				[
					-11,
					-20
				],
				[
					-11,
					16
				],
				[
					-1,
					69
				],
				[
					-6,
					33
				],
				[
					15,
					-3
				],
				[
					14,
					18
				]
			],
			[
				[
					8915,
					7321
				],
				[
					-11,
					-46
				],
				[
					5,
					-29
				],
				[
					-14,
					-41
				],
				[
					-36,
					-27
				],
				[
					-49,
					-3
				],
				[
					-39,
					-66
				],
				[
					-19,
					22
				],
				[
					-1,
					43
				],
				[
					-48,
					-13
				],
				[
					-33,
					-27
				],
				[
					-33,
					-1
				],
				[
					28,
					-42
				],
				[
					-18,
					-98
				],
				[
					-18,
					-24
				],
				[
					-14,
					22
				],
				[
					7,
					52
				],
				[
					-17,
					17
				],
				[
					-12,
					39
				],
				[
					27,
					18
				],
				[
					14,
					36
				],
				[
					28,
					30
				],
				[
					20,
					39
				],
				[
					56,
					17
				],
				[
					29,
					-11
				],
				[
					30,
					102
				],
				[
					18,
					-27
				],
				[
					41,
					57
				],
				[
					16,
					23
				],
				[
					17,
					70
				],
				[
					-5,
					65
				],
				[
					12,
					36
				],
				[
					30,
					11
				],
				[
					15,
					-80
				],
				[
					-1,
					-47
				],
				[
					-26,
					-58
				],
				[
					1,
					-59
				]
			],
			[
				[
					5265,
					7609
				],
				[
					-10,
					-44
				],
				[
					-12,
					11
				],
				[
					-7,
					39
				],
				[
					6,
					22
				],
				[
					18,
					22
				],
				[
					5,
					-50
				]
			],
			[
				[
					8996,
					7726
				],
				[
					20,
					-13
				],
				[
					19,
					25
				],
				[
					6,
					-65
				],
				[
					-41,
					-16
				],
				[
					-24,
					-57
				],
				[
					-44,
					40
				],
				[
					-15,
					-63
				],
				[
					-31,
					-1
				],
				[
					-4,
					57
				],
				[
					14,
					44
				],
				[
					30,
					3
				],
				[
					8,
					80
				],
				[
					8,
					45
				],
				[
					33,
					-60
				],
				[
					21,
					-19
				]
			],
			[
				[
					3231,
					7862
				],
				[
					20,
					-7
				],
				[
					26,
					1
				],
				[
					-14,
					-23
				],
				[
					-10,
					-4
				],
				[
					-36,
					24
				],
				[
					-7,
					20
				],
				[
					11,
					17
				],
				[
					10,
					-28
				]
			],
			[
				[
					3282,
					8010
				],
				[
					-13,
					-1
				],
				[
					-36,
					18
				],
				[
					-26,
					27
				],
				[
					10,
					5
				],
				[
					36,
					-15
				],
				[
					29,
					-24
				],
				[
					0,
					-10
				]
			],
			[
				[
					1569,
					7975
				],
				[
					-14,
					-8
				],
				[
					-46,
					26
				],
				[
					-8,
					21
				],
				[
					-25,
					20
				],
				[
					-5,
					16
				],
				[
					-29,
					11
				],
				[
					-11,
					31
				],
				[
					3,
					13
				],
				[
					29,
					-12
				],
				[
					17,
					-9
				],
				[
					26,
					-6
				],
				[
					10,
					-20
				],
				[
					13,
					-27
				],
				[
					28,
					-24
				],
				[
					12,
					-32
				]
			],
			[
				[
					3440,
					8101
				],
				[
					-19,
					-51
				],
				[
					19,
					20
				],
				[
					18,
					-13
				],
				[
					-9,
					-20
				],
				[
					24,
					-15
				],
				[
					13,
					14
				],
				[
					28,
					-18
				],
				[
					-9,
					-42
				],
				[
					20,
					10
				],
				[
					3,
					-31
				],
				[
					9,
					-36
				],
				[
					-12,
					-50
				],
				[
					-13,
					-3
				],
				[
					-18,
					11
				],
				[
					6,
					47
				],
				[
					-8,
					8
				],
				[
					-32,
					-50
				],
				[
					-16,
					2
				],
				[
					19,
					27
				],
				[
					-26,
					14
				],
				[
					-30,
					-4
				],
				[
					-54,
					2
				],
				[
					-4,
					17
				],
				[
					17,
					20
				],
				[
					-12,
					16
				],
				[
					23,
					35
				],
				[
					29,
					91
				],
				[
					17,
					33
				],
				[
					24,
					20
				],
				[
					13,
					-2
				],
				[
					-5,
					-16
				],
				[
					-15,
					-36
				]
			],
			[
				[
					1313,
					8294
				],
				[
					27,
					4
				],
				[
					-9,
					-65
				],
				[
					25,
					-46
				],
				[
					-12,
					0
				],
				[
					-16,
					26
				],
				[
					-11,
					27
				],
				[
					-14,
					18
				],
				[
					-5,
					25
				],
				[
					2,
					18
				],
				[
					13,
					-7
				]
			],
			[
				[
					8989,
					8104
				],
				[
					28,
					-102
				],
				[
					-41,
					19
				],
				[
					-17,
					-83
				],
				[
					27,
					-59
				],
				[
					-1,
					-40
				],
				[
					-21,
					34
				],
				[
					-18,
					-44
				],
				[
					-6,
					48
				],
				[
					4,
					56
				],
				[
					-4,
					62
				],
				[
					7,
					44
				],
				[
					1,
					77
				],
				[
					-16,
					57
				],
				[
					2,
					78
				],
				[
					26,
					27
				],
				[
					-11,
					26
				],
				[
					12,
					9
				],
				[
					7,
					-39
				],
				[
					10,
					-55
				],
				[
					-1,
					-57
				],
				[
					12,
					-58
				]
			],
			[
				[
					4789,
					8357
				],
				[
					23,
					2
				],
				[
					30,
					-36
				],
				[
					-15,
					-39
				]
			],
			[
				[
					4827,
					8284
				],
				[
					4,
					-41
				],
				[
					-21,
					-52
				],
				[
					-49,
					-34
				],
				[
					-39,
					9
				],
				[
					22,
					60
				],
				[
					-14,
					59
				],
				[
					38,
					45
				],
				[
					21,
					27
				]
			],
			[
				[
					5351,
					8384
				],
				[
					-16,
					-46
				],
				[
					-29,
					32
				],
				[
					-4,
					24
				],
				[
					41,
					19
				],
				[
					8,
					-29
				]
			],
			[
				[
					749,
					8471
				],
				[
					-27,
					-22
				],
				[
					-15,
					15
				],
				[
					-4,
					27
				],
				[
					25,
					20
				],
				[
					15,
					9
				],
				[
					19,
					-4
				],
				[
					11,
					-18
				],
				[
					-24,
					-27
				]
			],
			[
				[
					4916,
					8558
				],
				[
					-30,
					-62
				],
				[
					28,
					8
				],
				[
					31,
					0
				],
				[
					-8,
					-47
				],
				[
					-25,
					-52
				],
				[
					29,
					-4
				],
				[
					27,
					-74
				],
				[
					19,
					-9
				],
				[
					17,
					-65
				],
				[
					8,
					-23
				],
				[
					34,
					-11
				],
				[
					-4,
					-37
				],
				[
					-14,
					-17
				],
				[
					11,
					-30
				],
				[
					-25,
					-30
				],
				[
					-37,
					1
				],
				[
					-47,
					-16
				],
				[
					-13,
					11
				],
				[
					-18,
					-27
				],
				[
					-26,
					7
				],
				[
					-20,
					-22
				],
				[
					-14,
					11
				],
				[
					40,
					61
				],
				[
					25,
					12
				],
				[
					-43,
					10
				],
				[
					-8,
					23
				],
				[
					29,
					18
				],
				[
					-15,
					31
				],
				[
					5,
					37
				],
				[
					41,
					-5
				],
				[
					4,
					34
				],
				[
					-19,
					36
				],
				[
					-34,
					10
				],
				[
					-6,
					16
				],
				[
					10,
					25
				],
				[
					-9,
					16
				],
				[
					-15,
					-27
				],
				[
					-2,
					55
				],
				[
					-14,
					30
				],
				[
					10,
					59
				],
				[
					22,
					47
				],
				[
					22,
					-5
				],
				[
					34,
					5
				]
			],
			[
				[
					400,
					8632
				],
				[
					-17,
					-9
				],
				[
					-18,
					11
				],
				[
					-17,
					15
				],
				[
					27,
					10
				],
				[
					22,
					-5
				],
				[
					3,
					-22
				]
			],
			[
				[
					2797,
					8761
				],
				[
					-10,
					-30
				],
				[
					-13,
					5
				],
				[
					-7,
					17
				],
				[
					1,
					4
				],
				[
					11,
					17
				],
				[
					11,
					-1
				],
				[
					7,
					-12
				]
			],
			[
				[
					2724,
					8793
				],
				[
					-32,
					-32
				],
				[
					-20,
					2
				],
				[
					-6,
					15
				],
				[
					21,
					27
				],
				[
					38,
					-1
				],
				[
					-1,
					-11
				]
			],
			[
				[
					229,
					8855
				],
				[
					17,
					-11
				],
				[
					18,
					6
				],
				[
					22,
					-15
				],
				[
					28,
					-8
				],
				[
					-3,
					-6
				],
				[
					-21,
					-13
				],
				[
					-21,
					13
				],
				[
					-10,
					10
				],
				[
					-25,
					-3
				],
				[
					-6,
					5
				],
				[
					1,
					22
				]
			],
			[
				[
					2634,
					8963
				],
				[
					5,
					-26
				],
				[
					14,
					9
				],
				[
					16,
					-15
				],
				[
					31,
					-20
				],
				[
					31,
					-18
				],
				[
					3,
					-27
				],
				[
					20,
					5
				],
				[
					20,
					-20
				],
				[
					-25,
					-18
				],
				[
					-43,
					14
				],
				[
					-15,
					26
				],
				[
					-28,
					-31
				],
				[
					-39,
					-29
				],
				[
					-10,
					33
				],
				[
					-38,
					-5
				],
				[
					25,
					28
				],
				[
					3,
					46
				],
				[
					10,
					52
				],
				[
					20,
					-4
				]
			],
			[
				[
					4596,
					9009
				],
				[
					-6,
					-38
				],
				[
					31,
					-39
				],
				[
					-36,
					-44
				],
				[
					-80,
					-39
				],
				[
					-24,
					-11
				],
				[
					-37,
					9
				],
				[
					-77,
					18
				],
				[
					27,
					25
				],
				[
					-60,
					29
				],
				[
					49,
					11
				],
				[
					-1,
					17
				],
				[
					-59,
					13
				],
				[
					19,
					38
				],
				[
					42,
					8
				],
				[
					43,
					-39
				],
				[
					43,
					31
				],
				[
					35,
					-16
				],
				[
					45,
					31
				],
				[
					46,
					-4
				]
			],
			[
				[
					2892,
					9049
				],
				[
					-31,
					-3
				],
				[
					-7,
					28
				],
				[
					12,
					32
				],
				[
					25,
					8
				],
				[
					22,
					-16
				],
				[
					0,
					-24
				],
				[
					-3,
					-8
				],
				[
					-18,
					-17
				]
			],
			[
				[
					138,
					9016
				],
				[
					19,
					-14
				],
				[
					-7,
					42
				],
				[
					76,
					-9
				],
				[
					54,
					-54
				],
				[
					-27,
					-25
				],
				[
					-46,
					-6
				],
				[
					-1,
					-56
				],
				[
					-11,
					-12
				],
				[
					-26,
					2
				],
				[
					-21,
					20
				],
				[
					-37,
					16
				],
				[
					-6,
					25
				],
				[
					-28,
					10
				],
				[
					-32,
					-8
				],
				[
					-15,
					20
				],
				[
					6,
					22
				],
				[
					-33,
					-14
				],
				[
					12,
					-27
				],
				[
					-15,
					-24
				],
				[
					0,
					229
				],
				[
					68,
					-44
				],
				[
					72,
					-57
				],
				[
					-2,
					-36
				]
			],
			[
				[
					2342,
					9161
				],
				[
					-17,
					-20
				],
				[
					-37,
					18
				],
				[
					-23,
					-7
				],
				[
					-38,
					26
				],
				[
					25,
					18
				],
				[
					19,
					25
				],
				[
					29,
					-16
				],
				[
					17,
					-11
				],
				[
					8,
					-11
				],
				[
					17,
					-22
				]
			],
			[
				[
					9999,
					9261
				],
				[
					-31,
					-3
				],
				[
					-5,
					18
				],
				[
					36,
					24
				],
				[
					0,
					-39
				]
			],
			[
				[
					36,
					9264
				],
				[
					-36,
					-3
				],
				[
					0,
					39
				],
				[
					3,
					2
				],
				[
					24,
					0
				],
				[
					40,
					-16
				],
				[
					-3,
					-8
				],
				[
					-28,
					-14
				]
			],
			[
				[
					3134,
					7781
				],
				[
					5,
					-19
				],
				[
					-30,
					-28
				],
				[
					-28,
					-20
				],
				[
					-29,
					-17
				]
			],
			[
				[
					3052,
					7697
				],
				[
					-16,
					-37
				],
				[
					-4,
					-10
				]
			],
			[
				[
					3032,
					7650
				],
				[
					0,
					-30
				],
				[
					9,
					-31
				],
				[
					12,
					-1
				],
				[
					-3,
					21
				],
				[
					8,
					-13
				],
				[
					-2,
					-16
				],
				[
					-19,
					-10
				],
				[
					-13,
					1
				],
				[
					-21,
					-10
				],
				[
					-12,
					-3
				],
				[
					-16,
					-2
				],
				[
					-23,
					-17
				]
			],
			[
				[
					2952,
					7539
				],
				[
					41,
					11
				],
				[
					8,
					-11
				]
			],
			[
				[
					3001,
					7539
				],
				[
					-39,
					-17
				],
				[
					-18,
					-1
				],
				[
					1,
					8
				],
				[
					-8,
					-16
				],
				[
					8,
					-3
				],
				[
					-6,
					-41
				],
				[
					-21,
					-45
				],
				[
					-2,
					15
				],
				[
					-6,
					3
				],
				[
					-9,
					14
				],
				[
					6,
					-31
				],
				[
					7,
					-10
				],
				[
					0,
					-22
				],
				[
					-9,
					-22
				],
				[
					-15,
					-46
				],
				[
					-3,
					2
				],
				[
					9,
					39
				]
			],
			[
				[
					2896,
					7366
				],
				[
					-14,
					23
				],
				[
					-4,
					47
				]
			],
			[
				[
					2878,
					7436
				],
				[
					-5,
					-25
				],
				[
					6,
					-36
				],
				[
					-18,
					9
				],
				[
					19,
					-19
				],
				[
					1,
					-54
				],
				[
					8,
					-4
				],
				[
					3,
					-20
				],
				[
					4,
					-58
				],
				[
					-18,
					-43
				],
				[
					-29,
					-17
				],
				[
					-18,
					-34
				],
				[
					-14,
					-3
				],
				[
					-14,
					-21
				],
				[
					-4,
					-20
				],
				[
					-30,
					-37
				],
				[
					-16,
					-27
				],
				[
					-13,
					-35
				],
				[
					-4,
					-41
				],
				[
					5,
					-39
				],
				[
					9,
					-50
				],
				[
					12,
					-41
				],
				[
					0,
					-24
				],
				[
					13,
					-67
				],
				[
					0,
					-39
				],
				[
					-2,
					-22
				],
				[
					-7,
					-36
				],
				[
					-8,
					-7
				],
				[
					-14,
					7
				],
				[
					-4,
					25
				],
				[
					-10,
					14
				],
				[
					-15,
					49
				],
				[
					-13,
					44
				],
				[
					-4,
					23
				],
				[
					5,
					38
				],
				[
					-7,
					32
				],
				[
					-22,
					48
				],
				[
					-11,
					9
				],
				[
					-28,
					-26
				],
				[
					-5,
					2
				],
				[
					-13,
					27
				],
				[
					-18,
					14
				],
				[
					-31,
					-7
				],
				[
					-25,
					7
				],
				[
					-21,
					-4
				]
			],
			[
				[
					2522,
					6928
				],
				[
					-12,
					-8
				],
				[
					6,
					-17
				]
			],
			[
				[
					2516,
					6903
				],
				[
					-1,
					-23
				],
				[
					6,
					-11
				],
				[
					-5,
					-8
				],
				[
					-11,
					9
				],
				[
					-10,
					-11
				],
				[
					-20,
					1
				],
				[
					-21,
					31
				],
				[
					-24,
					-7
				],
				[
					-20,
					13
				],
				[
					-18,
					-4
				],
				[
					-23,
					-13
				],
				[
					-25,
					-43
				],
				[
					-28,
					-25
				]
			],
			[
				[
					2316,
					6812
				],
				[
					-15,
					-27
				],
				[
					-6,
					-26
				]
			],
			[
				[
					2295,
					6759
				],
				[
					-1,
					-40
				],
				[
					2,
					-28
				],
				[
					5,
					-19
				]
			],
			[
				[
					2301,
					6672
				],
				[
					0,
					-1
				],
				[
					-11,
					-50
				]
			],
			[
				[
					2290,
					6621
				],
				[
					-5,
					-41
				],
				[
					-2,
					-78
				],
				[
					-2,
					-28
				],
				[
					4,
					-31
				],
				[
					9,
					-28
				],
				[
					6,
					-45
				],
				[
					18,
					-43
				],
				[
					6,
					-33
				],
				[
					11,
					-28
				],
				[
					30,
					-15
				],
				[
					11,
					-24
				],
				[
					25,
					16
				],
				[
					21,
					6
				],
				[
					21,
					10
				],
				[
					17,
					10
				],
				[
					18,
					23
				],
				[
					6,
					34
				],
				[
					3,
					48
				],
				[
					5,
					17
				],
				[
					18,
					15
				],
				[
					30,
					14
				],
				[
					24,
					-2
				],
				[
					17,
					5
				],
				[
					7,
					-13
				],
				[
					-1,
					-27
				],
				[
					-15,
					-35
				],
				[
					-7,
					-35
				],
				[
					5,
					-10
				],
				[
					-4,
					-25
				],
				[
					-7,
					-45
				],
				[
					-7,
					15
				],
				[
					-6,
					-1
				]
			],
			[
				[
					2546,
					6247
				],
				[
					1,
					-8
				],
				[
					5,
					0
				],
				[
					-1,
					-16
				],
				[
					-4,
					-25
				],
				[
					2,
					-9
				],
				[
					-3,
					-21
				],
				[
					2,
					-5
				],
				[
					-3,
					-29
				],
				[
					-6,
					-15
				],
				[
					-5,
					-2
				],
				[
					-5,
					-20
				]
			],
			[
				[
					2529,
					6097
				],
				[
					9,
					-11
				],
				[
					2,
					9
				],
				[
					9,
					-7
				]
			],
			[
				[
					2549,
					6088
				],
				[
					2,
					-3
				],
				[
					7,
					10
				],
				[
					7,
					1
				],
				[
					3,
					-4
				],
				[
					4,
					2
				],
				[
					13,
					-5
				],
				[
					13,
					2
				],
				[
					9,
					6
				],
				[
					3,
					7
				],
				[
					9,
					-3
				],
				[
					7,
					-4
				],
				[
					7,
					1
				],
				[
					6,
					5
				],
				[
					12,
					-8
				],
				[
					5,
					-1
				],
				[
					8,
					-11
				],
				[
					8,
					-13
				],
				[
					10,
					-9
				],
				[
					8,
					-16
				]
			],
			[
				[
					2690,
					6045
				],
				[
					-3,
					-5
				],
				[
					-1,
					-13
				],
				[
					3,
					-21
				],
				[
					-7,
					-20
				],
				[
					-3,
					-23
				],
				[
					-1,
					-25
				],
				[
					2,
					-15
				],
				[
					1,
					-26
				],
				[
					-5,
					-6
				],
				[
					-2,
					-24
				],
				[
					2,
					-15
				],
				[
					-6,
					-15
				],
				[
					1,
					-16
				],
				[
					4,
					-9
				]
			],
			[
				[
					2675,
					5812
				],
				[
					8,
					-31
				],
				[
					10,
					-24
				],
				[
					13,
					-24
				]
			],
			[
				[
					2706,
					5733
				],
				[
					10,
					-21
				],
				[
					0,
					-12
				],
				[
					11,
					-3
				],
				[
					2,
					5
				],
				[
					8,
					-14
				],
				[
					14,
					4
				],
				[
					12,
					15
				],
				[
					16,
					11
				],
				[
					10,
					17
				],
				[
					15,
					-3
				],
				[
					-1,
					-6
				],
				[
					16,
					-2
				],
				[
					12,
					-10
				],
				[
					9,
					-17
				],
				[
					11,
					-16
				]
			],
			[
				[
					2851,
					5681
				],
				[
					14,
					-2
				],
				[
					21,
					41
				],
				[
					11,
					6
				],
				[
					0,
					19
				],
				[
					6,
					48
				],
				[
					15,
					27
				],
				[
					18,
					1
				],
				[
					2,
					12
				],
				[
					22,
					-5
				],
				[
					22,
					30
				],
				[
					11,
					12
				],
				[
					13,
					28
				],
				[
					10,
					-3
				],
				[
					7,
					-16
				],
				[
					-5,
					-19
				]
			],
			[
				[
					3018,
					5860
				],
				[
					-1,
					-14
				],
				[
					-16,
					-6
				],
				[
					9,
					-26
				],
				[
					-1,
					-30
				],
				[
					-12,
					-34
				],
				[
					11,
					-46
				],
				[
					12,
					4
				],
				[
					6,
					42
				],
				[
					-9,
					20
				],
				[
					-1,
					44
				],
				[
					34,
					23
				],
				[
					-3,
					27
				],
				[
					9,
					18
				],
				[
					10,
					-40
				],
				[
					20,
					-1
				],
				[
					18,
					-32
				],
				[
					1,
					-19
				],
				[
					25,
					-1
				],
				[
					30,
					6
				],
				[
					15,
					-26
				],
				[
					22,
					-7
				],
				[
					15,
					18
				],
				[
					1,
					15
				],
				[
					34,
					3
				],
				[
					33,
					1
				],
				[
					-23,
					-17
				],
				[
					9,
					-27
				],
				[
					22,
					-5
				],
				[
					21,
					-28
				],
				[
					5,
					-46
				],
				[
					14,
					1
				],
				[
					11,
					-13
				]
			],
			[
				[
					3339,
					5664
				],
				[
					18,
					-21
				],
				[
					18,
					-38
				],
				[
					0,
					-30
				],
				[
					11,
					-1
				],
				[
					15,
					-28
				],
				[
					11,
					-20
				]
			],
			[
				[
					3412,
					5526
				],
				[
					33,
					-12
				],
				[
					3,
					11
				],
				[
					22,
					4
				],
				[
					30,
					-16
				]
			],
			[
				[
					3500,
					5513
				],
				[
					10,
					-6
				],
				[
					20,
					-14
				],
				[
					30,
					-48
				],
				[
					4,
					-24
				]
			],
			[
				[
					3564,
					5421
				],
				[
					10,
					3
				],
				[
					7,
					-32
				],
				[
					15,
					-101
				],
				[
					15,
					-9
				],
				[
					1,
					-40
				],
				[
					-21,
					-47
				],
				[
					8,
					-18
				],
				[
					50,
					-9
				],
				[
					1,
					-57
				],
				[
					21,
					37
				],
				[
					35,
					-20
				],
				[
					46,
					-35
				],
				[
					13,
					-34
				],
				[
					-4,
					-32
				],
				[
					32,
					18
				],
				[
					54,
					-31
				],
				[
					42,
					3
				],
				[
					41,
					-48
				],
				[
					35,
					-65
				],
				[
					22,
					-16
				],
				[
					23,
					-3
				],
				[
					10,
					-18
				],
				[
					10,
					-73
				],
				[
					4,
					-35
				],
				[
					-11,
					-95
				],
				[
					-14,
					-38
				],
				[
					-39,
					-80
				],
				[
					-18,
					-65
				],
				[
					-20,
					-50
				],
				[
					-7,
					-1
				],
				[
					-8,
					-42
				],
				[
					2,
					-108
				],
				[
					-8,
					-89
				],
				[
					-3,
					-38
				],
				[
					-8,
					-23
				],
				[
					-5,
					-77
				],
				[
					-29,
					-75
				],
				[
					-4,
					-59
				],
				[
					-23,
					-25
				],
				[
					-6,
					-35
				],
				[
					-30,
					0
				],
				[
					-44,
					-22
				],
				[
					-20,
					-25
				],
				[
					-31,
					-17
				],
				[
					-32,
					-46
				],
				[
					-24,
					-57
				],
				[
					-4,
					-43
				],
				[
					5,
					-32
				],
				[
					-6,
					-58
				],
				[
					-6,
					-28
				],
				[
					-19,
					-32
				],
				[
					-31,
					-101
				],
				[
					-25,
					-46
				],
				[
					-18,
					-27
				],
				[
					-13,
					-55
				],
				[
					-18,
					-33
				]
			],
			[
				[
					3517,
					3237
				],
				[
					-12,
					-36
				],
				[
					-32,
					-32
				],
				[
					-20,
					12
				],
				[
					-15,
					-6
				],
				[
					-26,
					24
				],
				[
					-19,
					-1
				],
				[
					-17,
					31
				]
			],
			[
				[
					3376,
					3229
				],
				[
					-2,
					-30
				],
				[
					36,
					-49
				],
				[
					-4,
					-40
				],
				[
					17,
					-25
				],
				[
					-1,
					-28
				],
				[
					-27,
					-74
				],
				[
					-41,
					-31
				],
				[
					-56,
					-12
				],
				[
					-30,
					6
				],
				[
					5,
					-34
				],
				[
					-5,
					-43
				],
				[
					5,
					-29
				],
				[
					-17,
					-21
				],
				[
					-28,
					-8
				],
				[
					-27,
					21
				],
				[
					-11,
					-15
				],
				[
					4,
					-57
				],
				[
					19,
					-17
				],
				[
					15,
					18
				],
				[
					8,
					-30
				],
				[
					-25,
					-18
				],
				[
					-22,
					-36
				],
				[
					-5,
					-58
				],
				[
					-6,
					-30
				],
				[
					-26,
					-1
				],
				[
					-22,
					-29
				],
				[
					-8,
					-43
				],
				[
					27,
					-42
				],
				[
					27,
					-12
				],
				[
					-10,
					-52
				],
				[
					-33,
					-32
				],
				[
					-18,
					-68
				],
				[
					-25,
					-22
				],
				[
					-11,
					-27
				],
				[
					9,
					-60
				],
				[
					18,
					-34
				],
				[
					-12,
					3
				]
			],
			[
				[
					3094,
					2170
				],
				[
					-24,
					1
				],
				[
					-14,
					-14
				],
				[
					-25,
					-21
				],
				[
					-4,
					-54
				],
				[
					-12,
					-1
				],
				[
					-31,
					18
				],
				[
					-32,
					41
				],
				[
					-35,
					33
				],
				[
					-8,
					36
				],
				[
					8,
					34
				],
				[
					-14,
					38
				],
				[
					-4,
					98
				],
				[
					12,
					56
				],
				[
					29,
					44
				],
				[
					-42,
					17
				],
				[
					26,
					51
				],
				[
					10,
					95
				],
				[
					31,
					-20
				],
				[
					14,
					119
				],
				[
					-18,
					16
				],
				[
					-9,
					-72
				],
				[
					-18,
					8
				],
				[
					9,
					82
				],
				[
					10,
					107
				],
				[
					12,
					39
				],
				[
					-8,
					57
				],
				[
					-2,
					64
				],
				[
					12,
					2
				],
				[
					17,
					93
				],
				[
					19,
					92
				],
				[
					12,
					86
				],
				[
					-7,
					86
				],
				[
					9,
					48
				],
				[
					-4,
					71
				],
				[
					17,
					70
				],
				[
					5,
					112
				],
				[
					9,
					119
				],
				[
					8,
					129
				],
				[
					-2,
					94
				],
				[
					-6,
					81
				]
			],
			[
				[
					3044,
					4125
				],
				[
					-27,
					33
				],
				[
					-3,
					24
				],
				[
					-55,
					58
				],
				[
					-50,
					63
				],
				[
					-21,
					35
				],
				[
					-12,
					48
				],
				[
					5,
					17
				],
				[
					-24,
					75
				],
				[
					-27,
					106
				],
				[
					-26,
					115
				],
				[
					-12,
					26
				],
				[
					-8,
					43
				],
				[
					-22,
					37
				],
				[
					-20,
					24
				],
				[
					9,
					25
				],
				[
					-13,
					55
				],
				[
					8,
					41
				],
				[
					23,
					36
				]
			],
			[
				[
					2769,
					4986
				],
				[
					14,
					43
				],
				[
					-6,
					25
				],
				[
					-10,
					-27
				],
				[
					-17,
					26
				],
				[
					6,
					16
				],
				[
					-5,
					52
				],
				[
					10,
					9
				],
				[
					5,
					36
				],
				[
					10,
					37
				],
				[
					-2,
					23
				],
				[
					16,
					13
				],
				[
					19,
					22
				]
			],
			[
				[
					2809,
					5261
				],
				[
					-4,
					18
				],
				[
					10,
					5
				],
				[
					-1,
					29
				],
				[
					7,
					20
				],
				[
					13,
					4
				],
				[
					12,
					36
				],
				[
					11,
					31
				],
				[
					-10,
					13
				],
				[
					5,
					34
				],
				[
					-6,
					52
				],
				[
					5,
					16
				],
				[
					-4,
					48
				],
				[
					-11,
					31
				]
			],
			[
				[
					2836,
					5598
				],
				[
					-9,
					17
				],
				[
					-6,
					31
				],
				[
					6,
					15
				],
				[
					-7,
					4
				],
				[
					-5,
					19
				],
				[
					-14,
					16
				],
				[
					-12,
					-4
				],
				[
					-5,
					-20
				],
				[
					-12,
					-14
				],
				[
					-6,
					-2
				],
				[
					-2,
					-12
				],
				[
					13,
					-31
				],
				[
					-8,
					-8
				],
				[
					-4,
					-8
				],
				[
					-13,
					-3
				],
				[
					-4,
					34
				],
				[
					-4,
					-10
				],
				[
					-9,
					4
				],
				[
					-6,
					23
				],
				[
					-11,
					4
				],
				[
					-7,
					6
				],
				[
					-12,
					0
				],
				[
					-1,
					-12
				],
				[
					-3,
					9
				]
			],
			[
				[
					2695,
					5656
				],
				[
					-15,
					12
				],
				[
					-6,
					12
				],
				[
					3,
					10
				],
				[
					-1,
					13
				],
				[
					-8,
					14
				],
				[
					-11,
					11
				],
				[
					-9,
					8
				],
				[
					-2,
					17
				],
				[
					-7,
					10
				],
				[
					2,
					-17
				],
				[
					-6,
					-14
				],
				[
					-6,
					16
				],
				[
					-9,
					6
				],
				[
					-4,
					12
				],
				[
					0,
					17
				],
				[
					4,
					18
				],
				[
					-8,
					8
				],
				[
					6,
					11
				]
			],
			[
				[
					2618,
					5820
				],
				[
					-9,
					19
				],
				[
					-13,
					23
				],
				[
					-6,
					19
				],
				[
					-12,
					18
				],
				[
					-14,
					26
				],
				[
					3,
					9
				],
				[
					5,
					-8
				],
				[
					2,
					4
				]
			],
			[
				[
					2574,
					5930
				],
				[
					-5,
					18
				],
				[
					-8,
					5
				]
			],
			[
				[
					2561,
					5953
				],
				[
					-4,
					-14
				],
				[
					-16,
					1
				]
			],
			[
				[
					2541,
					5940
				],
				[
					-10,
					5
				],
				[
					-11,
					12
				]
			],
			[
				[
					2520,
					5957
				],
				[
					-16,
					4
				],
				[
					-7,
					12
				]
			],
			[
				[
					2497,
					5973
				],
				[
					-15,
					10
				],
				[
					-17,
					1
				],
				[
					-13,
					11
				],
				[
					-15,
					24
				]
			],
			[
				[
					2437,
					6019
				],
				[
					-31,
					62
				],
				[
					-14,
					19
				],
				[
					-23,
					15
				],
				[
					-16,
					-4
				],
				[
					-22,
					-22
				],
				[
					-14,
					-6
				],
				[
					-19,
					16
				],
				[
					-21,
					10
				],
				[
					-26,
					27
				],
				[
					-21,
					8
				],
				[
					-32,
					27
				],
				[
					-23,
					27
				],
				[
					-7,
					16
				],
				[
					-15,
					3
				],
				[
					-29,
					18
				],
				[
					-11,
					27
				],
				[
					-30,
					32
				],
				[
					-14,
					37
				],
				[
					-7,
					28
				],
				[
					10,
					5
				],
				[
					-3,
					17
				],
				[
					6,
					15
				],
				[
					0,
					20
				],
				[
					-9,
					25
				],
				[
					-3,
					23
				],
				[
					-9,
					29
				],
				[
					-24,
					58
				],
				[
					-28,
					45
				],
				[
					-14,
					35
				],
				[
					-24,
					24
				],
				[
					-5,
					14
				],
				[
					4,
					36
				],
				[
					-14,
					13
				],
				[
					-16,
					28
				],
				[
					-7,
					40
				],
				[
					-15,
					5
				],
				[
					-16,
					30
				],
				[
					-13,
					28
				],
				[
					-1,
					18
				],
				[
					-15,
					44
				],
				[
					-10,
					44
				],
				[
					0,
					22
				],
				[
					-20,
					23
				],
				[
					-9,
					-3
				],
				[
					-16,
					16
				],
				[
					-4,
					-23
				],
				[
					4,
					-28
				],
				[
					3,
					-43
				],
				[
					9,
					-24
				],
				[
					21,
					-40
				],
				[
					5,
					-13
				],
				[
					4,
					-4
				],
				[
					4,
					-20
				],
				[
					4,
					1
				],
				[
					6,
					-37
				],
				[
					8,
					-15
				],
				[
					6,
					-20
				],
				[
					18,
					-30
				],
				[
					9,
					-53
				],
				[
					8,
					-25
				],
				[
					8,
					-27
				],
				[
					2,
					-31
				],
				[
					13,
					-2
				],
				[
					11,
					-26
				],
				[
					10,
					-26
				],
				[
					-1,
					-10
				],
				[
					-11,
					-21
				],
				[
					-5,
					0
				],
				[
					-7,
					35
				],
				[
					-19,
					33
				],
				[
					-20,
					28
				],
				[
					-14,
					14
				],
				[
					1,
					43
				],
				[
					-4,
					31
				],
				[
					-13,
					18
				],
				[
					-19,
					25
				],
				[
					-4,
					-7
				],
				[
					-7,
					15
				],
				[
					-17,
					14
				],
				[
					-17,
					33
				],
				[
					2,
					5
				],
				[
					12,
					-4
				],
				[
					10,
					22
				],
				[
					1,
					26
				],
				[
					-21,
					41
				],
				[
					-17,
					16
				],
				[
					-10,
					36
				],
				[
					-10,
					38
				],
				[
					-13,
					46
				],
				[
					-11,
					51
				]
			],
			[
				[
					1746,
					7055
				],
				[
					-5,
					30
				],
				[
					-18,
					33
				],
				[
					-13,
					7
				],
				[
					-3,
					16
				],
				[
					-15,
					3
				],
				[
					-10,
					16
				],
				[
					-26,
					6
				],
				[
					-7,
					9
				],
				[
					-4,
					31
				],
				[
					-27,
					58
				],
				[
					-23,
					80
				],
				[
					1,
					14
				],
				[
					-12,
					19
				],
				[
					-22,
					48
				],
				[
					-3,
					47
				],
				[
					-15,
					31
				],
				[
					6,
					48
				],
				[
					-1,
					49
				],
				[
					-9,
					45
				],
				[
					11,
					54
				],
				[
					7,
					104
				],
				[
					-5,
					78
				],
				[
					-9,
					49
				],
				[
					-8,
					27
				],
				[
					3,
					11
				],
				[
					40,
					-20
				],
				[
					15,
					-54
				],
				[
					7,
					15
				],
				[
					-4,
					47
				],
				[
					-10,
					48
				]
			],
			[
				[
					1587,
					8004
				],
				[
					-4,
					0
				],
				[
					-53,
					56
				],
				[
					-20,
					25
				],
				[
					-51,
					24
				],
				[
					-15,
					51
				],
				[
					4,
					35
				],
				[
					-36,
					25
				],
				[
					-4,
					46
				],
				[
					-34,
					42
				],
				[
					-1,
					30
				]
			],
			[
				[
					1373,
					8338
				],
				[
					-15,
					21
				],
				[
					-24,
					19
				],
				[
					-8,
					50
				],
				[
					-36,
					46
				],
				[
					-15,
					55
				],
				[
					-27,
					4
				],
				[
					-44,
					1
				],
				[
					-32,
					17
				],
				[
					-58,
					59
				],
				[
					-26,
					11
				],
				[
					-49,
					21
				],
				[
					-38,
					-5
				],
				[
					-55,
					26
				],
				[
					-33,
					25
				],
				[
					-31,
					-12
				],
				[
					6,
					-40
				],
				[
					-16,
					-4
				],
				[
					-32,
					-12
				],
				[
					-24,
					-19
				],
				[
					-31,
					-13
				],
				[
					-4,
					34
				],
				[
					13,
					57
				],
				[
					29,
					17
				],
				[
					-8,
					15
				],
				[
					-35,
					-32
				],
				[
					-19,
					-39
				],
				[
					-40,
					-40
				],
				[
					20,
					-28
				],
				[
					-26,
					-42
				],
				[
					-30,
					-24
				],
				[
					-27,
					-17
				],
				[
					-7,
					-26
				],
				[
					-44,
					-30
				],
				[
					-8,
					-27
				],
				[
					-33,
					-24
				],
				[
					-19,
					4
				],
				[
					-26,
					-16
				],
				[
					-28,
					-20
				],
				[
					-23,
					-19
				],
				[
					-48,
					-16
				],
				[
					-4,
					9
				],
				[
					30,
					27
				],
				[
					27,
					18
				],
				[
					30,
					32
				],
				[
					34,
					6
				],
				[
					14,
					24
				],
				[
					39,
					34
				],
				[
					6,
					12
				],
				[
					20,
					20
				],
				[
					5,
					44
				],
				[
					14,
					34
				],
				[
					-32,
					-18
				],
				[
					-9,
					10
				],
				[
					-15,
					-21
				],
				[
					-18,
					29
				],
				[
					-7,
					-20
				],
				[
					-11,
					28
				],
				[
					-28,
					-23
				],
				[
					-17,
					0
				],
				[
					-2,
					35
				],
				[
					5,
					21
				],
				[
					-18,
					20
				],
				[
					-36,
					-11
				],
				[
					-23,
					27
				],
				[
					-19,
					14
				],
				[
					-1,
					33
				],
				[
					-21,
					24
				],
				[
					11,
					33
				],
				[
					22,
					33
				],
				[
					10,
					29
				],
				[
					23,
					4
				],
				[
					19,
					-9
				],
				[
					22,
					28
				],
				[
					20,
					-5
				],
				[
					22,
					18
				],
				[
					-6,
					26
				],
				[
					-15,
					10
				],
				[
					20,
					23
				],
				[
					-17,
					-1
				],
				[
					-29,
					-13
				],
				[
					-9,
					-12
				],
				[
					-22,
					12
				],
				[
					-39,
					-6
				],
				[
					-40,
					14
				],
				[
					-12,
					23
				],
				[
					-35,
					33
				],
				[
					39,
					25
				],
				[
					62,
					28
				],
				[
					23,
					0
				],
				[
					-4,
					-29
				],
				[
					58,
					2
				],
				[
					-22,
					36
				],
				[
					-34,
					22
				],
				[
					-20,
					29
				],
				[
					-27,
					24
				],
				[
					-38,
					18
				],
				[
					16,
					30
				],
				[
					49,
					2
				],
				[
					35,
					27
				],
				[
					7,
					28
				],
				[
					28,
					27
				],
				[
					27,
					7
				],
				[
					53,
					25
				],
				[
					25,
					-4
				],
				[
					43,
					31
				],
				[
					42,
					-12
				],
				[
					20,
					-26
				],
				[
					12,
					11
				],
				[
					47,
					-3
				],
				[
					-1,
					-14
				],
				[
					42,
					-9
				],
				[
					29,
					5
				],
				[
					58,
					-18
				],
				[
					53,
					-5
				],
				[
					22,
					-8
				],
				[
					37,
					10
				],
				[
					42,
					-18
				],
				[
					30,
					-8
				]
			],
			[
				[
					1083,
					9196
				],
				[
					52,
					-14
				],
				[
					44,
					-27
				],
				[
					29,
					-6
				],
				[
					24,
					24
				],
				[
					34,
					18
				],
				[
					41,
					-7
				],
				[
					41,
					26
				],
				[
					46,
					14
				],
				[
					19,
					-24
				],
				[
					21,
					14
				],
				[
					6,
					27
				]
			],
			[
				[
					1440,
					9241
				],
				[
					19,
					-6
				],
				[
					47,
					-52
				]
			],
			[
				[
					1506,
					9183
				],
				[
					37,
					39
				],
				[
					4,
					-44
				],
				[
					34,
					10
				],
				[
					10,
					16
				],
				[
					34,
					-3
				],
				[
					43,
					-24
				],
				[
					65,
					-21
				],
				[
					38,
					-10
				],
				[
					27,
					4
				],
				[
					37,
					-29
				],
				[
					-39,
					-29
				],
				[
					51,
					-12
				],
				[
					75,
					6
				],
				[
					23,
					11
				],
				[
					30,
					-35
				],
				[
					30,
					29
				],
				[
					-28,
					25
				],
				[
					18,
					19
				],
				[
					33,
					3
				],
				[
					23,
					6
				],
				[
					22,
					-14
				],
				[
					28,
					-31
				],
				[
					31,
					4
				],
				[
					49,
					-26
				],
				[
					43,
					9
				],
				[
					41,
					-1
				],
				[
					-3,
					36
				],
				[
					24,
					10
				],
				[
					43,
					-20
				],
				[
					0,
					-54
				],
				[
					18,
					46
				],
				[
					22,
					-2
				],
				[
					13,
					58
				],
				[
					-30,
					36
				],
				[
					-32,
					23
				],
				[
					2,
					64
				],
				[
					33,
					41
				],
				[
					36,
					-9
				],
				[
					28,
					-25
				],
				[
					38,
					-65
				]
			],
			[
				[
					2457,
					9224
				],
				[
					-25,
					-28
				],
				[
					52,
					-12
				]
			],
			[
				[
					2484,
					9184
				],
				[
					0,
					-59
				],
				[
					37,
					45
				],
				[
					33,
					-37
				],
				[
					-8,
					-43
				],
				[
					27,
					-39
				],
				[
					29,
					42
				],
				[
					20,
					50
				],
				[
					2,
					63
				],
				[
					39,
					-4
				],
				[
					41,
					-9
				],
				[
					37,
					-28
				],
				[
					2,
					-29
				],
				[
					-21,
					-31
				],
				[
					20,
					-31
				],
				[
					-4,
					-28
				],
				[
					-54,
					-40
				],
				[
					-39,
					-9
				],
				[
					-28,
					18
				],
				[
					-9,
					-29
				],
				[
					-26,
					-49
				],
				[
					-8,
					-25
				],
				[
					-33,
					-39
				],
				[
					-39,
					-4
				],
				[
					-22,
					-24
				],
				[
					-2,
					-38
				],
				[
					-32,
					-7
				],
				[
					-34,
					-46
				],
				[
					-31,
					-65
				],
				[
					-10,
					-46
				],
				[
					-2,
					-67
				],
				[
					41,
					-9
				],
				[
					12,
					-54
				],
				[
					13,
					-44
				],
				[
					39,
					12
				],
				[
					52,
					-25
				],
				[
					28,
					-22
				],
				[
					20,
					-27
				],
				[
					34,
					-16
				],
				[
					30,
					-25
				],
				[
					46,
					-3
				],
				[
					30,
					-5
				],
				[
					-5,
					-50
				],
				[
					9,
					-58
				],
				[
					20,
					-65
				],
				[
					41,
					-54
				],
				[
					22,
					18
				],
				[
					15,
					60
				],
				[
					-15,
					91
				],
				[
					-19,
					30
				],
				[
					44,
					27
				],
				[
					32,
					40
				],
				[
					15,
					40
				],
				[
					-2,
					39
				],
				[
					-19,
					49
				],
				[
					-34,
					43
				],
				[
					33,
					60
				],
				[
					-12,
					53
				],
				[
					-9,
					90
				],
				[
					19,
					13
				],
				[
					48,
					-16
				],
				[
					28,
					-5
				],
				[
					23,
					15
				],
				[
					26,
					-20
				],
				[
					34,
					-33
				],
				[
					9,
					-23
				],
				[
					49,
					-4
				],
				[
					-1,
					-48
				],
				[
					10,
					-73
				],
				[
					25,
					-9
				],
				[
					20,
					-34
				],
				[
					40,
					32
				],
				[
					27,
					63
				],
				[
					18,
					27
				],
				[
					22,
					-51
				],
				[
					36,
					-74
				],
				[
					31,
					-69
				],
				[
					-11,
					-36
				],
				[
					36,
					-32
				],
				[
					25,
					-33
				],
				[
					45,
					-15
				],
				[
					18,
					-18
				],
				[
					11,
					-49
				],
				[
					21,
					-8
				],
				[
					11,
					-22
				],
				[
					2,
					-64
				],
				[
					-20,
					-22
				],
				[
					-20,
					-20
				],
				[
					-45,
					-21
				],
				[
					-35,
					-47
				],
				[
					-47,
					-9
				],
				[
					-60,
					12
				],
				[
					-41,
					0
				],
				[
					-29,
					-4
				],
				[
					-23,
					-41
				],
				[
					-36,
					-26
				],
				[
					-40,
					-76
				],
				[
					-32,
					-53
				],
				[
					24,
					10
				],
				[
					44,
					75
				],
				[
					59,
					48
				],
				[
					41,
					6
				],
				[
					25,
					-28
				],
				[
					-27,
					-39
				],
				[
					9,
					-62
				],
				[
					9,
					-43
				],
				[
					36,
					-29
				],
				[
					46,
					8
				],
				[
					28,
					65
				],
				[
					2,
					-42
				],
				[
					18,
					-21
				],
				[
					-34,
					-38
				],
				[
					-62,
					-34
				],
				[
					-27,
					-23
				],
				[
					-31,
					-42
				],
				[
					-22,
					5
				],
				[
					-1,
					48
				],
				[
					49,
					48
				],
				[
					-45,
					-2
				],
				[
					-31,
					-7
				]
			],
			[
				[
					1852,
					9128
				],
				[
					-15,
					28
				],
				[
					-38,
					15
				],
				[
					-25,
					-6
				],
				[
					-34,
					45
				],
				[
					18,
					7
				],
				[
					43,
					9
				],
				[
					39,
					-2
				],
				[
					37,
					10
				],
				[
					-54,
					13
				],
				[
					-59,
					-4
				],
				[
					-40,
					1
				],
				[
					-14,
					21
				],
				[
					64,
					23
				],
				[
					-43,
					-1
				],
				[
					-48,
					16
				],
				[
					23,
					43
				],
				[
					19,
					23
				],
				[
					75,
					35
				],
				[
					28,
					-11
				],
				[
					-14,
					-27
				],
				[
					62,
					17
				],
				[
					39,
					-29
				],
				[
					31,
					29
				],
				[
					25,
					-19
				],
				[
					23,
					-56
				],
				[
					14,
					24
				],
				[
					-20,
					59
				],
				[
					25,
					8
				],
				[
					27,
					-9
				],
				[
					31,
					-23
				],
				[
					18,
					-56
				],
				[
					8,
					-41
				],
				[
					47,
					-29
				],
				[
					50,
					-27
				],
				[
					-3,
					-25
				],
				[
					-45,
					-5
				],
				[
					17,
					-22
				],
				[
					-9,
					-21
				],
				[
					-50,
					9
				],
				[
					-48,
					16
				],
				[
					-32,
					-4
				],
				[
					-52,
					-19
				]
			],
			[
				[
					1972,
					9143
				],
				[
					-83,
					-11
				],
				[
					-37,
					-4
				]
			],
			[
				[
					2097,
					9410
				],
				[
					-25,
					-38
				],
				[
					-43,
					40
				],
				[
					9,
					8
				],
				[
					37,
					2
				],
				[
					22,
					-12
				]
			],
			[
				[
					2879,
					9391
				],
				[
					2,
					-15
				],
				[
					-29,
					1
				],
				[
					-30,
					1
				],
				[
					-31,
					-7
				],
				[
					-8,
					3
				],
				[
					-30,
					31
				],
				[
					1,
					20
				],
				[
					13,
					4
				],
				[
					64,
					-6
				],
				[
					48,
					-32
				]
			],
			[
				[
					2595,
					9395
				],
				[
					22,
					-36
				],
				[
					25,
					46
				],
				[
					71,
					24
				],
				[
					47,
					-60
				],
				[
					-4,
					-37
				],
				[
					55,
					16
				],
				[
					26,
					23
				],
				[
					62,
					-29
				],
				[
					38,
					-27
				],
				[
					4,
					-26
				],
				[
					51,
					13
				],
				[
					29,
					-36
				],
				[
					67,
					-23
				],
				[
					25,
					-23
				],
				[
					26,
					-54
				],
				[
					-51,
					-27
				],
				[
					65,
					-38
				],
				[
					44,
					-12
				],
				[
					40,
					-53
				],
				[
					44,
					-4
				],
				[
					-9,
					-40
				],
				[
					-48,
					-67
				],
				[
					-35,
					24
				],
				[
					-43,
					56
				],
				[
					-36,
					-7
				],
				[
					-4,
					-33
				],
				[
					30,
					-34
				],
				[
					37,
					-26
				],
				[
					12,
					-16
				],
				[
					18,
					-57
				],
				[
					-10,
					-41
				],
				[
					-35,
					16
				],
				[
					-69,
					46
				],
				[
					39,
					-50
				],
				[
					29,
					-35
				],
				[
					4,
					-20
				],
				[
					-75,
					23
				],
				[
					-60,
					34
				],
				[
					-33,
					28
				],
				[
					9,
					16
				],
				[
					-41,
					29
				],
				[
					-41,
					28
				],
				[
					1,
					-16
				],
				[
					-80,
					-10
				],
				[
					-24,
					20
				],
				[
					18,
					43
				],
				[
					53,
					1
				],
				[
					57,
					7
				],
				[
					-10,
					21
				],
				[
					10,
					28
				],
				[
					36,
					56
				],
				[
					-8,
					26
				],
				[
					-10,
					20
				],
				[
					-43,
					28
				],
				[
					-56,
					19
				],
				[
					18,
					15
				],
				[
					-30,
					36
				],
				[
					-24,
					3
				],
				[
					-22,
					19
				],
				[
					-15,
					-17
				],
				[
					-50,
					-7
				],
				[
					-101,
					13
				],
				[
					-59,
					17
				],
				[
					-45,
					8
				],
				[
					-23,
					21
				],
				[
					29,
					26
				],
				[
					-40,
					0
				],
				[
					-8,
					58
				],
				[
					21,
					52
				],
				[
					28,
					23
				],
				[
					72,
					16
				],
				[
					-20,
					-37
				]
			],
			[
				[
					2212,
					9434
				],
				[
					33,
					-12
				],
				[
					49,
					7
				],
				[
					7,
					-16
				],
				[
					-25,
					-28
				],
				[
					42,
					-25
				],
				[
					-5,
					-52
				],
				[
					-46,
					-22
				],
				[
					-27,
					5
				],
				[
					-19,
					22
				],
				[
					-69,
					44
				],
				[
					1,
					19
				],
				[
					56,
					-7
				],
				[
					-30,
					37
				],
				[
					33,
					28
				]
			],
			[
				[
					8988,
					9398
				],
				[
					-43,
					-1
				],
				[
					-56,
					7
				],
				[
					-5,
					3
				],
				[
					26,
					23
				],
				[
					35,
					5
				],
				[
					39,
					-22
				],
				[
					4,
					-15
				]
			],
			[
				[
					2410,
					9372
				],
				[
					-29,
					-43
				],
				[
					-32,
					3
				],
				[
					-17,
					50
				],
				[
					0,
					29
				],
				[
					15,
					24
				],
				[
					27,
					16
				],
				[
					58,
					-2
				],
				[
					53,
					-14
				],
				[
					-41,
					-51
				],
				[
					-34,
					-12
				]
			],
			[
				[
					1580,
					9265
				],
				[
					-15,
					25
				],
				[
					-64,
					30
				]
			],
			[
				[
					1501,
					9320
				],
				[
					10,
					19
				],
				[
					21,
					48
				]
			],
			[
				[
					1532,
					9387
				],
				[
					25,
					38
				],
				[
					-28,
					35
				],
				[
					94,
					9
				],
				[
					40,
					-12
				],
				[
					71,
					-3
				],
				[
					27,
					-17
				],
				[
					30,
					-24
				],
				[
					-35,
					-15
				],
				[
					-68,
					-40
				],
				[
					-35,
					-40
				]
			],
			[
				[
					1653,
					9318
				],
				[
					0,
					-25
				],
				[
					-73,
					-28
				]
			],
			[
				[
					9186,
					9506
				],
				[
					-33,
					-23
				],
				[
					-44,
					5
				],
				[
					-52,
					23
				],
				[
					7,
					18
				],
				[
					52,
					-8
				],
				[
					70,
					-15
				]
			],
			[
				[
					2399,
					9500
				],
				[
					-15,
					-23
				],
				[
					-41,
					5
				],
				[
					-33,
					15
				],
				[
					15,
					25
				],
				[
					40,
					16
				],
				[
					24,
					-20
				],
				[
					10,
					-18
				]
			],
			[
				[
					9029,
					9533
				],
				[
					-22,
					-43
				],
				[
					-102,
					2
				],
				[
					-47,
					-14
				],
				[
					-55,
					38
				],
				[
					15,
					39
				],
				[
					37,
					11
				],
				[
					73,
					-2
				],
				[
					101,
					-31
				]
			],
			[
				[
					2263,
					9600
				],
				[
					21,
					-27
				],
				[
					1,
					-30
				],
				[
					-12,
					-42
				],
				[
					-46,
					-6
				],
				[
					-30,
					9
				],
				[
					1,
					34
				],
				[
					-46,
					-5
				],
				[
					-2,
					45
				],
				[
					30,
					-2
				],
				[
					42,
					19
				],
				[
					39,
					-3
				],
				[
					2,
					8
				]
			],
			[
				[
					1993,
					9570
				],
				[
					11,
					-21
				],
				[
					25,
					10
				],
				[
					29,
					-2
				],
				[
					5,
					-29
				],
				[
					-17,
					-27
				],
				[
					-94,
					-9
				],
				[
					-70,
					-25
				],
				[
					-42,
					-1
				],
				[
					-4,
					19
				],
				[
					58,
					25
				],
				[
					-126,
					-7
				],
				[
					-38,
					10
				],
				[
					37,
					57
				],
				[
					27,
					16
				],
				[
					78,
					-20
				],
				[
					49,
					-34
				],
				[
					49,
					-4
				],
				[
					-40,
					55
				],
				[
					25,
					21
				],
				[
					29,
					-7
				],
				[
					9,
					-27
				]
			],
			[
				[
					6597,
					9254
				],
				[
					-16,
					-5
				],
				[
					-91,
					8
				],
				[
					-7,
					25
				],
				[
					-51,
					16
				],
				[
					-4,
					31
				],
				[
					29,
					12
				],
				[
					-1,
					32
				],
				[
					55,
					49
				],
				[
					-26,
					7
				],
				[
					67,
					50
				],
				[
					-8,
					26
				],
				[
					62,
					31
				],
				[
					92,
					37
				],
				[
					92,
					11
				],
				[
					48,
					21
				],
				[
					54,
					7
				],
				[
					19,
					-22
				],
				[
					-18,
					-18
				],
				[
					-99,
					-29
				],
				[
					-85,
					-27
				],
				[
					-86,
					-55
				],
				[
					-41,
					-56
				],
				[
					-44,
					-56
				],
				[
					6,
					-48
				],
				[
					53,
					-47
				]
			],
			[
				[
					2369,
					9621
				],
				[
					31,
					-18
				],
				[
					55,
					0
				],
				[
					24,
					-19
				],
				[
					-7,
					-21
				],
				[
					32,
					-13
				],
				[
					18,
					-14
				],
				[
					37,
					-3
				],
				[
					41,
					-5
				],
				[
					44,
					13
				],
				[
					57,
					5
				],
				[
					45,
					-4
				],
				[
					29,
					-22
				],
				[
					7,
					-24
				],
				[
					-18,
					-15
				],
				[
					-41,
					-12
				],
				[
					-36,
					7
				],
				[
					-79,
					-9
				],
				[
					-57,
					-1
				],
				[
					-45,
					7
				],
				[
					-74,
					18
				],
				[
					-10,
					32
				],
				[
					-3,
					29
				],
				[
					-28,
					25
				],
				[
					-57,
					7
				],
				[
					-33,
					18
				],
				[
					11,
					23
				],
				[
					57,
					-4
				]
			],
			[
				[
					1772,
					9653
				],
				[
					-4,
					-44
				],
				[
					-22,
					-20
				],
				[
					-26,
					-3
				],
				[
					-51,
					-25
				],
				[
					-45,
					-8
				],
				[
					-37,
					12
				],
				[
					47,
					43
				],
				[
					57,
					37
				],
				[
					42,
					0
				],
				[
					39,
					8
				]
			],
			[
				[
					8162,
					9520
				],
				[
					-31,
					-17
				],
				[
					-73,
					-32
				],
				[
					-20,
					-18
				],
				[
					34,
					-8
				],
				[
					41,
					-14
				],
				[
					25,
					11
				],
				[
					14,
					-37
				],
				[
					12,
					15
				],
				[
					45,
					9
				],
				[
					89,
					-10
				],
				[
					7,
					-27
				],
				[
					116,
					-8
				],
				[
					1,
					44
				],
				[
					59,
					-10
				],
				[
					45,
					0
				],
				[
					45,
					-30
				],
				[
					12,
					-37
				],
				[
					-16,
					-24
				],
				[
					35,
					-46
				],
				[
					44,
					-23
				],
				[
					26,
					61
				],
				[
					45,
					-26
				],
				[
					47,
					15
				],
				[
					54,
					-18
				],
				[
					20,
					17
				],
				[
					46,
					-9
				],
				[
					-20,
					54
				],
				[
					37,
					25
				],
				[
					250,
					-38
				],
				[
					24,
					-34
				],
				[
					73,
					-44
				],
				[
					112,
					11
				],
				[
					55,
					-9
				],
				[
					23,
					-24
				],
				[
					-3,
					-42
				],
				[
					34,
					-17
				],
				[
					37,
					12
				],
				[
					50,
					2
				],
				[
					52,
					-12
				],
				[
					53,
					7
				],
				[
					48,
					-51
				],
				[
					34,
					18
				],
				[
					-22,
					37
				],
				[
					12,
					25
				],
				[
					89,
					-16
				],
				[
					58,
					4
				],
				[
					80,
					-28
				],
				[
					39,
					-25
				],
				[
					0,
					-229
				],
				[
					-1,
					-1
				],
				[
					-35,
					-25
				],
				[
					-36,
					4
				],
				[
					25,
					-30
				],
				[
					16,
					-48
				],
				[
					13,
					-15
				],
				[
					3,
					-24
				],
				[
					-7,
					-15
				],
				[
					-52,
					12
				],
				[
					-77,
					-43
				],
				[
					-25,
					-7
				],
				[
					-43,
					-40
				],
				[
					-40,
					-36
				],
				[
					-10,
					-26
				],
				[
					-40,
					40
				],
				[
					-72,
					-45
				],
				[
					-13,
					21
				],
				[
					-27,
					-25
				],
				[
					-37,
					8
				],
				[
					-9,
					-37
				],
				[
					-33,
					-56
				],
				[
					1,
					-23
				],
				[
					32,
					-13
				],
				[
					-4,
					-84
				],
				[
					-26,
					-2
				],
				[
					-12,
					-49
				],
				[
					12,
					-24
				],
				[
					-49,
					-30
				],
				[
					-9,
					-65
				],
				[
					-42,
					-15
				],
				[
					-8,
					-58
				],
				[
					-40,
					-54
				],
				[
					-10,
					40
				],
				[
					-12,
					84
				],
				[
					-16,
					128
				],
				[
					14,
					80
				],
				[
					23,
					34
				],
				[
					1,
					27
				],
				[
					44,
					13
				],
				[
					49,
					72
				],
				[
					48,
					60
				],
				[
					50,
					46
				],
				[
					22,
					81
				],
				[
					-33,
					-5
				],
				[
					-17,
					-47
				],
				[
					-71,
					-64
				],
				[
					-22,
					71
				],
				[
					-72,
					-19
				],
				[
					-70,
					-97
				],
				[
					23,
					-35
				],
				[
					-62,
					-15
				],
				[
					-43,
					-6
				],
				[
					2,
					41
				],
				[
					-43,
					9
				],
				[
					-34,
					-28
				],
				[
					-85,
					10
				],
				[
					-91,
					-17
				],
				[
					-90,
					-113
				],
				[
					-107,
					-136
				],
				[
					44,
					-7
				],
				[
					14,
					-36
				],
				[
					27,
					-13
				],
				[
					17,
					29
				],
				[
					31,
					-4
				],
				[
					40,
					-63
				],
				[
					1,
					-49
				],
				[
					-22,
					-58
				],
				[
					-2,
					-68
				],
				[
					-13,
					-92
				],
				[
					-42,
					-84
				],
				[
					-9,
					-39
				],
				[
					-38,
					-68
				],
				[
					-37,
					-66
				],
				[
					-18,
					-34
				],
				[
					-37,
					-34
				],
				[
					-18,
					-1
				],
				[
					-17,
					28
				],
				[
					-37,
					-42
				],
				[
					-5,
					-19
				]
			],
			[
				[
					8631,
					7613
				],
				[
					-10,
					4
				],
				[
					-12,
					-20
				],
				[
					-8,
					-20
				],
				[
					1,
					-41
				],
				[
					-15,
					-13
				],
				[
					-5,
					-10
				],
				[
					-10,
					-17
				],
				[
					-19,
					-9
				],
				[
					-12,
					-16
				],
				[
					-1,
					-25
				],
				[
					-3,
					-6
				],
				[
					11,
					-9
				],
				[
					16,
					-26
				]
			],
			[
				[
					8564,
					7405
				],
				[
					24,
					-68
				],
				[
					7,
					-37
				],
				[
					0,
					-66
				],
				[
					-10,
					-32
				],
				[
					-26,
					-11
				],
				[
					-22,
					-24
				],
				[
					-25,
					-5
				],
				[
					-3,
					32
				],
				[
					5,
					43
				],
				[
					-12,
					60
				],
				[
					21,
					9
				],
				[
					-19,
					50
				]
			],
			[
				[
					8504,
					7356
				],
				[
					-14,
					11
				],
				[
					-3,
					-11
				],
				[
					-8,
					-5
				],
				[
					-1,
					11
				],
				[
					-8,
					5
				],
				[
					-7,
					9
				],
				[
					7,
					26
				],
				[
					7,
					6
				],
				[
					-2,
					11
				],
				[
					7,
					31
				],
				[
					-2,
					9
				],
				[
					-16,
					7
				],
				[
					-14,
					15
				]
			],
			[
				[
					8450,
					7481
				],
				[
					-38,
					-17
				],
				[
					-21,
					-26
				],
				[
					-30,
					-16
				],
				[
					15,
					26
				],
				[
					-6,
					23
				],
				[
					22,
					39
				],
				[
					-14,
					30
				],
				[
					-25,
					-21
				],
				[
					-31,
					-40
				],
				[
					-17,
					-37
				],
				[
					-27,
					-3
				],
				[
					-15,
					-26
				],
				[
					15,
					-39
				],
				[
					23,
					-10
				],
				[
					1,
					-26
				],
				[
					22,
					-16
				],
				[
					31,
					41
				],
				[
					25,
					-23
				],
				[
					17,
					-1
				],
				[
					5,
					-30
				],
				[
					-39,
					-17
				],
				[
					-13,
					-31
				],
				[
					-27,
					-29
				],
				[
					-15,
					-40
				],
				[
					30,
					-31
				],
				[
					11,
					-57
				],
				[
					17,
					-53
				],
				[
					19,
					-44
				],
				[
					0,
					-43
				],
				[
					-18,
					-16
				],
				[
					7,
					-30
				],
				[
					16,
					-18
				],
				[
					-4,
					-47
				],
				[
					-7,
					-46
				],
				[
					-16,
					-5
				],
				[
					-20,
					-62
				],
				[
					-23,
					-76
				],
				[
					-25,
					-69
				],
				[
					-39,
					-53
				],
				[
					-38,
					-48
				],
				[
					-31,
					-7
				],
				[
					-17,
					-25
				],
				[
					-10,
					18
				],
				[
					-16,
					-28
				],
				[
					-39,
					-29
				],
				[
					-29,
					-9
				],
				[
					-9,
					-61
				],
				[
					-16,
					-3
				],
				[
					-7,
					42
				],
				[
					6,
					22
				],
				[
					-37,
					18
				],
				[
					-13,
					-9
				]
			],
			[
				[
					8000,
					6423
				],
				[
					-37,
					-49
				],
				[
					-23,
					-55
				],
				[
					-6,
					-40
				],
				[
					21,
					-60
				],
				[
					26,
					-76
				],
				[
					25,
					-35
				],
				[
					17,
					-46
				],
				[
					13,
					-107
				],
				[
					-4,
					-101
				],
				[
					-23,
					-38
				],
				[
					-32,
					-37
				],
				[
					-23,
					-48
				],
				[
					-34,
					-54
				],
				[
					-10,
					37
				],
				[
					7,
					39
				],
				[
					-20,
					33
				]
			],
			[
				[
					7897,
					5786
				],
				[
					-23,
					8
				],
				[
					-12,
					30
				],
				[
					-14,
					60
				]
			],
			[
				[
					7848,
					5884
				],
				[
					-25,
					26
				],
				[
					-23,
					-1
				],
				[
					4,
					45
				],
				[
					-25,
					0
				],
				[
					-2,
					-63
				],
				[
					-15,
					-84
				],
				[
					-9,
					-51
				],
				[
					2,
					-42
				],
				[
					18,
					-2
				],
				[
					11,
					-52
				],
				[
					5,
					-50
				],
				[
					16,
					-33
				],
				[
					17,
					-7
				],
				[
					14,
					-30
				]
			],
			[
				[
					7836,
					5540
				],
				[
					6,
					-5
				],
				[
					17,
					-35
				],
				[
					11,
					-38
				],
				[
					2,
					-39
				],
				[
					-3,
					-26
				],
				[
					3,
					-20
				],
				[
					2,
					-34
				],
				[
					10,
					-16
				],
				[
					10,
					-51
				],
				[
					0,
					-20
				],
				[
					-20,
					-3
				],
				[
					-26,
					42
				],
				[
					-33,
					46
				],
				[
					-3,
					29
				],
				[
					-16,
					39
				],
				[
					-4,
					47
				],
				[
					-10,
					32
				],
				[
					3,
					42
				],
				[
					-6,
					24
				]
			],
			[
				[
					7779,
					5554
				],
				[
					-11,
					22
				],
				[
					-5,
					29
				],
				[
					-15,
					32
				],
				[
					-13,
					28
				],
				[
					-5,
					-34
				],
				[
					-5,
					32
				],
				[
					3,
					36
				],
				[
					8,
					55
				]
			],
			[
				[
					7736,
					5754
				],
				[
					-2,
					43
				],
				[
					8,
					44
				],
				[
					-9,
					34
				],
				[
					2,
					63
				],
				[
					-11,
					29
				],
				[
					-9,
					69
				],
				[
					-5,
					73
				],
				[
					-12,
					48
				],
				[
					-19,
					-29
				],
				[
					-31,
					-41
				],
				[
					-16,
					5
				],
				[
					-17,
					13
				],
				[
					10,
					72
				],
				[
					-6,
					54
				],
				[
					-22,
					66
				],
				[
					3,
					21
				],
				[
					-16,
					7
				],
				[
					-19,
					47
				]
			],
			[
				[
					7565,
					6372
				],
				[
					-8,
					30
				],
				[
					-2,
					30
				],
				[
					-5,
					27
				],
				[
					-12,
					34
				],
				[
					-25,
					2
				],
				[
					2,
					-24
				],
				[
					-9,
					-32
				],
				[
					-11,
					12
				],
				[
					-5,
					-10
				],
				[
					-7,
					6
				],
				[
					-11,
					5
				]
			],
			[
				[
					7472,
					6452
				],
				[
					-4,
					-21
				],
				[
					-19,
					1
				],
				[
					-34,
					-12
				],
				[
					1,
					-44
				],
				[
					-14,
					-34
				],
				[
					-40,
					-38
				],
				[
					-32,
					-68
				],
				[
					-20,
					-36
				],
				[
					-28,
					-38
				],
				[
					0,
					-27
				],
				[
					-14,
					-14
				],
				[
					-25,
					-20
				],
				[
					-13,
					-4
				],
				[
					-8,
					-43
				],
				[
					5,
					-75
				],
				[
					2,
					-48
				],
				[
					-12,
					-55
				],
				[
					0,
					-98
				],
				[
					-14,
					-2
				],
				[
					-13,
					-44
				],
				[
					8,
					-19
				],
				[
					-25,
					-17
				],
				[
					-9,
					-39
				],
				[
					-11,
					-16
				],
				[
					-27,
					53
				],
				[
					-12,
					81
				],
				[
					-11,
					58
				],
				[
					-10,
					27
				],
				[
					-15,
					56
				],
				[
					-7,
					72
				],
				[
					-4,
					36
				],
				[
					-26,
					79
				],
				[
					-11,
					111
				],
				[
					-8,
					74
				],
				[
					0,
					70
				],
				[
					-6,
					54
				],
				[
					-40,
					-35
				],
				[
					-20,
					7
				],
				[
					-36,
					70
				],
				[
					13,
					21
				],
				[
					-8,
					22
				],
				[
					-32,
					49
				]
			],
			[
				[
					6893,
					6546
				],
				[
					-21,
					15
				],
				[
					-8,
					41
				],
				[
					-21,
					44
				],
				[
					-52,
					-11
				],
				[
					-45,
					-1
				],
				[
					-39,
					-8
				]
			],
			[
				[
					6707,
					6626
				],
				[
					-52,
					17
				],
				[
					-30,
					14
				],
				[
					-32,
					7
				],
				[
					-12,
					71
				],
				[
					-13,
					10
				],
				[
					-21,
					-10
				],
				[
					-28,
					-28
				],
				[
					-34,
					19
				],
				[
					-28,
					44
				],
				[
					-27,
					17
				],
				[
					-19,
					54
				],
				[
					-20,
					77
				],
				[
					-15,
					-9
				],
				[
					-18,
					19
				],
				[
					-10,
					-23
				]
			],
			[
				[
					6348,
					6905
				],
				[
					-17,
					3
				]
			],
			[
				[
					6331,
					6908
				],
				[
					6,
					-25
				],
				[
					-2,
					-13
				],
				[
					9,
					-44
				]
			],
			[
				[
					6344,
					6826
				],
				[
					11,
					-50
				],
				[
					13,
					-13
				],
				[
					5,
					-20
				],
				[
					19,
					-24
				],
				[
					2,
					-24
				],
				[
					-3,
					-19
				],
				[
					3,
					-19
				],
				[
					8,
					-17
				],
				[
					4,
					-18
				],
				[
					4,
					-15
				]
			],
			[
				[
					6410,
					6607
				],
				[
					-2,
					42
				],
				[
					8,
					31
				],
				[
					7,
					6
				],
				[
					9,
					-18
				],
				[
					0,
					-34
				],
				[
					-6,
					-34
				]
			],
			[
				[
					6426,
					6600
				],
				[
					6,
					-22
				]
			],
			[
				[
					6432,
					6578
				],
				[
					5,
					3
				],
				[
					1,
					-16
				],
				[
					21,
					9
				],
				[
					23,
					-1
				],
				[
					17,
					-2
				],
				[
					19,
					39
				],
				[
					21,
					37
				],
				[
					17,
					35
				]
			],
			[
				[
					6556,
					6682
				],
				[
					8,
					20
				],
				[
					4,
					-5
				],
				[
					-3,
					-24
				],
				[
					-3,
					-10
				]
			],
			[
				[
					6562,
					6663
				],
				[
					3,
					-46
				]
			],
			[
				[
					6565,
					6617
				],
				[
					13,
					-39
				],
				[
					15,
					-21
				],
				[
					21,
					-8
				],
				[
					16,
					-10
				],
				[
					13,
					-33
				],
				[
					7,
					-19
				],
				[
					10,
					-7
				],
				[
					0,
					-13
				],
				[
					-10,
					-35
				],
				[
					-4,
					-16
				],
				[
					-12,
					-18
				],
				[
					-10,
					-40
				],
				[
					-13,
					3
				],
				[
					-6,
					-13
				],
				[
					-4,
					-30
				],
				[
					3,
					-38
				],
				[
					-3,
					-7
				],
				[
					-12,
					0
				],
				[
					-18,
					-21
				],
				[
					-2,
					-29
				],
				[
					-7,
					-12
				],
				[
					-17,
					1
				],
				[
					-11,
					-15
				],
				[
					0,
					-23
				],
				[
					-13,
					-16
				],
				[
					-16,
					5
				],
				[
					-18,
					-19
				],
				[
					-13,
					-3
				]
			],
			[
				[
					6474,
					6141
				],
				[
					-20,
					-16
				],
				[
					-5,
					-25
				],
				[
					-1,
					-20
				],
				[
					-28,
					-24
				],
				[
					-44,
					-27
				],
				[
					-25,
					-41
				],
				[
					-12,
					-3
				],
				[
					-8,
					4
				],
				[
					-17,
					-24
				],
				[
					-17,
					-11
				],
				[
					-24,
					-3
				],
				[
					-7,
					-4
				],
				[
					-6,
					-15
				],
				[
					-7,
					-4
				],
				[
					-4,
					-15
				],
				[
					-14,
					2
				],
				[
					-9,
					-8
				],
				[
					-19,
					3
				],
				[
					-7,
					33
				],
				[
					0,
					32
				],
				[
					-4,
					17
				],
				[
					-6,
					42
				],
				[
					-8,
					24
				],
				[
					6,
					3
				],
				[
					-3,
					26
				],
				[
					3,
					11
				],
				[
					-1,
					25
				]
			],
			[
				[
					6187,
					6123
				],
				[
					-3,
					25
				],
				[
					-9,
					17
				],
				[
					-2,
					23
				],
				[
					-14,
					21
				],
				[
					-15,
					48
				],
				[
					-8,
					47
				],
				[
					-19,
					40
				],
				[
					-13,
					9
				],
				[
					-18,
					55
				],
				[
					-3,
					40
				],
				[
					1,
					34
				],
				[
					-16,
					64
				],
				[
					-13,
					22
				],
				[
					-15,
					12
				],
				[
					-9,
					33
				],
				[
					1,
					13
				],
				[
					-7,
					30
				],
				[
					-8,
					13
				],
				[
					-11,
					43
				],
				[
					-17,
					46
				],
				[
					-14,
					40
				],
				[
					-14,
					0
				],
				[
					4,
					31
				],
				[
					1,
					20
				],
				[
					4,
					23
				]
			],
			[
				[
					5970,
					6872
				],
				[
					-1,
					9
				]
			],
			[
				[
					5969,
					6881
				],
				[
					-8,
					-23
				],
				[
					-6,
					-44
				],
				[
					-7,
					-30
				],
				[
					-7,
					-10
				],
				[
					-9,
					19
				],
				[
					-13,
					25
				],
				[
					-19,
					83
				],
				[
					-3,
					-5
				],
				[
					11,
					-61
				],
				[
					17,
					-58
				],
				[
					21,
					-90
				],
				[
					11,
					-31
				],
				[
					8,
					-33
				],
				[
					25,
					-63
				],
				[
					-5,
					-10
				],
				[
					1,
					-38
				],
				[
					32,
					-51
				],
				[
					5,
					-12
				]
			],
			[
				[
					6023,
					6449
				],
				[
					9,
					-57
				],
				[
					-6,
					-10
				],
				[
					4,
					-59
				],
				[
					10,
					-69
				],
				[
					11,
					-14
				],
				[
					15,
					-22
				]
			],
			[
				[
					6066,
					6218
				],
				[
					16,
					-66
				],
				[
					8,
					-53
				],
				[
					15,
					-28
				],
				[
					38,
					-55
				],
				[
					15,
					-32
				],
				[
					15,
					-34
				],
				[
					9,
					-19
				],
				[
					14,
					-18
				]
			],
			[
				[
					6196,
					5913
				],
				[
					6,
					-18
				],
				[
					-1,
					-23
				],
				[
					-16,
					-14
				],
				[
					12,
					-16
				]
			],
			[
				[
					6197,
					5842
				],
				[
					9,
					-11
				],
				[
					6,
					-23
				],
				[
					12,
					-25
				],
				[
					14,
					0
				],
				[
					26,
					15
				],
				[
					31,
					7
				],
				[
					24,
					18
				],
				[
					14,
					3
				],
				[
					10,
					11
				],
				[
					16,
					2
				]
			],
			[
				[
					6359,
					5839
				],
				[
					8,
					1
				],
				[
					13,
					9
				],
				[
					15,
					6
				],
				[
					13,
					19
				],
				[
					11,
					0
				],
				[
					0,
					-16
				],
				[
					-2,
					-33
				],
				[
					0,
					-30
				],
				[
					-6,
					-21
				],
				[
					-8,
					-62
				],
				[
					-13,
					-65
				],
				[
					-17,
					-73
				],
				[
					-24,
					-85
				],
				[
					-24,
					-64
				],
				[
					-33,
					-79
				],
				[
					-27,
					-46
				],
				[
					-42,
					-57
				],
				[
					-26,
					-44
				],
				[
					-30,
					-70
				],
				[
					-7,
					-30
				],
				[
					-6,
					-14
				]
			],
			[
				[
					6154,
					5085
				],
				[
					-19,
					-23
				],
				[
					-7,
					-24
				],
				[
					-11,
					-4
				],
				[
					-4,
					-41
				],
				[
					-9,
					-23
				],
				[
					-5,
					-38
				],
				[
					-11,
					-19
				]
			],
			[
				[
					6088,
					4913
				],
				[
					-13,
					-71
				],
				[
					2,
					-33
				],
				[
					17,
					-21
				],
				[
					1,
					-15
				],
				[
					-7,
					-35
				],
				[
					1,
					-17
				],
				[
					-2,
					-28
				],
				[
					10,
					-36
				],
				[
					12,
					-57
				],
				[
					10,
					-12
				]
			],
			[
				[
					6119,
					4588
				],
				[
					4,
					-26
				],
				[
					-1,
					-57
				],
				[
					4,
					-51
				],
				[
					1,
					-90
				],
				[
					5,
					-28
				],
				[
					-9,
					-41
				],
				[
					-11,
					-40
				],
				[
					-17,
					-36
				],
				[
					-26,
					-22
				],
				[
					-31,
					-28
				],
				[
					-31,
					-62
				],
				[
					-11,
					-10
				],
				[
					-19,
					-41
				],
				[
					-12,
					-13
				],
				[
					-2,
					-41
				],
				[
					13,
					-44
				],
				[
					5,
					-34
				],
				[
					1,
					-17
				],
				[
					5,
					3
				],
				[
					-1,
					-57
				],
				[
					-5,
					-26
				],
				[
					7,
					-10
				],
				[
					-4,
					-24
				],
				[
					-12,
					-21
				],
				[
					-23,
					-19
				],
				[
					-33,
					-31
				],
				[
					-12,
					-21
				],
				[
					2,
					-25
				],
				[
					7,
					-4
				],
				[
					-2,
					-30
				]
			],
			[
				[
					5911,
					3642
				],
				[
					-7,
					-42
				],
				[
					-3,
					-48
				],
				[
					-8,
					-26
				],
				[
					-19,
					-29
				],
				[
					-5,
					-8
				],
				[
					-12,
					-29
				],
				[
					-7,
					-30
				],
				[
					-16,
					-41
				],
				[
					-32,
					-60
				],
				[
					-19,
					-34
				],
				[
					-21,
					-26
				],
				[
					-29,
					-23
				],
				[
					-14,
					-3
				],
				[
					-4,
					-16
				],
				[
					-17,
					9
				],
				[
					-14,
					-11
				],
				[
					-30,
					11
				],
				[
					-17,
					-7
				],
				[
					-11,
					3
				],
				[
					-29,
					-23
				],
				[
					-23,
					-9
				],
				[
					-18,
					-22
				],
				[
					-12,
					-1
				],
				[
					-12,
					21
				],
				[
					-9,
					1
				],
				[
					-12,
					25
				],
				[
					-2,
					-8
				],
				[
					-3,
					16
				],
				[
					0,
					34
				],
				[
					-9,
					38
				],
				[
					9,
					11
				],
				[
					-1,
					44
				],
				[
					-18,
					54
				],
				[
					-14,
					48
				],
				[
					0,
					1
				],
				[
					-20,
					74
				]
			],
			[
				[
					5453,
					3536
				],
				[
					-21,
					44
				],
				[
					-11,
					42
				],
				[
					-6,
					56
				],
				[
					-7,
					42
				],
				[
					-9,
					88
				],
				[
					0,
					69
				],
				[
					-4,
					32
				],
				[
					-11,
					23
				],
				[
					-14,
					48
				],
				[
					-15,
					69
				],
				[
					-6,
					36
				],
				[
					-22,
					56
				],
				[
					-2,
					45
				]
			],
			[
				[
					5325,
					4186
				],
				[
					-3,
					36
				],
				[
					4,
					51
				],
				[
					10,
					52
				],
				[
					1,
					25
				],
				[
					9,
					52
				],
				[
					7,
					23
				],
				[
					16,
					38
				],
				[
					9,
					26
				],
				[
					3,
					42
				],
				[
					-2,
					33
				],
				[
					-8,
					21
				],
				[
					-8,
					35
				],
				[
					-6,
					34
				],
				[
					1,
					12
				],
				[
					9,
					23
				],
				[
					-9,
					56
				],
				[
					-5,
					38
				],
				[
					-14,
					37
				],
				[
					2,
					11
				]
			],
			[
				[
					5341,
					4831
				],
				[
					-4,
					18
				]
			],
			[
				[
					5337,
					4849
				],
				[
					-7,
					43
				]
			],
			[
				[
					5330,
					4892
				],
				[
					-23,
					61
				]
			],
			[
				[
					5307,
					4953
				],
				[
					-28,
					58
				],
				[
					-19,
					47
				],
				[
					-17,
					60
				],
				[
					1,
					19
				],
				[
					6,
					19
				],
				[
					7,
					41
				],
				[
					6,
					43
				]
			],
			[
				[
					5263,
					5240
				],
				[
					-6,
					9
				],
				[
					10,
					64
				]
			],
			[
				[
					5267,
					5313
				],
				[
					4,
					46
				],
				[
					-11,
					38
				],
				[
					-12,
					10
				],
				[
					-6,
					26
				],
				[
					-7,
					8
				],
				[
					0,
					16
				]
			],
			[
				[
					5235,
					5457
				],
				[
					-29,
					-21
				],
				[
					-10,
					3
				],
				[
					-11,
					-13
				],
				[
					-22,
					1
				],
				[
					-15,
					36
				],
				[
					-9,
					42
				],
				[
					-20,
					38
				],
				[
					-21,
					-1
				],
				[
					-24,
					0
				]
			],
			[
				[
					5074,
					5542
				],
				[
					-23,
					-6
				]
			],
			[
				[
					5051,
					5536
				],
				[
					-23,
					-13
				]
			],
			[
				[
					5028,
					5523
				],
				[
					-43,
					-33
				],
				[
					-16,
					-20
				],
				[
					-25,
					-17
				],
				[
					-24,
					17
				]
			],
			[
				[
					4920,
					5470
				],
				[
					-13,
					-1
				],
				[
					-19,
					11
				],
				[
					-18,
					0
				],
				[
					-33,
					-10
				],
				[
					-19,
					-17
				],
				[
					-28,
					-21
				],
				[
					-5,
					1
				]
			],
			[
				[
					4785,
					5433
				],
				[
					-7,
					0
				],
				[
					-29,
					27
				],
				[
					-25,
					44
				],
				[
					-24,
					32
				],
				[
					-19,
					37
				]
			],
			[
				[
					4681,
					5573
				],
				[
					-7,
					4
				],
				[
					-20,
					23
				],
				[
					-15,
					31
				],
				[
					-5,
					21
				],
				[
					-3,
					43
				]
			],
			[
				[
					4631,
					5695
				],
				[
					-12,
					34
				],
				[
					-11,
					22
				],
				[
					-7,
					8
				],
				[
					-7,
					11
				],
				[
					-3,
					26
				],
				[
					-4,
					12
				],
				[
					-8,
					10
				]
			],
			[
				[
					4579,
					5818
				],
				[
					-15,
					24
				],
				[
					-12,
					4
				],
				[
					-6,
					16
				],
				[
					0,
					9
				],
				[
					-8,
					12
				],
				[
					-2,
					12
				]
			],
			[
				[
					4536,
					5895
				],
				[
					-5,
					44
				]
			],
			[
				[
					4531,
					5939
				],
				[
					4,
					26
				]
			],
			[
				[
					4535,
					5965
				],
				[
					-12,
					45
				],
				[
					-14,
					20
				],
				[
					13,
					11
				],
				[
					13,
					40
				],
				[
					7,
					30
				]
			],
			[
				[
					4542,
					6111
				],
				[
					-3,
					31
				],
				[
					8,
					28
				],
				[
					4,
					55
				],
				[
					-4,
					57
				],
				[
					-3,
					28
				],
				[
					3,
					29
				],
				[
					-7,
					27
				],
				[
					-15,
					25
				]
			],
			[
				[
					4525,
					6391
				],
				[
					1,
					25
				]
			],
			[
				[
					4526,
					6416
				],
				[
					2,
					26
				],
				[
					10,
					16
				],
				[
					9,
					30
				],
				[
					-1,
					19
				],
				[
					9,
					41
				],
				[
					16,
					37
				],
				[
					9,
					9
				],
				[
					7,
					34
				],
				[
					1,
					30
				],
				[
					10,
					36
				],
				[
					18,
					21
				],
				[
					18,
					59
				],
				[
					15,
					22
				],
				[
					25,
					7
				],
				[
					22,
					39
				],
				[
					14,
					16
				],
				[
					23,
					48
				],
				[
					-7,
					71
				],
				[
					11,
					50
				],
				[
					4,
					30
				],
				[
					18,
					39
				],
				[
					27,
					26
				],
				[
					21,
					24
				],
				[
					19,
					60
				],
				[
					8,
					35
				],
				[
					21,
					0
				],
				[
					16,
					-25
				],
				[
					27,
					4
				],
				[
					29,
					-12
				],
				[
					12,
					-1
				]
			],
			[
				[
					4939,
					7207
				],
				[
					26,
					32
				],
				[
					30,
					10
				],
				[
					18,
					23
				],
				[
					27,
					18
				],
				[
					47,
					10
				],
				[
					46,
					5
				],
				[
					14,
					-9
				],
				[
					26,
					23
				],
				[
					30,
					0
				],
				[
					11,
					-13
				],
				[
					19,
					3
				]
			],
			[
				[
					5233,
					7309
				],
				[
					30,
					24
				],
				[
					20,
					-7
				],
				[
					-1,
					-29
				],
				[
					23,
					21
				],
				[
					2,
					-11
				],
				[
					-14,
					-28
				],
				[
					0,
					-27
				],
				[
					10,
					-14
				],
				[
					-4,
					-50
				],
				[
					-18,
					-29
				],
				[
					5,
					-32
				],
				[
					15,
					-1
				],
				[
					7,
					-27
				],
				[
					10,
					-9
				]
			],
			[
				[
					5318,
					7090
				],
				[
					33,
					-20
				],
				[
					11,
					5
				],
				[
					24,
					-9
				],
				[
					36,
					-26
				],
				[
					13,
					-51
				],
				[
					25,
					-11
				],
				[
					40,
					-25
				],
				[
					29,
					-28
				],
				[
					14,
					15
				],
				[
					13,
					26
				],
				[
					-6,
					44
				],
				[
					8,
					28
				],
				[
					20,
					27
				],
				[
					19,
					8
				],
				[
					38,
					-12
				],
				[
					9,
					-25
				],
				[
					11,
					-1
				],
				[
					9,
					-9
				],
				[
					27,
					-7
				],
				[
					7,
					-19
				]
			],
			[
				[
					5698,
					7000
				],
				[
					37,
					1
				],
				[
					27,
					-15
				],
				[
					27,
					-17
				],
				[
					13,
					-9
				],
				[
					21,
					18
				],
				[
					12,
					16
				],
				[
					24,
					5
				],
				[
					20,
					-7
				],
				[
					8,
					-29
				],
				[
					6,
					19
				],
				[
					22,
					-14
				],
				[
					22,
					-3
				],
				[
					14,
					15
				]
			],
			[
				[
					5951,
					6980
				],
				[
					8,
					19
				],
				[
					-2,
					3
				],
				[
					7,
					27
				],
				[
					6,
					43
				],
				[
					4,
					15
				],
				[
					1,
					0
				]
			],
			[
				[
					5975,
					7087
				],
				[
					10,
					47
				],
				[
					13,
					41
				],
				[
					1,
					2
				]
			],
			[
				[
					5999,
					7177
				],
				[
					-3,
					44
				],
				[
					7,
					24
				]
			],
			[
				[
					6003,
					7245
				],
				[
					-10,
					26
				],
				[
					10,
					21
				],
				[
					-17,
					-4
				],
				[
					-23,
					13
				],
				[
					-19,
					-33
				],
				[
					-42,
					-7
				],
				[
					-23,
					31
				],
				[
					-29,
					2
				],
				[
					-7,
					-24
				],
				[
					-19,
					-7
				],
				[
					-27,
					31
				],
				[
					-30,
					-1
				],
				[
					-17,
					57
				],
				[
					-20,
					32
				],
				[
					14,
					45
				],
				[
					-18,
					27
				],
				[
					31,
					55
				],
				[
					42,
					3
				],
				[
					12,
					44
				],
				[
					53,
					-8
				],
				[
					33,
					37
				],
				[
					33,
					17
				],
				[
					46,
					1
				],
				[
					48,
					-41
				],
				[
					40,
					-22
				],
				[
					32,
					9
				],
				[
					24,
					-5
				],
				[
					33,
					30
				]
			],
			[
				[
					6153,
					7574
				],
				[
					4,
					24
				],
				[
					-7,
					40
				],
				[
					-16,
					21
				],
				[
					-15,
					6
				],
				[
					-10,
					18
				]
			],
			[
				[
					6109,
					7683
				],
				[
					-36,
					49
				],
				[
					-31,
					21
				],
				[
					-24,
					34
				],
				[
					20,
					9
				],
				[
					23,
					49
				],
				[
					-16,
					22
				],
				[
					41,
					24
				],
				[
					0,
					13
				],
				[
					-25,
					-10
				]
			],
			[
				[
					6061,
					7894
				],
				[
					-23,
					-4
				],
				[
					-18,
					-19
				],
				[
					-26,
					-3
				],
				[
					-24,
					-21
				],
				[
					2,
					-36
				],
				[
					13,
					-14
				],
				[
					29,
					3
				],
				[
					-6,
					-20
				],
				[
					-30,
					-10
				],
				[
					-38,
					-34
				],
				[
					-15,
					12
				],
				[
					6,
					27
				],
				[
					-31,
					17
				],
				[
					5,
					11
				],
				[
					27,
					19
				],
				[
					-8,
					13
				],
				[
					-43,
					15
				],
				[
					-2,
					21
				],
				[
					-26,
					-7
				],
				[
					-10,
					-31
				],
				[
					-22,
					-43
				]
			],
			[
				[
					5821,
					7790
				],
				[
					1,
					-15
				],
				[
					-14,
					-12
				],
				[
					-8,
					5
				],
				[
					-8,
					-69
				]
			],
			[
				[
					5792,
					7699
				],
				[
					-14,
					-24
				],
				[
					-10,
					-41
				],
				[
					9,
					-33
				]
			],
			[
				[
					5777,
					7601
				],
				[
					3,
					-22
				],
				[
					24,
					-19
				],
				[
					-5,
					-14
				],
				[
					-33,
					-3
				],
				[
					-12,
					-18
				],
				[
					-23,
					-31
				],
				[
					-9,
					27
				],
				[
					1,
					12
				]
			],
			[
				[
					5723,
					7533
				],
				[
					-17,
					1
				],
				[
					-15,
					6
				],
				[
					-33,
					-15
				],
				[
					19,
					-33
				],
				[
					-14,
					-9
				],
				[
					-16,
					0
				],
				[
					-14,
					30
				],
				[
					-6,
					-13
				],
				[
					7,
					-34
				],
				[
					14,
					-27
				],
				[
					-11,
					-13
				],
				[
					16,
					-27
				],
				[
					13,
					-16
				],
				[
					1,
					-33
				],
				[
					-26,
					16
				],
				[
					8,
					-30
				],
				[
					-17,
					-6
				],
				[
					10,
					-51
				],
				[
					-18,
					0
				],
				[
					-23,
					25
				],
				[
					-11,
					46
				],
				[
					-4,
					38
				],
				[
					-11,
					26
				],
				[
					-14,
					33
				],
				[
					-2,
					17
				]
			],
			[
				[
					5559,
					7464
				],
				[
					-5,
					4
				],
				[
					-1,
					12
				],
				[
					-15,
					20
				],
				[
					-2,
					27
				],
				[
					2,
					39
				],
				[
					4,
					18
				],
				[
					-5,
					9
				]
			],
			[
				[
					5537,
					7593
				],
				[
					-6,
					5
				],
				[
					-8,
					19
				],
				[
					-12,
					11
				]
			],
			[
				[
					5511,
					7628
				],
				[
					-26,
					21
				],
				[
					-16,
					21
				],
				[
					-25,
					17
				],
				[
					-24,
					43
				],
				[
					6,
					4
				],
				[
					-13,
					24
				],
				[
					0,
					20
				],
				[
					-18,
					9
				],
				[
					-8,
					-25
				],
				[
					-9,
					19
				],
				[
					1,
					20
				],
				[
					1,
					1
				]
			],
			[
				[
					5380,
					7802
				],
				[
					6,
					5
				]
			],
			[
				[
					5386,
					7807
				],
				[
					-22,
					9
				],
				[
					-23,
					-21
				],
				[
					2,
					-28
				],
				[
					-3,
					-17
				],
				[
					9,
					-29
				],
				[
					26,
					-29
				],
				[
					14,
					-48
				],
				[
					31,
					-46
				],
				[
					21,
					0
				],
				[
					7,
					-13
				],
				[
					-8,
					-11
				],
				[
					25,
					-21
				],
				[
					21,
					-17
				],
				[
					23,
					-30
				],
				[
					3,
					-11
				],
				[
					-5,
					-21
				],
				[
					-15,
					27
				],
				[
					-24,
					10
				],
				[
					-12,
					-37
				],
				[
					20,
					-22
				],
				[
					-3,
					-30
				],
				[
					-12,
					-3
				],
				[
					-15,
					-50
				],
				[
					-11,
					-4
				],
				[
					0,
					17
				],
				[
					5,
					31
				],
				[
					6,
					13
				],
				[
					-10,
					33
				],
				[
					-9,
					29
				],
				[
					-11,
					7
				],
				[
					-9,
					25
				],
				[
					-17,
					11
				],
				[
					-12,
					23
				],
				[
					-21,
					3
				],
				[
					-22,
					26
				],
				[
					-25,
					38
				],
				[
					-19,
					33
				],
				[
					-9,
					57
				],
				[
					-14,
					7
				],
				[
					-22,
					19
				],
				[
					-13,
					-8
				],
				[
					-16,
					-27
				],
				[
					-11,
					-4
				]
			],
			[
				[
					5206,
					7698
				],
				[
					-26,
					-33
				],
				[
					-54,
					16
				],
				[
					-41,
					-19
				],
				[
					-3,
					-34
				]
			],
			[
				[
					5082,
					7628
				],
				[
					1,
					-34
				],
				[
					-26,
					-38
				],
				[
					-35,
					-12
				],
				[
					-3,
					-20
				],
				[
					-17,
					-32
				],
				[
					-11,
					-46
				],
				[
					11,
					-33
				],
				[
					-16,
					-26
				],
				[
					-6,
					-37
				],
				[
					-21,
					-12
				],
				[
					-20,
					-44
				],
				[
					-35,
					-1
				],
				[
					-26,
					1
				],
				[
					-18,
					-20
				],
				[
					-10,
					-22
				],
				[
					-14,
					5
				],
				[
					-10,
					19
				],
				[
					-8,
					33
				],
				[
					-26,
					9
				]
			],
			[
				[
					4792,
					7318
				],
				[
					-11,
					-15
				],
				[
					-15,
					8
				],
				[
					-14,
					-6
				],
				[
					4,
					45
				],
				[
					-3,
					35
				],
				[
					-12,
					6
				],
				[
					-7,
					22
				],
				[
					3,
					37
				],
				[
					11,
					21
				],
				[
					2,
					23
				],
				[
					5,
					35
				],
				[
					0,
					24
				],
				[
					-6,
					21
				],
				[
					-1,
					20
				]
			],
			[
				[
					4748,
					7594
				],
				[
					1,
					41
				],
				[
					-11,
					25
				],
				[
					39,
					41
				],
				[
					34,
					-10
				],
				[
					38,
					0
				],
				[
					29,
					-10
				],
				[
					23,
					3
				],
				[
					45,
					-2
				]
			],
			[
				[
					4946,
					7682
				],
				[
					15,
					35
				],
				[
					5,
					115
				],
				[
					-29,
					60
				],
				[
					-20,
					29
				],
				[
					-43,
					22
				],
				[
					-3,
					42
				],
				[
					36,
					13
				],
				[
					47,
					-15
				],
				[
					-9,
					65
				],
				[
					27,
					-24
				],
				[
					64,
					44
				],
				[
					9,
					48
				],
				[
					24,
					11
				]
			],
			[
				[
					5069,
					8127
				],
				[
					22,
					12
				]
			],
			[
				[
					5091,
					8139
				],
				[
					14,
					15
				],
				[
					25,
					85
				],
				[
					38,
					24
				],
				[
					23,
					-1
				]
			],
			[
				[
					5191,
					8262
				],
				[
					5,
					12
				],
				[
					23,
					3
				],
				[
					6,
					-13
				],
				[
					18,
					29
				],
				[
					-6,
					21
				],
				[
					-1,
					33
				]
			],
			[
				[
					5236,
					8347
				],
				[
					-11,
					32
				],
				[
					-1,
					59
				],
				[
					4,
					15
				],
				[
					8,
					18
				],
				[
					25,
					3
				],
				[
					10,
					16
				],
				[
					22,
					16
				],
				[
					-1,
					-29
				],
				[
					-8,
					-19
				],
				[
					3,
					-16
				],
				[
					15,
					-9
				],
				[
					-7,
					-22
				],
				[
					-8,
					7
				],
				[
					-20,
					-42
				],
				[
					8,
					-28
				]
			],
			[
				[
					5275,
					8348
				],
				[
					0,
					-22
				],
				[
					28,
					-14
				],
				[
					0,
					-20
				],
				[
					28,
					11
				],
				[
					16,
					16
				],
				[
					31,
					-23
				],
				[
					13,
					-19
				]
			],
			[
				[
					5391,
					8277
				],
				[
					19,
					17
				],
				[
					43,
					27
				],
				[
					35,
					19
				],
				[
					28,
					-9
				],
				[
					2,
					-14
				],
				[
					27,
					-1
				]
			],
			[
				[
					5545,
					8316
				],
				[
					6,
					25
				],
				[
					39,
					19
				]
			],
			[
				[
					5590,
					8360
				],
				[
					-6,
					48
				]
			],
			[
				[
					5584,
					8408
				],
				[
					1,
					44
				],
				[
					13,
					36
				],
				[
					27,
					20
				],
				[
					22,
					-43
				],
				[
					22,
					1
				],
				[
					5,
					44
				]
			],
			[
				[
					5674,
					8510
				],
				[
					4,
					34
				],
				[
					-11,
					-7
				],
				[
					-17,
					20
				],
				[
					-3,
					33
				],
				[
					35,
					16
				],
				[
					35,
					9
				],
				[
					31,
					-10
				],
				[
					28,
					2
				]
			],
			[
				[
					5776,
					8607
				],
				[
					32,
					32
				],
				[
					-29,
					27
				]
			],
			[
				[
					5779,
					8666
				],
				[
					-51,
					-5
				],
				[
					-49,
					-21
				],
				[
					-45,
					-12
				],
				[
					-16,
					32
				],
				[
					-27,
					18
				],
				[
					6,
					57
				],
				[
					-13,
					52
				],
				[
					13,
					34
				],
				[
					25,
					36
				],
				[
					64,
					62
				],
				[
					18,
					12
				],
				[
					-2,
					25
				],
				[
					-39,
					27
				]
			],
			[
				[
					5663,
					8983
				],
				[
					-48,
					-16
				],
				[
					-27,
					-41
				],
				[
					5,
					-35
				],
				[
					-45,
					-46
				],
				[
					-53,
					-50
				],
				[
					-21,
					-81
				],
				[
					20,
					-40
				],
				[
					27,
					-32
				],
				[
					-26,
					-65
				],
				[
					-29,
					-14
				],
				[
					-10,
					-96
				],
				[
					-16,
					-54
				],
				[
					-34,
					5
				],
				[
					-15,
					-45
				],
				[
					-33,
					-3
				],
				[
					-8,
					54
				],
				[
					-24,
					66
				],
				[
					-21,
					81
				]
			],
			[
				[
					5305,
					8571
				],
				[
					-18,
					35
				],
				[
					-55,
					-66
				],
				[
					-37,
					-14
				],
				[
					-39,
					30
				],
				[
					-10,
					62
				],
				[
					-8,
					132
				],
				[
					25,
					37
				],
				[
					74,
					49
				],
				[
					54,
					59
				],
				[
					51,
					81
				],
				[
					67,
					111
				],
				[
					47,
					43
				],
				[
					76,
					72
				],
				[
					61,
					25
				],
				[
					45,
					-3
				],
				[
					43,
					48
				],
				[
					50,
					-2
				],
				[
					50,
					11
				],
				[
					87,
					-42
				],
				[
					-36,
					-16
				],
				[
					31,
					-36
				]
			],
			[
				[
					5863,
					9187
				],
				[
					28,
					20
				],
				[
					46,
					-34
				],
				[
					76,
					-14
				],
				[
					105,
					-65
				],
				[
					21,
					-28
				],
				[
					2,
					-38
				],
				[
					-31,
					-30
				],
				[
					-45,
					-16
				],
				[
					-124,
					44
				],
				[
					-20,
					-7
				],
				[
					45,
					-42
				],
				[
					4,
					-86
				],
				[
					35,
					-17
				],
				[
					22,
					-15
				],
				[
					4,
					28
				]
			],
			[
				[
					6031,
					8887
				],
				[
					-18,
					25
				],
				[
					19,
					21
				]
			],
			[
				[
					6032,
					8933
				],
				[
					67,
					-36
				],
				[
					23,
					14
				],
				[
					-19,
					42
				],
				[
					65,
					57
				],
				[
					26,
					-3
				],
				[
					26,
					-21
				],
				[
					16,
					40
				],
				[
					-23,
					34
				],
				[
					13,
					35
				],
				[
					-20,
					35
				],
				[
					78,
					-18
				],
				[
					15,
					-32
				],
				[
					-35,
					-7
				],
				[
					0,
					-32
				],
				[
					22,
					-20
				],
				[
					43,
					12
				],
				[
					7,
					37
				],
				[
					58,
					28
				],
				[
					97,
					49
				],
				[
					21,
					-3
				],
				[
					-27,
					-35
				],
				[
					34,
					-6
				],
				[
					20,
					20
				],
				[
					52,
					1
				],
				[
					41,
					24
				],
				[
					32,
					-34
				],
				[
					31,
					38
				],
				[
					-29,
					33
				],
				[
					15,
					19
				],
				[
					82,
					-17
				],
				[
					38,
					-18
				],
				[
					101,
					-66
				],
				[
					18,
					30
				]
			],
			[
				[
					6920,
					9133
				],
				[
					-28,
					30
				],
				[
					-1,
					13
				]
			],
			[
				[
					6891,
					9176
				],
				[
					-33,
					5
				],
				[
					9,
					28
				],
				[
					-15,
					45
				],
				[
					-1,
					18
				],
				[
					52,
					52
				],
				[
					18,
					53
				],
				[
					21,
					11
				],
				[
					73,
					-15
				],
				[
					6,
					-32
				],
				[
					-26,
					-47
				],
				[
					17,
					-18
				],
				[
					9,
					-41
				],
				[
					-7,
					-79
				],
				[
					31,
					-35
				],
				[
					-12,
					-38
				],
				[
					-54,
					-82
				],
				[
					32,
					-9
				],
				[
					11,
					21
				],
				[
					30,
					15
				],
				[
					8,
					28
				],
				[
					24,
					28
				],
				[
					-17,
					33
				],
				[
					13,
					38
				],
				[
					-30,
					4
				],
				[
					-7,
					32
				],
				[
					22,
					58
				],
				[
					-36,
					47
				],
				[
					50,
					39
				],
				[
					-6,
					41
				],
				[
					14,
					1
				],
				[
					14,
					-32
				],
				[
					-11,
					-55
				],
				[
					30,
					-11
				],
				[
					-13,
					42
				],
				[
					47,
					22
				],
				[
					57,
					3
				],
				[
					52,
					-32
				],
				[
					-25,
					48
				],
				[
					-3,
					61
				],
				[
					48,
					11
				],
				[
					67,
					-2
				],
				[
					60,
					7
				],
				[
					-22,
					31
				],
				[
					32,
					37
				],
				[
					32,
					2
				],
				[
					54,
					29
				],
				[
					73,
					7
				],
				[
					10,
					16
				],
				[
					73,
					5
				],
				[
					22,
					-13
				],
				[
					63,
					31
				],
				[
					51,
					-1
				],
				[
					7,
					25
				],
				[
					27,
					24
				],
				[
					65,
					24
				],
				[
					48,
					-19
				],
				[
					-38,
					-14
				],
				[
					63,
					-9
				],
				[
					8,
					-28
				],
				[
					25,
					14
				],
				[
					81,
					-1
				],
				[
					63,
					-28
				]
			],
			[
				[
					8147,
					9571
				],
				[
					22,
					-21
				],
				[
					-7,
					-30
				]
			],
			[
				[
					6357,
					7389
				],
				[
					9,
					-43
				],
				[
					26,
					-12
				],
				[
					19,
					-29
				],
				[
					40,
					-10
				],
				[
					43,
					16
				],
				[
					3,
					13
				]
			],
			[
				[
					6497,
					7324
				],
				[
					-5,
					41
				],
				[
					4,
					60
				],
				[
					-22,
					19
				],
				[
					7,
					40
				],
				[
					-18,
					3
				],
				[
					6,
					49
				],
				[
					26,
					-14
				],
				[
					24,
					18
				],
				[
					-20,
					35
				],
				[
					-8,
					33
				],
				[
					-22,
					-15
				],
				[
					-3,
					-42
				],
				[
					-9,
					37
				]
			],
			[
				[
					6457,
					7588
				],
				[
					-1,
					14
				],
				[
					7,
					24
				],
				[
					-6,
					20
				],
				[
					-32,
					20
				],
				[
					-12,
					51
				],
				[
					-16,
					15
				],
				[
					-1,
					19
				],
				[
					27,
					-6
				],
				[
					1,
					42
				],
				[
					24,
					10
				],
				[
					24,
					-9
				],
				[
					5,
					56
				],
				[
					-5,
					36
				],
				[
					-28,
					-3
				],
				[
					-23,
					14
				],
				[
					-32,
					-25
				],
				[
					-26,
					-12
				]
			],
			[
				[
					6363,
					7854
				],
				[
					-13,
					-34
				],
				[
					-27,
					-10
				],
				[
					-27,
					-59
				],
				[
					25,
					-55
				],
				[
					-3,
					-39
				],
				[
					30,
					-68
				]
			],
			[
				[
					6348,
					7589
				],
				[
					15,
					-30
				],
				[
					14,
					-41
				],
				[
					13,
					-2
				],
				[
					9,
					-16
				],
				[
					-23,
					-5
				],
				[
					-5,
					-44
				],
				[
					-5,
					-20
				],
				[
					-10,
					-14
				],
				[
					1,
					-28
				]
			],
			[
				[
					2393,
					9646
				],
				[
					-13,
					-2
				],
				[
					-52,
					4
				],
				[
					-8,
					16
				],
				[
					56,
					-1
				],
				[
					20,
					-11
				],
				[
					-3,
					-6
				]
			],
			[
				[
					1939,
					9656
				],
				[
					-52,
					-17
				],
				[
					-41,
					19
				],
				[
					22,
					18
				],
				[
					41,
					6
				],
				[
					39,
					-9
				],
				[
					-9,
					-17
				]
			],
			[
				[
					5686,
					9665
				],
				[
					-62,
					-24
				],
				[
					-49,
					14
				],
				[
					19,
					15
				],
				[
					-17,
					18
				],
				[
					58,
					12
				],
				[
					11,
					-22
				],
				[
					40,
					-13
				]
			],
			[
				[
					1953,
					9708
				],
				[
					-34,
					-11
				],
				[
					-46,
					0
				],
				[
					1,
					8
				],
				[
					28,
					17
				],
				[
					15,
					-2
				],
				[
					36,
					-12
				]
			],
			[
				[
					2337,
					9677
				],
				[
					-41,
					-12
				],
				[
					-22,
					13
				],
				[
					-12,
					22
				],
				[
					-3,
					24
				],
				[
					36,
					-3
				],
				[
					17,
					-3
				],
				[
					33,
					-20
				],
				[
					-8,
					-21
				]
			],
			[
				[
					2220,
					9692
				],
				[
					11,
					-24
				],
				[
					-46,
					7
				],
				[
					-45,
					18
				],
				[
					-62,
					2
				],
				[
					27,
					17
				],
				[
					-34,
					14
				],
				[
					-2,
					22
				],
				[
					54,
					-7
				],
				[
					76,
					-21
				],
				[
					21,
					-28
				]
			],
			[
				[
					7917,
					9691
				],
				[
					-156,
					-22
				],
				[
					51,
					75
				],
				[
					22,
					7
				],
				[
					21,
					-4
				],
				[
					71,
					-32
				],
				[
					-9,
					-24
				]
			],
			[
				[
					5506,
					9771
				],
				[
					91,
					-43
				],
				[
					-70,
					-22
				],
				[
					-15,
					-43
				],
				[
					-24,
					-10
				],
				[
					-14,
					-48
				],
				[
					-33,
					-2
				],
				[
					-60,
					35
				],
				[
					25,
					20
				],
				[
					-41,
					17
				],
				[
					-54,
					48
				],
				[
					-22,
					46
				],
				[
					76,
					20
				],
				[
					15,
					-20
				],
				[
					40,
					1
				],
				[
					10,
					20
				],
				[
					41,
					2
				],
				[
					35,
					-21
				]
			],
			[
				[
					5706,
					9812
				],
				[
					54,
					-20
				],
				[
					-41,
					-31
				],
				[
					-80,
					-7
				],
				[
					-82,
					10
				],
				[
					-5,
					16
				],
				[
					-40,
					1
				],
				[
					-31,
					26
				],
				[
					86,
					16
				],
				[
					40,
					-14
				],
				[
					29,
					17
				],
				[
					70,
					-14
				]
			],
			[
				[
					6419,
					9820
				],
				[
					-37,
					-7
				],
				[
					-25,
					-5
				],
				[
					-4,
					-9
				],
				[
					-32,
					-10
				],
				[
					-30,
					14
				],
				[
					15,
					18
				],
				[
					-61,
					2
				],
				[
					54,
					10
				],
				[
					42,
					1
				],
				[
					6,
					-16
				],
				[
					16,
					14
				],
				[
					26,
					10
				],
				[
					41,
					-13
				],
				[
					-11,
					-9
				]
			],
			[
				[
					7775,
					9724
				],
				[
					-61,
					-7
				],
				[
					-77,
					17
				],
				[
					-46,
					22
				],
				[
					-22,
					41
				],
				[
					-37,
					11
				],
				[
					72,
					40
				],
				[
					60,
					13
				],
				[
					54,
					-29
				],
				[
					64,
					-56
				],
				[
					-7,
					-52
				]
			],
			[
				[
					2582,
					9769
				],
				[
					34,
					-19
				],
				[
					-39,
					-17
				],
				[
					-51,
					-43
				],
				[
					-49,
					-4
				],
				[
					-58,
					7
				],
				[
					-29,
					24
				],
				[
					0,
					21
				],
				[
					22,
					15
				],
				[
					-51,
					-1
				],
				[
					-31,
					20
				],
				[
					-17,
					26
				],
				[
					19,
					25
				],
				[
					19,
					18
				],
				[
					29,
					4
				],
				[
					-12,
					13
				],
				[
					64,
					3
				],
				[
					36,
					-31
				],
				[
					47,
					-12
				],
				[
					45,
					-11
				],
				[
					22,
					-38
				]
			],
			[
				[
					3096,
					9967
				],
				[
					75,
					-4
				],
				[
					59,
					-7
				],
				[
					51,
					-16
				],
				[
					-1,
					-15
				],
				[
					-68,
					-25
				],
				[
					-67,
					-12
				],
				[
					-25,
					-13
				],
				[
					60,
					0
				],
				[
					-65,
					-35
				],
				[
					-46,
					-16
				],
				[
					-47,
					-47
				],
				[
					-57,
					-9
				],
				[
					-18,
					-12
				],
				[
					-84,
					-6
				],
				[
					38,
					-8
				],
				[
					-19,
					-10
				],
				[
					23,
					-28
				],
				[
					-26,
					-20
				],
				[
					-43,
					-16
				],
				[
					-14,
					-23
				],
				[
					-38,
					-17
				],
				[
					4,
					-13
				],
				[
					47,
					2
				],
				[
					1,
					-14
				],
				[
					-75,
					-34
				],
				[
					-72,
					15
				],
				[
					-82,
					-9
				],
				[
					-41,
					7
				],
				[
					-53,
					3
				],
				[
					-3,
					28
				],
				[
					51,
					13
				],
				[
					-13,
					42
				],
				[
					17,
					4
				],
				[
					74,
					-25
				],
				[
					-38,
					37
				],
				[
					-45,
					11
				],
				[
					22,
					22
				],
				[
					50,
					14
				],
				[
					7,
					20
				],
				[
					-39,
					22
				],
				[
					-12,
					30
				],
				[
					76,
					-2
				],
				[
					22,
					-7
				],
				[
					44,
					21
				],
				[
					-63,
					7
				],
				[
					-97,
					-4
				],
				[
					-49,
					20
				],
				[
					-23,
					23
				],
				[
					-33,
					17
				],
				[
					-6,
					20
				],
				[
					41,
					11
				],
				[
					33,
					2
				],
				[
					54,
					9
				],
				[
					41,
					21
				],
				[
					35,
					-3
				],
				[
					30,
					-16
				],
				[
					21,
					31
				],
				[
					36,
					10
				],
				[
					50,
					6
				],
				[
					85,
					2
				],
				[
					15,
					-6
				],
				[
					80,
					10
				],
				[
					60,
					-4
				],
				[
					60,
					-4
				]
			],
			[
				[
					4246,
					9991
				],
				[
					174,
					-45
				],
				[
					-51,
					-23
				],
				[
					-107,
					-2
				],
				[
					-149,
					-6
				],
				[
					14,
					-10
				],
				[
					98,
					6
				],
				[
					84,
					-19
				],
				[
					54,
					17
				],
				[
					23,
					-21
				],
				[
					-31,
					-33
				],
				[
					71,
					21
				],
				[
					135,
					23
				],
				[
					83,
					-11
				],
				[
					16,
					-25
				],
				[
					-113,
					-41
				],
				[
					-16,
					-13
				],
				[
					-89,
					-10
				],
				[
					65,
					-3
				],
				[
					-33,
					-42
				],
				[
					-22,
					-37
				],
				[
					1,
					-64
				],
				[
					33,
					-38
				],
				[
					-43,
					-2
				],
				[
					-46,
					-19
				],
				[
					51,
					-30
				],
				[
					7,
					-49
				],
				[
					-30,
					-5
				],
				[
					36,
					-50
				],
				[
					-62,
					-4
				],
				[
					32,
					-23
				],
				[
					-9,
					-21
				],
				[
					-39,
					-9
				],
				[
					-39,
					0
				],
				[
					35,
					-39
				],
				[
					1,
					-25
				],
				[
					-55,
					23
				],
				[
					-15,
					-15
				],
				[
					38,
					-14
				],
				[
					36,
					-36
				],
				[
					11,
					-46
				],
				[
					-50,
					-11
				],
				[
					-21,
					22
				],
				[
					-34,
					33
				],
				[
					9,
					-39
				],
				[
					-32,
					-30
				],
				[
					73,
					-3
				],
				[
					38,
					-3
				],
				[
					-74,
					-50
				],
				[
					-76,
					-45
				],
				[
					-81,
					-20
				],
				[
					-31,
					0
				],
				[
					-28,
					-23
				],
				[
					-39,
					-60
				],
				[
					-60,
					-41
				],
				[
					-19,
					-2
				],
				[
					-37,
					-14
				],
				[
					-40,
					-14
				],
				[
					-24,
					-35
				],
				[
					0,
					-41
				],
				[
					-14,
					-38
				],
				[
					-45,
					-46
				],
				[
					11,
					-45
				],
				[
					-13,
					-47
				],
				[
					-14,
					-56
				],
				[
					-39,
					-4
				],
				[
					-41,
					47
				],
				[
					-56,
					0
				],
				[
					-26,
					32
				],
				[
					-19,
					56
				],
				[
					-48,
					72
				],
				[
					-14,
					37
				],
				[
					-4,
					52
				],
				[
					-38,
					53
				],
				[
					10,
					43
				],
				[
					-19,
					20
				],
				[
					27,
					67
				],
				[
					42,
					22
				],
				[
					11,
					24
				],
				[
					6,
					45
				],
				[
					-32,
					-21
				],
				[
					-15,
					-8
				],
				[
					-25,
					-8
				],
				[
					-34,
					18
				],
				[
					-2,
					39
				],
				[
					11,
					31
				],
				[
					26,
					1
				],
				[
					57,
					-15
				],
				[
					-48,
					36
				],
				[
					-25,
					20
				],
				[
					-28,
					-8
				],
				[
					-23,
					14
				],
				[
					31,
					54
				],
				[
					-17,
					21
				],
				[
					-22,
					40
				],
				[
					-33,
					61
				],
				[
					-36,
					22
				],
				[
					1,
					24
				],
				[
					-75,
					34
				],
				[
					-59,
					4
				],
				[
					-74,
					-2
				],
				[
					-68,
					-4
				],
				[
					-32,
					18
				],
				[
					-48,
					36
				],
				[
					73,
					18
				],
				[
					56,
					4
				],
				[
					-119,
					14
				],
				[
					-63,
					24
				],
				[
					4,
					22
				],
				[
					105,
					28
				],
				[
					102,
					28
				],
				[
					11,
					21
				],
				[
					-75,
					20
				],
				[
					24,
					23
				],
				[
					96,
					41
				],
				[
					40,
					6
				],
				[
					-11,
					26
				],
				[
					66,
					15
				],
				[
					85,
					9
				],
				[
					85,
					0
				],
				[
					31,
					-18
				],
				[
					73,
					32
				],
				[
					67,
					-21
				],
				[
					39,
					-5
				],
				[
					57,
					-19
				],
				[
					-66,
					31
				],
				[
					4,
					25
				],
				[
					93,
					34
				],
				[
					98,
					-2
				],
				[
					35,
					21
				],
				[
					98,
					6
				],
				[
					222,
					-8
				]
			],
			[
				[
					6847,
					7333
				],
				[
					15,
					0
				],
				[
					21,
					-12
				]
			],
			[
				[
					6883,
					7321
				],
				[
					8,
					-7
				],
				[
					21,
					18
				],
				[
					9,
					-11
				],
				[
					9,
					27
				],
				[
					16,
					-2
				],
				[
					5,
					9
				],
				[
					3,
					23
				],
				[
					12,
					20
				],
				[
					15,
					-13
				],
				[
					-3,
					-18
				],
				[
					8,
					-2
				],
				[
					-3,
					-49
				],
				[
					11,
					-19
				],
				[
					10,
					13
				],
				[
					12,
					5
				],
				[
					18,
					26
				],
				[
					19,
					-4
				],
				[
					29,
					0
				]
			],
			[
				[
					7082,
					7337
				],
				[
					5,
					-17
				]
			],
			[
				[
					7087,
					7320
				],
				[
					-17,
					-6
				],
				[
					-14,
					-11
				],
				[
					-32,
					-7
				],
				[
					-29,
					-12
				],
				[
					-17,
					-25
				],
				[
					7,
					-24
				],
				[
					3,
					-29
				],
				[
					-14,
					-24
				],
				[
					1,
					-22
				],
				[
					-7,
					-21
				],
				[
					-27,
					2
				],
				[
					11,
					-38
				],
				[
					-17,
					-15
				],
				[
					-12,
					-34
				],
				[
					1,
					-35
				],
				[
					-11,
					-16
				],
				[
					-10,
					5
				],
				[
					-21,
					-7
				],
				[
					-3,
					-17
				],
				[
					-21,
					1
				],
				[
					-15,
					-33
				],
				[
					-1,
					-49
				],
				[
					-36,
					-24
				],
				[
					-20,
					5
				],
				[
					-5,
					-13
				],
				[
					-17,
					8
				],
				[
					-28,
					-9
				],
				[
					-46,
					30
				]
			],
			[
				[
					6690,
					6900
				],
				[
					25,
					52
				],
				[
					-2,
					37
				],
				[
					-21,
					10
				],
				[
					-3,
					36
				],
				[
					-9,
					46
				],
				[
					12,
					32
				],
				[
					-12,
					8
				],
				[
					8,
					42
				],
				[
					11,
					72
				]
			],
			[
				[
					6699,
					7235
				],
				[
					28,
					-22
				],
				[
					21,
					8
				],
				[
					6,
					26
				],
				[
					22,
					8
				],
				[
					16,
					18
				],
				[
					5,
					46
				],
				[
					24,
					11
				],
				[
					4,
					21
				],
				[
					13,
					-16
				],
				[
					9,
					-2
				]
			],
			[
				[
					5663,
					4553
				],
				[
					3,
					-18
				],
				[
					-3,
					-28
				],
				[
					5,
					-27
				],
				[
					-4,
					-22
				],
				[
					2,
					-19
				],
				[
					-58,
					0
				],
				[
					-1,
					-183
				],
				[
					19,
					-47
				],
				[
					18,
					-36
				]
			],
			[
				[
					5644,
					4173
				],
				[
					-51,
					-24
				],
				[
					-67,
					9
				],
				[
					-20,
					27
				],
				[
					-112,
					-2
				],
				[
					-5,
					-4
				],
				[
					-16,
					26
				],
				[
					-18,
					1
				],
				[
					-17,
					-9
				],
				[
					-13,
					-11
				]
			],
			[
				[
					5341,
					4831
				],
				[
					12,
					7
				],
				[
					8,
					-1
				],
				[
					10,
					7
				],
				[
					81,
					0
				],
				[
					7,
					-43
				],
				[
					8,
					-35
				],
				[
					7,
					-19
				],
				[
					10,
					-30
				],
				[
					19,
					5
				],
				[
					9,
					8
				],
				[
					15,
					-8
				],
				[
					4,
					14
				],
				[
					7,
					34
				],
				[
					18,
					2
				],
				[
					1,
					10
				],
				[
					14,
					0
				],
				[
					-2,
					-20
				],
				[
					33,
					0
				],
				[
					1,
					-36
				],
				[
					6,
					-22
				],
				[
					-4,
					-35
				],
				[
					2,
					-35
				],
				[
					9,
					-22
				],
				[
					-2,
					-68
				],
				[
					7,
					5
				],
				[
					12,
					-1
				],
				[
					18,
					8
				],
				[
					12,
					-3
				]
			],
			[
				[
					5330,
					4892
				],
				[
					11,
					25
				],
				[
					9,
					9
				],
				[
					10,
					-19
				]
			],
			[
				[
					5360,
					4907
				],
				[
					-10,
					-12
				],
				[
					-5,
					-15
				],
				[
					-1,
					-25
				],
				[
					-7,
					-6
				]
			],
			[
				[
					5583,
					7534
				],
				[
					-1,
					-15
				],
				[
					-9,
					-9
				],
				[
					-1,
					-18
				],
				[
					-13,
					-28
				]
			],
			[
				[
					5537,
					7593
				],
				[
					-2,
					19
				],
				[
					12,
					28
				],
				[
					2,
					-11
				],
				[
					7,
					5
				]
			],
			[
				[
					5556,
					7634
				],
				[
					6,
					-15
				],
				[
					7,
					-6
				],
				[
					2,
					-21
				]
			],
			[
				[
					5571,
					7592
				],
				[
					-4,
					-19
				],
				[
					4,
					-25
				],
				[
					12,
					-14
				]
			],
			[
				[
					6556,
					6682
				],
				[
					6,
					-19
				]
			],
			[
				[
					6565,
					6617
				],
				[
					-14,
					0
				],
				[
					-2,
					-38
				],
				[
					5,
					-8
				],
				[
					-13,
					-11
				],
				[
					0,
					-23
				],
				[
					-8,
					-24
				],
				[
					-1,
					-23
				]
			],
			[
				[
					6532,
					6490
				],
				[
					-5,
					-13
				],
				[
					-84,
					29
				],
				[
					-10,
					59
				],
				[
					-1,
					13
				]
			],
			[
				[
					3139,
					2021
				],
				[
					-17,
					1
				],
				[
					-29,
					0
				],
				[
					0,
					129
				]
			],
			[
				[
					3258,
					3901
				],
				[
					51,
					-94
				],
				[
					23,
					-9
				],
				[
					34,
					-42
				],
				[
					28,
					-23
				],
				[
					4,
					-25
				],
				[
					-27,
					-88
				],
				[
					28,
					-16
				],
				[
					31,
					-8
				],
				[
					22,
					9
				],
				[
					25,
					44
				],
				[
					5,
					51
				]
			],
			[
				[
					3482,
					3700
				],
				[
					14,
					11
				],
				[
					13,
					-33
				],
				[
					0,
					-46
				],
				[
					-23,
					-32
				],
				[
					-19,
					-24
				],
				[
					-31,
					-55
				],
				[
					-38,
					-79
				]
			],
			[
				[
					3398,
					3442
				],
				[
					-6,
					-46
				],
				[
					-8,
					-59
				],
				[
					0,
					-58
				],
				[
					-6,
					-12
				],
				[
					-2,
					-38
				]
			],
			[
				[
					3094,
					2170
				],
				[
					-25,
					9
				],
				[
					-67,
					8
				],
				[
					-12,
					34
				],
				[
					1,
					43
				],
				[
					-19,
					-4
				],
				[
					-10,
					21
				],
				[
					-2,
					61
				],
				[
					21,
					25
				],
				[
					9,
					37
				],
				[
					-3,
					29
				],
				[
					14,
					49
				],
				[
					11,
					76
				],
				[
					-3,
					34
				],
				[
					12,
					11
				],
				[
					-3,
					22
				],
				[
					-13,
					11
				],
				[
					9,
					25
				],
				[
					-12,
					21
				],
				[
					-7,
					67
				],
				[
					11,
					12
				],
				[
					-4,
					70
				],
				[
					6,
					59
				],
				[
					7,
					51
				],
				[
					17,
					21
				],
				[
					-8,
					56
				],
				[
					0,
					53
				],
				[
					21,
					38
				],
				[
					-1,
					48
				],
				[
					16,
					56
				],
				[
					0,
					53
				],
				[
					-7,
					10
				],
				[
					-13,
					100
				],
				[
					17,
					59
				],
				[
					-3,
					56
				],
				[
					10,
					52
				],
				[
					18,
					54
				],
				[
					20,
					36
				],
				[
					-8,
					23
				],
				[
					6,
					18
				],
				[
					-1,
					96
				],
				[
					30,
					29
				],
				[
					9,
					59
				],
				[
					-3,
					15
				]
			],
			[
				[
					3135,
					3873
				],
				[
					23,
					52
				],
				[
					37,
					-14
				],
				[
					16,
					-42
				],
				[
					11,
					47
				],
				[
					31,
					-3
				],
				[
					5,
					-12
				]
			],
			[
				[
					6291,
					7414
				],
				[
					-10,
					-1
				]
			],
			[
				[
					6281,
					7413
				],
				[
					-12,
					33
				],
				[
					0,
					9
				],
				[
					-12,
					0
				],
				[
					-8,
					15
				],
				[
					-6,
					-1
				]
			],
			[
				[
					6243,
					7469
				],
				[
					-11,
					17
				],
				[
					-20,
					14
				],
				[
					2,
					28
				],
				[
					-4,
					20
				]
			],
			[
				[
					6210,
					7548
				],
				[
					38,
					9
				]
			],
			[
				[
					6248,
					7557
				],
				[
					6,
					-15
				],
				[
					10,
					-10
				],
				[
					-5,
					-14
				],
				[
					15,
					-20
				],
				[
					-8,
					-18
				],
				[
					12,
					-16
				],
				[
					12,
					-10
				],
				[
					1,
					-40
				]
			],
			[
				[
					3371,
					1488
				],
				[
					-12,
					-13
				],
				[
					-21,
					9
				],
				[
					-22,
					-5
				],
				[
					-20,
					-14
				],
				[
					-20,
					-14
				],
				[
					-13,
					-17
				],
				[
					-4,
					-23
				],
				[
					2,
					-21
				],
				[
					13,
					-19
				],
				[
					-19,
					-14
				],
				[
					-27,
					-5
				],
				[
					-15,
					-19
				],
				[
					-16,
					-18
				],
				[
					-17,
					-25
				],
				[
					-5,
					-21
				],
				[
					10,
					-24
				],
				[
					15,
					-18
				],
				[
					22,
					-13
				],
				[
					22,
					-18
				],
				[
					11,
					-23
				],
				[
					6,
					-21
				],
				[
					8,
					-23
				],
				[
					13,
					-19
				],
				[
					8,
					-22
				],
				[
					4,
					-53
				],
				[
					8,
					-21
				],
				[
					3,
					-23
				],
				[
					8,
					-22
				],
				[
					-3,
					-31
				],
				[
					-16,
					-23
				],
				[
					-16,
					-20
				],
				[
					-37,
					-7
				],
				[
					-13,
					-21
				],
				[
					-16,
					-19
				],
				[
					-42,
					-21
				],
				[
					-37,
					-9
				],
				[
					-35,
					-13
				],
				[
					-38,
					-12
				],
				[
					-22,
					-24
				],
				[
					-45,
					-2
				],
				[
					-49,
					2
				],
				[
					-44,
					-4
				],
				[
					-46,
					0
				],
				[
					8,
					-23
				],
				[
					43,
					-10
				],
				[
					31,
					-16
				],
				[
					17,
					-20
				],
				[
					-31,
					-18
				],
				[
					-48,
					5
				],
				[
					-39,
					-14
				],
				[
					-2,
					-24
				],
				[
					-1,
					-23
				],
				[
					33,
					-19
				],
				[
					6,
					-21
				],
				[
					35,
					-22
				],
				[
					59,
					-9
				],
				[
					50,
					-15
				],
				[
					39,
					-18
				],
				[
					51,
					-19
				],
				[
					69,
					-9
				],
				[
					68,
					-15
				],
				[
					47,
					-17
				],
				[
					52,
					-19
				],
				[
					27,
					-28
				],
				[
					14,
					-21
				],
				[
					34,
					20
				],
				[
					45,
					17
				],
				[
					49,
					18
				],
				[
					57,
					15
				],
				[
					50,
					16
				],
				[
					69,
					1
				],
				[
					68,
					-8
				],
				[
					56,
					-14
				],
				[
					18,
					25
				],
				[
					39,
					17
				],
				[
					70,
					1
				],
				[
					55,
					13
				],
				[
					52,
					12
				],
				[
					58,
					8
				],
				[
					61,
					10
				],
				[
					43,
					15
				],
				[
					-20,
					20
				],
				[
					-12,
					20
				],
				[
					0,
					22
				],
				[
					-53,
					-2
				],
				[
					-57,
					-9
				],
				[
					-55,
					0
				],
				[
					-8,
					21
				],
				[
					4,
					43
				],
				[
					13,
					12
				],
				[
					40,
					14
				],
				[
					46,
					13
				],
				[
					34,
					17
				],
				[
					34,
					17
				],
				[
					25,
					23
				],
				[
					38,
					10
				],
				[
					37,
					8
				],
				[
					19,
					4
				],
				[
					43,
					3
				],
				[
					41,
					8
				],
				[
					34,
					11
				],
				[
					34,
					13
				],
				[
					31,
					14
				],
				[
					38,
					18
				],
				[
					25,
					19
				],
				[
					26,
					17
				],
				[
					8,
					23
				],
				[
					-29,
					13
				],
				[
					9,
					24
				],
				[
					19,
					18
				],
				[
					29,
					11
				],
				[
					30,
					14
				],
				[
					29,
					18
				],
				[
					21,
					22
				],
				[
					14,
					27
				],
				[
					20,
					16
				],
				[
					33,
					-3
				],
				[
					14,
					-19
				],
				[
					33,
					-3
				],
				[
					1,
					22
				],
				[
					14,
					22
				],
				[
					30,
					-5
				],
				[
					7,
					-22
				],
				[
					33,
					-3
				],
				[
					36,
					10
				],
				[
					35,
					7
				],
				[
					32,
					-3
				],
				[
					12,
					-24
				],
				[
					30,
					19
				],
				[
					28,
					10
				],
				[
					32,
					8
				],
				[
					31,
					8
				],
				[
					28,
					14
				],
				[
					31,
					9
				],
				[
					24,
					12
				],
				[
					17,
					20
				],
				[
					21,
					-14
				],
				[
					29,
					8
				],
				[
					20,
					-28
				],
				[
					15,
					-20
				],
				[
					32,
					11
				],
				[
					13,
					23
				],
				[
					28,
					16
				],
				[
					36,
					-4
				],
				[
					11,
					-21
				],
				[
					23,
					21
				],
				[
					30,
					7
				],
				[
					33,
					2
				],
				[
					29,
					-1
				],
				[
					31,
					-6
				],
				[
					30,
					-4
				],
				[
					13,
					-19
				],
				[
					18,
					-17
				],
				[
					30,
					10
				],
				[
					33,
					2
				],
				[
					32,
					0
				],
				[
					31,
					2
				],
				[
					27,
					7
				],
				[
					30,
					7
				],
				[
					24,
					16
				],
				[
					26,
					10
				],
				[
					29,
					6
				],
				[
					21,
					16
				],
				[
					15,
					31
				],
				[
					16,
					19
				],
				[
					29,
					-9
				],
				[
					10,
					-20
				],
				[
					24,
					-13
				],
				[
					29,
					4
				],
				[
					20,
					-20
				],
				[
					20,
					-15
				],
				[
					29,
					14
				],
				[
					10,
					24
				],
				[
					25,
					11
				],
				[
					28,
					19
				],
				[
					28,
					8
				],
				[
					32,
					11
				],
				[
					22,
					12
				],
				[
					23,
					14
				],
				[
					22,
					12
				],
				[
					26,
					-6
				],
				[
					25,
					20
				],
				[
					18,
					16
				],
				[
					26,
					-2
				],
				[
					23,
					14
				],
				[
					5,
					20
				],
				[
					24,
					16
				],
				[
					22,
					11
				],
				[
					28,
					9
				],
				[
					26,
					5
				],
				[
					24,
					-3
				],
				[
					26,
					-6
				],
				[
					23,
					-16
				],
				[
					2,
					-25
				],
				[
					25,
					-19
				],
				[
					17,
					-16
				],
				[
					33,
					-6
				],
				[
					18,
					-16
				],
				[
					23,
					-16
				],
				[
					27,
					-3
				],
				[
					22,
					11
				],
				[
					24,
					24
				],
				[
					26,
					-13
				],
				[
					27,
					-7
				],
				[
					26,
					-6
				],
				[
					28,
					-5
				],
				[
					27,
					0
				],
				[
					23,
					-60
				],
				[
					-1,
					-14
				],
				[
					-3,
					-26
				],
				[
					-27,
					-15
				],
				[
					-22,
					-21
				],
				[
					4,
					-23
				],
				[
					31,
					1
				],
				[
					-3,
					-22
				],
				[
					-15,
					-22
				],
				[
					-13,
					-24
				],
				[
					22,
					-18
				],
				[
					32,
					-5
				],
				[
					32,
					10
				],
				[
					15,
					22
				],
				[
					9,
					22
				],
				[
					15,
					18
				],
				[
					18,
					17
				],
				[
					7,
					20
				],
				[
					15,
					28
				],
				[
					17,
					6
				],
				[
					32,
					2
				],
				[
					27,
					7
				],
				[
					29,
					9
				],
				[
					13,
					23
				],
				[
					8,
					21
				],
				[
					19,
					22
				],
				[
					28,
					14
				],
				[
					23,
					11
				],
				[
					15,
					20
				],
				[
					16,
					10
				],
				[
					20,
					9
				],
				[
					28,
					-6
				],
				[
					25,
					6
				],
				[
					27,
					7
				],
				[
					31,
					-4
				],
				[
					20,
					16
				],
				[
					14,
					38
				],
				[
					10,
					-15
				],
				[
					13,
					-27
				],
				[
					24,
					-12
				],
				[
					26,
					-4
				],
				[
					27,
					6
				],
				[
					28,
					-4
				],
				[
					26,
					-1
				],
				[
					18,
					5
				],
				[
					23,
					-3
				],
				[
					21,
					-12
				],
				[
					25,
					8
				],
				[
					30,
					0
				],
				[
					26,
					7
				],
				[
					29,
					-7
				],
				[
					18,
					19
				],
				[
					14,
					19
				],
				[
					19,
					16
				],
				[
					35,
					43
				],
				[
					18,
					-8
				],
				[
					21,
					-16
				],
				[
					19,
					-20
				],
				[
					35,
					-35
				],
				[
					27,
					-1
				],
				[
					26,
					0
				],
				[
					30,
					6
				],
				[
					30,
					8
				],
				[
					23,
					16
				],
				[
					19,
					17
				],
				[
					31,
					2
				],
				[
					20,
					13
				],
				[
					22,
					-12
				],
				[
					14,
					-18
				],
				[
					20,
					-18
				],
				[
					30,
					2
				],
				[
					19,
					-14
				],
				[
					34,
					-15
				],
				[
					34,
					-6
				],
				[
					29,
					5
				],
				[
					22,
					18
				],
				[
					18,
					18
				],
				[
					25,
					5
				],
				[
					25,
					-8
				],
				[
					29,
					-6
				],
				[
					26,
					9
				],
				[
					25,
					0
				],
				[
					25,
					-6
				],
				[
					26,
					-5
				],
				[
					25,
					10
				],
				[
					29,
					9
				],
				[
					29,
					2
				],
				[
					31,
					0
				],
				[
					26,
					6
				],
				[
					25,
					4
				],
				[
					8,
					29
				],
				[
					1,
					23
				],
				[
					17,
					-15
				],
				[
					5,
					-26
				],
				[
					9,
					-24
				],
				[
					12,
					-19
				],
				[
					23,
					-10
				],
				[
					32,
					3
				],
				[
					36,
					1
				],
				[
					25,
					3
				],
				[
					36,
					0
				],
				[
					27,
					2
				],
				[
					36,
					-3
				],
				[
					31,
					-4
				],
				[
					20,
					-18
				],
				[
					-6,
					-22
				],
				[
					18,
					-17
				],
				[
					30,
					-13
				],
				[
					31,
					-15
				],
				[
					36,
					-10
				],
				[
					37,
					-9
				],
				[
					29,
					-9
				],
				[
					31,
					-1
				],
				[
					18,
					19
				],
				[
					25,
					-16
				],
				[
					21,
					-18
				],
				[
					24,
					-13
				],
				[
					34,
					-6
				],
				[
					32,
					-7
				],
				[
					14,
					-22
				],
				[
					31,
					-14
				],
				[
					22,
					-20
				],
				[
					31,
					-9
				],
				[
					32,
					1
				],
				[
					30,
					-3
				],
				[
					33,
					1
				],
				[
					33,
					-5
				],
				[
					31,
					-8
				],
				[
					29,
					-13
				],
				[
					29,
					-12
				],
				[
					19,
					-17
				],
				[
					-3,
					-22
				],
				[
					-15,
					-20
				],
				[
					-12,
					-26
				],
				[
					-10,
					-21
				],
				[
					-13,
					-23
				],
				[
					-36,
					-9
				],
				[
					-17,
					-21
				],
				[
					-36,
					-12
				],
				[
					-12,
					-23
				],
				[
					-19,
					-21
				],
				[
					-20,
					-18
				],
				[
					-12,
					-24
				],
				[
					-7,
					-21
				],
				[
					-3,
					-26
				],
				[
					1,
					-22
				],
				[
					16,
					-22
				],
				[
					6,
					-22
				],
				[
					13,
					-20
				],
				[
					51,
					-8
				],
				[
					11,
					-25
				],
				[
					-50,
					-9
				],
				[
					-42,
					-12
				],
				[
					-53,
					-2
				],
				[
					-23,
					-33
				],
				[
					-5,
					-27
				],
				[
					-12,
					-22
				],
				[
					-15,
					-21
				],
				[
					37,
					-19
				],
				[
					14,
					-24
				],
				[
					24,
					-21
				],
				[
					34,
					-20
				],
				[
					39,
					-18
				],
				[
					41,
					-18
				],
				[
					64,
					-18
				],
				[
					14,
					-28
				],
				[
					80,
					-12
				],
				[
					6,
					-5
				],
				[
					20,
					-17
				],
				[
					77,
					15
				],
				[
					64,
					-18
				],
				[
					48,
					-14
				],
				[
					-9998,
					-1
				],
				[
					25,
					34
				],
				[
					50,
					-18
				],
				[
					3,
					2
				],
				[
					29,
					18
				],
				[
					4,
					0
				],
				[
					3,
					-1
				],
				[
					41,
					-24
				],
				[
					35,
					24
				],
				[
					6,
					3
				],
				[
					82,
					11
				],
				[
					26,
					-14
				],
				[
					13,
					-7
				],
				[
					42,
					-19
				],
				[
					79,
					-15
				],
				[
					62,
					-18
				],
				[
					108,
					-13
				],
				[
					80,
					16
				],
				[
					118,
					-12
				],
				[
					66,
					-18
				],
				[
					74,
					17
				],
				[
					77,
					16
				],
				[
					6,
					27
				],
				[
					-109,
					2
				],
				[
					-90,
					14
				],
				[
					-23,
					23
				],
				[
					-75,
					12
				],
				[
					5,
					26
				],
				[
					10,
					24
				],
				[
					11,
					21
				],
				[
					-6,
					24
				],
				[
					-46,
					16
				],
				[
					-21,
					20
				],
				[
					-43,
					18
				],
				[
					67,
					-4
				],
				[
					64,
					10
				],
				[
					41,
					-20
				],
				[
					49,
					17
				],
				[
					46,
					22
				],
				[
					22,
					19
				],
				[
					-10,
					24
				],
				[
					-35,
					15
				],
				[
					-41,
					17
				],
				[
					-57,
					4
				],
				[
					-50,
					8
				],
				[
					-54,
					5
				],
				[
					-18,
					22
				],
				[
					-36,
					18
				],
				[
					-22,
					20
				],
				[
					-9,
					65
				],
				[
					14,
					-5
				],
				[
					25,
					-18
				],
				[
					46,
					5
				],
				[
					44,
					8
				],
				[
					23,
					-25
				],
				[
					44,
					6
				],
				[
					37,
					13
				],
				[
					35,
					15
				],
				[
					31,
					20
				],
				[
					42,
					5
				],
				[
					-1,
					22
				],
				[
					-10,
					21
				],
				[
					8,
					20
				],
				[
					36,
					10
				],
				[
					16,
					-19
				],
				[
					43,
					12
				],
				[
					32,
					14
				],
				[
					40,
					1
				],
				[
					37,
					6
				],
				[
					38,
					14
				],
				[
					30,
					12
				],
				[
					33,
					12
				],
				[
					22,
					-3
				],
				[
					19,
					-5
				],
				[
					42,
					8
				],
				[
					37,
					-10
				],
				[
					38,
					1
				],
				[
					36,
					8
				],
				[
					38,
					-5
				],
				[
					41,
					-6
				],
				[
					39,
					2
				],
				[
					40,
					-1
				],
				[
					41,
					-1
				],
				[
					38,
					2
				],
				[
					29,
					17
				],
				[
					33,
					9
				],
				[
					35,
					-12
				],
				[
					33,
					10
				],
				[
					30,
					20
				],
				[
					18,
					-18
				],
				[
					10,
					-20
				],
				[
					18,
					-19
				],
				[
					29,
					17
				],
				[
					33,
					-22
				],
				[
					37,
					-7
				],
				[
					33,
					-15
				],
				[
					39,
					3
				],
				[
					35,
					10
				],
				[
					42,
					-2
				],
				[
					37,
					-8
				],
				[
					39,
					-10
				],
				[
					14,
					25
				],
				[
					-18,
					19
				],
				[
					-13,
					20
				],
				[
					-36,
					5
				],
				[
					-16,
					21
				],
				[
					-6,
					22
				],
				[
					-10,
					42
				],
				[
					21,
					-7
				],
				[
					37,
					-4
				],
				[
					36,
					4
				],
				[
					32,
					-9
				],
				[
					29,
					-17
				],
				[
					12,
					-21
				],
				[
					37,
					-3
				],
				[
					36,
					8
				],
				[
					38,
					11
				],
				[
					35,
					7
				],
				[
					28,
					-14
				],
				[
					37,
					5
				],
				[
					24,
					44
				],
				[
					22,
					-26
				],
				[
					32,
					-10
				],
				[
					35,
					5
				],
				[
					23,
					-22
				],
				[
					36,
					-2
				],
				[
					34,
					-7
				],
				[
					33,
					-13
				],
				[
					22,
					22
				],
				[
					11,
					20
				],
				[
					28,
					-22
				],
				[
					38,
					5
				],
				[
					28,
					-12
				],
				[
					19,
					-19
				],
				[
					37,
					5
				],
				[
					29,
					13
				],
				[
					28,
					14
				],
				[
					34,
					8
				],
				[
					39,
					7
				],
				[
					35,
					8
				],
				[
					28,
					12
				],
				[
					16,
					18
				],
				[
					6,
					25
				],
				[
					-3,
					24
				],
				[
					-9,
					22
				],
				[
					-9,
					23
				],
				[
					-9,
					23
				],
				[
					-7,
					20
				],
				[
					-2,
					22
				],
				[
					3,
					23
				],
				[
					13,
					21
				],
				[
					11,
					24
				],
				[
					4,
					23
				],
				[
					-5,
					25
				],
				[
					-4,
					22
				],
				[
					14,
					26
				],
				[
					15,
					17
				],
				[
					18,
					21
				],
				[
					19,
					18
				],
				[
					23,
					17
				],
				[
					10,
					25
				],
				[
					16,
					16
				],
				[
					17,
					15
				],
				[
					27,
					3
				],
				[
					17,
					18
				],
				[
					20,
					11
				],
				[
					23,
					7
				],
				[
					20,
					15
				],
				[
					16,
					18
				],
				[
					21,
					7
				],
				[
					17,
					-15
				],
				[
					-11,
					-19
				],
				[
					-28,
					-17
				]
			],
			[
				[
					6914,
					2382
				],
				[
					18,
					-18
				],
				[
					26,
					-7
				],
				[
					1,
					-11
				],
				[
					-8,
					-26
				],
				[
					-43,
					-4
				],
				[
					0,
					30
				],
				[
					4,
					24
				],
				[
					2,
					12
				]
			],
			[
				[
					5449,
					7880
				],
				[
					-5,
					-10
				],
				[
					-25,
					-1
				],
				[
					-14,
					-13
				],
				[
					-23,
					4
				]
			],
			[
				[
					5382,
					7860
				],
				[
					-39,
					15
				],
				[
					-6,
					20
				],
				[
					-28,
					-10
				],
				[
					-3,
					-11
				],
				[
					-17,
					8
				]
			],
			[
				[
					5289,
					7882
				],
				[
					-14,
					2
				],
				[
					-13,
					10
				],
				[
					5,
					14
				],
				[
					-2,
					11
				]
			],
			[
				[
					5265,
					7919
				],
				[
					9,
					3
				],
				[
					14,
					-16
				],
				[
					4,
					15
				],
				[
					24,
					-2
				],
				[
					20,
					10
				],
				[
					14,
					-2
				],
				[
					8,
					-12
				],
				[
					3,
					10
				],
				[
					-4,
					38
				],
				[
					10,
					7
				],
				[
					10,
					26
				]
			],
			[
				[
					5377,
					7996
				],
				[
					20,
					-18
				],
				[
					16,
					23
				],
				[
					10,
					5
				],
				[
					21,
					-18
				],
				[
					13,
					3
				],
				[
					13,
					-11
				]
			],
			[
				[
					5470,
					7980
				],
				[
					-2,
					-7
				],
				[
					3,
					-20
				]
			],
			[
				[
					5471,
					7953
				],
				[
					-2,
					-23
				],
				[
					-16,
					-1
				],
				[
					5,
					-12
				],
				[
					-9,
					-37
				]
			],
			[
				[
					6281,
					7413
				],
				[
					-19,
					7
				],
				[
					-14,
					27
				],
				[
					-5,
					22
				]
			],
			[
				[
					6357,
					7389
				],
				[
					-7,
					-3
				],
				[
					-18,
					30
				],
				[
					10,
					28
				],
				[
					-8,
					17
				],
				[
					-11,
					-4
				],
				[
					-32,
					-43
				]
			],
			[
				[
					6248,
					7557
				],
				[
					7,
					10
				],
				[
					21,
					-17
				],
				[
					15,
					-3
				],
				[
					3,
					6
				],
				[
					-13,
					31
				],
				[
					7,
					8
				]
			],
			[
				[
					6288,
					7592
				],
				[
					8,
					-2
				],
				[
					19,
					-34
				],
				[
					12,
					-4
				],
				[
					5,
					14
				],
				[
					16,
					23
				]
			],
			[
				[
					5805,
					5018
				],
				[
					17,
					-4
				],
				[
					9,
					33
				],
				[
					14,
					-4
				]
			],
			[
				[
					5845,
					5043
				],
				[
					2,
					-23
				],
				[
					6,
					-13
				],
				[
					0,
					-18
				],
				[
					-7,
					-13
				],
				[
					-11,
					-30
				],
				[
					-10,
					-20
				],
				[
					-11,
					-3
				]
			],
			[
				[
					5814,
					4923
				],
				[
					-2,
					69
				],
				[
					-7,
					26
				]
			],
			[
				[
					5170,
					8107
				],
				[
					-3,
					-39
				]
			],
			[
				[
					5167,
					8068
				],
				[
					-7,
					-2
				],
				[
					-3,
					-32
				]
			],
			[
				[
					5157,
					8034
				],
				[
					-25,
					26
				],
				[
					-14,
					-4
				],
				[
					-19,
					27
				],
				[
					-13,
					23
				],
				[
					-13,
					1
				],
				[
					-4,
					20
				]
			],
			[
				[
					5091,
					8139
				],
				[
					20,
					-5
				],
				[
					26,
					12
				],
				[
					18,
					-25
				],
				[
					15,
					-14
				]
			],
			[
				[
					5024,
					5815
				],
				[
					10,
					7
				],
				[
					5,
					25
				],
				[
					14,
					5
				],
				[
					6,
					18
				]
			],
			[
				[
					5059,
					5870
				],
				[
					9,
					16
				],
				[
					10,
					1
				],
				[
					21,
					-34
				]
			],
			[
				[
					5099,
					5853
				],
				[
					-1,
					-19
				],
				[
					6,
					-34
				],
				[
					-5,
					-23
				],
				[
					3,
					-16
				],
				[
					-14,
					-35
				],
				[
					-8,
					-18
				],
				[
					-5,
					-36
				],
				[
					0,
					-37
				],
				[
					-1,
					-93
				]
			],
			[
				[
					5051,
					5536
				],
				[
					-7,
					39
				],
				[
					1,
					133
				],
				[
					-5,
					11
				],
				[
					-1,
					29
				],
				[
					-10,
					20
				],
				[
					-9,
					17
				],
				[
					4,
					30
				]
			],
			[
				[
					4849,
					5779
				],
				[
					-2,
					34
				],
				[
					8,
					24
				],
				[
					-1,
					19
				],
				[
					22,
					48
				],
				[
					4,
					40
				],
				[
					8,
					14
				],
				[
					13,
					-8
				],
				[
					12,
					12
				],
				[
					4,
					15
				],
				[
					21,
					25
				],
				[
					5,
					18
				],
				[
					26,
					24
				],
				[
					16,
					8
				],
				[
					7,
					-11
				],
				[
					17,
					1
				]
			],
			[
				[
					5009,
					6042
				],
				[
					-2,
					-28
				],
				[
					4,
					-27
				],
				[
					16,
					-37
				],
				[
					0,
					-28
				],
				[
					32,
					-13
				],
				[
					0,
					-39
				]
			],
			[
				[
					5024,
					5815
				],
				[
					-24,
					1
				]
			],
			[
				[
					5000,
					5816
				],
				[
					-13,
					5
				],
				[
					-9,
					-9
				],
				[
					-12,
					4
				],
				[
					-49,
					-3
				],
				[
					0,
					-32
				],
				[
					3,
					-44
				]
			],
			[
				[
					4920,
					5737
				],
				[
					-19,
					15
				],
				[
					-13,
					-2
				],
				[
					-9,
					-15
				],
				[
					-13,
					13
				],
				[
					-5,
					19
				],
				[
					-12,
					12
				]
			],
			[
				[
					7472,
					6452
				],
				[
					-4,
					47
				],
				[
					-10,
					44
				],
				[
					5,
					34
				],
				[
					-17,
					16
				],
				[
					6,
					21
				],
				[
					17,
					21
				],
				[
					-20,
					31
				],
				[
					10,
					39
				],
				[
					22,
					-25
				],
				[
					13,
					-3
				],
				[
					3,
					-40
				],
				[
					26,
					-8
				],
				[
					26,
					1
				],
				[
					16,
					-10
				],
				[
					-13,
					-49
				],
				[
					-12,
					-3
				],
				[
					-9,
					-33
				],
				[
					15,
					-29
				],
				[
					5,
					36
				],
				[
					7,
					1
				],
				[
					15,
					-92
				]
			],
			[
				[
					7573,
					6451
				],
				[
					-1,
					-41
				],
				[
					-9,
					9
				],
				[
					2,
					-47
				]
			],
			[
				[
					5777,
					7601
				],
				[
					-24,
					8
				],
				[
					-29,
					-19
				]
			],
			[
				[
					5724,
					7590
				],
				[
					0,
					-28
				],
				[
					-25,
					-6
				],
				[
					-20,
					20
				],
				[
					-22,
					-15
				],
				[
					-20,
					1
				]
			],
			[
				[
					5637,
					7562
				],
				[
					-2,
					38
				],
				[
					-14,
					19
				]
			],
			[
				[
					5621,
					7619
				],
				[
					4,
					8
				],
				[
					-3,
					7
				],
				[
					5,
					18
				],
				[
					10,
					18
				],
				[
					-13,
					25
				],
				[
					-3,
					21
				],
				[
					7,
					13
				]
			],
			[
				[
					5628,
					7729
				],
				[
					8,
					-24
				],
				[
					11,
					5
				],
				[
					21,
					-9
				],
				[
					41,
					-3
				],
				[
					14,
					14
				],
				[
					33,
					14
				],
				[
					20,
					-21
				],
				[
					16,
					-6
				]
			],
			[
				[
					5533,
					7688
				],
				[
					-5,
					-5
				],
				[
					-9,
					-13
				],
				[
					-4,
					-32
				]
			],
			[
				[
					5515,
					7638
				],
				[
					-25,
					22
				],
				[
					-11,
					24
				],
				[
					-10,
					12
				],
				[
					-13,
					22
				],
				[
					-6,
					18
				],
				[
					-14,
					27
				],
				[
					6,
					24
				],
				[
					10,
					-14
				],
				[
					6,
					12
				],
				[
					13,
					2
				],
				[
					24,
					-10
				],
				[
					19,
					1
				],
				[
					13,
					-13
				]
			],
			[
				[
					5527,
					7765
				],
				[
					10,
					0
				],
				[
					-7,
					-25
				],
				[
					13,
					-22
				],
				[
					-4,
					-27
				],
				[
					-6,
					-3
				]
			],
			[
				[
					5735,
					8384
				],
				[
					17,
					10
				],
				[
					30,
					22
				]
			],
			[
				[
					5782,
					8416
				],
				[
					29,
					-14
				],
				[
					4,
					-14
				],
				[
					14,
					6
				],
				[
					28,
					-13
				],
				[
					2,
					-27
				],
				[
					-6,
					-16
				],
				[
					18,
					-38
				],
				[
					11,
					-10
				],
				[
					-2,
					-10
				],
				[
					19,
					-11
				],
				[
					8,
					-15
				],
				[
					-11,
					-12
				],
				[
					-22,
					2
				],
				[
					-5,
					-6
				],
				[
					6,
					-19
				],
				[
					7,
					-37
				]
			],
			[
				[
					5882,
					8182
				],
				[
					-24,
					-3
				],
				[
					-9,
					-13
				],
				[
					-1,
					-29
				],
				[
					-11,
					6
				],
				[
					-25,
					-3
				],
				[
					-8,
					13
				],
				[
					-10,
					-10
				],
				[
					-11,
					9
				],
				[
					-21,
					1
				],
				[
					-31,
					14
				],
				[
					-29,
					4
				],
				[
					-21,
					-1
				],
				[
					-15,
					-16
				],
				[
					-14,
					-2
				]
			],
			[
				[
					5652,
					8152
				],
				[
					0,
					26
				],
				[
					-9,
					26
				],
				[
					17,
					12
				],
				[
					0,
					23
				],
				[
					-8,
					22
				],
				[
					-1,
					25
				]
			],
			[
				[
					5651,
					8286
				],
				[
					27,
					0
				],
				[
					30,
					22
				],
				[
					7,
					32
				],
				[
					22,
					19
				],
				[
					-2,
					25
				]
			],
			[
				[
					2529,
					6097
				],
				[
					-8,
					0
				],
				[
					2,
					65
				],
				[
					0,
					45
				]
			],
			[
				[
					2523,
					6207
				],
				[
					0,
					9
				],
				[
					3,
					3
				],
				[
					5,
					-7
				],
				[
					10,
					34
				],
				[
					5,
					1
				]
			],
			[
				[
					3135,
					3873
				],
				[
					-20,
					-8
				],
				[
					-11,
					79
				],
				[
					-15,
					65
				],
				[
					9,
					56
				],
				[
					-15,
					24
				],
				[
					-3,
					41
				],
				[
					-14,
					40
				]
			],
			[
				[
					3066,
					4170
				],
				[
					18,
					62
				],
				[
					-12,
					48
				],
				[
					6,
					20
				],
				[
					-5,
					21
				],
				[
					11,
					29
				],
				[
					0,
					49
				],
				[
					2,
					40
				],
				[
					6,
					20
				],
				[
					-24,
					92
				]
			],
			[
				[
					3068,
					4551
				],
				[
					20,
					-5
				],
				[
					15,
					2
				],
				[
					6,
					17
				],
				[
					24,
					23
				],
				[
					15,
					22
				],
				[
					36,
					10
				],
				[
					-3,
					-43
				],
				[
					4,
					-22
				],
				[
					-3,
					-39
				],
				[
					31,
					-52
				],
				[
					31,
					-9
				],
				[
					11,
					-22
				],
				[
					18,
					-11
				],
				[
					12,
					-17
				],
				[
					17,
					1
				],
				[
					17,
					-17
				],
				[
					1,
					-34
				],
				[
					5,
					-16
				],
				[
					1,
					-25
				],
				[
					-9,
					-1
				],
				[
					11,
					-67
				],
				[
					53,
					-3
				],
				[
					-4,
					-33
				],
				[
					3,
					-23
				],
				[
					15,
					-16
				],
				[
					7,
					-36
				],
				[
					-5,
					-45
				],
				[
					-8,
					-25
				],
				[
					3,
					-33
				],
				[
					-9,
					-12
				]
			],
			[
				[
					3383,
					4020
				],
				[
					0,
					18
				],
				[
					-26,
					29
				],
				[
					-26,
					1
				],
				[
					-48,
					-17
				],
				[
					-13,
					-50
				],
				[
					-1,
					-31
				],
				[
					-11,
					-69
				]
			],
			[
				[
					3482,
					3700
				],
				[
					5,
					33
				],
				[
					4,
					34
				],
				[
					0,
					32
				],
				[
					-10,
					10
				],
				[
					-10,
					-9
				],
				[
					-11,
					2
				],
				[
					-3,
					23
				],
				[
					-3,
					52
				],
				[
					-5,
					18
				],
				[
					-19,
					15
				],
				[
					-11,
					-11
				],
				[
					-29,
					11
				],
				[
					2,
					78
				],
				[
					-9,
					32
				]
			],
			[
				[
					3068,
					4551
				],
				[
					-16,
					-10
				],
				[
					-12,
					7
				],
				[
					1,
					87
				],
				[
					-22,
					-33
				],
				[
					-25,
					1
				],
				[
					-10,
					31
				],
				[
					-19,
					3
				],
				[
					6,
					25
				],
				[
					-15,
					35
				],
				[
					-12,
					52
				],
				[
					7,
					10
				],
				[
					0,
					25
				],
				[
					17,
					16
				],
				[
					-3,
					31
				],
				[
					7,
					20
				],
				[
					2,
					27
				],
				[
					32,
					39
				],
				[
					23,
					12
				],
				[
					4,
					8
				],
				[
					25,
					-3
				]
			],
			[
				[
					3058,
					4934
				],
				[
					12,
					158
				],
				[
					1,
					25
				],
				[
					-5,
					33
				],
				[
					-12,
					21
				],
				[
					0,
					42
				],
				[
					16,
					10
				],
				[
					6,
					-6
				],
				[
					0,
					22
				],
				[
					-16,
					6
				],
				[
					0,
					36
				],
				[
					54,
					-2
				],
				[
					9,
					20
				],
				[
					8,
					-18
				],
				[
					5,
					-34
				],
				[
					6,
					7
				]
			],
			[
				[
					3142,
					5254
				],
				[
					15,
					-30
				],
				[
					21,
					3
				],
				[
					6,
					18
				],
				[
					20,
					13
				],
				[
					12,
					10
				],
				[
					3,
					24
				],
				[
					20,
					17
				],
				[
					-2,
					12
				],
				[
					-23,
					5
				],
				[
					-4,
					36
				],
				[
					1,
					39
				],
				[
					-12,
					15
				],
				[
					5,
					5
				],
				[
					21,
					-8
				],
				[
					22,
					-14
				],
				[
					8,
					14
				],
				[
					20,
					9
				],
				[
					31,
					21
				],
				[
					10,
					22
				],
				[
					-4,
					16
				]
			],
			[
				[
					3312,
					5481
				],
				[
					15,
					3
				],
				[
					6,
					-13
				],
				[
					-4,
					-26
				],
				[
					10,
					-8
				],
				[
					6,
					-27
				],
				[
					-7,
					-20
				],
				[
					-5,
					-49
				],
				[
					7,
					-29
				],
				[
					2,
					-27
				],
				[
					17,
					-27
				],
				[
					14,
					-3
				],
				[
					3,
					11
				],
				[
					9,
					3
				],
				[
					12,
					10
				],
				[
					9,
					15
				],
				[
					16,
					-5
				],
				[
					7,
					2
				]
			],
			[
				[
					3429,
					5291
				],
				[
					15,
					-4
				],
				[
					2,
					11
				],
				[
					-4,
					12
				],
				[
					2,
					17
				],
				[
					12,
					-6
				],
				[
					13,
					6
				],
				[
					16,
					-12
				]
			],
			[
				[
					3485,
					5315
				],
				[
					12,
					-12
				],
				[
					8,
					16
				],
				[
					7,
					-3
				],
				[
					3,
					-16
				],
				[
					14,
					4
				],
				[
					10,
					22
				],
				[
					9,
					43
				],
				[
					16,
					52
				]
			],
			[
				[
					3517,
					3237
				],
				[
					-8,
					33
				],
				[
					12,
					27
				],
				[
					-16,
					40
				],
				[
					-22,
					31
				],
				[
					-28,
					37
				],
				[
					-11,
					-1
				],
				[
					-28,
					44
				],
				[
					-18,
					-6
				]
			],
			[
				[
					8206,
					5496
				],
				[
					-2,
					-29
				],
				[
					-1,
					-36
				],
				[
					-13,
					1
				],
				[
					-6,
					-19
				],
				[
					-13,
					30
				]
			],
			[
				[
					7466,
					6754
				],
				[
					18,
					43
				],
				[
					15,
					14
				],
				[
					20,
					-13
				],
				[
					15,
					-1
				],
				[
					12,
					-16
				]
			],
			[
				[
					7546,
					6781
				],
				[
					11,
					-18
				],
				[
					-2,
					-36
				],
				[
					-22,
					-1
				],
				[
					-24,
					4
				],
				[
					-17,
					-9
				],
				[
					-26,
					21
				],
				[
					0,
					12
				]
			],
			[
				[
					5816,
					3910
				],
				[
					-39,
					-43
				],
				[
					-25,
					-43
				],
				[
					-9,
					-38
				],
				[
					-8,
					-22
				],
				[
					-15,
					-4
				],
				[
					-5,
					-28
				],
				[
					-3,
					-18
				],
				[
					-18,
					-13
				],
				[
					-23,
					3
				],
				[
					-13,
					16
				],
				[
					-12,
					7
				],
				[
					-13,
					-13
				],
				[
					-7,
					-28
				],
				[
					-13,
					-17
				],
				[
					-14,
					-26
				],
				[
					-20,
					-6
				],
				[
					-6,
					20
				],
				[
					3,
					35
				],
				[
					-17,
					55
				],
				[
					-7,
					9
				]
			],
			[
				[
					5552,
					3756
				],
				[
					0,
					168
				],
				[
					27,
					2
				],
				[
					1,
					205
				],
				[
					20,
					2
				],
				[
					43,
					20
				],
				[
					11,
					-24
				],
				[
					18,
					23
				],
				[
					8,
					0
				],
				[
					16,
					13
				]
			],
			[
				[
					5696,
					4165
				],
				[
					5,
					-4
				]
			],
			[
				[
					5701,
					4161
				],
				[
					10,
					-46
				],
				[
					6,
					-11
				],
				[
					9,
					-33
				],
				[
					31,
					-63
				],
				[
					12,
					-6
				],
				[
					0,
					-21
				],
				[
					8,
					-36
				],
				[
					22,
					-9
				],
				[
					17,
					-26
				]
			],
			[
				[
					5634,
					5824
				],
				[
					3,
					-25
				],
				[
					16,
					-36
				],
				[
					0,
					-24
				],
				[
					-4,
					-24
				],
				[
					2,
					-17
				],
				[
					9,
					-17
				]
			],
			[
				[
					5660,
					5681
				],
				[
					21,
					-25
				]
			],
			[
				[
					5681,
					5656
				],
				[
					16,
					-23
				],
				[
					0,
					-19
				],
				[
					19,
					-30
				],
				[
					11,
					-25
				],
				[
					7,
					-35
				],
				[
					21,
					-22
				],
				[
					4,
					-19
				]
			],
			[
				[
					5759,
					5483
				],
				[
					-9,
					-6
				],
				[
					-18,
					2
				],
				[
					-21,
					6
				],
				[
					-10,
					-5
				],
				[
					-4,
					-14
				],
				[
					-9,
					-2
				],
				[
					-11,
					12
				],
				[
					-31,
					-29
				],
				[
					-13,
					6
				],
				[
					-3,
					-4
				],
				[
					-9,
					-35
				],
				[
					-20,
					11
				],
				[
					-21,
					6
				],
				[
					-17,
					21
				],
				[
					-23,
					20
				],
				[
					-15,
					-19
				],
				[
					-11,
					-29
				],
				[
					-2,
					-40
				]
			],
			[
				[
					5512,
					5384
				],
				[
					-18,
					3
				],
				[
					-19,
					10
				],
				[
					-17,
					-31
				],
				[
					-14,
					-53
				]
			],
			[
				[
					5444,
					5313
				],
				[
					-3,
					16
				],
				[
					-1,
					26
				],
				[
					-13,
					19
				],
				[
					-10,
					30
				],
				[
					-3,
					20
				],
				[
					-13,
					30
				],
				[
					2,
					18
				],
				[
					-2,
					24
				],
				[
					2,
					45
				],
				[
					6,
					10
				],
				[
					14,
					58
				]
			],
			[
				[
					5423,
					5609
				],
				[
					23,
					5
				],
				[
					5,
					14
				],
				[
					5,
					-1
				],
				[
					7,
					-13
				],
				[
					35,
					22
				],
				[
					12,
					23
				],
				[
					14,
					20
				],
				[
					-2,
					20
				],
				[
					7,
					6
				],
				[
					27,
					-4
				],
				[
					26,
					27
				],
				[
					20,
					62
				],
				[
					14,
					24
				],
				[
					18,
					10
				]
			],
			[
				[
					1300,
					8301
				],
				[
					13,
					-7
				],
				[
					27,
					4
				],
				[
					-9,
					-65
				],
				[
					25,
					-46
				],
				[
					-12,
					0
				],
				[
					-16,
					26
				],
				[
					-11,
					27
				],
				[
					-14,
					18
				],
				[
					-5,
					25
				],
				[
					2,
					18
				]
			],
			[
				[
					3134,
					7781
				],
				[
					-18,
					33
				],
				[
					0,
					78
				],
				[
					-12,
					17
				],
				[
					-19,
					-10
				],
				[
					-9,
					15
				],
				[
					-21,
					-43
				],
				[
					-9,
					-45
				],
				[
					-10,
					-26
				],
				[
					-11,
					-9
				],
				[
					-9,
					-3
				],
				[
					-3,
					-14
				],
				[
					-51,
					0
				],
				[
					-42,
					-1
				],
				[
					-13,
					-10
				],
				[
					-29,
					-42
				],
				[
					-4,
					-4
				],
				[
					-9,
					-23
				],
				[
					-25,
					0
				],
				[
					-27,
					0
				],
				[
					-13,
					-9
				],
				[
					4,
					-11
				],
				[
					3,
					-18
				],
				[
					-1,
					-6
				],
				[
					-36,
					-28
				],
				[
					-28,
					-10
				],
				[
					-33,
					-30
				],
				[
					-7,
					0
				],
				[
					-9,
					9
				],
				[
					-3,
					8
				],
				[
					0,
					6
				],
				[
					6,
					20
				],
				[
					14,
					32
				],
				[
					8,
					34
				],
				[
					-6,
					50
				],
				[
					-6,
					52
				],
				[
					-29,
					27
				],
				[
					4,
					10
				],
				[
					-4,
					8
				],
				[
					-8,
					0
				],
				[
					-6,
					9
				],
				[
					-1,
					13
				],
				[
					-5,
					-6
				],
				[
					-8,
					2
				],
				[
					2,
					6
				],
				[
					-7,
					5
				],
				[
					-2,
					16
				],
				[
					-22,
					18
				],
				[
					-22,
					19
				],
				[
					-28,
					22
				],
				[
					-26,
					21
				],
				[
					-25,
					-16
				],
				[
					-9,
					0
				],
				[
					-34,
					14
				],
				[
					-22,
					-7
				],
				[
					-27,
					18
				],
				[
					-29,
					9
				],
				[
					-19,
					4
				],
				[
					-9,
					9
				],
				[
					-5,
					32
				],
				[
					-9,
					0
				],
				[
					0,
					-22
				],
				[
					-58,
					0
				],
				[
					-95,
					0
				],
				[
					-94,
					0
				],
				[
					-83,
					0
				],
				[
					-84,
					0
				],
				[
					-82,
					0
				],
				[
					-84,
					0
				],
				[
					-28,
					0
				],
				[
					-82,
					0
				],
				[
					-79,
					0
				]
			],
			[
				[
					1373,
					8338
				],
				[
					16,
					27
				],
				[
					-1,
					37
				],
				[
					-47,
					36
				],
				[
					-29,
					66
				],
				[
					-17,
					41
				],
				[
					-25,
					26
				],
				[
					-19,
					24
				],
				[
					-15,
					30
				],
				[
					-28,
					-19
				],
				[
					-27,
					-32
				],
				[
					-24,
					38
				],
				[
					-20,
					25
				],
				[
					-27,
					16
				],
				[
					-27,
					2
				],
				[
					0,
					327
				],
				[
					0,
					214
				]
			],
			[
				[
					1440,
					9241
				],
				[
					19,
					-7
				],
				[
					47,
					-51
				]
			],
			[
				[
					2457,
					9224
				],
				[
					-25,
					-29
				],
				[
					52,
					-11
				]
			],
			[
				[
					1972,
					9143
				],
				[
					-71,
					-9
				],
				[
					-49,
					-6
				]
			],
			[
				[
					1501,
					9320
				],
				[
					12,
					25
				],
				[
					19,
					42
				]
			],
			[
				[
					1653,
					9318
				],
				[
					0,
					-26
				],
				[
					-73,
					-27
				]
			],
			[
				[
					5289,
					7882
				],
				[
					-2,
					-23
				],
				[
					-12,
					-10
				],
				[
					-21,
					7
				],
				[
					-6,
					-23
				],
				[
					-13,
					-2
				],
				[
					-5,
					9
				],
				[
					-16,
					-19
				],
				[
					-13,
					-3
				],
				[
					-12,
					12
				]
			],
			[
				[
					5189,
					7830
				],
				[
					-9,
					26
				],
				[
					-14,
					-9
				],
				[
					1,
					26
				],
				[
					20,
					32
				],
				[
					-1,
					15
				],
				[
					13,
					-6
				],
				[
					7,
					10
				]
			],
			[
				[
					5206,
					7924
				],
				[
					24,
					0
				],
				[
					6,
					12
				],
				[
					29,
					-17
				]
			],
			[
				[
					3139,
					2021
				],
				[
					-9,
					-23
				],
				[
					-24,
					-18
				]
			],
			[
				[
					3106,
					1980
				],
				[
					-13,
					2
				],
				[
					-17,
					4
				]
			],
			[
				[
					3076,
					1986
				],
				[
					-20,
					17
				],
				[
					-29,
					9
				],
				[
					-35,
					32
				],
				[
					-28,
					31
				],
				[
					-39,
					64
				],
				[
					23,
					-12
				],
				[
					39,
					-38
				],
				[
					37,
					-21
				],
				[
					14,
					27
				],
				[
					9,
					39
				],
				[
					26,
					24
				],
				[
					20,
					-7
				]
			],
			[
				[
					3044,
					4125
				],
				[
					15,
					15
				],
				[
					7,
					30
				]
			],
			[
				[
					8628,
					7623
				],
				[
					-18,
					34
				],
				[
					-11,
					-32
				],
				[
					-43,
					-25
				],
				[
					4,
					-30
				],
				[
					-24,
					2
				],
				[
					-13,
					18
				],
				[
					-19,
					-41
				],
				[
					-31,
					-31
				],
				[
					-23,
					-37
				]
			],
			[
				[
					8000,
					6423
				],
				[
					-28,
					15
				],
				[
					-13,
					23
				],
				[
					4,
					34
				],
				[
					-25,
					10
				],
				[
					-13,
					22
				],
				[
					-24,
					-31
				],
				[
					-27,
					-7
				],
				[
					-22,
					1
				],
				[
					-15,
					-14
				]
			],
			[
				[
					7837,
					6476
				],
				[
					-15,
					-9
				],
				[
					5,
					-66
				],
				[
					-15,
					2
				],
				[
					-3,
					13
				]
			],
			[
				[
					7809,
					6416
				],
				[
					-1,
					24
				],
				[
					-20,
					-17
				],
				[
					-12,
					11
				],
				[
					-21,
					22
				],
				[
					9,
					47
				],
				[
					-18,
					12
				],
				[
					-7,
					53
				],
				[
					-29,
					-10
				],
				[
					3,
					68
				],
				[
					27,
					48
				],
				[
					1,
					48
				],
				[
					-1,
					44
				],
				[
					-12,
					14
				],
				[
					-9,
					34
				],
				[
					-17,
					-5
				]
			],
			[
				[
					7702,
					6809
				],
				[
					-30,
					9
				],
				[
					10,
					24
				],
				[
					-13,
					36
				],
				[
					-20,
					-24
				],
				[
					-23,
					14
				],
				[
					-32,
					-37
				],
				[
					-26,
					-43
				],
				[
					-22,
					-7
				]
			],
			[
				[
					7466,
					6754
				],
				[
					-3,
					45
				],
				[
					-16,
					-12
				]
			],
			[
				[
					7447,
					6787
				],
				[
					-33,
					6
				],
				[
					-31,
					13
				],
				[
					-23,
					25
				],
				[
					-21,
					12
				],
				[
					-10,
					27
				],
				[
					-15,
					9
				],
				[
					-28,
					37
				],
				[
					-23,
					18
				],
				[
					-11,
					-14
				]
			],
			[
				[
					7252,
					6920
				],
				[
					-39,
					40
				],
				[
					-27,
					37
				],
				[
					-8,
					63
				],
				[
					20,
					-8
				],
				[
					1,
					30
				],
				[
					-11,
					29
				],
				[
					3,
					47
				],
				[
					-30,
					68
				]
			],
			[
				[
					7161,
					7226
				],
				[
					-46,
					23
				],
				[
					-8,
					44
				],
				[
					-20,
					27
				]
			],
			[
				[
					7082,
					7337
				],
				[
					-5,
					33
				],
				[
					1,
					22
				],
				[
					-16,
					13
				],
				[
					-10,
					-6
				],
				[
					-7,
					54
				]
			],
			[
				[
					7045,
					7453
				],
				[
					8,
					13
				],
				[
					-4,
					13
				],
				[
					27,
					27
				],
				[
					19,
					12
				],
				[
					30,
					-8
				],
				[
					10,
					37
				],
				[
					36,
					7
				],
				[
					10,
					22
				],
				[
					43,
					32
				],
				[
					4,
					13
				]
			],
			[
				[
					7228,
					7621
				],
				[
					-2,
					32
				],
				[
					19,
					15
				],
				[
					-25,
					100
				],
				[
					55,
					23
				],
				[
					14,
					13
				],
				[
					20,
					103
				],
				[
					55,
					-19
				],
				[
					16,
					26
				],
				[
					1,
					58
				],
				[
					23,
					6
				],
				[
					21,
					38
				]
			],
			[
				[
					7425,
					8016
				],
				[
					11,
					5
				]
			],
			[
				[
					7436,
					8021
				],
				[
					8,
					-41
				],
				[
					23,
					-30
				],
				[
					40,
					-22
				],
				[
					19,
					-46
				],
				[
					-11,
					-67
				],
				[
					10,
					-25
				],
				[
					33,
					-10
				],
				[
					37,
					-8
				],
				[
					34,
					-36
				],
				[
					17,
					-6
				],
				[
					13,
					-54
				],
				[
					16,
					-34
				],
				[
					31,
					2
				],
				[
					57,
					-13
				],
				[
					37,
					8
				],
				[
					27,
					-9
				],
				[
					41,
					-35
				],
				[
					34,
					0
				],
				[
					12,
					-18
				],
				[
					33,
					31
				],
				[
					45,
					20
				],
				[
					41,
					2
				],
				[
					33,
					21
				],
				[
					20,
					30
				],
				[
					19,
					20
				],
				[
					-4,
					19
				],
				[
					-9,
					22
				],
				[
					14,
					37
				],
				[
					16,
					-5
				],
				[
					28,
					-12
				],
				[
					28,
					31
				],
				[
					42,
					22
				],
				[
					21,
					38
				],
				[
					19,
					17
				],
				[
					41,
					7
				],
				[
					22,
					-6
				],
				[
					3,
					20
				],
				[
					-25,
					40
				],
				[
					-23,
					19
				],
				[
					-21,
					-21
				],
				[
					-28,
					9
				],
				[
					-15,
					-8
				],
				[
					-7,
					24
				],
				[
					19,
					57
				],
				[
					14,
					44
				]
			],
			[
				[
					8240,
					8055
				],
				[
					33,
					-22
				],
				[
					39,
					36
				],
				[
					0,
					26
				],
				[
					25,
					61
				],
				[
					16,
					18
				],
				[
					-1,
					32
				],
				[
					-15,
					14
				],
				[
					23,
					28
				],
				[
					34,
					11
				],
				[
					37,
					1
				],
				[
					42,
					-17
				],
				[
					24,
					-21
				],
				[
					17,
					-58
				],
				[
					11,
					-25
				],
				[
					9,
					-35
				],
				[
					11,
					-57
				],
				[
					48,
					-18
				],
				[
					33,
					-41
				],
				[
					11,
					-54
				],
				[
					42,
					0
				],
				[
					24,
					23
				],
				[
					46,
					16
				],
				[
					-14,
					-51
				],
				[
					-11,
					-21
				],
				[
					-10,
					-63
				],
				[
					-18,
					-57
				],
				[
					-34,
					11
				],
				[
					-24,
					-21
				],
				[
					8,
					-49
				],
				[
					-4,
					-68
				],
				[
					-15,
					-2
				],
				[
					1,
					-29
				]
			],
			[
				[
					4785,
					5433
				],
				[
					2,
					48
				],
				[
					3,
					7
				],
				[
					-1,
					23
				],
				[
					-12,
					24
				],
				[
					-9,
					4
				],
				[
					-8,
					15
				],
				[
					6,
					26
				],
				[
					-3,
					28
				],
				[
					2,
					17
				]
			],
			[
				[
					4765,
					5625
				],
				[
					4,
					0
				],
				[
					2,
					25
				],
				[
					-3,
					11
				],
				[
					3,
					8
				],
				[
					10,
					7
				],
				[
					-6,
					46
				],
				[
					-7,
					24
				],
				[
					2,
					19
				],
				[
					6,
					5
				]
			],
			[
				[
					4776,
					5770
				],
				[
					4,
					5
				],
				[
					7,
					-9
				],
				[
					22,
					0
				],
				[
					5,
					17
				],
				[
					5,
					-2
				],
				[
					8,
					7
				],
				[
					4,
					-25
				],
				[
					6,
					8
				],
				[
					12,
					8
				]
			],
			[
				[
					4920,
					5737
				],
				[
					8,
					-82
				],
				[
					-12,
					-48
				],
				[
					-7,
					-65
				],
				[
					12,
					-50
				],
				[
					-1,
					-22
				]
			],
			[
				[
					5312,
					5312
				],
				[
					-45,
					1
				]
			],
			[
				[
					5235,
					5457
				],
				[
					7,
					41
				],
				[
					13,
					55
				],
				[
					8,
					1
				],
				[
					17,
					33
				],
				[
					11,
					1
				],
				[
					15,
					-23
				],
				[
					19,
					19
				],
				[
					3,
					24
				],
				[
					6,
					23
				],
				[
					4,
					29
				],
				[
					15,
					24
				],
				[
					6,
					40
				],
				[
					6,
					13
				],
				[
					4,
					30
				],
				[
					7,
					37
				],
				[
					23,
					44
				],
				[
					2,
					19
				],
				[
					3,
					11
				],
				[
					-11,
					23
				]
			],
			[
				[
					5393,
					5901
				],
				[
					1,
					18
				],
				[
					8,
					3
				]
			],
			[
				[
					5402,
					5922
				],
				[
					11,
					-36
				],
				[
					2,
					-39
				],
				[
					-1,
					-38
				],
				[
					15,
					-52
				],
				[
					-16,
					0
				],
				[
					-8,
					-4
				],
				[
					-12,
					6
				],
				[
					-6,
					-27
				],
				[
					16,
					-34
				],
				[
					12,
					-10
				],
				[
					4,
					-23
				],
				[
					9,
					-40
				],
				[
					-5,
					-16
				]
			],
			[
				[
					5444,
					5313
				],
				[
					-2,
					-32
				],
				[
					-22,
					14
				],
				[
					-23,
					15
				],
				[
					-35,
					3
				]
			],
			[
				[
					5362,
					5313
				],
				[
					-3,
					3
				],
				[
					-17,
					-8
				],
				[
					-17,
					8
				],
				[
					-13,
					-4
				]
			],
			[
				[
					5821,
					5105
				],
				[
					-8,
					-16
				],
				[
					-1,
					-35
				],
				[
					-4,
					-4
				],
				[
					-3,
					-32
				]
			],
			[
				[
					5814,
					4923
				],
				[
					5,
					-53
				],
				[
					-3,
					-30
				],
				[
					6,
					-33
				],
				[
					16,
					-33
				],
				[
					15,
					-72
				]
			],
			[
				[
					5853,
					4702
				],
				[
					-11,
					6
				],
				[
					-37,
					-10
				],
				[
					-8,
					-7
				],
				[
					-8,
					-37
				],
				[
					6,
					-25
				],
				[
					-5,
					-68
				],
				[
					-3,
					-58
				],
				[
					8,
					-10
				],
				[
					19,
					-23
				],
				[
					8,
					11
				],
				[
					2,
					-62
				],
				[
					-21,
					0
				],
				[
					-12,
					32
				],
				[
					-10,
					24
				],
				[
					-21,
					8
				],
				[
					-7,
					31
				],
				[
					-16,
					-19
				],
				[
					-23,
					8
				],
				[
					-9,
					26
				],
				[
					-18,
					6
				],
				[
					-13,
					-2
				],
				[
					-1,
					18
				],
				[
					-10,
					2
				]
			],
			[
				[
					5360,
					4907
				],
				[
					7,
					-6
				],
				[
					10,
					22
				],
				[
					15,
					-1
				],
				[
					2,
					-16
				],
				[
					10,
					-10
				],
				[
					16,
					36
				],
				[
					17,
					28
				],
				[
					7,
					18
				],
				[
					-1,
					48
				],
				[
					12,
					56
				],
				[
					12,
					29
				],
				[
					19,
					28
				],
				[
					3,
					19
				],
				[
					1,
					21
				],
				[
					4,
					20
				],
				[
					-1,
					32
				],
				[
					3,
					51
				],
				[
					6,
					36
				],
				[
					8,
					31
				],
				[
					2,
					35
				]
			],
			[
				[
					5759,
					5483
				],
				[
					17,
					-47
				],
				[
					13,
					-7
				],
				[
					7,
					10
				],
				[
					13,
					-4
				],
				[
					15,
					12
				],
				[
					7,
					-25
				],
				[
					24,
					-38
				]
			],
			[
				[
					5855,
					5384
				],
				[
					-1,
					-67
				],
				[
					11,
					-8
				],
				[
					-9,
					-21
				],
				[
					-11,
					-15
				],
				[
					-10,
					-30
				],
				[
					-6,
					-27
				],
				[
					-2,
					-46
				],
				[
					-6,
					-22
				],
				[
					0,
					-43
				]
			],
			[
				[
					5307,
					4953
				],
				[
					21,
					32
				],
				[
					-10,
					38
				],
				[
					9,
					14
				],
				[
					19,
					7
				],
				[
					2,
					26
				],
				[
					15,
					-28
				],
				[
					25,
					-2
				],
				[
					8,
					27
				],
				[
					4,
					38
				],
				[
					-3,
					45
				],
				[
					-14,
					34
				],
				[
					13,
					67
				],
				[
					-7,
					11
				],
				[
					-21,
					-4
				],
				[
					-8,
					29
				],
				[
					2,
					26
				]
			],
			[
				[
					2836,
					5598
				],
				[
					3,
					28
				],
				[
					9,
					-4
				],
				[
					6,
					17
				],
				[
					-7,
					34
				],
				[
					4,
					8
				]
			],
			[
				[
					3018,
					5860
				],
				[
					-18,
					-10
				],
				[
					-7,
					-28
				],
				[
					-11,
					-17
				],
				[
					-8,
					-21
				],
				[
					-3,
					-41
				],
				[
					-8,
					-34
				],
				[
					14,
					-4
				],
				[
					4,
					-26
				],
				[
					6,
					-13
				],
				[
					2,
					-23
				],
				[
					-3,
					-22
				],
				[
					1,
					-12
				],
				[
					7,
					-4
				],
				[
					6,
					-20
				],
				[
					36,
					5
				],
				[
					16,
					-7
				],
				[
					20,
					-50
				],
				[
					11,
					6
				],
				[
					20,
					-3
				],
				[
					16,
					7
				],
				[
					10,
					-10
				],
				[
					-5,
					-31
				],
				[
					-7,
					-19
				],
				[
					-2,
					-42
				],
				[
					6,
					-38
				],
				[
					8,
					-17
				],
				[
					1,
					-13
				],
				[
					-14,
					-29
				],
				[
					10,
					-12
				],
				[
					7,
					-20
				],
				[
					9,
					-58
				]
			],
			[
				[
					3058,
					4934
				],
				[
					-14,
					31
				],
				[
					-8,
					1
				],
				[
					17,
					59
				],
				[
					-21,
					27
				],
				[
					-17,
					-5
				],
				[
					-10,
					10
				],
				[
					-15,
					-15
				],
				[
					-21,
					7
				],
				[
					-16,
					60
				],
				[
					-13,
					15
				],
				[
					-9,
					27
				],
				[
					-18,
					28
				],
				[
					-7,
					-6
				]
			],
			[
				[
					2906,
					5173
				],
				[
					-12,
					14
				],
				[
					-14,
					19
				],
				[
					-8,
					-9
				],
				[
					-23,
					8
				],
				[
					-7,
					25
				],
				[
					-5,
					-1
				],
				[
					-28,
					32
				]
			],
			[
				[
					2618,
					5820
				],
				[
					5,
					8
				],
				[
					18,
					-15
				],
				[
					6,
					7
				],
				[
					9,
					-5
				],
				[
					5,
					-12
				],
				[
					8,
					-3
				],
				[
					6,
					12
				]
			],
			[
				[
					2706,
					5733
				],
				[
					-10,
					-5
				],
				[
					0,
					-24
				],
				[
					5,
					-8
				],
				[
					-4,
					-7
				],
				[
					1,
					-10
				],
				[
					-2,
					-12
				],
				[
					-1,
					-11
				]
			],
			[
				[
					2714,
					6517
				],
				[
					24,
					-4
				],
				[
					22,
					-1
				],
				[
					26,
					-19
				],
				[
					11,
					-21
				],
				[
					26,
					6
				],
				[
					10,
					-13
				],
				[
					23,
					-36
				],
				[
					18,
					-26
				],
				[
					9,
					1
				],
				[
					16,
					-12
				],
				[
					-2,
					-16
				],
				[
					21,
					-2
				],
				[
					21,
					-24
				],
				[
					-4,
					-13
				],
				[
					-18,
					-8
				],
				[
					-19,
					-3
				],
				[
					-19,
					5
				],
				[
					-40,
					-6
				],
				[
					19,
					32
				],
				[
					-11,
					15
				],
				[
					-18,
					4
				],
				[
					-10,
					17
				],
				[
					-6,
					33
				],
				[
					-16,
					-3
				],
				[
					-26,
					16
				],
				[
					-8,
					12
				],
				[
					-37,
					9
				],
				[
					-9,
					11
				],
				[
					10,
					14
				],
				[
					-27,
					3
				],
				[
					-20,
					-30
				],
				[
					-12,
					0
				],
				[
					-4,
					-14
				],
				[
					-13,
					-7
				],
				[
					-12,
					6
				],
				[
					14,
					18
				],
				[
					7,
					20
				],
				[
					12,
					13
				],
				[
					14,
					11
				],
				[
					21,
					6
				],
				[
					7,
					6
				]
			],
			[
				[
					5943,
					7201
				],
				[
					-3,
					2
				],
				[
					-6,
					-5
				],
				[
					-4,
					2
				],
				[
					-1,
					-3
				],
				[
					-1,
					6
				],
				[
					-2,
					4
				],
				[
					-5,
					0
				],
				[
					-8,
					-5
				],
				[
					-5,
					3
				]
			],
			[
				[
					5377,
					7996
				],
				[
					-16,
					25
				],
				[
					-14,
					14
				],
				[
					-3,
					24
				],
				[
					-5,
					17
				],
				[
					20,
					13
				],
				[
					10,
					14
				],
				[
					20,
					11
				],
				[
					7,
					11
				],
				[
					8,
					-6
				],
				[
					12,
					6
				]
			],
			[
				[
					5416,
					8125
				],
				[
					13,
					-19
				],
				[
					21,
					-5
				],
				[
					-2,
					-16
				],
				[
					15,
					-11
				],
				[
					5,
					14
				],
				[
					19,
					-6
				],
				[
					2,
					-18
				],
				[
					21,
					-4
				],
				[
					13,
					-28
				]
			],
			[
				[
					5523,
					8032
				],
				[
					-9,
					0
				],
				[
					-4,
					-10
				],
				[
					-6,
					-3
				],
				[
					-2,
					-13
				],
				[
					-5,
					-3
				],
				[
					-1,
					-5
				],
				[
					-10,
					-6
				],
				[
					-12,
					1
				],
				[
					-4,
					-13
				]
			],
			[
				[
					5391,
					8277
				],
				[
					7,
					-29
				],
				[
					-8,
					-15
				],
				[
					10,
					-21
				],
				[
					7,
					-31
				],
				[
					-2,
					-19
				],
				[
					11,
					-37
				]
			],
			[
				[
					5206,
					7924
				],
				[
					4,
					41
				],
				[
					14,
					40
				],
				[
					-40,
					10
				],
				[
					-13,
					15
				]
			],
			[
				[
					5171,
					8030
				],
				[
					1,
					25
				],
				[
					-5,
					13
				]
			],
			[
				[
					5170,
					8107
				],
				[
					-5,
					61
				],
				[
					17,
					0
				],
				[
					7,
					21
				],
				[
					7,
					53
				],
				[
					-5,
					20
				]
			],
			[
				[
					5236,
					8347
				],
				[
					21,
					-8
				],
				[
					18,
					9
				]
			],
			[
				[
					6197,
					5842
				],
				[
					-10,
					-31
				]
			],
			[
				[
					6187,
					5811
				],
				[
					-6,
					10
				],
				[
					-7,
					-4
				],
				[
					-15,
					1
				],
				[
					-1,
					18
				],
				[
					-2,
					16
				],
				[
					10,
					27
				],
				[
					9,
					25
				]
			],
			[
				[
					6175,
					5904
				],
				[
					12,
					-5
				],
				[
					9,
					14
				]
			],
			[
				[
					3007,
					6221
				],
				[
					1,
					16
				],
				[
					-7,
					17
				],
				[
					6,
					10
				],
				[
					3,
					22
				],
				[
					-3,
					31
				]
			],
			[
				[
					5118,
					6285
				],
				[
					-31,
					-6
				],
				[
					-1,
					37
				],
				[
					-12,
					9
				],
				[
					-18,
					17
				],
				[
					-6,
					27
				],
				[
					-94,
					125
				],
				[
					-94,
					126
				]
			],
			[
				[
					4862,
					6620
				],
				[
					-104,
					139
				]
			],
			[
				[
					4758,
					6759
				],
				[
					0,
					12
				],
				[
					0,
					4
				]
			],
			[
				[
					4758,
					6775
				],
				[
					0,
					68
				],
				[
					45,
					42
				],
				[
					28,
					9
				],
				[
					22,
					15
				],
				[
					11,
					29
				],
				[
					32,
					23
				],
				[
					2,
					43
				],
				[
					16,
					5
				],
				[
					12,
					21
				],
				[
					37,
					10
				],
				[
					5,
					22
				],
				[
					-8,
					12
				],
				[
					-9,
					61
				],
				[
					-2,
					35
				],
				[
					-10,
					37
				]
			],
			[
				[
					5233,
					7309
				],
				[
					-6,
					-29
				],
				[
					5,
					-55
				],
				[
					-7,
					-47
				],
				[
					-17,
					-33
				],
				[
					2,
					-43
				],
				[
					23,
					-34
				],
				[
					0,
					-14
				],
				[
					18,
					-23
				],
				[
					11,
					-104
				]
			],
			[
				[
					5262,
					6927
				],
				[
					9,
					-51
				],
				[
					2,
					-26
				],
				[
					-5,
					-47
				],
				[
					2,
					-27
				],
				[
					-4,
					-31
				],
				[
					3,
					-36
				],
				[
					-11,
					-24
				],
				[
					16,
					-42
				],
				[
					1,
					-25
				],
				[
					10,
					-32
				],
				[
					13,
					10
				],
				[
					22,
					-26
				],
				[
					12,
					-36
				]
			],
			[
				[
					5332,
					6534
				],
				[
					-95,
					-110
				],
				[
					-80,
					-113
				],
				[
					-39,
					-26
				]
			],
			[
				[
					2906,
					5173
				],
				[
					3,
					-44
				],
				[
					-8,
					-37
				],
				[
					-31,
					-60
				],
				[
					-33,
					-23
				],
				[
					-17,
					-50
				],
				[
					-5,
					-39
				],
				[
					-16,
					-24
				],
				[
					-12,
					29
				],
				[
					-11,
					7
				],
				[
					-11,
					-5
				],
				[
					-1,
					21
				],
				[
					8,
					14
				],
				[
					-3,
					24
				]
			],
			[
				[
					6023,
					6449
				],
				[
					-110,
					0
				],
				[
					-108,
					0
				],
				[
					-112,
					0
				]
			],
			[
				[
					5693,
					6449
				],
				[
					0,
					212
				],
				[
					0,
					205
				],
				[
					-8,
					46
				],
				[
					7,
					36
				],
				[
					-4,
					24
				],
				[
					10,
					28
				]
			],
			[
				[
					5951,
					6980
				],
				[
					18,
					-99
				]
			],
			[
				[
					6011,
					6012
				],
				[
					-3,
					23
				],
				[
					12,
					85
				],
				[
					3,
					38
				],
				[
					8,
					18
				],
				[
					21,
					9
				],
				[
					14,
					33
				]
			],
			[
				[
					6175,
					5904
				],
				[
					-9,
					19
				],
				[
					-12,
					34
				],
				[
					-12,
					18
				],
				[
					-7,
					20
				],
				[
					-24,
					23
				],
				[
					-19,
					1
				],
				[
					-7,
					12
				],
				[
					-16,
					-14
				],
				[
					-17,
					26
				],
				[
					-9,
					-43
				],
				[
					-32,
					12
				]
			],
			[
				[
					4946,
					7682
				],
				[
					11,
					-22
				],
				[
					51,
					-26
				],
				[
					10,
					12
				],
				[
					32,
					-26
				],
				[
					32,
					8
				]
			],
			[
				[
					4792,
					7318
				],
				[
					-2,
					19
				],
				[
					10,
					22
				],
				[
					4,
					15
				],
				[
					-10,
					18
				],
				[
					8,
					37
				],
				[
					-11,
					35
				],
				[
					12,
					5
				],
				[
					1,
					27
				],
				[
					4,
					8
				],
				[
					1,
					45
				],
				[
					13,
					16
				],
				[
					-8,
					29
				],
				[
					-16,
					2
				],
				[
					-5,
					-8
				],
				[
					-17,
					0
				],
				[
					-7,
					29
				],
				[
					-11,
					-9
				],
				[
					-10,
					-14
				]
			],
			[
				[
					5776,
					8607
				],
				[
					4,
					-10
				],
				[
					-19,
					-33
				],
				[
					8,
					-54
				],
				[
					-12,
					-18
				]
			],
			[
				[
					5757,
					8492
				],
				[
					-23,
					0
				],
				[
					-24,
					21
				],
				[
					-12,
					7
				],
				[
					-24,
					-10
				]
			],
			[
				[
					6187,
					5811
				],
				[
					-6,
					-20
				],
				[
					10,
					-32
				],
				[
					11,
					-28
				],
				[
					10,
					-20
				],
				[
					91,
					-69
				],
				[
					23,
					1
				]
			],
			[
				[
					6326,
					5643
				],
				[
					-78,
					-173
				],
				[
					-36,
					-3
				],
				[
					-25,
					-40
				],
				[
					-18,
					-1
				],
				[
					-7,
					-18
				]
			],
			[
				[
					6162,
					5408
				],
				[
					-19,
					0
				],
				[
					-12,
					19
				],
				[
					-25,
					-24
				],
				[
					-8,
					-24
				],
				[
					-19,
					5
				],
				[
					-6,
					6
				],
				[
					-6,
					-1
				],
				[
					-9,
					0
				],
				[
					-35,
					49
				],
				[
					-20,
					0
				],
				[
					-9,
					19
				],
				[
					0,
					32
				],
				[
					-15,
					10
				]
			],
			[
				[
					5979,
					5499
				],
				[
					-16,
					63
				],
				[
					-13,
					13
				],
				[
					-5,
					23
				],
				[
					-14,
					28
				],
				[
					-17,
					4
				],
				[
					10,
					33
				],
				[
					15,
					1
				],
				[
					4,
					18
				]
			],
			[
				[
					5943,
					5682
				],
				[
					-1,
					52
				]
			],
			[
				[
					5942,
					5734
				],
				[
					9,
					60
				],
				[
					13,
					16
				],
				[
					2,
					24
				],
				[
					12,
					44
				],
				[
					17,
					28
				],
				[
					11,
					57
				],
				[
					5,
					49
				]
			],
			[
				[
					5663,
					8983
				],
				[
					-9,
					22
				],
				[
					-1,
					89
				],
				[
					-44,
					39
				],
				[
					-37,
					28
				]
			],
			[
				[
					5572,
					9161
				],
				[
					17,
					16
				],
				[
					31,
					-31
				],
				[
					36,
					3
				],
				[
					30,
					-14
				],
				[
					27,
					25
				],
				[
					13,
					43
				],
				[
					43,
					19
				],
				[
					36,
					-23
				],
				[
					-12,
					-40
				]
			],
			[
				[
					5793,
					9159
				],
				[
					-4,
					-40
				],
				[
					43,
					-39
				],
				[
					-26,
					-43
				],
				[
					32,
					-66
				],
				[
					-18,
					-49
				],
				[
					25,
					-43
				],
				[
					-12,
					-37
				],
				[
					41,
					-40
				],
				[
					-10,
					-29
				],
				[
					-26,
					-34
				],
				[
					-59,
					-73
				]
			],
			[
				[
					3299,
					2196
				],
				[
					33,
					35
				],
				[
					24,
					-15
				],
				[
					17,
					23
				],
				[
					22,
					-25
				],
				[
					-8,
					-21
				],
				[
					-38,
					-17
				],
				[
					-12,
					20
				],
				[
					-24,
					-26
				],
				[
					-14,
					26
				]
			],
			[
				[
					3485,
					5315
				],
				[
					7,
					25
				],
				[
					2,
					26
				]
			],
			[
				[
					3494,
					5366
				],
				[
					5,
					25
				],
				[
					-11,
					34
				]
			],
			[
				[
					3488,
					5425
				],
				[
					-2,
					39
				],
				[
					14,
					49
				]
			],
			[
				[
					5157,
					8034
				],
				[
					6,
					-5
				],
				[
					8,
					1
				]
			],
			[
				[
					5189,
					7830
				],
				[
					-1,
					-16
				],
				[
					8,
					-22
				],
				[
					-10,
					-17
				],
				[
					8,
					-45
				],
				[
					15,
					-7
				],
				[
					-3,
					-25
				]
			],
			[
				[
					5263,
					5240
				],
				[
					9,
					3
				],
				[
					40,
					0
				],
				[
					0,
					69
				]
			],
			[
				[
					4827,
					8284
				],
				[
					-21,
					12
				],
				[
					-17,
					-1
				],
				[
					5,
					31
				],
				[
					-5,
					31
				]
			],
			[
				[
					4968,
					8327
				],
				[
					19,
					-9
				],
				[
					17,
					-65
				],
				[
					8,
					-23
				],
				[
					34,
					-11
				],
				[
					-4,
					-37
				],
				[
					-14,
					-17
				],
				[
					11,
					-30
				],
				[
					-25,
					-30
				],
				[
					-37,
					1
				],
				[
					-47,
					-16
				],
				[
					-13,
					11
				],
				[
					-18,
					-27
				],
				[
					-26,
					7
				],
				[
					-20,
					-22
				],
				[
					-14,
					11
				],
				[
					40,
					61
				],
				[
					25,
					12
				],
				[
					-43,
					10
				],
				[
					-8,
					23
				],
				[
					29,
					18
				],
				[
					-15,
					31
				],
				[
					5,
					37
				],
				[
					41,
					-5
				],
				[
					4,
					34
				]
			],
			[
				[
					4917,
					8291
				],
				[
					-18,
					35
				],
				[
					-1,
					1
				]
			],
			[
				[
					4898,
					8327
				],
				[
					-34,
					10
				],
				[
					-6,
					16
				],
				[
					10,
					25
				],
				[
					-9,
					16
				],
				[
					-15,
					-27
				],
				[
					-2,
					55
				],
				[
					-14,
					30
				],
				[
					10,
					59
				],
				[
					22,
					47
				],
				[
					22,
					-5
				],
				[
					34,
					5
				],
				[
					-30,
					-62
				],
				[
					28,
					8
				],
				[
					31,
					0
				],
				[
					-8,
					-47
				],
				[
					-25,
					-52
				],
				[
					29,
					-4
				]
			],
			[
				[
					4941,
					8401
				],
				[
					2,
					-6
				],
				[
					25,
					-68
				]
			],
			[
				[
					6109,
					7683
				],
				[
					3,
					7
				],
				[
					24,
					-10
				],
				[
					41,
					-9
				],
				[
					37,
					-28
				],
				[
					5,
					-11
				],
				[
					17,
					9
				],
				[
					26,
					-12
				],
				[
					8,
					-23
				],
				[
					18,
					-14
				]
			],
			[
				[
					6210,
					7548
				],
				[
					-27,
					28
				],
				[
					-30,
					-2
				]
			],
			[
				[
					5000,
					5816
				],
				[
					-2,
					-17
				],
				[
					11,
					-30
				],
				[
					0,
					-42
				],
				[
					3,
					-45
				],
				[
					7,
					-21
				],
				[
					-6,
					-52
				],
				[
					2,
					-29
				],
				[
					7,
					-36
				],
				[
					6,
					-21
				]
			],
			[
				[
					4715,
					5666
				],
				[
					-8,
					-3
				],
				[
					1,
					21
				],
				[
					-5,
					15
				],
				[
					1,
					17
				],
				[
					-6,
					24
				],
				[
					-8,
					20
				],
				[
					-22,
					1
				],
				[
					-6,
					-11
				],
				[
					-8,
					-2
				],
				[
					-5,
					-12
				],
				[
					-3,
					-16
				],
				[
					-15,
					-25
				]
			],
			[
				[
					4579,
					5818
				],
				[
					12,
					28
				],
				[
					9,
					-1
				],
				[
					7,
					9
				],
				[
					6,
					0
				],
				[
					4,
					8
				],
				[
					-2,
					19
				],
				[
					3,
					6
				],
				[
					0,
					20
				]
			],
			[
				[
					4618,
					5907
				],
				[
					14,
					-1
				],
				[
					20,
					-14
				],
				[
					6,
					1
				],
				[
					2,
					7
				],
				[
					15,
					-5
				],
				[
					4,
					3
				]
			],
			[
				[
					4679,
					5898
				],
				[
					2,
					-21
				],
				[
					4,
					0
				],
				[
					7,
					8
				],
				[
					5,
					-2
				],
				[
					8,
					-14
				],
				[
					12,
					-5
				],
				[
					7,
					12
				],
				[
					9,
					8
				],
				[
					7,
					8
				],
				[
					5,
					-1
				],
				[
					7,
					-13
				],
				[
					3,
					-16
				],
				[
					11,
					-24
				],
				[
					-5,
					-15
				],
				[
					-1,
					-19
				],
				[
					5,
					6
				],
				[
					4,
					-7
				],
				[
					-2,
					-17
				],
				[
					9,
					-16
				]
			],
			[
				[
					4765,
					5625
				],
				[
					-8,
					1
				],
				[
					-6,
					-23
				],
				[
					-8,
					0
				],
				[
					-5,
					12
				],
				[
					2,
					24
				],
				[
					-12,
					35
				],
				[
					-7,
					-7
				],
				[
					-6,
					-1
				]
			],
			[
				[
					4535,
					5965
				],
				[
					30,
					1
				],
				[
					6,
					14
				],
				[
					9,
					1
				],
				[
					11,
					-14
				],
				[
					9,
					0
				],
				[
					9,
					9
				],
				[
					5,
					-16
				],
				[
					-12,
					-13
				],
				[
					-12,
					1
				],
				[
					-12,
					12
				],
				[
					-10,
					-13
				],
				[
					-5,
					-1
				],
				[
					-6,
					-8
				],
				[
					-26,
					1
				]
			],
			[
				[
					4536,
					5895
				],
				[
					14,
					10
				],
				[
					10,
					-2
				],
				[
					7,
					6
				],
				[
					51,
					-2
				]
			],
			[
				[
					5583,
					7534
				],
				[
					18,
					5
				],
				[
					11,
					12
				],
				[
					15,
					-1
				],
				[
					4,
					10
				],
				[
					6,
					2
				]
			],
			[
				[
					5724,
					7590
				],
				[
					14,
					-15
				],
				[
					-9,
					-36
				],
				[
					-6,
					-6
				]
			],
			[
				[
					3700,
					9940
				],
				[
					93,
					34
				],
				[
					98,
					-2
				],
				[
					35,
					21
				],
				[
					98,
					6
				],
				[
					222,
					-8
				],
				[
					174,
					-45
				],
				[
					-51,
					-23
				],
				[
					-107,
					-2
				],
				[
					-149,
					-6
				],
				[
					14,
					-10
				],
				[
					98,
					6
				],
				[
					84,
					-19
				],
				[
					54,
					17
				],
				[
					23,
					-21
				],
				[
					-31,
					-33
				],
				[
					71,
					21
				],
				[
					135,
					23
				],
				[
					83,
					-11
				],
				[
					16,
					-25
				],
				[
					-113,
					-41
				],
				[
					-16,
					-13
				],
				[
					-89,
					-10
				],
				[
					65,
					-3
				],
				[
					-33,
					-42
				],
				[
					-22,
					-37
				],
				[
					1,
					-64
				],
				[
					33,
					-38
				],
				[
					-43,
					-2
				],
				[
					-46,
					-19
				],
				[
					51,
					-30
				],
				[
					7,
					-49
				],
				[
					-30,
					-5
				],
				[
					36,
					-50
				],
				[
					-62,
					-4
				],
				[
					32,
					-23
				],
				[
					-9,
					-21
				],
				[
					-39,
					-9
				],
				[
					-39,
					0
				],
				[
					35,
					-39
				],
				[
					1,
					-25
				],
				[
					-55,
					23
				],
				[
					-15,
					-15
				],
				[
					38,
					-14
				],
				[
					36,
					-36
				],
				[
					11,
					-46
				],
				[
					-50,
					-11
				],
				[
					-21,
					22
				],
				[
					-34,
					33
				],
				[
					9,
					-39
				],
				[
					-32,
					-30
				],
				[
					73,
					-3
				],
				[
					38,
					-3
				],
				[
					-74,
					-50
				],
				[
					-76,
					-45
				],
				[
					-81,
					-20
				],
				[
					-31,
					0
				],
				[
					-28,
					-23
				],
				[
					-39,
					-60
				],
				[
					-60,
					-41
				],
				[
					-19,
					-2
				],
				[
					-37,
					-14
				],
				[
					-40,
					-14
				],
				[
					-24,
					-35
				],
				[
					0,
					-41
				],
				[
					-14,
					-38
				],
				[
					-45,
					-46
				],
				[
					11,
					-45
				],
				[
					-13,
					-47
				],
				[
					-14,
					-56
				],
				[
					-39,
					-4
				],
				[
					-41,
					47
				],
				[
					-56,
					0
				],
				[
					-26,
					32
				],
				[
					-19,
					56
				],
				[
					-48,
					72
				],
				[
					-14,
					37
				],
				[
					-4,
					52
				],
				[
					-38,
					53
				],
				[
					10,
					43
				],
				[
					-19,
					20
				],
				[
					27,
					67
				],
				[
					42,
					22
				],
				[
					11,
					24
				],
				[
					6,
					45
				],
				[
					-32,
					-21
				],
				[
					-15,
					-8
				],
				[
					-25,
					-8
				],
				[
					-34,
					18
				],
				[
					-2,
					39
				],
				[
					11,
					31
				],
				[
					26,
					1
				],
				[
					57,
					-15
				],
				[
					-48,
					36
				],
				[
					-25,
					20
				],
				[
					-28,
					-8
				],
				[
					-23,
					14
				],
				[
					31,
					54
				],
				[
					-17,
					21
				],
				[
					-22,
					40
				],
				[
					-33,
					61
				],
				[
					-36,
					22
				],
				[
					1,
					24
				],
				[
					-75,
					34
				],
				[
					-59,
					4
				],
				[
					-74,
					-2
				],
				[
					-68,
					-4
				],
				[
					-32,
					18
				],
				[
					-48,
					36
				],
				[
					73,
					18
				],
				[
					56,
					4
				],
				[
					-119,
					14
				],
				[
					-63,
					24
				],
				[
					4,
					22
				],
				[
					105,
					28
				],
				[
					102,
					28
				],
				[
					11,
					21
				],
				[
					-75,
					20
				],
				[
					24,
					23
				],
				[
					96,
					41
				],
				[
					40,
					6
				],
				[
					-11,
					26
				],
				[
					66,
					15
				],
				[
					85,
					9
				],
				[
					85,
					0
				],
				[
					31,
					-18
				],
				[
					73,
					32
				],
				[
					67,
					-21
				],
				[
					39,
					-5
				],
				[
					57,
					-19
				],
				[
					-66,
					31
				],
				[
					4,
					25
				]
			],
			[
				[
					2437,
					6019
				],
				[
					1,
					17
				],
				[
					3,
					13
				],
				[
					-4,
					11
				],
				[
					14,
					47
				],
				[
					35,
					0
				],
				[
					1,
					20
				],
				[
					-4,
					3
				],
				[
					-4,
					13
				],
				[
					-10,
					13
				],
				[
					-10,
					19
				],
				[
					12,
					1
				],
				[
					0,
					32
				],
				[
					26,
					0
				],
				[
					26,
					-1
				]
			],
			[
				[
					2549,
					6088
				],
				[
					-13,
					-22
				],
				[
					-13,
					-16
				],
				[
					-2,
					-12
				],
				[
					2,
					-11
				],
				[
					-6,
					-14
				]
			],
			[
				[
					2517,
					6013
				],
				[
					-6,
					-4
				],
				[
					1,
					-7
				],
				[
					-5,
					-6
				],
				[
					-10,
					-15
				],
				[
					0,
					-8
				]
			],
			[
				[
					3412,
					5526
				],
				[
					-5,
					-52
				],
				[
					-17,
					-15
				],
				[
					2,
					-13
				],
				[
					-5,
					-30
				],
				[
					12,
					-42
				],
				[
					9,
					0
				],
				[
					4,
					-33
				],
				[
					17,
					-50
				]
			],
			[
				[
					3312,
					5481
				],
				[
					-19,
					44
				],
				[
					8,
					16
				],
				[
					-1,
					27
				],
				[
					17,
					9
				],
				[
					7,
					11
				],
				[
					-9,
					21
				],
				[
					2,
					21
				],
				[
					22,
					34
				]
			],
			[
				[
					2561,
					5953
				],
				[
					1,
					23
				],
				[
					-3,
					6
				],
				[
					-6,
					4
				],
				[
					-12,
					-7
				],
				[
					-1,
					8
				],
				[
					-9,
					9
				],
				[
					-6,
					12
				],
				[
					-8,
					5
				]
			],
			[
				[
					2690,
					6045
				],
				[
					-10,
					2
				],
				[
					-4,
					-8
				],
				[
					-9,
					-8
				],
				[
					-7,
					0
				],
				[
					-7,
					-7
				],
				[
					-5,
					3
				],
				[
					-5,
					8
				],
				[
					-3,
					-1
				],
				[
					-3,
					-14
				],
				[
					-3,
					0
				],
				[
					0,
					-11
				],
				[
					-10,
					-16
				],
				[
					-5,
					-7
				],
				[
					-3,
					-7
				],
				[
					-8,
					11
				],
				[
					-6,
					-15
				],
				[
					-6,
					0
				],
				[
					-7,
					-1
				],
				[
					1,
					-28
				],
				[
					-4,
					-1
				],
				[
					-4,
					-13
				],
				[
					-8,
					-2
				]
			],
			[
				[
					5515,
					7638
				],
				[
					-4,
					-10
				]
			],
			[
				[
					5380,
					7802
				],
				[
					19,
					-2
				],
				[
					5,
					10
				],
				[
					10,
					-10
				],
				[
					11,
					-1
				],
				[
					0,
					16
				],
				[
					9,
					6
				],
				[
					3,
					23
				],
				[
					22,
					16
				]
			],
			[
				[
					5459,
					7860
				],
				[
					9,
					-7
				],
				[
					21,
					-25
				],
				[
					23,
					-11
				],
				[
					10,
					9
				]
			],
			[
				[
					5522,
					7826
				],
				[
					7,
					-23
				],
				[
					9,
					-16
				],
				[
					-11,
					-22
				]
			],
			[
				[
					5471,
					7953
				],
				[
					14,
					-15
				],
				[
					10,
					-6
				],
				[
					23,
					7
				],
				[
					3,
					12
				],
				[
					11,
					1
				],
				[
					13,
					9
				],
				[
					3,
					-3
				],
				[
					13,
					7
				],
				[
					7,
					13
				],
				[
					9,
					4
				],
				[
					30,
					-18
				],
				[
					5,
					6
				]
			],
			[
				[
					5612,
					7970
				],
				[
					16,
					-15
				],
				[
					2,
					-16
				]
			],
			[
				[
					5630,
					7939
				],
				[
					-17,
					-12
				],
				[
					-13,
					-39
				],
				[
					-17,
					-39
				],
				[
					-22,
					-11
				]
			],
			[
				[
					5561,
					7838
				],
				[
					-18,
					3
				],
				[
					-21,
					-15
				]
			],
			[
				[
					5459,
					7860
				],
				[
					-5,
					19
				],
				[
					-5,
					1
				]
			],
			[
				[
					8470,
					4670
				],
				[
					3,
					-11
				],
				[
					0,
					-18
				]
			],
			[
				[
					8915,
					5032
				],
				[
					1,
					-187
				],
				[
					0,
					-188
				]
			],
			[
				[
					8045,
					5298
				],
				[
					5,
					-39
				],
				[
					19,
					-33
				],
				[
					17,
					12
				],
				[
					18,
					-4
				],
				[
					16,
					29
				],
				[
					14,
					5
				],
				[
					26,
					-16
				],
				[
					23,
					12
				],
				[
					14,
					80
				],
				[
					11,
					20
				],
				[
					9,
					66
				],
				[
					32,
					0
				],
				[
					24,
					-10
				]
			],
			[
				[
					7252,
					6920
				],
				[
					-18,
					-26
				],
				[
					-11,
					-54
				],
				[
					27,
					-22
				],
				[
					27,
					-28
				],
				[
					36,
					-32
				],
				[
					38,
					-8
				],
				[
					16,
					-29
				],
				[
					21,
					-6
				],
				[
					34,
					-13
				],
				[
					23,
					1
				],
				[
					3,
					23
				],
				[
					-4,
					36
				],
				[
					3,
					25
				]
			],
			[
				[
					7702,
					6809
				],
				[
					2,
					-21
				],
				[
					-9,
					-11
				],
				[
					2,
					-35
				],
				[
					-20,
					10
				],
				[
					-36,
					-40
				],
				[
					1,
					-33
				],
				[
					-15,
					-48
				],
				[
					-2,
					-28
				],
				[
					-12,
					-48
				],
				[
					-22,
					13
				],
				[
					-1,
					-59
				],
				[
					-6,
					-20
				],
				[
					3,
					-24
				],
				[
					-14,
					-14
				]
			],
			[
				[
					6893,
					6546
				],
				[
					18,
					39
				],
				[
					61,
					-1
				],
				[
					-5,
					50
				],
				[
					-16,
					29
				],
				[
					-3,
					44
				],
				[
					-18,
					26
				],
				[
					30,
					61
				],
				[
					33,
					-5
				],
				[
					29,
					61
				],
				[
					17,
					58
				],
				[
					27,
					58
				],
				[
					0,
					41
				],
				[
					23,
					33
				],
				[
					-22,
					29
				],
				[
					-10,
					39
				],
				[
					-10,
					50
				],
				[
					14,
					25
				],
				[
					42,
					-14
				],
				[
					31,
					8
				],
				[
					27,
					49
				]
			],
			[
				[
					6690,
					6900
				],
				[
					14,
					-31
				],
				[
					11,
					-34
				],
				[
					26,
					-26
				],
				[
					1,
					-50
				],
				[
					13,
					-10
				],
				[
					3,
					-26
				],
				[
					-40,
					-30
				],
				[
					-11,
					-67
				]
			],
			[
				[
					6348,
					6905
				],
				[
					-15,
					31
				],
				[
					-1,
					30
				],
				[
					-9,
					0
				],
				[
					5,
					42
				],
				[
					-14,
					44
				],
				[
					-34,
					31
				],
				[
					-20,
					55
				],
				[
					7,
					45
				],
				[
					14,
					20
				],
				[
					-2,
					33
				],
				[
					-18,
					18
				],
				[
					-18,
					68
				]
			],
			[
				[
					6243,
					7322
				],
				[
					-16,
					46
				],
				[
					6,
					18
				],
				[
					-9,
					66
				],
				[
					19,
					17
				]
			],
			[
				[
					6497,
					7324
				],
				[
					24,
					11
				],
				[
					20,
					33
				],
				[
					18,
					-2
				],
				[
					13,
					11
				],
				[
					19,
					-5
				],
				[
					31,
					-29
				],
				[
					22,
					-7
				],
				[
					32,
					-51
				],
				[
					21,
					-2
				],
				[
					2,
					-48
				]
			],
			[
				[
					6331,
					6908
				],
				[
					-18,
					5
				],
				[
					-21,
					-55
				]
			],
			[
				[
					6292,
					6858
				],
				[
					-51,
					4
				],
				[
					-79,
					116
				],
				[
					-41,
					40
				],
				[
					-33,
					16
				]
			],
			[
				[
					6088,
					7034
				],
				[
					-12,
					70
				]
			],
			[
				[
					6076,
					7104
				],
				[
					62,
					60
				],
				[
					10,
					70
				],
				[
					-2,
					42
				],
				[
					15,
					14
				],
				[
					14,
					36
				]
			],
			[
				[
					6175,
					7326
				],
				[
					12,
					9
				],
				[
					32,
					-8
				],
				[
					10,
					-14
				],
				[
					14,
					9
				]
			],
			[
				[
					5982,
					6995
				],
				[
					1,
					-22
				],
				[
					-14,
					-92
				]
			],
			[
				[
					5975,
					7087
				],
				[
					9,
					0
				],
				[
					2,
					10
				],
				[
					8,
					1
				]
			],
			[
				[
					5994,
					7098
				],
				[
					0,
					-23
				],
				[
					-3,
					-9
				],
				[
					0,
					-1
				]
			],
			[
				[
					5991,
					7065
				],
				[
					-5,
					-18
				]
			],
			[
				[
					5986,
					7047
				],
				[
					-10,
					8
				],
				[
					-6,
					-38
				],
				[
					7,
					-7
				],
				[
					-7,
					-7
				],
				[
					-1,
					-16
				],
				[
					13,
					8
				]
			],
			[
				[
					5382,
					7860
				],
				[
					-3,
					-28
				],
				[
					7,
					-25
				]
			],
			[
				[
					2845,
					6247
				],
				[
					18,
					-5
				],
				[
					15,
					-14
				],
				[
					5,
					-16
				],
				[
					-20,
					-1
				],
				[
					-8,
					-10
				],
				[
					-16,
					9
				],
				[
					-16,
					21
				],
				[
					4,
					14
				],
				[
					11,
					4
				],
				[
					7,
					-2
				]
			],
			[
				[
					6088,
					7034
				],
				[
					-6,
					-9
				],
				[
					-55,
					-29
				],
				[
					27,
					-57
				],
				[
					-9,
					-10
				],
				[
					-4,
					-19
				],
				[
					-22,
					-8
				],
				[
					-6,
					-21
				],
				[
					-12,
					-18
				],
				[
					-31,
					9
				]
			],
			[
				[
					5982,
					6995
				],
				[
					4,
					17
				],
				[
					0,
					35
				]
			],
			[
				[
					5991,
					7065
				],
				[
					31,
					-22
				],
				[
					54,
					61
				]
			],
			[
				[
					6554,
					7561
				],
				[
					-15,
					-3
				],
				[
					-19,
					45
				],
				[
					-19,
					16
				],
				[
					-31,
					-12
				],
				[
					-13,
					-19
				]
			],
			[
				[
					6363,
					7854
				],
				[
					-14,
					9
				],
				[
					2,
					30
				],
				[
					-17,
					38
				],
				[
					-21,
					-1
				],
				[
					-23,
					39
				],
				[
					16,
					43
				],
				[
					-8,
					12
				],
				[
					22,
					63
				],
				[
					28,
					-33
				],
				[
					4,
					42
				],
				[
					57,
					63
				],
				[
					43,
					1
				],
				[
					62,
					-40
				],
				[
					33,
					-23
				],
				[
					29,
					24
				],
				[
					44,
					1
				],
				[
					36,
					-29
				],
				[
					8,
					17
				],
				[
					39,
					-3
				],
				[
					7,
					27
				],
				[
					-45,
					40
				],
				[
					26,
					28
				],
				[
					-5,
					16
				],
				[
					27,
					15
				],
				[
					-20,
					39
				],
				[
					12,
					20
				],
				[
					104,
					20
				],
				[
					14,
					14
				],
				[
					69,
					21
				],
				[
					25,
					24
				],
				[
					50,
					-12
				],
				[
					9,
					-60
				],
				[
					29,
					14
				],
				[
					36,
					-20
				],
				[
					-3,
					-31
				],
				[
					27,
					3
				],
				[
					70,
					55
				],
				[
					-11,
					-18
				],
				[
					36,
					-45
				],
				[
					62,
					-146
				],
				[
					15,
					30
				],
				[
					38,
					-33
				],
				[
					40,
					15
				],
				[
					15,
					-11
				],
				[
					14,
					-33
				],
				[
					19,
					-11
				],
				[
					12,
					-25
				],
				[
					36,
					8
				],
				[
					14,
					-35
				]
			],
			[
				[
					7228,
					7621
				],
				[
					-17,
					8
				],
				[
					-14,
					21
				],
				[
					-41,
					6
				],
				[
					-46,
					1
				],
				[
					-10,
					-6
				],
				[
					-40,
					24
				],
				[
					-16,
					-12
				],
				[
					-4,
					-34
				],
				[
					-46,
					20
				],
				[
					-18,
					-8
				],
				[
					-6,
					-25
				]
			],
			[
				[
					6970,
					7616
				],
				[
					-16,
					-11
				],
				[
					-37,
					-40
				],
				[
					-12,
					-41
				],
				[
					-10,
					-1
				],
				[
					-8,
					28
				],
				[
					-35,
					2
				],
				[
					-6,
					47
				],
				[
					-13,
					0
				],
				[
					2,
					58
				],
				[
					-33,
					42
				],
				[
					-48,
					-5
				],
				[
					-33,
					-8
				],
				[
					-26,
					52
				],
				[
					-23,
					22
				],
				[
					-43,
					41
				],
				[
					-5,
					5
				],
				[
					-72,
					-34
				],
				[
					2,
					-212
				]
			],
			[
				[
					6088,
					4913
				],
				[
					-40,
					57
				],
				[
					-2,
					34
				],
				[
					-101,
					117
				],
				[
					-4,
					6
				]
			],
			[
				[
					5941,
					5127
				],
				[
					-1,
					61
				],
				[
					8,
					24
				],
				[
					14,
					38
				],
				[
					10,
					42
				],
				[
					-12,
					66
				],
				[
					-3,
					29
				],
				[
					-14,
					40
				]
			],
			[
				[
					5943,
					5427
				],
				[
					18,
					34
				],
				[
					18,
					38
				]
			],
			[
				[
					6162,
					5408
				],
				[
					-25,
					-66
				],
				[
					1,
					-209
				],
				[
					16,
					-48
				]
			],
			[
				[
					7045,
					7453
				],
				[
					-52,
					-9
				],
				[
					-34,
					18
				],
				[
					-31,
					-4
				],
				[
					3,
					33
				],
				[
					30,
					-9
				],
				[
					10,
					17
				]
			],
			[
				[
					6971,
					7499
				],
				[
					22,
					-5
				],
				[
					35,
					41
				],
				[
					-33,
					30
				],
				[
					-20,
					-14
				],
				[
					-20,
					22
				],
				[
					23,
					37
				],
				[
					-8,
					6
				]
			],
			[
				[
					7848,
					5884
				],
				[
					-6,
					69
				],
				[
					18,
					48
				],
				[
					35,
					11
				],
				[
					26,
					-8
				]
			],
			[
				[
					7921,
					6004
				],
				[
					23,
					-23
				],
				[
					13,
					40
				],
				[
					25,
					-21
				]
			],
			[
				[
					7982,
					6000
				],
				[
					6,
					-39
				],
				[
					-3,
					-69
				],
				[
					-47,
					-44
				],
				[
					12,
					-35
				],
				[
					-29,
					-4
				],
				[
					-24,
					-23
				]
			],
			[
				[
					8504,
					7356
				],
				[
					1,
					5
				],
				[
					13,
					-2
				],
				[
					10,
					26
				],
				[
					20,
					3
				],
				[
					12,
					3
				],
				[
					4,
					14
				]
			],
			[
				[
					5556,
					7634
				],
				[
					6,
					13
				]
			],
			[
				[
					5562,
					7647
				],
				[
					6,
					4
				],
				[
					4,
					20
				],
				[
					5,
					3
				],
				[
					4,
					-8
				],
				[
					5,
					-4
				],
				[
					4,
					-9
				],
				[
					4,
					-3
				],
				[
					6,
					-11
				],
				[
					4,
					1
				],
				[
					-3,
					-14
				],
				[
					-4,
					-7
				],
				[
					1,
					-4
				]
			],
			[
				[
					5598,
					7615
				],
				[
					-6,
					-3
				],
				[
					-16,
					-9
				],
				[
					-2,
					-11
				],
				[
					-3,
					0
				]
			],
			[
				[
					6344,
					6826
				],
				[
					-20,
					-1
				],
				[
					-7,
					27
				],
				[
					-25,
					6
				]
			],
			[
				[
					7780,
					6358
				],
				[
					6,
					21
				],
				[
					23,
					37
				]
			],
			[
				[
					7837,
					6476
				],
				[
					16,
					-46
				],
				[
					12,
					-52
				],
				[
					35,
					-1
				],
				[
					10,
					-50
				],
				[
					-17,
					-15
				],
				[
					-8,
					-21
				],
				[
					33,
					-34
				],
				[
					23,
					-68
				],
				[
					18,
					-51
				],
				[
					21,
					-40
				],
				[
					7,
					-41
				],
				[
					-5,
					-57
				]
			],
			[
				[
					7921,
					6004
				],
				[
					9,
					26
				],
				[
					2,
					49
				],
				[
					-23,
					50
				],
				[
					-1,
					57
				],
				[
					-22,
					46
				],
				[
					-21,
					4
				],
				[
					-5,
					-20
				],
				[
					-16,
					-1
				],
				[
					-9,
					10
				],
				[
					-29,
					-35
				],
				[
					-1,
					52
				],
				[
					7,
					61
				],
				[
					-19,
					2
				],
				[
					-1,
					35
				],
				[
					-12,
					18
				]
			],
			[
				[
					5999,
					7177
				],
				[
					12,
					-3
				],
				[
					5,
					-23
				],
				[
					-15,
					-21
				],
				[
					-7,
					-32
				]
			],
			[
				[
					4681,
					5573
				],
				[
					7,
					18
				],
				[
					1,
					17
				],
				[
					13,
					31
				],
				[
					13,
					27
				]
			],
			[
				[
					5262,
					6927
				],
				[
					14,
					14
				],
				[
					2,
					24
				],
				[
					-3,
					24
				],
				[
					19,
					22
				],
				[
					9,
					18
				],
				[
					14,
					17
				],
				[
					1,
					44
				]
			],
			[
				[
					5693,
					6449
				],
				[
					0,
					-115
				],
				[
					-32,
					0
				],
				[
					0,
					-25
				]
			],
			[
				[
					5661,
					6309
				],
				[
					-111,
					111
				],
				[
					-110,
					110
				],
				[
					-29,
					-32
				]
			],
			[
				[
					5411,
					6498
				],
				[
					-19,
					-21
				],
				[
					-16,
					32
				],
				[
					-44,
					25
				]
			],
			[
				[
					7271,
					5615
				],
				[
					-5,
					-60
				],
				[
					-11,
					-16
				],
				[
					-24,
					-13
				],
				[
					-14,
					45
				],
				[
					-4,
					83
				],
				[
					12,
					94
				],
				[
					19,
					-32
				],
				[
					13,
					-41
				],
				[
					14,
					-60
				]
			],
			[
				[
					5804,
					3515
				],
				[
					10,
					-18
				],
				[
					-9,
					-28
				],
				[
					-5,
					-19
				],
				[
					-15,
					-9
				],
				[
					-5,
					-18
				],
				[
					-10,
					-6
				],
				[
					-21,
					45
				],
				[
					15,
					36
				],
				[
					15,
					23
				],
				[
					13,
					11
				],
				[
					12,
					-17
				]
			],
			[
				[
					5584,
					8408
				],
				[
					32,
					18
				],
				[
					46,
					-4
				],
				[
					28,
					6
				],
				[
					3,
					-12
				],
				[
					15,
					-4
				],
				[
					27,
					-28
				]
			],
			[
				[
					5651,
					8286
				],
				[
					-6,
					18
				],
				[
					-15,
					6
				]
			],
			[
				[
					5630,
					8310
				],
				[
					-2,
					15
				],
				[
					3,
					16
				],
				[
					-12,
					9
				],
				[
					-29,
					10
				]
			],
			[
				[
					5757,
					8492
				],
				[
					13,
					-14
				],
				[
					3,
					-28
				],
				[
					9,
					-34
				]
			],
			[
				[
					4758,
					6775
				],
				[
					-4,
					0
				],
				[
					1,
					-31
				],
				[
					-17,
					-2
				],
				[
					-9,
					-13
				],
				[
					-13,
					0
				],
				[
					-10,
					7
				],
				[
					-23,
					-6
				],
				[
					-9,
					-45
				],
				[
					-9,
					-4
				],
				[
					-13,
					-73
				],
				[
					-39,
					-62
				],
				[
					-9,
					-79
				],
				[
					-11,
					-26
				],
				[
					-4,
					-21
				],
				[
					-62,
					-5
				],
				[
					-1,
					1
				]
			],
			[
				[
					4526,
					6416
				],
				[
					2,
					26
				],
				[
					10,
					16
				],
				[
					9,
					30
				],
				[
					-1,
					19
				],
				[
					9,
					41
				],
				[
					16,
					37
				],
				[
					9,
					9
				],
				[
					7,
					34
				],
				[
					1,
					30
				],
				[
					10,
					36
				],
				[
					18,
					21
				],
				[
					18,
					59
				]
			],
			[
				[
					4634,
					6774
				],
				[
					1,
					0
				],
				[
					14,
					22
				]
			],
			[
				[
					4649,
					6796
				],
				[
					25,
					7
				],
				[
					22,
					39
				],
				[
					14,
					16
				],
				[
					23,
					48
				],
				[
					-7,
					71
				],
				[
					11,
					50
				],
				[
					4,
					30
				],
				[
					18,
					39
				],
				[
					27,
					26
				],
				[
					21,
					24
				],
				[
					19,
					60
				],
				[
					8,
					35
				],
				[
					21,
					0
				],
				[
					16,
					-25
				],
				[
					27,
					4
				],
				[
					29,
					-12
				],
				[
					12,
					-1
				]
			],
			[
				[
					5783,
					7801
				],
				[
					-5,
					27
				],
				[
					3,
					24
				],
				[
					-1,
					25
				],
				[
					-16,
					35
				],
				[
					-9,
					24
				],
				[
					-8,
					17
				],
				[
					-9,
					6
				]
			],
			[
				[
					5738,
					7959
				],
				[
					7,
					8
				],
				[
					18,
					6
				],
				[
					21,
					-18
				],
				[
					11,
					-2
				],
				[
					13,
					-16
				],
				[
					-2,
					-19
				],
				[
					10,
					-10
				],
				[
					4,
					-24
				],
				[
					10,
					-14
				],
				[
					-2,
					-9
				],
				[
					5,
					-6
				],
				[
					-7,
					-4
				],
				[
					-17,
					2
				],
				[
					-3,
					8
				],
				[
					-5,
					-5
				],
				[
					2,
					-10
				],
				[
					-8,
					-19
				],
				[
					-5,
					-19
				],
				[
					-7,
					-7
				]
			],
			[
				[
					6375,
					4464
				],
				[
					7,
					-25
				],
				[
					7,
					-38
				],
				[
					5,
					-69
				],
				[
					7,
					-27
				],
				[
					-3,
					-27
				],
				[
					-5,
					-17
				],
				[
					-9,
					33
				],
				[
					-5,
					-17
				],
				[
					5,
					-42
				],
				[
					-3,
					-25
				],
				[
					-7,
					-13
				],
				[
					-2,
					-49
				],
				[
					-11,
					-67
				],
				[
					-14,
					-79
				],
				[
					-17,
					-109
				],
				[
					-10,
					-80
				],
				[
					-13,
					-67
				],
				[
					-23,
					-14
				],
				[
					-24,
					-24
				],
				[
					-16,
					14
				],
				[
					-22,
					21
				],
				[
					-7,
					30
				],
				[
					-2,
					51
				],
				[
					-10,
					46
				],
				[
					-3,
					42
				],
				[
					5,
					41
				],
				[
					13,
					10
				],
				[
					0,
					19
				],
				[
					13,
					44
				],
				[
					3,
					37
				],
				[
					-6,
					27
				],
				[
					-6,
					36
				],
				[
					-2,
					53
				],
				[
					10,
					33
				],
				[
					4,
					36
				],
				[
					13,
					2
				],
				[
					16,
					12
				],
				[
					10,
					11
				],
				[
					12,
					0
				],
				[
					16,
					33
				],
				[
					23,
					36
				],
				[
					8,
					29
				],
				[
					-3,
					24
				],
				[
					11,
					-7
				],
				[
					16,
					40
				],
				[
					0,
					35
				],
				[
					9,
					26
				],
				[
					10,
					-25
				]
			],
			[
				[
					1746,
					7055
				],
				[
					31,
					5
				],
				[
					36,
					6
				],
				[
					-3,
					-11
				],
				[
					42,
					-28
				],
				[
					63,
					-41
				],
				[
					56,
					1
				],
				[
					22,
					0
				],
				[
					0,
					24
				],
				[
					48,
					-1
				],
				[
					10,
					-20
				],
				[
					14,
					-18
				],
				[
					17,
					-25
				],
				[
					9,
					-31
				],
				[
					7,
					-31
				],
				[
					14,
					-18
				],
				[
					23,
					-17
				],
				[
					18,
					46
				],
				[
					22,
					1
				],
				[
					20,
					-23
				],
				[
					14,
					-40
				],
				[
					9,
					-33
				],
				[
					17,
					-33
				],
				[
					6,
					-41
				],
				[
					8,
					-27
				],
				[
					21,
					-17
				],
				[
					20,
					-13
				],
				[
					11,
					2
				]
			],
			[
				[
					2301,
					6672
				],
				[
					-11,
					-51
				],
				[
					-5,
					-41
				],
				[
					-2,
					-78
				],
				[
					-2,
					-28
				],
				[
					4,
					-31
				],
				[
					9,
					-28
				],
				[
					6,
					-45
				],
				[
					18,
					-43
				],
				[
					6,
					-33
				],
				[
					11,
					-28
				],
				[
					30,
					-15
				],
				[
					11,
					-24
				],
				[
					25,
					16
				],
				[
					21,
					6
				],
				[
					21,
					10
				],
				[
					17,
					10
				],
				[
					18,
					23
				],
				[
					6,
					34
				],
				[
					3,
					48
				],
				[
					5,
					17
				],
				[
					18,
					15
				],
				[
					30,
					14
				],
				[
					24,
					-2
				],
				[
					17,
					5
				],
				[
					7,
					-13
				],
				[
					-1,
					-27
				],
				[
					-15,
					-35
				],
				[
					-7,
					-35
				],
				[
					5,
					-10
				],
				[
					-4,
					-25
				],
				[
					-7,
					-45
				],
				[
					-7,
					15
				],
				[
					-6,
					-1
				]
			],
			[
				[
					5598,
					7615
				],
				[
					10,
					3
				],
				[
					13,
					1
				]
			],
			[
				[
					5118,
					6285
				],
				[
					0,
					-133
				],
				[
					-16,
					-38
				],
				[
					-2,
					-36
				],
				[
					-25,
					-9
				],
				[
					-38,
					-5
				],
				[
					-10,
					-20
				],
				[
					-18,
					-2
				]
			],
			[
				[
					4679,
					5898
				],
				[
					1,
					18
				],
				[
					-2,
					23
				],
				[
					-10,
					16
				],
				[
					-6,
					33
				],
				[
					-1,
					36
				]
			],
			[
				[
					4661,
					6024
				],
				[
					9,
					10
				],
				[
					5,
					34
				],
				[
					9,
					1
				],
				[
					19,
					-16
				],
				[
					16,
					12
				],
				[
					11,
					-4
				],
				[
					4,
					13
				],
				[
					111,
					1
				],
				[
					6,
					40
				],
				[
					-4,
					7
				],
				[
					-14,
					249
				],
				[
					-13,
					248
				],
				[
					42,
					1
				]
			],
			[
				[
					7780,
					6358
				],
				[
					-16,
					-14
				],
				[
					-16,
					-25
				],
				[
					-20,
					-2
				],
				[
					-13,
					-62
				],
				[
					-11,
					-11
				],
				[
					13,
					-50
				],
				[
					18,
					-42
				],
				[
					11,
					-38
				],
				[
					-10,
					-51
				],
				[
					-10,
					-10
				],
				[
					7,
					-29
				],
				[
					18,
					-46
				],
				[
					4,
					-32
				],
				[
					-1,
					-27
				],
				[
					11,
					-52
				],
				[
					-15,
					-54
				],
				[
					-14,
					-59
				]
			],
			[
				[
					5533,
					7688
				],
				[
					7,
					-10
				],
				[
					4,
					-8
				],
				[
					9,
					-6
				],
				[
					11,
					-12
				],
				[
					-2,
					-5
				]
			],
			[
				[
					7436,
					8021
				],
				[
					30,
					10
				],
				[
					53,
					49
				],
				[
					42,
					27
				],
				[
					24,
					-17
				],
				[
					29,
					-1
				],
				[
					19,
					-27
				],
				[
					27,
					-2
				],
				[
					40,
					-15
				],
				[
					27,
					40
				],
				[
					-11,
					34
				],
				[
					29,
					60
				],
				[
					31,
					-24
				],
				[
					25,
					-7
				],
				[
					33,
					-14
				],
				[
					5,
					-43
				],
				[
					40,
					-25
				],
				[
					26,
					11
				],
				[
					35,
					7
				],
				[
					28,
					-7
				],
				[
					27,
					-28
				],
				[
					17,
					-29
				],
				[
					26,
					0
				],
				[
					35,
					-9
				],
				[
					25,
					14
				],
				[
					37,
					10
				],
				[
					40,
					40
				],
				[
					17,
					-6
				],
				[
					15,
					-19
				],
				[
					33,
					5
				]
			],
			[
				[
					5911,
					3642
				],
				[
					-21,
					1
				]
			],
			[
				[
					5890,
					3643
				],
				[
					-3,
					25
				],
				[
					-4,
					26
				]
			],
			[
				[
					5883,
					3694
				],
				[
					-2,
					21
				],
				[
					5,
					64
				],
				[
					-7,
					41
				],
				[
					-14,
					81
				]
			],
			[
				[
					5865,
					3901
				],
				[
					30,
					65
				],
				[
					7,
					42
				],
				[
					4,
					5
				],
				[
					3,
					34
				],
				[
					-4,
					17
				],
				[
					1,
					43
				],
				[
					5,
					40
				],
				[
					0,
					73
				],
				[
					-14,
					18
				],
				[
					-13,
					4
				],
				[
					-6,
					14
				],
				[
					-13,
					13
				],
				[
					-23,
					-1
				],
				[
					-2,
					21
				]
			],
			[
				[
					5840,
					4289
				],
				[
					-3,
					41
				],
				[
					85,
					47
				]
			],
			[
				[
					5922,
					4377
				],
				[
					16,
					-27
				],
				[
					7,
					5
				],
				[
					11,
					-14
				],
				[
					2,
					-24
				],
				[
					-6,
					-26
				],
				[
					2,
					-41
				],
				[
					18,
					-36
				],
				[
					9,
					40
				],
				[
					12,
					13
				],
				[
					-3,
					74
				],
				[
					-11,
					41
				],
				[
					-10,
					19
				],
				[
					-10,
					-1
				],
				[
					-8,
					75
				],
				[
					8,
					44
				]
			],
			[
				[
					5959,
					4519
				],
				[
					21,
					4
				],
				[
					33,
					-16
				],
				[
					7,
					7
				],
				[
					20,
					2
				],
				[
					10,
					17
				],
				[
					16,
					-1
				],
				[
					31,
					22
				],
				[
					22,
					34
				]
			],
			[
				[
					4525,
					6391
				],
				[
					6,
					19
				],
				[
					109,
					0
				],
				[
					-5,
					83
				],
				[
					6,
					30
				],
				[
					26,
					5
				],
				[
					0,
					147
				],
				[
					91,
					-3
				],
				[
					0,
					87
				]
			],
			[
				[
					4661,
					6024
				],
				[
					-18,
					39
				],
				[
					-17,
					43
				],
				[
					-19,
					15
				],
				[
					-13,
					17
				],
				[
					-15,
					-1
				],
				[
					-14,
					-12
				],
				[
					-14,
					5
				],
				[
					-9,
					-19
				]
			],
			[
				[
					5922,
					4377
				],
				[
					-15,
					15
				],
				[
					8,
					54
				],
				[
					9,
					20
				],
				[
					-5,
					48
				],
				[
					5,
					46
				],
				[
					5,
					16
				],
				[
					-7,
					49
				],
				[
					-13,
					25
				]
			],
			[
				[
					5909,
					4650
				],
				[
					27,
					-10
				],
				[
					6,
					-16
				],
				[
					9,
					-27
				],
				[
					8,
					-78
				]
			],
			[
				[
					7779,
					5554
				],
				[
					5,
					10
				],
				[
					22,
					-25
				],
				[
					3,
					-29
				],
				[
					18,
					7
				],
				[
					9,
					23
				]
			],
			[
				[
					5644,
					4173
				],
				[
					23,
					13
				],
				[
					18,
					-3
				],
				[
					11,
					-13
				],
				[
					0,
					-5
				]
			],
			[
				[
					5552,
					3756
				],
				[
					0,
					-213
				],
				[
					-25,
					-29
				],
				[
					-15,
					-5
				],
				[
					-18,
					11
				],
				[
					-12,
					5
				],
				[
					-5,
					24
				],
				[
					-11,
					16
				],
				[
					-13,
					-29
				]
			],
			[
				[
					9604,
					3968
				],
				[
					22,
					-36
				],
				[
					15,
					-26
				],
				[
					-11,
					-14
				],
				[
					-15,
					16
				],
				[
					-20,
					26
				],
				[
					-18,
					30
				],
				[
					-18,
					41
				],
				[
					-4,
					19
				],
				[
					12,
					-1
				],
				[
					15,
					-19
				],
				[
					13,
					-20
				],
				[
					9,
					-16
				]
			],
			[
				[
					5411,
					6498
				],
				[
					7,
					-89
				],
				[
					11,
					-15
				],
				[
					0,
					-18
				],
				[
					12,
					-20
				],
				[
					-6,
					-25
				],
				[
					-11,
					-117
				],
				[
					-1,
					-75
				],
				[
					-36,
					-54
				],
				[
					-12,
					-76
				],
				[
					12,
					-21
				],
				[
					0,
					-37
				],
				[
					17,
					-1
				],
				[
					-2,
					-28
				]
			],
			[
				[
					5393,
					5901
				],
				[
					-5,
					-1
				],
				[
					-19,
					63
				],
				[
					-7,
					2
				],
				[
					-21,
					-32
				],
				[
					-22,
					16
				],
				[
					-15,
					4
				],
				[
					-8,
					-8
				],
				[
					-16,
					2
				],
				[
					-16,
					-25
				],
				[
					-15,
					-1
				],
				[
					-33,
					29
				],
				[
					-13,
					-14
				],
				[
					-15,
					1
				],
				[
					-10,
					22
				],
				[
					-28,
					21
				],
				[
					-30,
					-6
				],
				[
					-7,
					-13
				],
				[
					-4,
					-33
				],
				[
					-8,
					-23
				],
				[
					-2,
					-52
				]
			],
			[
				[
					5863,
					9187
				],
				[
					-47,
					-23
				],
				[
					-23,
					-5
				]
			],
			[
				[
					5572,
					9161
				],
				[
					-17,
					-2
				],
				[
					-4,
					-38
				],
				[
					-52,
					9
				],
				[
					-8,
					-32
				],
				[
					-26,
					0
				],
				[
					-19,
					-41
				],
				[
					-27,
					-63
				],
				[
					-43,
					-81
				],
				[
					10,
					-20
				],
				[
					-10,
					-23
				],
				[
					-28,
					1
				],
				[
					-18,
					-54
				],
				[
					2,
					-76
				],
				[
					18,
					-30
				],
				[
					-9,
					-67
				],
				[
					-23,
					-40
				],
				[
					-13,
					-33
				]
			],
			[
				[
					6474,
					6141
				],
				[
					-9,
					40
				],
				[
					-22,
					95
				]
			],
			[
				[
					6443,
					6276
				],
				[
					84,
					58
				],
				[
					18,
					115
				],
				[
					-13,
					41
				]
			],
			[
				[
					5545,
					8316
				],
				[
					34,
					-7
				],
				[
					51,
					1
				]
			],
			[
				[
					5652,
					8152
				],
				[
					14,
					-50
				],
				[
					-3,
					-16
				],
				[
					-13,
					-7
				],
				[
					-26,
					-48
				],
				[
					8,
					-26
				],
				[
					-6,
					3
				]
			],
			[
				[
					5626,
					8008
				],
				[
					-27,
					23
				],
				[
					-20,
					-9
				],
				[
					-13,
					6
				],
				[
					-16,
					-12
				],
				[
					-14,
					20
				],
				[
					-12,
					-7
				],
				[
					-1,
					3
				]
			],
			[
				[
					3158,
					6248
				],
				[
					14,
					-5
				],
				[
					5,
					-11
				],
				[
					-7,
					-15
				],
				[
					-21,
					0
				],
				[
					-16,
					-2
				],
				[
					-2,
					25
				],
				[
					4,
					8
				],
				[
					23,
					0
				]
			],
			[
				[
					8628,
					7623
				],
				[
					3,
					-10
				]
			],
			[
				[
					6426,
					6600
				],
				[
					-7,
					-4
				],
				[
					-9,
					11
				]
			],
			[
				[
					5783,
					7801
				],
				[
					13,
					-10
				],
				[
					13,
					9
				],
				[
					12,
					-10
				]
			],
			[
				[
					5628,
					7729
				],
				[
					-5,
					10
				],
				[
					7,
					10
				],
				[
					-7,
					7
				],
				[
					-9,
					-13
				],
				[
					-16,
					17
				],
				[
					-2,
					24
				],
				[
					-17,
					13
				],
				[
					-3,
					18
				],
				[
					-15,
					23
				]
			],
			[
				[
					5630,
					7939
				],
				[
					12,
					12
				],
				[
					17,
					-6
				],
				[
					18,
					0
				],
				[
					13,
					-14
				],
				[
					9,
					9
				],
				[
					21,
					5
				],
				[
					7,
					14
				],
				[
					11,
					0
				]
			],
			[
				[
					6061,
					7894
				],
				[
					1,
					26
				],
				[
					14,
					16
				],
				[
					27,
					4
				],
				[
					4,
					19
				],
				[
					-6,
					32
				],
				[
					11,
					30
				],
				[
					0,
					17
				],
				[
					-41,
					19
				],
				[
					-16,
					-1
				],
				[
					-17,
					27
				],
				[
					-22,
					-9
				],
				[
					-35,
					20
				],
				[
					1,
					12
				],
				[
					-10,
					25
				],
				[
					-22,
					2
				],
				[
					-3,
					18
				],
				[
					7,
					12
				],
				[
					-18,
					33
				],
				[
					-28,
					-6
				],
				[
					-9,
					3
				],
				[
					-7,
					-13
				],
				[
					-10,
					2
				]
			],
			[
				[
					5863,
					9187
				],
				[
					28,
					20
				],
				[
					46,
					-34
				],
				[
					76,
					-14
				],
				[
					105,
					-65
				],
				[
					21,
					-28
				],
				[
					2,
					-38
				],
				[
					-31,
					-30
				],
				[
					-45,
					-16
				],
				[
					-124,
					44
				],
				[
					-20,
					-7
				],
				[
					45,
					-42
				]
			],
			[
				[
					5966,
					8977
				],
				[
					2,
					-27
				],
				[
					2,
					-59
				]
			],
			[
				[
					5970,
					8891
				],
				[
					35,
					-17
				],
				[
					22,
					-15
				],
				[
					4,
					28
				]
			],
			[
				[
					6031,
					8887
				],
				[
					-17,
					24
				],
				[
					18,
					22
				]
			],
			[
				[
					6920,
					9133
				],
				[
					-28,
					31
				],
				[
					-1,
					12
				]
			],
			[
				[
					8147,
					9571
				],
				[
					22,
					-22
				],
				[
					-7,
					-29
				]
			],
			[
				[
					5821,
					5105
				],
				[
					6,
					-6
				],
				[
					17,
					18
				]
			],
			[
				[
					5844,
					5117
				],
				[
					11,
					-33
				],
				[
					-2,
					-34
				],
				[
					-8,
					-7
				]
			],
			[
				[
					6443,
					6276
				],
				[
					-80,
					-22
				],
				[
					-26,
					-26
				],
				[
					-20,
					-60
				],
				[
					-13,
					-10
				],
				[
					-7,
					19
				],
				[
					-10,
					-3
				],
				[
					-27,
					6
				],
				[
					-5,
					6
				],
				[
					-32,
					-1
				],
				[
					-8,
					-6
				],
				[
					-11,
					15
				],
				[
					-7,
					-28
				],
				[
					2,
					-24
				],
				[
					-12,
					-19
				]
			],
			[
				[
					5634,
					5824
				],
				[
					0,
					14
				],
				[
					-10,
					16
				],
				[
					0,
					34
				],
				[
					-6,
					22
				],
				[
					-10,
					-3
				],
				[
					3,
					21
				],
				[
					7,
					24
				],
				[
					-3,
					24
				],
				[
					9,
					17
				],
				[
					-6,
					14
				],
				[
					8,
					36
				],
				[
					13,
					42
				],
				[
					23,
					-4
				],
				[
					-1,
					228
				]
			],
			[
				[
					5942,
					5734
				],
				[
					0,
					-7
				]
			],
			[
				[
					5942,
					5727
				],
				[
					-4,
					1
				],
				[
					1,
					29
				],
				[
					-3,
					20
				],
				[
					-15,
					22
				],
				[
					-3,
					42
				],
				[
					3,
					42
				],
				[
					-13,
					4
				],
				[
					-1,
					-13
				],
				[
					-17,
					-3
				],
				[
					7,
					-16
				],
				[
					2,
					-35
				],
				[
					-15,
					-32
				],
				[
					-14,
					-41
				],
				[
					-14,
					-6
				],
				[
					-24,
					34
				],
				[
					-10,
					-12
				],
				[
					-3,
					-17
				],
				[
					-14,
					-11
				],
				[
					-1,
					-12
				],
				[
					-28,
					0
				],
				[
					-4,
					12
				],
				[
					-20,
					2
				],
				[
					-10,
					-10
				],
				[
					-8,
					5
				],
				[
					-14,
					34
				],
				[
					-5,
					15
				],
				[
					-20,
					-7
				],
				[
					-7,
					-27
				],
				[
					-7,
					-52
				],
				[
					-10,
					-10
				],
				[
					-9,
					-7
				]
			],
			[
				[
					5662,
					5678
				],
				[
					-2,
					3
				]
			],
			[
				[
					5943,
					5427
				],
				[
					-17,
					-27
				],
				[
					-19,
					0
				],
				[
					-22,
					-13
				],
				[
					-18,
					13
				],
				[
					-12,
					-16
				]
			],
			[
				[
					5681,
					5656
				],
				[
					-19,
					22
				]
			],
			[
				[
					5942,
					5727
				],
				[
					1,
					-45
				]
			],
			[
				[
					2541,
					5940
				],
				[
					-10,
					6
				],
				[
					-11,
					11
				]
			],
			[
				[
					6359,
					5839
				],
				[
					-1,
					-1
				],
				[
					0,
					-24
				],
				[
					0,
					-58
				],
				[
					0,
					-30
				],
				[
					-12,
					-35
				],
				[
					-20,
					-48
				]
			],
			[
				[
					3488,
					5425
				],
				[
					11,
					-35
				],
				[
					-5,
					-24
				]
			],
			[
				[
					3494,
					5366
				],
				[
					-2,
					-27
				],
				[
					-7,
					-24
				]
			],
			[
				[
					5626,
					8008
				],
				[
					-8,
					-15
				],
				[
					-6,
					-23
				]
			],
			[
				[
					5890,
					3643
				],
				[
					-6,
					-26
				],
				[
					-16,
					-6
				],
				[
					-17,
					31
				],
				[
					0,
					20
				],
				[
					8,
					22
				],
				[
					2,
					16
				],
				[
					8,
					4
				],
				[
					14,
					-10
				]
			],
			[
				[
					6003,
					7245
				],
				[
					7,
					12
				],
				[
					8,
					13
				],
				[
					1,
					32
				],
				[
					10,
					-11
				],
				[
					30,
					16
				],
				[
					15,
					-11
				],
				[
					23,
					0
				],
				[
					32,
					22
				],
				[
					15,
					-1
				],
				[
					31,
					9
				]
			],
			[
				[
					6883,
					7321
				],
				[
					16,
					58
				],
				[
					-6,
					43
				],
				[
					-21,
					14
				],
				[
					7,
					25
				],
				[
					24,
					-3
				],
				[
					13,
					32
				],
				[
					9,
					37
				],
				[
					37,
					14
				],
				[
					-6,
					-27
				],
				[
					4,
					-16
				],
				[
					11,
					1
				]
			],
			[
				[
					6554,
					7561
				],
				[
					31,
					0
				],
				[
					-5,
					29
				],
				[
					24,
					20
				],
				[
					23,
					34
				],
				[
					38,
					-31
				],
				[
					3,
					-46
				],
				[
					10,
					-11
				],
				[
					30,
					2
				],
				[
					10,
					-10
				],
				[
					13,
					-60
				],
				[
					32,
					-39
				],
				[
					18,
					-27
				],
				[
					29,
					-29
				],
				[
					37,
					-24
				],
				[
					0,
					-36
				]
			],
			[
				[
					3286,
					5802
				],
				[
					16,
					7
				],
				[
					6,
					-2
				],
				[
					-1,
					-43
				],
				[
					-24,
					-6
				],
				[
					-5,
					5
				],
				[
					8,
					16
				],
				[
					0,
					23
				]
			],
			[
				[
					8381,
					6587
				],
				[
					-16,
					-93
				],
				[
					-12,
					-47
				],
				[
					-15,
					49
				],
				[
					-3,
					42
				],
				[
					16,
					57
				],
				[
					23,
					44
				],
				[
					12,
					-18
				],
				[
					-5,
					-34
				]
			],
			[
				[
					5909,
					4650
				],
				[
					-16,
					18
				],
				[
					-18,
					9
				],
				[
					-11,
					10
				],
				[
					-11,
					15
				]
			],
			[
				[
					5844,
					5117
				],
				[
					10,
					7
				],
				[
					30,
					-1
				],
				[
					57,
					4
				]
			],
			[
				[
					3052,
					7697
				],
				[
					-15,
					-34
				],
				[
					-5,
					-13
				]
			],
			[
				[
					2952,
					7539
				],
				[
					40,
					11
				],
				[
					9,
					-11
				]
			],
			[
				[
					2896,
					7366
				],
				[
					-14,
					22
				],
				[
					-4,
					48
				]
			],
			[
				[
					2522,
					6928
				],
				[
					-11,
					-9
				],
				[
					5,
					-16
				]
			],
			[
				[
					2316,
					6812
				],
				[
					-15,
					-28
				],
				[
					-6,
					-25
				]
			],
			[
				[
					1746,
					7055
				],
				[
					-5,
					30
				],
				[
					-18,
					33
				],
				[
					-13,
					7
				],
				[
					-3,
					16
				],
				[
					-15,
					3
				],
				[
					-10,
					16
				],
				[
					-26,
					6
				],
				[
					-7,
					9
				],
				[
					-4,
					31
				],
				[
					-27,
					58
				],
				[
					-23,
					80
				],
				[
					1,
					14
				],
				[
					-12,
					19
				],
				[
					-22,
					48
				],
				[
					-3,
					47
				],
				[
					-15,
					31
				],
				[
					6,
					48
				],
				[
					-1,
					49
				],
				[
					-9,
					45
				],
				[
					11,
					54
				]
			],
			[
				[
					1551,
					7699
				],
				[
					3,
					52
				],
				[
					4,
					52
				]
			],
			[
				[
					1558,
					7803
				],
				[
					-5,
					78
				],
				[
					-9,
					49
				],
				[
					-8,
					27
				],
				[
					3,
					11
				],
				[
					40,
					-20
				],
				[
					15,
					-54
				],
				[
					7,
					15
				],
				[
					-4,
					47
				],
				[
					-10,
					48
				]
			],
			[
				[
					5816,
					3910
				],
				[
					12,
					-1
				],
				[
					13,
					-9
				],
				[
					10,
					6
				],
				[
					14,
					-5
				]
			],
			[
				[
					5840,
					4289
				],
				[
					-21,
					-8
				],
				[
					-16,
					-23
				],
				[
					-3,
					-20
				],
				[
					-10,
					-4
				],
				[
					-24,
					-48
				],
				[
					-16,
					-37
				],
				[
					-9,
					-1
				],
				[
					-9,
					6
				],
				[
					-31,
					7
				]
			]
		]
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = [
		{
			"LAT": 33,
			"LONG": 66,
			"FIPS10": "AF",
			"SHORT_NAME": "Afghanistan",
			"ISO3136": "AF"
		},
		{
			"LAT": 41,
			"LONG": 20,
			"FIPS10": "AL",
			"SHORT_NAME": "Albania",
			"ISO3136": "AL"
		},
		{
			"LAT": 28,
			"LONG": 3,
			"FIPS10": "AG",
			"SHORT_NAME": "Algeria",
			"ISO3136": "DZ"
		},
		{
			"LAT": -14.3333333,
			"LONG": -170,
			"FIPS10": "AS",
			"SHORT_NAME": "American Samoa",
			"ISO3136": "AS"
		},
		{
			"LAT": 42.5,
			"LONG": 1.5,
			"FIPS10": "AN",
			"SHORT_NAME": "Andorra",
			"ISO3136": "AD"
		},
		{
			"LAT": -12.5,
			"LONG": 18.5,
			"FIPS10": "AO",
			"SHORT_NAME": "Angola",
			"ISO3136": "AO"
		},
		{
			"LAT": 18.216667,
			"LONG": -63.05,
			"FIPS10": "AV",
			"SHORT_NAME": "Anguilla",
			"ISO3136": "AI"
		},
		{
			"LAT": 17.05,
			"LONG": -61.8,
			"FIPS10": "AC",
			"SHORT_NAME": "Antigua and Barbuda",
			"ISO3136": "AG"
		},
		{
			"LAT": -34,
			"LONG": -64,
			"FIPS10": "AR",
			"SHORT_NAME": "Argentina",
			"ISO3136": "AR"
		},
		{
			"LAT": 40,
			"LONG": 45,
			"FIPS10": "AM",
			"SHORT_NAME": "Armenia",
			"ISO3136": "AM"
		},
		{
			"LAT": 12.5,
			"LONG": -69.966667,
			"FIPS10": "AA",
			"SHORT_NAME": "Aruba",
			"ISO3136": "AW"
		},
		{
			"LAT": -15.95,
			"LONG": -5.7,
			"FIPS10": "SH",
			"SHORT_NAME": "Ascension",
			"ISO3136": "SH"
		},
		{
			"LAT": -12.416667,
			"LONG": 123.333333,
			"FIPS10": "AT",
			"SHORT_NAME": "Ashmore and Cartier Islands",
			"ISO3136": ""
		},
		{
			"LAT": -25,
			"LONG": 135,
			"FIPS10": "AS",
			"SHORT_NAME": "Australia",
			"ISO3136": "AU"
		},
		{
			"LAT": 47.333333,
			"LONG": 13.333333,
			"FIPS10": "AU",
			"SHORT_NAME": "Austria",
			"ISO3136": "AT"
		},
		{
			"LAT": 40.5,
			"LONG": 47.5,
			"FIPS10": "AJ",
			"SHORT_NAME": "Azerbaijan",
			"ISO3136": "AZ"
		},
		{
			"LAT": 24,
			"LONG": -76,
			"FIPS10": "BF",
			"SHORT_NAME": "Bahamas",
			"ISO3136": "BS"
		},
		{
			"LAT": 26,
			"LONG": 50.5,
			"FIPS10": "BA",
			"SHORT_NAME": "Bahrain",
			"ISO3136": "BH"
		},
		{
			"LAT": 24,
			"LONG": 90,
			"FIPS10": "BG",
			"SHORT_NAME": "Bangladesh",
			"ISO3136": "BD"
		},
		{
			"LAT": 13.166667,
			"LONG": -59.533333,
			"FIPS10": "BB",
			"SHORT_NAME": "Barbados",
			"ISO3136": "BB"
		},
		{
			"LAT": -21.416667,
			"LONG": 39.7,
			"FIPS10": "BS",
			"SHORT_NAME": "Bassas da India",
			"ISO3136": ""
		},
		{
			"LAT": 53,
			"LONG": 28,
			"FIPS10": "BO",
			"SHORT_NAME": "Belarus",
			"ISO3136": "BY"
		},
		{
			"LAT": 50.833333,
			"LONG": 4,
			"FIPS10": "BE",
			"SHORT_NAME": "Belgium",
			"ISO3136": "BE"
		},
		{
			"LAT": 17.25,
			"LONG": -88.75,
			"FIPS10": "BH",
			"SHORT_NAME": "Belize",
			"ISO3136": "BZ"
		},
		{
			"LAT": 9.5,
			"LONG": 2.25,
			"FIPS10": "BN",
			"SHORT_NAME": "Benin",
			"ISO3136": "BJ"
		},
		{
			"LAT": 32.333333,
			"LONG": -64.75,
			"FIPS10": "BD",
			"SHORT_NAME": "Bermuda",
			"ISO3136": "BM"
		},
		{
			"LAT": 27.5,
			"LONG": 90.5,
			"FIPS10": "BT",
			"SHORT_NAME": "Bhutan",
			"ISO3136": "BT"
		},
		{
			"LAT": -17,
			"LONG": -65,
			"FIPS10": "BL",
			"SHORT_NAME": "Bolivia",
			"ISO3136": "BO"
		},
		{
			"LAT": 12.2,
			"LONG": -68.25,
			"FIPS10": "NT",
			"SHORT_NAME": "Bonaire",
			"ISO3136": " and Saba"
		},
		{
			"LAT": 44.25,
			"LONG": 17.833333,
			"FIPS10": "BK",
			"SHORT_NAME": "Bosnia and Herzegovina",
			"ISO3136": "BA"
		},
		{
			"LAT": -22,
			"LONG": 24,
			"FIPS10": "BC",
			"SHORT_NAME": "Botswana",
			"ISO3136": "BW"
		},
		{
			"LAT": -54.433333,
			"LONG": 3.4,
			"FIPS10": "BV",
			"SHORT_NAME": "Bouvet Island",
			"ISO3136": "BV"
		},
		{
			"LAT": -10,
			"LONG": -55,
			"FIPS10": "BR",
			"SHORT_NAME": "Brazil",
			"ISO3136": "BR"
		},
		{
			"LAT": -6,
			"LONG": 72,
			"FIPS10": "IO",
			"SHORT_NAME": "British Indian Ocean Territory",
			"ISO3136": "IO"
		},
		{
			"LAT": 18.5,
			"LONG": -64.5,
			"FIPS10": "VI",
			"SHORT_NAME": "British Virgin Islands",
			"ISO3136": "VG"
		},
		{
			"LAT": 4.5,
			"LONG": 114.666667,
			"FIPS10": "BX",
			"SHORT_NAME": "Brunei",
			"ISO3136": "BN"
		},
		{
			"LAT": 43,
			"LONG": 25,
			"FIPS10": "BU",
			"SHORT_NAME": "Bulgaria",
			"ISO3136": "BG"
		},
		{
			"LAT": 13,
			"LONG": -2,
			"FIPS10": "UV",
			"SHORT_NAME": "Burkina Faso",
			"ISO3136": "BF"
		},
		{
			"LAT": 22,
			"LONG": 98,
			"FIPS10": "BM",
			"SHORT_NAME": "Burma",
			"ISO3136": "MM"
		},
		{
			"LAT": -3.5,
			"LONG": 30,
			"FIPS10": "BY",
			"SHORT_NAME": "Burundi",
			"ISO3136": "BI"
		},
		{
			"LAT": 13,
			"LONG": 105,
			"FIPS10": "CB",
			"SHORT_NAME": "Cambodia",
			"ISO3136": "KH"
		},
		{
			"LAT": 6,
			"LONG": 12,
			"FIPS10": "CM",
			"SHORT_NAME": "Cameroon",
			"ISO3136": "CM"
		},
		{
			"LAT": 60,
			"LONG": -96,
			"FIPS10": "CA",
			"SHORT_NAME": "Canada",
			"ISO3136": "CA"
		},
		{
			"LAT": 16,
			"LONG": -24,
			"FIPS10": "CV",
			"SHORT_NAME": "Cape Verde",
			"ISO3136": "CV"
		},
		{
			"LAT": 19.5,
			"LONG": -80.666667,
			"FIPS10": "CJ",
			"SHORT_NAME": "Cayman Islands",
			"ISO3136": "KY"
		},
		{
			"LAT": 7,
			"LONG": 21,
			"FIPS10": "CT",
			"SHORT_NAME": "Central African Republic",
			"ISO3136": "CF"
		},
		{
			"LAT": 15,
			"LONG": 19,
			"FIPS10": "CD",
			"SHORT_NAME": "Chad",
			"ISO3136": "TD"
		},
		{
			"LAT": -30,
			"LONG": -71,
			"FIPS10": "CI",
			"SHORT_NAME": "Chile",
			"ISO3136": "CL"
		},
		{
			"LAT": 35,
			"LONG": 105,
			"FIPS10": "CH",
			"SHORT_NAME": "China",
			"ISO3136": "CN"
		},
		{
			"LAT": -10.5,
			"LONG": 105.666667,
			"FIPS10": "KT",
			"SHORT_NAME": "Christmas Island",
			"ISO3136": "CX"
		},
		{
			"LAT": 10.283333,
			"LONG": -109.216667,
			"FIPS10": "IP",
			"SHORT_NAME": "Clipperton Island",
			"ISO3136": ""
		},
		{
			"LAT": -12,
			"LONG": 96.833333,
			"FIPS10": "CK",
			"SHORT_NAME": "Cocos (Keeling) Islands",
			"ISO3136": "CC"
		},
		{
			"LAT": 4,
			"LONG": -72,
			"FIPS10": "CO",
			"SHORT_NAME": "Colombia",
			"ISO3136": "CO"
		},
		{
			"LAT": -12.166667,
			"LONG": 44.25,
			"FIPS10": "CN",
			"SHORT_NAME": "Comoros",
			"ISO3136": "KM"
		},
		{
			"LAT": -16.083333,
			"LONG": -161.583333,
			"FIPS10": "CW",
			"SHORT_NAME": "Cook Islands",
			"ISO3136": "CK"
		},
		{
			"LAT": -17.5,
			"LONG": 151,
			"FIPS10": "CR",
			"SHORT_NAME": "Coral Sea Islands",
			"ISO3136": ""
		},
		{
			"LAT": 10,
			"LONG": -84,
			"FIPS10": "CS",
			"SHORT_NAME": "Costa Rica",
			"ISO3136": "CR"
		},
		{
			"LAT": 8,
			"LONG": -5,
			"FIPS10": "IV",
			"SHORT_NAME": "Cote d'Ivoire",
			"ISO3136": "CI"
		},
		{
			"LAT": 45.166667,
			"LONG": 15.5,
			"FIPS10": "HR",
			"SHORT_NAME": "Croatia",
			"ISO3136": "HR"
		},
		{
			"LAT": 22,
			"LONG": -79.5,
			"FIPS10": "CU",
			"SHORT_NAME": "Cuba",
			"ISO3136": "CU"
		},
		{
			"LAT": 12.166667,
			"LONG": -69,
			"FIPS10": "UC",
			"SHORT_NAME": "Curaçao",
			"ISO3136": "CW"
		},
		{
			"LAT": 35,
			"LONG": 33,
			"FIPS10": "CY",
			"SHORT_NAME": "Cyprus",
			"ISO3136": "CY"
		},
		{
			"LAT": 49.75,
			"LONG": 15,
			"FIPS10": "EZ",
			"SHORT_NAME": "Czech Republic",
			"ISO3136": "CZ"
		},
		{
			"LAT": 0,
			"LONG": 25,
			"FIPS10": "CG",
			"SHORT_NAME": "Democratic Republic of the Congo",
			"ISO3136": "CD"
		},
		{
			"LAT": 56,
			"LONG": 10,
			"FIPS10": "DA",
			"SHORT_NAME": "Denmark",
			"ISO3136": "DK"
		},
		{
			"LAT": 11.5,
			"LONG": 42.5,
			"FIPS10": "DJ",
			"SHORT_NAME": "Djibouti",
			"ISO3136": "DJ"
		},
		{
			"LAT": 15.5,
			"LONG": -61.333333,
			"FIPS10": "DO",
			"SHORT_NAME": "Dominica",
			"ISO3136": "DM"
		},
		{
			"LAT": 19,
			"LONG": -70.666667,
			"FIPS10": "DR",
			"SHORT_NAME": "Dominican Republic",
			"ISO3136": "DO"
		},
		{
			"LAT": -2,
			"LONG": -77.5,
			"FIPS10": "EC",
			"SHORT_NAME": "Ecuador",
			"ISO3136": "EC"
		},
		{
			"LAT": 27,
			"LONG": 30,
			"FIPS10": "EG",
			"SHORT_NAME": "Egypt",
			"ISO3136": "EG"
		},
		{
			"LAT": 13.833333,
			"LONG": -88.916667,
			"FIPS10": "ES",
			"SHORT_NAME": "El Salvador",
			"ISO3136": "SV"
		},
		{
			"LAT": 2,
			"LONG": 10,
			"FIPS10": "EK",
			"SHORT_NAME": "Equatorial Guinea",
			"ISO3136": "GQ"
		},
		{
			"LAT": 15,
			"LONG": 39,
			"FIPS10": "ER",
			"SHORT_NAME": "Eritrea",
			"ISO3136": "ER"
		},
		{
			"LAT": 59,
			"LONG": 26,
			"FIPS10": "EN",
			"SHORT_NAME": "Estonia",
			"ISO3136": "EE"
		},
		{
			"LAT": 8,
			"LONG": 38,
			"FIPS10": "ET",
			"SHORT_NAME": "Ethiopia",
			"ISO3136": "ET"
		},
		{
			"LAT": -22.333333,
			"LONG": 40.366667,
			"FIPS10": "EU",
			"SHORT_NAME": "Europa Island",
			"ISO3136": ""
		},
		{
			"LAT": -51.75,
			"LONG": -59.166667,
			"FIPS10": "FK",
			"SHORT_NAME": "Falkland Islands",
			"ISO3136": "FK"
		},
		{
			"LAT": 62,
			"LONG": -7,
			"FIPS10": "FO",
			"SHORT_NAME": "Faroe Islands",
			"ISO3136": "FO"
		},
		{
			"LAT": 5,
			"LONG": 152,
			"FIPS10": "FM",
			"SHORT_NAME": "Federated States of Micronesia",
			"ISO3136": "FM"
		},
		{
			"LAT": -18,
			"LONG": 178,
			"FIPS10": "FJ",
			"SHORT_NAME": "Fiji",
			"ISO3136": "FJ"
		},
		{
			"LAT": 64,
			"LONG": 26,
			"FIPS10": "FI",
			"SHORT_NAME": "Finland",
			"ISO3136": "FI"
		},
		{
			"LAT": 46,
			"LONG": 2,
			"FIPS10": "FR",
			"SHORT_NAME": "France",
			"ISO3136": "FR"
		},
		{
			"LAT": 4,
			"LONG": -53,
			"FIPS10": "FG",
			"SHORT_NAME": "French Guiana",
			"ISO3136": "GF"
		},
		{
			"LAT": -15,
			"LONG": -140,
			"FIPS10": "FP",
			"SHORT_NAME": "French Polynesia",
			"ISO3136": "PF"
		},
		{
			"LAT": -43,
			"LONG": 67,
			"FIPS10": "FS",
			"SHORT_NAME": "French Southern and Antarctic Lands",
			"ISO3136": "TF"
		},
		{
			"LAT": -1,
			"LONG": 11.75,
			"FIPS10": "GB",
			"SHORT_NAME": "Gabon",
			"ISO3136": "GA"
		},
		{
			"LAT": 13.5,
			"LONG": -15.5,
			"FIPS10": "GA",
			"SHORT_NAME": "Gambia",
			"ISO3136": "GM"
		},
		{
			"LAT": 31.425074,
			"LONG": 34.373398,
			"FIPS10": "GZ",
			"SHORT_NAME": "Gaza Strip",
			"ISO3136": "PS"
		},
		{
			"LAT": 41.999981,
			"LONG": 43.499905,
			"FIPS10": "GG",
			"SHORT_NAME": "Georgia",
			"ISO3136": "GE"
		},
		{
			"LAT": 51.5,
			"LONG": 10.5,
			"FIPS10": "GM",
			"SHORT_NAME": "Germany",
			"ISO3136": "DE"
		},
		{
			"LAT": 8,
			"LONG": -2,
			"FIPS10": "GH",
			"SHORT_NAME": "Ghana",
			"ISO3136": "GH"
		},
		{
			"LAT": 36.133333,
			"LONG": -5.35,
			"FIPS10": "GI",
			"SHORT_NAME": "Gibraltar",
			"ISO3136": "GI"
		},
		{
			"LAT": -11.5,
			"LONG": 47.333333,
			"FIPS10": "GO",
			"SHORT_NAME": "Glorioso Islands",
			"ISO3136": ""
		},
		{
			"LAT": 39,
			"LONG": 22,
			"FIPS10": "GR",
			"SHORT_NAME": "Greece",
			"ISO3136": "GR"
		},
		{
			"LAT": 72,
			"LONG": -40,
			"FIPS10": "GL",
			"SHORT_NAME": "Greenland",
			"ISO3136": "GL"
		},
		{
			"LAT": 12.116667,
			"LONG": -61.666667,
			"FIPS10": "GJ",
			"SHORT_NAME": "Grenada",
			"ISO3136": "GD"
		},
		{
			"LAT": 16.25,
			"LONG": -61.583333,
			"FIPS10": "GP",
			"SHORT_NAME": "Guadeloupe",
			"ISO3136": "GP"
		},
		{
			"LAT": 13.4444444,
			"LONG": 144.7366667,
			"FIPS10": "GU",
			"SHORT_NAME": "Guam",
			"ISO3136": "GU"
		},
		{
			"LAT": 15.5,
			"LONG": -90.25,
			"FIPS10": "GT",
			"SHORT_NAME": "Guatemala",
			"ISO3136": "GT"
		},
		{
			"LAT": 49.583333,
			"LONG": -2.333333,
			"FIPS10": "GK",
			"SHORT_NAME": "Guernsey",
			"ISO3136": "GG"
		},
		{
			"LAT": 11,
			"LONG": -10,
			"FIPS10": "GV",
			"SHORT_NAME": "Guinea",
			"ISO3136": "GN"
		},
		{
			"LAT": 12,
			"LONG": -15,
			"FIPS10": "PU",
			"SHORT_NAME": "Guinea-Bissau",
			"ISO3136": "GW"
		},
		{
			"LAT": 5,
			"LONG": -59,
			"FIPS10": "GY",
			"SHORT_NAME": "Guyana",
			"ISO3136": "GY"
		},
		{
			"LAT": 19,
			"LONG": -72.416667,
			"FIPS10": "HA",
			"SHORT_NAME": "Haiti",
			"ISO3136": "HT"
		},
		{
			"LAT": -53,
			"LONG": 73,
			"FIPS10": "HM",
			"SHORT_NAME": "Heard Island and McDonald Islands",
			"ISO3136": "HM"
		},
		{
			"LAT": 15,
			"LONG": -86.5,
			"FIPS10": "HO",
			"SHORT_NAME": "Honduras",
			"ISO3136": "HN"
		},
		{
			"LAT": 22.25,
			"LONG": 114.166667,
			"FIPS10": "HK",
			"SHORT_NAME": "Hong Kong",
			"ISO3136": "HK"
		},
		{
			"LAT": 47,
			"LONG": 20,
			"FIPS10": "HU",
			"SHORT_NAME": "Hungary",
			"ISO3136": "HU"
		},
		{
			"LAT": 65,
			"LONG": -18,
			"FIPS10": "IC",
			"SHORT_NAME": "Iceland",
			"ISO3136": "IS"
		},
		{
			"LAT": 20,
			"LONG": 77,
			"FIPS10": "IN",
			"SHORT_NAME": "India",
			"ISO3136": "IN"
		},
		{
			"LAT": -5,
			"LONG": 120,
			"FIPS10": "ID",
			"SHORT_NAME": "Indonesia",
			"ISO3136": "ID"
		},
		{
			"LAT": 32,
			"LONG": 53,
			"FIPS10": "IR",
			"SHORT_NAME": "Iran",
			"ISO3136": "IR"
		},
		{
			"LAT": 33,
			"LONG": 44,
			"FIPS10": "IZ",
			"SHORT_NAME": "Iraq",
			"ISO3136": "IQ"
		},
		{
			"LAT": 53,
			"LONG": -8,
			"FIPS10": "EI",
			"SHORT_NAME": "Ireland",
			"ISO3136": "IE"
		},
		{
			"LAT": 54.25,
			"LONG": -4.5,
			"FIPS10": "IM",
			"SHORT_NAME": "Isle of Man",
			"ISO3136": "IM"
		},
		{
			"LAT": 31.5,
			"LONG": 34.75,
			"FIPS10": "IS",
			"SHORT_NAME": "Israel",
			"ISO3136": "IL"
		},
		{
			"LAT": 42.833333,
			"LONG": 12.833333,
			"FIPS10": "IT",
			"SHORT_NAME": "Italy",
			"ISO3136": "IT"
		},
		{
			"LAT": 18.25,
			"LONG": -77.5,
			"FIPS10": "JM",
			"SHORT_NAME": "Jamaica",
			"ISO3136": "JM"
		},
		{
			"LAT": 36,
			"LONG": 138,
			"FIPS10": "JA",
			"SHORT_NAME": "Japan",
			"ISO3136": "JP"
		},
		{
			"LAT": 49.216667,
			"LONG": -2.116667,
			"FIPS10": "JE",
			"SHORT_NAME": "Jersey",
			"ISO3136": "JE"
		},
		{
			"LAT": 31,
			"LONG": 36,
			"FIPS10": "JO",
			"SHORT_NAME": "Jordan",
			"ISO3136": "JO"
		},
		{
			"LAT": -17.05833,
			"LONG": 42.71667,
			"FIPS10": "JU",
			"SHORT_NAME": "Juan de Nova Island",
			"ISO3136": ""
		},
		{
			"LAT": 48,
			"LONG": 68,
			"FIPS10": "KZ",
			"SHORT_NAME": "Kazakhstan",
			"ISO3136": "KZ"
		},
		{
			"LAT": 1,
			"LONG": 38,
			"FIPS10": "KE",
			"SHORT_NAME": "Kenya",
			"ISO3136": "KE"
		},
		{
			"LAT": -5,
			"LONG": -170,
			"FIPS10": "KR",
			"SHORT_NAME": "Kiribati",
			"ISO3136": "KI"
		},
		{
			"LAT": 42.583333,
			"LONG": 21,
			"FIPS10": "KV",
			"SHORT_NAME": "Kosovo",
			"ISO3136": ""
		},
		{
			"LAT": 29.5,
			"LONG": 47.75,
			"FIPS10": "KU",
			"SHORT_NAME": "Kuwait",
			"ISO3136": "KW"
		},
		{
			"LAT": 41,
			"LONG": 75,
			"FIPS10": "KG",
			"SHORT_NAME": "Kyrgyzstan",
			"ISO3136": "KG"
		},
		{
			"LAT": 18,
			"LONG": 105,
			"FIPS10": "LA",
			"SHORT_NAME": "Laos",
			"ISO3136": "LA"
		},
		{
			"LAT": 57,
			"LONG": 25,
			"FIPS10": "LG",
			"SHORT_NAME": "Latvia",
			"ISO3136": "LV"
		},
		{
			"LAT": 33.833333,
			"LONG": 35.833333,
			"FIPS10": "LE",
			"SHORT_NAME": "Lebanon",
			"ISO3136": "LB"
		},
		{
			"LAT": -29.5,
			"LONG": 28.25,
			"FIPS10": "LT",
			"SHORT_NAME": "Lesotho",
			"ISO3136": "LS"
		},
		{
			"LAT": 6.5,
			"LONG": -9.5,
			"FIPS10": "LI",
			"SHORT_NAME": "Liberia",
			"ISO3136": "LR"
		},
		{
			"LAT": 25,
			"LONG": 17,
			"FIPS10": "LY",
			"SHORT_NAME": "Libya",
			"ISO3136": "LY"
		},
		{
			"LAT": 47.166667,
			"LONG": 9.533333,
			"FIPS10": "LS",
			"SHORT_NAME": "Liechtenstein",
			"ISO3136": "LI"
		},
		{
			"LAT": 56,
			"LONG": 24,
			"FIPS10": "LH",
			"SHORT_NAME": "Lithuania",
			"ISO3136": "LT"
		},
		{
			"LAT": 49.75,
			"LONG": 6.166667,
			"FIPS10": "LU",
			"SHORT_NAME": "Luxembourg",
			"ISO3136": "LU"
		},
		{
			"LAT": 22.157778,
			"LONG": 113.559722,
			"FIPS10": "MC",
			"SHORT_NAME": "Macau",
			"ISO3136": "MO"
		},
		{
			"LAT": 41.833333,
			"LONG": 22,
			"FIPS10": "MK",
			"SHORT_NAME": "Macedonia",
			"ISO3136": "MK"
		},
		{
			"LAT": -20,
			"LONG": 47,
			"FIPS10": "MA",
			"SHORT_NAME": "Madagascar",
			"ISO3136": "MG"
		},
		{
			"LAT": -13.5,
			"LONG": 34,
			"FIPS10": "MI",
			"SHORT_NAME": "Malawi",
			"ISO3136": "MW"
		},
		{
			"LAT": 2.5,
			"LONG": 112.5,
			"FIPS10": "MY",
			"SHORT_NAME": "Malaysia",
			"ISO3136": "MY"
		},
		{
			"LAT": 3.2,
			"LONG": 73,
			"FIPS10": "MV",
			"SHORT_NAME": "Maldives",
			"ISO3136": "MV"
		},
		{
			"LAT": 17,
			"LONG": -4,
			"FIPS10": "ML",
			"SHORT_NAME": "Mali",
			"ISO3136": "ML"
		},
		{
			"LAT": 35.916667,
			"LONG": 14.433333,
			"FIPS10": "MT",
			"SHORT_NAME": "Malta",
			"ISO3136": "MT"
		},
		{
			"LAT": 10,
			"LONG": 167,
			"FIPS10": "RM",
			"SHORT_NAME": "Marshall Islands",
			"ISO3136": "MH"
		},
		{
			"LAT": 14.666667,
			"LONG": -61,
			"FIPS10": "MB",
			"SHORT_NAME": "Martinique",
			"ISO3136": "MQ"
		},
		{
			"LAT": 20,
			"LONG": -12,
			"FIPS10": "MR",
			"SHORT_NAME": "Mauritania",
			"ISO3136": "MR"
		},
		{
			"LAT": -20.3,
			"LONG": 57.583333,
			"FIPS10": "MP",
			"SHORT_NAME": "Mauritius",
			"ISO3136": "MU"
		},
		{
			"LAT": -12.833333,
			"LONG": 45.166667,
			"FIPS10": "MF",
			"SHORT_NAME": "Mayotte",
			"ISO3136": "YT"
		},
		{
			"LAT": 23,
			"LONG": -102,
			"FIPS10": "MX",
			"SHORT_NAME": "Mexico",
			"ISO3136": "MX"
		},
		{
			"LAT": 47,
			"LONG": 29,
			"FIPS10": "MD",
			"SHORT_NAME": "Moldova",
			"ISO3136": "MD"
		},
		{
			"LAT": 43.733333,
			"LONG": 7.4,
			"FIPS10": "MN",
			"SHORT_NAME": "Monaco",
			"ISO3136": "MC"
		},
		{
			"LAT": 46,
			"LONG": 105,
			"FIPS10": "MG",
			"SHORT_NAME": "Mongolia",
			"ISO3136": "MN"
		},
		{
			"LAT": 42.5,
			"LONG": 19.3,
			"FIPS10": "MJ",
			"SHORT_NAME": "Montenegro",
			"ISO3136": "ME"
		},
		{
			"LAT": 16.75,
			"LONG": -62.2,
			"FIPS10": "MH",
			"SHORT_NAME": "Montserrat",
			"ISO3136": "MS"
		},
		{
			"LAT": 32,
			"LONG": -5,
			"FIPS10": "MO",
			"SHORT_NAME": "Morocco",
			"ISO3136": "MA"
		},
		{
			"LAT": -18.25,
			"LONG": 35,
			"FIPS10": "MZ",
			"SHORT_NAME": "Mozambique",
			"ISO3136": "MZ"
		},
		{
			"LAT": -22,
			"LONG": 17,
			"FIPS10": "WA",
			"SHORT_NAME": "Namibia",
			"ISO3136": "NA"
		},
		{
			"LAT": -0.533333,
			"LONG": 166.916667,
			"FIPS10": "NR",
			"SHORT_NAME": "Nauru",
			"ISO3136": "NR"
		},
		{
			"LAT": 28,
			"LONG": 84,
			"FIPS10": "NP",
			"SHORT_NAME": "Nepal",
			"ISO3136": "NP"
		},
		{
			"LAT": 52.5,
			"LONG": 5.75,
			"FIPS10": "NL",
			"SHORT_NAME": "Netherlands",
			"ISO3136": "NL"
		},
		{
			"LAT": -21.5,
			"LONG": 165.5,
			"FIPS10": "NC",
			"SHORT_NAME": "New Caledonia",
			"ISO3136": "NC"
		},
		{
			"LAT": -42,
			"LONG": 174,
			"FIPS10": "NZ",
			"SHORT_NAME": "New Zealand",
			"ISO3136": "NZ"
		},
		{
			"LAT": 13,
			"LONG": -85,
			"FIPS10": "NU",
			"SHORT_NAME": "Nicaragua",
			"ISO3136": "NI"
		},
		{
			"LAT": 16,
			"LONG": 8,
			"FIPS10": "NG",
			"SHORT_NAME": "Niger",
			"ISO3136": "NE"
		},
		{
			"LAT": 10,
			"LONG": 8,
			"FIPS10": "NI",
			"SHORT_NAME": "Nigeria",
			"ISO3136": "NG"
		},
		{
			"LAT": -19.033333,
			"LONG": -169.866667,
			"FIPS10": "NE",
			"SHORT_NAME": "Niue",
			"ISO3136": "NU"
		},
		{
			"LAT": -29.033333,
			"LONG": 167.95,
			"FIPS10": "NF",
			"SHORT_NAME": "Norfolk Island",
			"ISO3136": "NF"
		},
		{
			"LAT": 40,
			"LONG": 127,
			"FIPS10": "KN",
			"SHORT_NAME": "North Korea",
			"ISO3136": "KP"
		},
		{
			"LAT": 16,
			"LONG": 146,
			"FIPS10": "MP",
			"SHORT_NAME": "Northern Mariana Islands",
			"ISO3136": "MP"
		},
		{
			"LAT": 62,
			"LONG": 10,
			"FIPS10": "NO",
			"SHORT_NAME": "Norway",
			"ISO3136": "NO"
		},
		{
			"LAT": 21,
			"LONG": 57,
			"FIPS10": "MU",
			"SHORT_NAME": "Oman",
			"ISO3136": "OM"
		},
		{
			"LAT": 30,
			"LONG": 70,
			"FIPS10": "PK",
			"SHORT_NAME": "Pakistan",
			"ISO3136": "PK"
		},
		{
			"LAT": 6,
			"LONG": 134,
			"FIPS10": "PS",
			"SHORT_NAME": "Palau",
			"ISO3136": "PW"
		},
		{
			"LAT": 9,
			"LONG": -80,
			"FIPS10": "PM",
			"SHORT_NAME": "Panama",
			"ISO3136": "PA"
		},
		{
			"LAT": -6,
			"LONG": 147,
			"FIPS10": "PP",
			"SHORT_NAME": "Papua New Guinea",
			"ISO3136": "PG"
		},
		{
			"LAT": -22.993333,
			"LONG": -57.996389,
			"FIPS10": "PA",
			"SHORT_NAME": "Paraguay",
			"ISO3136": "PY"
		},
		{
			"LAT": -10,
			"LONG": -76,
			"FIPS10": "PE",
			"SHORT_NAME": "Peru",
			"ISO3136": "PE"
		},
		{
			"LAT": 13,
			"LONG": 122,
			"FIPS10": "RP",
			"SHORT_NAME": "Philippines",
			"ISO3136": "PH"
		},
		{
			"LAT": -25.066667,
			"LONG": -130.1,
			"FIPS10": "PC",
			"SHORT_NAME": "Pitcairn Islands",
			"ISO3136": "PN"
		},
		{
			"LAT": 52,
			"LONG": 20,
			"FIPS10": "PL",
			"SHORT_NAME": "Poland",
			"ISO3136": "PL"
		},
		{
			"LAT": 39.5,
			"LONG": -8,
			"FIPS10": "PO",
			"SHORT_NAME": "Portugal",
			"ISO3136": "PT"
		},
		{
			"LAT": 18.2482882,
			"LONG": -66.4998941,
			"FIPS10": "PR",
			"SHORT_NAME": "Puerto Rico",
			"ISO3136": "PR"
		},
		{
			"LAT": 25.5,
			"LONG": 51.25,
			"FIPS10": "QA",
			"SHORT_NAME": "Qatar",
			"ISO3136": "QA"
		},
		{
			"LAT": -1,
			"LONG": 15,
			"FIPS10": "CF",
			"SHORT_NAME": "Republic of the Congo",
			"ISO3136": "CG"
		},
		{
			"LAT": -21.1,
			"LONG": 55.6,
			"FIPS10": "RE",
			"SHORT_NAME": "Reunion",
			"ISO3136": "RE"
		},
		{
			"LAT": 46,
			"LONG": 25,
			"FIPS10": "RO",
			"SHORT_NAME": "Romania",
			"ISO3136": "RO"
		},
		{
			"LAT": 60,
			"LONG": 100,
			"FIPS10": "RS",
			"SHORT_NAME": "Russia",
			"ISO3136": "RU"
		},
		{
			"LAT": -2,
			"LONG": 30,
			"FIPS10": "RW",
			"SHORT_NAME": "Rwanda",
			"ISO3136": "RW"
		},
		{
			"LAT": 17.9,
			"LONG": -62.833333,
			"FIPS10": "TB",
			"SHORT_NAME": "Saint Barthelemy",
			"ISO3136": "BL"
		},
		{
			"LAT": 17.333333,
			"LONG": -62.75,
			"FIPS10": "SC",
			"SHORT_NAME": "Saint Kitts and Nevis",
			"ISO3136": "KN"
		},
		{
			"LAT": 13.883333,
			"LONG": -60.966667,
			"FIPS10": "ST",
			"SHORT_NAME": "Saint Lucia",
			"ISO3136": "LC"
		},
		{
			"LAT": 18.075,
			"LONG": -63.05833,
			"FIPS10": "RN",
			"SHORT_NAME": "Saint Martin",
			"ISO3136": "MF"
		},
		{
			"LAT": 46.833333,
			"LONG": -56.333333,
			"FIPS10": "SB",
			"SHORT_NAME": "Saint Pierre and Miquelon",
			"ISO3136": "PM"
		},
		{
			"LAT": 13.083333,
			"LONG": -61.2,
			"FIPS10": "VC",
			"SHORT_NAME": "Saint Vincent and the Grenadines",
			"ISO3136": "VC"
		},
		{
			"LAT": -13.803096,
			"LONG": -172.178309,
			"FIPS10": "WS",
			"SHORT_NAME": "Samoa",
			"ISO3136": "WS"
		},
		{
			"LAT": 43.933333,
			"LONG": 12.416667,
			"FIPS10": "SM",
			"SHORT_NAME": "San Marino",
			"ISO3136": "SM"
		},
		{
			"LAT": 1,
			"LONG": 7,
			"FIPS10": "TP",
			"SHORT_NAME": "Sao Tome and Principe",
			"ISO3136": "ST"
		},
		{
			"LAT": 25,
			"LONG": 45,
			"FIPS10": "SA",
			"SHORT_NAME": "Saudi Arabia",
			"ISO3136": "SA"
		},
		{
			"LAT": 14,
			"LONG": -14,
			"FIPS10": "SG",
			"SHORT_NAME": "Senegal",
			"ISO3136": "SN"
		},
		{
			"LAT": 44,
			"LONG": 21,
			"FIPS10": "RI",
			"SHORT_NAME": "Serbia",
			"ISO3136": "RS"
		},
		{
			"LAT": -4.583333,
			"LONG": 55.666667,
			"FIPS10": "SE",
			"SHORT_NAME": "Seychelles",
			"ISO3136": "SC"
		},
		{
			"LAT": 8.5,
			"LONG": -11.5,
			"FIPS10": "SL",
			"SHORT_NAME": "Sierra Leone",
			"ISO3136": "SL"
		},
		{
			"LAT": 1.366667,
			"LONG": 103.8,
			"FIPS10": "SN",
			"SHORT_NAME": "Singapore",
			"ISO3136": "SG"
		},
		{
			"LAT": 18.04167,
			"LONG": -63.06667,
			"FIPS10": "NN",
			"SHORT_NAME": "Sint Maarten",
			"ISO3136": "SX"
		},
		{
			"LAT": 48.666667,
			"LONG": 19.5,
			"FIPS10": "LO",
			"SHORT_NAME": "Slovakia",
			"ISO3136": "SK"
		},
		{
			"LAT": 46.25,
			"LONG": 15.166667,
			"FIPS10": "SI",
			"SHORT_NAME": "Slovenia",
			"ISO3136": "SI"
		},
		{
			"LAT": -8,
			"LONG": 159,
			"FIPS10": "BP",
			"SHORT_NAME": "Solomon Islands",
			"ISO3136": "SB"
		},
		{
			"LAT": 6,
			"LONG": 48,
			"FIPS10": "SO",
			"SHORT_NAME": "Somalia",
			"ISO3136": "SO"
		},
		{
			"LAT": -30,
			"LONG": 26,
			"FIPS10": "SF",
			"SHORT_NAME": "South Africa",
			"ISO3136": "ZA"
		},
		{
			"LAT": -56,
			"LONG": -33,
			"FIPS10": "SX",
			"SHORT_NAME": "South Georgia and South Sandwich Islands",
			"ISO3136": "GS"
		},
		{
			"LAT": 37,
			"LONG": 127.5,
			"FIPS10": "KS",
			"SHORT_NAME": "South Korea",
			"ISO3136": "KR"
		},
		{
			"LAT": 8,
			"LONG": 30,
			"FIPS10": "OD",
			"SHORT_NAME": "South Sudan",
			"ISO3136": "SS"
		},
		{
			"LAT": 40,
			"LONG": -4,
			"FIPS10": "SP",
			"SHORT_NAME": "Spain",
			"ISO3136": "ES"
		},
		{
			"LAT": 7,
			"LONG": 81,
			"FIPS10": "CE",
			"SHORT_NAME": "Sri Lanka",
			"ISO3136": "LK"
		},
		{
			"LAT": 16,
			"LONG": 30,
			"FIPS10": "SU",
			"SHORT_NAME": "Sudan",
			"ISO3136": "SD"
		},
		{
			"LAT": 4,
			"LONG": -56,
			"FIPS10": "NS",
			"SHORT_NAME": "Suriname",
			"ISO3136": "SR"
		},
		{
			"LAT": 78,
			"LONG": 20,
			"FIPS10": "SV",
			"SHORT_NAME": "Svalbard",
			"ISO3136": "SJ"
		},
		{
			"LAT": -26.5,
			"LONG": 31.5,
			"FIPS10": "WZ",
			"SHORT_NAME": "Swaziland",
			"ISO3136": "SZ"
		},
		{
			"LAT": 62,
			"LONG": 15,
			"FIPS10": "SW",
			"SHORT_NAME": "Sweden",
			"ISO3136": "SE"
		},
		{
			"LAT": 47,
			"LONG": 8,
			"FIPS10": "SZ",
			"SHORT_NAME": "Switzerland",
			"ISO3136": "CH"
		},
		{
			"LAT": 35,
			"LONG": 38,
			"FIPS10": "SY",
			"SHORT_NAME": "Syria",
			"ISO3136": "SY"
		},
		{
			"LAT": 24,
			"LONG": 121,
			"FIPS10": "TW",
			"SHORT_NAME": "Taiwan",
			"ISO3136": "TW"
		},
		{
			"LAT": 39,
			"LONG": 71,
			"FIPS10": "TI",
			"SHORT_NAME": "Tajikistan",
			"ISO3136": "TJ"
		},
		{
			"LAT": -6,
			"LONG": 35,
			"FIPS10": "TZ",
			"SHORT_NAME": "Tanzania",
			"ISO3136": "TZ"
		},
		{
			"LAT": 15,
			"LONG": 100,
			"FIPS10": "TH",
			"SHORT_NAME": "Thailand",
			"ISO3136": "TH"
		},
		{
			"LAT": -8.833333,
			"LONG": 125.75,
			"FIPS10": "TT",
			"SHORT_NAME": "Timor-Leste",
			"ISO3136": "TL"
		},
		{
			"LAT": 8,
			"LONG": 1.166667,
			"FIPS10": "TO",
			"SHORT_NAME": "Togo",
			"ISO3136": "TG"
		},
		{
			"LAT": -9,
			"LONG": -171.75,
			"FIPS10": "TL",
			"SHORT_NAME": "Tokelau",
			"ISO3136": "TK"
		},
		{
			"LAT": -20,
			"LONG": -175,
			"FIPS10": "TN",
			"SHORT_NAME": "Tonga",
			"ISO3136": "TO"
		},
		{
			"LAT": 11,
			"LONG": -61,
			"FIPS10": "TD",
			"SHORT_NAME": "Trinidad and Tobago",
			"ISO3136": "TT"
		},
		{
			"LAT": -15.866667,
			"LONG": 54.416667,
			"FIPS10": "TE",
			"SHORT_NAME": "Tromelin Island",
			"ISO3136": ""
		},
		{
			"LAT": 34,
			"LONG": 9,
			"FIPS10": "TS",
			"SHORT_NAME": "Tunisia",
			"ISO3136": "TN"
		},
		{
			"LAT": 39.059012,
			"LONG": 34.911546,
			"FIPS10": "TU",
			"SHORT_NAME": "Turkey",
			"ISO3136": "TR"
		},
		{
			"LAT": 40,
			"LONG": 60,
			"FIPS10": "TX",
			"SHORT_NAME": "Turkmenistan",
			"ISO3136": "TM"
		},
		{
			"LAT": 21.733333,
			"LONG": -71.583333,
			"FIPS10": "TK",
			"SHORT_NAME": "Turks and Caicos Islands",
			"ISO3136": "TC"
		},
		{
			"LAT": -8,
			"LONG": 178,
			"FIPS10": "TV",
			"SHORT_NAME": "Tuvalu",
			"ISO3136": "TV"
		},
		{
			"LAT": 2,
			"LONG": 33,
			"FIPS10": "UG",
			"SHORT_NAME": "Uganda",
			"ISO3136": "UG"
		},
		{
			"LAT": 49,
			"LONG": 32,
			"FIPS10": "UP",
			"SHORT_NAME": "Ukraine",
			"ISO3136": "UA"
		},
		{
			"LAT": 24,
			"LONG": 54,
			"FIPS10": "AE",
			"SHORT_NAME": "United Arab Emirates",
			"ISO3136": "AE"
		},
		{
			"LAT": 54,
			"LONG": -4,
			"FIPS10": "UK",
			"SHORT_NAME": "United Kingdom",
			"ISO3136": "GB"
		},
		{
			"LAT": 39.828175,
			"LONG": -98.5795,
			"FIPS10": "US",
			"SHORT_NAME": "United States of America",
			"ISO3136": "US"
		},
		{
			"LAT": -33,
			"LONG": -56,
			"FIPS10": "UY",
			"SHORT_NAME": "Uruguay",
			"ISO3136": "UY"
		},
		{
			"LAT": 5.8811111,
			"LONG": -162.0725,
			"FIPS10": "UM",
			"SHORT_NAME": "US Minor Outlying Islands",
			"ISO3136": "UM"
		},
		{
			"LAT": 18.3482891,
			"LONG": -64.9834807,
			"FIPS10": "VI",
			"SHORT_NAME": "US Virgin Islands",
			"ISO3136": "VI"
		},
		{
			"LAT": 41.707542,
			"LONG": 63.84911,
			"FIPS10": "UZ",
			"SHORT_NAME": "Uzbekistan",
			"ISO3136": "UZ"
		},
		{
			"LAT": -16,
			"LONG": 167,
			"FIPS10": "NH",
			"SHORT_NAME": "Vanuatu",
			"ISO3136": "VU"
		},
		{
			"LAT": 41.9,
			"LONG": 12.45,
			"FIPS10": "VT",
			"SHORT_NAME": "Vatican City",
			"ISO3136": "VA"
		},
		{
			"LAT": 8,
			"LONG": -66,
			"FIPS10": "VE",
			"SHORT_NAME": "Venezuela",
			"ISO3136": "VE"
		},
		{
			"LAT": 16.166667,
			"LONG": 107.833333,
			"FIPS10": "VM",
			"SHORT_NAME": "Vietnam",
			"ISO3136": "VN"
		},
		{
			"LAT": -13.3,
			"LONG": -176.2,
			"FIPS10": "WF",
			"SHORT_NAME": "Wallis and Futuna",
			"ISO3136": "WF"
		},
		{
			"LAT": 31.666667,
			"LONG": 35.25,
			"FIPS10": "WE",
			"SHORT_NAME": "West Bank",
			"ISO3136": "PS"
		},
		{
			"LAT": 25,
			"LONG": -13.5,
			"FIPS10": "WI",
			"SHORT_NAME": "Western Sahara",
			"ISO3136": "EH"
		},
		{
			"LAT": 15.5,
			"LONG": 47.5,
			"FIPS10": "YM",
			"SHORT_NAME": "Yemen",
			"ISO3136": "YE"
		},
		{
			"LAT": -15,
			"LONG": 30,
			"FIPS10": "ZA",
			"SHORT_NAME": "Zambia",
			"ISO3136": "ZM"
		},
		{
			"LAT": -19,
			"LONG": 29,
			"FIPS10": "ZI",
			"SHORT_NAME": "Zimbabwe",
			"ISO3136": "ZW"
		}
	];

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = [{"id\tname":"4\tAfghanistan"},{"id\tname":"8\tAlbania"},{"id\tname":"12\tAlgeria"},{"id\tname":"24\tAngola"},{"id\tname":"10\tAntarctica"},{"id\tname":"32\tArgentina"},{"id\tname":"51\tArmenia"},{"id\tname":"36\tAustralia"},{"id\tname":"40\tAustria"},{"id\tname":"31\tAzerbaijan"},{"id\tname":"44\tBahamas"},{"id\tname":"50\tBangladesh"},{"id\tname":"112\tBelarus"},{"id\tname":"56\tBelgium"},{"id\tname":"84\tBelize"},{"id\tname":"204\tBenin"},{"id\tname":"64\tBhutan"},{"id\tname":"68\tBolivia"},{"id\tname":"70\tBosnia and Herzegovina"},{"id\tname":"72\tBotswana"},{"id\tname":"76\tBrazil"},{"id\tname":"96\tBrunei Darussalam"},{"id\tname":"100\tBulgaria"},{"id\tname":"854\tBurkina Faso"},{"id\tname":"108\tBurundi"},{"id\tname":"116\tCambodia"},{"id\tname":"120\tCameroon"},{"id\tname":"124\tCanada"},{"id\tname":"140\tCentral African Republic"},{"id\tname":"148\tChad"},{"id\tname":"152\tChile"},{"id\tname":"156\tChina"},{"id\tname":"170\tColombia"},{"id\tname":"178\tCongo"},{"id\tname":"180\tCongo"},{"id\tname":"188\tCosta Rica"},{"id\tname":"384\tCote d'Ivoire"},{"id\tname":"191\tCroatia"},{"id\tname":"192\tCuba"},{"id\tname":"196\tCyprus"},{"id\tname":"203\tCzech Republic"},{"id\tname":"208\tDenmark"},{"id\tname":"262\tDjibouti"},{"id\tname":"214\tDominican Republic"},{"id\tname":"218\tEcuador"},{"id\tname":"818\tEgypt"},{"id\tname":"222\tEl Salvador"},{"id\tname":"226\tEquatorial Guinea"},{"id\tname":"232\tEritrea"},{"id\tname":"233\tEstonia"},{"id\tname":"231\tEthiopia"},{"id\tname":"238\tFalkland Islands (Malvinas)"},{"id\tname":"242\tFiji"},{"id\tname":"246\tFinland"},{"id\tname":"250\tFrance"},{"id\tname":"260\tFrench Southern Territories"},{"id\tname":"266\tGabon"},{"id\tname":"270\tGambia"},{"id\tname":"268\tGeorgia"},{"id\tname":"276\tGermany"},{"id\tname":"288\tGhana"},{"id\tname":"300\tGreece"},{"id\tname":"304\tGreenland"},{"id\tname":"320\tGuatemala"},{"id\tname":"324\tGuinea"},{"id\tname":"624\tGuinea-Bissau"},{"id\tname":"328\tGuyana"},{"id\tname":"332\tHaiti"},{"id\tname":"340\tHonduras"},{"id\tname":"348\tHungary"},{"id\tname":"352\tIceland"},{"id\tname":"356\tIndia"},{"id\tname":"360\tIndonesia"},{"id\tname":"364\tIran"},{"id\tname":"368\tIraq"},{"id\tname":"372\tIreland"},{"id\tname":"376\tIsrael"},{"id\tname":"380\tItaly"},{"id\tname":"388\tJamaica"},{"id\tname":"392\tJapan"},{"id\tname":"400\tJordan"},{"id\tname":"398\tKazakhstan"},{"id\tname":"404\tKenya"},{"id\tname":"408\tKorea"},{"id\tname":"410\tKorea"},{"id\tname":"414\tKuwait"},{"id\tname":"417\tKyrgyzstan"},{"id\tname":"418\tLao People's Democratic Republic"},{"id\tname":"428\tLatvia"},{"id\tname":"422\tLebanon"},{"id\tname":"426\tLesotho"},{"id\tname":"430\tLiberia"},{"id\tname":"434\tLibya"},{"id\tname":"440\tLithuania"},{"id\tname":"442\tLuxembourg"},{"id\tname":"807\tMacedonia"},{"id\tname":"450\tMadagascar"},{"id\tname":"454\tMalawi"},{"id\tname":"458\tMalaysia"},{"id\tname":"466\tMali"},{"id\tname":"478\tMauritania"},{"id\tname":"484\tMexico"},{"id\tname":"498\tMoldova"},{"id\tname":"496\tMongolia"},{"id\tname":"499\tMontenegro"},{"id\tname":"504\tMorocco"},{"id\tname":"508\tMozambique"},{"id\tname":"104\tMyanmar"},{"id\tname":"516\tNamibia"},{"id\tname":"524\tNepal"},{"id\tname":"528\tNetherlands"},{"id\tname":"540\tNew Caledonia"},{"id\tname":"554\tNew Zealand"},{"id\tname":"558\tNicaragua"},{"id\tname":"562\tNiger"},{"id\tname":"566\tNigeria"},{"id\tname":"578\tNorway"},{"id\tname":"512\tOman"},{"id\tname":"586\tPakistan"},{"id\tname":"275\tPalestinian Territory"},{"id\tname":"591\tPanama"},{"id\tname":"598\tPapua New Guinea"},{"id\tname":"600\tParaguay"},{"id\tname":"604\tPeru"},{"id\tname":"608\tPhilippines"},{"id\tname":"616\tPoland"},{"id\tname":"620\tPortugal"},{"id\tname":"630\tPuerto Rico"},{"id\tname":"634\tQatar"},{"id\tname":"642\tRomania"},{"id\tname":"643\tRussian Federation"},{"id\tname":"646\tRwanda"},{"id\tname":"682\tSaudi Arabia"},{"id\tname":"686\tSenegal"},{"id\tname":"688\tSerbia"},{"id\tname":"694\tSierra Leone"},{"id\tname":"703\tSlovakia"},{"id\tname":"705\tSlovenia"},{"id\tname":"90\tSolomon Islands"},{"id\tname":"706\tSomalia"},{"id\tname":"710\tSouth Africa"},{"id\tname":"728\tSouth Sudan"},{"id\tname":"724\tSpain"},{"id\tname":"144\tSri Lanka"},{"id\tname":"729\tSudan"},{"id\tname":"740\tSuriname"},{"id\tname":"748\tSwaziland"},{"id\tname":"752\tSweden"},{"id\tname":"756\tSwitzerland"},{"id\tname":"760\tSyrian Arab Republic"},{"id\tname":"158\tTaiwan"},{"id\tname":"762\tTajikistan"},{"id\tname":"834\tTanzania"},{"id\tname":"764\tThailand"},{"id\tname":"626\tTimor-Leste"},{"id\tname":"768\tTogo"},{"id\tname":"780\tTrinidad and Tobago"},{"id\tname":"788\tTunisia"},{"id\tname":"792\tTurkey"},{"id\tname":"795\tTurkmenistan"},{"id\tname":"800\tUganda"},{"id\tname":"804\tUkraine"},{"id\tname":"784\tUnited Arab Emirates"},{"id\tname":"826\tUnited Kingdom"},{"id\tname":"840\tUnited States"},{"id\tname":"858\tUruguay"},{"id\tname":"860\tUzbekistan"},{"id\tname":"548\tVanuatu"},{"id\tname":"862\tVenezuela"},{"id\tname":"704\tViet Nam"},{"id\tname":"732\tWestern Sahara"},{"id\tname":"887\tYemen"},{"id\tname":"894\tZambia"},{"id\tname":"716\tZimbabwe"}]

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./main.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./main.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(8)();
	// imports


	// module
	exports.push([module.id, "body {\n  font-family: Trebuchet, Arial, sans-serif;\n  background: #FFF;\n}\n.map {\n  text-align: center;\n}\n.country {\n  fill: none;\n  stroke: #49006a;\n  stroke-width: 0.4px;\n  stroke-linejoin: round;\n  opacity: 0.7;\n}\n.mesh {\n  fill: none;\n  stroke: #403F4D;\n  stroke-width: 0.5px;\n  stroke-linejoin: round;\n}\n.arc {\n  fill: none;\n  stroke: #000;\n  stroke-width: 0.8px;\n  opacity: 1;\n}\n.hidden {\n  display: none;\n}\ndiv.tooltip {\n  font-size: 12px;\n  color: #222;\n  background-color: #fff;\n  padding: .5em;\n  text-shadow: #f5f5f5 0 1px 0;\n  border-radius: 2px;\n  opacity: 0.9;\n  position: absolute;\n}\n.country:hover {\n  stroke-width: 0.8px;\n}\n", ""]);

	// exports


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);