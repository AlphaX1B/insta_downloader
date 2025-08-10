from flask import Flask, request, send_file, render_template, jsonify
import instaloader
import os
import tempfile
import shutil
import time

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/download", methods=["POST"])
def download():
    url = request.json.get("url", "").strip()
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    temp_dir = tempfile.mkdtemp()
    loader = instaloader.Instaloader(dirname_pattern=temp_dir, save_metadata=False)

    try:
        shortcode = url.split("/")[-2]
        post = instaloader.Post.from_shortcode(loader.context, shortcode)
        loader.download_post(post, target=shortcode)

        file_folder = os.path.join(temp_dir, shortcode)
        for file in os.listdir(file_folder):
            if file.endswith((".jpg", ".mp4")):
                file_path = os.path.join(file_folder, file)
                # Simulate short delay for progress bar effect
                time.sleep(2)
                return send_file(file_path, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        shutil.rmtree(temp_dir)

if __name__ == "__main__":
    app.run(debug=True)
