
class SecondScreen
  constructor: (@urlConfServico)->
    @session=  null
    @ping = 1
    @initializePresentation()

  initializePresentation: ->
      presentationElement = document.querySelector('#pglogado .btn-selecttv')
      presentationElement.addEventListener("touchstart",()=> @createNewSession())

      closeElement = document.querySelector('#pglogado .btn-closetv')
      closeElement.addEventListener("touchstart",()=>
        if (@session)
          @session.close()
      )

      navigator.presentation.onavailablechange = (dict)->
          if(dict.available)
            presentationElement.setAttribute('style', 'display:block;')
            closeElement.setAttribute('style', 'display:none;')
          else
            presentationElement.setAttribute('style', 'display:none;')
            closeElement.setAttribute('style', 'display:block;')

           
  createNewSession: ()->
      if (@session) 
          @session.close()
      @session = navigator.presentation.requestSession("receiver.html")
      @session.onmessage = (msg)=>
          pc = parseInt(msg)
          if(pc)
              @ping = pc + 1
              console.log(""+@ping)

      @session.onstatechange = ()=>
          closeElement = document.querySelector('#pglogado .btn-closetv')
          presentationElement = document.querySelector('#pglogado .btn-selecttv')

          if(@session.state == "connected")
              closeElement.setAttribute('style', 'display:block;')
              presentationElement.setAttribute('style', 'display:none;')
              @session.postMessage(@urlConfServico)
          else
              closeElement.setAttribute('style', 'display:none;')
              presentationElement.setAttribute('style', 'display:block;')

exports.SecondScreen = SecondScreen
# vim: set ts=2 sw=2 sts=2 expandtab:
