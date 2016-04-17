(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app;

window.App = (function() {
  App.TIMEOUT = 60000;

  function App() {
    console.log('connecting to device');
    this.timeoutHandle = null;
    this.lastMsg = null;
    this.carregouMapa = false;
    this.bindEvents();
  }

  App.prototype.bindEvents = function() {
    return document.addEventListener('deviceready', this.onDeviceReady, false);
  };

  App.prototype.onDeviceReady = function() {
    return app.main('deviceready');
  };

  App.prototype.main = function() {
    console.log('device ready');
    return this.initializePresentation();
  };

  App.prototype.initializePresentation = function() {
    return navigator.presentation.onpresent = (function(_this) {
      return function(event) {
        return _this.onPresent(event);
      };
    })(this);
  };

  App.prototype.attachToSession = function() {
    this.session.onmessage = (function(_this) {
      return function(msg) {
        return _this.onMessage(msg);
      };
    })(this);
    return this.session.onstatechange = (function(_this) {
      return function() {
        return _this.onStatechange();
      };
    })(this);
  };

  App.prototype.onStatechange = function() {
    if (this.session.state === "connected") {
      return console.log('receiver connected');
    } else {
      return console.log("receiver state=" + this.session.state);
    }
  };

  App.prototype.onPresent = function(event) {
    if (event.session) {
      this.session = event.session;
      return this.attachToSession();
    }
  };

  App.prototype.onMessage = function(msg) {
    var pc;
    console.log(msg);
    if (!this.carregouMapa) {
      this.carregouMapa = true;
      carrega(msg);
      return;
    }
    if (msg.indexOf('reset') === 0) {
      resetSearchlight();
    }
    if (msg.indexOf('mostraQR') === 0) {
      mostraQRcode();
    }
    if (msg.indexOf('move|') === 0) {
      moveParaMarcador(msg);
    }
    if (msg.indexOf('zoom|') === 0) {
      novoZoom(msg);
    }
    if (msg.indexOf('http') === 0) {
      if (this.lastMsg === msg) {
        console.log('close');
        this.lastMsg = null;
        $('#imagemodal').modal('hide');
      } else {
        $("#imagetv").attr('src', msg);
        $('#imagemodal').modal({
          keyboard: true
        });
        console.log('open ' + msg);
        this.lastMsg = msg;
      }
    } else {
      pc = parseInt(msg);
      if (pc) {
        console.log("receiver" + pc);
        this.session.postMessage(msg);
      }
    }
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    return this.timeoutHandle = setTimeout((function(_this) {
      return function() {
        return app.session.close();
      };
    })(this), App.TIMEOUT);
  };

  return App;

})();

app = new App();



},{}]},{},[1]);
