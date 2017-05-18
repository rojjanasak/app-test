angular.module('starter.controllers', ['ngMap', 'chart.js', 'ngCordova'])

.controller('MapController', function($scope, NgMap, $state, MapService, PlaceService, $timeout, $rootScope) {

    var vm = this;
    NgMap.getMap().then(function(map) {
        vm.map = map;
    });

    $scope.init = function() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            //$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.data = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            //console.log($scope.data.lat + '-' + $scope.data.lng);
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };
    $scope.init();

    $scope.getCurrentLocation = function(event) {
        $scope.data = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        //MapService.selectedLatlon = $scope.data;
        $scope.loadParcel($scope.data.lng, $scope.data.lat);
    };

    //////// find by location   
    $scope.bClick = function(num) {
        $scope.var = num;
    }

    // get everything
        $scope.dat = {
        prov: '',
        amp: '',
        tam: '',
        vill: ''
    };
    
    $scope.getProv = function() {
        PlaceService.getProv()
            .then(function(response) {
                $scope.province = response.data;
            })
    };
    $scope.getProv();

    $scope.getAmp = function() {
        PlaceService.getAmp($scope.dat.prov)
            .then(function(response) {
                $scope.amphoe = response.data;
                $scope.tambon = [];
                $scope.village = [];
            });
        $scope.findLocation("province", $scope.dat.prov);        
    };

    $scope.getTam = function() {
        PlaceService.getTam($scope.dat.amp)
            .then(function(response) {
                $scope.tambon = response.data;
                $scope.village = [];
            });
        $scope.findLocation("amphoe", $scope.dat.amp);
    };

    $scope.getVill = function() {
        PlaceService.getVill($scope.dat.tam)
            .then(function(response) {
                $scope.village = response.data;
            })
            $scope.findLocation("tambon", $scope.dat.tam);
    };

    $scope.getVillLocation = function(){        
            $scope.findLocation("village", $scope.dat.vill);
    }
    
    $scope.findLocation = function(xplace, xcode){
        PlaceService.getLocation(xplace, xcode)
            .then(function(response) {
                $scope.data = {
                        lat: response.data[0].c_y,
                        lng: response.data[0].c_x
                    };                    
            })
       // $scope.init();
    }
   
   //////// find by rawang
   $scope.findRawang = function(xplang, xrawang){
        PlaceService.getRawang(xplang, xrawang)
            .then(function(response) {
                $scope.data = {
                        lat: response.data[0].c_y,
                        lng: response.data[0].c_x
                    };  
                 console.log(response.data[0].c_x);                  
            })
      
   }


    var alrlyr = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
            // Compose URL for overlay tile
            //vm.map = map;

            var s = Math.pow(2, zoom);
            var twidth = 256;
            var theight = 256;

            //latlng bounds of the 4 corners of the google tile
            //Note the coord passed in represents the top left hand (NW) corner of the tile.
            var gBl = vm.map.getProjection().fromPointToLatLng(
                new google.maps.Point(coord.x * twidth / s, (coord.y + 1) * theight / s)); // bottom left / SW
            var gTr = vm.map.getProjection().fromPointToLatLng(
                new google.maps.Point((coord.x + 1) * twidth / s, coord.y * theight / s)); // top right / NE

            // Bounding box coords for tile in WMS pre-1.3 format (x,y)
            var bbox = gBl.lng() + "," + gBl.lat() + "," + gTr.lng() + "," + gTr.lat();

            //base WMS URL
            var url = 'http://map.nu.ac.th/gs-alr2/alr/wms';


            url += "?service=WMS"; //WMS service
            url += "&version=1.1.0"; //WMS version 
            url += "&request=GetMap"; //WMS operation
            url += "&layers=alr:alr_parcel_query"; //WMS layers to draw
            url += "&styles="; //use default style
            url += "&format=image/png"; //image format
            url += "&TRANSPARENT=TRUE"; //only draw areas where we have data
            url += "&srs=EPSG:4326"; //projection WGS84
            url += "&bbox=" + bbox; //set bounding box for tile
            url += "&width=256"; //tile size used by google
            url += "&height=256";
            //url += "&tiled=true";
            //console.log(url)
            return url; //return WMS URL for the tile  
        }, //getTileURL

        tileSize: new google.maps.Size(256, 256),
        opacity: 0.85,
        isPng: true
    });

    $rootScope.imageMapType = alrlyr;

    $scope.loadParcel = function(lon, lat) {
        //console.log(da);
        MapService.loadParcel(lon, lat)
            .success(function(data) {
                //$scope.parcel = data.features[0].properties;
                $scope.alrcode = data.features[0].properties.alrcode;

                if ($scope.alrcode != null) {
                    console.log($scope.alrcode);

                    MapService.selectedParcel = data.features[0].properties;
                } else {
                    console.log('wang')
                }

            })
            .error(function(error) {
                console.error("yahoooo error");
            })
    };

    $scope.showDetail = function() {
        $timeout(function() {
            $state.go('tab.map-detail');
        }, 550);
    };

    $scope.showCWR = function() {
        $timeout(function() {
            $state.go('tab.map-cwr');
        }, 550);
    };

    $scope.showGMP = function() {
        $timeout(function() {
            $state.go('tab.map-gmp');
        }, 550);
    };

    $scope.showQuestion = function() {
        $timeout(function() {
            $state.go('tab.quest');
        }, 550);
    };

    $scope.showCWRchart = function() {
        $timeout(function() {
            $state.go('tab.map-cwrchart');
        }, 700);
    };


})

.controller('MapdetailController', function($scope, MapService) {
    $scope.mapData = MapService.selectedLatlon;
    $scope.pacelData = MapService.selectedParcel;
    $scope.parcel = $scope.pacelData;

})

.controller('CwrController', function($scope,
    MapService,
    //$http,
    //$state,
    //$timeout,
    $cordovaCamera,
    $cordovaFile,
    $cordovaFileTransfer,
    $cordovaDevice,
    $ionicPopup,
    $cordovaActionSheet
) {

    $scope.mapData = MapService.selectedLatlon;
    $scope.pacelData = MapService.selectedParcel;
    $scope.parcel = $scope.pacelData;

 /*
    $scope.data = {
        code: $scope.pacelData.alrcode,
        owner: "",
        ctype: "",
        rai: "",
        date: ""
    };

    var oriData = angular.copy($scope.data);

    $scope.resetForm = function() {
        $scope.data = angular.copy(oriData);
        $scope.dataForm.$setPristine();
    };

    $scope.isPersonChanged = function() {
        return !angular.equals($scope.data, oriData);
    };


    $scope.loadCWR = function() {
        MapService.loadCroptype()
            .success(function(data) {
                $scope.alrCWR = data;
                //console.log($scope.alrData[0].gid);            
            })
            .error(function(error) {
                console.error("error");
            })
    };
    $scope.loadCWR();


    $scope.sendMessage = function() {
        $http.post("http://map.nu.ac.th/alr-map/mobileInsert.php", $scope.data)
            .then(function(res) {
                console.log(res)
            });

        $scope.data = {
            code: $scope.pacelData.alrcode,
            owner: "",
            ctype: "",
            rai: "",
            date: ""
        };
    };


    $scope.showCWRchart = function() {
        $timeout(function() {
            $state.go('tab.map-cwrchart');
        }, 700);
    };
*/


    /// add camera
    $scope.image = null;

    $scope.showAlert = function(title, msg) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: msg
        });
    };

    $scope.loadImage = function() {
        var options = {
            title: 'Select Image Source',
            buttonLabels: ['Load from Library', 'Use Camera'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true,
        };
        $cordovaActionSheet.show(options).then(function(btnIndex) {
            var type = null;
            if (btnIndex === 1) {
                type = Camera.PictureSourceType.PHOTOLIBRARY;
            } else if (btnIndex === 2) {
                type = Camera.PictureSourceType.CAMERA;
            }
            if (type !== null) {
                $scope.selectPicture(type);
            }
        });
    };

    // Take image with the camera or from library and store it inside the app folder
    // Image will not be saved to users Library.
    $scope.selectPicture = function(sourceType) {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true //rotation picture
        };

        $cordovaCamera.getPicture(options).then(function(imagePath) {
                // Grab the file name of the photo in the temporary directory
                var currentName = imagePath.replace(/^.*[\\\/]/, '');

                //Create a new name for the photo
                var d = new Date(),
                    n = d.getTime(),
                    newFileName = n + ".jpg";

                // add img file   

                // If you are trying to load image from the gallery on Android we need special treatment!
                if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
                    window.FilePath.resolveNativePath(imagePath, function(entry) {
                        window.resolveLocalFileSystemURL(entry, success, fail);

                        function fail(e) {
                            console.error('Error: ', e);
                        }

                        function success(fileEntry) {
                            var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                            // Only copy because of access rights
                            $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success) {
                                $scope.image = newFileName;
                            }, function(error) {
                                $scope.showAlert('Error', error.exception);
                            });
                        };
                    });
                } else {
                    var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                    // Move the file to permanent storage
                    $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success) {
                        $scope.image = newFileName;
                    }, function(error) {
                        $scope.showAlert('Error', error.exception);
                    });
                }
            },
            function(err) {
                // Not always an error, maybe cancel was pressed...
            })
    };

    // Returns the local path inside the app for an image
    $scope.pathForImage = function(image) {
        if (image === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + image;
        }
    };

    $scope.uploadImage = function() {
        // Destination URL
        //var url = "http://202.29.52.232:8081/takeaphoto/upload.php";
        var url = "http://map.nu.ac.th/alr-map/takeaphoto/upload.php?alrcode=" + $scope.pacelData.alrcode;

        // File for Upload
        var targetPath = $scope.pathForImage($scope.image);

        // File name only
        var filename = $scope.image;;

        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename }
        };

        $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
            $scope.showAlert('Success', 'Image upload finished.');
        });
    }

})

.controller('CwrchartController', function($scope, $stateParams, MapService, ChartService, $timeout) {
    $scope.mapData = MapService.selectedLatlon;
    $scope.pacelData = MapService.selectedParcel;
    $scope.parcel = $scope.pacelData;

    $scope.tamcode = $scope.pacelData.tam_code;

    $scope.rainNowArr = [];
    $scope.rainNowLabel = [];

    $scope.rain30Arr = [];
    $scope.rain30Label = [];

    $scope.evap30Arr = [];
    $scope.evap30Label = [];

    $scope.chart2Dat = [];
    $scope.chart2Ser = [];

    $scope.loadMeteo = function(tamcode) {
        // load rain now
        ChartService.loadRainNow(tamcode)
            .success(function(data) {
                for (var prop in data[0]) {
                    for (var i = 1; i <= 52; i++) {
                        var w = 'w' + i;
                        if (prop == w) {
                            if (Number(data[0][prop]) >= 0) {
                                $scope.rainNowArr.push((Number(data[0][prop])).toFixed(2));
                                //console.log('ok');
                            } else {
                                $scope.rainNowArr.push(null);
                                //console.log('null')
                            }
                        }
                    }
                }
                $scope.chart2Dat.push($scope.rainNowArr);
                $scope.chart2Ser.push('น้ำฝนปัจจุบัน');
            })
            .error(function(error) {
                console.error("error");
            });
        // load rain 30y
        ChartService.loadRain30y(tamcode)
            .success(function(data) {
                for (var prop in data[0]) {
                    for (var i = 1; i <= 52; i++) {
                        var w = 'w' + i;
                        if (prop == w) {
                            $scope.rain30Label.push(prop);

                            if (Number(data[0][prop]) > 0) {
                                $scope.rain30Arr.push((Number(data[0][prop])).toFixed(2));
                                //console.log('ok');
                            } else {
                                $scope.rain30Arr.push(null);
                                //console.log('null')
                            }
                        }
                    }
                }
                $scope.chart2Dat.push($scope.rain30Arr);
                $scope.chart2Ser.push('น้ำฝนเฉลี่ย30ปี');
            })
            .error(function(error) {
                console.error("error");
            });
        // load evap
        ChartService.loadEvap30y(tamcode)
            .success(function(data) {
                for (var prop in data[0]) {
                    for (var i = 1; i <= 52; i++) {
                        var w = 'w' + i;
                        if (prop == w) {
                            //$scope.evap30Label.push(prop);  
                            if (Number(data[0][prop]) > 0) {
                                $scope.evap30Arr.push((Number(data[0][prop])).toFixed(2));
                                //console.log('ok');
                            } else {
                                $scope.evap30Arr.push(null);
                                //console.log('null')
                            }
                        }
                    }
                }

                $scope.chart2Dat.push($scope.evap30Arr);
                $scope.chart2Ser.push('การระเหยเฉลี่ย30ปี');
            })
            .error(function(error) {
                console.error("error");
            });
    };

    $scope.alrcode = $scope.pacelData.alrcode;
    $scope.cwrArr = [];
    $scope.cwr2Arr = [];
    $scope.cwr3Arr = [];

    $scope.loadCWR = function(alrcode) {
        ChartService.loadCWR(alrcode)
            .success(function(data) {
                for (var prop in data[0]) {
                    for (var i = 1; i <= 52; i++) {

                        $scope.cwrType = data[0].crop_type;

                        var w = 'w' + i;
                        if (prop == w) {
                            //$scope.cwrLabel.push(prop);
                            //$scope.cwrArr.push(Number(data[0][prop]));
                            if (Number(data[0][prop]) > 0) {
                                $scope.cwrArr.push((Number(data[0][prop])).toFixed(2));
                                //console.log('ok');
                            } else {
                                $scope.cwrArr.push(null);
                                //console.log('null')
                            }
                        }
                    }
                }
                $scope.chart2Dat.push($scope.cwrArr);
                $scope.chart2Ser.push($scope.cwrType);
            })
            .error(function(error) {
                console.error("error");
            });
        // load evap

        ChartService.loadCWR2(alrcode)
            .success(function(data) {
                for (var prop in data[0]) {
                    for (var i = 1; i <= 52; i++) {

                        $scope.cwr2Type = data[0].crop_type;

                        var w = 'w' + i;
                        if (prop == w) {
                            //$scope.cwrLabel.push(prop);
                            //$scope.cwrArr.push(Number(data[0][prop]));
                            if (Number(data[0][prop]) > 0) {
                                $scope.cwr2Arr.push((Number(data[0][prop])).toFixed(2));
                                //console.log('ok');
                            } else {
                                $scope.cwr2Arr.push(null);
                                //console.log('null')
                            }
                        }
                    }
                }
                $scope.chart2Dat.push($scope.cwr2Arr);
                $scope.chart2Ser.push($scope.cwr2Type);
            })
            .error(function(error) {
                console.error("error");
            });
        // load evap

        ChartService.loadCWR3(alrcode)
            .success(function(data) {
                for (var prop in data[0]) {
                    for (var i = 1; i <= 52; i++) {

                        //if(data[0].crop_type != null){
                        $scope.cwr3Type = data[0].crop_type;
                        //}

                        var w = 'w' + i;
                        if (prop == w) {
                            if (Number(data[0][prop]) > 0) {
                                $scope.cwr3Arr.push((Number(data[0][prop])).toFixed(2));
                                //console.log('ok');
                            } else {
                                $scope.cwr3Arr.push(null);
                                //console.log('null')
                            }
                        }
                    }
                }
                $scope.chart2Dat.push($scope.cwr3Arr);
                $scope.chart2Ser.push($scope.cwr3Type);
            })
            .error(function(error) {
                console.error("error");
            });
        // load evap
    };

    $scope.loadCWR($scope.alrcode);
    $scope.loadMeteo($scope.tamcode);
    //console.log($scope.cwr3Type);
    // chart 1

    $scope.chart1Labels = $scope.rain30Label;
    $scope.chart1Series = ['ฝนเฉลี่ย 30ปี', 'ระเหยเฉลี่ย 30ปี'];
    $scope.chart1Data = [$scope.rain30Arr, $scope.evap30Arr];

    // chart 2

    $scope.chart2Labels = $scope.rain30Label;
    //$scope.chart2Series = ['พืชชนิดที่ 1', 'พืชชนิดที่ 2', 'พืชชนิดที่ 3', 'น้ำฝนปัจจุบัน', 'ฝนเฉลี่ย 30ปี'];
    //$scope.chart2Data = [$scope.cwrArr, $scope.cwr2Arr, $scope.cwr3Arr, $scope.rainNowArr, $scope.rain30Arr]
    $scope.chart2Data = $scope.chart2Dat;
    $scope.chart2Series = $scope.chart2Ser;

    $scope.onClick = function(points, evt) {
        console.log(points, evt);
    };

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B', 'Series c', 'Series d'];
    $scope.data = [
        [65, 59, 80, null, null, 55, 40],
        [28, 48, 40, 19, 86, 27, 90],
        [18, 28, 50, 29, 46, 37, 40],
        [68, 88, 40, 69, 26, 37, 70]
    ];
})

.controller('GmpController', function($scope, $stateParams, MapService, $http) {
    $scope.mapData = MapService.selectedLocation;
    $scope.pacelData = MapService.selectedParcel;
    $scope.parcel = $scope.pacelData;


})

.controller('GmpQuestionController', function($scope, $stateParams, MapService, questGapService) {
    $scope.mapData = MapService.selectedLatlon;
    $scope.pacelData = MapService.selectedParcel;
    $scope.parcel = $scope.pacelData;

    $scope.loadQuest = function() {
        //console.log(da);
        questGapService.loadQuest()
            .success(function(data) {
                //$scope.parcel = data.features[0].properties;
                $scope.q = data;
            })
            .error(function(error) {
                console.error("error");
            })
    };
    $scope.loadQuest();

    $scope.data = { alrcode: $scope.pacelData.alrcode };

    $scope.sendMessage = function() {
        var link = 'http://map.nu.ac.th/alr-map/mobileInsertGap.php';
        //$http.post(link, {username : $scope.data.farmer_fname})
        $http.post(link, $scope.data)
            .then(function(res) {
                $scope.response = res.data;

                delete $scope.data;
            });
    };

    var oriData = angular.copy($scope.data);
    $scope.isPersonChanged = function() {
        return !angular.equals($scope.data, oriData);
    };

    $scope.progressval = 10;

})

.controller('questionController', function($scope, $stateParams, MapService) {
    $scope.mapData = MapService.selectedLatlon;
    $scope.pacelData = MapService.selectedParcel;
    $scope.parcel = $scope.pacelData;
})


.controller('questionMobileController', function($scope, $stateParams, questService, MapService, $http) {
    $scope.mapData = MapService.selectedLatlon;
    $scope.pacelData = MapService.selectedParcel;
    $scope.parcel = $scope.pacelData;

    $scope.loadQuest = function() {
        //console.log(da);
        questService.loadQuest()
            .success(function(data) {
                //$scope.parcel = data.features[0].properties;
                $scope.q = data;
            })
            .error(function(error) {
                console.error("error");
            })
    };
    $scope.loadQuest();

    $scope.loadCWR = function() {
        questService.loadCroptype()
            .success(function(data) {
                $scope.alrCWR = data;
                //console.log($scope.alrData[0].gid);            
            })
            .error(function(error) {
                console.error("error");
            })
    };
    $scope.loadCWR();

    $scope.loadMobileAns = function() {
        questService.loadMobileAns()
            .success(function(data) {
                $scope.alrMobileAns = data;
                //console.log($scope.alrData[0].gid);            
            })
            .error(function(error) {
                console.error("error");
            })
    };
    $scope.loadMobileAns($scope.pacelData.alrcode);

    $scope.data = { alrcode: $scope.pacelData.alrcode };
    $scope.sendMessage = function() {
        var link = 'http://map.nu.ac.th/alr-map/mobileInsertOuestion.php';
        //var link = 'http://localhost/alr-map/mobileInsertOuestion.php';
        //$http.post(link, {username : $scope.data.farmer_fname})
        $http.post(link, $scope.data)
            .then(function(res) {
                $scope.response = res.data;

                delete $scope.data;
            });
    };

    var oriData = angular.copy($scope.data);
    $scope.isPersonChanged = function() {
        return !angular.equals($scope.data, oriData);
    };

    $scope.progressval = 10;
});
