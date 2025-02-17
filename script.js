document.addEventListener('DOMContentLoaded', () => {
    const rsvpButton = document.getElementById('rsvp-button');
    const guestListButton = document.getElementById('guestListButton')
    const modal = document.getElementById('modal');
    const rsvpModalContent = document.getElementById('rsvpModalContent');
    const guestListModalContent = document.getElementById('guestListModalContent');
    const rsvpCloseModal = document.getElementById('rsvpCloseModal');
    const guestListCloseModal = document.getElementById('guestListCloseModal');
    const rsvpForm = document.getElementById('rsvp-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Open rsvp modal
    rsvpButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        rsvpModalContent.style.display = 'block';
        guestListModalContent.style.display = 'none';
        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    });

    // Open guest list modal
    guestListButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        guestListModalContent.style.display = 'block';
        rsvpModalContent.style.display = 'none';
        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    });

    function closeModal() {
        modal.style.display = 'none';
        successMessage.style.display = 'none'; // Hide previous messages
        errorMessage.style.display = 'none';
        rsvpForm.reset();
    }

    // Close modal when clicking the close button
    rsvpCloseModal.addEventListener('click', () => {
        closeModal()
    });
    guestListCloseModal.addEventListener('click', () => {
        closeModal()
    })
    // Close modal when clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal()
        }
    });

    const id = 'AKfycbxUZ-jvClpEIVpD0ckiQAhGYNZvnaUG1f4ffIDa66x8aRbH89Da4NQQOkUd2uixc1_o';
    // Handle form submission
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const plusOne = document.querySelector('input[name="plusOne"]:checked').value;
        const email = document.getElementById('email').value;
        const file = document.getElementById('fileInput').files[0];

        const reader = new FileReader();
        reader.onload = () => {
            const base64File = reader.result.split(',')[1]; // Remove data URI prefix
            const payload = {
                name,
                email,
                plusOne,
                file: base64File,
            };
            fetch(`https://script.google.com/macros/s/${id}/exec`, {
                method: 'POST',
                redirect: 'follow',
                headers: {'Content-Type': 'text/plain;charset=utf-8'},
                body: JSON.stringify(payload),
            })
                .then(response => response.text())
                .then(result => {
                    const res = JSON.parse(result);
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
        }
        reader.readAsDataURL(file);
    });

    guestListButton.onclick = function () {
        // Fetch the guest list
        fetch(`https://script.google.com/macros/s/${id}/exec`)
            .then(response => response.json())
            .then(data => {
                const guestListDiv = document.getElementById('guest-list');
                guestListDiv.innerHTML = ''; // Clear any previous content

                // Populate the modal with the guest list
                data.forEach(guest => {
                    const guestItem = document.createElement('p');
                    guestItem.classList.add('guest-item');
                    guestItem.innerHTML = `${guest.name} ${guest.bringingPlusOne.toLowerCase() === "yes" ? '+1' : ''}`;
                    guestListDiv.appendChild(guestItem);
                });

                // Show the modal
                document.getElementById('guestListModal').style.display = 'block';
            })
            .catch(error => console.error('Error fetching data: ', error));
    };

// Handle form submission
    const contactForm = document.getElementById('contact-form')
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Send the form data to EmailJS
        emailjs.sendForm('rmhsclass2005', 'template_t8zgsc8', contactForm)
            .then(function (response) {
                console.log('Message sent successfully', response);
                alert('Your message has been sent!');
            }, function (error) {
                console.log('Error sending message', error);
                alert('Something went wrong. Please try again later.');
            });
    });
});

