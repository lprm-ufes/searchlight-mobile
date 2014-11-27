
class window.UserView
  @url_login = "http://sav.wancharle.com.br/logar/"

  constructor: ->
    @storage = window.localStorage
    @usuario = this.getUsuario()
    $("#loginForm").on("submit", (e) => @submitLogin(e) )

  getUsuario: () ->
    @usuario = @storage.getItem('Usuario')
    return @usuario
  
  setUsuario: (usuario)->
    @usuario =  usuario
    @storage.setItem('Usuario',@usuario)
  
  clear: () ->
    $("#username").val("")
    $("#password").val("")

  trocarUsuario: () ->
    @storage.removeItem('Usuario')
    @usuario = null
    @clear()
    $.mobile.changePage('#pglogin',{changeHash:false})

  submitLogin: (e) =>
    #disable the button so we can't resubmit while we wait
    $("#submitButton").attr("disabled","disabled")
    u = $("#username").val()
    p = $("#password").val()
    if (u and  p)
      url = UserView.url_login
      $.post(url, {username:u,password:p}, (res) =>
            
        if(res == true)
          @setUsuario u
          @load()
        else
          alert("Usuário ou Senha inválidos!")
        
        $("#submitButton").removeAttr("disabled")

      ,"json").fail(() ->
         $("#submitButton").removeAttr("disabled")
         alert('Não foi possivel conectar, verifique sua conexao de dados ou sua rede wifi!')

        )
    else
        $("#submitButton").removeAttr("disabled")
    return false

  load: () ->
    if @usuario 
      @atividadesview = new Atividades()
      @atividadesview.clearUI()
      @atividadesview.sincronizar()
      window.atividadesview = @atividadesview

      $.mobile.changePage("#pglogado",{changeHash:false})
    else
      $.mobile.changePage("#pglogin",{changeHash:false})


# vim: set ts=2 sw=2 sts=2 expandtab:
