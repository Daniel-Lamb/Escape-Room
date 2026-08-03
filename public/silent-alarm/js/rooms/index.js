// The seven scenes of Silent Alarm, in order. Each renders a Hand (inside the
// museum) or Eye (the van) variant depending on the chosen role (see js/role.js).

import service from './room1-service.js';
import cameras from './room2-cameras.js';
import gallery from './room3-gallery.js';
import records from './room4-records.js';
import clockhall from './room5-clockhall.js';
import power from './room6-power.js';
import vault from './room7-vault.js';

export default [service, cameras, gallery, records, clockhall, power, vault];
