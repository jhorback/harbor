
import fs from "fs";
import CleanCSS from "clean-css";
import { styles } from "../src/styles"



const generateTinymceTheme = async () => {
    // can pull this from command line
    const theme = "harbor";
    await Promise.all([
        generateContentCss(theme),
        generateSkinCss(theme)
    ]);
    console.log("generateTinymceTheme: SUCCESS!");
};


const generateSkinCss = async (theme:string) => {
    const css = await Promise.all([getTokensCss(theme), getIndexCss(), getSkinCss(), getMobileSkinCss()]);
    await Promise.all([
        generateCssFiles([css[0], css[1], css[2]].join("\n\n\n\n"), getThemeFolderPath(theme), "skin"),
        generateCssFiles([css[0], css[1], css[3]].join("\n\n\n\n"), getThemeFolderPath(theme), "skin.mobile"),
        writeFile(`${getThemeFolderPath(theme)}/skin.shadowdom.min.css`, "/*INTENTIONALLY BLANK*/")
    ]);
};



const generateContentCss = async (theme:string) => {
    const css = await Promise.all([getTokensCss(theme), getIndexCss(), getContentCss()]);
    css.push(styles.types.cssText, styles.format.cssText);
    await generateCssFiles(css.join("\n\n\n\n"), getThemeFolderPath(theme), "content");
};

const getThemeFolderPath = (theme:string) => `./public/theme/${theme}/tinymce/`;


const generateCssFiles = async (css:string, folderPath:string, name:string) => {
    // generate pretty css
    const cssOutput = new CleanCSS({format: 'beautify'}).minify(css);
    if (cssOutput.errors.length > 0) {
        throw new Error(cssOutput.errors.join("\n"));
    }    

    // generate minified css
    const cssMinOutput = new CleanCSS().minify(css);
    if (cssMinOutput.errors.length > 0) {
        throw new Error(cssMinOutput.errors.join("\n"));
    }

    // write the files
    await Promise.all([
        writeFile(`${folderPath}/${name}.css`, cssOutput.styles),
        writeFile(`${folderPath}/${name}.min.css`, cssOutput.styles)
    ]);
};

const getContentCss = async () =>  await readFile("./public/tinymce/src/content.css");
const getSkinCss = async () =>  await readFile("./public/tinymce/src/skin.css");
const getMobileSkinCss = async () =>  await readFile("./public/tinymce/src/skin.mobile.css");
const getIndexCss = async () =>  await readFile("./src/styles/index.css");
const getTokensCss = async (theme:string) =>  await readFile(`./public/theme/${theme}/tokens.css`);


const readFile = (path:string):Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString());
            }    
        });
    });   
};

const writeFile = (filename:string, data:string):Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Wrote file:", filename);
                resolve();
            }
        });
    });
};

generateTinymceTheme();
