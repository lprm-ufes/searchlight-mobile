GPSControle = require('./gps_controle.coffee').GPSControle


class NoteAdd
  constructor: (categoria,slsapi,anexar=false,note=null) ->
    @slsapi = slsapi
    if anexar
      @parentId = note.hashid
    $('#pganotar p.nota-relacionada').hide()
    if categoria
      $('#pganotar-titulo').html("Anotação de #{categoria}")
      $('#pganotar-categoria').val(categoria)
      $('#pganotar p.categoria').hide()
    else
      if anexar
        $('#pganotar-titulo').html("Anotação Relacionada")
        $('#pganotar p.nota-relacionada').html("<strong>Nota relacionada:</strong>#{note.comentarios or note.texto}")
        $('#pganotar p.nota-relacionada').show()
      else
        $('#pganotar-titulo').html("Anotação Personalizada")
      $('#pganotar-categoria').val('')
      $('#pganotar p.categoria').show()

    $('#txtcomments').val('')
    $('#fotoTirada').attr('src','data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
    $('#youtubeThumb').attr('src','data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
    @fotoURI = null
    @identificador = null

    $.mobile.changePage("#pganotar",{changeHash:false})

    $('#fotoTirada').off('click')
    $('#fotoTirada').on('click', => @escolherFoto())
    $('#pganotar a.btnFotografar').off('click')
    $('#pganotar a.btnFotografar').on('click', => @fotografar())
    $('#pganotar a.btnYoutube').off('click')
    $('#pganotar a.btnYoutube').on('click', => @linkarYoutube())
    
    $('#pganotar a.btnQRcode').off('click')
    $('#pganotar a.btnQRcode').on('click', => @identificar())
    $('#pganotar a.btnOCR').off('click')
    $('#pganotar a.btnOCR').on('click', => @identificarOCR())



    $('#pganotar a.btnSalvar').off('click')
    $('#pganotar a.btnSalvar').on('click', => @salvar())


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
    if @parentId
      note.id_parent = @parentId

    if @youtubeVideoId
      note.youtubeVideoId = @youtubeVideoId

    if @identificador
      note.identificador = @identificador

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

  identificarOCR: ->
    win = (r)->
      console.log(r)
      alert(r.response)
    
    fail = (error)->
      console.log(error)

    navigator.camera.getPicture(
      (imageURI) =>
        console.log(imageURI)
        alert(imageURI)
        ft = new FileTransfer()
        options = new FileUploadOptions()
        options.fileKey = "file"
        options.mimeType = "text/plain"
        params = {}
        params.privado=true
        options.params = params
        ft.upload(imageURI, encodeURI("http://sl.wancharle.com.br/note/ocr"), win, fail, options)
      ,(message) =>
        @fotoOnFail(message)
      ,{
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI, 
        sourceType:Camera.PictureSourceType.PHOTOLIBRARY
      })


  identificar: ->
    self = @
    cordova.plugins.barcodeScanner.scan(
      (result) ->
        self.identificador=result.text
        $('#noteHashid').text(self.identificador)
        console.log(result.text)
      ,(error) ->
        alert("Falha na leitura do código QR: " + error)
      )

  linkarYoutube: ->
    videoid = prompt('informe o id do video no youtube')
    if videoid
      @youtubeVideoId = videoid 
      $('#youtubeThumb').attr('src',"http://img.youtube.com/vi/#{videoid}/sddefault.jpg")


  escolherFoto: () ->
    navigator.camera.getPicture(
      (imageURI) =>
        @fotoOnSuccess(imageURI)
      ,(message) =>
        @fotoOnFail(message)
      ,{
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI, 
        sourceType:Camera.PictureSourceType.PHOTOLIBRARY
      })


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

exports.NoteAdd = NoteAdd
# vim: set ts=2 sw=2 sts=2 expandtab:
