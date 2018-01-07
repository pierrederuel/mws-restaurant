(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const ImageInfo = require('./images');
/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = '1337'; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) {
        // Got a success response from server!
        const restaurants = JSON.parse(xhr.responseText);
        const imageData = ImageInfo.ImageInfoData;
        restaurants.map(function (restaurant) {
          if (restaurant.photograph) {
            restaurant.alt = imageData[restaurant.photograph].alt;
            restaurant.caption = imageData[restaurant.photograph].caption;
          }
          return restaurant;
        });
        callback(null, restaurants);
      } else {
        // Oops!. Got an error from server.
        const error = `Request failed. Returned status of ${xhr.status}`;
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL + '/' + id);
    xhr.onload = () => {
      if (xhr.status === 200) {
        // Got a success response from server!
        const restaurant = JSON.parse(xhr.responseText);
        if (restaurant.photograph) {
          const imageData = ImageInfo.ImageInfoData;
          restaurant.alt = imageData[restaurant.photograph].alt;
          restaurant.caption = imageData[restaurant.photograph].caption;
        }
        callback(null, restaurant);
      } else {
        // Oops!. Got an error from server.
        const error = `Request failed. Returned status of ${xhr.status}`;
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') {
          // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') {
          // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URLs JSON.
   */
  static imageUrlForRestaurant(restaurant) {
    const representationsURLs = DBHelper.imageRepresentationsPaths(restaurant.photograph);
    return representationsURLs;
  }

  /**
   * Paths for various image representations
   */
  static imageRepresentationsPaths(filename) {
    const [folderName, suffix] = ['./img/', 'jpg'];
    const large_1x = folderName.concat(filename, '-1024_1x', '.', suffix);
    const large_2x = folderName.concat(filename, '-1024_2x', '.', suffix);
    const small_1x = folderName.concat(filename, '-560_1x', '.', suffix);
    const small_2x = folderName.concat(filename, '-560_2x', '.', suffix);

    return {
      large_1x: large_1x,
      large_2x: large_2x,
      small_1x: small_1x,
      small_2x: small_2x
    };
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

}
module.exports = DBHelper;

},{"./images":2}],2:[function(require,module,exports){
/**
 * Common image info class
 */
class ImageInfo {

  static get ImageInfoData() {

    return {
      1: {
        "id": 1,
        "photograph": "1",
        "alt": "the main restaurant area",
        "caption": "Large space with nice decoration"
      },
      2: {
        "id": 2,
        "photograph": "2",
        "alt": "pizza on a plate",
        "caption": "Tasty pizzas made every day"
      },
      3: {
        "id": 3,
        "photograph": "3.jpg",
        "alt": "the main restaurant area empty",
        "caption": "Modern design to enjoy your meals"
      },
      4: {
        "id": 4,
        "photograph": "4.jpg",
        "alt": "the entrance of the shop",
        "caption": "The corner shop, easy to spot"
      },
      5: {
        "id": 5,
        "photograph": "5.jpg",
        "alt": "inside the shop, customers and staff",
        "caption": "Meet our friendly staff"
      },
      6: {
        "id": 6,
        "photograph": "6.jpg",
        "alt": "the area inside with some people queueing and other eating",
        "caption": "Large space for big groups"
      },
      7: {
        "id": 7,
        "photograph": "7.jpg",
        "alt": "black and white, the display of the shop with 2 people passing by",
        "caption": "Our classic shop, still keeping our values"
      },
      8: {
        "id": 8,
        "name": "The Dutch",
        "neighborhood": "Manhattan",
        "photograph": "8.jpg"
      },
      9: {
        "id": 9,
        "photograph": "9.jpg",
        "caption": "Enjoying our home made meals",
        "alt": "black and white, people eating in the restaurant"
      },
      10: {
        "id": 10,
        "photograph": "10.jpg",
        "alt": "the area inside the shop, the furniture and bar, without people",
        "caption": "Modern space, ready to serve your appetite"
      }
    };
  }
}

module.exports = ImageInfo;

},{}],3:[function(require,module,exports){
var _this = this;

const DBHelper = require('./dbhelper');

let restaurants, neighborhoods, cuisines;
var map;
this.markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', event => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      //  Got an error
      console.error(error);
    } else {
      _this.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = _this.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      _this.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = _this.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  _this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = restaurants => {
  // Remove all restaurants
  _this.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  _this.markers.forEach(m => m.setMap(null));
  _this.markers = [];
  _this.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = _this.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = restaurant => {
  const li = document.createElement('li');

  if (restaurant.photograph) {
    const imageRepresentations = DBHelper.imageUrlForRestaurant(restaurant);
    const picture = document.createElement('picture');
    picture.className = 'restaurant-img';
    picture.setAttribute('aria-labelledby', "fig_" + restaurant.id);
    picture.setAttribute('role', 'img');

    const sourceSmall = document.createElement('source');
    sourceSmall.setAttribute('media', '(max-width:700px)');
    sourceSmall.setAttribute('srcset', imageRepresentations.small_1x.concat(' 1x,').concat(imageRepresentations.small_2x).concat(' 2x'));
    picture.append(sourceSmall);

    const sourceLarge = document.createElement('source');
    sourceLarge.setAttribute('media', '(min-width:701px)');
    sourceLarge.setAttribute('srcset', imageRepresentations.large_1x.concat(' 1x,').concat(imageRepresentations.large_2x).concat(' 2x'));
    picture.append(sourceLarge);

    const image = document.createElement('img');
    image.src = imageRepresentations.small_2x;
    image.setAttribute('alt', 'restaurant '.concat(restaurant.name, ', ', restaurant.alt));
    image.className = 'restaurant-img';
    picture.append(image);

    const figcaption = document.createElement('figcaption');
    figcaption.setAttribute('id', "fig_" + restaurant.id);
    figcaption.innerHTML = restaurant.caption;
    picture.append(figcaption);

    li.append(picture);
  }

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('role', 'button');
  more.setAttribute('aria-label', 'View more about ' + restaurant.name);
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = _this.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, _this.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    _this.markers.push(marker);
  });
};

},{"./dbhelper":1}]},{},[3])

//# sourceMappingURL=bundle_main.js.map
