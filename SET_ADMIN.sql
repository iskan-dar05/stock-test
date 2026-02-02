-- Set a user as admin
-- Replace 'YOUR_USER_EMAIL' with your actual email address

-- Option 1: Set admin by email (if you know your email)
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'YOUR_USER_EMAIL'
);

-- Option 2: Set admin by user ID (if you know your user ID)
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE id = 'YOUR_USER_ID';

-- Verify the update
SELECT id, email, role 
FROM profiles 
WHERE role = 'admin';

