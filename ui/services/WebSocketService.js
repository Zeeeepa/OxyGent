import { EventSourcePolyfill } from 'event-source-polyfill';

/**
 * WebSocketService class for handling real-time communication with the server
 */
class WebSocketService {
    constructor() {
        this.eventSource = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // Start with 1 second delay
    }

    /**
     * Connect to the server using Server-Sent Events
     * 
     * @param {string} traceId - The trace ID for the connection
     * @returns {Promise<void>} - A promise that resolves when the connection is established
     */
    connect(traceId) {
        return new Promise((resolve, reject) => {
            if (this.eventSource) {
                this.disconnect();
            }

            try {
                const url = `/sse/chat?payload=${encodeURIComponent(JSON.stringify({ current_trace_id: traceId }))}`;
                this.eventSource = new EventSourcePolyfill(url, {
                    withCredentials: true,
                    heartbeatTimeout: 60000, // 1 minute
                });

                // Connection opened
                this.eventSource.onopen = () => {
                    console.log('SSE connection established');
                    this.reconnectAttempts = 0;
                    resolve();
                };

                // Connection error
                this.eventSource.onerror = (error) => {
                    console.error('SSE connection error:', error);
                    
                    if (this.eventSource.readyState === EventSource.CLOSED) {
                        this.handleReconnect(traceId, reject);
                    }
                };

                // Message received
                this.eventSource.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.notifyListeners('message', data);
                    } catch (error) {
                        console.error('Error parsing SSE message:', error);
                    }
                };

                // Listen for specific event types
                this.eventSource.addEventListener('tool_call', (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.notifyListeners('tool_call', data);
                    } catch (error) {
                        console.error('Error parsing tool_call event:', error);
                    }
                });

                this.eventSource.addEventListener('observation', (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.notifyListeners('observation', data);
                    } catch (error) {
                        console.error('Error parsing observation event:', error);
                    }
                });

                this.eventSource.addEventListener('answer', (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.notifyListeners('answer', data);
                    } catch (error) {
                        console.error('Error parsing answer event:', error);
                    }
                });
            } catch (error) {
                console.error('Error creating SSE connection:', error);
                reject(error);
            }
        });
    }

    /**
     * Handle reconnection attempts
     * 
     * @param {string} traceId - The trace ID for the connection
     * @param {Function} reject - The reject function from the connect promise
     */
    handleReconnect(traceId, reject) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
            
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);
            
            setTimeout(() => {
                this.connect(traceId).catch(reject);
            }, delay);
        } else {
            console.error('Maximum reconnect attempts reached');
            this.notifyListeners('error', { message: 'Connection lost. Please refresh the page.' });
            reject(new Error('Maximum reconnect attempts reached'));
        }
    }

    /**
     * Disconnect from the server
     */
    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
            console.log('SSE connection closed');
        }
    }

    /**
     * Add an event listener
     * 
     * @param {string} event - The event to listen for
     * @param {Function} callback - The callback function
     */
    addEventListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        this.listeners.get(event).push(callback);
    }

    /**
     * Remove an event listener
     * 
     * @param {string} event - The event to remove the listener from
     * @param {Function} callback - The callback function to remove
     */
    removeEventListener(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Notify all listeners of an event
     * 
     * @param {string} event - The event that occurred
     * @param {any} data - The data associated with the event
     */
    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }

    /**
     * Send a message to the server
     * 
     * @param {Object} message - The message to send
     * @returns {Promise<Object>} - A promise that resolves with the response
     */
    async sendMessage(message) {
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;

