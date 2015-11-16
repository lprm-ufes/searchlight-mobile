
Anotacoes = require('./anotacoes.coffee').Anotacoes

class UserView
  constructor: (urlConfServico) ->
    @slsapi = new SLSAPI({urlConfServico:urlConfServico})

    @slsapi.on SLSAPI.Config.EVENT_READY, ()=>
      $("#loginForm").on("submit", (e) => @submitLogin(e) )
      @load()

      @slsapi.on SLSAPI.User.EVENT_LOGIN_START, () ->
        $.mobile.loading('show', { text:'enviando',textVisible:'true'} )
      

      @slsapi.on SLSAPI.User.EVENT_LOGIN_FAIL, (err) ->
        $.mobile.loading('hide')
        $("#submitButton").removeAttr("disabled")
        if err.response.body.error
          alert(err.response.body.error)
        else
          alert('Não foi possivel conectar, verifique sua conexao de dados ou sua rede wifi!')

      @slsapi.on SLSAPI.User.EVENT_LOGIN_SUCCESS, () =>
        $.mobile.loading('hide')
        $("#submitButton").removeAttr("disabled")
        @load()

    @slsapi.on SLSAPI.Config.EVENT_FAIL, (err)=>
      alert('Não foi possivel conectar ao serviço, verifique sua conexao de dados ou sua rede wifi!')
      console.log(err)
    

  clear: () ->
    $("#username").val("")
    $("#password").val("")

  trocarUsuario: () ->
    @slsapi.user.logout()
    $.mobile.changePage('#pglogin',{changeHash:false})

  submitLogin: (e) =>
    u = $("#username").val()
    p = $("#password").val()
    if (u and  p)
      # disable the button so we can't resubmit while we wait
      $("#submitButton").attr("disabled","disabled")
    else
      alert('Forneça um usuario e uma senha para autenticação')
    @slsapi.user.login(u,p)

    return false

  load: () ->
    if @slsapi.user.isLogged()
      @anotacoesview = new Anotacoes(@slsapi)
      window.anotacoesview = @anotacoesview
      $('#pgperfil p.usuario').html("Usuário: #{@slsapi.user.getUsuario()}")
      $.mobile.changePage("#pglogado",{changeHash:false})
    else
      $.mobile.changePage("#pglogin",{changeHash:false})

exports.UserView = UserView

# vim: set ts=2 sw=2 sts=2 expandtab:
