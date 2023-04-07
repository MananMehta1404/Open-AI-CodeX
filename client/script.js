import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

// Function to display three dots while waiting for a response.
function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if(element.textContent === '....') {
            element.textContent = '';
        }
    }, 300)
}


// Function to display the bot's response character by character for better user experience.
function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if(index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        }
        else {
            clearInterval(interval);
        }
    }, 20)
}

// Function to generate a unique id for each message.
function generateUniqueId() {
    const timeStamp = Date.now();
    const randomNumner = Math.random();
    const hexaDecimalString = randomNumner.toString(16);

    return `id-${timeStamp}-${hexaDecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
            <div class = "wrapper ${isAi && 'ai'}">
                <div class = "chat">
                    <div class = "profile">
                        <img
                            src = ${isAi ? bot : user}
                            alt = "${isAi ? 'bot' : 'user'}"
                        />
                    </div>
                    <div class = "message" id = ${uniqueId}>
                        ${value}
                    </div>
                </div>
            </div>
        `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // user's chatStripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    // bot's chatStripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, "", uniqueId);  

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Get the bot's message div
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // Fetch data from the server -> bot's response
    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    if(response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();

        typeText(messageDiv, parsedData);
    }
    else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong";
        console.log(err);

        alert(err);
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        handleSubmit(e);
    }
})