# vim: set ts=2 sw=2 sts=2 expandtab:

utils = require('./utils.coffee')
UserView = require('./userView.coffee').UserView
SecondScreen = require('./SecondScreen.coffee').SecondScreen
GPSControle = require('./gps_controle.coffee').GPSControle

class window.App
   # Application Constructor
    constructor: ->
      @storage = window.localStorage
      @userview = null
      this.bindEvents()
        
    bindEvents: ->
      document.addEventListener('deviceready', this.onDeviceReady, false)

    onDeviceReady:->
      app.main()

    main: ->
      console.log('Received Event: onDeviceReady' )
      cordova.plugins.backgroundMode.enable();
      cordova.plugins.backgroundMode.onactivate = ()->
        console.log('backgroundMode: ativado')
      cordova.plugins.backgroundMode.ondeactivate = ()->
        console.log('backgroundMode: off')

      if @getUrlConfServico()
        @loadServico(@urlConfServico)
      else
        $.mobile.changePage("#pgservico",{changeHash:false})

    trocarServico: ->
      userview.slsapi.user.logout()
      @setUrlConfServico(null)
      $.mobile.changePage("#pgservico",{changeHash:false})
      
    vincularServico: ->
      self = @
      cordova.plugins.barcodeScanner.scan(
        (result) ->
          self.loadServico(result.text)
        ,(error) ->
          alert("Falha na leitura do código QR: " + error)
        )

    getUrlConfServico: ->
      @urlConfServico = @storage.getItem('urlConfServico')
      return @urlConfServico

    setUrlConfServico: (url) ->
      @urlConfServico = url
      if url
        @storage.setItem('urlConfServico', @urlConfServico)
      else
        @storage.removeItem('urlConfServico')

    loadServico: (urlConfServico) ->
      @setUrlConfServico(urlConfServico)
      @ss = new SecondScreen(urlConfServico)
      window.userview = new UserView(urlConfServico)
      userview.load()
      window.gpscontrole = new GPSControle()


#window.localStorage.setObject('lista_de_anotacoes',window.ativtest);
