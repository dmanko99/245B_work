function make_slides(f) {
  var   slides = {};

  //setting up the slide stopwatches/timers
  var h1 = document.getElementsByTagName('h1')[0],
    start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    clear = document.getElementById('clear'),
    tenths = 0,
    seconds = 0,
    minutes = 0,
    t;

  function add() {
    tenths++;
    if (tenths >= 100) {
      tenths = 0;
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }
    }

    h1.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds) + ":" + (tenths > 9 ? tenths : "0" + tenths);

    timer();
  }

  function timer() {
    t = setTimeout(add, 10);
  }
  timer();

  slides.bot = slide({
    name : "bot",
    start: function() {
      $('.err1').hide();
      $('.err2').hide();
      $('.disq').hide();
      exp.speaker = _.shuffle(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"])[0];
      exp.listener = _.shuffle(["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Margaret"])[0];
      exp.lives = 0;
      var story = exp.speaker + ' says to ' + exp.listener + ': "It\'s a beautiful day, isn\'t it?"'
      var question = 'Who does ' + exp.speaker + ' talk to?';
      document.getElementById("s").innerHTML = story;
      document.getElementById("q").innerHTML = question;
    },
    button : function() {
      exp.text_input = document.getElementById("text_box").value;
      var lower = exp.listener.toLowerCase();

      if ((exp.lives < 3) && ((exp.text_input.toLowerCase() == lower))){
        exp.data_trials.push({
          "slide_number": exp.phase,
          "slide_type" : "bot_check",
          "image" : exp.listener,
          "audio" : "",
          "response" : [0,exp.text_input]
        });
        exp.go();
      }
      else {
        exp.data_trials.push({
          "slide_number": exp.phase,
          "slide_type" : "bot_check",
          "image" : exp.listener,
          "audio" : "",
          "response" : [0,exp.text_input]
        });
        if (exp.lives == 0){
          $('.err1').show();
        }if (exp.lives == 1){
          $('.err1').hide();
          $('.err2').show();
        }if (exp.lives == 2){
          $('.err2').hide();
          $('.disq').show();
          $('.button').hide();
        }
        exp.lives++;
      }   
    },
  });

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  // slides.reqs = slide({
  //   name : "reqs",
  //   start: function() {
  //     $(".err").hide();
  //   },
  //   button : function() {
  //     if (document.getElementById("american_check").checked == false) {
  //     //if ($('input[name="american_check"]:checked').val() == undefined) {
  //       $(".err").show();
  //     } else {
  //     exp.go(); //make sure this is at the *end*, after you log your data
  //     }
  //   }
  // });

  // slides.irb_info = slide({
  //    name : "irb_info",
  //    button: function() {
  //     exp.go();
  //    }
  // });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.main_task = slide({
    name: "main_task",

    present : exp.stims,

    present_handle : function(stim) {
      var prompt, utt;
      //a bunch of stuff goes here!!!

      // "uncheck" radio buttons
      $('input[name="speaker"]').prop('checked', false);

      // hide error message
      $(".err").hide();

      // show "data"
      $(".data").show();

      // get index number of trial
      this.trialNum = exp.stimscopy.indexOf(stim);

      // record trial start time
      this.startTime = Date.now();

      // storing this info in the slide so I can record it later?
      this.stim = stim; 

      // replace NAME from stimuli
      var reminder = stim.first;
      var story = replaceTerms(this.stim, "storyline")

      //display story-dependent fields
      if(stim.stimType != "exclusion") {
        //if male
        document.getElementById('reminder').innerHTML = reminder + " is an American man.";
        //if female
        // document.getElementById('reminder').innerHTML = reminder + " is an American woman.";
      } else {
        document.getElementById('reminder').innerHTML = "";
      }
      document.getElementById('output').innerHTML = story;

      this.init_sliders();
      
      //erase current slider value
      exp.sliderPost = null;

      //reset slide timer
      h1.textContent = "00:00:00";
        tenths = 0;
        seconds = 0;
        minutes = 0;
        hours = 0;
    },

    button : function() {
      if (exp.sliderPost == null) {
        $(".err").show();
      } else {
        this.finishTime = Date.now();
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_num": this.trialNum,
        "response" : exp.sliderPost,
        "seconds_elapsed" : (this.finishTime - this.startTime) / 1000,
        "first": this.stim.first,
        "story": this.stim.story,
        "scale": scales[this.stim.scaleType],
        "tag": this.stim.tag,
        "list" : exp.currentList,
        "type" : this.stim.stimType
      });
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      var raceData = new Array();
      var raceQs = document.getElementById("checkboxes");
      var chks = raceQs.getElementsByTagName("INPUT");
      for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked) {
          raceData.push(chks[i].value);
        }
      };

      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        affiliation : $("#affiliation").val(),
        race : raceData.join(", "),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];

  // actually there are 24 trials, but 20 require FIRST-replacement
  exp.nTrials = 20;

  exp.stims = [];
  //var labels = _.shuffle(predicates);
  //var 

  // determine what list to serve to participant
  exp.currentList = _.shuffle([1,2,3])[0]

  // filter criticals by list
  var listCriticals = criticalsM.filter(function (stim) { //for male names
  //var listCriticals = criticalsF.filter(function (stim) { //for male names
  return stim.list == exp.currentList
  });

  // stories are the critical items for the list, plus fillers
  // vacuous call to filter just converts json to javascript object
  var stories = listCriticals.concat(fillersM.filter( //for male names
  // var stories = listCriticals.concat(fillersF.filter( //for female names
    function() { return true } ))

  exp.stories = stories

  for (var i=0; i<exp.nTrials; i++) { //male names
    var f;
    f = {
      first: firsts[i],
      //scale: _.shuffle(scales)[i]
    }
    exp.stims.push(
      _.extend(stories[i], f)
    )
  };

  // for (var i=0; i<exp.nTrials; i++) { //female names
  //     var f;
  //     f = {
  //       first: firstsF[i],
  //       //scale: _.shuffle(scales)[i]
  //     }
  //     exp.stims.push(
  //       _.extend(stories[i], f)
  //     )
  //   };
      

  // add exclusion stims
  exp.stims = exp.stims.concat(exclusions.filter(function() { return true } ))

  exp.stims = _.shuffle(exp.stims);

  exp.stimscopy = exp.stims.slice(0);

  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };

  //blocks of the experiment:
  exp.structure=[
    "bot",
    "i0", 
    // "reqs",
    "instructions",
    "main_task",
    "subj_info",
    "thanks"
  ];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
