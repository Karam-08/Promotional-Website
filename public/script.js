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

// const email = document.getElementById('email')
// const emailInput = email.value

// if(emailInput || /^[^\s@]+@[^\s@]+\.[^\s@]+$/){
//     return;
// }else{

// }