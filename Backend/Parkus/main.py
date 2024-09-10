# main.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import data_store

app = Flask(__name__)
CORS(app)

@app.route('/api/users/<int:userid>/schedule', methods=['GET'])
def api_get_user_schedule(userid):
    """
    Get user schedule from database using user id
    :param userid:
    :return: json with user schedule
    """
    if not userid:
        return jsonify({'error': 'User ID must be provided'}), 400

    schedule = data_store.get_user_schedule_service(userid)
    return jsonify(schedule)

if __name__ == '__main__':
    app.run(debug=True)
