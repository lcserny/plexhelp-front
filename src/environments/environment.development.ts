const currentDomain = `${window.location.protocol}//${window.location.hostname}`;

export const environment = {
    commanderApiUrl: `${currentDomain}:8080/api/v1`,
    securityApiUrl: `${currentDomain}:8081/security`,

    fallbackPosterUrl: "/assets/img/no-poster.jpg",
    darkModeStartHour: 20,
    darkModeEndHour: 7,
};
