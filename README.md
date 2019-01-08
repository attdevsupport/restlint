
Frontend Nanodegree- Neighborhood Map Project
===============================
-----------
## Description

This is a project from the Udacity Front-End Web Developer nanodegree.  This project focused on using the [knockoutjs library](http://knockoutjs.com/), along with the [Google Maps API](https://cloud.google.com/maps-platform/) and another third party API ([Foursquare](https://developer.foursquare.com)).


-----------
## How to Load the website

You can load the website in two ways:
1. From this GitHub pages - open the [website](https://bschwarz.github.io/neighborhood-map/dist/).
2. Download the [repo](https://github.com/bschwarz/neighborhood-map) locally - You can either download a zip file from the repo or you can clone the repo onto your local machine. Once downloaded onto your local machine, you can do one of two things to view:
-- Open the *dist/index.html* file that is in the root directory of the repo, with a browser (i.e. Chrome, Firefox).
-- Host the files through a local web server, and use your browser to navigate to the local web server. For example, if you have python installed, you can run this command in the root of the repo directory to serve the files: 

      ```
      python -m SimpleHTTPServer 8080 # assuming port 8080 is not used already.
      ```

   Then you can navigate your browser to *localhost:8080/dist/*

-------------
## Using the website
The UI is made up of a listview on the left side (25%) of the page which lists the venues, and a map on the right side of the page that shows the locations of several venues in the *Pike Place Market* neighborhood of Seattle, WA. The listview uses bootstrap's accordian such that when you click on an item in the list, brief notes from the venue from me are shown below the venue title. The click event also highlights the venue on the map and also pops up an infowindow about the venue. The infowindow has information about the venue from the Foursquare API, which is fetched async using JQuery ```getJSON``` method. The markers on the map use custom images adapted from [here](http://icon-park.com/icon/location-map-pin-red-sphere-free-vector-datasvg/). When there is a mouse over event, the image changes to slightly larger and brighter.

## Optimizations
-   Minified CSS with ```htmlmin``` to reduce file size
-   Minified JS with ```uglify-js``` to reduce file size
-   Inlined CSS to avoid another round trip with ```inline-source```
- 	Inlined JS to avoid another round trip with ```inline-source```
-   Added ```async``` to the map request to stop blocking
-   Moved javascript to end of body to minimize blocking


### Page Speed Insights Results:

[Page Speed Insight analysis](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fbschwarz.github.io%2Fneighborhood-map%2Fdist%2F&tab=desktop)

    

<table>
   <caption align="center"><b>Optimization Summary<b></caption>
  <tr>
    <th colspan="2">Page Speed Mobile</th>
    <th colspan="2">Page Speed Desktop</th>
  </tr>
  <tr>
    <td>Original</td>
    <td>Optimized</td>
    <td>Original</td>
    <td>Optimized</td>

  </tr>
  <tr>
    <td>59</td>
    <td>73</td>
    <td>88</td>
    <td>88</td>
  </tr>
</table>


-------
## Build Automation
Used Gulp to automate the building and common tasks of the website. Includes the following:
- minification of javascript using ```uglify```
- minification of HTML and CSS using ```htmlmin```
- inlining CSS using ```inline source```
- Javascript linting using ```jshint```
- CSS linting using ```csslint```
- moves all assets under the ```dist/``` directory

Gulp dependencies are in the ```package.json``` file

You need to install [nodejs/npm](https://www.npmjs.com/get-npm) and [gulp](https://gulpjs.com/) first.

To generate distribution, run the following in the root directory of the repo

Install Dependencies
```
npm install
```

Generate Distribution
```
gulp main
```
You can run individual tasks by replacing ```main``` with either ```html```, ```css```,```js``` or ```img```
The resulting files for distribution will be in the ```dist/``` directory

-------
## Resources
+ [Google Maps API](https://cloud.google.com/maps-platform/) - used to display map on page and to mark venues on the map
+ [knockoutjs library](http://knockoutjs.com/) - used as a MVVM framework, and has 2 way bindings to allow the data to stay in sync. Also used to create template for listview.
+ [Foursquare](https://developer.foursquare.com) - used as an API to gather more information on a venue.
+ [JQuery](http://jquery.com/) - Javascript library that simplifies javascript routines.
+ [Knockout Util Functions](http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html) - adapted an example from this page to implement a ko computed observable.
+ [Udacity Frontend Web Dev API Lesson - 5.17](https://classroom.udacity.com/nanodegrees/nd001/syllabus/core-curriculum) - adapted code from the Udacity lesson 17 (Getting Started with APIs) in module 5 for the map.
+ [knockout tips](https://robinsr.github.io/blog/post/knockoutjs-best-practices) - used tips from here in my code.
+ [Icon Park](http://icon-park.com/icon/location-map-pin-red-sphere-free-vector-datasvg/) - used this image from Icon Park as the marker on the map. Adapted the image so that it gets highlighted when hover event occurs.
+ [bootstrap sidebar tutorial](https://bootstrapious.com/p/bootstrap-sidebar)
+ [bootstrap sidebar howto](https://www.w3schools.com/howto/howto_js_sidenav.asp)
+ [Google Page Speed Insights](https://developers.google.com/speed/pagespeed/insights/) - tool to measure web page performance
+ [Chrome Dev Tools tips-and-tricks](https://developer.chrome.com/devtools/docs/tips-and-tricks)
+ [Optimizing Performance](https://developers.google.com/web/fundamentals/performance/)
+ [gulp](https://gulpjs.com/) - build/task tool to automate common tasks (i.e. minifications, inlining)
+ [gulp-htmlmin](https://github.com/jonschlinkert/gulp-htmlmin) - tool to minimize the HTML and CSS
+ [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) - tool to minimize the Javascript files
+ [gulp-inline-source](https://www.npmjs.com/package/gulp-inline-source) - Tools to inline CSS into the HTML page from gulp
+ [gulp-csslint](https://www.npmjs.com/package/gulp-csslint) - tool to check syntax of CSS from Gulp
+ [gulp-jshint](https://www.npmjs.com/package/gulp-jshint) - tool to check syntax of javascript files from Gulp


-------
## License

This project is licensed under the terms of the MIT license. (See LICENSE.md)

Copyright (c) 2018 Brett Schwarz