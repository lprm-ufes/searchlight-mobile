

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

  constructor: (@note) ->
    $.mobile.changePage("#pgnoteview",{changeHash:false})

    if NoteView.mapa
      NoteView.mapa.remove()
    @mapa = NoteView.criaMapa(@note)
    setTimeout(()-> 
      console.log('oi');NoteView.mapa.invalidateSize(false);
    ,1000)


    $('#pgnoteview p.comentarios').html(@note.comentarios or @note.texto)
    $('#pgnoteview p.categoria').html(@note.cat or @note.user.username)



  

module.exports= {NoteView: NoteView}
# vim: set ts=2 sw=2 sts=2 expandtab:
