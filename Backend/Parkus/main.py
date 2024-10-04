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


@app.route('/groups/<group_id>/schedules', methods=['GET', 'OPTIONS'])
def get_group_schedules(group_id):
    """
    Returns the schedules for all members in the group with the matching id
    :param group_id: group id
    :return: JSON with the schedules for each member, including first and last names
    """
    assert group_id == request.view_args['group_id']
    
    members = data_store.get_group_members(group_id)  # Fetch all members of the group
    schedules = []
    
    # For each member, fetch their schedule and add their name
    for member in members:
        user_schedule = data_store.get_schedule_for_user(member['userid'])
        for block in user_schedule:
            schedules.append({
                'user_id': member['userid'],
                'first_name': member['first_name'],
                'last_name': member['last_name'],
                'schedule_id': block['scheduleid'],
                'dow': block['dow'],
                'start_time': block['start_time'],
                'end_time': block['end_time'],
                'description': block.get('description', '')  # Include description if available
            })
    
    return jsonify(schedules), 200





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


@app.route('/permits/userid/<group_id>', methods=['GET', 'OPTIONS'])
def get_group_leader(group_id):
    """
    Returns the userid for the leader of a given group
    :param groupid: the given group's id'
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


##POST Endpoints
@app.route('/users/etransfer', methods=['POST'])
def etransfer_image():
    """uploads a user's etransfer image
    :return: the user's etransfer image
    """
    #assert formData == request.form
    print(request.data)
    imageUrl = request.data['proofImageUrl']#need to correct
    userid = request.form['userid']

    return data_store.upload_etransfer_image(imageUrl, userid)



@app.route('/groups/<group_id>/fully_paid', methods=['GET'])
def check_group_fully_paid(group_id):
    """
    Returns whether the given group has fully paid or not.
    :param group_id: the group's id
    :return: JSON with True if fully_paid is False, otherwise False
    """
    result = data_store.group_is_not_fully_paid(group_id)
    return jsonify({"show_notification": result}), 200



if __name__ == '__main__':
    app.run(debug=True, port=5000)