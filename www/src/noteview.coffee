
class window.NoteView
  constructor: (categoria) ->
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

  salvar: () ->
    dados = {}
    dados.comentarios = $('#txtcomments').val()
    dados.categoria = $('#pganotar-categoria').val()
    dados.fotoURI = @fotoURI
    dados.data_hora = "#{formatadata(new Date())} #{formatahora(new Date())}"
    dados.lat = GPSControle.lat
    dados.lng = GPSControle.lng
    dados.accuracy = GPSControle.accuracy
    dados.user_id = userview.user_id

    note = new Note(dados)
    note.enviar()

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

# vim: set ts=2 sw=2 sts=2 expandtab:
