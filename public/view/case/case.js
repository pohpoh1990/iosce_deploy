app.controller('CaseController', ["$scope", "$rootScope", "$timeout", "CaselistFactory", "PeerlistFactory", "$routeParams", "$uibModal",
function($scope, $rootScope, $timeout, CaselistFactory, PeerlistFactory, $routeParams, $uibModal){

	var startcountdown, countdown, audio, filepath

	$scope.imgfiletype = [];
	$scope.audiofiletype = [];
	//$scope.commsfeedback = [];

	if($routeParams.id){
		CaselistFactory.getMarkscheme($routeParams.id).then(
			function(markscheme){
				$scope.markscheme = markscheme;
			}
		)
	}

	if($routeParams.caseid==0){
		$scope.onecase = null;
	} else {
		CaselistFactory.getCase($routeParams.caseid).then(
			function(onecase){
				$scope.onecase = onecase;

				for (var i=0; i<onecase.file.length; i++){
					if (isImage(onecase.file[i].contentType)){
						$scope.imgfiletype[i] = true;
						$scope.audiofiletype[i] = false;
					}else if (isAudio(onecase.file[i].contentType)){
						$scope.imgfiletype[i] = false;
						$scope.audiofiletype[i] = true;
					}else {
						$scope.imgfiletype[i] = false;
						$scope.audiofiletype[i] = false;
					}
				}
				//console.log("imgfiletype: "+$scope.imgfiletype)
				//console.log("audiofiletype: "+$scope.audiofiletype)
			}
		)
	}

	var iterNum = 0;
	var peerInterval = setInterval(getPeerLoginCheck, 200)

	function getPeerLoginCheck(){
		iterNum ++;
		if ($rootScope.currentUser){
			PeerlistFactory.getPeers().then(
				function(peers){
					$scope.peers = peers;
				}
			);
			clearInterval(peerInterval);
		} else if (iterNum >10){
			console.log("Please log in to search peers!");
			clearInterval(peerInterval);
		}
	}



	$scope.playAudio = function(index){
		if (filepath == "upload/"+$scope.onecase.file[index]._id){
			audio.play();
		} else {
			filepath = "upload/"+$scope.onecase.file[index]._id;
			var ext = $scope.onecase.file[index].filename.split('.').pop();
			//console.log("Ext: "+ext);
			//console.log("Audio: " +filepath)
			audio = new Howl({
			  urls: [filepath],
			  format: ext,
			  onend: function() {
			      console.log('Finished!');
			  },
			  onloaderror: function() {
			      console.log('Error!');
			  }
			}).play();
			/*
			audio = new Audio(filepath);
			audio.play();*/
		}
		$scope.audioPlaying = true;
	}

	$scope.pauseAudio = function(){
		if ($scope.audioPlaying){
			audio.pause();
		}
	}

	$scope.setModal = function(index){
		$scope.modal = {};
		$scope.modal.file = $scope.onecase.file[index]._id;
		$scope.modal.brief = $scope.onecase.brief[index];
		$scope.modal.markscheme = $scope.markscheme.markscheme[index];
		openCaseModal($scope.modal.markscheme, $scope.modal.brief, $scope.modal.file);
	}

	$scope.addTick = function(index){
		if (!$scope.marks){
			$scope.marks=[];
			$scope.marks[index] = true;
		} else {
			if (!$scope.marks[index]){
				$scope.marks[index] = true;
			} else {$scope.marks[index] = ''};
		}
		//console.log($scope.marks);
	}

	$scope.setPatientScore = function(score){
		$scope.patientscore = score;			
	}

	$scope.setExaminerScore = function(score){
		$scope.examinerscore = score;	
	}

	$scope.submit = function(){
		$scope.errorMessage = null;
		console.log($rootScope.currentUser.caseDone.indexOf($routeParams.caseid))
		if ($scope.peerSelected && $scope.onecase && $rootScope.currentUser.caseDone.indexOf($routeParams.caseid)<0){
			//Show rating modal
			openRatingModal();
		};

		if ($scope.onecase){
			onecaseTitle = $scope.onecase.title;
		} else {onecaseTitle = "Empty Case"};

		if(!$rootScope.currentUser){
			//Popup log in
		} else if (!$scope.peerSelected) {
			$scope.errorMessage = "Please tell us who you are marking!"
		} else {
			var myid = $rootScope.currentUser._id;
			var caseid = $routeParams.caseid;
			var peerid = $scope.peerSelected._id
			var result = {
				studentid: peerid,
				markerid: myid,
				caseid: caseid,
				markscheme: {
					title: $scope.markscheme.title, 
					markscheme: $scope.markscheme.markscheme
				},
				casetitle: onecaseTitle,
				result: $scope.marks,
				patientscore: $scope.patientscore,
				examinerscore: $scope.examinerscore,
				commsfeedback: $scope.commsfeedback
			};

			PeerlistFactory.sendresult(result, myid);
		}
	}

	$scope.back = function(){
		window.history.back()
	}

	$scope.startTimer = function(){
		if ($scope.warning && $scope.duration){
			var warning = $scope.warning;
			var duration = $scope.duration;
			var audioStartStation = new Audio('/media/beginstation.mp3');
			audioStartStation.play();
			$scope.timerstarted = true;
			countdown = {
				minute: duration, 
				second: 0
			};
			startcountdown = setInterval(function(){
				countdown = myTimer(countdown, duration, warning, audioStartStation);
 				$scope.timer = checkTime(countdown);

				$scope.$apply();
			}, 1000)

			$scope.timingmessage = "Begin "+duration+"-minute-station";
		};
	};

	$scope.stopTimer = function(){
		$scope.timerstarted = false;
		clearInterval(startcountdown);
	}

	var openRatingModal = function(){
		var RatingModalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: '/view/template/RatingModal.html',
		 // size: ,
		  controller: 'RatingModalController',
		  resolve: {
		  	variables: function(){
		  		return {
		  			caseid: $routeParams.caseid, 
		  			myid: $rootScope.currentUser._id
		  		}
		  	}
		  }
		})
	};

	var openCaseModal = function(markscheme, brief, file){
		var CaseModalInstance = $uibModal.open({
			 animation: $scope.animationsEnabled,
			 templateUrl: '/view/template/CaseModal.html',
			// size: ,
			 controller: 'CaseModalController',
			 resolve: {
			 	variables: function(){
			 		return {
			 			markscheme: markscheme,
			 			brief: brief,
			 			file: file
			 		}
			 	}
			 }
		})
	}

	var myTimer = function(varcountdown, duration, warning, audioStartStation){

		if (!varcountdown){
			varcountdown.minute = duration.minute-1;
			varcountdown.second = 59;
		} else {
			var minute = varcountdown.minute;
			var second = varcountdown.second;
			if (minute==0 && second ==0){
				$scope.timingmessage = "End of station";
				$scope.startStation = false;
				audioStartStation.play();
				clearInterval(startcountdown);
			} else if (varcountdown.minute == warning && varcountdown.second==0) {
				$scope.timingmessage = warning+" minute remaining";
				audioStartStation.play();
				varcountdown.minute = varcountdown.minute-1;
				varcountdown.second = 59;
			} else if (second == 0){
				varcountdown.minute = varcountdown.minute-1;
				varcountdown.second = 59;
			} else {
				varcountdown.second = varcountdown.second-1;
			}
		}
		//console.log("Timer: "+varcountdown.minute+":"+varcountdown.second);
		return varcountdown
	}

}])

var isImage = function(str) { 
		var pattern = /image/g
	    return pattern.test(str);
}

var isAudio = function(str) { 
	var pattern = /audio/g
    return pattern.test(str);
}

var checkTime = function(j){
	var modified = j
	if (j.minute<10 && j.minute[0] != 0){
		modified.minute = "0"+j.minute
	};
	if (j.second<10 && j.second[0] != 0){
		modified.second = "0"+j.second
	};
	return modified
}