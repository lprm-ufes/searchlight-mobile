class NoteView

  @mapa =null

  @criaMapa: (note)->
    if NoteView.mapa
      try
        NoteView.mapa.remove()
      catch error
        console.log("errors: #{error}")
        
    pos=L.latLng(note.latitude,note.longitude)
    NoteView.mapa = L.map('mapa',{minZoom:15,maxZoom:17})
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/rezo.ihpe97f0/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(NoteView.mapa)
    marker = L.marker(pos)
    marker.addTo(NoteView.mapa)

    if note.trilha
      NoteView.polyline = L.polyline(note.trilha, {color: 'red'}).addTo(NoteView.mapa)
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
    if not @note
      alert('Anotação informada não existe!')
      return

    $.mobile.changePage("#pgnoteview",{changeHash:false})

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

    if @note.fotoURL 
      $('#pgnoteview p.foto').html("<img src='#{@note.fotoURL}' width='100%' />")
      $('#pgnoteview p.foto').show()
    else 
      $('#pgnoteview p.foto').hide()


    $('#pgnoteview p.foto img').off('click')
    $('#pgnoteview p.foto img').on 'click', =>
      imageSrc = $('#pgnoteview p.foto img').attr('src')
      app.ss.session.postMessage(imageSrc)
      
    if @note.youtubeVideoId
      $('#pgnoteview a.btn-tocar-video').off('click')
      $('#pgnoteview a.btn-tocar-video').on 'click', =>
        YoutubeVideoPlayer.openVideo(@note.youtubeVideoId);

      $('#notevideo').attr('src',"http://img.youtube.com/vi/#{@note.youtubeVideoId}/sddefault.jpg")
      $('#pgnoteview fieldset.video').show()
    else
      $('#pgnoteview fieldset.video').hide()



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
    for note in fi
      img = ''
      video = ''
      if note.fotoURL
        img="<img width='100px' height='100px' src='#{note.fotoURL}' />"
      else
        if note.youtubeVideoId
          img="<img width='100px' height='100px' src='http://img.youtube.com/vi/#{note.youtubeVideoId}/sddefault.jpg' />"

      if note.youtubeVideoId
        video = "<span class='fa fa-file-video-o'>&nbsp;</span>"

      li = "<li><a href='javascript:ListView.selecionar(\"#{note.hashid}\")'>#{img}#{video}<p>#{note.texto or note.comentarios}</p></a></li>"
      html="#{html} #{li}"

    $('#ulfilhos').html(html)
    $('#ulfilhos').listview().listview('refresh')


module.exports= {NoteView: NoteView}
# vim: set ts=2 sw=2 sts=2 expandtab:
