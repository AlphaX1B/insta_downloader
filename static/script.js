function startDownload() {
    let url = document.getElementById("url").value.trim();
    let errorMsg = document.getElementById("error-message");
    let progressBar = document.getElementById("progress-bar");
    let progressContainer = document.getElementById("progress-container");
    let progressText = document.getElementById("progress-text");

    errorMsg.textContent = "";
    if (!url) {
        errorMsg.textContent = "⚠ Please enter a valid Instagram URL.";
        return;
    }

    progressContainer.style.display = "block";
    progressBar.style.width = "0%";
    progressText.textContent = "Starting download...";

    let fakeProgress = 0;
    let interval = setInterval(() => {
        fakeProgress += 10;
        progressBar.style.width = fakeProgress + "%";
        if (fakeProgress >= 100) {
            clearInterval(interval);
            progressText.textContent = "Preparing your file...";
        }
    }, 300);

    fetch("/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to download.");
        }
        return response.blob();
    })
    .then(blob => {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "instagram_download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        progressText.textContent = "✅ Download complete!";
        progressBar.style.width = "100%";
    })
    .catch(err => {
        errorMsg.textContent = "⚠ " + err.message;
        progressContainer.style.display = "none";
    });
}
