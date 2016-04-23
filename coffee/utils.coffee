
window.zeroPad= (num, places) ->
    zero = places - num.toString().length + 1
    return Array(+(zero > 0 && zero)).join("0") + num
window.isInteger = (value)->
    intRegex = /^\d+$/
    return intRegex.test(value)

window.getIntVazio = (value)->
  if value
      return parseInt(value)
  else
      return ""
# fix para console.log em browsers antigos
if (not window.console)
    window.console = {log: () ->  }

  
Storage.prototype.setObject = (key, value) ->
        this.setItem(key, JSON.stringify(value))


Storage.prototype.getObject = (key) ->
        value = this.getItem(key)
        return value and JSON.parse(value)

window.str2datePT = (data)->
    return new Date(parseInt(data.slice(-4)),parseInt(data.slice(3,5)) - 1,parseInt(data.slice(0,2))).getTime()

window.formatadata = (data) ->
    return zeroPad(data.getDate(),2)+"/"+zeroPad(parseInt(data.getMonth())+1,2)+'/'+data.getFullYear()


window.formatahora = (data) ->
    return zeroPad(data.getHours(),2)+":"+zeroPad(data.getMinutes(),2)+':'+zeroPad(data.getSeconds(),2)
 
window.formatDistance = (distance)->
  if distance < 0.1
    return "#{(distance * 1000).toFixed(0)} m"
  else
    return "#{distance.toFixed(1)} km"
getParams = ->
  query = window.location.search.substring(1)
  raw_vars = query.split("&")
  params = {}
  for v in raw_vars
    [key, val] = v.split("=")
    params[key] = decodeURIComponent(val)
  params

window.PARAMETROS_GET = getParams()

window.getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) ->
  R = 6371; # Radius of the earth in km
  dLat = deg2rad(lat2 - lat1)  # deg2rad below
  dLon = deg2rad(lon2 - lon1) 
  a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  d = R * c # Distance in km
  return d

window.deg2rad = (deg) ->
    return deg * (Math.PI/180)

# vim: set ts=2 sw=2 sts=2 expandtab:

