// app.js

// ---------------------------------------------
// CORE MAP ENGINE PIECES (all under /modules/)
// ---------------------------------------------
import { MapCore } from "./modules/mapCore.js";
import { LayerManager } from "./modules/layerManager.js";
import { MarkerEngine } from "./modules/markerEngine.js";
import { DrawingEngine } from "./modules/drawingEngine.js";
import { RadiusTool } from "./modules/radiusTool.js";
import { PopupEngine } from "./modules/popupEngine.js";
import { TileCacheEngine } from "./modules/tileCacheEngine.js";
import { StorageEngine } from "./modules/storageEngine.js";
import { PerfMonitor } from "./modules/perfMonitor.js";
import { StreetViewShell } from "./modules/streetViewShell.js";

// ---------------------------------------------
// OSM PROVIDERS (filenames EXACTLY as you listed)
// ---------------------------------------------

import { OSMAccessibilityProvider } from "./osmAccessibilityProvider.js";
import { OSMAccessibilityScoreProvider } from "./osmAccessibilityScoreProvider.js";
import { OSMAdressProvider } from "./osmAdressProvider.js"; // filename typo kept
import { OSMAitQualityProvider } from "./osmAitQualityProvider.js"; // filename typo kept
import { OSMAmenityProvider } from "./osmAmenityProvider.js";
import { OSMBikeabilityProvider } from "./osmBikeabilityProvider.js";
import { OSMBoundaryProvider } from "./osmBoundaryProvider.js";
import { OSMBridgeDetailProvider } from "./osmBridgeDetailProvider.js";
import { OSMBridgeProvidr } from "./osmBridgeProvidr.js"; // filename typo kept
import { OSMBuildingHeightProvider } from "./osmBuildingHeightProvider.js";
import { OSMCafeProvidr } from "./osmCafeProvidr.js"; // filename typo kept
import { OSMCemeteryProvider } from "./osmCemeteryProvider.js";
import { OSMChargingDetailProvidr } from "./osmChargingDetailProvidr.js"; // filename typo kept
import { OSMClusterProvider } from "./osmClusterProvider.js";
import { OSMCrimeProxyProvider } from "./osmCrimeProxyProvider.js";
import { OSMCulturalProvider } from "./osmCulturalProvider.js";
import { OSMCyclingProvider } from "./osmCyclingProvider.js";
import { OSMDeliveryProvider } from "./osmDeliveryProvider.js";
import { OSMDisasterAccessProvider } from "./osmDisasterAccessProvider.js";
import { OSMEVChargingProvider } from "./osmEVChargingProvider.js";
import { OSMEarthquakeProvider } from "./osmEarthquakeProvider.js";
import { OSMElevationProvider } from "./osmElevationProvider.js";
import { OSMEmergencyProvider } from "./osmEmergencyProvider.js";
import { OSMFeatureProvider } from "./osmFeatureProvider.js";
import { OSMFireProvider } from "./osmFireProvider.js";
import { OSMFireRiskProvider } from "./osmFireRiskProvider.js";
import { OSMFireStationDistanceProvider } from "./osmFireStationDistanceProvider.js";
import { OSMFitnessProvider } from "./osmFitnessProvider.js";
import { OSMFloodProovider } from "./osmFloodProovider.js"; // filename typo kept
import { OSMGreenProvider } from "./osmGreenProvider.js";
import { OSMGroceryProvider } from "./osmGroceryProvider.js";
import { OSMHazardProvider } from "./osmHazardProvider.js";
import { OSMHeatStressProvider } from "./osmHeatStressProvider.js";
import { OSMHeatmapProvider } from "./osmHeatmapProvider.js";
import { OSMHospitalDetailProvider } from "./osmHospitalDetailProvider.js";
import { OSMHospitalDistanceProvider } from "./osmHospitalDistanceProvider.js";
import { OSMHydrantDistanceProvider } from "./osmHydrantDistanceProvider.js";
import { OSMIndustrialProvider } from "./osmIndustrialProvider.js";
import { OSMKidFriendProvider } from "./osmKidFriendProvider.js";
import { OSMLandValueProvider } from "./osmLandValueProvider.js";
import { OSMLanduseProvider } from "./osmLanduseProvider.js";
import { OSMLightingProvider } from "./osmLightingProvider.js";
import { OSMMarinaProvider } from "./osmMarinaProvider.js";
import { OSMNightlifeProvider } from "./osmNightlifeProvider.js";
import { OSMNoiseActivityProvider } from "./osmNoiseActivityProvider.js";
import { OSMNoiseBarrierProvider } from "./osmNoiseBarrierProvider.js";
import { OSMNoiseHeatmapProvider } from "./osmNoiseHeatmapProvider.js";
import { OSMNoiseProvider } from "./osmNoiseProvider.js";
import { OSMNoiseRouteProvider } from "./osmNoiseRouteProvider.js";
import { OSMParkingProvider } from "./osmParkingProvider.js";
import { OSMPetFriendlyProvider } from "./osmPetFriendlyProvider.js";
import { OSMPollutionProvider } from "./osmPollutionProvider.js";
import { OSMPopulationProvider } from "./osmPopulationProvider.js";
import { OSMPublicTransportationProvider } from "./osmPublicTransportationProvider.js";
import { OSMQuietRoutingProvider } from "./osmQuietRoutingProvider.js";
import { OSMRestaurantDetailProvider } from "./osmRestaurantDetailProvider.js";
import { OSMRoadQualityProvider } from "./osmRoadQualityProvider.js";
import { OSMRoadWidthProvider } from "./osmRoadWidthProvider.js";
import { OSMRoutingProvider } from "./osmRoutingProvider.js";
import { OSMSafetyProvider } from "./osmSafetyProvider.js";
import { OSMScenicProvider } from "./osmScenicProvider.js";
import { OSMSchoolDistanceProvider } from "./osmSchoolDistanceProvider.js";
import { OSMSearchProvider } from "./osmSearchProvider.js";
import { OSMSeniorFriendProvider } from "./osmSeniorFriendProvider.js";
import { OSMShadeProvider } from "./osmShadeProvider.js";
import { OSMSidewalkProvider } from "./osmSidewalkProvider.js";
import { OSMSlopeProvider } from "./osmSlopeProvider.js";
import { OSMSnowProvider } from "./osmSnowProvider.js";
import { OSMSolarProvider } from "./osmSolarProvider.js";
import { OSMSpeedProvider } from "./osmSpeedProvider.js";
import { OSMTourismDetailProvider } from "./osmTourismDetailProvider.js";
import { OSMTourismProvider } from "./osmTourismProvider.js";
import { OSMTrafficProvider } from "./osmTrafficProvider.js";
import { OSMTransitDistanceProvider } from "./osmTransitDistanceProvider.js";
import { OSMTransitProvidr } from "./osmTransitProvidr.js"; // filename typo kept
import { OSMTransitQualityProvidr } from "./osmTransitQualityProvidr.js"; // filename typo kept
import { OSMTreeCanopyProvider } from "./osmTreeCanopyProvider.js";
import { OSMTurnRestrictionProvider } from "./osmTurnRestrictionProvider.js";
import { OSMUtilityProvider } from "./osmUtilityProvider.js";
import { OSMWalkTimeProvider } from "./osmWalkTimeProvider.js";
import { OSMWalkabilityProvider } from "./osmWalkabilityProvider.js";
import { OSMWasteProvider } from "./osmWasteProvider.js";
import { OSMWaterProvider } from "./osmWaterProvider.js";
import { OSMWeatherProvider } from "./osmWeatherProvider.js";
import { OSMLsochroneProvider } from "./osmlsochroneProvider.js"; // filename typo kept

// ---------------------------------------------
// SKATE PROVIDERS
// ---------------------------------------------
import { SkateFlowProvider } from "./skateFlowProvider.js";
import { SkateHazardProvider } from "./skateHazardProvider.js";
import { SkateLightingProvider } from "./skateLightingProvider.js";
import { SkateParkProvider } from "./skateParkProvider.js";
import { SkateRouteSafetyProvider } from "./skateRouteSafetyProvider.js";
import { SkateSlopeProvider } from "./skateSlopeProvider.js";
import { SkateSpotFinderProvider } from "./skateSpotFinderProvider.js";
import { SkateSurfaceQualityProvider } from "./skateSurfaceQualityProvider.js";
import { SkateTrafficProvider } from "./skateTrafficProvider.js";
import { SkateVibeProvider } from "./skateVibeProvider.js";

// ---------------------------------------------
// TREE PROVIDERS
// ---------------------------------------------
import { TreeAccessProvider } from "./treeAccessProvider.js";
import { TreeDensityProvider } from "./treeDensityProvider.js";
import { TreeDropZoneProvider } from "./treeDropZoneProvider.js";
import { TreeEquipmentAccessProvider } from "./treeEquipmentAccessProvider.js";
import { TreeHazardTreeProvider } from "./treeHazardTreeProvider.js";
import { TreeJobEstimatorProvider } from "./treeJobEstimatorProvider.js";
import { TreePowerlineRiskProvider } from "./treePowerlineRiskProvider.js";
import { TreeSpeciesProvider } from "./treeSpeciesProvider.js";
import { TreeStormDamageProvider } from "./treeStormDamageProvider.js";
import { TreeWorksiteSuitabilityProvider } from "./treeWorksiteSuitabilityProvider.js";
import { TreeRiskAssessmentProvider } from "./treeRiskAssessmentProvider.js";

// NOTE: if you also created:
//  - treeJobCostEstimatorProvider.js
//  - treeCrewTimeEstimatorProvider.js
//  - treeCleanupVolumeProvider.js
// import them here and add to the registry the same way.

// ---------------------------------------------
// GLOBAL ENGINE REGISTRY
// ---------------------------------------------
window.MapEngines = {
  osm: {
    feature: OSMFeatureProvider,
    address: OSMAdressProvider,
    accessibility: OSMAccessibilityProvider,
    accessibilityScore: OSMAccessibilityScoreProvider,
    airQuality: OSMAitQualityProvider,
    amenities: OSMAmenityProvider,
    bikeability: OSMBikeabilityProvider,
    boundary: OSMBoundaryProvider,
    bridge: OSMBridgeProvidr,
    bridgeDetail: OSMBridgeDetailProvider,
    buildingHeight: OSMBuildingHeightProvider,
    cafe: OSMCafeProvidr,
    cemetery: OSMCemeteryProvider,
    charging: OSMEVChargingProvider,
    chargingDetail: OSMChargingDetailProvidr,
    cluster: OSMClusterProvider,
    crimeProxy: OSMCrimeProxyProvider,
    cultural: OSMCulturalProvider,
    cycling: OSMCyclingProvider,
    delivery: OSMDeliveryProvider,
    disasterAccess: OSMDisasterAccessProvider,
    earthquake: OSMEarthquakeProvider,
    elevation: OSMElevationProvider,
    emergency: OSMEmergencyProvider,
    fire: OSMFireProvider,
    fireRisk: OSMFireRiskProvider,
    fireStationDistance: OSMFireStationDistanceProvider,
    fitness: OSMFitnessProvider,
    flood: OSMFloodProovider,
    green: OSMGreenProvider,
    grocery: OSMGroceryProvider,
    hazard: OSMHazardProvider,
    heatStress: OSMHeatStressProvider,
    heatmap: OSMHeatmapProvider,
    hospitalDetail: OSMHospitalDetailProvider,
    hospitalDistance: OSMHospitalDistanceProvider,
    hydrantDistance: OSMHydrantDistanceProvider,
    industrial: OSMIndustrialProvider,
    kidFriend: OSMKidFriendProvider,
    landValue: OSMLandValueProvider,
    landuse: OSMLanduseProvider,
    lighting: OSMLightingProvider,
    marina: OSMMarinaProvider,
    nightlife: OSMNightlifeProvider,
    noise: OSMNoiseProvider,
    noiseHeatmap: OSMNoiseHeatmapProvider,
    noiseBarrier: OSMNoiseBarrierProvider,
    noiseActivity: OSMNoiseActivityProvider,
    noiseRoute: OSMNoiseRouteProvider,
    parking: OSMParkingProvider,
    petFriendly: OSMPetFriendlyProvider,
    pollution: OSMPollutionProvider,
    population: OSMPopulationProvider,
    publicTransportation: OSMPublicTransportationProvider,
    quietRouting: OSMQuietRoutingProvider,
    restaurantDetail: OSMRestaurantDetailProvider,
    roadQuality: OSMRoadQualityProvider,
    roadWidth: OSMRoadWidthProvider,
    routing: OSMRoutingProvider,
    safety: OSMSafetyProvider,
    scenic: OSMScenicProvider,
    schoolDistance: OSMSchoolDistanceProvider,
    search: OSMSearchProvider,
    seniorFriend: OSMSeniorFriendProvider,
    shade: OSMShadeProvider,
    sidewalk: OSMSidewalkProvider,
    slope: OSMSlopeProvider,
    snow: OSMSnowProvider,
    solar: OSMSolarProvider,
    speed: OSMSpeedProvider,
    tourism: OSMTourismProvider,
    tourismDetail: OSMTourismDetailProvider,
    traffic: OSMTrafficProvider,
    transitDistance: OSMTransitDistanceProvider,
    transit: OSMTransitProvidr,
    transitQuality: OSMTransitQualityProvidr,
    treeCanopy: OSMTreeCanopyProvider,
    turnRestriction: OSMTurnRestrictionProvider,
    utility: OSMUtilityProvider,
    walkTime: OSMWalkTimeProvider,
    walkability: OSMWalkabilityProvider,
    waste: OSMWasteProvider,
    water: OSMWaterProvider,
    weather: OSMWeatherProvider,
    isochrone: OSMLsochroneProvider
  },

  skate: {
    flow: SkateFlowProvider,
    hazard: SkateHazardProvider,
    lighting: SkateLightingProvider,
    park: SkateParkProvider,
    routeSafety: SkateRouteSafetyProvider,
    slope: SkateSlopeProvider,
    spotFinder: SkateSpotFinderProvider,
    surface: SkateSurfaceQualityProvider,
    traffic: SkateTrafficProvider,
    vibe: SkateVibeProvider
  },

  tree: {
    access: TreeAccessProvider,
    density: TreeDensityProvider,
    dropZone: TreeDropZoneProvider,
    equipmentAccess: TreeEquipmentAccessProvider,
    hazardTree: TreeHazardTreeProvider,
    jobDifficulty: TreeJobEstimatorProvider,
    powerlineRisk: TreePowerlineRiskProvider,
    species: TreeSpeciesProvider,
    stormDamage: TreeStormDamageProvider,
    worksiteSuitability: TreeWorksiteSuitabilityProvider,
    riskAssessment: TreeRiskAssessmentProvider
  }
};

// ---------------------------------------------
// MAP INITIALIZATION
// ---------------------------------------------

const core = new MapCore({
  targetId: "map",
  center: [33.7490, -84.3880], // Atlanta as default
  zoom: 13
});

const layers = new LayerManager(core);
const markers = new MarkerEngine(core);
const drawing = new DrawingEngine(core);
const radius = new RadiusTool(core);
const popups = new PopupEngine(core);
const tiles = new TileCacheEngine(core);
const storage = new StorageEngine();
const perf = new PerfMonitor(core);
const streetView = new StreetViewShell(core);

// expose globally so other scripts / apps can use them
window.Map = core;
window.MapLayers = layers;
window.MapMarkers = markers;
window.MapDrawing = drawing;
window.MapRadius = radius;
window.MapPopups = popups;
window.MapTiles = tiles;
window.MapStorage = storage;
window.MapPerf = perf;
window.MapStreetView = streetView;
