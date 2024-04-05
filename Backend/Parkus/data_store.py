## business logic
# actual code of making things work
import bridge


class User:
    def __init__(self, id):
        self.id = id
        self.schedule = []

    def add_schedule(self, schedule_block):
        self.schedule.append(schedule_block)

    def get_schedule_for_userid(self):
        user_schedule = bridge.schedule_blocks_for_user(self.id)
        for block in user_schedule:
            self.add_schedule(Schedule(block[0], block[1], block[2], block[3]))


class Schedule:
    def __init__(self, id, dow, start, end):
        self.id = id
        self.dow = dow
        self.start_time = start
        self.end_time = end

    def compare_times(self, member_time):
        comparison = max(0, min(self.end_time, member_time.end_time) - max(self.start_time, member_time.start_time))
        return comparison == 0

class Group:
    def __init__(self, groupid):
        self.id = groupid
        self.members = []

    def add_member(self, member):
        self.members.append(member)

    def populate_group(self):
        members = bridge.member_userid_for_group(self.id)
        if len(members) != 0:
            for userid in members:
                member = User(userid)
                member.get_schedule_for_userid()
                self.add_member(member)



def get_group_by_id(id):
    """
    returns the group with matching id
    :param id: id of selected group
    :return: group data in the form of a dictionary
    """
    return bridge.group_by_id(id)






def complete_matchmaking(userid):
    curr_user = User(userid)
    curr_user.get_schedule_for_userid()
    group_options = []
    available_groups = bridge.groups_with_vacancies()

    if len(available_groups) != 0:
        for group in available_groups:
            curr_group = Group(group[0])
            curr_group.populate_group()
