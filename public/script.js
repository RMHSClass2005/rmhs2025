document.addEventListener('DOMContentLoaded', () => {
    const rsvpButton = document.getElementById('rsvp-button');
    const modal = document.getElementById('rsvp-modal');
    const closeModal = document.getElementById('close-modal');
    const rsvpForm = document.getElementById('rsvp-form');

    // Open modal
    rsvpButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Close modal when clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle form submission
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const plusOne = document.querySelector('input[name="plusOne"]:checked').value;
        const email = document.getElementById('email').value;

        const data = `${name},${plusOne},${email}\n`;

        // Simulate saving to a CSV file (backend logic required)
        console.log(data);

        // Clear form and close modal
        rsvpForm.reset();
        modal.style.display = 'none';
    });
});
