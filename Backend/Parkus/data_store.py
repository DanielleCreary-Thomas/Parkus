## business logic
# actual code of making things work
import bridge
import json
import time

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
            self.add_schedule(Schedule(block[0], block[1], block[2].strftime("%H:%M"), block[3].strftime("%H:%M")))

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
                member = User(user[0],'')
                member.name = f"{user[1]} {user[2]}"
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


def get_group_by_id(id):
    """
    returns the group with matching id
    :param id: id of selected group
    :return: group data in the form of a dictionary
    """
    return bridge.group_by_id(id)






def complete_matchmaking(userid):
    curr_user = User(userid,'testname')
    curr_user.get_schedule_for_userid()
    group_options = []
    available_groups = bridge.groups_with_vacancies()

    if len(available_groups) != 0:
        for group in available_groups:
            curr_group = Group(group[0])
            curr_group.populate_group()
            group_option = curr_group.validate_group(curr_user)
            if group_option:
                group_options.append(group_option)
    return [item.to_json() for item in group_options]

def validate_no_group(userid):
    result = bridge.validate_no_group(userid)
    ##valid
    return result is not None

# if __name__ == '__main__':
#     groups = complete_matchmaking(5)
#     # test = groups['members'][0]['schedule'][0]['start_time']
#     print(groups)

