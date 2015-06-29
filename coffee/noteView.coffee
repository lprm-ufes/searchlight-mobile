

class NoteView

  @mapa =null

  @criaMapa: (note)->
    pos=L.latLng(note.latitude,note.longitude)
    NoteView.mapa = L.map('mapa',{minZoom:15,maxZoom:17})
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/rezo.ihpe97f0/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(NoteView.mapa)
    marker = L.marker(pos)
    marker.addTo(NoteView.mapa)
    NoteView.mapa.setView(pos,16)
    NoteView.mapa.invalidateSize(false)

    return NoteView.mapa

  @getFilhos: (note)->
    filhos = []
    for ds in ListView.dataPool.dataSources
      f = ds.notesChildren[note.hashid]
      if f
        filhos = filhos.concat(f)
    return filhos

  constructor: (@note) ->
    $.mobile.changePage("#pgnoteview",{changeHash:false})

    if NoteView.mapa
      NoteView.mapa.remove()
    @mapa = NoteView.criaMapa(@note)
    setTimeout(()-> 
      NoteView.mapa.invalidateSize(false);
    ,1000)


    $('#pgnoteview p.comentarios').html(@note.comentarios or @note.texto)
    $('#pgnoteview p.categoria').html(@note.cat or @note.user.username)
    
    $('#pgnoteview a.btn-adicionar-nota').off('click')
    $('#pgnoteview a.btn-adicionar-nota').on 'click', =>
      anotacoesview.anexar(@note)

    $('#pgnoteview a.btn-deletar-nota').off('click')
    $('#pgnoteview a.btn-deletar-nota').on 'click', =>
      anotacoesview.deletar(@note)

    if @note.notebook and @note.notebook ==ListView.storageNotebookId
      $('#pgnoteview a.btn-deletar-nota').show()
      $('#pgnoteview a.btn-adicionar-nota').hide()
    else
      $('#pgnoteview a.btn-deletar-nota').hide()
      $('#pgnoteview a.btn-adicionar-nota').show()
 

    @listaFilhos()
  
  listaFilhos: ->
    $('#ulfilhos').empty()
    html = ''
    fi =NoteView.getFilhos(@note) 
    console.log(fi)
    for note in fi
      img = ''
      if note.fotoURL
        img="<img width='100px' height='100px' src='#{note.fotoURL}' />"
      li = "<li><a href='javascript:ListView.selecionar(\"#{note.hashid}\")'>#{img}<p>#{note.texto or note.comentarios}</p></a></li>"
      html="#{html} #{li}"

    $('#ulfilhos').html(html)
    $('#ulfilhos').listview().listview('refresh')


module.exports= {NoteView: NoteView}
# vim: set ts=2 sw=2 sts=2 expandtab:
