

class RastrearView

  @mapa =null
  @geoJson = null

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

  constructor: () ->
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
    GPSControle.trilha = []
    gpscontrole.modoTrilha = false
    gpscontrole.save()
    $.mobile.changePage("#pglogado",{changeHash:true})

  @updateMapa: ()->
    pos=L.latLng([GPSControle.lat,GPSControle.lng])
    RastrearView.marker.setLatLng(pos)
    RastrearView.polyline.setLatLngs(GPSControle.trilha)






module.exports= {RastrearView: RastrearView}
# vim: set ts=2 sw=2 sts=2 expandtab:
