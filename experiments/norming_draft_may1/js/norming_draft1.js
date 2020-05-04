function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.reqs = slide({
    name : "reqs",
    start: function() {
      $(".err").hide();
    },
    button : function() {
      if (document.getElementById("american_check").checked == false) {
      //if ($('input[name="american_check"]:checked').val() == undefined) {
        $(".err").show();
      } else {
      exp.go(); //make sure this is at the *end*, after you log your data
      }
    }
  });

  slides.irb_info = slide({
     name : "irb_info",
     button: function() {
      exp.go();
     }
  });

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
      document.getElementById('reminder').innerHTML = reminder + " is an American male.";
      document.getElementById('output').innerHTML = story;

      this.init_sliders();
      
      //erase current slider value
      exp.sliderPost = null;
    },

    button : function() {
      if (exp.sliderPost == null) {
        $(".err").show();
      } else {
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
        "first": this.stim.first,
        "story": this.stim.story,
        "scale": scales[this.stim.scaleType],
        "+/-": this.stim.tag,
      });
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        affiliation : $("affiliation").val(),
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

  exp.nTrials = 10;

  exp.stims = [];
  //var labels = _.shuffle(predicates);
  //var 

  for (var i=0; i<exp.nTrials; i++) {
    var f;
    f = {
      first: _.shuffle(firsts)[i],
      //scale: _.shuffle(scales)[i]
    }
    exp.stims.push(
      _.extend(stories[i], f)
    )
  };


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
    "i0", 
    "reqs",
    "irb_info",
    "instructions",
    "main_task",
    // "single_trial",
    // "one_slider",
    // "multi_slider",
    // "vertical_sliders",
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
