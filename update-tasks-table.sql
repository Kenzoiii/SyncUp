-- Update existing tasks table to add start_date column
USE syncup_db;

-- Add start_date column to tasks table
ALTER TABLE tasks 
ADD COLUMN start_date DATE AFTER priority;

-- Update existing tasks with sample start dates
UPDATE tasks SET start_date = DATE_SUB(due_date, INTERVAL 30 DAY) WHERE due_date IS NOT NULL;
UPDATE tasks SET start_date = DATE_SUB(CURDATE(), INTERVAL 15 DAY) WHERE due_date IS NULL;

-- Verify the change
DESCRIBE tasks;
SELECT * FROM tasks;

