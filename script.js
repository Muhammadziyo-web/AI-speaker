const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resultDiv = document.getElementById("result");
const welcomeText = document.getElementById("welcomeText");

const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

recognition.continuous = false; // Disable continuous mode
recognition.interimResults = false; // Disable interim results
recognition.lang = "en-US";

recognition.onstart = () => {
  startButton.disabled = true;
  stopButton.disabled = false;
};

recognition.onend = () => {
  startButton.disabled = false;
  stopButton.disabled = true;
};

recognition.onresult = (event) => {
  let result = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    result += event.results[i][0].transcript;
  }
  resultDiv.innerHTML = result;

  // Send the result to Flowise AI here
  query({ question: result }).then((response) => {
      console.log(response);
      resultDiv.innerHTML = response;
      speakText(response);

  });
};

startButton.addEventListener("click", () => {
    recognition.start();
    welcomeText.style.display="none"
    
});

stopButton.addEventListener("click", () => {
  recognition.stop();
});

async function query(data) {
  console.log("->");
  const response = await fetch(
    "https://flowiseai-railway-production-ae70.up.railway.app/api/v1/prediction/3edeeff7-9389-4517-8215-778c5627b8b2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}
//TTS

function speakText(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  // Specify a female voice and more realistic parameters
    const voices = synth.getVoices();
//   utterance.voice = voices.find((voice) => voice.lang === "Microsoft Zira - English (United States)"); // Change to your desired female voice
  utterance.rate = 1; // Adjust the rate (1 is the default rate)

  synth.speak(utterance);
}