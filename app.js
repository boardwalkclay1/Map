// -----------------------------------------------------
// CORE MAP ENGINE
// -----------------------------------------------------
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

// -----------------------------------------------------
// OSM PROVIDERS
// -----------------------------------------------------
import { OSMAccessibilityProvider } from "./modules/osmAccessibilityProvider.js";
import { OSMAccessibilityScoreProvider } from "./modules/osmAccessibilityScoreProvider.js";
import { OSMAddressProvider } from "./modules/osmAddressProvider.js";
import { OSMAirQualityProvider } from "./modules/osmAirQualityProvider.js";
import { OSMAmenityProvider } from "./modules/osmAmenityProvider.js";
import { OSMBikeabilityProvider } from "./modules/osmBikeabilityProvider.js";
import { OSMBoundaryProvider } from "./modules/osmBoundaryProvider.js";
import { OSMBridgeDetailProvider } from "./modules/osmBridgeDetailProvider.js";
import { OSMBridgeProvider } from "./modules/osmBridgeProvider.js";
import { OSMBuildingHeightProvider } from "./modules/osmBuildingHeightProvider.js";
import { OSMCafeProvider } from "./modules/osmCafeProvider.js";
import { OSMCemeteryProvider } from "./modules/osmCemeteryProvider.js";
import { OSMChargingDetailProvidr } from "./modules/osmChargingDetailProvidr.js";
import { OSMClusterProvider } from "./modules/osmClusterProvider.js";
import { OSMCrimeProxyProvider } from "./modules/osmCrimeProxyProvider.js";
import { OSMCulturalProvider } from "./modules/osmCulturalProvider.js";
import { OSMCyclingProvider } from "./modules/osmCyclingProvider.js";
import { OSMDeliveryProvider } from "./modules/osmDeliveryProvider.js";
import { OSMDisasterAccessProvider } from "./modules/osmDisasterAccessProvider.js";
import { OSMEVChargingProvider } from "./modules/osmEVChargingProvider.js";
import { OSMEarthquakeProvider } from "./modules/osmEarthquakeProvider.js";
import { OSMElevationProvider } from "./modules/osmElevationProvider.js";
import { OSMEmergencyProvider } from "./modules/osmEmergencyProvider.js";
import { OSMFeatureProvider } from "./modules/osmFeatureProvider.js";
import { OSMFireProvider } from "./modules/osmFireProvider.js";
import { OSMFireRiskProvider } from "./modules/osmFireRiskProvider.js";
import { OSMFireStationDistanceProvider } from "./modules/osmFireStationDistanceProvider.js";
import { OSMFitnessProvider } from "./modules/osmFitnessProvider.js";
import { OSMFloodProovider } from "./modules/osmFloodProovider.js";
import { OSMGreenProvider } from "./modules/osmGreenProvider.js";
import { OSMGroceryProvider } from "./modules/osmGroceryProvider.js";
import { OSMHazardProvider } from "./modules/osmHazardProvider.js";
import { OSMHeatStressProvider } from "./modules/osmHeatStressProvider.js";
import { OSMHeatmapProvider } from "./modules/osmHeatmapProvider.js";
import { OSMHospitalDetailProvider } from "./modules/osmHospitalDetailProvider.js";
import { OSMHospitalDistanceProvider } from "./modules/osmHospitalDistanceProvider.js";
import { OSMHydrantDistanceProvider } from "./modules/osmHydrantDistanceProvider.js";
import { OSMIndustrialProvider } from "./modules/osmIndustrialProvider.js";
import { OSMKidFriendProvider } from "./modules/osmKidFriendProvider.js";
import { OSMLandValueProvider } from "./modules/osmLandValueProvider.js";
import { OSMLanduseProvider } from "./modules/osmLanduseProvider.js";
import { OSMLightingProvider } from "./modules/osmLightingProvider.js";
import { OSMMarinaProvider } from "./modules/osmMarinaProvider.js";
import { OSMNightlifeProvider } from "./modules/osmNightlifeProvider.js";
import { OSMNoiseActivityProvider } from "./modules/osmNoiseActivityProvider.js";
import { OSMNoiseBarrierProvider } from "./modules/osmNoiseBarrierProvider.js";
import { OSMNoiseHeatmapProvider } from "./modules/osmNoiseHeatmapProvider.js";
import { OSMNoiseProvider } from "./modules/osmNoiseProvider.js";
import { OSMNoiseRouteProvider } from "./modules/osmNoiseRouteProvider.js";
import { OSMParkingProvider } from "./modules/osmParkingProvider.js";
import { OSMPetFriendlyProvider } from "./modules/osmPetFriendlyProvider.js";
import { OSMPollutionProvider } from "./modules/osmPollutionProvider.js";
import { OSMPopulationProvider } from "./modules/osmPopulationProvider.js";
import { OSMPublicTransportationProvider } from "./modules/osmPublicTransportationProvider.js";
import { OSMQuietRoutingProvider } from "./modules/osmQuietRoutingProvider.js";
import { OSMRestaurantDetailProvider } from "./modules/osmRestaurantDetailProvider.js";
import { OSMRoadQualityProvider } from "./modules/osmRoadQualityProvider.js";
import { OSMRoadWidthProvider } from "./modules/osmRoadWidthProvider.js";
import { OSMRoutingProvider } from "./modules/osmRoutingProvider.js";
import { OSMSafetyProvider } from "./modules/osmSafetyProvider.js";
import { OSMScenicProvider } from "./modules/osmScenicProvider.js";
import { OSMSchoolDistanceProvider } from "./modules/osmSchoolDistanceProvider.js";
import { OSMSearchProvider } from "./modules/osmSearchProvider.js";
import { OSMSeniorFriendProvider } from "./modules/osmSeniorFriendProvider.js";
import { OSMShadeProvider } from "./modules/osmShadeProvider.js";
import { OSMSidewalkProvider } from "./modules/osmSidewalkProvider.js";
import { OSMSlopeProvider } from "./modules/osmSlopeProvider.js";
import { OSMSnowProvider } from "./modules/osmSnowProvider.js";
import { OSMSolarProvider } from "./modules/osmSolarProvider.js";
import { OSMSpeedProvider } from "./modules/osmSpeedProvider.js";
import { OSMTourismDetailProvider } from "./modules/osmTourismDetailProvider.js";
import { OSMTourismProvider } from "./modules/osmTourismProvider.js";
import { OSMTrafficProvider } from "./modules/osmTrafficProvider.js";
import { OSMTransitDistanceProvider } from "./modules/osmTransitDistanceProvider.js";
import { OSMTransitProvider } from "./modules/osmTransitProvider.js";
import { OSMTransitQualityProvider } from "./modules/osmTransitQualityProvider.js";
import { OSMTreeCanopyProvider } from "./modules/osmTreeCanopyProvider.js";
import { OSMTurnRestrictionProvider } from "./modules/osmTurnRestrictionProvider.js";
import { OSMUtilityProvider } from "./modules/osmUtilityProvider.js";
import { OSMWalkTimeProvider } from "./modules/osmWalkTimeProvider.js";
import { OSMWalkabilityProvider } from "./modules/osmWalkabilityProvider.js";
import { OSMWasteProvider } from "./modules/osmWasteProvider.js";
import { OSMWaterProvider } from "./modules/osmWaterProvider.js";
import { OSMWeatherProvider } from "./modules/osmWeatherProvider.js";
import { OSMLsochroneProvider } from "./modules/osmlsochroneProvider.js";

// -----------------------------------------------------
// SKATE PROVIDERS
// -----------------------------------------------------
import { SkateFlowProvider } from "./modules/skateFlowProvider.js";
import { SkateHazardProvider } from "./modules/skateHazardProvider.js";
import { SkateLightingProvider } from "./modules/skateLightingProvider.js";
import { SkateParkProvider } from "./modules/skateParkProvider.js";
import { SkateRouteSafetyProvider } from "./modules/skateRouteSafetyProvider.js";
import { SkateSlopeProvider } from "./modules/skateSlopeProvider.js";
import { SkateSpotFinderProvider } from "./modules/skateSpotFinderProvider.js";
import { SkateSurfaceQualityProvider } from "./modules/skateSurfaceQualityProvider.js";
import { SkateTrafficProvider } from "./modules/skateTrafficProvider.js";
import { SkateVibeProvider } from "./modules/skateVibeProvider.js";

// -----------------------------------------------------
// TREE PROVIDERS
// -----------------------------------------------------
import { TreeAccessProvider } from "./modules/tree/treeAccessProvider.js";
import { TreeDensityProvider } from "./modules/tree/treeDensityProvider.js";
import { TreeDropZoneProvider } from "./modules/tree/treeDropZoneProvider.js";
import { TreeEquipmentAccessProvider } from "./modules/tree/treeEquipmentAccessProvider.js";
import { TreeHazardTreeProvider } from "./modules/tree/treeHazardTreeProvider.js";
import { TreeJobEstimatorProvider } from "./modules/tree/treeJobEstimatorProvider.js";
import { TreePowerlineRiskProvider } from "./modules/tree/treePowerlineRiskProvider.js";
import { TreeSpeciesProvider } from "./modules/tree/treeSpeciesProvider.js";
import { TreeStormDamageProvider } from "./modules/tree/treeStormDamageProvider.js";
import { TreeWorksiteSuitabilityProvider } from "./modules/tree/treeWorksiteSuitabilityProvider.js";
import { TreeRiskAssessmentProvider } from "./modules/tree/treeRiskAssessmentProvider.js";

// -----------------------------------------------------
// MAP INITIALIZATION
// -----------------------------------------------------
const core = new MapCore({
  targetId: "map",
  center: [33.7490, -84.3880],
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

// expose globally
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

// -----------------------------------------------------
// GLOBAL ENGINE REGISTRY
// -----------------------------------------------------
window.MapEngines = {
  osm: {
    accessibility: OSMAccessibilityProvider,
    accessibilityScore: OSMAccessibilityScoreProvider,
    address: OSMAddressProvider,
    airQuality: OSMAirQualityProvider,
    amenity: OSMAmenityProvider,
    bikeability: OSMBikeabilityProvider,
    boundary: OSMBoundaryProvider,
    bridge: OSMBridgeProvider,
    bridgeDetail: OSMBridgeDetailProvider,
    buildingHeight: OSMBuildingHeightProvider,
    cafe: OSMCafeProvider,
    cemetery: OSMCemeteryProvider,
    chargingDetail: OSMChargingDetailProvidr,
    cluster: OSMClusterProvider,
    crimeProxy: OSMCrimeProxyProvider,
    cultural: OSMCulturalProvider,
    cycling: OSMCyclingProvider,
    delivery: OSMDeliveryProvider,
    disasterAccess: OSMDisasterAccessProvider,
    evCharging: OSMEVChargingProvider,
    earthquake: OSMEarthquakeProvider,
    elevation: OSMElevationProvider,
    emergency: OSMEmergencyProvider,
    feature: OSMFeatureProvider,
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
    noiseActivity: OSMNoiseActivityProvider,
    noiseBarrier: OSMNoiseBarrierProvider,
    noiseHeatmap: OSMNoiseHeatmapProvider,
    noise: OSMNoiseProvider,
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
    tourismDetail: OSMTourismDetailProvider,
    tourism: OSMTourismProvider,
    traffic: OSMTrafficProvider,
    transitDistance: OSMTransitDistanceProvider,
    transit: OSMTransitProvider,
    transitQuality: OSMTransitQualityProvider,
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
    jobEstimator: TreeJobEstimatorProvider,
    powerlineRisk: TreePowerlineRiskProvider,
    species: TreeSpeciesProvider,
    stormDamage: TreeStormDamageProvider,
    worksiteSuitability: TreeWorksiteSuitabilityProvider,
    riskAssessment: TreeRiskAssessmentProvider
  }
};
