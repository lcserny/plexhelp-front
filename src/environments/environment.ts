const currentDomain = `${window.location.protocol}//${window.location.hostname}`;

export const environment = {
    commanderApiUrl: `${currentDomain}:8090/api/v1`,
    securityApiUrl: `${currentDomain}:8091/security`,

    fallbackPosterUrl: "/assets/img/no-poster.jpg",
    darkModeStartHour: 18,
    darkModeEndHour: 6,
};
