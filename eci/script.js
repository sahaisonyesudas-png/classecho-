// script.js — reliable Web Speech wiring and small UI helpers
document.addEventListener('DOMContentLoaded', () => {
    const micBtn = document.getElementById('micBtn');
    const transcriptArea = document.getElementById('transcriptArea');
    const subjectInput = document.getElementById('subjectName');
    const newClassBtn = document.getElementById('newClassBtn');
    const historyBtn = document.getElementById('historyBtn');
  
    let recognition = null;
    let recognizing = false;
    let finalTranscript = '';
  
    // Feature detection: Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
  
      recognition.onstart = () => {
        recognizing = true;
        micBtn.classList.add('active');
        micBtn.setAttribute('aria-pressed', 'true');
      };
  
      recognition.onend = () => {
        recognizing = false;
        micBtn.classList.remove('active');
        micBtn.setAttribute('aria-pressed', 'false');
        // keep finalTranscript in the textarea when stopped
        transcriptArea.value = finalTranscript.trim();
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        // show a brief message in the textarea if permission denied
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          alert('Microphone access blocked. Please allow microphone permissions for this site.');
        }
      };
  
      recognition.onresult = (event) => {
        let interim = '';
        // iterate results starting at resultIndex
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            finalTranscript += text + ' ';
          } else {
            interim += text;
          }
        }
        // Update textarea with final + interim, keep it scrolled to bottom
        transcriptArea.value = (finalTranscript + interim).trim();
        transcriptArea.scrollTop = transcriptArea.scrollHeight;
      };
    } else {
      // Not supported: disable mic and show hint
      transcriptArea.value = '⚠️ Live transcription (Web Speech API) is not supported in this browser.\nPlease open this page in Chrome or Edge on desktop for live transcription.';
      micBtn.disabled = true;
      micBtn.title = 'Speech Recognition not supported';
    }
  
    // Mic button toggles recognition safely
    micBtn.addEventListener('click', async () => {
      if (!recognition) return;
  
      if (recognizing) {
        try { recognition.stop(); } catch (e) { console.warn(e); }
      } else {
        try {
          // trigger getUserMedia to prompt permissions earlier in some browsers
          await navigator.mediaDevices.getUserMedia({ audio: true });
          // preserve existing content if teacher typed something
          finalTranscript = transcriptArea.value ? transcriptArea.value + ' ' : '';
          recognition.start();
        } catch (err) {
          console.error('Microphone permission error', err);
          alert('Microphone permission is required to start transcription. Please allow microphone access.');
        }
      }
    });
  
    // New Class clears subject and transcript (and stops recognition)
    newClassBtn.addEventListener('click', () => {
      if (recognizing && recognition) {
        try { recognition.stop(); } catch (e) {}
      }
      subjectInput.value = '';
      finalTranscript = '';
      transcriptArea.value = '';
      subjectInput.focus();
    });
  
    // History — placeholder (no saved history yet)
    historyBtn.addEventListener('click', () => {
      alert('History is empty. This demo does not persist sessions yet.');
    });
  });
  