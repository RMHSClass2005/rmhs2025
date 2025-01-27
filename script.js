document.addEventListener('DOMContentLoaded', () => {
    const rsvpButton = document.getElementById('rsvp-button');
    const modal = document.getElementById('rsvp-modal');
    const closeModal = document.getElementById('close-modal');
    const rsvpForm = document.getElementById('rsvp-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Open modal
    rsvpButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        successMessage.style.display = 'none'; // Hide previous messages
        errorMessage.style.display = 'none';
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
        successMessage.style.display = 'none'; // Hide previous messages
        errorMessage.style.display = 'none';
        rsvpForm.reset();
    });

    // Handle form submission
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const plusOne = document.querySelector('input[name="plusOne"]:checked').value;
        const email = document.getElementById('email').value;

        const formData = { name, plusOne, email };

        const id = 'AKfycbwpLJK-O-d-qG4aZjNEyboLnkof72FtJfJI_AxaSm-Clx8ZJvOub9gxXUx4Ph1P4sCp';

        fetch(`https://script.google.com/macros/s/${id}/exec`, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': "text/plain;charset=utf-8"
            }
        })
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result);
                console.log(res);
                if (res.status === "success") {
                    // Show success message
                    successMessage.style.display = 'block';
                    errorMessage.style.display = 'none';
                    setTimeout(() => {
                        // Clear form and close modal
                        rsvpForm.reset();
                        modal.style.display = 'none';
                    }, 5000)
                } else {
                    // Show error message
                    successMessage.style.display = 'none';
                    errorMessage.style.display = 'block';
                }
            })
            .catch(() => {
                // In case of error during the fetch request
                successMessage.style.display = 'none';
                errorMessage.style.display = 'block';
            });
    });
});
