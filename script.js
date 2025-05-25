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
        const submitBtn = document.getElementById('modalSubmitButton');
        modal.style.display = 'none';
        successMessage.style.display = 'none'; // Hide previous messages
        errorMessage.style.display = 'none';
        whereForm.reset();
        document.getElementById('fileInput').value = '';
        document.getElementById('filePreview').innerHTML = '';
        submitBtn.disabled = false;
        submitBtn.classList.remove('disabled');
        submitBtn.textContent = 'Submit'
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

        // Disable the submit button
        const submitBtn = document.getElementById('modalSubmitButton');
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled');
        submitBtn.textContent = 'Submitting, please wait...';

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
                        successMessage.style.display = 'block';
                        errorMessage.style.display = 'none';
                        setTimeout(() => {
                            closeModal()
                        }, 5000)
                    } else {
                        successMessage.style.display = 'none';
                        errorMessage.style.display = 'block';
                    }
                })
                .catch(() => {
                    successMessage.style.display = 'none';
                    errorMessage.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('disabled');
                    submitBtn.textContent = 'Submit';
                })
        };
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

// Add a preview for the file upload
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const previewContainer = document.getElementById("filePreview");

    fileInput.addEventListener("change", () => {
        previewContainer.innerHTML = ""; // Clear previous

        const file = fileInput.files[0];
        if (!file) return;

        if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.alt = "Image preview";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "200px";
            img.style.marginTop = "0.5rem";
            previewContainer.appendChild(img);
        } else {
            const text = document.createElement("p");
            text.textContent = `Selected file: ${file.name}`;
            previewContainer.appendChild(text);
        }
    });
});
