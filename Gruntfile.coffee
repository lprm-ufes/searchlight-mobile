module.exports = (grunt) ->
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-jade'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-browserify'

    grunt.initConfig
        browserify:
          dist:
            files:
              './www/js/index.js':['./coffee/index.coffee']
              './www/js/receiver.js':['./coffee/receiver.coffee']
            options:
              browserifyOptions:
                debug: grunt.option('debug')
                transform: [ 'coffeeify']

        watch:
            coffee:
                files: 'coffee/*.coffee'
                tasks: ['browserify',]
            jade:
                files: '**/*.jade'
                tasks: ['jade:compile']

        jade:
            compile:
                options:
                    pretty: true
                    data:
                        debug: true
                
                files: [
                    expand: true,
                    flatten: true,
                    cwd: "#{__dirname}/jade/",
                    src: ['*.jade'],
                    dest: './www/',
                    ext: '.html'
                ]
        # concat:
        #   dist:
        #     src:[
        #       'src/gps_controle.js',
        #       'src/noteview.js',
        #       'src/note.js',
        #       'src/index.js',
        #       ],
        #     dest: 'js/index.js'
 
    grunt.registerTask 'default', ['browserify','jade' ]
