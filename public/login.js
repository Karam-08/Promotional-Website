form = document.getElementById("form")

form.addEventListener('submit', async(e) =>{ // Form submission
    e.preventDefault()

    const formData = Object.fromEntries(new FormData(form).entries())

    try{
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData) 
        })
        
        let result; // checks if the server responded with a successful status
        if(res.ok){ // if yes
            result = await res.json() // parse the json into result

            localStorage.setItem('user', JSON.stringify(result.user)) // Stores the logged in info to local storage
            // This lets the admin page know who is logged in

            if(result.user.role === "admin"){ // so if they are an admin,
                window.location.href = "/admin" // they go to the admin page.
            }else{ // if not,
                window.location.href = "/" // they go to the homepage
            }
        }else{ // if the response is bad
            const text = await res.text();
            alert(text || "Login failed") // Shows the response text and puts it in an alert or says "Login failed" if the response text is empty
        }
    }catch(err){
        console.error("Login failed:", err)
        alert("Network error. Please try again.")
    }
})