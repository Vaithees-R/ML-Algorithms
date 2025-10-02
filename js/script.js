// Get the button and the dropdown content
const algoButton = document.getElementById("algoButton");
const algoDropdown = document.getElementById("algoDropdown");

// When the user clicks the button, toggle the dropdown
algoButton.onclick = function() {
    algoDropdown.classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
        if (algoDropdown.classList.contains('show')) {
            algoDropdown.classList.remove('show');
        }
    }
}