

MyApp.angular.controller 'UserController', [
  '$window'
  '$scope'
  '$http'
  'SearchlightService'
  ($window,$scope, $http, SLS) ->
    'use strict'

    submitLogin= (e) ->
      u = $$("#username").val()
      p = $$("#password").val()
      if (u and  p)
        # disable the button so we can't resubmit while we wait
        $$("#submitButton").attr("disabled","disabled")
      else
        alert('Forneça um usuario e uma senha para autenticação')

      SLS.api.user.login(u,p)
      return false
   
    bindLoginEvents = ->
      SLS.api.on SLSAPI.User.EVENT_LOGIN_START, mostraLoading
      SLS.api.on SLSAPI.User.EVENT_LOGIN_FAIL, onLoginFail
      SLS.api.on SLSAPI.User.EVENT_LOGIN_SUCCESS, onLoginSuccess
      $$("#loginForm").on("submit", (e) -> submitLogin(e) )

    mostraLoading = ->
        loading = true
        MyApp.fw7.app.showPreloader('Enviando')

    loadPermissions = ()->
      $scope.data = SLS.api.user.user_data
      $scope.isRoot = $scope.data.isRoot
      $scope.isAdmin = $scope.data.isAdmin

    load = ->
      loading = false
      if SLS.api.user.isLogged()
        #@bind()
        #@anotacoesview = new Anotacoes(@slsapi)
        #window.anotacoesview = @anotacoesview
        #$('#pgperfil p.usuario').html("Usuário: #{@slsapi.user.getUsuario()}")

        loadPermissions()
        $window.location.href='./logged.html'
        console.log('tentei')
        #goPageInAnotherView('.view-main','#index')
      else
        bindLoginEvents()
        MyApp.viewBase.router.loadPage("#loginPage")

    onLoginFail = (err) ->
      $.mobile.loading('hide')
      $("#submitButton").removeAttr("disabled")
      if err.response.body.error
        alert(err.response.body.error)
      else
        @problemarede()

    onLoginSuccess = ->
        MyApp.fw7.app.hidePreloader()
        $("#submitButton").removeAttr("disabled")
        load()

    onSearchlightReady = ->
      console.log 'LoginPageController: ok, SearchlightService carregou api corretamente'
      load()
      return

    loading = true
    SLS.addEventListener 'ready', onSearchlightReady
    console.log('User controller')

    return
]



# vim: set ts=2 sw=2 sts=2 expandtab:

