const monaco = await new Promise((resolve, reject) => {
    require(['vs/editor/editor.main'], resolve, reject);
});
export const { editor, languages, Range } = monaco;
