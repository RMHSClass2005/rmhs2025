document.addEventListener('DOMContentLoaded', () => {
    const dropzone  = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileCount = document.getElementById('fileCount');
    const statusEl  = document.getElementById('status');

    const devId  = 'AKfycbwRcAWpHqrhklzVdKz-KHUBMwvhfJAzemITd8O-cNkBZrIYSj4hpt2UXjhLXX_F4bA-';
    const prodId = 'AKfycbzqrddVkMWpYTIMo11IE4IOruY4s9w4um-T7hKTtCqs3S3QwaznomTqkTHLmMBmfyLQ';
    const scriptId = location.hostname === 'localhost' ? devId : prodId;

    function updateFileCount() {
        const count = fileInput.files.length;
        if (count === 0) {
            fileCount.textContent = 'No files selected yet';
            uploadBtn.disabled = true;
        } else if (count === 1) {
            fileCount.textContent = '1 file selected';
            uploadBtn.disabled = false;
        } else {
            fileCount.textContent = `${count} files selected`;
            uploadBtn.disabled = false;
        }
    }

    // Tap big square -> open picker
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', updateFileCount);

    uploadBtn.addEventListener('click', async () => {
        const files = fileInput.files;
        if (!files || files.length === 0) return;

        statusEl.textContent = 'Uploading...';
        uploadBtn.disabled = true;

        try {
            for (const file of files) {
                const base64File = await readFileAsBase64(file);

                const payload = {
                    filename: file.name,
                    mimeType: file.type || 'application/octet-stream',
                    file: base64File,
                };

                const res = await fetch(`https://script.google.com/macros/s/${scriptId}/exec`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(payload),
                });

                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch {
                    throw new Error('Bad response from server');
                }

                if (data.status !== 'success') {
                    throw new Error(data.message || 'Upload failed');
                }
            }

            statusEl.textContent = 'Thanks! Your files were uploaded.';
            fileInput.value = '';
            updateFileCount();
        } catch (err) {
            console.error(err);
            statusEl.textContent = 'Something went wrong. Please try again.';
        } finally {
            uploadBtn.disabled = false;
        }
    });

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
});
