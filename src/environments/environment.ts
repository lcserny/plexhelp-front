// deprecated: used only for autocomplete in code, in prod use front-config repo
const currentDomain = `${window.location.protocol}//${window.location.hostname}`;

export const environment = {
    commanderApiUrl: `${currentDomain}:8090/api/v1`,
    securityApiUrl: `${currentDomain}:8091/security`,

    fallbackPosterUrl: "/assets/img/no-poster.jpg",

    pageSizeOptions: {
        usersList: [5, 10, 25, 100],
        mediaSearch: [10, 20, 50],
        magnets: [10, 20, 50],
        downloads: [10, 20, 50, 100]
    },
};
