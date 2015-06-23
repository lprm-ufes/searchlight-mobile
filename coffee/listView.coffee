

class ListView
  @dataPool: null

  constructor: (@slsapi) ->
    $.mobile.changePage("#pghistorico",{changeHash:false})

    ListView.dataPool = SLSAPI.dataPool.createDataPool(@slsapi.mashup)

    @loadData()
  
  loadData: ->
    position = { latitude:GPSControle.lat, longitude:GPSControle.lng, distance:10000}
    ListView.dataPool.loadAllData('',position)

    @slsapi.off SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP
    @slsapi.on SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP, (datapool)->
      html = ''
      $('#ulhistorico').empty()
      for ds in datapool.dataSources
        #ordenando o resultado por distancia
        v = []
        for note in ds.notes
          distance = getDistanceFromLatLonInKm(parseFloat(position.latitude),parseFloat(position.longitude),note.geo.coordinates[1],note.geo.coordinates[0])
          v.push([distance,note])
        v.sort((a,b)-> a[0] - b[0])
        #imprimindo o resultado
        for n in v
          [distance, note] = n
          console.log(note)
          li = "<li><a href=''><h2>#{note.user.username}</h2><p>#{formatDistance(distance)}</p><p>#{note.texto or note.comentarios}</p></a></li>"
          html="#{html} #{li}"

      $('#ulhistorico').html(html)
      $('#ulhistorico').listview().listview('refresh')

  selecionar: () ->

module.exports= {ListView: ListView}
# vim: set ts=2 sw=2 sts=2 expandtab:
