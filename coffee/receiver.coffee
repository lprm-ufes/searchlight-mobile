# vim: set ts=2 sw=2 sts=2 expandtab:

class window.App
  @TIMEOUT = 60000 # fecha sessão apos 1 minuto sem troca de mensagens

  constructor: ->
    console.log('connecting to device')
    @timeoutHandle=null
    @lastMsg = null
    @carregouMapa = false
    @bindEvents()

  bindEvents: ->
      document.addEventListener('deviceready', this.onDeviceReady, false)

  onDeviceReady: ->
      app.main('deviceready')

  main: ()->
      console.log('device ready')
      @initializePresentation()

  initializePresentation: ->
    navigator.presentation.onpresent =  (event) => @onPresent(event)

  attachToSession: ()->
    @session.onmessage = (msg) => @onMessage(msg)
    @session.onstatechange = ()=> @onStatechange()

  onStatechange: ()->
        if(@session.state == "connected")
            console.log('receiver connected')
        else
            console.log("receiver state=#{@session.state}")


  onPresent: (event)->
    if(event.session)
      @session = event.session
      @attachToSession()
 
  onMessage: (msg)->
    console.log(msg)
    if not @carregouMapa
      @carregouMapa = true
      carrega(msg)
      return
    if msg.indexOf('reset') == 0
      resetSearchlight()
    if msg.indexOf('mostraQR') == 0
      mostraQRcode()
    if msg.indexOf('move|') == 0
      moveParaMarcador(msg)
    if msg.indexOf('zoom|') == 0
      novoZoom(msg)
    if msg.indexOf('http') == 0
      if @lastMsg == msg
        console.log('close')
        @lastMsg = null
        $('#imagemodal').modal('hide')
      else
        $("#imagetv").attr('src',msg)
        $('#imagemodal').modal({keyboard:true})
        console.log('open '+msg)
        @lastMsg = msg
    else
      pc = parseInt(msg)
      if(pc)
        console.log("receiver"+pc)
        @session.postMessage(msg)

    if (@timeoutHandle)
      clearTimeout(@timeoutHandle)

    @timeoutHandle = setTimeout(
      ()=>
        app.session.close()
      ,App.TIMEOUT)

app = new App()
