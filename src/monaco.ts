// Expose the existing AMD build as the module expected by CodeViewMonaco.
// Waiting for the loader also ensures ZPL registers against the same Monaco instance.
declare const require: (
    modules: string[],
    onLoad: (monaco: typeof import('monaco-editor')) => void,
    onError: (error: Error) => void
) => void;

const monaco = await new Promise<typeof import('monaco-editor')>((resolve, reject) => {
    require(['vs/editor/editor.main'], resolve, reject);
});

export const { editor, languages, Range } = monaco;
