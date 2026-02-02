# TASK: Refactor React Project Structure (Role-based)

## CONTEXT
This is an existing React project with a WRONG folder structure.
The project currently mixes pages, components, auth logic, and admin logic.

Your job is to refactor the STRUCTURE ONLY.
Do NOT change business logic unless required for imports.

---

## TECH STACK
- React (JavaScript)
- React Router v6
- Context API (no Redux)
- No TypeScript

---

## ROLE REQUIREMENTS

There are 3 roles:

### guest
- Not logged in
- Read-only
- Cannot create / edit / delete
- Cannot access admin pages

### user
- Logged in
- Can CRUD allowed resources
- Cannot access admin pages

### admin
- Full CRUD access
- Can access admin dashboard

IMPORTANT:
- ALL roles share ONE common layout
- Differences are ONLY:
  - route access
  - visible UI actions
  - permissions

---

## CURRENT STRUCTURE (WRONG)

```txt
src/
├── admin/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── AdminLayout.js
│
├── components/
│   ├── Login.js
│   ├── Register.js
│   ├── Profile.js
│   ├── PostList.js
│   ├── CreatePost.js
│   ├── EditPost.js
│   └── DraftPost.js
│
├── layouts/
├── Services/
├── App.js
└── index.js


src/
├── app/
│   ├── App.js
│   └── router.js
│
├── auth/
│   ├── AuthContext.js
│   ├── RequireRole.js
│   └── roles.js
│
├── layouts/
│   └── MainLayout.js
│
├── pages/
│   ├── admin/
│   │   └── Dashboard.js
│   │
│   ├── posts/
│   │   ├── PostList.js
│   │   ├── CreatePost.js
│   │   ├── EditPost.js
│   │   └── DraftPost.js
│   │
│   ├── user/
│   │   └── Profile.js
│   │
│   ├── auth/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── ForgotPassword.js
│   │   └── ResetPassword.js
│   │
│   └── common/
│       ├── Forbidden.js
│       └── NotFound.js
│
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── SearchBox/
│   └── RoleGuard.js
│
├── services/
│   ├── auth.service.js
│   └── post.service.js
│
├── styles/
│   └── global.css
│
├── index.js
└── reportWebVitals.js
