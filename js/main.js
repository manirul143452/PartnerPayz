// PartnerPayz Main JavaScript
// This file contains all functionality for the PartnerPayz platform

document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initNavigation();
  initMobileMenu();
  initUserProfile();
  initNotifications();
  initFinancialTools();
  initPartnerFeatures();
  
  // Check if toast container exists, create if not
  if (!document.getElementById('toastContainer')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
});

// Navigation functionality
function initNavigation() {
  // Handle active navigation links
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.main-nav a, .nav-links a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.includes(linkPath) && linkPath !== '#' && linkPath !== '/') {
      link.parentElement.classList.add('active');
    }
  });
  
  // Logout button handling (simulate logout without requiring actual login)
  const logoutButtons = document.querySelectorAll('#navLogoutBtn, #logoutBtn');
  logoutButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Logged out successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      });
    }
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-toggle, .mobile-menu-btn');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const navLinks = document.querySelector('.main-nav, .nav-links');
      if (navLinks) {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
      }
    });
  }
}

// User profile dropdown functionality
function initUserProfile() {
  const userProfileMenu = document.getElementById('userProfileMenu');
  const userMenus = document.querySelectorAll('.user-menu, .user-avatar');
  
  userMenus.forEach(menu => {
    if (menu) {
      menu.addEventListener('click', (e) => {
        // Toggle dropdown menu
        const dropdown = menu.querySelector('.dropdown-menu');
        if (dropdown) {
          dropdown.classList.toggle('active');
        }
        
        // Prevent closing when clicking inside the dropdown
        e.stopPropagation();
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  });
}

// Notifications functionality
function initNotifications() {
  // Update notification badge
  updateNotificationBadge(3); // Show 3 notifications by default
  
  // Set up notification icon click handler
  const notificationIcon = document.getElementById('notificationIcon');
  if (notificationIcon) {
    notificationIcon.addEventListener('click', () => {
      // Simulate viewing notifications
      updateNotificationBadge(0);
      showToast('Notifications marked as read', 'success');
    });
  }
}

// Update notification badge with count
function updateNotificationBadge(count) {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

// Financial tools functionality
function initFinancialTools() {
  // Dashboard overview card interactions
  const overviewCards = document.querySelectorAll('.overview-card');
  overviewCards.forEach(card => {
    if (card) {
      card.addEventListener('click', () => {
        card.classList.add('pulse');
        setTimeout(() => {
          card.classList.remove('pulse');
        }, 500);
      });
    }
  });
  
  // Activity list item interactions
  const activityItems = document.querySelectorAll('.activity-item');
  activityItems.forEach(item => {
    if (item) {
      item.addEventListener('click', () => {
        showToast('Activity details would open here', 'info');
      });
    }
  });
}

// Partner features functionality
function initPartnerFeatures() {
  // Partner card interactions
  const partnerCards = document.querySelectorAll('.partner-card');
  partnerCards.forEach(card => {
    if (card) {
      // Like button
      const likeBtn = card.querySelector('[data-tooltip="Like"]');
      if (likeBtn) {
        likeBtn.addEventListener('click', () => {
          likeBtn.classList.toggle('active');
          showToast('Partner added to favorites', 'success');
        });
      }
      
      // Message button
      const msgBtn = card.querySelector('[data-tooltip="Message"]');
      if (msgBtn) {
        msgBtn.addEventListener('click', () => {
          showToast('Message feature would open here', 'info');
        });
      }
    }
  });
  
  // Filter form handling
  const filterForm = document.getElementById('partner-filter-form');
  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Filters applied', 'success');
    });
  }
}

// Send a simulated message to a partner
function sendMessage(partnerId, message) {
  console.log(`Sending message to partner ${partnerId}: ${message}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, messageId: Date.now() });
      showToast('Message sent successfully', 'success');
    }, 500);
  });
}

// Toast notification function (global)
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = document.createElement('i');
  icon.className = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
  
  const content = document.createElement('span');
  content.textContent = message;
  
  toast.appendChild(icon);
  toast.appendChild(content);
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

// Format currency for display
function formatCurrency(amount, currencyCode = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(amount);
}

// Format date for display
function formatDate(date, format = 'short') {
  const dateObj = new Date(date);
  
  if (format === 'short') {
    return dateObj.toLocaleDateString();
  } else if (format === 'long') {
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else if (format === 'relative') {
    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
  
  return dateObj.toLocaleDateString();
}

// Utility function to debounce function calls
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create notification item
function createNotificationItem(type, message, timestamp) {
  const item = document.createElement('li');
  item.className = 'notification-item';
  
  const iconClass = type === 'payment' ? 'fa-money-bill-wave' :
                    type === 'reminder' ? 'fa-calendar' :
                    type === 'message' ? 'fa-envelope' :
                    type === 'alert' ? 'fa-exclamation-circle' : 'fa-bell';
  
  item.innerHTML = `
    <div class="notification-icon ${type}">
      <i class="fas ${iconClass}"></i>
    </div>
    <div class="notification-content">
      <p class="notification-text">${message}</p>
      <p class="notification-time">${formatDate(timestamp, 'relative')}</p>
    </div>
    <div class="notification-actions">
      <button class="notification-action mark-read" title="Mark as read">
        <i class="fas fa-check"></i>
      </button>
      <button class="notification-action delete" title="Delete">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  
  return item;
}
