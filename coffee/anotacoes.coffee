NoteAdd = require('./noteadd.coffee').NoteAdd
ListView = require('./listView.coffee').ListView
NoteView = require('./noteView.coffee').NoteView

GPSControle = require('./gps_controle.coffee').GPSControle
RastrearView = require('./rastrearView.coffee').RastrearView
Action = require('./action.coffee').Action

class window.Anotacoes
  constructor: (@slsapi) ->
    @acoes = []
    @slsapi.config.register(@)
    @parseOpcoes(@slsapi.config.opcoes)
    @geraTelaAnotacoes()

  parseOpcoes: (@opcoes)->
    @acoes = @opcoes.get 'acoes', @acoes 

  toJSON:->
    {
      'acoes':@createURL
    }

  geraTelaAnotacoes: ->
    html = ""

    for action in @acoes
        html += Action.render(action)

    $('#telaPrincipal').html(html)
    Action.bindEvents()


  anotar: (categoria,tipo)->
    Anotacoes.noteadd = new NoteAdd(categoria,@slsapi,false,null,tipo)
    return false

  anexar: (note)->
    Anotacoes.noteadd = new NoteAdd(null,@slsapi,true,note)
    return false

  showAnotacaoByIdentificador: (identificador)->
    @slsapi.notes.getByQuery("identificador=#{identificador}",
      (results)->
        Anotacoes.noteidentificada = new NoteView(results[0])
    ,(fail)->
      console.log("Falha ao buscar nota #{identificador}")
    )

  identificar: ->
    if app.runOnApp == false
      identificador=prompt("(leitura de barras simulada) Infome o identificador númerico:")
      @showAnotacaoByIdentificador(identificador)
    else
      self = @
      cordova.plugins.barcodeScanner.scan(
        (result) ->
          self.showAnotacaoByIdentificador(result.text)
        ,(error) ->
          alert("Falha na leitura do código QR: " + error)
        )
    return false

  rastrear: ->
    gpscontrole.modoTrilha = true
    Anotacoes.rastrearView = new RastrearView(@slsapi)
    RastrearView.updateMapa()
    return true
    
  listar: ()->
    Anotacoes.listview = new ListView(@slsapi)

  deletar: (note)->
    if confirm('Deseja apagar esta anotação?')
      @slsapi.notes.getByQuery("hashid=#{note.hashid}", (notes)=>
        @slsapi.notes.delete(notes[0].id, ()=>
          @listar()
          $.mobile.changePage("#pghistorico",{changeHash:false})
        )
      , ()-> alert('erro ao deletar nota'))
    
exports.Anotacoes = Anotacoes
# vim: set ts=2 sw=2 sts=2 expandtab:
