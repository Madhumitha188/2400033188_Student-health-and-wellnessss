INSERT INTO users (id, name, email, password, phone, role, created_at) VALUES
(1, 'System Admin', 'admin@wellness.edu', 'password', '9999999999', 'ADMIN', NOW()),
(2, 'Student User', 'student@wellness.edu', 'password', '8888888888', 'STUDENT', NOW())
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO health_resources (id, title, category, description, contact_email, phone, status, created_at) VALUES
(1, 'Campus Counseling Center', 'Mental Health', 'Book one-on-one counseling with licensed professionals.', 'counseling@wellness.edu', '5551001000', 'ACTIVE', NOW()),
(2, 'Nutrition Guidance Hub', 'Nutrition', 'Weekly nutrition plans and diet guidance for students.', 'nutrition@wellness.edu', '5551002000', 'ACTIVE', NOW()),
(3, 'Fitness & Movement Lab', 'Fitness', 'Personalized fitness routines and group classes.', 'fitness@wellness.edu', '5551003000', 'ACTIVE', NOW())
ON DUPLICATE KEY UPDATE title=title;

INSERT INTO wellness_programs (id, name, type, description, duration, start_date, status, created_at) VALUES
(1, 'Mindful Semester', 'Mental Health', 'Guided mindfulness sessions and stress reduction workshops.', '6 weeks', CURRENT_DATE, 'ACTIVE', NOW()),
(2, 'Healthy Habits Bootcamp', 'Nutrition', 'Practical food planning and hydration routines.', '4 weeks', CURRENT_DATE, 'ACTIVE', NOW()),
(3, 'Move Daily Challenge', 'Fitness', 'Daily activity goals with peer accountability.', '8 weeks', CURRENT_DATE, 'ACTIVE', NOW())
ON DUPLICATE KEY UPDATE name=name;
