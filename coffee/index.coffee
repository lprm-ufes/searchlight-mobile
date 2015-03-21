# vim: set ts=3 sw=2 sts=2 expandtab:

utils = require('./utils.coffee')
UserView = require('./userView.coffee').UserView
GPSControle = require('./gps_controle.coffee').GPSControle

class window.App
    # Application Constructor
    constructor: () ->
        @storage = window.localStorage
        @userview = null
        this.bindEvents()
          
    bindEvents: () ->
        document.addEventListener('deviceready', this.onDeviceReady, false)

    
    onDeviceReady: () ->
        app.main()

    mostraHistorico: ()->
      anotacoesview.sincronizar()
               
    positionSucess: (gps) ->
        @userview.load()

    positionError: (error) ->
        alert('Não foi possível obter sua localização. Verifique as configurações do seu smartphone.') 

    main: () ->
        console.log('Received Event: onDeviceReady' )
        window.userview=new UserView()
        userview.load()
        window.gpscontrole = new GPSControle()


#window.localStorage.setObject('lista_de_anotacoes',window.ativtest);
