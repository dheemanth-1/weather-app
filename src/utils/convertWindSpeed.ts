export function convertWindSpeed(speedInMetersPerSec: number): string {
    const speedInKmPerHr = speedInMetersPerSec * 3.6;
    return `${speedInKmPerHr.toFixed(0)} km/h`;
}
