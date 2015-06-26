
var fs = require('fs');

var mF = function(file){

  //read the file.
  var fileContent = fs.readFileSync(file).toString();

  //split it into lines
  fileContent = fileContent.split("\n");

  //and remove the empty ones
  fileContent = fileContent.filter(function(e){
    return (typeof e === 'string') && e.trim() != '';
  });

  //then return it.
  return fileContent;
}

//===
//BUILD CONFIGURATION FILES
//===

var spec_files = module.exports.spec_files = {

  //JavaScript
  "js": {
    //Source and library files
    "source": "build/targets/js/files.txt",
    "lib": "build/targets/js/libs.txt",

    //development build
    "dev": {
      "header": "build/targets/js/dev/header.js",
      "footer": "build/targets/js/dev/footer.js",
    },

    //minimised build
    "min": {
      "header": "build/targets/js/min/header.js",
      "footer": "build/targets/js/min/footer.js"
    }
  },

  //CSS
  "css": {
    //Source and library files
    "source": "build/targets/css/files.txt",
    "lib": "build/targets/css/libs.txt",
    "img": "css/libs/bootstrap/img/",

    //development build
    "dev": {
      "header": "build/targets/css/dev/header.css",
      "footer": "build/targets/css/dev/footer.css",
    },

    //minimised build
    "min": {
      "header": "build/targets/css/min/header.css",
      "footer": "build/targets/css/min/footer.css"
    }
  }
};

//The output files:
var dest_files = module.exports.dest_files = {
  "js": {
    "min": "build/release/JOBAD.min.js",
    "dev": "build/release/JOBAD.js",
    "lib": "build/release/libs/js/libs.js"
  },
  "css": {
    "dev": "build/release/JOBAD.css",
    "min": "build/release/JOBAD.min.css",
    "lib": "build/release/libs/css/libs.css",
    "img": "build/release/libs/img/"
  }
};

//===
//READ IN ALL THE FILES FROM ABOVE
//===
var files = module.exports.files = {
  //The JavaScript targets
  "js": {

    //minimisation
    "min": mF(spec_files.js.source).map(function(e){return "js/"+e}),

    //development version.
    "dev": mF(spec_files.js.source).map(function(e){return "js/"+e}),

    //the libraries
    "lib": mF(spec_files.js.lib).map(function(e){return "js/deps/"+e})
  },

  //The CSS targets
  "css": {
    //minimisation
    "min": mF(spec_files.css.source).map(function(e){return "css/"+e}),

    //development version.
    "dev": mF(spec_files.css.source).map(function(e){return "css/"+e}),

    "lib": mF(spec_files.css.lib).map(function(e){return "css/libs/"+e})
  }
};
