(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.UserView = (function() {
    UserView.url_login = "http://sav.wancharle.com.br/logar/";

    function UserView() {
      this.submitLogin = __bind(this.submitLogin, this);
      this.storage = window.localStorage;
      this.usuario = this.getUsuario();
      $("#loginForm").on("submit", (function(_this) {
        return function(e) {
          return _this.submitLogin(e);
        };
      })(this));
    }

    UserView.prototype.getUsuario = function() {
      this.usuario = this.storage.getItem('Usuario');
      return this.usuario;
    };

    UserView.prototype.setUsuario = function(usuario) {
      this.usuario = usuario;
      return this.storage.setItem('Usuario', this.usuario);
    };

    UserView.prototype.clear = function() {
      $("#username").val("");
      return $("#password").val("");
    };

    UserView.prototype.trocarUsuario = function() {
      this.storage.removeItem('Usuario');
      this.usuario = null;
      this.clear();
      return $.mobile.changePage('#pglogin', {
        changeHash: false
      });
    };

    UserView.prototype.submitLogin = function(e) {
      var p, u, url;
      $("#submitButton").attr("disabled", "disabled");
      u = $("#username").val();
      p = $("#password").val();
      if (u && p) {
        url = UserView.url_login;
        $.post(url, {
          username: u,
          password: p
        }, (function(_this) {
          return function(res) {
            if (res === true) {
              _this.setUsuario(u);
              _this.load();
            } else {
              alert("Usuário ou Senha inválidos!");
            }
            return $("#submitButton").removeAttr("disabled");
          };
        })(this), "json").fail(function() {
          $("#submitButton").removeAttr("disabled");
          return alert('Não foi possivel conectar, verifique sua conexao de dados ou sua rede wifi!');
        });
      } else {
        $("#submitButton").removeAttr("disabled");
      }
      return false;
    };

    UserView.prototype.load = function() {
      if (this.usuario) {
        this.atividadesview = new Atividades();
        this.atividadesview.clearUI();
        this.atividadesview.sincronizar();
        window.atividadesview = this.atividadesview;
        return $.mobile.changePage("#pglogado", {
          changeHash: false
        });
      } else {
        return $.mobile.changePage("#pglogin", {
          changeHash: false
        });
      }
    };

    return UserView;

  })();

}).call(this);
