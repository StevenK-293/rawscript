from flask import Flask, Response
import requests

app = Flask(__name__)

raw_script_table = {
    'test': 'https://raw.githubusercontent.com/StevenK-293/rawscript/main/raw/scripts/main_1.lua',
}

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the home page."

@app.route('/api', methods=['GET'])
def api_info():
    instructions = """
    Welcome to the API endpoint.
    
    Usage:
    - /api/raw/<script_name>: Fetches the content of the script.
    
    Available Scripts:
    - test: Retrieves main_1.lua script from GitHub.
    """
    return Response(instructions, mimetype='text/plain')

@app.route('/api/raw/<script_name>', methods=['GET'])
def get_code(script_name):
    if script_name not in raw_script_table:
        return "Script not found", 404
    
    file_url = raw_script_table[script_name]

    try:
        response = requests.get(file_url)
        if response.status_code == 200:
            code_content = response.text
            return Response(code_content, mimetype='text/plain')
        elif response.status_code == 404:
            return "Script not found", 404
        else:
            return "Failed to fetch script", response.status_code
    except requests.exceptions.RequestException as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True)
