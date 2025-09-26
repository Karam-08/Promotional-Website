const infoSection = document.getElementById('hidden')
const toggle = document.getElementById('toggleInfo') // Buttons

toggle.addEventListener('click', function(e){ // Toggles information showing
    e.preventDefault()
    if(infoSection.classList.contains('hidden')){ // Shows information
        toggle.textContent = 'Hide Information'
        infoSection.classList.replace('hidden', 'show')
    }else{ // Hides information
        toggle.textContent = 'Show Information'
        infoSection.classList.replace('show', 'hidden')
    }
})

form.addEventListener('submit', async (e) =>{ // Form submission
    e.preventDefault()

    // Gather form data
    const formData = Object.fromEntries(new FormData(form).entries())

    try{
        const res = await fetch('/submit-form', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })

        const result = await res.json()

        if(res.ok){
            alert(result.message || "Submitted successfully!")
            form.reset() // Clears the form after submission
        }else{
            alert("Error: " + (result.error || "Something went wrong")) // Error
        }
    }catch(err){
        console.error("Submit failed:", err)
        alert("Network error. Please try again.")
    }
})