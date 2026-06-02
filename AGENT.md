# AGENTS.md — Manea Frontend

## Project Engineering Preferences

This frontend should be designed with production-readiness, maintainability, and mobile-first usability in mind.

Manea is a PWA for GPS/RTLS tracking of livestock and assets. The frontend consumes a separate FastAPI backend and provides user interfaces for authentication, device tracking, maps, geofences, alerts, and admin operations.

Default preferences:

* Favor clear, maintainable React code over quick prototypes.
* Keep UI logic, API logic, and domain transformations separated.
* Prefer simple, reusable components.
* Avoid large components with mixed responsibilities.
* Keep the app mobile-first because this is a PWA intended for field usage.
* Avoid introducing new dependencies unless they clearly improve the solution.
* Preserve backend API contracts. Do not invent endpoints, fields, or enum values.
* When a frontend feature needs a backend change, document the required backend follow-up instead of inventing it.

---

## Project Context

Manea is a livestock/asset tracking application.

Core frontend areas:

* Login/authentication.
* Device list.
* Latest device locations.
* Map view using MapLibre.
* Geofence creation and visualization.
* Geofence event alerts.
* Admin panel for global management.
* PWA/mobile-friendly experience.

The backend lives in a separate repository/folder and is not available in this workspace.

Because of that:

* Do not assume backend files exist here.
* Do not modify imaginary backend files.
* Do not invent backend behavior.
* Use the API contract provided by existing frontend services, types, documentation, or user instructions.
* If backend behavior is unclear, ask for the API contract or clearly state the assumption before implementing.
* When a UI change requires backend work, include a `Backend follow-up` section in the final response.

---

## Tech Stack

This frontend uses:

* React.
* Vite.
* TypeScript.
* Tailwind CSS.
* MapLibre for maps.
* PWA-oriented layout and behavior.

Follow the existing project structure and naming conventions.

Do not migrate to another framework, state library, styling solution, or map library unless explicitly requested.

---

## TypeScript Rules

* Use TypeScript strictly and intentionally.
* Avoid `any` unless there is a strong reason.
* Prefer explicit interfaces/types for API responses.
* Keep backend response fields in `snake_case`.
* Do not convert API response models to `camelCase` unless the project already has a dedicated mapping layer.
* Use union types for known enum-like values when reasonable.
* Keep types close to the feature or in a shared types folder if reused.
* Do not duplicate incompatible types for the same backend entity.
* Update related types when API response fields change.

Example API type style:

```ts
export type Device = {
  id_device: number;
  serial: string;
  name: string;
  type: string;
  state: string;
  communication_protocol: string;
  client_id: number;
  asset_id: number | null;
  active: boolean;
};
```

---

## API Contract Rules

The backend API uses `snake_case` response fields.

Frontend code should respect that contract.

* Do not invent endpoint paths.
* Do not invent request/response fields.
* Do not invent enum values.
* Do not silently remove fields that existing screens may rely on.
* Keep API calls centralized in service/client modules.
* Avoid calling `fetch` directly from deeply nested components when a service layer exists.
* Handle loading, error, empty, and success states.
* Handle authentication errors consistently.
* If an endpoint returns paginated data, preserve pagination parameters and behavior.
* If the API contract is unclear, inspect existing frontend API clients/types first.

When adding or modifying an API-consuming feature, include this in the final response:

```txt
API contract used:
- Method/path:
- Request body:
- Query params:
- Response fields:
- Auth requirements:
```

---

## Authentication Rules

Authentication should be consistent across the app.

Current backend auth concepts may include:

* `POST /auth/login`
* `POST /auth/refresh`
* `POST /auth/logout`
* Access token.
* Refresh token.

Frontend rules:

* Do not duplicate auth logic across screens.
* Keep token handling centralized.
* Keep protected route behavior consistent.
* Handle expired access tokens gracefully if refresh flow exists.
* Avoid leaking tokens in logs.
* Do not store unnecessary sensitive user data.
* If changing auth behavior, document backend assumptions clearly.

If the current project still uses `localStorage`, do not migrate storage strategy unless explicitly requested. If recommending a more secure alternative, explain the tradeoff.

---

## UI / UX Rules

The UI should feel modern, clean, and field-friendly.

Design priorities:

* Mobile-first layout.
* Clear hierarchy.
* Large enough tap targets.
* Good contrast.
* Simple navigation.
* Fast access to map, devices, alerts, and admin actions.
* Clear empty states.
* Clear error states.
* Clear loading states.
* Avoid overly dense desktop-only tables for mobile screens.

Use the Manea brand direction where appropriate:

```txt
pine-teal: #00453d
amber-glow: #ffa02c
cornsilk: #fbf5dd
```

Prefer UI patterns that work well on mobile:

* Cards.
* Bottom actions.
* Responsive grids.
* Collapsible details.
* Drawers/sheets when appropriate.
* Simple filters.

Do not redesign the whole app when asked to implement a focused feature.

---

## Tailwind CSS Rules

* Prefer Tailwind utility classes consistent with the existing codebase.
* Avoid large custom CSS files unless needed.
* Extract repeated UI patterns into components.
* Keep class strings readable.
* Avoid unnecessary arbitrary values if theme values can be used.
* Maintain responsive behavior with Tailwind breakpoints.
* Do not introduce a component library unless explicitly requested.

---

## Component Architecture

Prefer this separation:

```txt
page/screen component
-> feature components
-> reusable UI components
-> API services/hooks
-> types
```

Rules:

* Pages should orchestrate data loading and layout.
* Components should receive clear props.
* Avoid deeply nested business logic inside JSX.
* Avoid duplicating API calls across multiple components.
* Extract reusable UI only when reuse is real or near-term likely.
* Keep state as local as possible.
* Do not introduce global state unless needed.

---

## Data Fetching Rules

* Use the existing data fetching pattern in the project.
* Keep API calls in service/client files when possible.
* Always handle:

  * loading state;
  * error state;
  * empty state;
  * success state.
* Avoid infinite polling unless explicitly justified.
* If polling is used, keep intervals reasonable and cleanup timers properly.
* Prepare realtime-related code so it can later evolve to SSE or WebSockets without rewriting the UI completely.

For location data:

* Avoid excessive re-renders on map screens.
* Keep marker updates predictable.
* Preserve device identity between refreshes.
* Make stale/old locations visually or textually clear when relevant.

---

## MapLibre Rules

MapLibre is the preferred map library.

* Do not replace MapLibre with Leaflet, Google Maps, or another library unless explicitly requested.
* Ensure map containers have explicit height.
* Avoid rendering a map into a parent with no height.
* Keep map setup isolated in dedicated components/hooks when possible.
* Clean up map instances and event listeners.
* Avoid recreating the entire map unnecessarily on every render.
* Keep markers/popups readable on mobile.
* Fit bounds when it improves UX, but avoid disorienting the user with constant auto-zooming.
* For device markers, show meaningful information such as name, serial, asset, timestamp, and accuracy when available.
* For geofences, keep drawing/editing behavior explicit and predictable.

Common map container requirement:

```txt
The map parent container must have explicit height, for example h-[calc(...)] or h-full with valid parent heights.
```

---

## Devices and Locations

Device-related UI should respect backend ownership and response contracts.

Common device fields may include:

```txt
id_device
serial
name
type
state
communication_protocol
client_id
asset_id
active
```

Latest location fields may include:

```txt
id_location
latitude
longitude
altitude
accuracy
device_timestamp
received_at
```

Rules:

* Do not assume every device has a location.
* Do not assume every device has an asset.
* Show useful empty states for devices without latest location.
* Display timestamps in a readable way.
* Keep raw technical fields available when useful for debugging/admin views.
* Avoid hiding important device status information.

---

## Geofence UI Rules

Geofences are a core product feature.

Frontend geofence behavior should be clear and safe:

* Make geofence creation steps understandable.
* Make assigned devices/assets visible when relevant.
* Do not assume a geofence applies to all devices unless the backend contract says so.
* Show geofence names clearly.
* Keep map visualization readable.
* Avoid destructive actions without confirmation.
* If shape formats are unclear, rely on existing types/contracts before changing implementation.

Common geofence fields may include:

```txt
id_geofence
client_id
name
description
shape
active
created_at
updated_at
```

---

## Alerts / Events UI Rules

Geofence events should be treated as important user-facing alerts.

Current event response fields may include:

```txt
id_event
fence_id
geofence_name
device_id
device_name
device_serial
asset_type
asset_id
location_id
event_type
distance_to_boundary_meters
accuracy
created_at
```

Rules:

* Show `geofence_name` when available.
* Show `device_name` and/or `device_serial`.
* Show `event_type` with a readable label.
* Show `created_at` in a readable format.
* Show distance/accuracy when useful.
* Provide loading, empty, and error states.
* Keep alert cards mobile-friendly.
* Do not invent event severity unless explicitly defined.
* If adding filters, keep them simple and aligned with existing enum values.

---

## Admin UI Rules

Admin features should be explicit and careful.

* Do not expose admin actions to normal users.
* Respect existing auth/user role checks.
* Destructive or state-changing actions should have confirmation.
* Admin screens may show more technical fields than client screens.
* Avoid mixing admin and client-only behavior in the same component unless the existing architecture already does so.

---

## PWA / Mobile Rules

The app should work well as a PWA.

* Prioritize responsive layouts.
* Avoid fixed desktop-only widths.
* Avoid hover-only interactions.
* Ensure important actions are usable by touch.
* Keep performance in mind on mobile devices.
* Avoid unnecessary heavy dependencies.
* Keep map screens efficient.
* Be careful with viewport height issues on mobile browsers.

---

## Error Handling Rules

* Show user-friendly errors.
* Do not expose raw stack traces.
* Do not expose tokens or sensitive data.
* For API errors, prefer reusable error handling.
* For auth errors, route users consistently.
* For network errors, provide a retry path when reasonable.
* Avoid silent failures.

---

## Accessibility Rules

* Use semantic HTML where possible.
* Use buttons for actions, links for navigation.
* Keep focus behavior reasonable.
* Add accessible labels for icon-only buttons.
* Maintain readable contrast.
* Avoid relying only on color to communicate critical status.

---

## Code Style

* Follow the existing code style.
* Keep components readable.
* Prefer descriptive names.
* Avoid unnecessary abstraction.
* Avoid large files with mixed responsibilities.
* Avoid duplicated API logic.
* Avoid broad refactors unless requested.
* Keep imports clean.
* Remove unused code when modifying files.

---

## Dependency Rules

* Do not add new dependencies unless necessary.
* If adding a dependency, explain why it is needed.
* Prefer built-in browser APIs and existing project utilities.
* Avoid adding large UI/state libraries for small features.

---

## Backend Contract Awareness

The backend is in a separate repository/folder and is not available in this workspace.

When a frontend task depends on backend behavior:

* Use existing API services/types/docs as source of truth.
* If the user provides an endpoint contract, follow it exactly.
* Do not modify backend code from this workspace.
* Do not invent backend fields.
* Do not invent backend filters.
* Do not invent backend pagination behavior.
* If a required backend feature is missing, include a `Backend follow-up` section.

Expected final note when backend work is required:

```txt
Backend follow-up:
- Endpoint/change needed:
- Why the frontend needs it:
- Expected request/response:
```

---

## Final Response Expectations

When finishing a coding task, summarize:

```txt
Changed:
- ...

Why:
- ...

API contract used, if applicable:
- ...

Backend follow-up, if applicable:
- ...

How to test:
- ...
```

If the task was analysis/planning only, provide:

```txt
Recommendation:
- ...

Tradeoffs:
- ...

Next step:
- ...
```
