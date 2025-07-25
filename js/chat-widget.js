class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.messageId = 0;
        this.isInitialized = false;
        
        // Pre-written responses
        this.responses = {
            greetings: [
                "Hello! Welcome to SkillSwap! 👋 How can I help you today?",
                "Hi there! I'm here to assist you with any questions about our courses!",
                "Welcome! What would you like to know about SkillSwap?"
            ],
            courses: [
                "We offer a wide variety of courses including programming, design, marketing, and more! You can check out our full course catalog on the Courses page.",
                "Our courses are designed by industry experts and updated regularly. Would you like me to recommend some based on your interests?",
                "We have both video courses and task-based learning. What type of learning style do you prefer?"
            ],
            pricing: [
                "We have flexible pricing plans starting from $99.99/month. You can view all our pricing options on the Pricing page.",
                "Our pricing includes access to all courses, certificates, and 24/7 support. Would you like to know more about a specific plan?",
                "We offer student discounts and corporate packages too! What type of plan are you interested in?"
            ],
            support: [
                "I'm here to help! You can also reach our support team via email at support@skillswap.com or through our Contact page.",
                "Our support team is available 24/7. Is there something specific I can help you with right now?",
                "For technical issues, please visit our Contact page or email us directly. I can help with general questions!"
            ],
            certificates: [
                "Yes! You'll receive industry-recognized certificates upon course completion. These are great for your LinkedIn profile!",
                "Our certificates are verified and can be shared with employers. They show your commitment to continuous learning!",
                "Certificates are included in all our paid plans. You'll get them automatically when you complete a course."
            ],
            default: [
                "That's a great question! For detailed information, I'd recommend checking our website or contacting our support team.",
                "I'm still learning! Could you try rephrasing your question, or would you like me to connect you with a human agent?",
                "Hmm, I'm not sure about that specific topic. You can find more detailed information on our website or contact support.",
                "Let me connect you with someone who can better assist you with that question!"
            ]
        };

        this.quickReplies = [
            "Course information",
            "Pricing plans",
            "Technical support",
            "Certificates",
            "Get started"
        ];

        // Wait for page to fully load before initializing
        this.waitForPageLoad();
    }

    waitForPageLoad() {
        // Check if page is already loaded
        if (document.readyState === 'complete') {
            this.delayedInit();
        } else {
            // Wait for window load event (after all resources are loaded)
            window.addEventListener('load', () => {
                this.delayedInit();
            });
        }
    }

    delayedInit() {
        // Add a small delay to ensure everything is settled
        setTimeout(() => {
            this.init();
        }, 1000);
    }

    init() {
        if (this.isInitialized) return;
        
        this.createWidget();
        this.bindEvents();
        this.setupResponsivePositioning();
        this.showWelcomeMessage();
        this.isInitialized = true;
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'chat-widget';
        widget.innerHTML = `
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">
                            <img src="imgs/homelogo.png" alt="SkillSwap" class="chat-avatar-logo">
                        </div>
                        <div class="chat-agent-info">
                            <h4>SkillSwap Assistant</h4>
                            <div class="chat-status">
                                <span class="status-dot"></span>
                                Online
                            </div>
                        </div>
                    </div>
                    <button class="chat-close" id="chatClose">×</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <!-- Messages will be added here -->
                </div>
                <div class="chat-input-container">
                    <textarea 
                        class="chat-input" 
                        id="chatInput" 
                        placeholder="Type your message..."
                        rows="1"
                    ></textarea>
                    <button class="chat-send" id="chatSend">
                        <span>➤</span>
                    </button>
                </div>
            </div>
            <button class="chat-toggle" id="chatToggle">
                <img src="imgs/homelogo.png" alt="Chat" class="chat-toggle-logo">
                <div class="chat-notification" id="chatNotification" style="display: none;">1</div>
            </button>
        `;

        document.body.appendChild(widget);
    }

    setupResponsivePositioning() {
        // Set initial position
        this.updateChatPosition();
        
        // Listen for window resize
        window.addEventListener('resize', () => {
            this.updateChatPosition();
        });
        
        // Listen for orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateChatPosition();
            }, 100);
        });
    }

    updateChatPosition() {
        const chatWindow = document.getElementById('chatWindow');
        if (!chatWindow) return;

        const screenWidth = window.innerWidth;
        
        // Reset all positioning styles
        chatWindow.style.right = '';
        chatWindow.style.left = '';
        chatWindow.style.transform = '';
        chatWindow.style.marginLeft = '';
        
        if (screenWidth <= 480) {
            // Very small screens - position to the left
            chatWindow.style.right = 'auto';
            chatWindow.style.left = '20px';
            chatWindow.style.width = 'calc(100vw - 40px)';
            chatWindow.style.height = '400px';
        } else if (screenWidth <= 768) {
            // Medium small screens - position to the left of toggle
            chatWindow.style.right = 'auto';
            chatWindow.style.left = '-240px';
            chatWindow.style.width = '300px';
            chatWindow.style.height = '450px';
        } else {
            // Desktop - normal position to the right
            chatWindow.style.right = '0';
            chatWindow.style.left = 'auto';
            chatWindow.style.width = '350px';
            chatWindow.style.height = '500px';
        }
    }

    bindEvents() {
        const toggle = document.getElementById('chatToggle');
        const close = document.getElementById('chatClose');
        const send = document.getElementById('chatSend');
        const input = document.getElementById('chatInput');

        if (toggle) toggle.addEventListener('click', () => this.toggleChat());
        if (close) close.addEventListener('click', () => this.closeChat());
        if (send) send.addEventListener('click', () => this.sendMessage());
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 100) + 'px';
            });
        }
    }

    toggleChat() {
        const window = document.getElementById('chatWindow');
        const notification = document.getElementById('chatNotification');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            // Update position before showing
            this.updateChatPosition();
            window.classList.add('active');
            if (notification) notification.style.display = 'none';
            this.scrollToBottom();
        } else {
            window.classList.remove('active');
        }
    }

    closeChat() {
        const window = document.getElementById('chatWindow');
        if (window) window.classList.remove('active');
        this.isOpen = false;
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('agent', this.responses.greetings[0]);
            this.showQuickReplies();
        }, 2000);
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        input.style.height = 'auto';

        // Show typing indicator
        this.showTyping();

        // Generate response after delay
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage('agent', response);
            
            // Show quick replies occasionally
            if (Math.random() > 0.7) {
                this.showQuickReplies();
            }
        }, 1000 + Math.random() * 2000);
    }

    addMessage(sender, content, showTime = true) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const messageId = ++this.messageId;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatarContent = sender === 'user' 
            ? '👤' 
            : '<img src="imgs/homelogo.png" alt="SkillSwap" class="message-avatar-logo">';
            
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatarContent}
            </div>
            <div class="message-content">
                ${content}
                ${showTime ? `<div class="message-time">${this.getCurrentTime()}</div>` : ''}
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Store message
        this.messages.push({
            id: messageId,
            sender,
            content,
            timestamp: new Date()
        });
    }

    showTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message agent typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="imgs/homelogo.png" alt="SkillSwap" class="message-avatar-logo">
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    showQuickReplies() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'message agent';
        quickRepliesDiv.innerHTML = `
            <div class="message-avatar">
                <img src="imgs/homelogo.png" alt="SkillSwap" class="message-avatar-logo">
            </div>
            <div class="message-content">
                Quick questions:
                <div class="quick-replies">
                    ${this.quickReplies.map(reply => 
                        `<button class="quick-reply" onclick="chatWidget.handleQuickReply('${reply}')">${reply}</button>`
                    ).join('')}
                </div>
            </div>
        `;

        messagesContainer.appendChild(quickRepliesDiv);
        this.scrollToBottom();
    }

    handleQuickReply(reply) {
        this.addMessage('user', reply);
        
        // Remove quick replies
        const quickReplies = document.querySelectorAll('.quick-replies');
        quickReplies.forEach(qr => qr.parentElement.parentElement.remove());

        // Show typing and respond
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(reply);
            this.addMessage('agent', response);
        }, 1500);
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords and return appropriate response
        if (lowerMessage.includes('course') || lowerMessage.includes('learn') || lowerMessage.includes('class')) {
            return this.getRandomResponse('courses');
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan') || lowerMessage.includes('pricing')) {
            return this.getRandomResponse('pricing');
        } else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('problem') || lowerMessage.includes('technical')) {
            return this.getRandomResponse('support');
        } else if (lowerMessage.includes('certificate') || lowerMessage.includes('certification') || lowerMessage.includes('diploma')) {
            return this.getRandomResponse('certificates');
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('start')) {
            return this.getRandomResponse('greetings');
        } else {
            return this.getRandomResponse('default');
        }
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }
}

// Initialize chat widget when DOM is loaded, but wait for full page load
let chatWidget;

// Only initialize if not already done
if (!window.chatWidgetInitialized) {
    chatWidget = new ChatWidget();
    window.chatWidget = chatWidget;
    window.chatWidgetInitialized = true;

    // Show notification after some time if chat hasn't been opened
    setTimeout(() => {
        const notification = document.getElementById('chatNotification');
        if (notification && chatWidget && !chatWidget.isOpen) {
            notification.style.display = 'flex';
        }
    }, 15000); // Increased delay to 15 seconds
}
