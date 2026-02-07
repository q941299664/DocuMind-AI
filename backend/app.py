from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({
        "message": "欢迎使用 DocuMind AI API",
        "status": "running"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
