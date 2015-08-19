class Action
  @normalAction:(ctx)->
    return "<a class='ui-btn ui-shadow ui-corner-all' style='text-align:left' 
    href=\"javascript:anotacoesview.anotar('#{ctx.valor}');\"><i class='fa #{ctx.extra}' /><span>&nbsp;#{ctx.legenda}</span></a>"
         
  @identificationAction:(ctx)->
    return "<a class='ui-btn ui-shadow ui-corner-all' style='text-align:left' 
    href=\"javascript:anotacoesview.identificar();\"><i class='fa #{ctx.extra}' /><span>&nbsp;#{ctx.legenda}</span></a>"
 
  @render: (ctx)->
    if ctx.tipo == 'normal'
      return Action.normalAction(ctx)
    else if ctx.tipo == 'identification'
      return Action.identificationAction(ctx)
         

exports.Action = Action

# vim: set ts=2 sw=2 sts=2 expandtab:

