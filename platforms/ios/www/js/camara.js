var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64-encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      // smallImage.style.display = 'block';

      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('smallImage');

      // Unhide image elements
      // largeImage.style.display = 'block';

      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }


    // A button will call this function
    //
    function capturePhotoEdit() {
      // $('div.popover').hide();
      // OCULTA POPUP

      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 40, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }



    // A button will call this function
    //
    function getPhoto(source) {
      // $('div.popover').hide();
      // OCULTA POPUP
      // Retrieve image file location from specified source
    //   navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 45, allowEdit: true,
    //     destinationType: destinationType.FILE_URI,
    //     sourceType: source });




    navigator.camera.getPicture(uploadPhoto, onFail, { quality: 45, allowEdit: true,
        destinationType: destinationType.FILE_URI,
        sourceType: source });

    }



    // Called if something bad happens.
    //
    function onFail(message) {
      alert('Failed because: ' + message);
    }




//GUARDA FOTO EN LUGAR

    function getImage() {
      alert("QUE SUCEDE?");
            // Retrieve image file location from specified source
            navigator.camera.getPicture(uploadPhoto, function(message) {
      alert('get picture failed');


    },{
      quality: 45, 
      allowEdit: true,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType: navigator.camera.PictureSourceType.DATA_URL
    }
            );
 
        }
 
        function uploadPhoto(imageURI) {
      var largeImage = document.getElementById('smallImage');
      var menuImage = document.getElementById('menuImage');
      largeImage.src = imageURI;
      menuImage.src = imageURI;

          // alert(largeImage.src);

            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
 
            var params = new Object();
            params.value1 = "test";
            params.value2 = "param";
 
            options.params = params;
            options.chunkedMode = false;
 
            var ft = new FileTransfer();
            // ft.upload(imageURI, "http://192.168.0.6/td_backend_test/getphoto.php", win, fail, options);
            ft.upload(imageURI, "http://tremefa.com/td_crud/index.php/td_funciones/getfoto/"+localStorage.getItem("id_usr_doc"), win, fail, options);

            // http://localhost/td_crud/index.php/td_funciones/getfoto/2
        }



 
        function win(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            alert(r.response);
        }
 
        function fail(error) {
            alert("An error has occurred: Code = " = error.code);
        }



        // FUNCIONES DE CAMARA VIDEO------------------
        // Called when capture operation is finished
        //
        function captureSuccess(mediaFiles) {
            var i, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                uploadFile(mediaFiles[i]);
            }
        }

        // Called if something bad happens.
        //
        function captureError(error) {
            // var msg = 'intente nuevamente: ' + error.code;
            // navigator.notification.alert(msg, null, 'Video no capturado!');
        }

        // A button will call this function
        //
        function captureVideo() {
            // Launch device video recording application,
            // allowing user to capture up to 1 video clips  LIMIT

            // limit capture operation to 3 media files, no longer than 15 seconds each
            var options = { limit: 1, duration: 15 };

            navigator.device.capture.captureVideo(captureSuccess, captureError, options);
        }

        // Upload files to server
        function uploadFile(mediaFile) {
            var ft = new FileTransfer(),
                path = mediaFile.fullPath,
                name = mediaFile.name;
//GET VIDEO
            // ft.upload(path,
            //     "http://my.domain.com/upload.php",

                ft.upload(imageURI, "http://tremefa.com/td_crud/index.php/td_funciones/getfoto/"+localStorage.getItem("id_usr_doc"), win, fail, options);
                function(result) {
                    console.log('Upload success: ' + result.responseCode);
                    console.log(result.bytesSent + ' bytes sent');
                },
                function(error) {
                    console.log('Error uploading file ' + path + ': ' + error.code);
                },
                { fileName: name });
        }







