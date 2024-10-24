##Controller
# Http Endpoints
import data_store
import flask
from flask import jsonify, render_template, send_from_directory, make_response
from flask import Flask, request
from flask_cors import CORS, cross_origin
import bridge
# bridge should be removed from main.py

app = Flask(__name__)
CORS(app)



# Should only be line below
# CORS(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

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



@app.route('/users/<user_id>/schedule', methods=['GET'])
def get_user_schedule(user_id):
    """
    Returns the schedule for the user with the matching id
    :param user_id: user id
    :return: JSON with the user's schedule
    """
    assert user_id == request.view_args['user_id']

    user_schedule = data_store.get_schedule_for_user(user_id)

    schedule_data = []
    for block in user_schedule:
        schedule_data.append({
            'user_id': user_id,
            'schedule_id': block['scheduleid'],
            'dow': block['dow'],
            'start_time': block['start_time'],
            'end_time': block['end_time'],
            'description': block.get('description', '')
        })
    return jsonify(schedule_data), 200





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


########################### Profile ###########################
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

    return jsonify(result)

@app.route('/get-permitid', methods=['GET'])
def get_permit_id():
    """API endpoint to retrieve permit ID based on user ID and permit number."""
    user_id = request.args.get('userid')
    permit_number = request.args.get('permit_number')

    if not user_id or not permit_number:
        return jsonify({"error": "Missing user ID or permit number"}), 400

    try:
        permitid = data_store.get_permit_id(user_id, permit_number)

        if permitid:
            return jsonify({"permitid": permitid}), 200
        else:
            return jsonify({"error": "Permit not found"}), 404
    except Exception as e:
        print(f"Error retrieving permit ID: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route('/get-groupid', methods=['GET'])
def get_group_id_for_user():
    """API endpoint to retrieve group id based on permit id"""
    permit_id = request.args.get('permitid')

    if not permit_id:
        return jsonify({"error": "Missing permit id"}), 400
    
    try: 
        groupid = data_store.get_group_id_for_user(permit_id)

        if groupid:
            return jsonify({"groupid": groupid}), 200
        else:
            return jsonify({"error": "groupid not found"}), 404
    except Exception as e:
        print(f"Error retrieving group ID: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/update-user-groupid', methods=['POST'])
def update_user_groupid():
    """API to update user's groupid."""
    data = request.json
    user_id = data.get('userid')
    group_id = data.get('groupid')

    # Call your data store to update the user's groupid
    return data_store.update_user_groupid(user_id, group_id)

@app.route('/parking-group', methods=['POST'])
def add_parking_group():
    """API endpoint to add a new parking group using the permitid."""
    data = request.json
    permitid = data.get('permitid')

    if not permitid:
        return jsonify({"error": "Missing permitid"}), 400

    result = data_store.add_parking_group(permitid)

    if result:
        return jsonify({"message": "Parking group added successfully"}), 201
    else:
        return jsonify({"error": "Failed to add parking group"}), 500


@app.route('/parking-permits/<user_id>', methods=['GET'])
def get_user_permits(user_id):
    """API endpoint to fetch all parking permits for a given user ID."""
    permits = data_store.get_parking_permits_by_userid(user_id)
    if permits:
        return jsonify(permits), 200
    else:
        return jsonify({"error": "No permits found"}), 404
    
########################### Profile ###########################

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
    if not data_store.validate_no_group(user_id): # Checks to see that a user has no group
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

@app.route('/schedule/<user_id>', methods=['GET', 'OPTIONS'])
def check_schedule(user_id):
    """
    Returns whether the given user has any schedule blocks
    :param user_id:
    :return:
    """
    assert user_id == request.view_args['user_id']
    return data_store.check_schedule_complete(user_id)


@app.route('/users/imageproof/<user_id>', methods=['GET', 'OPTIONS'])
def check_image_proof(user_id):
    """
    Returns whether the given user has any image proof url
    :param user_id:
    :return:
    """
    assert user_id == request.view_args['user_id']
    return data_store.check_image_proof(user_id)

##POST Endpoints
@app.route('/users/imageproof', methods=['POST'])
def image_proof_upload():
    """uploads a user's image proof url
    :return: the user's image proof url
    """
    #assert formData == request.form
    print(request.data)
    json_data = request.get_json()
    print(json_data)
    image_url = json_data["proofImageUrl"]
    userid = json_data['userId']
    response = data_store.upload_etransfer_image(image_url, userid)
    return jsonify(response)


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

@app.route('/join-group', methods=['POST', 'OPTIONS'])
@cross_origin()
def join_group():
    data = request.json
    group_id = data.get('group_id')
    user_id = data.get('user_id')

    if not group_id or not user_id:
        return jsonify({"error": "Missing group_id or user_id"}), 400

    # Check if the user is already in a group
    if not data_store.validate_no_group(user_id):
        return jsonify({"error": "User is already in a group"}), 400

    # Check if the group exists
    if not data_store.validate_groupid(group_id):
        return jsonify({"error": "Group does not exist"}), 404

    # Check if the group is full
    group_size = data_store.get_group_size(group_id)
    if group_size >= 3:
        return jsonify({"error": "Group is full"}), 400

    # Update the user's group_id
    success = data_store.add_user_to_group(user_id, group_id)
    if not success:
        return jsonify({"error": "Failed to join group"}), 500

    return jsonify({"message": "Successfully joined the group"}), 200

@app.route('/groups/<group_id>/fully_paid', methods=['GET'])
def check_group_fully_paid(group_id):
    """
    Returns whether the given group has fully paid or not.
    :param group_id: the group's id
    :return: JSON with True if fully_paid is False, otherwise False
    """
    result = data_store.group_is_not_fully_paid(group_id)
    return jsonify({"show_notification": result}), 200

@app.route('/car/user/<user_id>', methods=['GET'])
def get_car_by_userid(user_id):
    """
    Fetch the car information by the user's user_id.
    """
    car = data_store.get_car_info_by_userid(user_id)
    if car:
        return jsonify(car), 200
    else:
        return jsonify({"error": "No car information found for this user"}), 404

# POST Endpoint to update car info
@app.route('/car', methods=['POST'])
def update_car():
    """
    API endpoint to update the car information based on the license plate number.
    """
    data = request.json
    license_plate_number = data.get('license_plate_number')
    province = data.get('province')
    year = data.get('year')
    make = data.get('make')
    model = data.get('model')
    color = data.get('color')

    # Call the data_store to update the car information
    result = data_store.update_car_info(license_plate_number, province, year, make, model, color)

    if 'error' in result:
        return jsonify({'error': result['error']}), 400

    return jsonify({"message": "Car information updated successfully"}), 201



@app.route('/users/setgroupidnull/<user_id>', methods=['POST', 'OPTIONS'])
def set_groupid_to_null(user_id):
    """
    Updates the user's groupid to null (leaves group)
    :param user_id:
    :return: JSON response with success status
    """
    try:
        result = data_store.set_groupid_to_null(user_id)
        if result['success']:
            return jsonify({'success': True}), 200
        else:
            return jsonify({'success': False}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



@app.route('/users/deactivate/<user_id>', methods=['POST', 'OPTIONS'])
def deactivate_user(user_id):
    """
    Deactivates a user if they are not in a group and have not paid.
    :param user_id: User ID
    :return: JSON response with success status
    """
    result = data_store.delete_user_and_data(user_id)
    if result['success']:
        return jsonify({'success': True}), 200
    else:
        return jsonify({'success': False, 'message': 'User cannot be deactivated.'}), 400






@app.route('/update_permit', methods=['POST'])
def update_permit():
    """
    API endpoint to update the permit information based on the permit id.
    """
    data = request.json
    permitid = data.get('permitid')
    userid = data.get('userid')
    permit_number = data.get('permit_number')
    active_status = data.get('active_status')
    permit_type = data.get('permit_type')
    activate_date = data.get('activate_date')
    expiration_date = data.get('expiration_date')
    campus_location = data.get('campus_location')

    # Call the data_store to update the car information
    result = data_store.update_permit_info(permitid, userid, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location)

    if 'error' in result:
        return jsonify({'error': result['error']}), 400

    return jsonify({"message": "Car information updated successfully"}), 201


@app.route('/add-user', methods=['POST'])
def add_user():
    """
    API endpoint to add user data to the 'users' table in Supabase and the car's license plate into the 'cars' table.
    """
    data = request.json
    user_id = data.get('user_id')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    student_id = data.get('studentid')
    phone_number = data.get('phone_number')
    license_plate_number = data.get('license_plate_number')

    # Insert user and car data
    result = data_store.add_user_data(
        user_id=user_id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        student_id=student_id,
        phone_number=phone_number,
        license_plate_number=license_plate_number
    )

    if 'error' in result:
        return jsonify({'error': result['error']}), 400

    return jsonify({'message': 'User and car data inserted successfully'}), 201


@app.route('/scheduleblocks/<user_id>', methods=['GET'])
def get_scheduleblocks(user_id):
    """API endpoint to get schedule blocks from Supabase."""
    scheduleblocks = data_store.fetch_schedule(user_id)
    
    print("Schedule Blocks Data: ", scheduleblocks.data)  

    if 'error' in scheduleblocks:
        return jsonify({"error": "Failed to fetch schedule blocks"}), 500
    
   
    return jsonify({"scheduleblocks": scheduleblocks.data}), 200 

@app.route('/users/schedule/<scheduleid>', methods=['GET'])
def get_scheduleblocks_by_schedule_id(scheduleid):
    """API endpoint to get schedule blocks from Supabase."""
    scheduleblocks = data_store.fetch_schedule_by_schedule_id(scheduleid)
    
    print("Schedule Blocks Data: ", scheduleblocks.data)  

    if 'error' in scheduleblocks:
        return jsonify({"error": "Failed to fetch schedule blocks"}), 500
    
    return jsonify({"scheduleblocks": scheduleblocks.data}), 200 

@app.route('/schedule/user/<userid>/day/<dow>', methods=['GET'])
def get_schedule_by_user_and_day(userid, dow):
    """API endpoint to get schedule blocks by user ID and day of the week."""
    scheduleblocks = data_store.fetch_schedule_by_user_and_day(userid, dow)

    return jsonify({"scheduleblocks": scheduleblocks}), 200

@app.route('/scheduleblocks/update/<scheduleid>', methods=['PUT'])
def update_scheduleblock(scheduleid):
    """Update schedule block in Supabase."""
    data = request.get_json()
    update_result = data_store.update_schedule_block(scheduleid, data)

    if 'error' in update_result:
        return jsonify({"error": "Failed to update schedule block"}), 500
    
    return jsonify({"message": "Schedule block updated successfully"}), 200

@app.route('/scheduleblocks/delete/<scheduleid>', methods=['POST'])
def delete_schedule_block(scheduleid):
    """
    API endpoint to delete a schedule block by its ID.
    :param scheduleid: The ID of the schedule block to be deleted
    :return: JSON response with success or error message
    """
    try:
        # Call data_store to delete the schedule block using the provided scheduleid
        response = data_store.delete_schedule_block(scheduleid)
        if 'error' in response:
            return jsonify({'error': response['error']}), 400
        return jsonify({'message': 'Schedule block deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/scheduleblocks/insert', methods=['POST'])
def insert_schedule_block():
    """
    API endpoint to insert a new schedule block.
    """
    data = request.json
    userid = data.get('userid')
    description = data.get('description')
    dow = data.get('dow')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    block_color = data.get('block_color')

    # Call the data store to insert the schedule block
    response = data_store.insert_schedule_block(userid, description, dow, start_time, end_time, block_color)

    if 'error' in response:
        return jsonify({'error': response['error']}), 400

    return jsonify({'message': 'Schedule block inserted successfully!'}), 201

@app.route('/group-size/<groupid>', methods=['GET'])
def get_group_size(groupid):
    """API endpoint to get the size of the group."""
    group_size = data_store.get_group_size(groupid)
    
    # Assuming group_size is an integer, you can return it directly
    return jsonify({'group_size': group_size}), 200

@app.route('/user-group-check/<user_id>', methods=['GET', 'OPTIONS'])
def check_user_group(user_id):
    """
    API to check if a user is in a group and return their group information.
    If user is not in a group, return {'groupid': None}
    """
    try:
        # Fetch the user's group ID from the data store
        user_group = data_store.get_group_id(user_id)
        
        if not user_group or 'groupid' not in user_group:
            # If the user has no group, return groupid as None
            return jsonify({'groupid': None}), 200
        
        # Return the groupid if found
        group_id = user_group['groupid']
        return jsonify({'groupid': group_id}), 200
    
    except Exception as e:
        # Log the error and return an appropriate message
        print(f"Error checking group for user {user_id}: {str(e)}")
        return jsonify({'error': 'An error occurred while checking the group.'}), 500


if __name__ == '__main__':
    app.run()

