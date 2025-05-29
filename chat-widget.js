
(function () {
    if (window.chatWidgetLoaded) return;
    window.chatWidgetLoaded = true;

    // Inyectar estilos
    const style = document.createElement("style");
    style.innerHTML = `
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #F5F2F0;
            color: #830F07;
        }
        /* General */
        #chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: calc(100% - 40px);
            max-width: 450px;
            display: flex;
            flex-direction: column;
            z-index: 1000;
        }

        #chat-button {
            align-self: flex-end;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background-color: #830F07;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            z-index: 1001;
        }

        #chat-button:hover {
            background-color: #6b0c06;
            transform: scale(1.05);
        }

        /* Chat popup */
        #chat-popup {
            display: none;
            background-color: #F5F2F0;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
            overflow: hidden;
            margin-bottom: 10px;
            height: 70vh;
            max-height: 600px;
            min-height: 400px;
            transition: all 0.3s ease;
        }

        /* Header */
        #chat-header {
            background-color: #830F07;
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #6b0c06;
        }

        #chat-title {
            font-weight: bold;
            font-size: 18px;
        }

        #close-chat {
            cursor: pointer;
            font-size: 24px;
            height: 24px;
            width: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }

        #close-chat:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Messages */
        #chat-messages {
            height: calc(100% - 154px);
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scrollbar-width: thin;
            scrollbar-color: #830F07 #F5F2F0;
        }

        #chat-messages::-webkit-scrollbar {
            width: 10px;
        }

        #chat-messages::-webkit-scrollbar-track {
            background: #F5F2F0;
            border-radius: 10px;
        }

        #chat-messages::-webkit-scrollbar-thumb {
            background-color: #830F07;
            border-radius: 10px;
            border: 2px solid #F5F2F0;
        }

        #chat-messages::-webkit-scrollbar-thumb:hover {
            background-color: #6b0c06;
        }

        .message {
            padding: 12px 18px;
            border-radius: 18px;
            max-width: 85%;
            word-wrap: break-word;
            margin-bottom: 5px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            position: relative;
            line-height: 1.5;
            font-size: 16px;
        }

        /* Estilo del usuario */
        .user-message {
            background-color: #FAC300;
            color: #830F07;
            align-self: flex-end;
            border-bottom-right-radius: 5px;
        }

        /* Estilo del asistente */
        .assistant-message {
            background-color: #830F07;
            color: #F5F2F0;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
        }

        /* Input */
        #chat-input-container {
            display: flex;
            padding: 3px;
            border-top: 1px solid #830F07;
            background-color: #F5F2F0;
            margin-bottom: 0px;
        }

        #chat-input {
            flex-grow: 1;
            border: 1px solid #830F07;
            border-radius: 24px;
            padding: 14px 20px;
            margin-right: 12px;
            background-color: white;
            color: #830F07;
            outline: none;
            font-size: 16px;
            transition: border-color 0.3s;
            min-height: 20px;
        }

        #chat-input:focus {
            border-color: #FAC300;
            box-shadow: 0 0 0 2px rgba(250, 195, 0, 0.3);
        }

        #send-button {
            background-color: #830F07;
            color: white;
            border: none;
            border-radius: 24px;
            padding: 14px 22px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
            font-size: 15px;
        }

        #send-button:hover {
            background-color: #6b0c06;
            transform: translateY(-2px);
        }

        #send-button:active {
            transform: translateY(0);
        }

        /* Loading animation */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
        }

        .loading-dots {
            display: flex;
        }

        .loading-dots span {
            width: 8px;
            height: 8px;
            margin: 0 3px;
            background-color: #FAC300;
            border-radius: 50%;
            animation: bounce 1.5s infinite ease-in-out;
        }

        .loading-dots span:nth-child(1) { animation-delay: 0s; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        /* Responsive */
        @media (max-width: 600px) {
            #chat-container {
                width: calc(100% - 20px);
                max-width: none;
                right: 10px;
                bottom: 10px;
            }

            #chat-popup {
                height: 80vh;
            }

            .message {
                max-width: 90%;
                font-size: 15px;
            }
        }
    `;
    document.head.appendChild(style);

    // Inyectar HTML
    const container = document.createElement("div");
    container.innerHTML = `
<div id="chat-container">
<div id="chat-popup">
<div id="chat-header">
<div id="chat-title">Ternasquito</div>
<div id="close-chat">×</div>
</div>
<div aria-live="polite" id="chat-messages" role="log"></div>
<div id="chat-input-container">
<input aria-label="Mensaje" id="chat-input" placeholder="Escribe tu mensaje..." type="text"/>
<button aria-label="Enviar mensaje" id="send-button">Enviar</button>
</div>
</div>
<div aria-label="Abrir chat" id="chat-button">
<svg fill="none" height="30" viewbox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg">
<path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"></path>
</svg>
</div>
</div>
<script>
        // Elementos del DOM
        const chatButton = document.getElementById('chat-button');
        const chatPopup = document.getElementById('chat-popup');
        const closeChat = document.getElementById('close-chat');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        const chatMessages = document.getElementById('chat-messages');
        
        // URL de la API para enviar mensajes
        const API_URL = 'https://aragon-alimentos-backend-hmh8gxfefyfecfdx.westeurope-01.azurewebsites.net/chat/message'; // Reemplaza con tu URL real
        
        // Historial de conversación
        let conversationHistory = [];
        
        // Mostrar/ocultar el chat
        chatButton.addEventListener('click', () => {
            chatPopup.style.display = 'block';
            chatButton.style.display = 'none';
        });
        
        closeChat.addEventListener('click', () => {
            chatPopup.style.display = 'none';
            chatButton.style.display = 'flex';
        });
        
        // Función para agregar un mensaje al historial de chat
        function addMessageToChat(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(role === 'user' ? 'user-message' : 'assistant-message');
            messageDiv.textContent = content;
            chatMessages.appendChild(messageDiv);
            
            // Scroll al final del chat
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Agregar al historial de conversación
            conversationHistory.push({
                role: role === 'user' ? 'user' : 'assistant',
                content: content
            });
        }
        
        // Función para mostrar el indicador de carga
        function showLoadingIndicator() {
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('loading');
            loadingDiv.id = 'loading-indicator';
            
            const loadingDots = document.createElement('div');
            loadingDots.classList.add('loading-dots');
            
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('span');
                loadingDots.appendChild(dot);
            }
            
            loadingDiv.appendChild(loadingDots);
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Función para ocultar el indicador de carga
        function hideLoadingIndicator() {
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }
        
        // Función para enviar un mensaje al servidor
        async function sendMessageToServer(userMessage) {
            try {
                showLoadingIndicator();
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(conversationHistory)
                });
                
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                
                const data = await response.json();
                hideLoadingIndicator();
                
                if (data && data.role === 'assistant' && data.content) {
                    addMessageToChat('assistant', data.content);
                } else {
                    throw new Error('Formato de respuesta inválido');
                }
            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                hideLoadingIndicator();
                addMessageToChat('assistant', 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
            }
        }
        
        // Manejar el envío de mensajes
        function handleSendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                addMessageToChat('user', message);
                chatInput.value = '';
                sendMessageToServer(message);
            }
        }
        
        sendButton.addEventListener('click', handleSendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
        
        // Mensaje de bienvenida
        window.addEventListener('load', () => {
            addMessageToChat('assistant', '¡Hola, soy Ternasquito! ¿En qué puedo ayudarte hoy?');
        });
    </script>
`;
    document.body.appendChild(container);

    // Lógica JS del chat
    
        // Elementos del DOM
        const chatButton = document.getElementById('chat-button');
        const chatPopup = document.getElementById('chat-popup');
        const closeChat = document.getElementById('close-chat');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        const chatMessages = document.getElementById('chat-messages');
        
        // URL de la API para enviar mensajes
        const API_URL = 'https://aragon-alimentos-backend-hmh8gxfefyfecfdx.westeurope-01.azurewebsites.net/chat/message'; // Reemplaza con tu URL real
        
        // Historial de conversación
        let conversationHistory = [];
        
        // Mostrar/ocultar el chat
        chatButton.addEventListener('click', () => {
            chatPopup.style.display = 'block';
            chatButton.style.display = 'none';
        });
        
        closeChat.addEventListener('click', () => {
            chatPopup.style.display = 'none';
            chatButton.style.display = 'flex';
        });
        
        // Función para agregar un mensaje al historial de chat
        function addMessageToChat(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(role === 'user' ? 'user-message' : 'assistant-message');
            messageDiv.textContent = content;
            chatMessages.appendChild(messageDiv);
            
            // Scroll al final del chat
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Agregar al historial de conversación
            conversationHistory.push({
                role: role === 'user' ? 'user' : 'assistant',
                content: content
            });
        }
        
        // Función para mostrar el indicador de carga
        function showLoadingIndicator() {
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('loading');
            loadingDiv.id = 'loading-indicator';
            
            const loadingDots = document.createElement('div');
            loadingDots.classList.add('loading-dots');
            
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('span');
                loadingDots.appendChild(dot);
            }
            
            loadingDiv.appendChild(loadingDots);
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Función para ocultar el indicador de carga
        function hideLoadingIndicator() {
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }
        
        // Función para enviar un mensaje al servidor
        async function sendMessageToServer(userMessage) {
            try {
                showLoadingIndicator();
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(conversationHistory)
                });
                
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                
                const data = await response.json();
                hideLoadingIndicator();
                
                if (data && data.role === 'assistant' && data.content) {
                    addMessageToChat('assistant', data.content);
                } else {
                    throw new Error('Formato de respuesta inválido');
                }
            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                hideLoadingIndicator();
                addMessageToChat('assistant', 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
            }
        }
        
        // Manejar el envío de mensajes
        function handleSendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                addMessageToChat('user', message);
                chatInput.value = '';
                sendMessageToServer(message);
            }
        }
        
        sendButton.addEventListener('click', handleSendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
        
        // Mensaje de bienvenida
        window.addEventListener('load', () => {
            addMessageToChat('assistant', '¡Hola, soy Ternasquito! ¿En qué puedo ayudarte hoy?');
        });
    
})();
