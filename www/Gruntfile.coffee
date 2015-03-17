module.exports = (grunt) ->
    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-jade')
    grunt.loadNpmTasks('grunt-contrib-concat')


    grunt.initConfig
        watch:
            coffee:
                files: 'src/*.coffee'
                tasks: ['coffee:compile','concat:dist']
            jade:
                files: '**/*.jade'
                tasks: ['jade:compile']

        coffee:
            compile:
                expand: true,
                flatten: true,
                cwd: "#{__dirname}/src/",
                src: ['*.coffee'],
                dest: 'src/',
                ext: '.js'
        jade:
            compile:
                options:
                    pretty: true
                    data:
                        debug: true
                
                files: [
                    expand: true,
                    flatten: true,
                    cwd: "#{__dirname}/src/",
                    src: ['*.jade'],
                    dest: './',
                    ext: '.html'
                ]
        concat:
          dist:
            src:[
              'src/user_view.js',
              'src/anotacoes.js',
              'src/gps_controle.js',
              'src/noteview.js',
              'src/note.js',
              'src/index.js',
              ],
            dest: 'js/index.js'
 
    grunt.registerTask 'default', ['coffee', 'jade', 'concat' ]
