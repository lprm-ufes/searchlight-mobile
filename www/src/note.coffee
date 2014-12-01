
class window.Note
  @createURL = "http://sl.wancharle.com.br/note/create/"
  constructor: (dados) ->
    @categoria = dados.categoria
    @comentarios = dados.comentarios
    @fotoURI = dados.fotoURI
    @lat = dados.lat
    @lng = dados.lng
    @accuracy = dados.accuracy
    @user = dados.user_id
    @data_hora = dados.data_hora

  enviar: () ->
    params = {}
    params.latitude = @lat
    params.longitude = @lng
    params.accuracy = @accuracy
    params.user = @user
    params.categoria = @categoria
    params.comentarios = @comentarios
    params.data_hora = @data_hora
    console.log(params)

    
    $.mobile.loading('show', { text:'enviando',textVisible:'true'} )
    if @fotoURI
        options = new FileUploadOptions()
        options.params = params
        options.fileKey = "foto"
        options.fileName = @fotoURI.substr(@fotoURI.lastIndexOf('/') + 1)
        options.mimeType = "image/jpeg"
        
        options.params.fotoURL = true
        ft = new FileTransfer()
        ft.upload(
          @fotoURI,
          encodeURI(Note.createURL), 
          (r) =>
            @envioOk(r)
          ,(error) =>
            @envioFail(error)
          , options)
    else
      $.post(Note.createURL, params, (json) ->
          $.mobile.loading('hide')
          $.mobile.changePage("#pglogado",{changeHash:false})
          console.log(json)
      ,'json').fail( () ->
        $.mobile.loading('hide')
        alert('Erro no envio da anotação. Verifique sua conexão wifi.')

      )
  envioOk :(r) ->
    $.mobile.loading('hide')
    console.log("Code = #{r.responseCode}")
    console.log("Response = #{r.response}")
    console.log("Sent = #{r.bytesSent}")
    $.mobile.changePage("#pglogado",{changeHash:false})

  envioFail: (error) ->
    $.mobile.loading('hide')
    alert("Erro ao enviar anotação: Code = #{error.code}")
    console.log("upload error source #{error.source}")
    console.log("upload error target #{error.target}")
 
# vim: set ts=2 sw=2 sts=2 expandtab:
