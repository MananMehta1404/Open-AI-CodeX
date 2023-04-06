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
                            src = "${isAi ? bot : user}"
                            alt = "${isAi ? 'bot' : 'user'}"
                        />
                    </div>
                    <div class = "message" id = "${uniqueId}">
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
    chatContainer.innerHTML += chatStripe(true, '', uniqueId);  

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        handleSubmit(e);
    }
})