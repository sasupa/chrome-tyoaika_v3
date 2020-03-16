// RENDATAAN PROJEKTIT AVATESSA
var x = 1;
for (let [key, value] of Object.entries(projects)) {
  var timeId = "time" + x;
  var row = $('<tr/>');
  var col1 = $('<td/>');
  var col2 = $('<td/>', { class : "className",});
  var col3 = $('<td/>', { class : "className",});
  var startButton =  $('<button/>', { class : "btn-success btn-sm", id : "Start", value : key, style : "display: none;"});
  var stopButton =  $('<button/>', { class : "btn-warning btn-sm", id : "Stop", value : key, style : "display: none;"});
  var resetButton =  $('<button/>', { class : "btn-danger btn-sm", id : "Reset", value : key});
  var tallennaButton =  $('<button/>', { class : "btn-info btn-sm", id : "Log", value : key});
  var span = $('<span/>', { id : timeId,})
  $(startButton).text("Aloita");
  $(stopButton).text("Tauko");
  $(resetButton).text("Reset");
  $(tallennaButton).text("Kirjaa");
  $(span).text("...");
  $("#projektit").append(row);
  $(row).append(col1, col2, col3);
  $(col1).text(value);
  $(col2).append(startButton, stopButton, resetButton, tallennaButton);
  $(col3).append(span)
  x++;
};

// RENDATAAN NAPIT AVATESSA
for (let [key, value] of Object.entries(projects)) {
  chrome.storage.sync.get(key, function(result) {
    for (let [key, value] of Object.entries(result)) {
      value ? $("button[id='Stop'][value='" + key + "']").show()
      : $("button[id='Start'][value='" + key + "']").show() ;
    }
  });
};

// AVATAAN KOMMUNIKAATIO BACKGROUND.JS KANSSA
var port = chrome.runtime.connect({name: "refresh"});
var refresh = setInterval(function () {
  port.postMessage({msg: "Times"})
}, 1000);

// RENDATAAN LISTENERIT:
// START
for (let [key, value] of Object.entries(projects)) {
  $("button[id='Start'][value='" + key +"']").click(function (e) {
    port.postMessage({msg: "start" + key});
    $("button[id='Start'][value='" + key + "']").hide();
    $("button[id='Stop'][value='" + key + "']").show();
  });
};

// STOP
for (let [key, value] of Object.entries(projects)) {
  $("button[id='Stop'][value='" + key +"']").click(function (e) {
    port.postMessage({msg: "stop" + key});
    $("button[id='Stop'][value='" + key + "']").hide();
    $("button[id='Start'][value='" + key + "']").show();
  });
};

// RESET
for (let [key, value] of Object.entries(projects)) {
  $("button[id='Reset'][value='" + key +"']").click(function (e) {
    port.postMessage({msg: "reset" + key});
    $("button[id='Stop'][value='" + key + "']").hide();
    $("button[id='Start'][value='" + key + "']").show();
  });
};

// TALLENNA
for (let [key, value] of Object.entries(projects)) {
  $("button[id='Log'][value='" + key +"']").click(function (e) {
    port.postMessage({msg: "log" + key});
    $("button[id='Stop'][value='" + key + "']").hide();
    $("button[id='Start'][value='" + key + "']").show();
  });
};

port.onMessage.addListener(function(msg) {

  // TÄSSÄ OTETAAN VASTAAN JA RENDATAAN AIKA BACKGROUND.JS:STÄ
  $('#time1').html(msg.project1);
  $('#time2').html(msg.project2);
  $('#time3').html(msg.project3);
  $('#time4').html(msg.project4);
  $('#time5').html(msg.project5);
  $('#time6').html(msg.project6);
  $('#time7').html(msg.project7);
  $('#time8').html(msg.project8);
  $('#time9').html(msg.project9);
  $('#time10').html(msg.project10);
  $('#time11').html(msg.project11);
  $('#time12').html(msg.project12);
  $('#time13').html(msg.project13);
  $('#time14').html(msg.project14);
  $('#time15').html(msg.project15);

});