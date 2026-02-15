

# Create Super Admin Account

## Step 1: Create User Account
- Register a new user via Supabase Auth with:
  - **Email:** obayomioladayo50@gmail.com
  - **Password:** Thepassword@48
- The existing `handle_new_user` trigger will automatically create a profile and assign the default `'user'` role

## Step 2: Assign Super Admin Role
- Insert a `super_admin` role into the `user_roles` table for the newly created user
- This enables access to the Admin Panel (`/admin`) and all super admin privileges throughout the app

## Step 3: Verify Access
- Log in with the new credentials
- Confirm the user is redirected appropriately and can access the Admin Panel (super admin badge, admin routes, etc.)

