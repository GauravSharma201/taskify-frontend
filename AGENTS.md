<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## No server code in this app

This is a frontend-only app. A separate backend already serves it, so do not build server logic here: no server actions (`"use server"`), no route handlers (`app/**/route.ts`), no database or auth code.

- Forms validate in the browser (Formik + Yup) and stop at `onSubmit`. Leave a `// TODO: connect to backend` there instead of calling anything.
- All backend calls go through `apiClient` (`lib/api/client.ts`); never call `fetch` or bare `axios` directly. It rejects with `ApiError` (`lib/api/errors.ts`). See `docs/wiring/axios-setup.md`.
- Data from the backend is read with TanStack Query (`useQuery`) and changed with `useMutation`; their `queryFn` / `mutationFn` call `apiClient`. Don't keep server data in `useState`. See `docs/wiring/tanstack-query-setup.md`.
- A screen calls the backend only when the user asks for that screen to be connected. Until then its `onSubmit` keeps `// TODO: connect to backend`.

## Connecting a screen: plan its logic first

Before writing any API code for a screen, read `docs/screen-logic-workflow.md` and follow its **Workflow**:

1. Write the screen's logic doc at `docs/logic/<screen>.md` from the template there: triggers, APIs (query or mutation), request shaping, response map, state placement, side effects.
2. Classify every API function, query key, hook, Redux slice and helper as **Reuse / Extend / New** against `docs/state-inventory.md`.
3. Share the logic doc and wait for approval before implementing.
4. After implementing, set the logic doc to `implemented` and update `docs/state-inventory.md` in the same change.

Where state lives, first match wins: backend data → TanStack Query · survives reload / shareable → URL · form input → Formik · needed by distant components or across routes → Redux (`lib/store/slices/`, via `useAppSelector` / `useAppDispatch` from `lib/store/hooks.ts`) · anything else → `useState`. Never copy backend data into Redux, never use plain `useSelector` / `useDispatch`, never keep passwords or tokens in JS state.

## Forms: Formik + Yup

Before building or changing any form, read `.claude/plan/Taskify-forms-formik-yup.md` and follow its structure. Do not deviate without the user's approval; if the code and the plan disagree, update the plan in the same change.

- Per screen, in its route folder: `<screen>-form.tsx` (`"use client"`; owns `<Formik>`, initial values, `onSubmit`) and `<screen>-schema.ts` (exports `<screen>Schema`, `<Screen>Values`, `<screen>InitialValues`).
- Field rules come from `lib/validation/rules.ts`. A field kind used by two or more forms gets a rule there; never copy a rule into a schema.
- Build fields with the form inputs in `components/common/form-*.tsx` (`FormTextField`, `FormPasswordField`, `FormCheckbox`, `FormErrorBanner`, `FocusFirstError`). Never wire `useField`, `aria-*` or `FieldError` by hand in a screen; if an input is missing, add a new `form-*` input.
- `onSubmit` ends at `// TODO: connect to backend`. No zod, no server actions.

## Building UI: check the component registry first

`docs/component-inventory.md` is the registry of every UI component. Read it before building anything from a screen or screenshot, and follow its **Workflow** section:

1. Break the screen into its UI elements, using registry names where one fits.
2. Classify each element as **Reuse** (exists as-is), **Extend** (exists; needs a new variant, size or prop) or **New** (nothing in the registry does this job). Same job, different look means Extend, not New.
3. Before calling anything New, search `components/ui`, `components/common` and `components/layout`. If the code has it but the registry doesn't, fix the registry.
4. Show the user the Reuse / Extend / New table and wait for approval before building.
5. After building, update the registry in the same change: Status, Path, Variants / props, Looks like, and the screen's row. Also add or update the component's demo on the `/components` gallery (`app/(dev)/components/page.tsx`), showing every variant and state.
