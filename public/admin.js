const user = JSON.parse(localStorage.getItem("user")) // Gets the current logged in user

if(!user || user.role !== "admin"){ // If they are not signed in or they are not an admin,
    alert("Admins only.")
    window.location.href = "/login" // redirect them to the login page
}

async function loadSubmissions(filters){ // Mainly for filters
    try{
        const res = await fetch('/admin/api/submissions', { // Gets all of the submissions
            headers: {'x-admin-role': user.role}
        }); 
        const data = await res.json();

        let submissions = data.submissions || [];
        filters = filters || {}; // Just in case filters is undefined

        // The submissions are put through filters
        if(filters.email){
            submissions = submissions.filter(s => s.email && s.email.toLowerCase().includes(filters.email.toLowerCase()));
        }
        if(filters.interest && filters.interest !== 'none'){
            submissions = submissions.filter(s => s.interest === filters.interest);
        }
        if(filters.startDate){
            submissions = submissions.filter(s => new Date(s.createdAt) >= new Date(filters.startDate));
        }
        if(filters.endDate){
            submissions = submissions.filter(s => new Date(s.createdAt) <= new Date(filters.endDate));
        }

        renderSubmission(submissions); // Then the submissions are displayed
    }catch(err){
        console.error('Error loading submissions:', err);
    }
}

async function renderSubmission(submissions){ // Shows the actual submissions
    const container = document.getElementById('submissionsContainer');
    container.innerHTML = ''; // Clears container before rendering new submissions

    if(submissions.length === 0){ // If no submissions
        container.innerHTML = '<p>No submissions found.</p>'; // display error
        return;
    }

    submissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sorts by newest first

    submissions.forEach((submission, index) =>{ // For each submission
        const div = document.createElement('div');
        div.classList.add('submission');
        div.innerHTML = `
            <h3>Submission #${index + 1}</h3>
            <pre>${JSON.stringify(submission, null, 2)}</pre>
            <div class="controls">
                <button onclick="approveSubmission('${submission.id}')">Approve</button>
                <button onclick="archiveSubmission('${submission.id}')">Archive</button>
                <button onclick="deleteSubmission('${submission.id}')">Delete</button>
        `; // adds the submission, a title, and buttons to control the submissions. <pre> makes the submission info look like JSON.
        container.appendChild(div);
    });
}

// Updates submission status to "approved"
async function approveSubmission(id){
    await fetch(`/admin/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-role': user.role
        },
        body: JSON.stringify({status: 'approved'})
    });
    loadSubmissions();
}

// Updates submission status to "archived"
async function archiveSubmission(id){
    await fetch(`/admin/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-role': user.role
        },
        body: JSON.stringify({status: 'archived'})
    });
    loadSubmissions();
}

// Deletes the submission
async function deleteSubmission(id){
    await fetch(`/admin/api/submissions/${id}`, {
        method: 'DELETE',
        headers: {'x-admin-role': user.role}
    });
    loadSubmissions();
}

// Filters the form
document.getElementById('filter-form').addEventListener('submit', (e) =>{
    e.preventDefault();
    const filters = Object.fromEntries(new FormData(e.target).entries()); 
    // collects all the input filter fields, then converts them into key value pairs, then converts that into an object
    loadSubmissions(filters); // reloads submissions using that filter object
});

// Resets the filters
document.getElementById('resetFilters').addEventListener('click', () =>{
    document.getElementById('filter-form').reset();
    loadSubmissions();
});

loadSubmissions();