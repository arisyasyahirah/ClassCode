// faq-submissions.js
// Static storage for FAQ submissions

let faqSubmissions = [
    // Example submissions (you can pre-populate if needed)
    // {
    //     id: 1,
    //     name: "John Doe",
    //     email: "john@example.com",
    //     subject: "Java",
    //     question: "How does garbage collection work in Java?",
    //     date: "2025-01-15T10:30:00Z",
    //     status: "pending"
    // }
];

// Function to add new FAQ submission
function addFAQSubmission(name, email, subject, question) {
    const newSubmission = {
        id: Date.now(), // Simple ID based on timestamp
        name: name,
        email: email,
        subject: subject,
        question: question,
        date: new Date().toISOString(),
        status: "pending" // pending, answered, archived
    };
    
    faqSubmissions.push(newSubmission);
    return newSubmission;
}

// Function to get all submissions
function getAllSubmissions() {
    return [...faqSubmissions]; // Return a copy to prevent direct manipulation
}

// Function to get submissions by status
function getSubmissionsByStatus(status) {
    return faqSubmissions.filter(submission => submission.status === status);
}

// Function to get submissions by subject
function getSubmissionsBySubject(subject) {
    return faqSubmissions.filter(submission => submission.subject === subject);
}

// Function to update submission status
function updateSubmissionStatus(id, newStatus) {
    const submission = faqSubmissions.find(sub => sub.id === id);
    if (submission) {
        submission.status = newStatus;
        return true;
    }
    return false;
}

// Function to get total submission count
function getSubmissionCount() {
    return faqSubmissions.length;
}

// Function to clear all submissions (for admin use)
function clearAllSubmissions() {
    faqSubmissions = [];
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('faqForm');
    const submissionsContainer = document.getElementById('submissionsContainer');
    
    // Load existing submissions from localStorage on page load
    loadSubmissions();
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('questionName').value;
        const email = document.getElementById('questionEmail').value;
        const subject = document.getElementById('questionSubject').value;
        const question = document.getElementById('questionText').value;
        
        // Create submission object
        const submission = {
            name: name,
            email: email,
            subject: subject,
            question: question,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Add submission to display
        addSubmissionToDisplay(submission);
        
        // Save to localStorage
        saveSubmission(submission);
        
        // Reset form
        form.reset();
        
        // Optional: Show success message
        showSuccessMessage();
    });
    
    function addSubmissionToDisplay(submission) {
        // Remove "no submissions" message if it exists
        const noSubmissions = submissionsContainer.querySelector('.no-submissions');
        if (noSubmissions) {
            noSubmissions.remove();
        }
        
        // Create submission card
        const card = document.createElement('div');
        card.className = 'submission-card';
        
        card.innerHTML = `
            <div class="submission-header">
                <div class="submission-name">${escapeHtml(submission.name)}</div>
                <span class="submission-subject">${escapeHtml(submission.subject)}</span>
            </div>
            <div class="submission-email">${escapeHtml(submission.email)}</div>
            <div class="submission-question">${escapeHtml(submission.question)}</div>
            <div class="submission-date">Submitted on ${submission.date}</div>
        `;
        
        // Add to top of container
        submissionsContainer.insertBefore(card, submissionsContainer.firstChild);
    }
    
    function saveSubmission(submission) {
        // Get existing submissions from localStorage
        let submissions = JSON.parse(localStorage.getItem('faqSubmissions')) || [];
        
        // Add new submission to beginning of array
        submissions.unshift(submission);
        
        // Keep only last 20 submissions
        if (submissions.length > 20) {
            submissions = submissions.slice(0, 20);
        }
        
        // Save back to localStorage
        localStorage.setItem('faqSubmissions', JSON.stringify(submissions));
    }
    
    function loadSubmissions() {
        const submissions = JSON.parse(localStorage.getItem('faqSubmissions')) || [];
        
        if (submissions.length > 0) {
            // Remove "no submissions" message
            const noSubmissions = submissionsContainer.querySelector('.no-submissions');
            if (noSubmissions) {
                noSubmissions.remove();
            }
            
            // Add each submission to display
            submissions.forEach(submission => {
                const card = document.createElement('div');
                card.className = 'submission-card';
                
                card.innerHTML = `
                    <div class="submission-header">
                        <div class="submission-name">${escapeHtml(submission.name)}</div>
                        <span class="submission-subject">${escapeHtml(submission.subject)}</span>
                    </div>
                    <div class="submission-email">${escapeHtml(submission.email)}</div>
                    <div class="submission-question">${escapeHtml(submission.question)}</div>
                    <div class="submission-date">Submitted on ${submission.date}</div>
                `;
                
                submissionsContainer.appendChild(card);
            });
        }
    }
    
    function showSuccessMessage() {
        // Create and show temporary success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Your question has been submitted successfully!';
        successMsg.style.cssText = `
            background-color: #d4edda;
            color: #155724;
            padding: 12px;
            border-radius: 4px;
            margin-top: 15px;
            text-align: center;
            animation: fadeIn 0.5s;
        `;
        
        form.appendChild(successMsg);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            successMsg.style.opacity = '0';
            successMsg.style.transition = 'opacity 0.5s';
            setTimeout(() => successMsg.remove(), 500);
        }, 5000);
    }
    
    // Helper function to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
