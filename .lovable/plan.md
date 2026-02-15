

## Phase 3: Dental Clinic Tables & Hook Updates

This phase creates all the dental-specific database tables and updates every hook to work with the multi-tenant architecture (filtering by `org_id`).

---

### Part A: Database Tables (via Supabase migrations)

We need to create **~25 tables**, all with an `org_id` column linking to `organizations`. Each table gets RLS policies using `has_org_access()`.

**Core Clinical Tables:**
1. **patients** — Patient demographics (name, DOB, gender, phone, email, blood group, allergies, medical history, emergency contacts, referral source, status)
2. **staff** — Clinic staff members (name, role, phone, email, specialty, status) — separate from auth users, represents clinic-level staff records
3. **appointments** — Scheduling (patient, staff, treatment, date/time, chair, status, walk-in flag, notes)
4. **treatments** — Treatment catalog (name, category, price, duration, description)
5. **dental_chart_entries** — Per-tooth procedure records (patient, tooth number, procedure, surface, condition, dentist, notes, date)
6. **clinical_notes** — SOAP notes per patient/appointment (subjective, objective, assessment, plan)
7. **prescriptions** — Prescription headers (patient, dentist, date, diagnosis, notes)
8. **prescription_medications** — Individual medications per prescription (name, dosage, frequency, duration)

**Finance Tables:**
9. **invoices** — Patient billing (invoice number, patient, date, status, discount, payment method, totals)
10. **invoice_items** — Line items per invoice (treatment, description, quantity, unit price, line total)
11. **payments** — Payment records (invoice, amount, method, date, reference)
12. **expenses** — Clinic expenses (date, category, amount, description, vendor)
13. **registration_fees** — Patient registration fee records
14. **revenue_allocation_rules** — Revenue split configuration (category, percentage, active flag)
15. **staff_allocation_rules** — Staff-based revenue split rules
16. **revenue_allocations** — Computed revenue allocation records
17. **staff_revenue_allocations** — Computed staff revenue allocation records
18. **war_chest_entries** — Excess revenue tracking

**Lab Tables:**
19. **lab_orders** — External lab orders (patient, dentist, work type, lab name, status, dates)
20. **lab_cases** — Internal lab case management (case number, patient, dentist, technician, work type, instructions, fees, status, urgency, shade, etc.)
21. **lab_invoices** — Lab-specific billing (invoice number, clinic code, patient name, subtotal, discount, totals)
22. **lab_allocation_rules** — Lab revenue split configuration

**Supporting Tables:**
23. **clinic_chairs** — Treatment chairs/rooms (name, room, status)
24. **consent_form_templates** — Reusable consent form templates (title, content, category)
25. **patient_consent_forms** — Signed consent forms per patient (template, content, signer, status)
26. **clinic_documents** — Clinic-level document storage (title, category, file URL, expiry)
27. **patient_documents** — Per-patient document storage (title, category, file URL)
28. **patient_images** — Patient clinical images (image URL, type, tooth number, description)
29. **patient_reviews** — Patient feedback/reviews (rating, comment, patient, staff)
30. **activity_log** — Audit trail (event type, description, user, entity references)
31. **notifications** — User notifications (type, title, message, read status)
32. **messages** / **message_recipients** / **message_attachments** — Internal messaging system

---

### Part B: Storage Buckets

- **patient-images** — For clinical photos (X-rays, intraoral images)
- **clinic-documents** — For clinic and patient document uploads

---

### Part C: Update All Hooks (org_id scoping)

Every existing hook gets updated to:
1. Import `useOrg` to get the current `org_id`
2. Add `org_id` to all query keys (for cache isolation between clinics)
3. Filter all SELECT queries by `.eq("org_id", orgId)`
4. Include `org_id` in all INSERT operations
5. Remove `(supabase as any)` casts — tables will now exist in the typed schema

**Hooks to update (20+):**
- `usePatients`, `useAppointments`, `useTreatments`, `useStaff`
- `useInvoices`, `usePayments`, `useExpenses`, `useRegistrationFees`
- `useDentalCharts`, `useClinicalNotes`, `usePrescriptions`
- `useLabOrders`, `useLabCases`, `useLabInvoices`, `useLabAllocation`
- `useInventory`, `useClinicChairs`, `useConsentForms`, `useDocuments`
- `usePatientImages`, `usePatientReviews`, `useAuditLog`
- `useRevenueAllocation`, `useNotifications`, `useMessages`

---

### Part D: RLS Policies

Every table gets the same pattern:
- **SELECT**: `has_org_access(auth.uid(), org_id)` — members can read their clinic's data
- **INSERT/UPDATE/DELETE**: Role-based access using `get_org_role()` — e.g., only dentists/admins can create clinical notes, only accountants/admins can manage invoices
- **Super admins** get full access via `is_super_admin(auth.uid())`

---

### What This Achieves

- All dental clinic data is fully stored in Supabase (no more mock data)
- Complete data isolation between clinics via RLS
- Every hook properly scoped to the current organization
- Type-safe queries (no more `as any` casts on Supabase client)
- The app becomes fully functional for dental clinic operations

