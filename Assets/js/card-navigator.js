// CardNavigator Plugin - Navigation functionality

(function() {
    'use strict';
    
    console.log('CardNavigator: Script loaded');
    
    // Check what page we're on
    console.log('CardNavigator: Current URL:', window.location.href);
    console.log('CardNavigator: Body data-controller:', document.body.getAttribute('data-controller'));
    console.log('CardNavigator: Body data-action:', document.body.getAttribute('data-action'));
    
    // More flexible detection - check for task detail view
    var isTaskDetailView = false;
    
    // Method 1: Check body attributes
    if (document.body.getAttribute('data-controller') === 'TaskViewController' && 
        document.body.getAttribute('data-action') === 'show') {
        isTaskDetailView = true;
        console.log('CardNavigator: Detected via body attributes');
    }
    
    // Method 2: Check URL parameters (fallback)
    if (!isTaskDetailView && window.location.search.includes('controller=TaskViewController') && 
        window.location.search.includes('action=show')) {
        isTaskDetailView = true;
        console.log('CardNavigator: Detected via URL parameters');
    }
    
    // Method 3: Check for task detail elements (fallback)
    if (!isTaskDetailView && document.querySelector('.task-show')) {
        isTaskDetailView = true;
        console.log('CardNavigator: Detected via CSS selector');
    }
    
    if (!isTaskDetailView) {
        console.log('CardNavigator: Not on task detail view, script stopping');
        return;
    }
    
    console.log('CardNavigator: On task detail view, initializing...');

    var taskId = getTaskIdFromUrl();
    if (!taskId) {
        console.log('CardNavigator: No task ID found');
        return;
    }
    
    console.log('CardNavigator: Task ID:', taskId);

    // Create navigation buttons
    createNavigationButtons();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && !e.shiftKey && !e.altKey) {
            if (e.key === 'ArrowLeft') {
                console.log('CardNavigator: Ctrl+Left pressed');
                e.preventDefault();
                navigateToTask('prev');
            } else if (e.key === 'ArrowRight') {
                console.log('CardNavigator: Ctrl+Right pressed');
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
        console.log('CardNavigator: Creating navigation buttons');
        
        var container = document.createElement('div');
        container.className = 'card-nav-buttons';
        
        var prevBtn = document.createElement('button');
        prevBtn.className = 'card-nav-btn';
        prevBtn.innerHTML = '←';
        prevBtn.title = 'Previous card (Ctrl+Left)';
        prevBtn.onclick = function() { 
            console.log('CardNavigator: Previous button clicked');
            navigateToTask('prev'); 
        };
        
        var nextBtn = document.createElement('button');
        nextBtn.className = 'card-nav-btn';
        nextBtn.innerHTML = '→';
        nextBtn.title = 'Next card (Ctrl+Right)';
        nextBtn.onclick = function() { 
            console.log('CardNavigator: Next button clicked');
            navigateToTask('next'); 
        };
        
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
        document.body.appendChild(container);
        
        console.log('CardNavigator: Navigation buttons created and added to page');
    }

    function navigateToTask(direction) {
        var url = '?controller=CardNavigatorController&action=' + direction + 
                  '&task_id=' + taskId + '&plugin=CardNavigator';
        console.log('CardNavigator: Navigating to:', url);
        window.location.href = url;
    }
})();