# bridge.py
import psycopg2

conn = psycopg2.connect("dbname=parkus user=postgres password=1112")
def fetch_user_schedule_from_db(userid):
    """
    Fetches the user's schedule'
    :param userid:  The user's id'
    :return:  The user's schedule'
    """

    query = """
        SELECT description, dow, start_time, end_time
        FROM schedule_blocks
        WHERE userid = %s
        ORDER BY start_time;
    """
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, (userid,))
            return cursor.fetchall()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return []  # Return an empty list in case of error
    # finally:
    #     conn.close()
