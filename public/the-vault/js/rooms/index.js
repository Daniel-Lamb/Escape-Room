// The Vault — five scenes: four cyclic cross-read locks, then the pooled vault.

import servicedoor from './room1-servicedoor.js';
import alarms from './room2-alarms.js';
import office from './room3-office.js';
import antechamber from './room4-antechamber.js';
import vault from './room5-vault.js';

export default [servicedoor, alarms, office, antechamber, vault];
