const modules = import.meta.glob('./*.*', { eager: true });

export const icons = Object.fromEntries(
    Object.entries(modules).map(([path, module]) => {
        const fileName = path.split('/').pop();
        return [fileName, module.default]
    })
);