"use strict";
// Init App
var myApp = new Framework7({
    modalTitle: "Topdoc",
    material: true,
    angular: true
});
// Expose Internal DOM library
var $$ = Dom7;
// Add main view
var mainView = myApp.addView('.view-main', {
//  :O :P  
});
//URL DBA
// var dba = "http://localhost/td_crud/index.php/";
// var dba = "http://192.168.0.6/td_crud/index.php/";
var dba = "https://tremefa.com/td_crud/index.php/";
//ACTIVANDO ANGULAR
angular.module("TopdocApp", [])

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])



// CONTROLADORES ANGULAR INDEX INICIO

.controller('td-index', function($scope,$http){


//RAZIEL   
/**/var url = "tdp-service1.html"; 
    mainView.router.loadPage(url);
//RAZIEL   



  
  if(localStorage.getItem("id_usr_doc")){
    // EN CASO DE USUARIO LOGUEADO
    console.log(' MÉDICO :'+ localStorage.getItem("nombre"));
    loadAnswer();
    // $scope.activarCtrlFormacion = false;
    $scope.activarCtrlServicios = false;
    // $scope.activarCtrlPrestigio = false;

  $scope.selectDias=function(){
    $http.get(dba+"td_extras/extra_dias")
      .success(function(data){
        $scope.data=data
        // console.log("LISTA DIAS "+$scope.data)
        $scope.dias = $scope.data;
        var pickerDevice = myApp.picker({
        input: '.selectDiasUpdate',
        cols: [
                  {
                      // textAlign: 'center',
                      // values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']

                      values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                      displayValues: ('January February March April May June July August September October November December').split(' '),
                      textAlign: 'left'
                  }
              ]
          });
      })
  }
  $scope.selectHoras=function(){
    $http.get(dba+"td_extras/extra_horas")
      .success(function(data){
        $scope.data=data
        // console.log("LISTA HORAS "+$scope.data)
        $scope.horas = $scope.data;
      })
  }



    $scope.habilitarServicios = function() {
      $scope.activarCtrlServicios = true;

       $scope.activaCDomicilio=function(){
        console.log("Activar checkbox Consulta a domicilio");
       }

    };


  }else{
    console.log("NO HAY DATOS LOGUEARSE");
  //   var url = "td-login.html"; 
  // mainView.router.loadPage(url);
  }

  function loadAnswer(){
    // $("#logOut").on("click",logOut);
    var url = "td-profile.html"; 
    mainView.router.loadPage(url);
  }
})



// REGISTRO + VALIDA CORREO
.controller("topdoc_registro", function($scope,$http) {

      $scope.change = function() {
        $("#td-bottom").toggleClass('colorbtnverde');
      };

      $scope.registro=function(){
        $http.get(dba+"td_extras/valida_correo/?correo="+$scope.correo)
          .success(function(data){
            $scope.data=data
            console.log(data.correo);
            if(data.correo){
                myApp.alert("correo existente");
//--------- HACER LAS FUNCIONALIDADES DE BLOQUEAR REGISTRO
              }else{

              var passhash = CryptoJS.MD5($scope.password).toString();
                $http({
                  method: 'POST',
                  url: dba+'td_funciones/insert/td_usr_doc',
                  // url: dba+'td_perfil/td_usr_doc_management/insert',
                  headers: {'Content-Type': 'application/json'},
                  data: JSON.stringify({'correo':$scope.correo,'password':passhash,'telefono':$scope.telefono,'genero':$scope.genero})
                }).success(function (data) {
                    console.log(data);
                    $scope.message = data.status;
                });
              }
          })
      }
  })


.controller("topdoc_Login", function($scope,$http) {
  $('input[type="password"]').keypress(function(){
            if($(this).val() != ''){
               $('#td-bottom').addClass('colorbtnverde');
            }else{
              $("#td-bottom").removeClass('colorbtnverde');
            }
     });


  $scope.login = function (){
      $scope.correo;
      $scope.password;
    $.ajax({
      data: "correo="+$scope.correo+"&password="+$scope.password,
      // data: "email="+email+"&psw="+psw,
      type: 'POST',
      datatype: 'json',
      // url: 'log.php',
      url: dba+'/td_log/login/',
      success: function(data){
        // console.log(data);
        // [] JSON VACIO en este caso
        if(data == '[]'){
          console.log("LOGIN FUNCIONALIDADES DE ERROR");
          // $("#answ").text("error usuario o contraseña");
        }else{
          // saveStorage(data);
          if(localStorage){
            console.log(data);
            // localStorage.setItem("id",data["id"]);
            var datos = JSON.parse(data);
            // PARSEADO y MOSTRADO
            console.log(datos["correo"]);
            console.log(datos["id_usr_doc"]);
            // GUARDANDO localStorage 
            localStorage.setItem("id_usr_doc",datos["id_usr_doc"]);
            localStorage.setItem("correo",datos["correo"]);
  // {"id_usr_doc":"2","correo":"ozytwo@gmail.com","password":"67a8bb391da96881c90853aed6e57986","fecha_reg":"0000-00-00 00:00:00","telefono":"5433454345","status":"1","tipo_usr":"2","genero":"1"}
            loadAnswer();
          }else{
            alert("necesitas conseguirte algo mas nuevo");
          }
        }
        
      }
    });
  }

  function loadAnswer(){
    // $("#logOut").on("click",logOut);
    var url = "td-profile.html"; 
    mainView.router.loadPage(url);
  }

})






// MI PERFIL INFO GENERAL ANGULAR 
.controller('td_doc_info_gral', function($scope,$http){
  $scope.obj={'idisable':false};
  // $scope.btnName="Insert";

// OBTENER INFORMACION GENERAL

  var accion = '';
    $scope.inicial = function(){
      myApp.showIndicator();
      //CONEXION CARGA DATOS JSON
     // $http.get("https://tremefa.com/td_crud/index.php/td_perfil/td_doc_info_gral/?id_usr_doc="+localStorage.getItem("id_usr_doc"))
      $http.get(dba+"td_perfil/td_doc_info_gral/?id_usr_doc="+localStorage.getItem("id_usr_doc"))
        .success(function(data){
          $scope.data=data
          // GUARDANDO localStorage 
          localStorage.setItem("nombre",data.nombre);
          localStorage.setItem("nombre-apellidos",data.nombre+' '+data.apellidos);
          localStorage.setItem("id-perfil-registrado",data.id_usr_doc);

  //SELECT ASIGNAR ASIGNANDO DATOS E IMAGENES en menu JSON
          
          if(data == ''){  
            accion = "insert";
            myApp.hideIndicator();
          }else{
            // ASIGNANDO DATOS EN CAMPOS
            $("img.getfoto").attr('src', 'https://tremefa.com/td_crud/assets/uploads/files/foto/'+localStorage.getItem("id-perfil-registrado")+'.jpg');
            $("div#nombre-apellido").text(localStorage.getItem("nombre-apellidos")); 
            // OBTENER CARGA DATOS A CADA ELEMENTO
            $scope.nombre=data.nombre;
            $scope.apellidos=data.apellidos;
            $scope.acerca=data.acerca;
            accion = "update";
            myApp.hideIndicator();
          }
      })
  }



//PARA HACER INSERT O UPDATE
  $scope.guardar_info_gral=function(){
    console.log(accion);
    if(accion=='insert'){
      $http({
            method: 'POST',
            url: dba+'td_funciones/insert/td_doc_info_gral',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({'id_usr_doc':localStorage.getItem("id_usr_doc"),'nombre':$scope.nombre,'apellidos':$scope.apellidos,'acerca':$scope.acerca,'foto':localStorage.getItem("id_usr_doc"),'video':localStorage.getItem("id_usr_doc")})
          }).success(function (data) {
              console.log(data);
              $scope.message = data.status;
              myApp.alert($scope.message);
          });
    }
    if(accion=='update'){
      $http({
            method: 'POST',
            url: dba+'td_funciones/update/td_doc_info_gral/'+localStorage.getItem("id_usr_doc"),
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({'nombre':$scope.nombre,'apellidos':$scope.apellidos,'acerca':$scope.acerca,'foto':localStorage.getItem("id_usr_doc"),'video':localStorage.getItem("id_usr_doc")})
          }).success(function (data) {
              console.log(data);
              $scope.message = data.status;
              console.log($scope.message);
              myApp.alert("Tus datos han sido actualizados");
          });
    }

  }


  //BOTONES BOTTOM PARA CAMARA 
$('.getFoto-links').on('click', function () {
    var buttons1 = [
        {
            text: 'Tomar Foto',
            // bold: true
            onClick: function () {
              getImage();
            }
            
        },
        {
            text: 'Obtener del Album',
            onClick: function () {
              getPhoto();
            }
        }
    ];
    var buttons2 = [
        {
            text: 'Cancelar',
            color: 'red'
        }
    ];
    var groups = [buttons1, buttons2];
    myApp.actions(groups);
});


//OBTENER DE ALBUM
function getPhoto() {
 navigator.camera.getPicture(uploadPhoto, function(message) {
 alert('get picture failed');
 }, {
 quality: 40,
 allowEdit: true,
 destinationType: navigator.camera.DestinationType.FILE_URI,
 sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
 });
}

//FOTO
 function getImage() {
    navigator.camera.getPicture(uploadPhoto, function(message) {
    alert('get picture failed');
  },{
    quality: 40, 
    allowEdit: true,
    destinationType: navigator.camera.DestinationType.FILE_URI,
    sourceType: navigator.camera.PictureSourceType.DATA_URL
    }
    );
 }

//SUBIR FOTO A SERVIDOR
  function uploadPhoto(imageURI) {
    var largeImage = document.getElementById('smallImage');
    var menuImage = document.getElementById('menuImage');
    largeImage.src = imageURI;
    menuImage.src = imageURI;
     var options = new FileUploadOptions();
     options.fileKey = "file";
     options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
     options.mimeType = "image/jpeg";
     console.log(options.fileName);
     var params = new Object();
     params.value1 = "test";
     params.value2 = "param";
     options.params = params;
     options.chunkedMode = false;

  var ft = new FileTransfer();
     ft.upload(imageURI, "https://tremefa.com/td_crud/index.php/td_funciones/getfoto/"+localStorage.getItem("id_usr_doc"), function(result){
     console.log(JSON.stringify(result));
     console.log('Upload success: ' + result.responseCode);
     alert('Success: ' + result.responseCode);
     }, function(error){
     console.log(JSON.stringify(error));
     }, options);
   }



//EXTRAS DE APOYO -----

  // $scope.displayStud=function(){
  //   $http.get("http://localhost/td_crud/index.php/td_perfil/td_doc_info_gral/?id_usr_doc="+localStorage.getItem("id_usr_doc"))
  //   .success(function(data){
  //     $scope.data=data
  //   })
  // }

  // $scope.deleteStud=function(studid){
  //   $http.post("http://localhost/td_backend_test/delete.php",{'id':studid})
  //   .success(function(){
  //       $scope.msg="Data Deletion successfull";
  //       $scope.displayStud();


  //   })

  // }

  // $scope.editStud=function(id_usr_doc, nombre)
  // {
  //   $scope.id_usr_doc=id_usr_doc;
  //   $scope.nombre=nombre;
  //   $scope.btnName="Update";
  //   $scope.obj.idisable=true;
  //   $scope.displayStud();

  // }

//EXTRAS DE APOYO -----



})




//EJEMPLO DE AISLAMIENTO DE CONTROLADORES INTERNOS
.controller('ParentCtrl', function($scope) {
    $scope.mostrarFragmentos = false;

    $scope.habilitar = function() {
      $scope.mostrarFragmentos = true;

    };
  })
  .controller('Controller1', function($scope) {
    $scope.nombre = 'Controller1';

    alert('Controler1');
  })
  .controller('Controller2', function($scope) {
    $scope.nombre = 'Controller2';

    alert('Controler2');
  })

//EJEMPLO DE AISLAMIENTO DE CONTROLADORES INTERNOS




.controller('td_consulta_remota', function($scope,$http){

  $scope.servicio_tarifa = 50;
  $scope.min = 50;
  $scope.max = 200;

  var accion = '';
    $scope.inicial = function(){
      myApp.showIndicator();
      console.log("Activando servicio td_consulta_remota");
      $scope.selectTipoRemota();
      $scope.selectUsr();
      $scope.selectHorario();
      $scope.selectDias();
      $scope.selectHoras();
      myApp.hideIndicator();
  }



$scope.selectTipoRemota=function(){
    $http.get(dba+"td_perfil_servicios_y_tarifas/td_doc_consulta_remota_usr/"+localStorage.getItem("id_usr_doc"))
    // $http.get("http://localhost/td_crud/index.php/td_perfil_servicios_y_tarifas/td_doc_consulta_tipo/"+localStorage.getItem("id_usr_doc"))
    .success(function(data){
      $scope.data=data
      $scope.id_usr_doc_consulta_remota=data.id_usr_doc;
      $scope.id_doc_consulta_remota_usr=data.id_doc_consulta_remota_usr;
      $scope.consulta_remota_value = data.consulta_remota;

      //TIPO DE VALOR RECONOCIDO PARA CHECKBOX
      if($scope.consulta_remota_value=="1"){
        var remota_value= true;
      }else{
        var remota_value= false;
      }
      $scope.activarRemoto = {
       value : remota_value
     };
    })
  }

  $scope.selectUsr=function(){
    $http.get(dba+"td_perfil_servicios_y_tarifas/td_doc_consulta_remota/"+localStorage.getItem("id_usr_doc"))
    .success(function(data){
      $scope.data=data
      $scope.servicio_tarifa=data.servicio_tarifa;
    })
  }
  $scope.selectHorario=function(){
    // CONSULTA DE HORARIOS REGISTRADOS
    $http.get(dba+"td_perfil_servicios_y_tarifas/td_doc_consulta_remota_horario/"+localStorage.getItem("id_usr_doc"))
      .success(function(data){
        $scope.data=data
        $scope.horarios =$scope.data;
      })
  }
  $scope.deleteHorario=function(id_doc_consulta_remota_horario){
    console.log("Agregar si borrar o no");
    $http.get(dba+"td_perfil_servicios_y_tarifas/td_doc_consulta_remota_horario_management/"+localStorage.getItem("id_usr_doc")+"/delete/"+id_doc_consulta_remota_horario)
      .success(function(data){
        $scope.data=data
        myApp.alert(id_doc_consulta_remota_horario+" Registro Borrado");
        console.log($scope.data);
        $scope.inicial();
      })
  }

  $scope.addHorario=function(){
    $http({
      method: 'POST',
      url: dba+'td_funciones/insert/td_doc_consulta_remota_horario',
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify({'id_usr_doc':localStorage.getItem("id_usr_doc"),'id_extra_dias':$scope.id_extra_dias,'id_extra_horas_inicio':$scope.id_extra_horas_inicio,'id_extra_horas_fin':$scope.id_extra_horas_fin})
    }).success(function (data) {
        console.log(data);
        $scope.message = data.status;
        myApp.alert($scope.message);
        $scope.inicial();
    });

  }

  $scope.addTarifaRemoto=function(){
    // EN CASO DE USUARIO SI SE REGITRO EN CONSULTA REMOTA
    if($scope.id_usr_doc_consulta_remota){
      var accion = 'update';
     }else{
      var accion = 'insert';
     }

    console.log("Acciones de acividad nueva y tarifa " + $scope.activarRemoto.value + " tarfifa " + $scope.servicio_tarifa + accion);

    if(accion=='insert'){
      $http({
            method: 'POST',
            url: dba+'td_funciones/insert/td_doc_consulta_remota_usr',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({'id_usr_doc':localStorage.getItem("id_usr_doc"),'consulta_remota':$scope.activarRemoto.value})
          }).success(function (data) {
              // console.log(data);
              $scope.message = data.status;
              myApp.alert($scope.message);

                 $http({
                    method: 'POST',
                    url: dba+'td_funciones/insert/td_doc_consulta_remota',
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify({'id_usr_doc':localStorage.getItem("id_usr_doc"),'servicio_tarifa':$scope.servicio_tarifa})
                  }).success(function (data) {
                      // console.log(data);
                      $scope.message = data.status;
                      myApp.alert($scope.message);
                  });
          });
    }



    if(accion=='update'){
      $http({
            method: 'POST',
            url: dba+'td_funciones/update/td_doc_consulta_remota_usr/'+$scope.id_doc_consulta_remota_usr,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({'consulta_remota':$scope.activarRemoto.value})
          }).success(function (data) {
              console.log(data);
              $scope.message = data.status;
              // console.log($scope.message);
              myApp.alert("Tus datos han sido actualizados");
                $http({
                  method: 'POST',
                  url: dba+'td_funciones/update/td_doc_consulta_remota/'+$scope.id_usr_doc_consulta_remota,
                  headers: {'Content-Type': 'application/json'},
                  data: JSON.stringify({'servicio_tarifa':$scope.servicio_tarifa})
                }).success(function (data) {
                    console.log(data);
                    $scope.message = data.status;
                    console.log($scope.message);
                    myApp.alert("Tus datos han sido actualizados");
                });
          });
    }
  }

})

  



//CONSULTA A DOMICILIO
.controller("td_consulta_domicilio", function($scope,$http) {

  console.log("Activando servicio td_consulta_domicilio");
  $scope.servicio_tarifa = 50;
  $scope.min = 50;
  $scope.max = 200;

  // var accion = '';
  //   $scope.inicial = function(){
  //     myApp.showIndicator();
  //     $scope.selectTipoRemota();
  //     $scope.selectUsr();
  //     $scope.selectHorario();
  //     $scope.selectDias();
  //     $scope.selectHoras();
  //     myApp.hideIndicator();
  // }




  })
//CONSULTA A DOMICILIO

//CONSULTA consultorio
.controller("td_consulta_consultorio", function($scope,$http) {

  console.log("Activando servicio td_consulta_consultorio");


  });
//CONSULTA consultorio













$$('a#logOut').on('click', function () {
      localStorage.removeItem("id_usr_doc");
      var url = "td-login.html"; 
    mainView.router.loadPage(url);
  })


//LOADERS
// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
     // myApp.showIndicator();
    myApp.hideIndicator();
    // $$('#overlay').addClass('hide');

});





 var mySwiper = myApp.swiper('.swiper-container', {
      speed: 400,
    spaceBetween: 100,
    pagination:'.swiper-pagination'
});


 /* ===== Validar TD-LOGIN ===== */

myApp.onPageInit('TD_login', function (e) {

    var conteo = 0  //Definimos la Variable

    $$("#change").click(function() { //Funcion del Click
        if(conteo == 0) { //Si la variable es igual a 0
        conteo = 1; //La cambiamos a 1
        $$('#password').removeAttr("type", "password"); //Removemos el atributo de Tipo Contraseña
        $$("#password").prop("type", "text"); //Agregamos el atributo de Tipo Texto(Para que se vea la Contraseña escribida)
        $$("#change").removeClass("eye"); //Removemos una clase (la imagen del ojo por defecto)
        $$("#change").addClass("eye2"); //Agregamos una Nueva Clase (la imagen del ojo nueva)
        }else{ //En caso contrario
        conteo = 0; //La cambiamos a 0
        $$('#password').removeAttr("type", "text"); //Removemos el atributo de Tipo Texto
        $$("#password").prop("type", "password"); //Agregamos el atributo de Tipo Contraseña
        $$("#change").removeClass("eye2"); //Removemos una clase (la imagen del ojo nueva)
        $$("#change").addClass("eye"); //Agregamos una Nueva Clase (la imagen del ojo por defecto)
        } //Cierre del Else
    }); //Cierre de la funcion Click


    $$('a#submit-login').attr('disabled','disabled');
     $$('input[type="email"]').keypress(function(){
            if($$(this).val() != ''){
               $$('a#submit-login').removeAttr('disabled');
            }
     });
    $$('#submit-login').on('click', function () {

        // $$("#TDFormLogin").validate();
         var pass = $$('#password').val();
         var email = $$('#email').val()
         // if (!pass || !email){
        if ( email == "diatredu" && pass == "wmg123"){
            $$('a#submit-login').attr('disabled','disabled');
            $$('#password').val("");
            $$('#email').val("");
            // myApp.alert(' BIENVENIDO DOC !! ');
            return;
         }else{
            var formDataLogin = myApp.formToJSON('#TDFormLogin');
            // alert(JSON.stringify(formDataLogin));
            // myApp.alert(' BIENVENIDO DOC !! ');
         }
    }); 

    // $$('#submit-login').on('click', function () {
    //   var pass = $$('#password').val();
    //   var email = $$('#email').val()
    //     if ( email == "diatredu" && pasword == "wmg123"){
    //       myApp.alert(' BIENVENIDO DOC !! ');
    //       // window.location = "success.html"; // Redirecting to other page.
    //       return false;
    //     }
    //     else{
    //     attempt --;// Decrementing by one.
    //     alert("You have left "+attempt+" attempt;");
    //     // Disabling fields after 3 attempts.
    //       if( attempt == 0){
    //       $$('#password').disabled = true;
    //       $$('#email').disabled = true;
    //       // $$('#password').disabled = true;
    //       myApp.alert(' USUARIO INCORRECTO !! ');
    //       return false;
    //       }
    //     }
    // } 






     $$('form.ajax-submit').on('submitted', function (e) {
  var xhr = e.detail.xhr; // actual XHR object
 
  var data = e.detail.data; // Ajax response from action file
  // do something with response data
  alert("noma");

  var url = "td-profile.html"; 
    mainView.router.loadPage(url);

});


     // ANGULAR


});












// TD REGISTRO
myApp.onPageInit('TD_registro', function (page) {
    $('#td-form-registro').validator();
    
});

myApp.onPageInit('TD_terminos', function (page) {

    $$('div#td-link-registro').on('click', function() {
      var url = "td-registro.html"; 
      mainView.router.loadPage(url);
      });

    
});

//PRUEBAS
myApp.onPageInit('TD_pruebas', function (page) {

  $$('.get-storage-data').on('click', function() {
    var storedData = myApp.formGetData('my-form2');
    if(storedData) {
      alert(JSON.stringify(storedData));
    }
    else {
      alert('There is no stored data for this form yet. Try to change any field')
    }
  });
   
  $$('.delete-storage-data').on('click', function() {
    var storedData = myApp.formDeleteData('my-form2');
    alert('Form data deleted')
  });
   
  $$('.save-storage-data').on('click', function() {
    var storedData = myApp.formStoreData('my-form2', {
      'name': 'John',
      'email': 'john@doe.com',
      'gender': 'female',
      'switch': ['yes'],
      'slider': 10
    });
    alert('Form data replaced, refresh browser to see changes')
  });
});



// LISTAS TD_PACIENTES_LIST
myApp.onPageInit('TD_PACIENTES_LIST', function (page) {
    // TD Alerta con efecto BLURRED
    $$('.td-proximamente').on('click', function () {
        $$("div.pageview").addClass("content-blurred");
        myApp.alert('PROXIMAMENTE !! ', function () {
            $$("div.pageview").removeClass("content-blurred");
            // myApp.alert('Button clicked!')
        });
    });
    // TD Alerta con efecto BLURRED
});
// LISTAS TD_PACIENTES_LIST

// LISTAS TD_CAJA
myApp.onPageInit('TD_CAJA', function (page) {
    // TD Alerta con efecto BLURRED
    $$('.td-proximamente').on('click', function () {
        $$("div.pageview").addClass("content-blurred");
        myApp.alert('PROXIMAMENTE !! ', function () {
            $$("div.pageview").removeClass("content-blurred");
            // myApp.alert('Button clicked!')
        });
    });
    // TD Alerta con efecto BLURRED
});
// LISTAS TD_CAJA


//TD ABRIR VIDEO EN PERFIL PROFILE MI PERFIL
/*=== With Video ===*/
myApp.onPageInit('TD_PROFILE', function (page) {
var myPhotoBrowserPopupDark = myApp.photoBrowser({
    photos : [
        {
            html: '<iframe src="//www.youtube.com/embed/JlGyTIBaUog" frameborder="0" allowfullscreen></iframe>',
            caption: 'Dra. Laura Michelle Velten Aguirre'
        },
    ],
    theme: 'dark',
    type: 'standalone'
});


$$('.create-about').on('click', function () {
  var clickedLink = this;
  var popoverHTML = '<div class="popover">'+
                      '<div class="popover-inner">'+
                        '<div class="content-block">'+
                          '<p>About Popover created dynamically.</p>'+
                          '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac diam ac quam euismod porta vel a nunc. Quisque sodales scelerisque est, at porta justo cursus ac.</p>'+
                        '</div>'+
                      '</div>'+
                    '</div>'
  myApp.popover(popoverHTML, clickedLink);
});
 // CREA LINKS DE FOTO
// $$('.create-links').on('click', function () {
//   var clickedLink = this;
//   var popoverHTML = '<div class="popover">'+
//                       '<div class="popover-inner">'+
//                         '<div class="list-block">'+
//                           '<ul>'+
//                           '<li><a href="#" class="item-link list-button" id="popover" onclick="getImage();">Capturar Imagén</li>'+
//                           '<li><a href="#" class="item-link list-button" id="popover" onclick="getPhoto(pictureSource.SAVEDPHOTOALBUM);">Obtener de Album</li>'+
//                           '</ul>'+
//                         '</div>'+
//                       '</div>'+
//                     '</div>'
//   myApp.popover(popoverHTML, clickedLink);
//   myApp.closeModal(popover);

// });


$$('.td-video-dr').on('click', function () {
    // PROBAR 
    // myPhotoBrowserPopupDark.open(); 

    var url="https://www.youtube.com/embed/JlGyTIBaUog"   
    openUrl(url);
    //for launch  website
    function openUrl(url){
       //opens inapp browser
        window.open(url,'_blank');
       //opens system browser
        // window.open(url,'_system');
    }
});




// TD Alerta con efecto BLURRED
$$('.td-proximamente').on('click', function () {
    $$("div.pageview").addClass("content-blurred");
    myApp.alert('PROXIMAMENTE !! ', function () {
        $$("div.pageview").removeClass("content-blurred");
        // myApp.alert('Button clicked!')
    });
});
// TD Alerta con efecto BLURRED


// 3 SLIDES MENU SLIDES GALLERY GALERIA MENU
// 3 Slides Per View, 10px Between
var mySwiper4 = myApp.swiper('.swiper-4', {
  pagination:'.swiper-4 .swiper-pagination',
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
  spaceBetween: 0,
  slidesPerView: 3
});


// var mySwiper = myApp.swiper('.swiper-container', {
//   pagination: '.swiper-pagination',
//   paginationHide: false,
//   paginationClickable: true,
//   nextButton: '.swiper-button-next',
//   prevButton: '.swiper-button-prev',
// });  


});


/* ===== Swipe to delete events callback demo ===== */
myApp.onPageInit('swipe-delete', function (page) {
    $$('.demo-remove-callback').on('deleted', function () {
        myApp.alert('Thanks, item removed!');
    });
    
});


myApp.onPageInit('dashboard', function (page) {
    google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Dinosaur', 'Length'],
          ['Acrocanthosaurus (top-spined lizard)', 12.2],
          ['Albertosaurus (Alberta lizard)', 9.1],
          ['Allosaurus (other lizard)', 12.2],
          ['Apatosaurus (deceptive lizard)', 22.9],
          ['Archaeopteryx (ancient wing)', 0.9],
          ['Argentinosaurus (Argentina lizard)', 36.6],
          ['Baryonyx (heavy claws)', 9.1],
          ['Brachiosaurus (arm lizard)', 30.5],
          ['Ceratosaurus (horned lizard)', 6.1],
          ['Coelophysis (hollow form)', 2.7],
          ['Compsognathus (elegant jaw)', 0.9],
          ['Deinonychus (terrible claw)', 2.7],
          ['Diplodocus (double beam)', 27.1],
          ['Dromicelomimus (emu mimic)', 3.4],
          ['Gallimimus (fowl mimic)', 5.5],
          ['Mamenchisaurus (Mamenchi lizard)', 21.0],
          ['Megalosaurus (big lizard)', 7.9],
          ['Microvenator (small hunter)', 1.2],
          ['Ornithomimus (bird mimic)', 4.6],
          ['Oviraptor (egg robber)', 1.5],
          ['Plateosaurus (flat lizard)', 7.9],
          ['Sauronithoides (narrow-clawed lizard)', 2.0],
          ['Seismosaurus (tremor lizard)', 45.7],
          ['Spinosaurus (spiny lizard)', 12.2],
          ['Supersaurus (super lizard)', 30.5],
          ['Tyrannosaurus (tyrant lizard)', 15.2],
          ['Ultrasaurus (ultra lizard)', 30.5],
          ['Velociraptor (swift robber)', 1.8]]);

        var options = {
          legend: { position: 'none' },
        };

        var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
        
          
        chart.draw(data, options);
          
           var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],               
          ['Sleep',    7]
        ]);

        var options = {
          pieHole: 0.3,
        };

        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);
          
          
      }
});
myApp.onPageInit('swipe-delete media-lists', function (page) {
    $$('.demo-reply').on('click', function () {
        myApp.alert('Reply');
    });
    $$('.demo-mark').on('click', function () {
        myApp.alert('Mark');
    });
    $$('.demo-forward').on('click', function () {
        myApp.alert('Forward');
    });
});


/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('swipe-delete modals media-lists', function (page) {
    var actionSheetButtons = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Choose some action',
                label: true
            },
            // First button
            {
                text: 'Alert',
                onClick: function () {
                    myApp.alert('He Hoou!');
                }
            },
            // Second button
            {
                text: 'Second Alert',
                onClick: function () {
                    myApp.alert('Second Alert!');
                }
            },
            // Another red button
            {
                text: 'Nice Red Button ',
                color: 'red',
                onClick: function () {
                    myApp.alert('You have clicked red button!');
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancel'
            }
        ]
    ];
    $$('.demo-actions').on('click', function (e) {
        myApp.actions(actionSheetButtons);
    });
    $$('.demo-actions-popover').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionSheetButtons);
    });
    
});
        



/* ===== masonary Gallery Page ===== */
myApp.onPageInit('masonry', function (page) {
    $(document).ready( function(){
        $('.grid').masonry({
          itemSelector: '.grid-item'
        });
    });
        
    $('.swipebox' ).swipebox();
    
    $(".galleryone").click(function(){
        $(".grid").addClass("one");
        $(".grid").removeClass("two three");
        $('.grid').masonry({
          itemSelector: '.grid-item'
        });
    });
    
    $(".gallerytwo").click(function(){
        $(".grid").addClass("two");
        $(".grid").removeClass("one  three");
        $('.grid').masonry({
          itemSelector: '.grid-item'
        });
    });
    
    $(".gallerythree").click(function(){
        $(".grid").addClass("three");
        $(".grid").removeClass("two one");
        $('.grid').masonry({
          itemSelector: '.grid-item'
        });
    });
    
});







/* ===== Swipebox Gallery Page ===== */

myApp.onPageInit('gallery', function (page) {
        $('.swipebox' ).swipebox();
});



myApp.onPageInit('profile', function (page) {
        $('.swipebox' ).swipebox();
});
        
       // ESTOS SON LOS MENSAJES 
/* ===== Messages Page ===== */
myApp.onPageInit('messages', function (page) {

    var conversationStarted = false;
    var answers = [
        'Yes!',
        'NO MAMESSSSSS',
        'No',
        'Hm...',
        'I am not sure',
        'And what about you?',
        'May be ;)',
        'Lorem ipsum dolor sit amet, consectetur',
        'What?',
        'Are you sure?',
        'NO MAMESSSSSS',
        'Of course',
        'Need to think about it',
        'Amazing!!!',
    ];
    var people = [
        {
            name: 'Max Johnson',
            avatar: 'img/pic2.png'
        },
        {
            name: 'Stereo Doe',
            avatar: 'img/pic1.png'
        },
        
    ];
    var answerTimeout, isFocused;

    // Initialize Messages
    var myMessages = myApp.messages('.messages');

    // Initialize Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');
    
    $$('.messagebar a.send-message').on('touchstart mousedown', function () {
        isFocused = document.activeElement && document.activeElement === myMessagebar.textarea[0];
    });
    $$('.messagebar a.send-message').on('click', function (e) {
        // Keep focused messagebar's textarea if it was in focus before
        if (isFocused) {
            e.preventDefault();
            myMessagebar.textarea[0].focus();
        }
        var messageText = myMessagebar.value();
        if (messageText.length === 0) {
            return;
        }
        // Clear messagebar
        myMessagebar.clear();

        // Add Message
        myMessages.addMessage({
            text: messageText,
            avatar: 'img/i-f7-material.png',
            type: 'sent',
            date: 'Now'
        });
        conversationStarted = true;
        // Add answer after timeout
        if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function () {
            var answerText = answers[Math.floor(Math.random() * answers.length)];
            var person = people[Math.floor(Math.random() * people.length)];
            myMessages.addMessage({
                text: answers[Math.floor(Math.random() * answers.length)],
                type: 'received',
                name: person.name,
                avatar: person.avatar,
                date: 'Just now'
            });
        }, 2000);
    });
});

/* ===== Pull To Refresh Demo ===== */
myApp.onPageInit('contacts', function (page) {
    // Dummy Content
    var songs = ['Sheela Joshi', 'Boxer Car', 'Makbul Ahemad', 'Lia'];
    var authors = ['India', 'Australia', 'Qatar', 'Clifornia'];
    // Pull to refresh content
    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
    // Add 'refresh' listener on it
    ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            var picURL = 'img/pic1.png';
            var song = songs[Math.floor(Math.random() * songs.length)];
            var author = authors[Math.floor(Math.random() * authors.length)];
            var linkHTML = '<li class="item-content">' +
                                '<div class="item-media"><img src="' + picURL + '" width="44"/></div>' +
                                '<div class="item-inner">' +
                                    '<div class="item-title-row">' +
                                        '<div class="item-title">' + song + '</div>' +
                                    '</div>' +
                                    '<div class="item-subtitle">' + author + '</div>' +
                                '</div>' +
                            '</li>';
            ptrContent.find('ul').prepend(linkHTML);
            // When loading done, we need to "close" it
            myApp.pullToRefreshDone();
        }, 2000);
    });
});




/* ===== Color themes ===== */
myApp.onPageInit('color-themes', function (page) {
    $$(page.container).find('.ks-color-theme').click(function () {
        var classList = $$('body')[0].classList;
        for (var i = 0; i < classList.length; i++) {
            if (classList[i].indexOf('theme') === 0) classList.remove(classList[i]);
        }
        classList.add('theme-' + $$(this).attr('data-theme'));
    });
    $$(page.container).find('.ks-layout-theme').click(function () {
        var classList = $$('body')[0].classList;
        for (var i = 0; i < classList.length; i++) {
            if (classList[i].indexOf('layout-') === 0) classList.remove(classList[i]);
        }
        classList.add('layout-' + $$(this).attr('data-theme')); 
    });
});


/* ===== Calendar ===== */
myApp.onPageInit('profile todoadd', function (page) {
    // Default
    var calendarDefault = myApp.calendar({
        input: '#ks-calendar-default2',
    });
    // With custom date format
    var calendarDateFormat = myApp.calendar({
        input: '#ks-calendar-date-format2',
        dateFormat: 'DD, MM dd, yyyy'
    });
});	

myApp.onPageInit('register', function (page) {
    // Default
    var calendarDefault = myApp.calendar({
        input: '#ks-calendar-default2',
    });
    // With custom date format
    var calendarDateFormat = myApp.calendar({
        input: '#ks-calendar-date-format2',
        dateFormat: 'DD, MM dd, yyyy'
    });
});	

myApp.onPageInit('calendar todo', function (page) {
    // Default
    var calendarDefault = myApp.calendar({
        input: '#ks-calendar-default',
    });
    // With custom date format
    var calendarDateFormat = myApp.calendar({
        input: '#ks-calendar-date-format',
        dateFormat: 'DD, MM dd, yyyy'
    });
    // With multiple values
    var calendarMultiple = myApp.calendar({
        input: '#ks-calendar-multiple',
        dateFormat: 'M dd yyyy',
        multiple: true
    });
    
    // Inline with custom toolbar
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];
    var calendarInline = myApp.calendar({
        container: '#ks-calendar-inline-container',
        value: [new Date()],
        weekHeader: false,
        header: false,
        footer: false,
        toolbarTemplate: 
            '<div class="toolbar calendar-custom-toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
                    '</div>' +
                    '<div class="center"></div>' +
                    '<div class="right">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        onOpen: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            $$('.calendar-custom-toolbar .left .link').on('click', function () {
                calendarInline.prevMonth();
            });
            $$('.calendar-custom-toolbar .right .link').on('click', function () {
                calendarInline.nextMonth();
            });
        },
        onMonthYearChangeStart: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
        }
    });
});


/* ===== Pickers ===== */
myApp.onPageInit('pickers', function (page) {
    var today = new Date();

    // iOS Device picker
    var pickerDevice = myApp.picker({
        input: '#ks-picker-device',
        cols: [
            {
                textAlign: 'center',
                values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
            }
        ]
    });

    // Describe yourself picker
    var pickerDescribe = myApp.picker({
        input: '#ks-picker-describe',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'left',
                values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
            },
            {
                values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
            },
        ]
    });

    // Dependent values
    var carVendors = {
        Japanese : ['Honda', 'Lexus', 'Mazda', 'Nissan', 'Toyota'],
        German : ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Volvo'],
        American : ['Cadillac', 'Chrysler', 'Dodge', 'Ford']
    };
    var pickerDependent = myApp.picker({
        input: '#ks-picker-dependent',
        rotateEffect: true,
        formatValue: function (picker, values) {
            return values[1];
        },
        cols: [
            {
                textAlign: 'left',
                values: ['Japanese', 'German', 'American'],
                onChange: function (picker, country) {
                    if(picker.cols[1].replaceValues){
                        picker.cols[1].replaceValues(carVendors[country]);
                    }
                }
            },
            {
                values: carVendors.Japanese,
                width: 160,
            },
        ]
    });

    // Custom Toolbar
    var pickerCustomToolbar = myApp.picker({
        input: '#ks-picker-custom-toolbar',
        rotateEffect: true,
        toolbarTemplate: 
            '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link toolbar-randomize-link">Randomize</a>' +
                    '</div>' +
                    '<div class="right">' +
                        '<a href="#" class="link close-picker">That\'s me</a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        cols: [
            {
                values: ['Mr', 'Ms'],
            },
            {
                textAlign: 'left',
                values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
            },
            {
                values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
            },
        ],
        onOpen: function (picker) {
            picker.container.find('.toolbar-randomize-link').on('click', function () {
                var col0Values = picker.cols[0].values;
                var col0Random = col0Values[Math.floor(Math.random() * col0Values.length)];

                var col1Values = picker.cols[1].values;
                var col1Random = col1Values[Math.floor(Math.random() * col1Values.length)];

                var col2Values = picker.cols[2].values;
                var col2Random = col2Values[Math.floor(Math.random() * col2Values.length)];
                
                picker.setValue([col0Random, col1Random, col2Random]);
            });
        }
    });

    // Inline date-time
    var pickerInline = myApp.picker({
        input: '#ks-picker-date',
        container: '#ks-picker-date-container',
        toolbar: false,
        rotateEffect: true,
        value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
        onChange: function (picker, values, displayValues) {
            var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
            if (values[1] > daysInMonth) {
                picker.cols[1].setValue(daysInMonth);
            }
        },
        formatValue: function (p, values, displayValues) {
            return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
        },
        cols: [
            // Months
            {
                values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                displayValues: ('January February March April May June July August September October November December').split(' '),
                textAlign: 'left'
            },
            // Days
            {
                values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            },
            // Years
            {
                values: (function () {
                    var arr = [];
                    for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                    return arr;
                })(),
            },
            // Space divider
            {
                divider: true,
                content: '&nbsp;&nbsp;'
            },
            // Hours
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 23; i++) { arr.push(i); }
                    return arr;
                })(),
            },
            // Divider
            {
                divider: true,
                content: ':'
            },
            // Minutes
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                    return arr;
                })(),
            }
        ]
    });
});


google.charts.load('current', {'packages':['corechart','geochart','bar','table']});

myApp.onPageInit('chart', function (page) {
    // Load the Visualization API and the corechart package.
     

    $(document).ready( function(){
              google.charts.setOnLoadCallback(drawChart);
                    function drawChart() {
                        
                        /* Donut chart */
                        var data = google.visualization.arrayToDataTable([
                          ['Task', 'Hours per Day'],
                          ['Work',     11],
                          ['Eat',      2],
                          ['Commute',  2],
                          ['Watch TV', 2],
                          ['Sleep',    7]
                      ]);

                     var options = {
                        title: '',
                        pieHole: 0.34
                      };

                      var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
                      chart.draw(data, options);
                                 
                     /* Pie chart */
                      var data2 = google.visualization.arrayToDataTable([
                        ['Task', 'Hours per Day'],
                        ['Work',     11],
                        ['Eat',      2],
                        ['Commute',  2],
                        ['Watch TV', 2],
                        ['Sleep',    7]
                        ]);
                      var options2 = {
                        title: ''
                      };

                      var chart2 = new google.visualization.PieChart(document.getElementById('piechart'));

                      chart2.draw(data2, options2);
                    
                          
                      
                        
                        /* bar chart */                      
                        var data3 = google.visualization.arrayToDataTable([
                          ['Year', 'Sales', 'Expenses', 'Profit'],
                          ['2014', 1000, 400, 200],
                          ['2015', 1170, 460, 250],
                          ['2016', 660, 1120, 300],
                          ['2017', 1030, 540, 350]
                        ]);

                        var options3 = {
                          chart: {
                            title: '',
                            subtitle: '',
                          }
                        };
                        var chart3 = new google.charts.Bar(document.getElementById('columnchart_material'));
                        chart3.draw(data3, options3);
      
                        
                        
                        /* tabel chart */
                        var data4 = new google.visualization.DataTable();
                        data4.addColumn('string', 'Name');
                        data4.addColumn('number', 'Salary');
                        data4.addColumn('boolean', 'Full Time Employee');
                        data4.addRows([
                          ['Mike',  {v: 10000, f: '$10,000'}, true],
                          ['Jim',   {v:8000,   f: '$8,000'},  false],
                          ['Alice', {v: 12500, f: '$12,500'}, true],
                          ['Bob',   {v: 7000,  f: '$7,000'},  true]
                        ]);

                        var table = new google.visualization.Table(document.getElementById('table_div'));

                        table.draw(data4, {showRowNumber: true, width: '100%', height: '100%'});
                        
                        
                        
                        /* Area chart */
                      
                        var data5 = google.visualization.arrayToDataTable([
                          ['Year', 'Sales', 'Expenses'],
                          ['2013',  1000,      400],
                          ['2014',  1170,      460],
                          ['2015',  660,       1120],
                          ['2016',  1030,      540]
                        ]);

                        var options5 = {
                          title: '',
                          hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
                          vAxis: {minValue: 0}
                        };

                        var chart5 = new google.visualization.AreaChart(document.getElementById('areachart_div'));
                        chart5.draw(data5, options5);
                      
                    
                    
                };
                    
            

              google.charts.setOnLoadCallback(drawRegionsMap);

              function drawRegionsMap() {

                var data = google.visualization.arrayToDataTable([
                  ['Country', 'Popularity'],
                  ['Germany', 200],
                  ['United States', 300],
                  ['Brazil', 400],
                  ['Canada', 500],
                  ['France', 600],
                  ['India', 600],
                  ['RU', 700]
                ]);

                var options = {};

                var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

                chart.draw(data, options);
              }
  
    
    
    
    
        });
    
    
    
});

/* ===== Change statusbar bg when panel opened/closed ===== */
$$('.panel-left').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-left');
});



$$('.panel-left, .panel-right').on('close', function () {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});
