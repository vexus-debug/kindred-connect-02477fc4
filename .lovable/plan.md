
# Multi-Tenant Healthcare SaaS Architecture Plan

## Overview

Transform the current single-clinic dental app into a multi-tenant healthcare SaaS platform where:
- Each **clinic** (tenant) gets its own isolated dashboard and data
- Different **clinic types** (dental, general, etc.) get different dashboard layouts
- A **super admin** dashboard oversees all clinics on the platform

## Architecture

### 1. Database Foundation (Supabase)

We need to build the database from scratch since no tables exist yet. The core multi-tenancy model:

```text
+------------------+       +------------------+       +------------------+
|   organizations  |       |   org_members    |       |    profiles      |
|------------------|       |------------------|       |------------------|
| id (PK)          |<------| org_id (FK)      |       | user_id (PK/FK)  |
| name             |       | user_id (FK)     |------>| full_name        |
| clinic_type      |       | role (enum)      |       | phone            |
| slug (unique)    |       +------------------+       | avatar_url       |
| address, phone   |                                  +------------------+
| logo_url         |       +------------------+
| settings (jsonb) |       |   user_roles     |
+------------------+       |------------------|
                           | user_id (FK)     |
                           | role (platform)  |
                           +------------------+
```

**Key tables to create in Phase 1:**

- **`profiles`** -- one row per auth user (auto-created on signup via trigger)
- **`user_roles`** -- platform-level roles (`super_admin`, `user`)
- **`organizations`** -- each clinic is an organization with a `clinic_type` enum (starting with `dental`)
- **`org_members`** -- links users to organizations with a clinic-level role (`owner`, `admin`, `dentist`, `receptionist`, `hygienist`, `assistant`, `accountant`, `lab_technician`)

Then **all existing data tables** (patients, appointments, treatments, etc.) get an `org_id` column so data is fully isolated per clinic.

### 2. Authentication (Real Supabase Auth)

Replace the current localStorage-based login with proper Supabase Auth:
- Email/password signup and login
- `profiles` table auto-populated via database trigger on signup
- Session managed via `onAuthStateChange`

### 3. Clinic Type Routing

```text
/login                    -- Universal login
/select-clinic            -- User picks which clinic to enter (if member of multiple)
/clinic/:slug/dashboard   -- Clinic dashboard (layout varies by clinic_type)
/admin                    -- Super admin dashboard (only for super_admin role)
```

The current dental pages move under `/clinic/:slug/...` and the sidebar/layout dynamically loads based on `clinic_type`.

### 4. Row-Level Security (RLS)

Every clinic data table gets RLS policies using a helper function:

```text
has_org_access(org_id, user_id) --> checks org_members table
is_super_admin(user_id)         --> checks user_roles table
```

This ensures Clinic A can never see Clinic B's data.

### 5. Super Admin Dashboard

A separate set of pages at `/admin/...` that shows:
- All registered clinics
- User management across the platform
- Platform analytics
- Ability to create new clinics

---

## Implementation Phases

### Phase 1: Foundation (start here)
1. Create the core database tables: `profiles`, `user_roles`, `organizations`, `org_members`
2. Create enums: `clinic_type` (dental), `platform_role` (super_admin, user), `org_role` (owner, admin, dentist, etc.)
3. Create helper functions: `has_role()`, `has_org_access()`, `is_super_admin()`
4. Set up RLS on all new tables
5. Create profile auto-creation trigger
6. Replace localStorage auth with real Supabase Auth (login, signup, session)
7. Update `useAuth` hook to fetch profile, platform role, and org memberships

### Phase 2: Multi-Tenant Routing
1. Add a "Select Clinic" page for users who belong to multiple orgs
2. Create an `OrgProvider` context that holds the current org and clinic type
3. Update routing: `/clinic/:slug/dashboard`, `/clinic/:slug/patients`, etc.
4. Update `DashboardLayout` and `DashboardSidebar` to be dynamic based on `clinic_type`
5. Move current dental pages under the new route structure

### Phase 3: Dental Clinic Tables
1. Create all the dental-specific tables (patients, appointments, treatments, billing, etc.) -- all with `org_id`
2. Apply RLS policies using `has_org_access()`
3. Fix all existing hooks to pass `org_id` from context
4. Resolve all current build errors (the "never" type errors are because the DB has no tables)

### Phase 4: Super Admin
1. Create `/admin` routes and layout
2. Build pages: clinic list, user management, platform stats
3. Protect with `is_super_admin()` checks

---

## Technical Details

### Database Migration (Phase 1 SQL)

Creates these objects:
- Enums: `platform_role`, `clinic_type`, `org_role`
- Tables: `profiles`, `user_roles`, `organizations`, `org_members`
- Functions: `handle_new_user()`, `has_role()`, `has_org_access()`, `is_super_admin()`
- Trigger: auto-create profile on signup
- RLS policies on all tables

### Key Frontend Changes

| Current | New |
|---------|-----|
| `useAuth` with localStorage | `useAuth` with Supabase Auth + profile/roles/orgs |
| `roleAccess.ts` with hardcoded roles | Dynamic roles from `org_members` per clinic |
| `/dashboard/*` routes | `/clinic/:slug/*` routes (clinic) + `/admin/*` (super admin) |
| Single `DashboardSidebar` | Sidebar config driven by `clinic_type` |
| All hooks reference non-existent tables | Hooks scoped by `org_id` from context |

### New Contexts

- **`AuthContext`** -- user, profile, platform role, org memberships
- **`OrgContext`** -- current organization, clinic type, user's role within that org

### How Different Clinic Types Work

The sidebar navigation, available pages, and features are defined per `clinic_type`:

```text
clinicTypeConfig = {
  dental: {
    label: "Dental Clinic",
    navGroups: [General, Clinical (dental charts, treatments), Finance, Lab, ...],
    features: ["dental_charts", "prescriptions", "lab_work", ...]
  },
  general: {  // future
    label: "General Clinic",
    navGroups: [General, Clinical (consultations, vitals), Finance, ...],
    features: ["vitals", "consultations", ...]
  }
}
```

This way, adding a new clinic type later means adding a config object and its specific pages -- the core multi-tenant infrastructure stays the same.

---

## What This Achieves

- Each clinic's data is completely isolated via RLS
- Users can belong to multiple clinics
- The platform scales to support any number of clinics and clinic types
- Super admin has full visibility across the platform
- Adding new clinic types (general, dermatology, etc.) requires only new config + pages, not architectural changes

## Starting Point

We will begin with **Phase 1** -- setting up the database foundation and real authentication. This unblocks everything else and also fixes all current build errors (which stem from the empty database).
