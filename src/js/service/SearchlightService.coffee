
MyApp.angular.factory 'SearchlightService', [
  'InitService'
  '$localStorage'
  (InitService,storage) ->
    'use strict'
    pub = {}
    eventListeners = 'ready': []

    pub.addEventListener = (eventName, listener) ->
      eventListeners[eventName].push listener
      return

    pub.trocarServico = ->
      pub.api.user.logout()
      pub.setUrlConfServico(null)
      $.mobile.changePage("#pgservico",{changeHash:false}) # colocar no controller
      
    pub.vincularServico = ->
      if InitService.runOnApp
        cordova.plugins.barcodeScanner.scan(
          (result) ->
            pub.loadServico(result.text)
          ,(error) ->
            alert("Falha na leitura do código QR: " + error)
          )
      else
        url = prompt('Informe a url do mashup')
        if url != null
          if url
            pub.loadServico(url)
          else
            alert('Informe uma url de serviço válida!')

    pub.getUrlConfServico = ->
      if PARAMETROS_GET.mashup
        pub.setUrlConfServico(PARAMETROS_GET.mashup)
      else
        pub.urlConfServico = storage.urlConfServico
      return pub.urlConfServico

    pub.setUrlConfServico = (url) ->
      pub.urlConfServico = url
      if url
        storage.urlConfServico = pub.urlConfServico
      else
        delete storage.urlConfServico

    #pub.iniciaSegundaTela: ()-> # colocar no servico de segunda tela
      #console.log('iniciado segunda tela')
      #if @runOnApp
      #  @ss = new SecondScreen(@urlConfServico)
      #else
      #  @ss = true

    onApiReady = ->
      i = 0
      while i < eventListeners.ready.length
        eventListeners.ready[i]()
        i = i + 1

    onApiFail = (err)->
      #@problemarede()
      console.log(err)
 

    pub.loadServico = (urlConfServico) ->
      console.log(urlConfServico)
      pub.setUrlConfServico(urlConfServico)
      pub.api = new SLSAPI({urlConfServico:pub.urlConfServico})

      MyApp.fw7.app.showPreloader('Carregando Serviço')

      pub.api.on SLSAPI.Config.EVENT_READY, onApiReady
      pub.api.on SLSAPI.Config.EVENT_FAIL, onApiFail
      
      #window.gpscontrole = new GPSControle() # FIXME: colocar num service

      return 

    pub
]

# vim: set ts=2 sw=2 sts=2 expandtab:

