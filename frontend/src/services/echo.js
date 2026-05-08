import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = (import.meta.env.VITE_REVERB_ENABLED === 'true') 
    ? new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${import.meta.env.VITE_API_URL.replace('/api', '')}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                Accept: 'application/json',
            },
        },
    })
    : { 
        private: () => ({ 
            listen: () => ({ listen: () => {} }), 
            notification: () => {},
            stopListening: () => {} 
        }),
        connector: { options: { auth: { headers: {} } } }
    };

// Helper to update the token dynamically
export const updateEchoToken = (token) => {
    if (echo.connector.options.auth) {
        echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
    }
};

export default echo;
