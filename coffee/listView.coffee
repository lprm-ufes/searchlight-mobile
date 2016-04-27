NoteView = require('./noteView.coffee').NoteView

class window.ListView
  @dataPool: null
  @noteView: null
  
  constructor: (@slsapi) ->
    #$.mobile.changePage("#pghistorico",{changeHash:false})

    ListView.dataPool = SLSAPI.dataPool.createDataPool(@slsapi.mashup)

    # abas info
    $("#notasnav a").off 'click'
    $("#notasnav a").on 'click', () ->
      ul_id = $(@).data('ul-id')
      $("#notasnav a").removeClass('ui-state-persist')
      $(@).addClass('ui-state-persist')
      $('#divulcoletadas,#divulfornecidas').hide()
      $("##{ul_id}").show()


    $('#ulfornecidas,#ulcoletadas').listview().listview('refresh')
    $('#divulcoletadas,#divulfornecidas').hide()
    $("#notasnav a.coletadas").click()
    @loadData()
  
  loadData: ->
    position = { latitude:GPSControle.lat, longitude:GPSControle.lng, distance:10000}
    isAnotacoesProximas = $('.checkAnotacoesProximas').prop('checked')
    console.log('oi', isAnotacoesProximas)
    if isAnotacoesProximas
      ListView.dataPool.loadAllData('',position)
    else
      ListView.dataPool.loadAllData()

    storageNotebookId = @slsapi.notes.storageNotebook.id
    ListView.storageNotebookId = storageNotebookId

    @slsapi.off SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP
    @slsapi.on SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP, (datapool)->
      html = ''
      htmlc = ''

      $('#ulfornecidas,#ulcoletadas').empty()
      for ds in datapool.dataSources
        #ordenando o resultado por distancia
        v = []
        for note in ds.notes
          distance = getDistanceFromLatLonInKm(parseFloat(position.latitude),parseFloat(position.longitude),note.geo.coordinates[1],note.geo.coordinates[0])
          v.push([distance,note])
        v.sort((a,b)-> a[0] - b[0])

        #if ds.url.indexOf(storageNotebookId) == -1
        #  html+="<li data-role='list-divider'>#{ds.url}</li>"

        #imprimindo o resultado
        for n in v
          [distance, note] = n
          img = ''
          video = ''
          if note.fotoURL
            img="<img width='100px' height='100px' src='#{note.fotoURL}' />"
          else
            if note.youtubeVideoId
              img="<img width='100px' height='100px' src='http://img.youtube.com/vi/#{note.youtubeVideoId}/sddefault.jpg' />"
          if note.youtubeVideoId
            video = "<span class='fa fa-file-video-o'>&nbsp;</span>"
          if ds.url.indexOf(storageNotebookId) > 0
            li = "<li><a class='action-note-select' data-note-id=\"#{note.hashid}\">#{img}#{video}<p>#{note.texto or note.comentarios}</p><p class='ul-li-aside'>#{formatDistance(distance)}</p></a></li>"
            htmlc="#{htmlc} #{li}"
          else
            li = "<li><a class='action-note-select' data-note-id=\"#{note.hashid}\">#{img}#{video}<p>#{note.texto or note.comentarios}</p><p>#{formatDistance(distance)}</p></a></li>"
            html="#{html} #{li}"

      $('#ulfornecidas').html(html)
      $('#ulcoletadas').html(htmlc)

      $('#ulfornecidas,#ulcoletadas').listview().listview('refresh')
      $('#divulcoletadas,#divulfornecidas').hide()
      $("#notasnav a.coletadas").click()
      ListView.bindEvents()

   @bindEvents: ()->
      $("a.action-note-select").off('click')
      $("a.action-note-select").on('click',(e)->
        closest = $(e.target).closest("a.action-note-select")
        hashid = $(closest).data('note-id')
        ListView.selecionar(hashid)
        )



  @selecionar: (hashid) ->
    note = ListView.getNoteByHashid(hashid)
    ListView.noteView = new NoteView(note)


  @getNoteByHashid: (hashid)->
    for ds in ListView.dataPool.dataSources
      for n in ds.notes
        if n.hashid and n.hashid == hashid
          return n
    return null

module.exports= {ListView: window.ListView}
# vim: set ts=2 sw=2 sts=2 expandtab:
