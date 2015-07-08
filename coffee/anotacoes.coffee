NoteAdd = require('./noteadd.coffee').NoteAdd
ListView = require('./listView.coffee').ListView
NoteView = require('./noteView.coffee').NoteView

GPSControle = require('./gps_controle.coffee').GPSControle

class window.Anotacoes
  constructor: (slsapi) ->
    @slsapi = slsapi

  anotar: (categoria)->
    Anotacoes.noteadd = new NoteAdd(categoria,@slsapi)

  anexar: (note)->
    Anotacoes.noteadd = new NoteAdd(null,@slsapi,true,note)

  showAnotacaoByIdentificador: (identificador)->
    @slsapi.notes.getByQuery("identificador=#{identificador}",
      (results)->
        Anotacoes.noteidentificada = new NoteView(results[0])
    ,(fail)->
      console.log("Falha ao buscar nota #{identificador}")
    )

  identificar: ->
    self = @
    cordova.plugins.barcodeScanner.scan(
      (result) ->
        self.showAnotacaoByIdentificador(result.text)
        console.log(result.text)
      ,(error) ->
        alert("Falha na leitura do código QR: " + error)
      )

  listar: ()->
    Anotacoes.listview = new ListView(@slsapi)

  deletar: (note)->
    if confirm('Deseja apagar esta anotação?')
      @slsapi.notes.getByQuery("hashid=#{note.hashid}", (notes)=>
        @slsapi.notes.delete(notes[0].id, ()=> @listar())
      , ()-> alert('erro ao deletar nota'))
    
exports.Anotacoes = Anotacoes
# vim: set ts=2 sw=2 sts=2 expandtab:
