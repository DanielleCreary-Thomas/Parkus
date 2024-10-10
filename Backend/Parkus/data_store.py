## business logic
# actual code of making things work
import bridge
import json
import time
from bridge import CONNECTION_STRING, fetch_parking_permits_by_userid, supabase
import psycopg2
from psycopg2.extras import RealDictCursor
# from bridge import fetch_user_by_userid, check_parking_permit, insert_parking_permit

class User:
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.schedule = []

    def add_schedule(self, schedule_block):
        self.schedule.append(schedule_block)

    def get_schedule_for_userid(self):
        user_schedule = bridge.schedule_blocks_for_user(self.id)
        for block in user_schedule:
            self.add_schedule(Schedule(block['scheduleid'],
                                       block['dow'],
                                       block['start_time'][0:-3],
                                       block['end_time'][0:-3]))

    def compare_schedules(self, member):
        for userBlock in self.schedule:
            for memBlock in member.schedule:
                return userBlock.compare_times(memBlock) != 0

    def to_json(self):
        return {
            'user_id': self.id,
            'name': self.name,
            'schedule': [item.to_json() for item in self.schedule]
        }
    # def toJSON(self):
    #     return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class Schedule:
    def __init__(self, id, dow, start, end):
        self.id = id
        self.dow = dow
        self.start_time = start
        self.end_time = end

    def compare_times(self, member_time):
        """
        compares the time between the two schedule blocks checking for overlap
        :param member_time: the schedule block of a User
        :return: the amount overlap in hours between the schedule blocks
        """
        comparison = max(0, min(int(self.end_time.split(":")[0]), int(member_time.end_time.split(":")[0]))
                         - max(int(self.start_time.split(":")[0]), int(member_time.start_time.split(":")[0])))
        return comparison == 0
    def to_json(self):
        return {
            'schedule_id': self.id,
            'dow': self.dow,
            'start_time': self.start_time,
            'end_time': self.end_time
        }
    # def toJson(self):
    #     return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

class Group:
    def __init__(self, groupid):
        self.id = groupid
        self.members = []

    def add_member(self, member):
        self.members.append(member)

    def populate_group(self):
        members = bridge.member_userid_for_group(self.id)
        if len(members) != 0:
            for user in members:
                member = User(user['userid'], f"{user['first_name']} {user['last_name']}")
                # member.name =
                member.get_schedule_for_userid()
                self.add_member(member)

    def validate_group(self, potential_member):
        valid = True
        checked_members = 0
        while valid and checked_members < len(self.members):
            for member in self.members:
                if not potential_member.compare_schedules(member):
                    valid = False
                checked_members += 1
        if valid:
            return self

    def to_json(self):
        return {
            'group_id': self.id,
            'members': [item.to_json() for item in self.members]
        }
    # def toJSON(self):
    #     return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


def groups_with_vacancies():
    """
    returns a list of groups with vacancies(less than 3 members)
    :return: list of groupids
    """
    groups = bridge.get_all_groupids()
    available_groups =[]
    for group in groups:
        permit = bridge.get_permit_by_groupid(group['groupid'])
        if len(permit['permitid']) > 0:
            if bridge.active_permit(permit['permitid']):
                group_size = bridge.get_group_size(group['groupid'])
                if group_size < 3:
                    available_groups.append(group['groupid'])

    return available_groups


def get_group_by_id(id):
    """
    returns the group with matching id
    :param id: id of selected group
    :return: group data in the form of a dictionary
    """
    return bridge.get_group_members(id)


def get_group_leader(groupid):
    """
    Returns the userid of the leader for the group with the matching id
    :param groupid:
    :return: leader's user id
    """
    if bridge.validate_groupid(groupid):
        return bridge.get_group_leader(groupid)


def get_group_id(userid):
    """
    returns the group id for the matching user id
    :param userid:
    :return: group id
    """
    if bridge.validate_userid(userid):
        if not bridge.validate_no_group(userid):
            return bridge.get_group_id(userid)


def get_group_members(groupid):
    """
    Returns the member info for the group with the matching id
    :param groupid:
    :return:
    """
    if bridge.validate_groupid(groupid):
        members = bridge.get_group_members(groupid)
        for member in members:
            platenum = member['license_plate_number']
            if bridge.validate_license_plate_number(platenum):
                member['car'] = bridge.get_car_info(platenum)
        return members


def check_paid_member(userid):
    """
    returns whether the given user has paid
    :param userid:
    :return:
    """
    if bridge.validate_userid(userid):
        return {"memberPaid": True} if bridge.check_image_proof(userid) else {"memberPaid": False}


def get_group_member(userid):
    """
    returns the member info for the member with the matching user id
    :param userid:
    :return:
    """
    if bridge.validate_userid(userid):
        member = bridge.get_group_member(userid)
        platenum = member['license_plate_number']
        if bridge.validate_license_plate_number(platenum):
            member['car'] = bridge.get_car_info(platenum)
            return member


def get_group_permit(leaderid):
    """
    returns the imageurl for the permit of the given leader
    :param leaderid:
    :return:
    """
    if bridge.validate_userid(leaderid):
        return bridge.get_group_permit(leaderid)


def complete_matchmaking(userid):
    """
    Completes the matchmaking algorithm for the given user and provides the group options available
    :param userid:
    :return:
    """
    curr_user = User(userid,'testname')
    curr_user.get_schedule_for_userid()
    group_options = []
    available_groups = groups_with_vacancies()

    if len(available_groups) != 0:
        for group in available_groups:
            curr_group = Group(group)
            curr_group.populate_group()
            group_option = curr_group.validate_group(curr_user)
            if group_option:
                group_options.append(group_option)
    return [item.to_json() for item in group_options]


def validate_no_group(userid):
    """
    Checks to see that the given user has no group
    :param userid: given userid
    :return: Bool that is true if the given user has no group
    """
    result = bridge.validate_no_group(userid)
    ##valid
    return result is True


def upload_etransfer_image(image_url, userid):
    """
    Updates the image_proof_url for the given user, updates their group's fully_paid field
    :param image_url: url of the image bucket url
    :param userid:
    :return:
    """
    if bridge.validate_userid(userid):
        groupid = bridge.get_group_id(userid)
        group_members = bridge.get_group_members(groupid)
        fully_paid = False
        count = 0
        for group_member in group_members:
            if check_paid_member(group_member['userid']):
                count += 1
        bridge.group_fully_paid(groupid, (count == len(group_members)))
        result = bridge.upload_image_proof(image_url, userid)
        return {"urlUploaded": result}
    return None


def check_image_proof(user_id):
    """
    Returns whether the given user has any image proof url
    :param user_id:
    :return:
    """
    if bridge.validate_userid(user_id):
        result = bridge.check_image_proof(user_id)
        return {'imageProof': True} if result else {'imageProof': False}


def check_schedule_complete(userid):
    """
    Checks to see if the given user has any schedule blocks
    :param userid:
    :return:
    """
    if bridge.validate_userid(userid):
        result = bridge.check_schedule_complete(userid)
        return {'scheduleComplete': True} if result else {'scheduleComplete': False}


def get_schedule_for_user(userid):
    """
    Returns the schedule blocks for the given user
    :param userid: the user's id
    :return: list of schedule blocks
    """
    return bridge.schedule_blocks_for_user(userid)


def group_is_not_fully_paid(groupid):
    """
    Wrapper function to check if the group has not fully paid.
    :param groupid: the group's id
    :return: True if not fully paid, False otherwise
    """
    return bridge.check_fully_paid(groupid)


# data_store.py
def get_user_by_id(user_id):
    """Wrapper function to fetch user data."""
    return bridge.fetch_user_by_userid(user_id)

########################### Profile ###########################
def user_has_parking_permit(user_id):
    """Wrapper function to check if the user has a parking permit."""
    return bridge.check_parking_permit(user_id)


def add_parking_permit(user_id, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location):
    """Wrapper function to insert a new parking permit."""
    return bridge.insert_parking_permit(user_id, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location)

def get_permit_id(user_id, permit_number):
    """Calls the bridge function to fetch the permit ID."""
    return bridge.fetch_permit_id(user_id, permit_number)

def add_parking_group(permitid):
    """Calls the bridge function to insert a parking group using permitid."""
    return bridge.insert_parking_group(permitid)


def get_parking_permits_by_userid(user_id):
    """Wrapper function to fetch all parking permits for a given user ID."""
    return bridge.fetch_parking_permits_by_userid(user_id)


def get_car_info_by_userid(user_id):
    """
    Fetch car details for a user by their user_id.
    """
    return bridge.fetch_car_by_userid(user_id)


def update_car_info(license_plate_number, province, year, make, model, color):
    """
    Handles updating the car information in the 'cars' table.
    """
    result = bridge.update_car_info(
        license_plate_number=license_plate_number,
        province=province,
        year=year,
        make=make,
        model=model,
        color=color
    )
    
    if 'error' in result:
        return {'error': result['error']}
    
    return result


def update_permit_info(permitid, userid, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location):
    """
    Handles updating the permit information in the 'parking_permits' table.
    """
    result = bridge.update_permit_info(
        permitid=permitid,
        userid=userid,
        permit_number=permit_number,
        active_status=active_status,
        permit_type=permit_type,
        activate_date=activate_date,
        expiration_date=expiration_date,
        campus_location=campus_location
    )
    
    if 'error' in result:
        return {'error': result['error']}
    
    return result

def is_user_permit_holder(user_id, group_id):
    """
    Wrapper function to check if the user is the permit holder for their group.
    """
    return bridge.is_user_permit_holder(user_id, group_id)


 

def set_groupid_to_null(user_id):
    """
    Sets the groupid for the given user to null (leaves group).
    :param user_id:
    :return: {'success': True} if successful, {'success': False} otherwise
    """
    result = bridge.setGroupidTobeNull(user_id)
    if result:
        return {'success': True}
    else:
        return {'success': False}



def delete_user_and_data(user_id):
    """
    Deletes a user and all their related data if conditions are met.
    """
    result = bridge.delete_user_and_data(user_id)
    return {'success': result}











########################### Profile ###########################


########################### Signup ###########################

def add_user_data(user_id, first_name, last_name, email, student_id, phone_number, license_plate_number):
    """
    Handles adding user data to the 'users' table and car data to the 'cars' table.
    """
    # Insert user data
    result = bridge.insert_user_data(
        user_id=user_id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        student_id=student_id,
        phone_number=phone_number,
        license_plate_number=license_plate_number
    )
    
    if 'error' in result:
        return {'error': result['error']}

    # Insert car data
    car_result = bridge.insert_license_plate_number(license_plate_number)

    if 'error' in car_result:
        return {'error': car_result['error']}

    return {'message': 'User and car data inserted successfully'}
########################### Signup ###########################

def add_user_to_group(user_id, group_id):
    """Wrapper function to add a user to a group."""
    return bridge.add_user_to_group(user_id, group_id)

def get_group_size(group_id):
    """Wrapper function to get the size of a group."""
    return bridge.get_group_size(group_id)

def validate_groupid(group_id):
    """Wrapper function to validate group ID."""
    return bridge.validate_groupid(group_id)


if __name__ == '__main__':
    ##Test get members
    members = get_group_members('44966fd0-2c0f-416d-baf8-80bfeb4ba075')
    for member in members:
        print(member)

    groups = complete_matchmaking('7ce19f4c-9d60-4539-8217-cfb3967f99ca')
    # test = groups['members'][0]['schedule'][0]['start_time']
    for group in groups:
        print(group)



