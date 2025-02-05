/**
 * @author Shyam Hajare <hajareshyam@gmail.com>
 */

/**
 * create function is used to create pdf from handlebar templates.
 * @param  {document, options}
 * @return {callback}
 */

import Handlebars from "handlebars";
import pdf, { CreateOptions } from "html-pdf";

Handlebars.registerHelper(
  "ifCond",
  function (
    this: any,
    v1: any,
    operator: string,
    v2: any,
    options: IfCondOptions
  ) {
    switch (operator) {
      case "==":
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case "===":
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case "!=":
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case "!==":
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case "<":
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case "<=":
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case ">":
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case ">=":
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case "&&":
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case "||":
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  }
);

const create = function (
  document: Document,
  options: CreateOptions
): Promise<Buffer | NodeJS.ReadableStream | pdf.FileInfo> {
  return new Promise((resolve, reject) => {
    if (!document || !document.html || !document.data) {
      reject(new Error("Some, or all, options are missing."));
    }
    // Compiles a template
    const html = Handlebars.compile(document.html)(document.data);
    const pdfPromise = pdf.create(html, options);

    // Create PDF from html template generated by handlebars
    // Output will be PDF file

    switch (document.type) {
      case "buffer":
        pdfPromise.toBuffer((err, res) => {
          if (!err) resolve(res);
          else reject(err);
        });
        break;

      case "stream":
        pdfPromise.toStream((err, res) => {
          if (!err) resolve(res);
          else reject(err);
        });
        break;

      default:
        pdfPromise.toFile(document.path!, (err, res) => {
          if (!err) resolve(res);
          else reject(err);
        });
        break;
    }
  });
};

module.exports.create = create;
