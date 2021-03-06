
var pIDdigs = 100000000;
var participant_id = Math.floor(pIDdigs + Math.random() * (9 * pIDdigs - 1));
var slider_width = 650; // Slider width in pixels for visual analog scales
var cond = Math.round(Math.random()); // 0 or 1. 0 = SFT, 1 = EFT
var diffDays = 30*3; // Delay of interest, in days--good source: https://www.researchgate.net/publication/312869783_Delay_Discounting_of_Video_Game_Players_Comparison_of_Time_Duration_Among_Gamers/figures?lo=1
var delayedDate = new Date();
delayedDate.setDate(delayedDate.getDate() + diffDays);
delayedDateString = delayedDate.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
jsPsych.data.addProperties({
	participant_id: participant_id,
	cond: cond
});
timeline = [];
/*
	CONSENT
*/
save_email = function(elem) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'saveData.php', true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() { // Call a function when the state changes.
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		}
	}
	xhr.send("pID=zEmail&txt=" + document.getElementById('pEmail').value);
	return true;
};
consent = {
	type: 'external-html',
	url: "consent.html",
	cont_btn: "start",
	check_fn: save_email
};
timeline.push(consent);
/*
	SET FULLSCREEN
*/
fullscreen = {
	type: 'fullscreen',
	fullscreen_mode: true
};
//timeline.push(fullscreen);
/*
	DEMOGRAPHICS
*/
var age = {
	type: 'survey-text',
	questions: [{prompt: 'What is your age in years?'}],
	post_trial_gap: 100
};
var gender = {
	type: 'survey-multi-choice',
	questions: [{prompt: 'What is your gender?', options: ['Man', 'Woman', 'Other/prefer not to say'], horizontal: true}]
};
timeline.push(age, gender);
/*
	FUTURE THINKING TASK--INSTRUCTIONS
*/
var instr;
if (cond == 1) { // EFT
	instr = [
		[
			'Please think of an event that might happen to you on or around ' + delayedDateString + '.',
			'This should be an event that is specific to you.',
			'It should happen on a specific date and in a specific place.',
			'It should also not be something that you have experienced many times.',
			'You may use your calendar to come up with something.',
			'If you do not have anything planned, you can imagine something that could realistically happen.',
		], [
			'A weekend music festival (does not happen on one specific date)',
			'A national holiday (not specific to you, does not happen in a specific place)',
			'Going grocery shopping (something you have probably experienced many times)'
		], [
			'Running into an old friend',
			'Moving into a new apartment',
			'Meeting up with someone to buy a piece of furniture'
		], [
			'You have planned or could realistically happen to you on or around ' + delayedDateString,
			'Would not last longer than a day',
			'Would happen at a specific place',
			'You have not already experienced many times'
		]
	]
} else { //SFT
	instr = [
		[
			'Please think of an event that might happen on or around ' + delayedDateString + '.',
			'This should be an event that is not specific to you.',
			'It should happen on a specific date but does not need to happen in a specific place.',
			'You may search the web to come up with something.',
		], [
			'A weekend music festival (does not happen on one specific date)',
			'Running into an old friend (specific to you)'
		], [
			'A national holiday',
			'A sports event',
			'An election'
		], [
			'Will happen or could realistically happen on or around ' + delayedDateString,
			'Is not specific to you',
			'Would not last longer than a day'
		]
	]
}
var pages = instr[0];
var preambles = [
	'Examples of events that are NOT appropriate for this study:',
	'Examples of events that ARE appropriate for this study:',
	'Once you have an event in mind that:'
];
var postambles = [
	'',
	'',
	'<br>Click "Next"<br>'
];
var i, j, currtext;
for (i = 1; i < instr.length; i++) { // Loop through the remainder of the instructions
	currtext = preambles[i-1] + '<br><br>';
	for (j = 0; j < instr[i].length; j++) { // Loop through the individual points
		currtext += (j + 1) + '. ' + instr[i][j] + '<br>'
	}
	currtext += postambles[i-1];
	pages.push(currtext);
}
ft_instructions = {
	type: 'instructions',
	pages: pages,
	show_clickable_nav: true
};
var event_titles = [];
ft_writing = {
	type:'survey-text',
	questions: [
		{
			prompt: 'Event title',
			rows: 1,
		}, {
			prompt: 'Detailed description',
			rows: 10,
			columns: 100
		}
	],
	on_finish: function(data) {
		var resp = JSON.parse(data.responses);
		event_titles.push(resp.Q0);
	}
};
timeline.push(ft_instructions, ft_writing);
/*
	POST-EFT QUESTIONNAIRE
*/
var PESRQ = {
	type: 'instructions', 
	pages: [
		'Now you will be asked questions about the events you came up with. Please do not try to change your imagination of the events based on the questions. Instead, answer them based on the mental images you already had.',
		'Move the sliders to indicate your answers. The more you agree with the option on one side, the closer you should move the slider to it.<br><br> For example, if you completely agree with the option on the left, move the slider all the way to the left. If you completely agree with the option on the right, move the slider all the way to the right.',
		'Some of these questions ask about visual perspective. When we imagine events, we can see them from different points of view in our mind’s eye. If we see the scene from the point of view of our own eyes, this is called a “first-person” perspective. If we see it from any other point of view, this is called a “third-person” perspective. Sometimes we switch back and forth between the two.'
	], 
	show_clickable_nav: true
};
timeline.push(PESRQ);
var questions = [
	'Did you have a mental image of the event?',
	'Was the general emotional tone of the event positive or negative?',
	'Were the emotions associated with the event intense?',
	'What percentage of the time did you see the scene from a first-person perspective?',
	'When you imagined the event, did it feel like you were “pre-experiencing” it?'
];
var axes = [
	['0<br>No image at all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>Image as clear and vivid as real life'],
	['0<br>Negative', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100<br>Positive'],
	['0<br>Not Intense', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100<br>Very Intense'],
	['0%', '10', '20', '30', '40', '50%', '60', '70', '80', '90', '100%'],
	['0<br>Not at all', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100<br>Very much']
];
var response = {
	type: 'html-slider-response',
	min: 0,
	max: 100,
	step: 1,
	start: 50, 
	slider_width: 650,
	timeline: []
};
for (i = 0; i < questions.length; i++) {
	response.timeline.push({
		stimulus: '<b>' + questions[i] + '</b><br><br>',
		labels: axes[i]
	})
}
timeline.push(response);
/*
	DELAY DISCOUNTING TASK
*/
// Uncued delays: 1 week, 1 month, 6 months, 12 months
var delays = [7, 30, 180, 360, diffDays].sort(function(a, b) {return a - b});
var iscued = new Array(delays.length);
var i;
for (i = 0; i < delays.length; i++) {
	if (delays[i] == diffDays) {
		iscued[i] = true;
	} else {
		iscued[i] = false;
	}
	delays[i] = delays[i] + ' days';
}
var dd_data = { // Global variable for tracking the progress of the delay discounting task
	mon_amts: [400, 800],
	immediate_value: null,
	delayed_value: null,
	delays: delays,
	cued: iscued,
	cue_count: 0, // Which cue are we on?
	delay_count: 0, // Which delay are we on?
	max_trials: 5, // How many trials per delay?
	trial_count: 0, // Which trial are we on in the current delay?
	div_pre: '<div style="height: 100px; width: 250px;">', // To ensure consistent button sizes
	div_post: '</div>'
};
var dd_instructions = {
	type: 'instructions',
	pages: [
		'Now you will make a series of monetary choices.',
		'You will be asked whether you would prefer some amount of money now or another amount later.',
		'Click the option that you would choose. There are no right or wrong answers.'
	],
	show_clickable_nav: true,
	post_trial_gap: 1000
};
var dd_trial = {
	type: 'html-button-response',
	stimulus: '', // Am I allowed to just not specify one?
	choices: ['', ''], // Placeholders
	post_trial_gap: 500,
	data: {}, // Placeholder
	on_start: function(trial) {
		if (dd_data.trial_count > 0) {
			var last_data = jsPsych.data.getLastTimelineData().values()[0];
			var inc = dd_data.delayed_value/4*0.5**(dd_data.trial_count - 1); // Amount by which immediate quantity is incremented
			if (last_data.button_pressed == last_data.order) { // Immediate choice was made
				dd_data.immediate_value -= inc;
			} else { // Delayed choice was made
				dd_data.immediate_value += inc;
			}
		} else {
			dd_data.immediate_value = dd_data.mon_amts[0];
			dd_data.delayed_value = dd_data.mon_amts[1];
		}
		var imm = dd_data.div_pre +
			'<p>$' + dd_data.immediate_value + '</p>' +
			'<p>now</p>' +
			dd_data.div_post;
		if (dd_data.cued[dd_data.delay_count]) {
			var tag = '<p>(' + event_titles[dd_data.cue_count] + ')</p>';
		} else {
			var tag = '';
		}
		var del = dd_data.div_pre +
			'<p>$' + dd_data.delayed_value + '</p>' +
			'<p>in ' + dd_data.delays[dd_data.delay_count] + '</p>' +
			tag + 
			dd_data.div_post;
		var order = Math.round(Math.random()) // Order in which buttons appear; 0 = imm, del; 1 = del, imm
		if (order == 0) {
			trial.choices = [imm, del];
		} else {
			trial.choices = [del, imm];
		}
		dd_data.trial_count++;
		trial.data = {
			immediate_value: Math.round(dd_data.immediate_value), // Dollar value of immediate reward
			delayed_value: Math.round(dd_data.delayed_value), // Dollar value of delayed reward
			delay: dd_data.delays[dd_data.delay_count],
			delay_text: del, // Display text specifying delay
			immediate_text: imm, // Display text specifying delay
			order: order
		};
	}
};
var dd_loop = {
	timeline: [dd_trial],
	loop_function: function(data) {
		if (dd_data.trial_count == dd_data.max_trials) { // Increment the delay counter
			if (dd_data.cued[dd_data.delay_count]) {
				dd_data.cue_count++;
			}
			dd_data.delay_count++;
			if (dd_data.delay_count == dd_data.delays.length) { // Exit if we're done all the delays
				return false;
			} // Else reset everything
			dd_data.trial_count = 0;
			dd_data.immediate_value = dd_data.mon_amts[0];
		}
		return true; // Else continue the loop
	}
};
timeline.push(dd_instructions, dd_loop);
/*
	FINAL SCREEN STUFF
*/
save_data = function() {
	var form = document.createElement('form');
	document.body.appendChild(form);
	form.method = 'post';
	form.action = 'saveData.php';
	var data = {
		txt: jsPsych.data.get().csv(),
		pID: participant_id
	}
	var name;
	for (name in data) {
		var input = document.createElement('input');
		input.type = 'hidden';
		input.name = name;
		input.value = data[name];
		form.appendChild(input);
	}
	form.submit();
}
saving_options = function(initialMessage) {
	var body = document.getElementsByTagName("BODY")[0];
	body.innerHTML = '<center><p>' + initialMessage + '</center></p>';
	
	var keepDataButton = document.createElement('button');
	keepDataButton.textContent = 'Keep my data';
	keepDataButton.visibility = 'visible';
	keepDataButton.onclick = save_data;
	body.appendChild(keepDataButton);
	
	var br = document.createElement("BR");
	body.appendChild(br);
	
	var discardDataButton = document.createElement('button');
	discardDataButton.textContent = 'Delete my data';
	discardDataButton.visibility = 'visible';
	discardDataButton.style.color = 'red';
	discardDataButton.onclick = function() {
		window.location.href = "end.html";
	}
	body.appendChild(discardDataButton);
}
addWithdrawButton = function() { // Add this to the first timeline element
	var withdrawButton = document.createElement('button');
	withdrawButton.textContent = 'withdraw';
	withdrawButton.position = 'absolute';
	withdrawButton.visibility = 'visible';
	withdrawButton.onclick = function() {
		if (confirm('Withdraw from the study? ("OK" for "yes", "Cancel" for "no")')) {
			saving_options('You have withdrawn from the study');
		}
	};
	var body = document.getElementsByTagName("body")[0];
	body.insertBefore(withdrawButton, body.childNodes[0])
}
timeline[0].on_load = addWithdrawButton;
jsPsych.init({
	timeline: timeline,
	on_finish: function() {
		saving_options('Thank you for participating!');
	}
});