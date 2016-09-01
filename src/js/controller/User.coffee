

MyApp.angular.controller 'UserController', [
  '$window'
  '$scope'
  'SearchlightService'
  ($window,$scope,  SLS) ->
    'use strict'

    $scope.trocarUsuario = ->
      SLS.api.user.logout()
      $window.location.href='./index.html'

    $scope.trocarServico = ->
      SLS.trocarServico()
      $window.location.href='./index.html'
   
    bindLoginEvents = ->
      SLS.api.on SLSAPI.User.EVENT_LOGIN_START, mostraLoading
      SLS.api.on SLSAPI.User.EVENT_LOGIN_FAIL, onLoginFail
      SLS.api.on SLSAPI.User.EVENT_LOGIN_SUCCESS, onLoginSuccess
      $$("#loginForm").on("submit", (e) -> submitLogin(e) )

    mostraLoading = ->
        loading = true
        MyApp.fw7.app.showPreloader('Enviando')

    loadPermissions = ()->
      $scope.isRoot = $scope.data.isRoot
      $scope.isAdmin = $scope.data.isAdmin

    load = ->
        $scope.data = SLS.api.user.user_data
        loadPermissions()

        $scope.$apply()
        #$('#pgperfil p.usuario').html("Usuário: #{@slsapi.user.getUsuario()}")


    onSearchlightReady = ->
      console.log 'UserController: ok'
      console.log 'Searchlight Service API: ok'
      load()
      return

    SLS.addEventListener 'ready', onSearchlightReady

    return
]



# vim: set ts=2 sw=2 sts=2 expandtab:

