
MyApp.angular.controller 'EscolheServicoController', [
  '$scope'
  'InitService'
  'SearchlightService'
  ($scope,InitService, SLS) ->
    'use strict'

    $scope.vincularServico = ->
      if InitService.runOnApp
        cordova.plugins.barcodeScanner.scan(
          (result) ->
            SLS.loadServicoPorUrl(result.text)
          ,(error) ->
            alert("Falha na leitura do código QR: " + error)
          )
      else
        url = prompt('Informe a url do mashup')
        if url != null
          if url
            SLS.loadServicoPorUrl(url)
          else
            alert('Informe uma url de serviço válida!')


    mostraPaginaEscolheServico = ->
      MyApp.viewBase.router.load({pageName:"escolheServico"})


    SLS.addEventListener 'fail', (err)->
      console.log(err)
      MyApp.fw7.app.alert(err.message,'Vinculação incompleta')
      mostraPaginaEscolheServico()


    InitService.addEventListener 'ready', ->
      console.log 'EscolheServicoController: ok'
      if SLS.temServicoVinculado()
        SLS.loadServico()
      else
        mostraPaginaEscolheServico()
      return

    return
]

# vim: set ts=2 sw=2 sts=2 expandtab: 
