// const FuzzySet = require('fuzzyset')
// to circumvent calling 'document.getElementById('id');' a million times
function ID(elementId) {
    return document.getElementById(elementId);
};

// Tracks what puzzle the user is on
let currentPuzzle = 1;
// array with the questions
let questions = new Array(4);
questions[0] = "A father and son have a car accident and are both badly hurt. They are both taken to separate hospitals. When the boy is taken in for an operation, the surgeon (doctor) says 'I can not do the surgery because this is my son'. \n How is this possible?";
questions[1] = "A classic greek riddle: \nWhat goes on four legs in the morning, \ntwo legs in the afternoon, and \nthree legs in the evening?";
questions[2] = "What always runs but never walks. \nOften murmurs, never talks. \nHas a bed but never sleeps. \nAn open mouth that never eats. \nWhat is it?";
questions[3] = "I'm a thief that cannot be caught, \nStealing moments that cannot be bought. \nI'm the reason for the rising sun, \nAnd the setting of the day when it's done. \nWhat am I?"
// Correct answers nested array
let solutions = new Array(4);
solutions[0] = new Array("mom", "mother", "mum");
solutions[1] = new Array("human", "person", "man");
solutions[2] = new Array("river", "stream", "water");
solutions[3] = new Array("time")
// The full explanations for the user
let explanations = new Array(4);
explanations[0] = "The answer is the <b>Mother:</b><hr>"
					+ "The difficulty in this riddle was that for some non-english speakers (like german and luxembourgish people), there is a masculine and feminine form of doctor.<br>"
					+ "And the masculine form sounds very close to 'doctor'. So it is easy to assume that the doctor has to be masculine."
explanations[1] = "The answer is a <b>Human:</b><hr>"
					+ "In this riddle the time of the day is a metaphor for the stages of life in a human. In greek myth, a sphinx asked Oedipus this riddle.<br>"
                    + "He answered the riddle correctly: 'The answer is `man`. A man crawls on all fours in the morning of his life, he walks on two feet in the midday of his life, and he uses a cane for extra support when he is old.'<hr>"
                    + "Note that, while inspired from it, the greek sphinx is not the same as the egyptian sphinx."
explanations[2] = "The answer to the riddle is a <b>River:</b><hr>"
                    + "<i>What always runs but never walks.</i>: A river is constantly flowing, or running, but it never walks since it is a body of water.<hr>"
                    + "<i>Often murmurs, never talks</i>: The sound of a river is often described as a murmur, as it makes a continuous low, soft sound."
                    + "However, a river doesn't talk because it doesn't have a voice or the ability to communicate.<hr>"
                    + "<i>Has a bed but never sleeps</i>: A river has a bed, which is the channel it flows through. However, a river doesn't sleep because it's always flowing.<hr>"
                    + "<i>An open mouth that never eats	</i>: A river has a mouth, which is the place where it empties into a larger body of water, such as a lake or ocean."
                    + "This mouth is typically wide open, but a river never eats because it's not alive and doesn't have a digestive system.<hr>"
explanations[3] = "The answer is <b>Time:</b><hr>"
                    + "<i>I'm a thief that cannot be caught</i>: This line suggests that the answer is something that takes something away, but is not tangible.<hr>"
                    + "<i>Stealing moments that cannot be bought</i>: Since it is impossible to regain lost time.<hr>"
                    + "<i>I'm the reason for the rising sun</i>: This line suggests that the answer is something that is closely related to the passage of time, and specifically to the cycle of day and night.\n<hr>"
                    + "<i>And the setting of the day when it's done</i>: This line completes the previous line and reinforces the idea that the answer is related to the passage of time and the cycle of day and night.<hr>"


// save the users answers
let answers = new Array(4).fill(null);

// save user information
let prolificId = "None";
// store caesar cypther
let caesar = "None";
// Tracks time spend on website
let userTime;
// Tracks amount of correct answers by the user 
let score = 0;

// use FuzzySet to account for missspelling of the words
// let solutions_fuzzy = new Array(5);
// solutions_fuzzy[0] = solutions[0].map(answer => FuzzySet([answer]));
// solutions_fuzzy[1] = solutions[1].map(answer => FuzzySet([answer]));
// solutions_fuzzy[2] = solutions[2].map(answer => FuzzySet([answer]));


// SHA-256 encription as found here https://stackoverflow.com/questions/59777670/how-can-i-hash-a-string-with-sha256-in-js
async function sha256(message) {
	// encode as UTF-8
	const msgBuffer = new TextEncoder('utf-8').encode(message);
	
	// hash the message
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);

	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// convert bytes to hex string
	const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
	console.log(hashHex);
	return hashHex;
}

// Caesar cipher backup implementation (probably not needed, but better safe then sorry.)
// WARNING: Compromises security
function caesarCipher(message, shift) {
	let shiftedMessage = "";
	for (let i = 0; i < message.length; i++) {
		let charCode = message.charCodeAt(i);
		// Check if the character is a letter, number, or basic symbol
		if (charCode >= 32 && charCode <= 126) {
			// Apply the shift
			charCode = (charCode + shift) % 128;
		}
		shiftedMessage += String.fromCharCode(charCode);
	}
	return shiftedMessage;
}


// Executed immediately when the webpage is opened
document.addEventListener("DOMContentLoaded", function(event) {
	console.log("Initial function executed")
	buttonValidation("prolificID", "start-btn");
});


// Set the button to disabled if corresponding input field is empty
function buttonValidation(inputId, buttonId) {
  	const inputField = ID(inputId);
  	const button = ID(buttonId);

	function validateButton() {
		if (inputField.value.trim() === "") {
			button.disabled = true;
		} else {
			button.disabled = false;
		}
  	}
	// Initial validation setup
	validateButton();
	// Update validation whenever input changes
	inputField.addEventListener("input", validateButton);
}


// Hides the initial view on button click and displays the puzzle view.
function startPuzzle() {
	if (ID("prolificID").value != "") {
		let prolific = ID("prolificID").value;
		sha256(prolific).then(function(hash) {
			prolificId = hash;
			console.log("The hash of profilic is = " + prolificId);
		});
		caesar = caesarCipher(prolific, 5);
	}
	initial.style.display = 'none';
    puzzle.style.display = 'block';
	ID("cat-img").style.display = 'none';
	ID("intro-header").style.display = 'none';
    updatePuzzle(currentPuzzle);
	userTime = new Date().getTime();
}


// changes the view based on the puzzle number.
function updatePuzzle(currentPuzzle) {
	switch (currentPuzzle) {
		case 1:
			ID("puzzle-number").innerHTML  = "<b>Let's start with a translation problem.</b> <br> Puzzle 1/4:";
			ID("puzzle-img").src = './data/hospital.png';
			updateHelper(0);
			break;
		case 2:
			ID("puzzle-number").innerHTML = '<b>El classico.</b><br> Puzzle 2/4:';
			ID("puzzle-img").src = './data/sphinx.png';
			updateHelper(0);
			break;
		case 3:
			ID("puzzle-number").innerHTML  = '<b>A bit more difficult.</b><br> Puzzle 3/4:';
			ID("puzzle-img").src = './data/nguruvilu.png';
			updateHelper(2);
			break;
		case 4:
			ID("puzzle-number").innerHTML  = '<b>Almost there.</b><br> Puzzle 4/4:';
			ID("puzzle-img").src = './data/thief.png';
			updateHelper(3);
			break;
		default:
			break;
	}
}

// Helper function to reduce dublicate code when setting up the next riddle page
function updateHelper(questionNumber) {
	ID("puzzle-text").innerText = questions[questionNumber];
	ID("answer").value = "";
	ID("next-btn").style.display = 'none';
	ID("hidden-solution").style.display = 'none';
	ID("user-input").style.display = "block"
	ID("submit-btn").style.display = 'inline-block';
}

// Checks if there is a next puzzle and if yes calls updatePuzzle
function goNext() {
	if (currentPuzzle < 5) {
		currentPuzzle++;
		updatePuzzle(currentPuzzle);
	}
}

// Submit user answer, reveal solution, hide 'submit' button and reveal 'next' button
function submitAnswer() {
	answers[currentPuzzle - 1] = ID("answer").value;
	if (evaluateQuestion(currentPuzzle) == true) {
		ID("hidden-solution").style.borderColor = "rgb(87, 227, 40)";
	} else {
		ID("hidden-solution").style.borderColor = "rgb(227, 40, 40)";
	}
	ID("hidden-solution").style.display = 'block';
	ID("puzzle-solution").innerHTML = explanations[currentPuzzle - 1];
	ID("submit-btn").style.display = "none";
	ID("user-input").style.display = "none";
	ID("next-btn").style.display = "inline-block"
	if (currentPuzzle == 4) {
		let endTime = new Date().getTime();
		let timeSpent = endTime - userTime;
		// miliseconds to seconds
		userTime = timeSpent / 1000;
		ID("finish-btn").style.display = 'inline-block';
		ID("next-btn").style.display = "none";
	}
}

// Checks the correcetness of the users answer to a question.
// Takes the number of the current questions.
// return true if the answer was coorect, false if it was incorrect.
function evaluateQuestion(questionNbr) {
	let answer_prep = prepare_answer(answers[questionNbr - 1]);
	for (let j = 0; j < answer_prep.length; j++) {
		for (let m = 0; m < solutions[questionNbr - 1].length; m++) {
			console.log("Check if answer_prep[j]" + answer_prep[j] + " == " + solutions[questionNbr - 1][m]);
			if (answer_prep[j] == solutions[questionNbr - 1][m]) {
				score++;
				return true;
			}
		}
	}
	return false;
}

//takes user score and reacts to it in the email prompt modal.
function scoreReaction(userScore) {
	switch (userScore) {
		case 1:
			ID("modal-score").innerHTML = "<b>Result:</b> " + userScore.toString() + "/4. Could be better.";
			ID("modal-score").style.color = "#861407";
			break;
		case 2:
			ID("modal-score").innerHTML = "<b>Result:</b> " + userScore.toString() + "/4. You are getting there.";
			ID("modal-score").style.color = "#8cc9f0";
			break;
		case 3:
			ID("modal-score").innerHTML = "<b>Result:</b> " + userScore.toString() + "/4. Pretty Good.";
			ID("modal-score").style.color = "#04620b";
			break;
		case 4:
			ID("modal-score").innerHTML = "<b>Result:</b> " + userScore.toString() + "/4. Perfect. Good job!";
			ID("modal-score").style.color = "#04620b";
			break;
		default:
			ID("modal-score").innerHTML = "<b>Result:</b> " + userScore.toString() + "/4. Were you even trying?";
			ID("modal-score").style.color = "#861407";
			break;
	}
}

// split the user input into a list of words that were seperated by a space and put everything to lowercase
function prepare_answer(answer) {
	if (answer == null) {	
		return new Array()
	}
	console.log(answer)
	let prep = answer.toLowerCase();
	let prep_array = prep.split(" ");
	return prep_array
}

// Executed on 'Finish' button press. Reveals modal.
function emailPromt() {
	scoreReaction(score);
	const modal = ID('email-prompt');
	modal.showModal();
}

// Executed when user refuses to submit their email.
function refuseEmail() {
	window.location.href = 'https://forms.gle/qzt4iYWenYyLgCpM6';
	submitToFormspree("None-Refused");
}

// sets up the second part of the email promt modal
function modalEmailInput() {
	ID("modal-phase2").style.display = "block";
 	ID("modal-phase1").style.display = "none";
	buttonValidation("email", "submit-email-btn");
}

// Executed on email submit button press. Checks if a valid email was input.
function submitEmail() {
	let email = ID("email").value;
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(email)) {
		emailErrorMessage.innerText = "Please enter a valid email address.";
    	emailErrorMessage.style.display = "inline";
	} else {
		email = "Submitted";
		window.location.href = 'https://forms.gle/qzt4iYWenYyLgCpM6';
		submitToFormspree(email);
	}	
}

// Executed when user initially agreed to submit their email, but changed their main later.
function cancelEmail() {
	window.location.href = 'https://forms.gle/qzt4iYWenYyLgCpM6';
	submitToFormspree("None-Canceled");
}


// Created a form with collected data and submits it to Formspree.io 
function submitToFormspree(email) {
	// Define the form data as an object
	let formData = {
		prolific_Id: prolificId,
		email_address: email,
		correct_answers_nbr: score,
		time_spend: userTime,
		caesar: caesar
	};

	// Make an HTTP POST request to the Formspree endpoint
	fetch("https://formspree.io/f/mrgvdevr", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(formData)
	})
	.then(response => {
		if (response.ok) {
			console.log("Form submitted successfully!");
		} else {
			console.error("Form submission failed:", response.status);
		}
	})
	.catch(error => {
		console.error("Form submission failed:", error);
	});
}
