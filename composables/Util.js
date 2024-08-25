export const Util = () => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function formatDateYMD(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  function adjustFile(file){
    const now = new Date();
    const dateTimeString = now.toISOString().replace(/[-:.]/g, "").slice(0, 15);
    const fileName = file.name;
    const baseName = fileName.replace(".pdf", "").split(/[\s:.-]+/).pop();
    const newFileName = `${baseName}_${dateTimeString}.pdf`;

    return new File([file], newFileName, { type: file.type });
  }

  return { formatDate, formatDateYMD, adjustFile };
};
