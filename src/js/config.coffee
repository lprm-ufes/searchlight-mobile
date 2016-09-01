#jslint browser: true 

#global console, MyApp, angular, Framework7

# Init angular
MyApp = {}
MyApp.config = {}
MyApp.angular = angular.module('SearchlightApp', ['ngStorage'])
# We need to use custom DOM library, let's save it to $$ variable:
$$ = Dom7
MyApp.fw7 =
  app: new Framework7(animateNavBackIcon: true)
  options: { domCache:true }
  views: []


# funcoes globais
goPageInAnotherView = (viewSelector,pageSelector)->
  $$(viewSelector)[0].f7View.router.loadPage(pageSelector)
  $$('.view').hide()
  $$(viewSelector).show()

getParams = ->
  query = window.location.search.substring(1)
  raw_vars = query.split("&")
  params = {}
  for v in raw_vars
    [key, val] = v.split("=")
    params[key] = decodeURIComponent(val)
  params

PARAMETROS_GET = getParams()



# vim: set ts=2 sw=2 sts=2 expandtab:

