
RESTLint - RESTful API Specification Static Checker
===============================
-----------
## Description

RESTLint is a web based application that reads in a RESTful API design specification (i.e. Swagger2), and checks the design against HTTP standards, AT&T standards and best practices, and some security checks.


-----------
## How to Load the website

You can load the website in the following way:

Download the [repo](https://github.com/bschwarz/restlint) locally - You can either download a zip file from the repo or you can clone the repo onto your local machine. Once downloaded onto your local machine, you can do the following to view:

-- Host the files through a local web server, and use your browser to navigate to the local web server. For example, if you have python installed, you can run this command in the root of the repo directory to serve the files: 

Python2
```
python -m SimpleHTTPServer 8080 # assuming port 8080 is not used already.
```
	
Python3
```
python -m http.server 8080 # assuming port 8080 is not used already.
```
Then you can navigate your browser to *localhost:8080/dist/*

-------------
## Using the website


## Optimizations
-   Minified CSS with ```htmlmin``` to reduce file size
-   Minified JS with ```uglify-js``` to reduce file size
-   Inlined CSS to avoid another round trip with ```inline-source```
-   Inlined JS to avoid another round trip with ```inline-source```
-   Added ```async``` to the map request to stop blocking
-   Moved javascript to end of body to minimize blocking



-------
## Build Automation
Used Gulp to automate the building and common tasks of the website. Includes the following:
- minification of javascript using ```uglify```
- minification of HTML and CSS using ```htmlmin```
- inlining CSS using ```inline source```
- Javascript linting using ```eslint```
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
+ [knockoutjs library](http://knockoutjs.com/) - used as a MVVM framework, and has 2 way bindings to allow the data to stay in sync. Also used to create template for listview.
+ [JQuery](http://jquery.com/) - Javascript library that simplifies javascript routines.
+ [Knockout Util Functions](http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html) - adapted an example from this page to implement a ko computed observable.
+ [knockout tips](https://robinsr.github.io/blog/post/knockoutjs-best-practices) - used tips from here in my code.
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