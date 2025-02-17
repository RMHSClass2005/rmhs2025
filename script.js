document.addEventListener('DOMContentLoaded', () => {
    const whereButton = document.getElementById('where-button');
    const modal = document.getElementById('modal');
    const whereModalContent = document.getElementById('whereModalContent');
    const whereCloseModal = document.getElementById('whereCloseModal');
    const whereForm = document.getElementById('where-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Open Where modal
    whereButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        whereModalContent.style.display = 'block';
        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    });

    function closeModal() {
        modal.style.display = 'none';
        successMessage.style.display = 'none'; // Hide previous messages
        errorMessage.style.display = 'none';
        whereForm.reset();
    }

    // Close modal when clicking the close button
    whereCloseModal.addEventListener('click', () => {
        closeModal()
    });

    // Close modal when clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal()
        }
    });

    const id = 'AKfycbxVHwABILxB88KJsyxzXzOpWOS-k3LFT46S276LA8qTAH-ytLgXWBNEaSjlS5olgrDk';
    // Handle form submission
    whereForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const file = document.getElementById('fileInput').files[0];

        const reader = new FileReader();
        reader.onload = () => {
            const base64File = reader.result.split(',')[1]; // Remove data URI prefix
            const payload = {
                name,
                description,
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
                            whereForm.reset();
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

