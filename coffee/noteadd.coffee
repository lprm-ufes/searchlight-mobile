GPSControle = require('./gps_controle.coffee').GPSControle


class NoteView
  constructor: (categoria,slsapi) ->
    @slsapi = slsapi
    if categoria
      $('#pganotar-titulo').html("Anotação de #{categoria}")
      $('#pganotar-categoria').val(categoria)
      $('#pganotar p.categoria').hide()
    else
      $('#pganotar-titulo').html("Anotação Personalizada")
      $('#pganotar-categoria').val('')
      $('#pganotar p.categoria').show()

    $('#txtcomments').val('')
    $('#fotoTirada').attr('src','data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
    @fotoURI = null

    $.mobile.changePage("#pganotar",{changeHash:false})


    @slsapi.off SLSAPI.Notes.EVENT_ADD_NOTE_START
    @slsapi.on SLSAPI.Notes.EVENT_ADD_NOTE_START, ()->
      $.mobile.loading('show', { text:'enviando',textVisible:'true'} )

    @slsapi.off SLSAPI.Notes.EVENT_ADD_NOTE_FINISH
    @slsapi.on SLSAPI.Notes.EVENT_ADD_NOTE_FINISH, ()->
      $.mobile.loading('hide')
      $.mobile.changePage("#pglogado",{changeHash:false})

    @slsapi.off SLSAPI.Notes.EVENT_ADD_NOTE_FAIL
    @slsapi.on SLSAPI.Notes.EVENT_ADD_NOTE_FAIL, ()->
      $.mobile.loading('hide')
      alert('Erro no envio da anotação. Verifique sua conexão wifi.')

  salvar: () ->
    note = {}
    note.comentarios = $('#txtcomments').val()
    note.categoria = $('#pganotar-categoria').val()
    note.fotoURI = @fotoURI
    note.data_hora = "#{formatadata(new Date())} #{formatahora(new Date())}"
    note.latitude = GPSControle.lat
    note.longitude = GPSControle.lng
    note.accuracy = GPSControle.accuracy
    note.user = @slsapi.user.user_id

    @slsapi.notes.enviar(
      note
      ,null
      ,(r)-> # On success do this
        console.log("Code = #{r.responseCode}")
        console.log("Response = #{r.response}")
        console.log("Sent = #{r.bytesSent}")

      ,(error)-> # On error do this
        $.mobile.loading('hide')
        alert("Erro ao enviar anotação: Code = #{error.code}")
        console.log("upload error source #{error.source}")
        console.log("upload error target #{error.target}")
      )

  fotografar: () ->
    navigator.camera.getPicture(
      (imageURI) =>
        @fotoOnSuccess(imageURI)
      ,(message) =>
        @fotoOnFail(message)
      ,{
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI 
      })

  fotoOnSuccess: (imageURI) ->
    $('#fotoTirada').attr('src', imageURI)
    @fotoURI = imageURI
    console.log(imageURI)

  fotoOnFail: (message)-> 
          alert("Não foi possível fotografar pois: #{message}")

exports.NoteView = NoteView
# vim: set ts=2 sw=2 sts=2 expandtab:
