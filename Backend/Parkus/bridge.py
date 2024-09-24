##Bridge
# Communicating with the database
import psycopg2
import time

##Database connection & cursor
# connect to db
conn = psycopg2.connect("dbname=parkus user=postgres password=notasecret")


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

def member_userid_for_group(groupid):
    """
    Returns the user id of each member of thr group with selected group id
    :param groupid: selected group's id
    :return: list of tuples of the user id
    """
    with conn.cursor() as cur:
        cur.execute('''
        SELECT u.userid, u.first_name, u.last_name
        FROM users u
        WHERE u.groupid = %s
        ''', str(groupid))
        members = cur.fetchall()
        return members

def member_count_by_groupid(groupid):
    """
    returns the number of members in the group with the given ID
    :param groupid: the selected group's id
    :return: the number of members
    """
    with conn.cursor() as cur:
        cur.execute('''SELECT COUNT(u.userid) as members, g.groupid
                        FROM parking_groups g
                        INNER JOIN users u ON u.groupid = g.groupid
                        WHERE g.groupid = %s
                        GROUP BY g.groupid
                        ORDER BY g.groupid''', str(groupid))
        member_count = cur.fetchone()[0]
        return member_count


def group_by_groupid(groupid):
    """
    Returns the group matching the given id
    :param groupid:the selected group's id
    :return: a dictionary represention of a group
    """
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM parking_groups WHERE groupid = %s", groupid)
        group = cur.fetchall()
        group_dict = {
            "groupid":group[0],
            "permitid":group[1],
            "fullypaid":group[2]
        }
        return group_dict


def groups_with_vacancies():
    """
    Returns the group IDs of groups with less than 5 members
    :return: a list of tuples with groupids at 0 and their member count at 1
    """
    with conn.cursor() as cur:
        cur.execute('''
        SELECT COUNT(u.userid) as members, g.groupid
        FROM parking_groups g
        INNER JOIN users u ON u.groupid = g.groupid
        GROUP BY g.groupid
        HAVING COUNT(u.userid) < 5
        ORDER BY g.groupid;
        ''')
        groups_and_memebers = cur.fetchall()
        return groups_and_memebers


def schedule_blocks_for_user(userid):
    """
    returns the schedule blocks for the given user in the form of a list of tuples
    :param userid: selected user's id
    :return: the list of schedule blocks
    """
    with conn.cursor() as cur:
        cur.execute("""
        SELECT s.scheduleid, s.dow, s.start_time, s.end_time 
        FROM schedule_blocks s
        WHERE s.userid = %s
        ORDER BY dow;
        """, (userid,))
        schedule = cur.fetchall()
        return schedule

def validate_no_group(userid):
    with conn.cursor() as cur:
        cur.execute("""
        SELECT *
        FROM users u
        WHERE u.userid = %s AND u.groupid is null""",
                    (userid,))
        return cur.fetchone()
