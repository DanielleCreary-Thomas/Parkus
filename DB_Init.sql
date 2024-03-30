BEGIN;
	CREATE TABLE IF NOT EXISTS public.users (
		userID INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ) PRIMARY KEY,
		groupID INTEGER DEFAULT NULL,
		first_name VARCHAR(255),
		last_name VARCHAR(255),
		studentID INTEGER,
		phone_number VARCHAR(20),
		email VARCHAR(255),
		user_password VARCHAR(255),
		license_plate_number VARCHAR(20)
	);


	CREATE TABLE IF NOT EXISTS public.schedule_blocks
	(
		scheduleID INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ) PRIMARY KEY,
		userID integer,
		description VARCHAR(255),
		dow VARCHAR(15),
		start_time time without time zone,
		end_time time without time zone
	);

	CREATE TABLE IF NOT EXISTS public.parking_permits (
		permitID INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ) PRIMARY KEY,
		userID INTEGER,
		permit_number VARCHAR(255),
		active_status BOOLEAN,
		permit_type VARCHAR(255),
		activate_date DATE,
		expiration_date DATE,
		campus_location VARCHAR(255)
	);

	CREATE TABLE IF NOT EXISTS public.parking_groups(
		groupID INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY(INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1) PRIMARY KEY,
		permitID INTEGER,
		fully_paid BOOLEAN
	);

	ALTER TABLE users
	ADD CONSTRAINT fk_groupID_parking_groups_groupID
	FOREIGN KEY (groupID)
	REFERENCES parking_groups (groupID);

	ALTER TABLE schedule_blocks
	ADD CONSTRAINT fk_userID_users_userID
	FOREIGN KEY (userID)
	REFERENCES users (userID);

	ALTER TABLE parking_permits
	ADD CONSTRAINT fk_userID_users_userID
	FOREIGN KEY (userID)
	REFERENCES users (userID);

	ALTER TABLE parking_groups
	ADD CONSTRAINT fk_permitID_parking_permits_permitID
	FOREIGN KEY (permitID)
	REFERENCES parking_permits (permitID);




	INSERT INTO users (first_name, last_name, studentID, phone_number, email, user_password, license_plate_number)
	VALUES
		('John', 'Doe', '123456', '555-1234', 'john@example.com', 'password123', 'ABC123'),
		('Jane', 'Smith', '654321', '555-5678', 'jane@example.com', 'password456', 'DEF456'),
		('Alice', 'Johnson', '987654', '555-9876', 'alice@example.com', 'password789', 'GHI789'),
		('Bob', 'Williams', '456789', '555-4321', 'bob@example.com', 'passwordabc', 'JKL012'),
		('Emily', 'Brown', '789012', '555-8765', 'emily@example.com', 'passworddef', 'MNO345'),
		('Michael', 'Jones', '321654', '555-2109', 'michael@example.com', 'passwordghi', 'PQR678'),
		('Samantha', 'Davis', '456123', '555-6789', 'samantha@example.com', 'passwordjkl', 'STU901'),
		('David', 'Wilson', '987123', '555-3456', 'david@example.com', 'passwordmno', 'VWX234'),
		('Sarah', 'Martinez', '654987', '555-7890', 'sarah@example.com', 'passwordpqr', 'YZA567'),
		('Matthew', 'Garcia', '789456', '555-2345', 'matthew@example.com', 'passwordstu', 'BCD890');

	INSERT INTO parking_permits(userID, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location)
	VALUES
		(1, 'P1234', TRUE, 'Regular', '2024-03-17', '2025-03-17', 'Brampton Campus'),
		(3, 'P5678', TRUE, 'Faculty', '2024-03-17', '2025-03-17', 'Trafalgar Campus'),
		(5, 'P9012', TRUE, 'Student', '2024-03-17', '2025-03-17', 'HMC Campus'),
		(7, 'P3456', TRUE, 'Visitor', '2024-03-17', '2024-03-18', 'Trafalgar Campus');

	INSERT INTO schedule_blocks(userID, description, dow, start_time, end_time)
	VALUES
	    (1, 'Class 1', 1, '09:00:00', '12:00:00'),
	    (1, 'Class 2', 3, '13:00:00', '15:00:00'),
	    (1, 'Study Group', 5, '10:00:00', '11:30:00'),
	    (1, 'Meeting', 2, '14:00:00', '16:00:00'),
	    (1, 'Workout', 4, '18:00:00', '19:00:00'),
	    
	    (2, 'Lecture', 0, '10:00:00', '12:00:00'),
	    (2, 'Lab Session', 2, '14:00:00', '17:00:00'),
	    (2, 'Study Time', 4, '09:00:00', '11:00:00'),
	    (2, 'Group Project', 1, '13:00:00', '16:00:00'),
	    (2, 'Seminar', 3, '15:00:00', '18:00:00'),
	
	    (3, 'Meeting', 2, '11:00:00', '13:00:00'),
	    (3, 'Presentation', 4, '14:00:00', '16:00:00'),
	    (3, 'Workshop', 0, '09:00:00', '12:00:00'),
	    (3, 'Study Time', 1, '14:00:00', '17:00:00'),
	    (3, 'Office Hours', 3, '10:00:00', '12:00:00'),
	
	    (4, 'Discussion', 3, '13:00:00', '15:00:00'),
	    (4, 'Lab Session', 5, '10:00:00', '12:00:00'),
	    (4, 'Group Study', 1, '16:00:00', '18:00:00'),
	    (4, 'Meeting', 4, '15:00:00', '17:00:00'),
	    (4, 'Lecture', 2, '09:00:00', '11:00:00'),
	
	    (5, 'Seminar', 2, '15:00:00', '17:00:00'),
	    (5, 'Discussion', 4, '13:00:00', '15:00:00'),
	    (5, 'Study Group', 0, '10:00:00', '12:00:00'),
	    (5, 'Workshop', 1, '14:00:00', '16:00:00'),
	    (5, 'Meeting', 3, '16:00:00', '18:00:00'),
	
	    (6, 'Class', 1, '08:00:00', '10:00:00'),
	    (6, 'Office Hours', 3, '11:00:00', '13:00:00'),
	    (6, 'Discussion', 5, '14:00:00', '16:00:00'),
	    (6, 'Lab Session', 2, '13:00:00', '15:00:00'),
	    (6, 'Seminar', 4, '10:00:00', '12:00:00'),
	
	    (7, 'Meeting', 3, '15:00:00', '17:00:00'),
	    (7, 'Group Study', 5, '10:00:00', '12:00:00'),
	    (7, 'Lecture', 0, '13:00:00', '15:00:00'),
	    (7, 'Workshop', 2, '16:00:00', '18:00:00'),
	    (7, 'Discussion', 4, '09:00:00', '11:00:00'),
	
	    (8, 'Lab Session', 2, '10:00:00', '12:00:00'),
	    (8, 'Seminar', 4, '13:00:00', '15:00:00'),
	    (8, 'Group Study', 6, '14:00:00', '16:00:00'),
	    (8, 'Meeting', 1, '09:00:00', '11:00:00'),
	    (8, 'Discussion', 3, '12:00:00', '14:00:00'),
	
	    (9, 'Lecture', 1, '14:00:00', '16:00:00'),
	    (9, 'Discussion', 3, '16:00:00', '18:00:00'),
	    (9, 'Seminar', 5, '09:00:00', '11:00:00'),
	    (9, 'Office Hours', 0, '13:00:00', '15:00:00'),
	    (9, 'Meeting', 2, '11:00:00', '13:00:00'),
	
	    (10, 'Workshop', 4, '14:00:00', '16:00:00'),
	    (10, 'Group Study', 6, '09:00:00', '11:00:00'),
	    (10, 'Lab Session', 2, '12:00:00', '14:00:00'),
	    (10, 'Lecture', 0, '15:00:00', '17:00:00'),
	    (10, 'Discussion', 1, '10:00:00', '12:00:00');

	INSERT INTO parking_groups(permitID, fully_paid)
	VALUES
		(1, false),
		(2, true),
		(3, false),
		(4, false);

	UPDATE users
	SET groupID = 1
	WHERE userID IN (1,6,10);

	UPDATE users
	SET groupID = 2
	WHERE userID IN (2,7);

	UPDATE users
	SET groupID = 3
	WHERE userID IN (3,8);

	UPDATE users
	SET groupID = 4
	WHERE userID IN (4);
COMMIT;
	
