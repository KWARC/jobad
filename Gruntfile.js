var
  fs = require('fs'),
  config = require("./build/targets/config.js");

module.exports = function(grunt) {

  var rF = function (file){
    return fs.readFileSync(file).toString();
  };

  //===
  //CONFIG
  //===
  grunt.initConfig({
    build: {
      now: (new Date()).toString()
    },

    concat: {
      jsdev: {
        options: {
          sourceMap: true,
          banner: rF(config.spec_files.js.dev.header),
          footer: rF(config.spec_files.js.dev.footer)
        },
        src: config.files.js.dev,
        dest: config.dest_files.js.dev
      },
      cssdev: {
        options: {
          sourceMap: true,
          banner: rF(config.spec_files.css.dev.header),
          footer: rF(config.spec_files.css.dev.footer)
        },
        src: config.files.css.dev,
        dest: config.dest_files.css.dev
      }
    },
    uglify: {
      jsmin: {
        options: {
          sourceMap: true,
          banner: rF(config.spec_files.js.min.header),
          footer: rF(config.spec_files.js.min.footer)
        },
        src: config.files.js.min,
        dest: config.dest_files.js.min
      },
      jslibs: {
        options: {
          sourceMap: false,
        },
        src: config.files.js.lib,
        dest: config.dest_files.js.lib
      }
    },
    less: {
      cssmin: {
        options: {
          sourceMap: true,
          compress: true,
          banner: rF(config.spec_files.css.min.header),
          footer: rF(config.spec_files.css.min.footer)
        },
        src: config.files.css.min,
        dest: config.dest_files.css.min,
      },
      csslibs: {
        options: {
          sourceMap: true,
          compress: true
        },
        src: config.files.css.lib,
        dest: config.dest_files.css.lib,
      }
    },
    copy: {
      csslibs: {
        files: [
          {expand: true, cwd:config.spec_files.css.img, src: '**', dest: config.dest_files.css.img}
        ]
      }
    }

  });

  //===
  //LOAD GRUNT TASKS
  //===
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  //===
  //MORE TARGETS
  //===

  // js
  grunt.registerTask('jsdev', ['concat:jsdev']);
  grunt.registerTask('jsmin', ['uglify:jsmin']);
  grunt.registerTask('jslibs', ['uglify:jslibs']);
  grunt.registerTask('js', ['jsdev', 'jslibs', 'jsmin'])

  // css
  grunt.registerTask('cssdev', ['concat:cssdev']);
  grunt.registerTask('cssmin', ['less:cssmin']);
  grunt.registerTask('csslibs', ['less:csslibs', 'copy:csslibs']);
  grunt.registerTask('css', ['cssdev', 'cssmin', 'csslibs']);

  grunt.registerTask('dist', ['js', 'css']); 
};
