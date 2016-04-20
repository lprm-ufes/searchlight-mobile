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
      @runOnApp = document.URL.indexOf( 'http://' ) == -1 and document.URL.indexOf( 'https://' ) == -1
      this.bindEvents()
      @trocadeservicos = 0
      
    bindEvents: ->
      $('.btn-vincular').off()
      $('.btn-vincular').on('click',()->app.vincularServico())

      if @runOnApp
        document.addEventListener('deviceready', this.onDeviceReady, false)
      else
        $(document).ready( ()-> app.main())


    onDeviceReady:->
      app.main()

    main: ->
      console.log('Received Event: onDeviceReady' )
    
      if @runOnApp
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
      if @runOnApp
        cordova.plugins.barcodeScanner.scan(
          (result) ->
            self.loadServico(result.text)
          ,(error) ->
            alert("Falha na leitura do código QR: " + error)
          )
      else
        self.loadServico(prompt('Informe a url do mashup'))

    getUrlConfServico: ->
      @urlConfServico = @storage.getItem('urlConfServico')
      return @urlConfServico

    setUrlConfServico: (url) ->
      @urlConfServico = url
      if url
        @storage.setItem('urlConfServico', @urlConfServico)
      else
        @storage.removeItem('urlConfServico')

      #FIXME: --- trecho criado para resolver bug de pagina principal 
      # que recarrega sozinha ao usuario escolher outra pagina, ocorre
      # logo apos a troca de um servico
      if @trocadeservicos > 0
        window.location = "index.html"
      @trocadeservicos +=1
      # --- fim
      
    iniciaSegundaTela: ()->
      console.log('iniciado segunda tela')
      if @runOnApp
        @ss = new SecondScreen(@urlConfServico)
      else
        @ss = true

    loadServico: (urlConfServico) ->
      @setUrlConfServico(urlConfServico)

      window.userview = new UserView(urlConfServico)
      window.gpscontrole = new GPSControle()


#window.localStorage.setObject('lista_de_anotacoes',window.ativtest);
