/**
 * PartnerPayz Service Worker
 * Provides offline support and caching for the application
 */

const CACHE_NAME = 'partnerpayz-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/minimal-login.html',
    '/register.html',
    '/profile.html',
    '/notifications.html',
    '/css/styles.css',
    '/css/dashboard.css',
    '/css/auth.css',
    '/css/toast.css',
    '/js/main.js',
    '/js/local-storage-debug.js',
    '/js/local-notifications.js',
    '/images/logo.svg',
    '/images/user-avatar.svg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    
    // Skip waiting to ensure the new service worker activates immediately
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    console.log('[Service Worker] Removing old cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
    
    // Ensure the service worker takes control immediately
    return self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin) &&
        !event.request.url.startsWith('https://cdnjs.cloudflare.com')) {
        return;
    }
    
    // For HTML pages - network first, then cache
    if (event.request.headers.get('Accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Clone the response to put one copy in cache and return the other
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request)
                        .then(cachedResponse => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            return caches.match('/minimal-login.html');
                        });
                })
        );
        return;
    }
    
    // For other assets - cache first, then network
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // If found in cache, return it
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Otherwise, fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response to put one copy in cache and return the other
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            });
                        return response;
                    })
                    .catch(error => {
                        console.error('[Service Worker] Fetch error:', error);
                    });
            })
    );
});

// Push notification event
self.addEventListener('push', event => {
    console.log('[Service Worker] Push received');
    
    let notificationData = {};
    if (event.data) {
        try {
            notificationData = event.data.json();
        } catch (e) {
            notificationData = {
                title: 'New Notification',
                body: event.data.text(),
                icon: '/images/logo.svg'
            };
        }
    }
    
    const title = notificationData.title || 'PartnerPayz Notification';
    const options = {
        body: notificationData.body || 'You have a new notification',
        icon: notificationData.icon || '/images/logo.svg',
        badge: '/images/logo.svg',
        data: notificationData.data || {}
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification click received');
    
    event.notification.close();
    
    const urlToOpen = new URL('/notifications.html', self.location.origin).href;
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(windowClients => {
            // Check if there's already a window open
            for (const client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // If not, open a new window/tab
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
}); 