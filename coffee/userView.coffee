
Anotacoes = require('./anotacoes.coffee').Anotacoes

class UserView
  problemarede: ()->
    if @loading
      @loadging = false
      $.mobile.loading( "hide")
      $.mobile.changePage('#problemarede',{changeHash:false})
  constructor: (urlConfServico) ->
    @loading = true
    $.mobile.loading( "show", {
        text: "Carregando definições do usuário",
        textVisible: true,
        textonly: false,
      });
    setTimeout((()=> @problemarede() ), 10000)
    @slsapi = new SLSAPI({urlConfServico:urlConfServico})

    @slsapi.on SLSAPI.Config.EVENT_READY, ()=>
      $("#loginForm").on("submit", (e) => @submitLogin(e) )
      @load()

      @slsapi.on SLSAPI.User.EVENT_LOGIN_START, () ->
        $.mobile.loading('show', { text:'enviando',textVisible:'true'} )
      

      @slsapi.on SLSAPI.User.EVENT_LOGIN_FAIL, (err) =>
        $.mobile.loading('hide')
        $("#submitButton").removeAttr("disabled")
        if err.response.body.error
          alert(err.response.body.error)
        else
          @problemarede()

      @slsapi.on SLSAPI.User.EVENT_LOGIN_SUCCESS, () =>
        $.mobile.loading('hide')
        $("#submitButton").removeAttr("disabled")
        @load()

    @slsapi.on SLSAPI.Config.EVENT_FAIL, (err)=>
      @problemarede()
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
  bind: ()->
    $(".btn-listar-anotacoes").off()
    $(".btn-listar-anotacoes").on('click',()-> window.anotacoesview.listar())

  loadPermissions: ()->
    @data = @slsapi.user.user_data
    @data = JSON.parse(@data)
    @isRoot = @data.isRoot
    @isAdmin = @data.isAdmin

  load: () ->
    @loading = false
    $.mobile.loading( "hide")
    if @slsapi.user.isLogged()
      @bind()
      @anotacoesview = new Anotacoes(@slsapi)
      window.anotacoesview = @anotacoesview
      $('#pgperfil p.usuario').html("Usuário: #{@slsapi.user.getUsuario()}")
      $.mobile.changePage("#pglogado",{changeHash:false})
      @loadPermissions()
    else
      $.mobile.changePage("#pglogin",{changeHash:false})

exports.UserView = UserView

# vim: set ts=2 sw=2 sts=2 expandtab:
