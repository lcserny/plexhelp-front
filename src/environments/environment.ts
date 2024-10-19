// deprecated: used only for autocomplete in code, in prod use front-config repo
const currentDomain = `${window.location.protocol}//${window.location.hostname}`;

export const environment = {
    commanderApiUrl: `${currentDomain}:8090/api/v1`,
    securityApiUrl: `${currentDomain}:8091/security`,

    fallbackPosterUrl: "/assets/img/no-poster.jpg",

    usersListPageSizeOptions: [5, 10, 25, 100],
    mediaSearchPageSizeOptions: [10, 20, 50],
};
