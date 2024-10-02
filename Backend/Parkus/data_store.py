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
    return bridge.group_by_id(id)


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
        if not bridge.validate_no_group():
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
        return check_paid_member(userid)


def get_group_member(userid):
    """
    returns the member info for the member with the matching user id
    :param userid:
    :return:
    """
    if bridge.validate_userid(userid):
        member = get_group_member(userid)
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
    result = bridge.validate_no_group(userid)
    ##valid
    return result is not None

def upload_etransfer_image(imageUrl, userid):
    if bridge.validate_userid(userid):
        result = bridge.upload_etransfer_image(imageUrl, userid)
        return result
    return None

if __name__ == '__main__':
    ##Test get members
    members = get_group_members('44966fd0-2c0f-416d-baf8-80bfeb4ba075')
    for member in members:
        print(member)

    groups = complete_matchmaking('7ce19f4c-9d60-4539-8217-cfb3967f99ca')
    # test = groups['members'][0]['schedule'][0]['start_time']
    for group in groups:
        print(group)



# data_store.py

def get_user_by_id(user_id):
    """Wrapper function to fetch user data."""
    return bridge.fetch_user_by_userid(user_id)

def user_has_parking_permit(user_id):
    """Wrapper function to check if the user has a parking permit."""
    return bridge.check_parking_permit(user_id)

def add_parking_permit(user_id, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location):
    """Wrapper function to insert a new parking permit."""
    return bridge.insert_parking_permit(user_id, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location)

def get_parking_permits_by_userid(user_id):
    """Wrapper function to fetch all parking permits for a given user ID."""
    return bridge.fetch_parking_permits_by_userid(user_id)