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

  function formatDateDM(dateInput) {
    if (dateInput === ""){
      return "";
    }

    const date = new Date(dateInput);
    const options = { day: '2-digit', month: 'long' };
    return date.toLocaleDateString('id-ID', options);
  }

  function formatY2Digit(dateInput) {
    if (dateInput === ""){
      return "";
    }

    const date = new Date(dateInput);
    return date.getFullYear().toString().slice(-2);
  }

  function getDeadline(dateInput, paymentTerm) {
    if (dateInput === "" || paymentTerm === 0){
      return "";
    }

    const date = new Date(dateInput);

    date.setDate(date.getDate() + paymentTerm);

    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    return date.toLocaleDateString('id-ID', options).replace('.', '');
  }

  function formatNumber(num) {
    if(num === null || num === undefined){
      return "";
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return { formatDate, formatDateYMD, adjustFile, formatDateDM, formatY2Digit, getDeadline, formatNumber };
};
