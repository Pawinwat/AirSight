type FeatureSet = {
    taskFlowAPI: boolean;
    gridView: boolean;
    datasets: boolean;
    dynamicTaskMapping: boolean;
    dataSetsTriggering: boolean;
    taskGroupsUIImprovements?: boolean;
    newLineageBackend?: boolean;
  };

  
  const versionFeatures: Record<string, FeatureSet> = {
    "2.1.0": {
      taskFlowAPI: false, // TaskFlow API introduced in 2.2.0
      gridView: false,    // Grid View introduced in 2.3.0
      datasets: false,    // Datasets introduced in 2.4.0
      dynamicTaskMapping: false, // Dynamic Task Mapping introduced in 2.3.0
      dataSetsTriggering: false, // Datasets triggering introduced in 2.4.0
    },
    "2.2.0": {
      taskFlowAPI: true,  // TaskFlow API available
      gridView: false,
      datasets: false,
      dynamicTaskMapping: false,
      dataSetsTriggering: false,
    },
    "2.3.0": {
      taskFlowAPI: true,
      gridView: true,     // Grid View introduced
      datasets: false,
      dynamicTaskMapping: true, // Dynamic Task Mapping introduced
      dataSetsTriggering: false,
    },
    "2.4.0": {
      taskFlowAPI: true,
      gridView: true,
      datasets: true,     // Datasets introduced
      dynamicTaskMapping: true,
      dataSetsTriggering: true, // Datasets triggering introduced
    },
    "2.5.0": {
      taskFlowAPI: true,
      gridView: true,
      datasets: true,
      dynamicTaskMapping: true,
      dataSetsTriggering: true,
    },
    "2.6.0": {
      taskFlowAPI: true,
      gridView: true,
      datasets: true,
      dynamicTaskMapping: true,
      dataSetsTriggering: true,
      taskGroupsUIImprovements: true, // Task Groups UI improvements
    },
    "2.7.0": {
      taskFlowAPI: true,
      gridView: true,
      datasets: true,
      dynamicTaskMapping: true,
      dataSetsTriggering: true,
      taskGroupsUIImprovements: true,
      newLineageBackend: true, // New Lineage Backend introduced
    },
  };
/**
 * Compares two semantic version strings (e.g., "2.3.0" and "2.7.0").
 * @param version1 - The first version string.
 * @param version2 - The second version string.
 * @returns -1 if version1 < version2, 1 if version1 > version2, 0 if equal.
 */
export const compareVersions = (version1: string, version2: string): number => {
    const parseVersion = (version: string): number[] =>
      version.split('.').map((num) => parseInt(num, 10));
  
    const [major1, minor1, patch1] = parseVersion(version1);
    const [major2, minor2, patch2] = parseVersion(version2);
  
    if (major1 !== major2) return major1 > major2 ? 1 : -1;
    if (minor1 !== minor2) return minor1 > minor2 ? 1 : -1;
    if (patch1 !== patch2) return patch1 > patch2 ? 1 : -1;
  
    return 0; // Versions are equal
  };
  

  export const isFeatureSupported = (version: string, feature: keyof FeatureSet): boolean => {
    const features = Object.keys(versionFeatures).reverse(); // Sort versions in descending order
    for (const supportedVersion of features) {
      if (compareVersions(version, supportedVersion) >= 0) {
        return versionFeatures[supportedVersion][feature] || false;
      }
    }
    return false;
  };
  