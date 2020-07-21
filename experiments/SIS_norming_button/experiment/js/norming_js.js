function make_slides(f) {
	var   slides = {};

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
			var upper = exp.listener.toUpperCase();

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

	slides.instructions = slide({
		name : "instructions",
		start: function(){
			$('.math_reminder').hide();
			$('.tut_key_instructions').hide();

			document.onkeydown = checkKey;
			function checkKey(e) {
				e = e || window.event;
				if (($('.tut_instructions').is(":visible")) && (e.keyCode == 32)) {
					e = 0;
					$('.tut_instructions').hide();
					$('.math_reminder').show();
				}
				if (($('.math_reminder').is(":visible")) && (e.keyCode == 32)) {
					e = 0;
					$('.math_reminder').hide();
					$('.tut_key_instructions').show();
				}
				if (($('.tut_key_instructions').is(":visible")) && (e.keyCode == 32)) {
					exp.go();
				}
			}
		},
	});
	
	slides.before_practice = slide({
		name : "before_practice",
		start : function() {
			document.onkeydown = checkKey;
			function checkKey(e) {
				e = e || window.event;
				if (e.keyCode == 32) 
					exp.go();
			}
		}
	});

	slides.practice = slide({
		name : "practice",

		present: exp.practice, 

		present_handle : function(stim) {                                                         
			var prompt, utt;
			exp.practicestartTime = 0;
			
			// storing this info in the slide
      this.stim = stim;

      // record trial start time
      this.practicestartTime = Date.now();

      // replace NAME from stimuli
      var reminder = "Brandon";
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

			$('.practiceQ').show();
			$('.critical_stop').hide();
			//$('.transition').hide();
			$('.transitionNo').hide();
			$('.transitionYes').hide();
			$('.transition_late_practice').hide();
			// $('.reminder').show();
			// $('.prompt').show();
			// $('.output').show();

			exp.practicestartTime = Date.now();

			function showPractice() {
				exp.keyCode = "Late";
					exp.responseTime = Date.now()-exp.practicestartTime;
					(document.getElementById("critical_stop")).play();
					console.log("Late: " + exp.responseTime);
					// $('.reminder').hide();
					// $('.prompt').hide();
					// $('.output').hide();
					$('.practiceQ').hide();
					//$('.transition').show();
					$('.transition_late_practice').show();
			}

			var go_practice = setTimeout(showPractice, 8000);
			go_practice;
			
			document.onkeydown = checkKey;

			function checkKey(e) {
				e = e || window.event;
				if ((e.keyCode == 70 || e.keyCode == 74)) {
					exp.responseTime = Date.now()-exp.practicestartTime;
					if(e.keyCode == 74) {
						exp.keyCode = 1;
						$('.practiceQ').hide();
						$('.transitionYes').show();
					}
					if(e.keyCode == 70) {
						exp.keyCode = 0;   
						$('.practiceQ').hide();
						$('.transitionNo').show();
					}
					//$('.practiceQ').hide();
					// $('.reminder').hide();
					// $('.prompt').hide();
					// $('.output').hide();
					//$('.transition').show();
					clearTimeout(go_practice);
				} 

				if ((($('.transitionYes').is(":visible")) ||
					($('.transitionNo').is(":visible")) ||
					($('.transition_late_practice').is(":visible"))) 
					&& (e.keyCode == 32)) {
					_s.button();
				}
			}
		},

		button : function() {
			this.practicefinishTime = Date.now();
			this.log_responses();
			_stream.apply(this);
		},

		log_responses : function() {
			exp.data_trials.push({
					"trial_num": "practice",
					"response" : exp.keyCode,
					"seconds_elapsed" : exp.responseTime / 1000,
					"first" : "Brandon",
					"scale" : "practice",
					"tag" : "practice",
					"list" : "practice",
					"type" : "practice"
					
			});
		}
	});

	slides.before_trial = slide({
		name : "before_trial",
		start : function() {
			document.onkeydown = checkKey;
			function checkKey(e) {
				e = e || window.event;
				if (e.keyCode == 32) 
					exp.go();
			}
		}
	});

	slides.main_task = slide({
		name : "main_task",

		present: exp.stims,

		present_handle : function(stim){
			var prompt, utt;

			exp.test_start = 0;

			// storing this info in the slide so I can record it later?
      this.stim = stim; 

			// get index number of trial
      this.trialNum = exp.stimscopy.indexOf(stim);

      // record trial start time
      this.startTime = Date.now();


      // replace NAME from stimuli
      var reminder = stim.first;
      var story = replaceTerms(this.stim, "storyline")

      //display story-dependent fields
      if(stim.stimType != "exclusion") {
        //if male
        document.getElementById('reminder_main').innerHTML = reminder + " is an American man.";
        //if female
        // document.getElementById('reminder_main').innerHTML = reminder_main + " is an American woman.";
      } else {
        document.getElementById('reminder_main').innerHTML = "";
      }
      document.getElementById('output_main').innerHTML = story;

      $('.mainQ').show();
			$('.critical_stop').hide();
			$('.transition1').hide();
			$('.transition_late').hide();

			exp.test_start = Date.now();

      function showTrial() {
      	exp.keyCode = "Late";
      	exp.responseTime = Date.now()-exp.test_start;
      	(document.getElementById("critical_stop")).play();
      	console.log("Late: " + exp.responseTime);
      	$('.mainQ').hide();
      	$('.transition_late').show();
      }

      var go = setTimeout(showTrial, 8000);
      go;   	
      
      document.onkeydown = checkKey;

			function checkKey(e) {
				e = e || window.event;
				if ((e.keyCode == 70 || e.keyCode == 74)) {
					exp.responseTime = Date.now()-exp.test_start;
					if(e.keyCode == 74)
						exp.keyCode = 1;
					if(e.keyCode == 70)
						exp.keyCode = 0;   
					$('.mainQ').hide();
					//$('.critical_stop').hide();
					$('.transition1').show();
					clearTimeout(go);
					// $('.reminder_main').hide();
					// $('.prompt').hide();
					// $('.outpu_main').hide();
					// $('.transition1').show();
				} 

				if ((($('.transition1').is(":visible")) || 
					($('.transition_late').is(":visible"))) && (e.keyCode == 32)) {
					_s.button();
				}
			}
     },

		button : function() {
			this.finishTime = Date.now();
			this.log_responses();
			_stream.apply(this);
		},

		log_responses : function() {
			exp.data_trials.push({
					"trial_num" : this.trialNum,
					"response" : exp.keyCode,
					"seconds_elapsed" : exp.responseTime / 1000,
					"first" : this.stim.first,
					"story" : this.stim.story,
					"scale" : scales[this.stim.scaleType],
					"list" : exp.currentList,
					"type" : this.stim.stimType
			});
		}
	});

	slides.subj_info =  slide({
		name : "subj_info",
		submit : function(e){
			exp.subj_data = {
				language : $("#language").val(),
				enjoyment : $("#enjoyment").val(),
				asses : $('input[name="assess"]:checked').val(),
				age : $("#age").val(),
				gender : $("#gender").val(),
				education : $("#education").val(),
				comments : $("#comments").val(),
				problems: $("#problems").val(),
				fairprice: $("#fairprice").val()
			};
			exp.go();
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
	
	exp.practice = [
		{
			"story":"beard",
			"storyline":"Brandon has a beard.",
			"tag":"practice",
			"scaleType":9,
			"stimType":"practice",
			"list":"all"
		}
	]

	exp.nTrials = 20;

	exp.stims = [];

	// determine what list to serve to participant
  exp.currentList = _.shuffle([1,2,3])[0];

  // filter criticals by list
  var listCriticals = criticalsM.filter(function (stim) { //for male names
  //var listCriticals = criticalsF.filter(function (stim) { //for male names
  return stim.list == exp.currentList
  });

  // stories are the critical items for the list, plus fillers
  // vacuous call to filter just converts json to javascript object
  var stories = listCriticals.concat(fillersM.filter( //for male names
  // var stories = listCriticals.concat(fillersF.filter( //for female names
    function() { return true } ));

  exp.stories = stories;

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
		"instructions",
		"before_practice",
		"practice",
		"before_trial",
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