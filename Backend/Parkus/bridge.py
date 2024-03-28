##Bridge
# Communicating with the database
import psycopg2

##Database connection & cursor
# connect to db
conn = psycopg2.connect("dbname=parkus user=postgres password=notasecret")

#get schedules of group members
# SELECT u.userid, u.first_name,u.last_name,
# g.*,s.scheduleid, s.start_time, s.end_time, s.dow
# FROM schedule_blocks s
# INNER JOIN users u ON s.userid = u.userid
# INNER JOIN parking_groups g ON u.groupid = g.groupid
# ORDER BY g.groupid, u.userid, s.dow;


# get group member count
# SELECT COUNT(u.userid) as members, g.groupid
# FROM parking_groups g
# INNER JOIN users u ON u.groupid = g.groupid
# GROUP BY g.groupid
# ORDER BY g.groupid;
def group_id(groupid):
    """
    Returns the group matching the given id
    :param groupid:the selected group's id
    :return: a dictionary represention of a group
    """
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM parking_groups WHERE groupid = %s", id)
        group = cur.fetchall()
        group_dict = {
            "groupid":group[0],
            "permitid":group[1],
            "fullypaid":group[2]
        }
        return group_dict

