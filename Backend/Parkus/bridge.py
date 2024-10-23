##Bridge
# Communicating with the database
#import psycopg2
import time
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from supabase import create_client, Client

##Database connection & cursor
# connect to db
url = "https://rtneojaduhodjxqmymlq.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bmVvamFkdWhvZGp4cW15bWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NjUxMjQsImV4cCI6MjA0MTI0MTEyNH0.iq-IWDdhTBBcAQcBCC23Li9m2DVjOQDF_2uw8cpHYu0"
supabase: Client = create_client(url, key)

service_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bmVvamFkdWhvZGp4cW15bWxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTY2NTEyNCwiZXhwIjoyMDQxMjQxMTI0fQ.KS3bmIEdXc44U_7o3drFsIYa2KgmCRzsG3pZanQ90Kw"
supabase_service: Client = create_client(url, service_key)


CONNECTION_STRING = "user=postgres.rtneojaduhodjxqmymlq password=NyidWTNcMUDH8Pn5 host=aws-0-ca-central-1.pooler.supabase.com port=6543 dbname=postgres"

##Database connection & cursor
# connect to db
#conn = psycopg2.connect("dbname=parkus user=postgres password=notasecret")


# def get_group_members(groupid):
#     """
#     returns a list of all the members of a group and their schedules
#     :param groupid: the selected group's id
#     :return: a list of tuples of a userid, groupid, scheduleid, day of week, start time, and end time
#     """
#     with conn.cursor() as cur:
#         cur.execute('''
#         SELECT u.userid,
#         g.groupid,s.scheduleid, s.dow, s.start_time, s.end_time
#         FROM schedule_blocks s
#         INNER JOIN users u ON s.userid = u.userid
#         INNER JOIN parking_groups g ON u.groupid = g.groupid
#         WHERE g.groupid = %s
#         ORDER BY g.groupid, u.userid, s.dow;
#         ''', groupid)
#     group_data = cur.fetchall()
#     return group_data

# def groups_with_vacancies():
#     """
#     Returns the group IDs of groups with less than 5 members
#     :return: a list of tuples with groupids at 0 and their member count at 1
#     """
#     with conn.cursor() as cur:
#         cur.execute('''
#         SELECT COUNT(u.userid) as members, g.groupid
#         FROM parking_groups g
#         INNER JOIN users u ON u.groupid = g.groupid
#         GROUP BY g.groupid
#         HAVING COUNT(u.userid) < 5
#         ORDER BY g.groupid;
#         ''')
#         groups_and_memebers = cur.fetchall()
#         return groups_and_memebers


def member_userid_for_group(groupid):
    """
    Returns the user id of each member of thr group with selected group id
    :param groupid: selected group's id
    :return: list of tuples of the user id
    """
    response = (
        supabase.table("users")
        .select("userid", "first_name", "last_name")
        .eq("groupid", groupid)
        .execute()
    )
    return response.data

    ##Old Code
    # with conn.cursor() as cur:
    #     cur.execute('''
    #     SELECT u.userid, u.first_name, u.last_name
    #     FROM users u
    #     WHERE u.groupid = %s
    #     ''', str(groupid))
    #     members = cur.fetchall()
    #     return members


def member_count_by_groupid(groupid):
    """
    returns the number of members in the group with the given ID
    :param groupid: the selected group's id
    :return: the number of members
    """
    response = (
        supabase.table("users")
        .select("userid", count="exact")
        .eq("groupid", groupid)
        .execute()
    )

    return len(response.data)

    # with conn.cursor() as cur:
    #     cur.execute('''SELECT COUNT(u.userid) as members, g.groupid
    #                     FROM parking_groups g
    #                     INNER JOIN users u ON u.groupid = g.groupid
    #                     WHERE g.groupid = %s
    #                     GROUP BY g.groupid
    #                     ORDER BY g.groupid''', str(groupid))
    #     member_count = cur.fetchone()[0]
    #     return member_count


def group_by_groupid(groupid):
    """
    Returns the group matching the given id
    :param groupid:the selected group's id
    :return: a dictionary represention of a group
    """

    response = (
        supabase.table("parking_groups")
        .select("*")
        .eq("groupid", groupid)
        .execute()
    )
    return response.data

    # with conn.cursor() as cur:
    #     cur.execute("SELECT * FROM parking_groups WHERE groupid = %s", groupid)
    #     group = cur.fetchall()
    #     group_dict = {
    #         "groupid":group[0],
    #         "permitid":group[1],
    #         "fullypaid":group[2]
    #     }
    #     return group_dict


###Vacancy Queries
def get_all_groupids():
    """
    Returns a dictionary(json) of all groupids
    :return:
    """
    response = (
        supabase.table("parking_groups")
        .select('groupid')
        .execute()
    )
    return response.data


def active_permit(permitid):
    """
    Returns a bool indicating whether the given group has an active permit
    :param groupid:
    :return:
    """
    response = (
        supabase.table("parking_permits")
        .select('permitid')
        .eq('permitid', permitid)
        .eq('active_status', True)
        .execute()
    )
    return len(response.data) > 0


def get_group_size(groupid):
    """
    Returns the size of the group
    :param groupid:
    :return:
    """
    response = (
        supabase.table('users')
        .select('userid')
        .eq("groupid", groupid)
        .execute()
    )

    return len(response.data)


def get_permit_by_groupid(groupid):
    """
    Returns the permit of the given group
    :param groupid:
    :return:
    """
    response = (
        supabase.table('parking_groups')
        .select('permitid')
        .eq("groupid", groupid)
        .execute()
    )
    return response.data[0]


## User Schedule
def schedule_blocks_for_user(userid):
    """
    returns the schedule blocks for the given user in the form of a list of tuples
    :param userid: selected user's id
    :return: the list of schedule blocks
    """
    response = (
        supabase.table("schedule_blocks")
            .select("scheduleid", "dow", "start_time", "end_time", "description")
            .eq("userid", userid)
            .order("dow")
            .execute()
    )
    return response.data
    # with conn.cursor() as cur:
    #     cur.execute("""
    #     SELECT s.scheduleid, s.dow, s.start_time, s.end_time
    #     FROM schedule_blocks s
    #     WHERE s.userid = %s
    #     ORDER BY dow;
    #     """, (userid,))
    #     schedule = cur.fetchall()
    #     return schedule


def validate_no_group(userid):
    """
    Checks that given user has no group
    :param userid: user's id
    :return: bool
    """
    response = (
        supabase.table("users")
        .select("groupid")
        .eq("userid", userid)
        .execute()
    )


    return response.data[0]['groupid'] == None
    # with conn.cursor() as cur:
    #     cur.execute("""
    #     SELECT *
    #     FROM users u
    #     WHERE u.userid = %s AND u.groupid is null""",
    #                 (userid,))
    #     return cur.fetchone()


def get_group_leader(groupid):
    """
    Returns the leader's userid for the given groupid
    :param groupid:
    :return: userid for group leader
    """
    permitid_response = (
        supabase.table("parking_groups")
        .select("permitid")
        .eq("groupid", groupid)
        .execute()
    )
    print(permitid_response.data[0])

    if len(permitid_response.data) == 1:
        userid_response = (
            supabase.table("parking_permits")
            .select("userid")
            .eq("permitid", permitid_response.data[0]['permitid'])
            .execute()
        )
        return userid_response.data[0]

    return None


def get_group_id(userid):
    """
    Returns the group id for the given userid
    :param userid:
    :return:
    """
    response = (
        supabase.table("users")
        .select("groupid")
        .eq("userid", userid)
        .execute()
    )
    return response.data[0]


def get_group_members(groupid):
    """
    Returns the userid, first name, last name, license plate number,
     email, and image url for each member of the given group
    :param groupid:
    :return:
    """
    response = (
        supabase.table("users")
        .select("userid", "first_name", "last_name", "license_plate_number", "email", "image_proof_url")
        .eq("groupid", groupid)
        .execute()
    )
    return response.data


def get_car_info(platenum):
    """
    Returns the car info for the given platenum
    :param platenum:
    :return:
    """
    response = (
        supabase.table("cars")
        .select("*")
        .eq("license_plate_number", platenum)
        .execute()
    )
    return response.data[0]



def group_fully_paid(groupid, fully_paid):
    """
    Sets that the given group is fully paid
    :param groupid: the given group's id
    :param fully_paid: true if every member is fully paid, false otherwise
    :return:
    """
    response =(
        supabase.table("parking_groups")
        .update({"fully_paid": fully_paid})
        .eq("groupid", groupid)
        .execute()
    )
    return response.data[0]


def get_group_member(userid):
    """
    Returns the userid, first name, last name, license_plate_number, email, image url,
    and car info for the given userid
    :param userid:
    :return:
    """
    response = (
        supabase.table("users")
        .select("userid", "first_name", "last_name", "license_plate_number", "email", "image_proof_url")
        .eq("userid", userid)
        .execute()
    )
    return response.data[0]


def get_group_permit(leaderid):
    """
    Returns the imageurl of the permit for the given leader
    :param leaderid:
    :return:
    """
    response = (
        supabase.table("users")
        .select("image_proof_url")
        .eq("userid", leaderid)
        .execute()
    )
    return response.data[0]


def upload_image_proof(image_url, userid):
    """
    Updates the given user's eTransfer Proof image url
    :param image_url: Url of the eTransfer Proof image
    :param userid: user's id
    :return: True if the user is uploaded, False otherwise
    """
    response = (
        supabase.table("users")
        .update({"image_proof_url": image_url})
        .eq("userid", userid)
        .execute()
    )
    return len(response.data) > 0


def check_image_proof(userid):
    """
    Checks if the given user has an image proof url
    :param userid:
    :return:
    """
    response = (
        supabase.table("users")
        .select("image_proof_url")
        .eq("userid", userid)
        .execute()
    )
    return response.data[0]['image_proof_url'] != None


def check_schedule_complete(userid):
    """
    Checks if the given user has a schedule
    :param userid:
    :return:
    """
    response = (
        supabase.table("schedule_blocks")
        .select("scheduleid")
        .eq("userid", userid)
        .execute()
    )
    return len(response.data) > 0


def check_fully_paid(groupid):
    """
    Checks if the group with the given groupid has fully paid or not.
    :param groupid: the group's id
    :return: True if fully_paid is False, else False
    """
    response = (
        supabase.table("parking_groups")
        .select("fully_paid")
        .eq("groupid", groupid)
        .execute()
    )
    if response.data:
        return not response.data[0]['fully_paid']  # Return True if fully_paid is False
    return False


"""
Validation functions
"""


def validate_userid(userid):
    response = (
        supabase.table("users")
        .select("*")
        .eq("userid", userid)
        .execute()
    )
    return len(response.data) > 0


def validate_groupid(groupid):
    response = (
        supabase.table("parking_groups")
        .select("*")
        .eq("groupid", groupid)
        .execute()
    )
    return len(response.data) > 0


def validate_permitid(permitiid):
    response = (
        supabase.table("parking_permits")
        .select("*")
        .eq("permitid", permitiid)
        .execute()
    )
    return len(response.data) > 0


def validate_scheduleid(scheduleid):
    response = (
        supabase.table("schedule_blocks")
        .select("*")
        .eq("scheduleid", scheduleid)
        .execute()
    )
    return len(response.data) > 0


def validate_license_plate_number(license_plate_number):
    """
    Checks if the given license plate number is valid
    :param license_plate_number:
    :return:
    """
    response =(
        supabase.table("cars")
        .select("*")
        .eq("license_plate_number", license_plate_number)
        .execute()
    )
    return len(response.data) > 0



########################### Profile ###########################
def fetch_user_by_userid(user_id):
    """Fetches user data by userid from the Supabase database."""
    response = (
        supabase.table("users")
        .select("*")
        .eq("userid", user_id)
        .execute()
    )
    if response.data:
        return response.data[0]
    else:
        print("User not found.")
        return None

def check_parking_permit(user_id):
    """Checks if the user has a parking permit."""
    response = (
        supabase.table("parking_permits")
        .select("*")
        .eq("userid", user_id)
        .execute()
    )
    return response.data is not None and len(response.data) > 0

def insert_parking_permit(user_id, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location):
    """Inserts a new parking permit into the parking_permits table."""
    response = supabase.table("parking_permits").insert({
        "userid": user_id,
        "permit_number": permit_number,
        "active_status": active_status,
        "permit_type": permit_type,
        "activate_date": activate_date,
        "expiration_date": expiration_date,
        "campus_location": campus_location,
    }).execute()

    return response.data is not None and len(response.data) > 0

def fetch_permit_id(user_id, permit_number):
    """Fetches the permit ID from parking_permits table."""
    response = supabase.table("parking_permits").select("permitid").eq("userid", user_id).eq("permit_number", permit_number).execute()

    print("Supabase response:", response)  # Log the entire response for debugging
    
    # Check if the response contains data and log it
    if response.data and len(response.data) > 0:
        print("Permit Data:", response.data[0])  # Log the permit data
        return response.data[0]['permitid']
    else:
        return None  # Return None if no data is found

def insert_parking_group(permitid):
    """Inserts a new parking group using the permitid."""
    response = supabase.table("parking_groups").insert({
        "permitid": permitid,
        "fully_paid": False  # Default to False
    }).execute()

    return response.data is not None and len(response.data) > 0

def fetch_group_id(permit_id):
    """Fetches the group ID from parking_groups table."""
    response = supabase.table("parking_groups").select("groupid").eq("permitid", permit_id).execute()

    print("Supabase response:", response)  # Log the entire response for debugging
    
    # Check if the response contains data and log it
    if response.data and len(response.data) > 0:
        print("group id Data:", response.data[0])  # Log the group data
        return response.data[0]['groupid']
    else:
        return None  # Return None if no data is found
    
def update_user_groupid(userid, groupid):
    """Updates the user's group ID in the users table."""
    response = supabase.table("users").update({"groupid": groupid}).eq("userid", userid).execute()

    return response.data if response.data else None

def fetch_users_by_groupid(group_id):
    """Fetch users belonging to a specific group."""
    response = (
        supabase.table("users")
        .select("*")
        .eq("groupid", group_id)
        .execute()
    )
    return response.data if response.data else None

def update_permit_info(permitid, userid, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location):
    """
    Updates the permit information in the 'goup_permits' table where the permitid matches.
    """
    try:
        # Ensure the column names are correct and targeting the right row
        print(f"Updating permit with permitid: {permitid}")
        response = supabase.table("parking_permits").update({
            "permit_number": permit_number,
            "active_status": active_status,
            "permit_type": permit_type,
            "activate_date": activate_date,
            "expiration_date": expiration_date,
            "campus_location": campus_location
        }).eq('permitid', permitid).execute()  # Ensure license_plate_ matches

        # Print response for debugging purposes
        print("Supabase response:", response)
        
        return response
    except Exception as e:
        print(f"Error updating car information: {str(e)}")
        return {'error': str(e)}

########################### Profile ###########################

def fetch_schedule_blocks_by_userids(user_ids):
    """Fetch schedule blocks for multiple users."""
    response = (
        supabase.table("schedule_blocks")
        .select("*")
        .in_("userid", user_ids)
        .execute()
    )
    return response.data if response.data else None

def fetch_schedule_blocks_by_userid(user_id):
    """Fetch schedule blocks for a single user."""
    response = (
        supabase.table("schedule_blocks")
        .select("*")
        .eq("userid", user_id)
        .execute()
    )
    return response.data if response.data else None


def fetch_parking_permits_by_userid(user_id):
    """Fetches all parking permits for a given user ID from the Supabase database."""
    response = (
        supabase.table("parking_permits")
        .select("*")
        .eq("userid", user_id)
        .execute()
    )
    if response.data:
        return response.data
    else:
        print("No permits found.")
        return []


def fetch_car_by_userid(user_id):
    """
    Fetch car details using the user_id by first fetching the license plate number.
    """
    try:
        # Fetch the license plate number associated with the user_id
        user_response = supabase.table("users").select("license_plate_number").eq("userid", user_id).execute()
        if not user_response.data or not user_response.data[0]["license_plate_number"]:
            return None
        
        license_plate_number = user_response.data[0]["license_plate_number"]
        
        # Fetch car info using the license plate number
        car_response = supabase.table("cars").select("*").eq("license_plate_number", license_plate_number).execute()
        if car_response.data:
            return car_response.data[0]
        else:
            return None
    except Exception as e:
        print(f"Error fetching car info: {e}")
        return None


def update_car_info(license_plate_number, province, year, make, model, color):
    """
    Updates the car information in the 'cars' table where the license_plate_number matches.
    """
    try:
        # Ensure the column names are correct and targeting the right row
        print(f"Updating car with license plate: {license_plate_number}")
        response = supabase.table("cars").update({
            "province": province,
            "year": year,
            "make": make,
            "model": model,
            "color": color
        }).eq('license_plate_number', license_plate_number).execute()  # Ensure license_plate_ matches

        # Print response for debugging purposes
        print("Supabase response:", response)
        
        return response
    except Exception as e:
        print(f"Error updating car information: {str(e)}")
        return {'error': str(e)}


def insert_user_data(user_id, first_name, last_name, email, student_id, phone_number, license_plate_number):
    """
    Inserts user details into the 'users' table in Supabase.
    """
    try:
        response = supabase.table('users').insert([{
            'userid': user_id,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'studentid': student_id,
            'phone_number': phone_number,
            'license_plate_number': license_plate_number
        }]).execute()
        
        return response
    except Exception as e:
        return {'error': str(e)}


#insert license_plate_number to cars table when user sign up
def insert_license_plate_number(license_plate_number):
    """
    Inserts the car's license plate into the 'cars' table, with other columns set to NULL.
    """
    try:
        response = supabase.table('cars').insert([{
            'license_plate_number': license_plate_number,
            'province': '',
            'year': '',
            'make': '',
            'model': '',
            'color': ''
        }]).execute()
        
        return response
    except Exception as e:
        return {'error': str(e)}

#RAM
def fetch_users_by_groupids(group_id):
    try:
        response = supabase.table("users").select("userid, first_name, last_name").eq("groupid", group_id).execute()
        return response.data  # Assuming response has a data attribute
    except Exception as e:
        print(f"Exception in fetch_users_by_groupids: {e}")
        return None


def fetch_schedule_blocks_by_useridss(user_id):
    try:
        response = supabase.table("schedule_blocks").select("*").eq("userid", user_id).execute()
        return response.data
    except Exception as e:
        print(f"Exception in fetch_schedule_blocks_by_useridss: {e}")
        return None

def validate_no_groups(user_id):
    try:
        response = supabase.table('users').select('groupid').eq('userid', user_id).execute()
        groupid = response.data[0]['groupid']
        return groupid is None
    except Exception as e:
        print(f"Exception in validate_no_group: {e}")
        return False

def validate_groupids(group_id):
    try:
        response = supabase.table('users').select('groupid').eq('groupid', group_id).execute()
        if hasattr(response, 'error') and response.error:
            return False
        exists = len(response.data) > 0
        return exists
    except Exception as e:
        return False

def get_group_sizes(group_id):
    try:
        response = supabase.table('users').select('userid').eq('groupid', group_id).execute()
        return len(response.data)
    except Exception as e:
        print(f"Exception in get_group_sizes: {e}")
        return 0

def add_user_to_group(user_id, group_id):
    try:
        response = supabase.table('users').update({"groupid": group_id}).eq('userid', user_id).execute()
        return True
    except Exception as e:
        print(f"Error in add_user_to_group: {e}")
        return False

#RAM

if __name__ == "__main__":
    ##Testing has member paid
    print(check_paid_member('33d6127f-3a9e-4681-83a2-92c98db0881c'))

    ##Testing Get Car info
    print(get_car_info('ABC123'))

    ##Testing for get group members, leader, id
    print(get_group_members('44966fd0-2c0f-416d-baf8-80bfeb4ba075')) ##John, Michael, Matthew
    print(get_group_id('33d6127f-3a9e-4681-83a2-92c98db0881c'))## given john -> '44966fd0-2c0f-416d-baf8-80bfeb4ba075'
    print(get_group_leader('44966fd0-2c0f-416d-baf8-80bfeb4ba075'))##John

    ##Testing for matchmaking
    blocks = schedule_blocks_for_user('7ce19f4c-9d60-4539-8217-cfb3967f99ca')  # 5th user emily
    print(blocks)
    for block in blocks:
        print(block)
    # group1 = member_userid_for_group(1)
    # group1num = member_count_by_groupid(1)
    # for member in group1:
    #     print(member['userid'])
    #
    # for member in group1:
    #     print(member)
    #
    # print(group1num)
    # print(group_by_groupid(1))
    # print(groups_with_vacancies())

def add_user_to_group(user_id, group_id):
    """Updates the user's group_id in the database."""
    response = (
        supabase.table("users")
        .update({"groupid": group_id})
        .eq("userid", user_id)
        .execute()
    )
    return len(response.data) > 0

def get_group_size(group_id):
    """Returns the number of users in a group."""
    response = (
        supabase.table('users')
        .select('userid')
        .eq("groupid", group_id)
        .execute()
    )
    return len(response.data)

def validate_groupid(group_id):
    """Checks if the group ID exists."""
    response = (
        supabase.table('parking_groups')
        .select('groupid')
        .eq('groupid', group_id)
        .execute()
    )
    return len(response.data) > 0


 

def setGroupidTobeNull(userid):
    """
    Sets the user's groupid to null (leaves group).
    :param userid: User ID
    """
    try:
        print(f"Setting groupid to null for user: {userid}")
        # Execute the query to set the groupid to null
        response = (
            supabase.table("users")
            .update({'groupid': None})  # Set groupid to null
            .eq('userid', userid) 
            .execute() 
        )

        # Print response for debugging purposes
        print("Supabase response data:", response.data)

    except Exception as e:
        print(f"Error setting groupid to null: {str(e)}")

    return True



def delete_user_and_data(user_id):
    """
    Deletes a user and all their related data from the database and Supabase Auth system.
    :param user_id: User ID
    :return: True if deletion is successful, False otherwise
    """
    try:
        print(f"Attempting to delete user: {user_id}")

        # Check if the user is not in a group and has not paid
        user_response = supabase.table("users").select("groupid", "image_proof_url").eq("userid", user_id).execute()
        print(f"User data fetched for deletion: {user_response.data}")

        if len(user_response.data) == 0:
            print("User not found in the users table.")
            return False

        user = user_response.data[0]

        if user["groupid"] is None and user["image_proof_url"] is None:
            print("User is not in a group and has not paid. Proceeding with deletion.")

            # Delete related data from all tables
            supabase.table("schedule_blocks").delete().eq("userid", user_id).execute()
            print("Deleted from schedule_blocks")

            supabase.table("parking_permits").delete().eq("userid", user_id).execute()
            print("Deleted from parking_permits")

            supabase.table("cars").delete().eq("license_plate_number", user_id).execute()
            print("Deleted from cars table")

            # Delete user from custom users table
            supabase.table("users").delete().eq("userid", user_id).execute()
            print("Deleted from users table")

            # Delete user from Supabase Auth using the Admin API (service key)
            print("Attempting to delete user from Supabase Auth")
            supabase_service.auth.admin.delete_user(user_id)  # Use the Admin API to delete the user from Auth
            print(f"Deleted user from Supabase Auth: {user_id}")

            return True

        print("User cannot be deleted due to group or payment status.")
        return False

    except Exception as e:
        print(f"Error deleting user data: {str(e)}")
        return False













