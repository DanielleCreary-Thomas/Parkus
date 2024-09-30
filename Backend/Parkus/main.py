##Controller
# Http Endpoints
import data_store
import flask
from flask import jsonify, render_template, send_from_directory
from flask import Flask, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# GET Endpoints

@app.route('/groups/<id>', methods=['GET', 'OPTIONS'])
def group(id):
    """
    Sends the data for a single group with the given id
    :param id: the selected group's id
    :return: return data for the given group in the form of a dictionary
    """
    assert id == request.view_args['id']
    returnData = {
        'selectedGroup': data_store.get_group_by_id(id)
    }
    return returnData

@app.route('/groups/matchmake/<id>', methods=['GET', 'OPTIONS'])
def matchmake(id):
    """
    Matches the given user with the available groups
    :param id: given userID
    :return: the groups that match the user's schedule
    """
    # test = request.args.get('id')
    assert id == request.view_args['id']
    if data_store.validate_no_group(id):
        returnData = {
            'availableGroups': data_store.complete_matchmaking(id)
        }
    else:
        returnData = {}
    return returnData

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """API endpoint to fetch user data by user ID."""
    user = data_store.get_user_by_id(user_id)
    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404
    
@app.route('/parking-permit/<user_id>', methods=['GET'])
def check_user_parking_permit(user_id):
    """API endpoint to check if the user has a parking permit."""
    has_permit = data_store.user_has_parking_permit(user_id)
    return jsonify({"has_permit": has_permit})

@app.route('/parking-permit', methods=['POST'])
def add_parking_permit():
    """API endpoint to add a new parking permit for the user."""
    data = request.json
    user_id = data.get('userid')
    permit_number = data.get('permit_number')
    active_status = data.get('active_status')
    permit_type = data.get('permit_type')
    activate_date = data.get('activate_date')
    expiration_date = data.get('expiration_date')
    campus_location = data.get('campus_location')

    result = data_store.add_parking_permit(user_id, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location)
    if result:
        return jsonify({"message": "Permit added successfully"}), 201
    else:
        return jsonify({"error": "Failed to add permit"}), 400
    
@app.route('/parking-permits/<user_id>', methods=['GET'])
def get_user_permits(user_id):
    """API endpoint to fetch all parking permits for a given user ID."""
    permits = data_store.get_parking_permits_by_userid(user_id)
    if permits:
        return jsonify(permits), 200
    else:
        return jsonify({"error": "No permits found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)