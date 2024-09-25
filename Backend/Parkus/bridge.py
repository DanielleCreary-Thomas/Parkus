##Bridge
# Communicating with the database
#import psycopg2
import time
import os
from supabase import create_client, Client

##Database connection & cursor
# connect to db
url = "https://rtneojaduhodjxqmymlq.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bmVvamFkdWhvZGp4cW15bWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NjUxMjQsImV4cCI6MjA0MTI0MTEyNH0.iq-IWDdhTBBcAQcBCC23Li9m2DVjOQDF_2uw8cpHYu0"
supabase: Client = create_client(url, key)

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

# def get_all_users()
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

    return response.count

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


def groups_with_vacancies():
    """
    Returns the group IDs of groups with less than 3 members
    :return: a list of tuples with groupids at 0 and their member count at 1
    """
    # raw_query = """
    # SELECT COUNT(u.userid) as members, g.groupid
    # FROM parking_groups g
    # INNER JOIN users u ON u.groupid = g.groupid
    # GROUP BY g.groupid
    # HAVING COUNT(u.userid) < 3
    # ORDER BY g.groupid;
    # """
    # response = (
    #     supabase
    #     .rpc(raw_query)
    #     .execute()
    # )
    response = (
        supabase.from_('parking_groups')
            .select('groupid, COUNT(users.userid) as members')
            .inner_join('users', 'users.groupid', 'parking_groups.groupid')
            .group_by('groupid')
            .having('COUNT(users.userid)', '<', 3)
            .order('groupid')
            .execute()
    )

    return response.data
    # with conn.cursor() as cur:
    #     cur.execute('''
    #     SELECT COUNT(u.userid) as members, g.groupid
    #     FROM parking_groups g
    #     INNER JOIN users u ON u.groupid = g.groupid
    #     GROUP BY g.groupid
    #     HAVING COUNT(u.userid) < 5
    #     ORDER BY g.groupid;
    #     ''')
    #     groups_and_memebers = cur.fetchall()
    #     return groups_and_memebers


def schedule_blocks_for_user(userid):
    """
    returns the schedule blocks for the given user in the form of a list of tuples
    :param userid: selected user's id
    :return: the list of schedule blocks
    """
    response = (
        supabase.table("schedule_blocks")
            .select("scheduleid", "dow", "start_time", "end_time")
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
        .select("*")
        .eq("userid", userid)
        .eq("groupid", None)
        .execute()
    )

    return response.data
    # with conn.cursor() as cur:
    #     cur.execute("""
    #     SELECT *
    #     FROM users u
    #     WHERE u.userid = %s AND u.groupid is null""",
    #                 (userid,))
    #     return cur.fetchone()

def get_group_leader(groupid):
    """
    Returns the leader's userid for the given group
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

    if len(permitid_response.data)>0:
        userid_response = (
            supabase.table("parking_permits")
            .select("userid")
            .eq("permitid", permitid_response.data[0]['permitid'])
            .execute()
        )
        return userid_response.data[0]

    return None

def paid_member(userid):
    """
    Checks if the given user is paid
    :param userid: given user's id
    :return: True if the user is paid, False otherwise
    """
    response =(
        supabase.table("users")
        .select("*")
        .neq("eTransferProof", None)
        .execute()
    )
    return response.count > 0



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
    return response.count > 0

def validate_groupid(groupid):
    response = (
        supabase.table("parking_groups")
        .select("*")
        .eq("groupid", groupid)
        .execute()
    )
    return response.count > 0

def validate_permitid(permitiid):
    response = (
        supabase.table("parking_permits")
        .select("*")
        .eq("permitid", permitiid)
        .execute()
    )
    return response.count > 0

def validate_scheduleid(scheduleid):
    response = (
        supabase.table("schedule_blocks")
        .select("*")
        .eq("scheduleid", scheduleid)
        .execute()
    )
    return response.count > 0

if __name__ == "__main__":
    print(get_group_leader("1"))
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