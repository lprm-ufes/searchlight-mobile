
MyApp.angular.controller 'AcoesPageController', [
  '$scope'
  '$http'
  'InitService'
  'SearchlightService'
  ($scope, $http, InitService,SLS) ->
    'use strict'

    InitService.addEventListener 'ready', ->
      # DOM ready
      console.log 'AcoesPageController: ok, DOM ready'
      SLS.loadServico()
      # You can access angular like this:
      # MyApp.angular
      # And you can access Framework7 like this:
      # MyApp.fw7.app
      return
    return
]

# vim: set ts=2 sw=2 sts=2 expandtab:

