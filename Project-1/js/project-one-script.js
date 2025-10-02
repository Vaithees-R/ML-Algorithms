document.addEventListener('DOMContentLoaded', () => {
    // Select all the boxes we want to animate
    const animatedBoxes = document.querySelectorAll('.project-info-box');

    // Set up the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the box is in the viewport (on screen)
            if (entry.isIntersecting) {
                // Add the .is-visible class to trigger the animation
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the item is visible
    });

    // Tell the observer to watch each of our boxes
    animatedBoxes.forEach(box => {
        observer.observe(box);
    });
});