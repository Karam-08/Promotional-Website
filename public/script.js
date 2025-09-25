const infoSection = document.getElementById('hidden')
const toggle = document.getElementById('toggleInfo')

toggle.addEventListener('click', function(e){
    e.preventDefault()
    if(infoSection.classList.contains('hidden')){
        toggle.textContent = 'Hide Information'
        infoSection.classList.replace('hidden', 'show')
    }else{
        toggle.textContent = 'Show Information'
        infoSection.classList.replace('show', 'hidden')
    }
})

form.addEventListener('submit', async (e) =>{
    e.preventDefault()

    // Gather form data
    const formData = Object.fromEntries(new FormData(form).entries())

    try{
        const res = await fetch('/api/info', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })

        const result = await res.json()

        if(res.ok){
            alert(result.message || "Submitted successfully!")
            form.reset() // 🔹 Optional: clear the form after submit
        }else{
            alert("Error: " + (result.error || "Something went wrong"))
        }
    }catch(err){
        console.error("Submit failed:", err)
        alert("Network error. Please try again.")
    }
})