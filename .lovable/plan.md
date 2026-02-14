

## Vista Dental Clinic — Full Feature Expansion

### 1. 📋 Treatment Plans
- New **Treatment Plans** page under Clinical in the sidebar (visible to Admin, Dentist)
- Create multi-step treatment plans for a patient with:
  - Plan name, phases/steps (each with procedure, tooth, estimated cost, status)
  - Total cost estimate auto-calculated from steps
  - Patient consent tracking (pending → consented → declined) with consent date
  - Progress tracking as individual steps are completed
  - Link treatment plan steps to actual treatments when performed
- Viewable from patient profile page as a dedicated tab
- **Database**: `treatment_plans` table + `treatment_plan_steps` table

### 2. 📸 X-Ray / Image Management
- New **Patient Images** tab on the patient profile page (visible to Admin, Dentist, Hygienist)
- Upload dental X-rays and intra-oral photos to Supabase Storage (`patient-images` bucket)
- Each image record stores: patient_id, image URL, image type (x-ray, intra-oral, other), tooth number (optional), description, date taken, uploaded by
- Gallery view with lightbox for viewing full-size images
- Filter by image type and date
- **Database**: `patient_images` table + new storage bucket

### 3. 📝 Clinical Notes / SOAP Notes
- New **Clinical Notes** section within appointment details and patient profile
- Structured SOAP format: Subjective, Objective, Assessment, Plan
- Each note linked to an appointment and patient
- Only Dentists and Hygienists can create/edit notes; Admin can view
- Notes appear chronologically in patient profile under a "Clinical Notes" tab
- **Database**: `clinical_notes` table (patient_id, appointment_id, subjective, objective, assessment, plan, created_by, created_at)

### 4. ⭐ Patient Reviews / Feedback
- New **Reviews** page in the dashboard sidebar under General (visible to Admin, Receptionist)
- After appointment completion, staff can record patient feedback: rating (1-5 stars), comments, service quality categories
- Dashboard summary showing average rating, recent reviews, trends
- Optional: link feedback to specific appointment and dentist
- **Database**: `patient_reviews` table

### 5. 🪑 Chair / Operatory Management
- New **Chairs** management section in Settings (Admin only can configure)
- Define clinic chairs/operatories with name, status (active/inactive), and room/location
- Enhanced **Appointments** page with a visual "Chair View" toggle:
  - Timeline/grid view showing daily schedule by chair (rows = chairs, columns = time slots)
  - Color-coded by appointment status
  - Drag-friendly visual layout
- Appointments already have a `chair` field — this will be connected to the new chairs table
- **Database**: `clinic_chairs` table

### 6. 🔁 Recurring Appointments
- New option when booking appointments: "Make recurring"
- Configure recurrence: frequency (weekly, bi-weekly, monthly, every 3/6 months), number of occurrences or end date
- Auto-generates future appointment slots based on recurrence rules
- Recurring series linked together so editing/canceling can affect one or all
- Visual indicator on recurring appointments in the calendar
- **Database**: `recurring_appointment_rules` table + `series_id` field on appointments

### 7. 🧾 Expense Tracking
- New **Expenses** page in Finance section (visible to Admin, Accountant)
- Track clinic expenses: vendor, category (supplies, rent, utilities, equipment, salaries, other), amount, date, payment method, receipt reference
- Monthly expense summary with charts
- Compare revenue vs expenses for profitability overview in Reports
- **Database**: `expenses` table

### 8. 📜 Consent Forms
- New **Consent Forms** section accessible from patient profile and treatment plans
- Pre-defined consent form templates (Admin can create/edit templates): general treatment consent, anesthesia consent, surgical consent, etc.
- Generate consent form for a patient with auto-filled details
- Track consent status: pending → signed → expired
- Digital signature capture (name + date + checkbox acknowledgment)
- Signed forms stored as records with timestamp and who witnessed
- **Database**: `consent_form_templates` table + `patient_consent_forms` table

### 9. 🔐 Enhanced Audit Logs
- Existing `activity_log` table already captures some events
- Expand audit logging to cover:
  - Patient record views and edits
  - Invoice modifications
  - Treatment updates
  - Staff changes
  - Settings changes
- New **Audit Log** page in Compliance section (Admin only)
- Searchable and filterable by event type, user, date range, entity
- Shows who did what, when, and to which record

### 10. 🗂️ Document Management
- New **Documents** page in the sidebar under Compliance & Admin (visible to Admin)
- Upload and manage clinic-wide documents: licenses, certificates, contracts, policies
- Also per-patient documents accessible from patient profile (visible to Admin, Dentist, Receptionist)
- Document categories: license, certificate, contract, policy, insurance, other
- Files stored in Supabase Storage (`clinic-documents` bucket)
- Track expiry dates for licenses/certificates with notifications when approaching expiry
- **Database**: `clinic_documents` table + `patient_documents` table + new storage bucket

### 11. Sidebar & Role Access Updates
- **Clinical** section: Add "Treatment Plans" (Admin, Dentist)
- **General** section: Add "Reviews" (Admin, Receptionist)
- **Finance** section: Add "Expenses" (Admin, Accountant)
- **Compliance** section (new group): Add "Audit Log" (Admin), "Documents" (Admin), "Consent Forms" (Admin, Dentist)
- Chair management integrated into Settings
- All existing role-based visibility rules preserved

### 12. Patient Profile Enhancement
- Add tabs to the patient profile page for:
  - Treatment Plans
  - X-Rays & Images
  - Clinical Notes
  - Consent Forms
  - Documents
- Each tab respects role-based access

