
class window.UserView
  constructor: ->
    @slsapi = new SLSAPI({})

    $("#loginForm").on("submit", (e) => @submitLogin(e) )

    $(document).on 'slsapi.user:loginStart', () ->
      $.mobile.loading('show', { text:'enviando',textVisible:'true'} )
    
    $(document).on 'slsapi.user:loginFinish slsapi.user:loginFail', () ->
      $.mobile.loading('hide')
      $("#submitButton").removeAttr("disabled")

    $(document).on 'slsapi.user:loginFail', () ->
      alert('Não foi possivel conectar, verifique sua conexao de dados ou sua rede wifi!')

    $(document).on 'slsapi.user:loginSuccess', () =>
      @load()

  clear: () ->
    $("#username").val("")
    $("#password").val("")

  trocarUsuario: () ->
    @slsapi.user.logout()
    $.mobile.changePage('#pglogin',{changeHash:false})

  submitLogin: (e) =>
    #disable the button so we can't resubmit while we wait
    $("#submitButton").attr("disabled","disabled")
    u = $("#username").val()
    p = $("#password").val()
    @slsapi.user.login(u,p)

    return false

  load: () ->
    if @slsapi.user.usuario
      @anotacoesview = new Anotacoes()
      @anotacoesview.clearUI()
      @anotacoesview.sincronizar()
      window.anotacoesview = @anotacoesview

      $.mobile.changePage("#pglogado",{changeHash:false})
    else
      $.mobile.changePage("#pglogin",{changeHash:false})


# vim: set ts=2 sw=2 sts=2 expandtab:
