
MyApp.angular.factory 'SearchlightService', [
  'InitService'
  '$localStorage'
  (InitService,storage) ->
    'use strict'
    pub = {}
    urlServicoTemporaria = null
    eventListeners =
      'ready': []
      'fail': []

    pub.addEventListener = (eventName, listener) ->
      eventListeners[eventName].push listener
      return

    pub.trocarServico = ->
      pub.api.user.logout()
      pub.setConfServico(null)
     
    pub.temServicoVinculado = -> pub.getUrlConfServico()

    pub.getUrlConfServico = ->
      if PARAMETROS_GET.mashup
        pub.setUrlConfServico(PARAMETROS_GET.mashup)
      else
        pub.urlConfServico = storage.urlConfServico
      return pub.urlConfServico

    pub.getConfServico = -> storage.mashup

    pub.setConfServico = (url) ->
      if url
        storage.urlConfServico = urlServicoTemporaria
        storage.mashup = pub.api.config.opcoesOriginais
      else
        delete storage.urlConfServico
        delete storage.mashup

    #pub.iniciaSegundaTela: ()-> # colocar no servico de segunda tela
      #console.log('iniciado segunda tela')
      #if @runOnApp
      #  @ss = new SecondScreen(@urlConfServico)
      #else
      #  @ss = true

    onApiReady = ->
      MyApp.fw7.app.hidePreloader()
      pub.setConfServico(urlServicoTemporaria)
      i = 0
      while i < eventListeners.ready.length
        eventListeners.ready[i]()
        i = i + 1

    onApiFail = (err)->
      MyApp.fw7.app.hidePreloader()
      i = 0
      while i < eventListeners.fail.length
        eventListeners.fail[i](err)
        i = i + 1

      #@problemarede()
    pub.loadAPI = (conf)->
      pub.api = new SLSAPI(conf)
      pub.api.on SLSAPI.Config.EVENT_READY, onApiReady
      pub.api.on SLSAPI.Config.EVENT_FAIL, onApiFail

    pub.loadServico = ->
      console.log('Carregando serviço previamente vinculado')
      urlServicoTemporaria = pub.getUrlConfServico()
      if urlServicoTemporaria
        conf = pub.getConfServico()
        if conf
          pub.loadAPI(conf)
          return
        else
          pub.setConfServico() # apaga conf incorreta
      console.error('Não possível carregar serviço. UrlConfServico não definida!')

    pub.loadServicoPorUrl = (urlConfServico) ->
      MyApp.fw7.app.showPreloader('Carregando Serviço')
      console.log('Carregando serviço por url')
      urlServicoTemporaria = urlConfServico
      pub.loadAPI({urlConfServico: urlConfServico})

      #window.gpscontrole = new GPSControle() # FIXME: colocar num service

      return 

    pub
]

# vim: set ts=2 sw=2 sts=2 expandtab:

