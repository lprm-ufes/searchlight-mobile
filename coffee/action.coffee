class Action
  @normalAction:(ctx,classe)->
    return "<a class='ui-btn ui-shadow ui-corner-all action-anotar' style='text-align:left'    data-valor=\"#{ctx.valor}\"><i class='#{classe}' /><span>&nbsp;#{ctx.legenda}</span></a>"
 
  @trackingAction:(ctx,classe)->
    return "<a class='ui-btn ui-shadow ui-corner-all action-rastrear' style='text-align:left'\"><i class='#{classe}' /><span>&nbsp;#{ctx.legenda}</span></a>"
  
  @simpleAction:(ctx,classe)->
    # so mostra comentários e botao para tirar fotos
    return "<a class='ui-btn ui-shadow ui-corner-all action-anotar-simples' style='text-align:left'  data-valor=\"#{ctx.valor}\" data-tipo=\"#{ctx.tipo}\"><i class='#{classe}' /><span>&nbsp;#{ctx.legenda}</span></a>"
         
  @identificationAction:(ctx,classe)->
    return "<a class='ui-btn ui-shadow ui-corner-all action-identificar' style='text-align:left'><i class='#{classe}' /><span>&nbsp;#{ctx.legenda}</span></a>"
 
  @bindEvents: ()->
    $(".action-rastrear").off('click')
    $(".action-rastrear").on('click', ()->anotacoesview.rastrear())

    $(".action-identificar").off('click')
    $(".action-identificar").on('click', ()->anotacoesview.identificar())

    $(".action-anotar").off('click')
    $(".action-anotar").on('click', (e)->
      valor = $(e.target).closest('a.action-anotar').data('valor')
      anotacoesview.anotar(valor)
    )

    $(".action-anotar-simples").off('click')
    $(".action-anotar-simples").on('click', (e)->
      a = $(e.target).closest('a.action-anotar-simples')
      valor = a.data('valor')
      tipo = a.data('tipo')
      anotacoesview.anotar(valor,tipo)
    )
 

 
 
  @render: (ctx)->
    classe = "fa #{ctx.extra}"
    if ctx.extra and ctx.extra.trim().indexOf("fa-") == -1
      classe = "em #{ctx.extra}"

    if ctx.tipo == 'normal'
      return Action.normalAction(ctx,classe)
    else if ctx.tipo == 'simple'
      return Action.simpleAction(ctx,classe)
    else if ctx.tipo == 'identification'
      return Action.identificationAction(ctx,classe)
    else if ctx.tipo == 'tracking'
      return Action.trackingAction(ctx,classe)
    else
      return "Não foi possível entender a estrutura do mashup informado. Verifique se o link está corrompido ou se o app precisa ser atualizado."
         

exports.Action = Action

# vim: set ts=2 sw=2 sts=2 expandtab:

