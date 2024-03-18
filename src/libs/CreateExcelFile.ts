import ExcelJS from "exceljs";

/**
 * ExcelGenerator class for generating Excel workbooks from provided data.
 * 
 * Example usage:
 * 
 * const data = {
 *   "Sheet One": [
 *     { "First Name": "John", "Last Name": "Doe", "Age": "30" },
 *     { "First Name": "Jane", "Last Name": "Doe", "Age": "25" }
 *   ],
 *   "Sheet Two": [
 *     { "Name": "Alice", "Age": "28" },
 *     { "Name": "Bob", "Age": "32" }
 *   ]
 * };
 * 
 * const excelGenerator = new ExcelGenerator(data);
 * const base64Data = await excelGenerator.getBase64();
 * console.log("Base64 encoded Excel data:", base64Data);
 */
export default class ExcelGenerator {
  private excelData: { [key: string]: { [key: string]: string }[] };
  private workbook: ExcelJS.Workbook;

  /**
   * Constructor for ExcelGenerator.
   * @param data Object containing sheet data.
   */
  constructor(data: { [key: string]: { [key: string]: string }[] }) {
    this.excelData = data;
    this.workbook = new ExcelJS.Workbook();
  }

  /**
   * Generates Excel workbook from provided data.
   * @returns Promise<ExcelJS.Workbook> Promise resolving to Excel workbook.
   */
  public async generateWorkbook(): Promise<ExcelJS.Workbook> {
    const sheets = Object.keys(this.excelData);

    await Promise.all(
      sheets.map(async (sheetName) => {
        const worksheet = this.workbook.addWorksheet(sheetName);
        const sheetData = this.excelData[sheetName];
        const columnName = Object.keys(sheetData[0]);

        // Set column headers
        worksheet.columns = columnName.map((headerName) => ({
          header: headerName,
          key: headerName,
        }));

        // Add rows to worksheet
        const rows = sheetData.map((rowData, rowIndex) => {
          const rowObject: { [key: string]: any } = { id: rowIndex };
          columnName.forEach((col) => {
            rowObject[col] = rowData[col];
          });
          return rowObject;
        });
        worksheet.addRows(rows);
      })
    );

    return this.workbook;
  }

  /**
   * Retrieves Excel workbook buffer.
   * @returns Promise<Buffer> Promise resolving to Excel workbook buffer.
   */
  public async getBuffer(): Promise<Buffer> {
    const workbook = await this.generateWorkbook();
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Retrieves Excel workbook as base64 string.
   * @returns Promise<string> Promise resolving to base64 encoded Excel workbook.
   */
  public async getBase64(): Promise<string> {
    const buffer = await this.getBuffer();
    return buffer.toString("base64");
  }
}
