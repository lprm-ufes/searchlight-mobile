
class window.UserView
  @url_login = "http://sl.wancharle.com.br/user/login/"

  constructor: ->
    @storage = window.localStorage
    @usuario = this.getUsuario()
    $("#loginForm").on("submit", (e) => @submitLogin(e) )

  getUsuario: () ->
    @usuario = @storage.getItem('Usuario')
    @user_id = @storage.getItem('user_id')
    return @usuario
  
  setUsuario: (usuario,json)->
    @user_id = json.id
    @usuario =  usuario
    @storage.setItem('Usuario',@usuario)
    @storage.setItem('user_id',@user_id)
  
  clear: () ->
    $("#username").val("")
    $("#password").val("")

  trocarUsuario: () ->
    @storage.removeItem('Usuario')
    @usuario = null
    @user_id = null
    @clear()
    $.mobile.changePage('#pglogin',{changeHash:false})

  submitLogin: (e) =>
    #disable the button so we can't resubmit while we wait
    $("#submitButton").attr("disabled","disabled")
    u = $("#username").val()
    p = $("#password").val()
    if (u and  p)
      url = UserView.url_login
      
      $.mobile.loading('show', { text:'enviando',textVisible:'true'} )
      $.post(url, {username:u,password:p}, (json) =>
        $.mobile.loading('hide')
        if json.error
          alert(json.error)
        else
          @setUsuario u, json
          @load()
        $("#submitButton").removeAttr("disabled")

      ,"json").fail(() ->
         $.mobile.loading('hide')
         $("#submitButton").removeAttr("disabled")
         alert('Não foi possivel conectar, verifique sua conexao de dados ou sua rede wifi!')

        )
    else
        $("#submitButton").removeAttr("disabled")
    return false

  load: () ->
    if @usuario 
      @anotacoesview = new Anotacoes()
      @anotacoesview.clearUI()
      @anotacoesview.sincronizar()
      window.anotacoesview = @anotacoesview

      $.mobile.changePage("#pglogado",{changeHash:false})
    else
      $.mobile.changePage("#pglogin",{changeHash:false})


# vim: set ts=2 sw=2 sts=2 expandtab:
