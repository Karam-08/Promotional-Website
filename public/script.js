const infoSection = document.getElementById('hidden')
const toggle = document.getElementById('toggleInfo') // Buttons
const form = document.getElementById('form')

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

form.addEventListener('submit', async(e) =>{ // Form submission
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(form).entries()) // Gathers the form data
    // collects all the input fields, then converts them into key value pairs, and then converts that into an object

    try{
        const res = await fetch('/submit-form', { // Post request
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData) // converts form data to a JSON string
        })
        const result = await res.json()
        if(res.ok){
            alert(result.message || "Submitted successfully!")
            form.reset() // Clears the form after submission
        }else{
            alert("Error: " + (result.error || "Something went wrong")) // Shows the result error or says "Something went wrong" if the result.error is empty
        }
    }catch(err){
        console.error("Submit failed:", err)
        alert("Network error. Please try again.")
    }
})