# controller.py

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin
import data_store
import bridge

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

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

@app.route('/permits/userid/<group_id>', methods=['GET', 'OPTIONS'])
def get_group_leader(group_id):
    """
    Returns the userid for the leader of a given group
    :param groupid: the given group's id
    :return: the userid for the group leader
    """
    assert group_id == request.view_args['group_id']
    return data_store.get_group_leader(group_id)

@app.route('/users/groupid/<user_id>', methods=['GET', 'OPTIONS'])
def get_group_id(user_id):
    """
    Returns the group id for the given user
    :param userid: the user id for the user
    :return: group id
    """
    assert user_id == request.view_args['user_id']
    if not data_store.validate_no_group(user_id):
        return data_store.get_group_id(user_id)
    return {'groupid': 'None'}

@app.route('/users/group/<group_id>', methods=['GET', 'OPTIONS'])
def get_group_members(group_id):
    """
    Returns the userid, first name, last name, license_plate_number,
     email, image url, and car info for each member of the given group
    :param groupid:
    :return:
    """
    assert group_id == request.view_args['group_id']
    return data_store.get_group_members(group_id)

@app.route('/users/paid/<user_id>', methods=['GET', 'OPTIONS'])
def check_paid_member(user_id):
    """
    Returns whether the given user has paid the group leader
    :param id: the user's id
    :return: Boolean value indicating whether the user is paid or not
    """
    assert user_id == request.view_args['user_id']
    return data_store.check_paid_member(user_id)

@app.route('/group/member/<user_id>', methods=['GET', 'OPTIONS'])
def get_group_member(user_id):
    """
    Returns the userid, first name, last name,license_plate_number,
     email, image url, and car info for the given userid
    :param userid:
    :return:
    """
    assert user_id == request.view_args['user_id']
    return data_store.get_group_member(user_id)

@app.route('/group/permit/<leader_id>', methods=['GET', 'OPTIONS'])
def get_group_permit(leader_id):
    """
    Returns the image of the permit for the given leader's user id
    :param leader_id:
    :return:
    """
    assert leader_id == request.view_args['leader_id']
    return data_store.get_group_permit(leader_id)

# POST Endpoints
#Rameez didnt work on this function
@app.route('/users/etransfer', methods=['POST'])
def etransfer_image():
    """Uploads a user's eTransfer image"""
    data = request.json
    imageUrl = data.get('proofImageUrl')
    userid = data.get('userId')

    result = data_store.upload_etransfer_image(imageUrl, userid)
    if result:
        return jsonify({"message": "Image uploaded successfully"}), 200
    else:
        return jsonify({"error": "Failed to upload image"}), 400


# Update the '/group-schedule' endpoint to handle OPTIONS requests and configure CORS
@app.route('/group-schedule', methods=['POST', 'OPTIONS'])
@cross_origin()
def get_group_schedule():
    if request.method == 'OPTIONS':
        # Build a response object for the OPTIONS preflight request
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response, 200

    data = request.json
    group_id = data.get('group_id')
    user_id = data.get('user_id')

    if not group_id or not user_id:
        return jsonify({"error": "Missing group_id or user_id"}), 400

    users_data = bridge.fetch_users_by_groupid(group_id)
    if not users_data:
        return jsonify({"error": "Failed to fetch users."}), 500

    user_ids = [user['userid'] for user in users_data]

    group_schedule_data = bridge.fetch_schedule_blocks_by_userids(user_ids)
    if group_schedule_data is None:
        return jsonify({"error": "Failed to fetch group schedule blocks."}), 500

    user_schedule_data = bridge.fetch_schedule_blocks_by_userid(user_id)
    if user_schedule_data is None:
        return jsonify({"error": "Failed to fetch user schedule."}), 500

    return jsonify({
        "users": users_data,
        "group_schedule": group_schedule_data,
        "user_schedule": user_schedule_data
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
