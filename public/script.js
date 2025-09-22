const infoSection = document.getElementById('hidden')
const toggle = document.getElementById('toggleInfo')

toggle.addEventListener('click', function(e){
    e.preventDefault()
    infoSection.classList.toggle('hidden')
    if(infoSection.classList.contains('hidden')){
        toggle.textContent = 'More Information'
    }else{
        toggle.textContent = 'Hide Information'
    }
})