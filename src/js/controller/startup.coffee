
MyApp.angular.controller 'StartupController', [
  '$scope'
  'InitService'
  'SearchlightService'
  ($scope,InitService, SLS) ->
    'use strict'

    $scope.vincularServico = SLS.vincularServico

    InitService.addEventListener 'ready', ->
      console.log 'StartupController: ok, DOM ready'

      if SLS.getUrlConfServico()
        SLS.loadServico(SLS.urlConfServico)
      else
        MyApp.viewBase.router.loadPage("#escolheServico")

      return
    return
]

# vim: set ts=2 sw=2 sts=2 expandtab:

