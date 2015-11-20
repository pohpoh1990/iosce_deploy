app.service('fileUpload', ['$http', '$q', '$location',
function ($http, $q, $location) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var q = $q.defer();
        var fd = new FormData();
        for (var key in file) {
            fd.append('files', file[key]);
        }
        console.log(fd);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
        })
        .success(function(response){
            console.log(response);
            q.resolve(response);
        })
        return q.promise
    }

    this.postDB = function(filename, position, markschemeid, markscheme, title, brief, author){
        var j = 0;
        var filenameArray = filename.map(function(e) { return e.filename; });
        for (var i=0; i<position.length; i++){
            if (position[i]){
                var idx = filenameArray.indexOf(position[i]);
                position[i] = filename[idx];
            }
        };

        $http.post('/examcases/'+markschemeid, {
            title: title,
            file: position,
            brief: brief,
            markscheme: markscheme,
            author: author
        })
        .success(function(response){
            console.log(response);
            $location.url('/markscheme/'+markschemeid);
        })
    }
}]);