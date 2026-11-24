// Bloom & Build — Task 3 JavaScript interactions

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Mini quiz: DOM manipulation, events and score tracking
const quizQuestions = [
  { question: "Which language gives a webpage its structure?", options: ["CSS", "HTML", "JavaScript", "Python"], answer: "HTML" },
  { question: "Which CSS feature helps make layouts responsive?", options: ["Media queries", "Alerts", "Loops", "Variables only"], answer: "Media queries" },
  { question: "Which JavaScript method selects an element by its ID?", options: ["getElementById()", "queryColor()", "makeElement()", "findClassOnly()"], answer: "getElementById()" }
];
let questionIndex = 0;
let score = 0;
let answered = false;
const questionEl = document.getElementById("quizQuestion");
const optionsEl = document.getElementById("quizOptions");
const progressEl = document.getElementById("quizProgress");
const scoreEl = document.getElementById("quizScore");
const feedbackEl = document.getElementById("quizFeedback");
const nextButton = document.getElementById("nextQuestion");

function renderQuestion() {
  const item = quizQuestions[questionIndex];
  answered = false;
  questionEl.textContent = item.question;
  optionsEl.innerHTML = "";
  item.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => chooseAnswer(button, option));
    optionsEl.appendChild(button);
  });
  progressEl.textContent = `Question ${questionIndex + 1} of ${quizQuestions.length}`;
  scoreEl.textContent = `Score: ${score}`;
  feedbackEl.textContent = "";
  nextButton.disabled = true;
  nextButton.textContent = questionIndex === quizQuestions.length - 1 ? "See my result →" : "Next question →";
}

function chooseAnswer(button, selected) {
  if (answered) return;
  answered = true;
  const correct = quizQuestions[questionIndex].answer;
  [...optionsEl.children].forEach(optionButton => {
    optionButton.disabled = true;
    if (optionButton.textContent === correct) optionButton.classList.add("correct");
  });
  if (selected === correct) {
    score++;
    feedbackEl.textContent = "That's right! You're blooming with knowledge ✿";
  } else {
    button.classList.add("wrong");
    feedbackEl.textContent = `Not quite — the correct answer is ${correct}. Keep learning!`;
  }
  scoreEl.textContent = `Score: ${score}`;
  nextButton.disabled = false;
}
nextButton.addEventListener("click", () => {
  if (questionIndex < quizQuestions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    questionEl.textContent = `You scored ${score} out of ${quizQuestions.length}!`;
    optionsEl.innerHTML = "";
    feedbackEl.textContent = score === 3 ? "Perfect score! You're a web star ✨" : "Lovely effort! Every attempt helps you grow 🌷";
    progressEl.textContent = "Quiz completed";
    nextButton.textContent = "Play again ↻";
    nextButton.disabled = false;
    nextButton.onclick = () => {
      questionIndex = 0; score = 0; nextButton.onclick = null; renderQuestion();
    };
  }
});
renderQuestion();

// Image carousel: previous/next controls and indicator dots
const slides = [
  { src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85", alt: "Soft pink flowers", caption: "A little bloom of happiness" },
  { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85", alt: "Pastel fashion moodboard", caption: "A little colour, a lot of confidence" },
  { src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85", alt: "A calm desk with books and flowers", caption: "Slow moments, fresh ideas" },
  { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85", alt: "Dreamy pastel landscape", caption: "Somewhere between dreams and plans" }
];
let slideIndex = 0;
const carouselImage = document.getElementById("carouselImage");
const carouselCaption = document.getElementById("carouselCaption");
const dotsContainer = document.getElementById("carouselDots");

function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  carouselImage.style.opacity = "0.25";
  const slide = slides[slideIndex];
  const preload = new Image();
  preload.onload = () => {
    carouselImage.src = slide.src;
    carouselImage.alt = slide.alt;
    carouselCaption.textContent = slide.caption;
    carouselImage.style.opacity = "1";
  };
  preload.onerror = () => { carouselImage.style.opacity = "1"; };
  preload.src = slide.src;
  [...dotsContainer.children].forEach((dot, i) => dot.classList.toggle("active", i === slideIndex));
}
slides.forEach((slide, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show image ${i + 1}`);
  dot.addEventListener("click", () => showSlide(i));
  dotsContainer.appendChild(dot);
});
document.getElementById("prevSlide").addEventListener("click", () => showSlide(slideIndex - 1));
document.getElementById("nextSlide").addEventListener("click", () => showSlide(slideIndex + 1));

// Public API: fetch a random joke and display it dynamically
const jokeBox = document.getElementById("jokeBox");
const jokeButton = document.getElementById("jokeButton");
const apiStatus = document.getElementById("apiStatus");

async function fetchJoke() {
  jokeButton.disabled = true;
  jokeButton.textContent = "Finding a smile...";
  apiStatus.textContent = "Connecting to the API…";
  jokeBox.textContent = "A tiny joke is on its way ✨";
  try {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    jokeBox.textContent = `${data.setup} — ${data.punchline}`;
    apiStatus.textContent = "Fresh joke loaded successfully ✓";
  } catch (error) {
    jokeBox.textContent = "Why did the computer get cold? It left its Windows open! (Fallback joke)";
    apiStatus.textContent = "Live API unavailable right now — showing a backup joke.";
  } finally {
    jokeButton.disabled = false;
    jokeButton.textContent = "Get a new joke ✿";
  }
}
jokeButton.addEventListener("click", fetchJoke);
