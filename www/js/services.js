angular.module('starter.services', [])

.service('NewsService', function($http){
 return{
    selectedLocation:{}, 
    loadNews: function(tamcode){
        var rain30y ='http://202.29.52.232:8081/news/group74.xml';                    
        return $http.get(rain30y);
    }      
  }
})

.service('MapService', function($http){
  return{ 
    selectedLatlon:{}, 
    selectedParcel:{},
    //endPointUrl: 'http://localhost/myapi/news',
    //endPointUrl: alrMap,

    loadParcel: function(long, lat){
      var alrMap ='http://map.nu.ac.th/gs-alr2/alr/ows?service=WFS&version=1.0.0';
              alrMap += '&request=getfeature';
              alrMap += '&typename=alr:alr_parcel_query';
              alrMap += '&cql_filter=INTERSECTS(geom,POINT('+long+'%20'+lat+'))';
              alrMap += '&outputformat=application/json';                    
      return $http.get(alrMap);
    }

  }
})

.service('PlaceService', function($http) {
    return {
        getLocation: function(place,code) {
            var pdata = 'http://map.nu.ac.th/alr-map/api/index.php/location/'+place+'/'+code;
            return $http.get(pdata);
        },
        getProv: function() {
            var pdata = 'http://map.nu.ac.th/alr-map/api/index.php/prov';
            return $http.get(pdata);
        },
        getAmp: function(pcode) {
            var adata = 'http://map.nu.ac.th/alr-map/api/index.php/amp/' + pcode;
            return $http.get(adata);
        },
        getTam: function(acode) {
            var tdata = 'http://map.nu.ac.th/alr-map/api/index.php/tam/' + acode;
            return $http.get(tdata);
        },
        getVill: function(tcode) {
            var vdata = 'http://map.nu.ac.th/alr-map/api/index.php/vill/' + tcode;
            return $http.get(vdata);
        },
        getRawang: function(plang,rawang) {
            var pdata = 'http://map.nu.ac.th/alr-map/api/index.php/rawang/'+plang+'/'+rawang;
            return $http.get(pdata);
        }
    }
})

.service('ChartService', function($http){
  return{
    selectedLocation:{}, 
    selectedParcel:{},
    //endPointUrl: 'http://localhost/myapi/news',
    //endPointUrl: alrMap,
    loadRainNow: function(tamcode){
        var rainNow ='http://map.nu.ac.th/alr-map/api/rain_now/'+tamcode;                    
        return $http.get(rainNow);
    },
    loadRain30y: function(tamcode){
        var rain30y ='http://map.nu.ac.th/alr-map/api/rain30y/'+tamcode;                    
        return $http.get(rain30y);
    },
    loadEvap30y: function(tamcode){
        var evap30y ='http://map.nu.ac.th/alr-map/api/evap30y/'+tamcode;                    
        return $http.get(evap30y);
    },
    loadCWR: function(alrcode){
        var cwr ='http://map.nu.ac.th/alr-map/api/cwr/'+alrcode;                    
        return $http.get(cwr);
    },
    loadCWR2: function(alrcode){
        var cwr2 ='http://map.nu.ac.th/alr-map/api/cwr2/'+alrcode;                    
        return $http.get(cwr2);
    },
    loadCWR3: function(alrcode){
        var cwr3 ='http://map.nu.ac.th/alr-map/api/cwr3/'+alrcode;                    
        return $http.get(cwr3);
    }    
  }
})

.service('questService', function($http){
 return{
    selectedLocation:{}, 
    loadQuest: function(){
        var quest ='http://map.nu.ac.th/alr-map/api/question';                    
        return $http.get(quest);
    }, 
    loadCroptype: function(){
        var alrCWR ='http://map.nu.ac.th/alr-map/api/k';                    
        return $http.get(alrCWR);
    },
    loadMobileAns: function(alrcode){
        var alrMobileAns ='http://map.nu.ac.th/alr-map/api/alrMobileAns/'+alrcode;                    
        return $http.get(alrMobileAns);
    }      
  }
})

.service('questGapService', function($http){
 return{
    selectedLocation:{}, 
    loadQuest: function(){
        var quest ='http://map.nu.ac.th/alr-map/api/question_gap';                    
        return $http.get(quest);
    }      
  }
})







