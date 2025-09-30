async function loadSubmissions(){
    try{
        const res = await fetch('/admin/api/submissions'); // Gets the submissions
        const data = await res.json();

        const container = document.getElementById('submissionsContainer');
        container.innerHTML = ''; // Refresh

        if(data.submissions.length === 0){ // If there's no submissions,
            container.innerHTML = '<p>No submissions found.</p>'; // let the admin know
            return;
        }

        data.submissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sorts by newest first

        data.submissions.forEach((submission, index) =>{
            const div = document.createElement('div');
            div.classList.add('submission');
            div.innerHTML = `
                <h3>Submission #${index + 1}</h3>
                <pre>${JSON.stringify(submission, null, 2)}</pre>
                <div class="controls">
                    <button onclick="approveSubmission('${submission.id}')">Approve</button>
                    <button onclick="archiveSubmission('${submission.id}')">Archive</button>
                    <button onclick="deleteSubmission('${submission.id}')">Delete</button>
            `; // <pre> makes it look like the JSON text
            container.appendChild(div);
        });
    }catch(err){
        console.error('Error loading submissions:', err);
    }
}

async function approveSubmission(id){
    await fetch(`/admin/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: 'approved'})
    });
    loadSubmissions();
}
async function archiveSubmission(id){
    await fetch(`/admin/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: 'archived'})
    });
    loadSubmissions();
}
async function deleteSubmission(id){
    await fetch(`/admin/api/submissions/${id}`, {
        method: 'DELETE',
    });
    loadSubmissions();
}

// Filter form
document.getElementById('filter-form').addEventListener('submit', (e) =>{
    e.preventDefault();
    const filters = Object.fromEntries(new FormData(e.target).entries());
    loadSubmissions(filters);
});

// Reset filters
document.getElementById('resetFilters').addEventListener('click', () =>{
    document.getElementById('filter-form').reset();
    loadSubmissions();
});

loadSubmissions();

