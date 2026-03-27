const modules = import.meta.glob('./project_default_image_*.jpg', { eager: true });

export const images = Object.keys(modules)
    .sort()
    .map(key => modules[key].default);