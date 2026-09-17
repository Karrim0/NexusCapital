// Shared district (area) list for the whole app.
//
// This used to be duplicated 3 times (AddPropertyView, EditPropertyView,
// FilterBar) which made it easy for the three copies to drift apart.
// Everything now imports from here — update the list once, it updates
// everywhere: dashboard "Add/Edit Property" forms, the public site's
// area filter, and the district-based property filtering.
//
// `key` is the value actually stored on a property (property.district)
// and matched against when filtering by area — keep these stable once
// properties have been saved with them (renaming a key here will "orphan"
// any already-saved property using the old key).
//
// `translationKey` points into i18n/locales/*/translation.json under
// dashboard.addProperty.districts.* (for districts) and
// dashboard.addProperty.districtGroups.* (for groups).

export const DISTRICT_GROUPS = [
  {
    key: "hurghada_upscale",
    translationKey: "dashboard.addProperty.districtGroups.hurghadaUpscale",
  },
  {
    key: "hurghada_new",
    translationKey: "dashboard.addProperty.districtGroups.hurghadaNew",
  },
  {
    key: "el_gouna",
    translationKey: "dashboard.addProperty.districtGroups.elGouna",
  },
];

export const DISTRICTS = [
  // 🏆 Hurghada — Prime & Upscale Areas
  {
    key: "hurghada_general",
    translationKey: "dashboard.addProperty.districts.hurghadaGeneral",
    group: "hurghada_upscale",
  },
  {
    key: "sheraton_road",
    translationKey: "dashboard.addProperty.districts.sheratonRoad",
    group: "hurghada_upscale",
  },
  {
    key: "hadaba",
    translationKey: "dashboard.addProperty.districts.hadaba",
    group: "hurghada_upscale",
  },
  {
    key: "al_ahyaa",
    translationKey: "dashboard.addProperty.districts.alAhyaa",
    group: "hurghada_upscale",
  },
  {
    key: "intercontinental",
    translationKey: "dashboard.addProperty.districts.intercontinental",
    group: "hurghada_upscale",
  },
  {
    key: "marina_hurghada",
    translationKey: "dashboard.addProperty.districts.marinaHurghada",
    group: "hurghada_upscale",
  },
  {
    key: "el_corniche",
    translationKey: "dashboard.addProperty.districts.elCorniche",
    group: "hurghada_upscale",
  },
  {
    key: "village_road",
    translationKey: "dashboard.addProperty.districts.villageRoad",
    group: "hurghada_upscale",
  },
  {
    key: "el_gouna_road",
    translationKey: "dashboard.addProperty.districts.elGounaRoad",
    group: "hurghada_upscale",
  },
  {
    key: "sahl_hasheesh",
    translationKey: "dashboard.addProperty.districts.sahlHasheesh",
    group: "hurghada_upscale",
  },
  {
    key: "makadi_bay",
    translationKey: "dashboard.addProperty.districts.makadiBay",
    group: "hurghada_upscale",
  },
  {
    key: "soma_bay",
    translationKey: "dashboard.addProperty.districts.somaBay",
    group: "hurghada_upscale",
  },

  // 🏙️ Hurghada — New & Modern Areas
  {
    key: "el_mamsha",
    translationKey: "dashboard.addProperty.districts.elMamsha",
    group: "hurghada_new",
  },
  {
    key: "magawish",
    translationKey: "dashboard.addProperty.districts.magawish",
    group: "hurghada_new",
  },
  {
    key: "el_kawther",
    translationKey: "dashboard.addProperty.districts.elKawther",
    group: "hurghada_new",
  },
  {
    key: "mubarak_6",
    translationKey: "dashboard.addProperty.districts.mubarak6",
    group: "hurghada_new",
  },
  {
    key: "mubarak_7",
    translationKey: "dashboard.addProperty.districts.mubarak7",
    group: "hurghada_new",
  },
  {
    key: "airport_road",
    translationKey: "dashboard.addProperty.districts.airportRoad",
    group: "hurghada_new",
  },
  {
    key: "arabia",
    translationKey: "dashboard.addProperty.districts.arabia",
    group: "hurghada_new",
  },

  // 🟦 El Gouna — collapsed into a single area (no sub-districts)
  {
    key: "el_gouna",
    translationKey: "dashboard.addProperty.districts.elGouna",
    group: "el_gouna",
  },
];

// Convenience: districts grouped by group key, in DISTRICT_GROUPS order.
export const districtsByGroup = (groupKey) => DISTRICTS.filter((d) => d.group === groupKey);
