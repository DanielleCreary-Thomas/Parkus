BEGIN;
	CREATE TABLE IF NOT EXISTS public.users (
		userID uuid default uuid_generate_v4() PRIMARY KEY,
		groupID uuid DEFAULT NULL,
		first_name VARCHAR(255),
		last_name VARCHAR(255),
		studentID INTEGER,
		phone_number VARCHAR(20),
		email VARCHAR(255),
		license_plate_number VARCHAR(20),
		image_proof_url VARCHAR(255)
	);


	CREATE TABLE IF NOT EXISTS public.schedule_blocks
	(
		scheduleID uuid default uuid_generate_v4()) PRIMARY KEY,
		userID uuid,
		description VARCHAR(255),
		dow VARCHAR(15),
		start_time time without time zone,
		end_time time without time zone,
		block_color VARCHAR(15)
	);

	CREATE TABLE IF NOT EXISTS public.parking_permits (
		permitID uuid default uuid_generate_v4() PRIMARY KEY,
		userID uuid,
		permit_number VARCHAR(255),
		active_status BOOLEAN,
		permit_type VARCHAR(255),
		activate_date DATE,
		expiration_date DATE,
		campus_location VARCHAR(255)
	);

	CREATE TABLE IF NOT EXISTS public.parking_groups(
		groupID uuid default uuid_generate_v4() PRIMARY KEY,
		permitID uuid,
		fully_paid BOOLEAN
	);

	CREATE TABLE IF NOT EXISTS public.cars(
		license_plate_number VARCHAR(20) PRIMARY KEY,
		province VARCHAR(50),
		year VARCHAR(20),
		make VARCHAR(50),
		model VARCHAR(50),
		color VARCHAR(20),
		
	);

	ALTER TABLE users
	ADD CONSTRAINT fk_groupID_parking_groups_groupID
	FOREIGN KEY (groupID)
	REFERENCES parking_groups (groupID);

	ALTER TABLE users
	ADD CONSTRAINT fk_plateNum_license_plate_plateNum
	FOREIGN KEY (license_plate_number)
	REFERENCES cars (license_plate_number);

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




	INSERT INTO users (first_name, last_name, studentID, phone_number, email, license_plate_number)
	VALUES
		('John', 'Doe', '123456', '555-1234', 'john@example.com', 'ABC123'), -- userid: 
		('Jane', 'Smith', '654321', '555-5678', 'jane@example.com', 'DEF456'), -- userid: 
		('Alice', 'Johnson', '987654', '555-9876', 'alice@example.com', 'GHI789'), --userid: 51904ee3-bf13-4c78-856a-4d5ebb4bee8b
		('Bob', 'Williams', '456789', '555-4321', 'bob@example.com', 'JKL012'), -- userid: '122a3c6f-1965-4b26-9fd0-8d71b45cd068'
		('Emily', 'Brown', '789012', '555-8765', 'emily@example.com', 'MNO345'), -- userid: 
		('Michael', 'Jones', '321654', '555-2109', 'michael@example.com', 'PQR678'), -- userid: 
		('Samantha', 'Davis', '456123', '555-6789', 'samantha@example.com', 'STU901'), -- userid: 
		('David', 'Wilson', '987123', '555-3456', 'david@example.com', 'VWX234'), -- userid: 
		('Sarah', 'Martinez', '654987', '555-7890', 'sarah@example.com', 'YZA567'), -- userid: 
		('Matthew', 'Garcia', '789456', '555-2345', 'matthew@example.com', 'BCD890'); -- userid: 

	INSERT INTO parking_permits(userID, permit_number, active_status, permit_type, activate_date, expiration_date, campus_location)
	VALUES
		(1, 'P1234', TRUE, 'Regular', '2024-03-17', '2025-03-17', 'Brampton Campus'), -- permitid: 
		(2, 'P5678', TRUE, 'Faculty', '2024-03-17', '2025-03-17', 'Trafalgar Campus'), -- permitid: 
		('51904ee3-bf13-4c78-856a-4d5ebb4bee8b', 'P9012', TRUE, 'Student', '2024-03-17', '2025-03-17', 'HMC Campus'), -- permitid: 8e9a7204-d775-4612-8f0f-c70ab498b3e3
		('122a3c6f-1965-4b26-9fd0-8d71b45cd068', 'P3456', TRUE, 'Visitor', '2024-03-17', '2024-03-18', 'Trafalgar Campus'); -- permitid: 61da1f39-63a4-4e61-8663-e11c5ef979bc

	INSERT INTO schedule_blocks(userID, description, dow, start_time, end_time, block_color)
	VALUES
	    (1, 'Class 1', 1, '12:00:00', '14:00:00'), -- scheduleid: 
	    (1, 'Class 2', 3, '13:00:00', '15:00:00'), -- scheduleid: 
	    (1, 'Study Group', 5, '10:00:00', '12:00:00'), -- scheduleid: 
	    (1, 'Meeting', 2, '16:00:00', '18:00:00'), -- scheduleid: 
	    (1, 'Workout', 4, '18:00:00', '19:00:00'), -- scheduleid: 
	    
	    (2, 'Lecture', 0, '10:00:00', '12:00:00'), -- scheduleid: 
	    (2, 'Lab Session', 2, '14:00:00', '16:00:00'), -- scheduleid: 
	    (2, 'Study Time', 4, '09:00:00', '11:00:00'), -- scheduleid: 
	    (2, 'Group Project', 1, '13:00:00', '16:00:00'), -- scheduleid: 
	    (2, 'Seminar', 3, '15:00:00', '18:00:00'), -- scheduleid: 
	
	    ('51904ee3-bf13-4c78-856a-4d5ebb4bee8b', 'Meeting', 2, '13:00:00', '15:00:00', '#9be134'), -- scheduleid: 302fab44-ad85-4c6b-b6a8-558f86fd45b1
	    ('51904ee3-bf13-4c78-856a-4d5ebb4bee8b', 'Presentation', 4, '14:00:00', '16:00:00', '#9b2134'), -- scheduleid: dd7b93d7-0d02-4221-b989-9b0eddf31b0d
	    ('51904ee3-bf13-4c78-856a-4d5ebb4bee8b', 'Workshop', 0, '09:00:00', '12:00:00', '#9be137'), -- scheduleid: 0a307319-cc37-4abd-b5d4-32ecb3c0e19b
	    ('51904ee3-bf13-4c78-856a-4d5ebb4bee8b', 'Study Time', 1, '14:00:00', '17:00:00', '#9be184'), -- scheduleid: e5e436ef-671b-486d-a36c-53ce8e40e9b5
	    ('51904ee3-bf13-4c78-856a-4d5ebb4bee8b', 'Office Hours', 3, '10:00:00', '12:00:00', '#9b6134'), -- scheduleid: 8d43bd06-3ae2-4a0e-b61b-47074416d6c6
	
	    ('122a3c6f-1965-4b26-9fd0-8d71b45cd068', 'Discussion', 3, '13:00:00', '15:00:00', '#9b6134'), -- scheduleid: 7c0fe877-2944-4d85-9351-fd60f6c7e60b
	    ('122a3c6f-1965-4b26-9fd0-8d71b45cd068', 'Lab Session', 5, '10:00:00', '12:00:00', '#92e134'), -- scheduleid: f17084e5-7f11-4f45-9c1d-14a24107afdc
	    ('122a3c6f-1965-4b26-9fd0-8d71b45cd068', 'Group Study', 1, '16:00:00', '18:00:00', '#8be134'), -- scheduleid: 5603c2bd-5808-4960-9ad8-20f9785d46af
	    ('122a3c6f-1965-4b26-9fd0-8d71b45cd068', 'Meeting', 4, '15:00:00', '17:00:00', '#9be734'), -- scheduleid: ec70f4d4-6f55-470e-854a-7d75135915e1
	    ('122a3c6f-1965-4b26-9fd0-8d71b45cd068', 'Lecture', 2, '09:00:00', '11:00:00', '#9be434'), -- scheduleid: 27317c3d-2f80-4789-9541-97adc5e5f58c
	
	    (5, 'Seminar', 2, '15:00:00', '17:00:00'), -- scheduleid: 
	    (5, 'Discussion', 4, '13:00:00', '15:00:00'), -- scheduleid: 
	    (5, 'Study Group', 0, '10:00:00', '12:00:00'), -- scheduleid: 
	    (5, 'Workshop', 1, '14:00:00', '16:00:00'), -- scheduleid: 
	    (5, 'Meeting', 3, '16:00:00', '18:00:00'), -- scheduleid: 
	
	    (6, 'Class', 1, '08:00:00', '10:00:00'), -- scheduleid: 
	    (6, 'Office Hours', 3, '11:00:00', '13:00:00'), -- scheduleid: 
	    (6, 'Discussion', 5, '14:00:00', '16:00:00'), -- scheduleid: 
	    (6, 'Lab Session', 2, '14:00:00', '16:00:00'), -- scheduleid: 
	    (6, 'Seminar', 4, '10:00:00', '12:00:00'), -- scheduleid: 
	
	    (7, 'Meeting', 3, '13:00:00', '15:00:00'), -- scheduleid: 
	    (7, 'Group Study', 5, '10:00:00', '12:00:00'), -- scheduleid: 
	    (7, 'Lecture', 0, '13:00:00', '15:00:00'), -- scheduleid: 
	    (7, 'Workshop', 2, '16:00:00', '18:00:00'), -- scheduleid: 
	    (7, 'Discussion', 4, '11:00:00', '14:00:00'), -- scheduleid: 
	
	    (8, 'Lab Session', 2, '10:00:00', '12:00:00'), -- scheduleid: 
	    (8, 'Seminar', 4, '13:00:00', '15:00:00'), -- scheduleid: 
	    (8, 'Group Study', 6, '14:00:00', '16:00:00'), -- scheduleid: 
	    (8, 'Meeting', 1, '09:00:00', '11:00:00'), -- scheduleid: 
	    (8, 'Discussion', 3, '12:00:00', '14:00:00'), -- scheduleid: 
	
	    (9, 'Lecture', 1, '14:00:00', '16:00:00'), -- scheduleid: 
	    (9, 'Discussion', 3, '16:00:00', '18:00:00'), -- scheduleid: 
	    (9, 'Seminar', 5, '09:00:00', '11:00:00'), -- scheduleid: 
	    (9, 'Office Hours', 0, '13:00:00', '15:00:00'), -- scheduleid: 
	    (9, 'Meeting', 2, '11:00:00', '13:00:00'), -- scheduleid: 
	
	    (10, 'Workshop', 4, '14:00:00', '16:00:00'), -- scheduleid: 
	    (10, 'Group Study', 6, '09:00:00', '11:00:00'), -- scheduleid: 
	    (10, 'Lab Session', 2, '12:00:00', '14:00:00'), -- scheduleid: 
	    (10, 'Lecture', 0, '15:00:00', '17:00:00'), -- scheduleid: 
	    (10, 'Discussion', 1, '10:00:00', '12:00:00'); -- scheduleid: 

	INSERT INTO parking_groups(permitID, fully_paid)
	VALUES
		(1, false), -- groupid: 
		(2, true), -- groupid: 
		('8e9a7204-d775-4612-8f0f-c70ab498b3e3', false), -- groupid: 'cd3cbd89-e94b-4172-8e58-17fe78e4b3c4'
		('61da1f39-63a4-4e61-8663-e11c5ef979bc', false); --group id : 8e023549-9247-434f-b3dc-330dcf894833

	UPDATE users
	SET groupID = 1
	WHERE userID IN (1,6,10);

	UPDATE users
	SET groupID = 2
	WHERE userID IN (2,7);

	UPDATE users
	SET groupID = 'cd3cbd89-e94b-4172-8e58-17fe78e4b3c4'
	WHERE userID IN ('51904ee3-bf13-4c78-856a-4d5ebb4bee8b',8);

	UPDATE users
	SET groupID = '8e023549-9247-434f-b3dc-330dcf894833'
	WHERE userID IN ('122a3c6f-1965-4b26-9fd0-8d71b45cd068');
COMMIT;
	
