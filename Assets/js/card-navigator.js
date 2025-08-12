// CardNavigator Plugin - Navigation functionality

(function() {
    'use strict';
    
    // Check for task detail view - multiple detection methods for reliability
    var isTaskDetailView = false;
    
    // Method 1: Check body attributes
    if (document.body.getAttribute('data-controller') === 'TaskViewController' && 
        document.body.getAttribute('data-action') === 'show') {
        isTaskDetailView = true;
    }
    
    // Method 2: Check URL parameters (fallback)
    if (!isTaskDetailView && window.location.search.includes('controller=TaskViewController') && 
        window.location.search.includes('action=show')) {
        isTaskDetailView = true;
    }
    
    // Method 3: Check for task detail elements (fallback)
    if (!isTaskDetailView && document.querySelector('.task-show')) {
        isTaskDetailView = true;
    }
    
    // Exit if not on task detail view
    if (!isTaskDetailView) {
        return;
    }

    var taskId = getTaskIdFromUrl();
    if (!taskId) return;

    // Create navigation buttons
    createNavigationButtons();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && !e.shiftKey && !e.altKey) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateToTask('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateToTask('next');
            }
        }
    });

    function getTaskIdFromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('task_id');
    }

    function createNavigationButtons() {
        var container = document.createElement('div');
        container.className = 'card-nav-buttons';
        
        var prevBtn = document.createElement('button');
        prevBtn.className = 'card-nav-btn';
        prevBtn.innerHTML = '←';
        prevBtn.title = 'Previous card (Ctrl+Left)';
        prevBtn.onclick = function() { navigateToTask('prev'); };
        
        var nextBtn = document.createElement('button');
        nextBtn.className = 'card-nav-btn';
        nextBtn.innerHTML = '→';
        nextBtn.title = 'Next card (Ctrl+Right)';
        nextBtn.onclick = function() { navigateToTask('next'); };
        
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
        document.body.appendChild(container);
    }

    function navigateToTask(direction) {
        var url = '?controller=CardNavigatorController&action=' + direction + 
                  '&task_id=' + taskId + '&plugin=CardNavigator';
        window.location.href = url;
    }
})();