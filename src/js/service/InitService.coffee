#jslint browser: true #

#global console, Framework7, MyApp, $document #

MyApp.angular.factory 'InitService', [
  '$document'
  ($document) ->

    onReady = ->
      fw7 = MyApp.fw7
      i = undefined

      pagina=$('body').data('pagina')
      if pagina=='logged'
        MyApp.tab1 = fw7.app.addView('#tab1', fw7.options)
        MyApp.tab2 = fw7.app.addView('#tab2', fw7.options)
        MyApp.tab3 = fw7.app.addView('#tab3', fw7.options)
        fw7.views.push MyApp.tab1
        fw7.views.push MyApp.tab2
        fw7.views.push MyApp.tab3
        fw7.app.showTab("#tab1")
        console.log('logged page')
      else
        console.log('index page')
        MyApp.viewBase = fw7.app.addView('.view-base', fw7.options)
        fw7.views.push MyApp.viewBase

      i = 0
      while i < eventListeners.ready.length
        eventListeners.ready[i]()
        i = i + 1
      return

    'use strict'
    pub = {}
    eventListeners = 'ready': []

    pub.addEventListener = (eventName, listener) ->
      eventListeners[eventName].push listener
      return

    # Init
    do ->
      $document.ready ->
        if document.URL.indexOf('http://') == -1 and document.URL.indexOf('https://') == -1
          # Cordova
          console.log 'Using Cordova/PhoneGap setting'
          document.addEventListener 'deviceready', onReady, false
          pub.runOnApp = true
        else
          # Web browser
          console.log 'Using web browser setting'

          pub.runOnApp = false
          onReady()
        return
      return
    pub
]

# vim: set ts=2 sw=2 sts=2 expandtab:

