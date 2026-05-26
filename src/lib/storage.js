// Simple storage abstraction. Default backend uses localStorage.
// To migrate to an API, call `setBackend(apiBaseUrl)` which switches
// the implementation to call REST endpoints at that base URL.

const LOCAL_KEY_PATIENTS = "mh_patients_v1";
const LOCAL_KEY_TRAINERS = "mh_trainers_v1";

let backend = null; // { type: 'local' } or { type: 'api', baseUrl }

export function setBackendToApi(baseUrl) {
  backend = { type: "api", baseUrl };
}

export function setBackendToLocal() {
  backend = { type: "local" };
}

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function getPatients() {
  if (!backend) setBackendToLocal();
  if (backend.type === "api") {
    const resp = await fetch(`${backend.baseUrl}/patients`);
    return resp.ok ? resp.json() : [];
  }
  return readLocal(LOCAL_KEY_PATIENTS);
}

export async function addPatient(patient) {
  if (!backend) setBackendToLocal();
  if (backend.type === "api") {
    const resp = await fetch(`${backend.baseUrl}/patients`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patient) });
    return resp.ok ? resp.json() : null;
  }
  const list = readLocal(LOCAL_KEY_PATIENTS);
  list.unshift(patient);
  writeLocal(LOCAL_KEY_PATIENTS, list);
  return patient;
}

export async function getTrainers() {
  if (!backend) setBackendToLocal();
  if (backend.type === "api") {
    const resp = await fetch(`${backend.baseUrl}/trainers`);
    return resp.ok ? resp.json() : [];
  }
  return readLocal(LOCAL_KEY_TRAINERS);
}

export async function addTrainer(trainer) {
  if (!backend) setBackendToLocal();
  if (backend.type === "api") {
    const resp = await fetch(`${backend.baseUrl}/trainers`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(trainer) });
    return resp.ok ? resp.json() : null;
  }
  const list = readLocal(LOCAL_KEY_TRAINERS);
  list.unshift(trainer);
  writeLocal(LOCAL_KEY_TRAINERS, list);
  return trainer;
}

export default {
  setBackendToApi,
  setBackendToLocal,
  getPatients,
  addPatient,
  getTrainers,
  addTrainer,
};
