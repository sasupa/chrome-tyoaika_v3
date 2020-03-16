function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

class Timer {
  constructor(name, init, outInit, key) {
      this.name = name;
      this.x = init;
      this.startstop = init;
      this.sec = init;
      this.min = init;
      this.hour = init;
      this.secOut = outInit;
      this.minOut = outInit;
      this.hourOut = outInit;
      this.key = key;
  }

  timer() {
    this.secOut = checkTime(this.sec);
    this.minOut = checkTime(this.min);
    this.hourOut = checkTime(this.hour);
    this.sec++;
    
    if (this.sec == 60) {
      this.min++;
      this.sec = 0;
    }
  
    if (this.min == 60) {
      this.min = 0;
      this.hour++;
    }

    // TÄSSÄ REMINDERIN AJAN SÄÄTÖ
    if (this.min == 15) {
      clearInterval(this.x);
      var muikkari = confirm("Teetkö edelleen " + this.name + "?");
      if (muikkari) {
        this.start();
      } else {
        this.stop();
      }
    }

  }

  start() { /* Start */
    this.x = setInterval(this.timer.bind(this), 1000);
  };

  stop() { /* Stop */
    clearInterval(this.x);
  };

  reset() { /* Stop */
    clearInterval(this.x);
    this.startstop = 0;
    this.sec = 0;
    this.min = 0;
    this.hour = 0;
    this.secOut = checkTime(this.sec);
    this.minOut = checkTime(this.min);
    this.hourOut = checkTime(this.hour);
    chrome.storage.sync.set({[this.key]: false});
  };

  tallenna(tyo) { /* Tallenna */

    clearInterval(this.x);
    this.startstop = 0;
    var d = new Date();
    var month = 1 + d.getMonth();
    var date = d.getDate() + "." + month + "." + d.getUTCFullYear();
    var nyt = { tunnit: d.getHours(), minuutit: d.getMinutes() };
    var alkuMinuutit = (nyt.minuutit - this.min);
    var loppuMinuutit = nyt.minuutit;
    var alkuMinuutitOut = checkTime(alkuMinuutit);
    var loppuMinuutitOut = checkTime(loppuMinuutit);
    var alku = (nyt.tunnit - this.hour) + ":" + alkuMinuutitOut;
    var aika = this.hourOut + ":" + this.minOut + ":" + this.secOut;
    var loppu = nyt.tunnit + ":" + loppuMinuutitOut;
    var klo = alku + "-" + loppu;

    $.post(env.url, { name : env.user, kuva : tyo, asiakas : this.name, pvm : date, aika : aika, klo : klo, mo : month }, 
      function(returnedData) {
        var obj = JSON.parse(returnedData);
        console.log(obj.message);
    });

    this.sec = 0;
    this.min = 0;
    this.hour = 0;
    this.secOut = checkTime(this.sec);
    this.minOut = checkTime(this.min);
    this.hourOut = checkTime(this.hour);

    alert(this.name + ' laskuri nollattu ja tiedot lähetetty seurantaan!');
    chrome.storage.sync.set({[this.key]: false});

  }

  counter() { /* Toggle StartStop */
    this.startstop = this.startstop + 1;
  
    if (this.startstop === 1) {
      this.start();
      chrome.storage.sync.set({[this.key]: true});
    } else if (this.startstop === 2) {
      this.startstop = 0;
      this.stop();
      chrome.storage.sync.set({[this.key]: false});
    }
  }

}

let timers = [];
let i = 0;

// TÄSSÄ TEHDÄÄN PROJEKTIEN LASKURIT JA RENDAUSFILE STORAGEEN
for (let [key, value] of Object.entries(projects)) {
  timers[i] = new Timer(value, 0, "00", key);
  chrome.storage.sync.set({[key]: false});
  i++;
};

// TÄSSÄ API
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "refresh");
  port.onMessage.addListener(function(e) {

    if (e.msg == "Times") {
      // LÄHETETÄÄN AIKA
      for (let [key, value] of Object.entries(projects)) {
        var index = key.replace('project','');
        port.postMessage({[key]: timers[index-1].hourOut + ":" + timers[index-1].minOut + ":" + timers[index-1].secOut})
      };

      // OTETAAN VASTAAN KONTROLLIT
    } else if (e.msg.startsWith("start")) {
      var index = e.msg.replace('startproject','');
      timers[index-1].counter();

    } else if (e.msg.startsWith("stop")) {
      var index = e.msg.replace('stopproject','');
      timers[index-1].counter();

    } else if (e.msg.startsWith("reset")) {
      var index = e.msg.replace('resetproject','');
      var conf = confirm("Oletko varma? Tietoja ei ole tallennettu")
      conf ? timers[index-1].reset():
      null;

    } else if (e.msg.startsWith("log")) {
      desc = prompt("Mitä teit?");
      var index = e.msg.replace('logproject','');
      timers[index-1].tallenna(desc);
      

      // JOS JOKU ON RIKKI
    } else {
      alert("En osaa tulkita tätä, kokeile uudelleen")
    }
  });
});