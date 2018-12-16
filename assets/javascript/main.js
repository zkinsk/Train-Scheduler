// config firebase
  var config = {
    apiKey: "AIzaSyB-_W_fbb-kLziQbc-fBwtSYOdOfb8pFpE",
    authDomain: "train-30be2.firebaseapp.com",
    databaseURL: "https://train-30be2.firebaseio.com",
    projectId: "train-30be2",
    storageBucket: "train-30be2.appspot.com",
    messagingSenderId: "434472645365"
  };
  firebase.initializeApp(config);
  var database = firebase.database();


function buttonClick() {
    $("button[type = 'submit']").click(function (event) {
        event.preventDefault();
        console.log("click");
        let trainName = $("#trainName").val().trim();
        let trainDest = $("#trainDest").val().trim();
        let startTime = $("#startTime").val().trim();
        let trainFreq = $("#trainFreq").val().trim();
        console.log(trainName);
        $(".tF").val("");

        database.ref().push({
            trainNameDB: trainName,
            trainDestDB: trainDest,
            startTimeDB: startTime,
            trainFreqDB: trainFreq,
        });
    })

    $("button[type = 'clear']").click(function (event) {
        event.preventDefault();
        database.ref().set({});
        $("td").remove();
    });

};

function trainDBWatcher(){
    database.ref().on("child_added", function(newTD){
        updateTrainData(newTD)
    })
}

function updateTrainData(newTD){
    let d = new Date();
    let currentTime = 60*(parseInt(d.getHours())) + (parseInt(d.getMinutes()));

    let startTime = newTD.val().startTimeDB
    let x = startTime.split(":")
    let y = (60*(parseInt(x[0]))) + parseInt(x[1])

    let diff = currentTime - y;
    let trainFreq = (newTD.val().trainFreqDB);
    let minTil = ((Math.ceil(diff/trainFreq))*trainFreq)-diff
    console.log (currentTime, minTil)

    let timeNext = timeConvert(currentTime + minTil)

    let trainNameTD = $("<td>").text(newTD.val().trainNameDB)
    let trainDestTD = $("<td>").text(newTD.val().trainDestDB);
    let trainFreqTD = $("<td>").text(newTD.val().trainFreqDB);
    let timeNextTD = $("<td>").text(timeNext);
    let minTillTD = $("<td>").text(minTil);

    let tbRow = $("<tr>")
    tbRow.append(trainNameTD, trainDestTD, trainFreqTD, timeNextTD, minTillTD )
    $("table").append(tbRow);
}

var timeConvert = function(n){
    var minutes = n%60
    var hours = (n - minutes) / 60
    // if (hours > 12){
    //     hours = hours - 12;
    //     minutes = minutes + " pm"
    // }else {
    //     minutes = minutes + " am"
    // }
    var time = (hours + ":" + minutes)
    return time;
   }




$(document).ready(function(){
    buttonClick();
    trainDBWatcher();


})
