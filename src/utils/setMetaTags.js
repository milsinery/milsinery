export const setMetaTags = (iconPath, manifestPath) => {
    // Set icon
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
        link.href = iconPath;
    } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = iconPath;
        document.head.appendChild(newLink);
    }

    // Set manifest
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
        manifestLink.href = manifestPath;
    } else {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = manifestPath;
        document.head.appendChild(manifestLink);
    }
};