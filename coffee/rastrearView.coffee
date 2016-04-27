

class RastrearView

  @mapa =null
  @geoJson = null
  @slsapi = null
  @id = false

  @criaMapa: ()->

    pos=L.latLng([GPSControle.lat,GPSControle.lng])
    RastrearView.mapa = L.map('mapaRastreio',{minZoom:15,maxZoom:17})
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/rezo.ihpe97f0/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(RastrearView.mapa)
    RastrearView.polyline = L.polyline(GPSControle.trilha, {color: 'red'}).addTo(RastrearView.mapa)
    RastrearView.marker = L.marker(pos)
    RastrearView.marker.addTo(RastrearView.mapa)
    RastrearView.mapa.setView(pos,16)
    RastrearView.mapa.invalidateSize(false)

    return RastrearView.mapa

  @saveid:  (r) ->
    storage = window.localStorage
    RastrearView.id = r.id
    storage.setItem('id_rastreamento',RastrearView.id)
    $("#pgrastrearview p.comentarios").html('ID:'+r.id+', '+GPSControle.trilha.length + ' pontos, '+ GPSControle.distance.toFixed(2) + ' metros do ultimo ponto')

  @update: ->
    slsapi = RastrearView.slsapi
    query = {'trilha':GPSControle.trilha, 'latitude':GPSControle.lat,'longitude': GPSControle.lng }

    slsapi.notes.update(RastrearView.id
      ,query
      ,(r)-> # On success do this
        $("#pgrastrearview p.comentarios").html('ID:'+r.id+', '+GPSControle.trilha.length + ' pontos, '+ GPSControle.distance.toFixed(2) + ' metros do ultimo ponto')
        console.log("Updata ok: Sent = #{r.bytesSent}")

      ,(error)-> # On error do this
        $.mobile.loading('hide')
        console.log("Erro ao enviar anotação: Code = #{error.code}")
        console.log("upload error source #{error.source}")
        console.log("upload error target #{error.target}")
      )

  @save: ->
    note = {}

    slsapi = RastrearView.slsapi
    note.comentarios = 'nota de rastreamento' 
    note.categoria = 'rastreamento'
    note.data_hora = "#{formatadata(new Date())} #{formatahora(new Date())}"
    note.latitude = GPSControle.lat
    note.longitude = GPSControle.lng
    note.accuracy = GPSControle.accuracy
    note.user = slsapi.user.user_id
    note.trilha = GPSControle.trilha

    slsapi.notes.enviar(
      note
      ,null
      ,(r)-> # On success do this
        RastrearView.saveid(r)
        console.log("Code = #{r.responseCode}")
        console.log("Response = #{r.response}")
        console.log("Sent = #{r.bytesSent}")

      ,(error)-> # On error do this
        $.mobile.loading('hide')
        console.log("Erro ao enviar anotação: Code = #{error.code}")
        console.log("upload error source #{error.source}")
        console.log("upload error target #{error.target}")
      )

  constructor: (slsapi) ->
    storage = window.localStorage
    if app.runOnApp
      cordova.plugins.backgroundMode.enable()
    RastrearView.id = storage.getItem('id_rastreamento')
    RastrearView.slsapi =slsapi
    $.mobile.changePage("#pgrastrearview",{changeHash:false})

    lastPosition = GPSControle.trilha.slice(-1,1)
    if RastrearView.mapa
      RastrearView.mapa.remove()
    @mapa = RastrearView.criaMapa()
    setTimeout(()-> 
      RastrearView.mapa.invalidateSize(false)
    ,1000)

    $(document).bind('newposition.gpscontrole', ()->
      RastrearView.updateMapa()
    )
    $('a.btn-parar-rastreamento').off('click')
    $('a.btn-parar-rastreamento').on('click',()-> RastrearView.stop())
    $('a.btn-atualizar-rastreamento').off('click')
    $('a.btn-atualizar-rastreamento').on('click',()-> RastrearView.updateMapa())


  @stop: ()->
    storage = window.localStorage
    if app.runOnApp
      cordova.plugins.backgroundMode.disable()
    RastrearView.id = ""
    storage.setItem('id_rastreamento',RastrearView.id)
    GPSControle.trilha = []
    gpscontrole.modoTrilha = false
    gpscontrole.save()
    $.mobile.changePage("#pglogado",{changeHash:true})

  @updateMapa: ()->
    GPSControle.checkpointDistance = parseInt($('#pgrastrear-distancia').val())
    pos=L.latLng([GPSControle.lat,GPSControle.lng])
    RastrearView.marker.setLatLng(pos)
    RastrearView.polyline.setLatLngs(GPSControle.trilha)


    if RastrearView.id
      RastrearView.update()
    else
      RastrearView.save()
  




module.exports= {RastrearView: RastrearView}
# vim: set ts=2 sw=2 sts=2 expandtab:
