import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelServicesService {
  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const wscols: XLSX.ColInfo[] = [
      { width: 15 },
      { width: 25 },
      { width: 55 },
      { width: 25 }
    ];
    worksheet['!cols'] = wscols;

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }



  // public exportAsExcelFiletest(json: any[], excelFileName: string): void {
  //   const sheets = {};


  //   json.forEach(item => {
  //     let sheetName = `Sheet_${item.project_name.replace(/\s/g, '_')}`;

  //     // Truncate sheet name if it exceeds 31 characters
  //     if (sheetName.length > 31) {
  //       sheetName = sheetName.substring(0, 31);
  //     }

  //     if (!sheets[sheetName]) {
  //       sheets[sheetName] = [];
  //     }

  //     sheets[sheetName].push(item);
  //   });

  //   const wb: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

  //   for (const sheetName in sheets) {
  //     if (sheets.hasOwnProperty(sheetName)) {
  //       const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheets[sheetName]);
  //       wb.Sheets[sheetName] = ws;
  //       wb.SheetNames.push(sheetName);
  //     }
  //   }

  //   const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, excelFileName);
  // }



  //30.11.2023 working main
  // public exportAsExcelFiletest(json: any[], excelFileName: string): void {
  //   const wb: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

  //   json.forEach(project => {
  //     const projectName = project.project_name;
  //     const projectSheetName = `Project_${projectName}`;
  //     const projectSheetData: any[] = [['User Name', 'Date', 'Total Work Hours']];
  //     const addedUsers: Set<number> = new Set();

  //     project.project_details.forEach(user => {
  //       user.user_details.forEach(userDetail => {
  //         if (!addedUsers.has(user.user_id)) {
  //           projectSheetData.push([
  //             user.user_name,
  //             userDetail.date,
  //             userDetail.totalWorkHours
  //           ]);
  //           addedUsers.add(user.user_id);
  //         }
  //       });
  //     });

  //     wb.Sheets[projectSheetName] = XLSX.utils.aoa_to_sheet(projectSheetData);
  //     wb.SheetNames.push(projectSheetName);
  //   });

  //   const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, excelFileName);
  // }

  //final
  public exportAsExcelFiletest(json: any[], excelFileName: string): void {
    const wb: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

    json.forEach(project => {
      const projectName = project.project_name;
      const projectSheetName = `Project_${projectName}`;
      const truncatedSheetName = this.truncateSheetName(projectSheetName);
      const projectSheetData: any[] = [['User Name', 'Date', 'Total Work Hours']];
      if (  project.project_details.length > 0 && Array.isArray(  project.project_details)) {
        project.project_details.forEach(user => {
          projectSheetData.push([], [user.user_name]); // User name in one row
  
          if ( user.user_details.length > 0 && Array.isArray( user.user_details)) {
            user.user_details.forEach(projectDetail => {
              projectSheetData.push(['', projectDetail.date, projectDetail.totalWorkHours]); // Details follow in rows below
            });
          }else {
            projectSheetData.push(['', "No Data Found", "No Data Found"]);
          }
       
        });
      }else {
        projectSheetData.push([],["No Datas Found"]); 
      }
  

      wb.Sheets[truncatedSheetName] = XLSX.utils.aoa_to_sheet(projectSheetData);
      wb.SheetNames.push(truncatedSheetName);
    });

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  public exportAsExcelFileuser(json: any[], excelFileName: string): void {
    const wb: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

    json.forEach(user => {
      const userName = user.user_name;
      const userSheetName = `User_${userName}`;
      const truncatedSheetName = this.truncateSheetName(userSheetName);
      const projectSheetData: any[] = [['Project Name', 'Date', 'Total Work Hours']];

      user.user_details.forEach(project => {
        projectSheetData.push([], [project.project_name]); // User name in one row
        if (project.project_details.length > 0 && Array.isArray(project.project_details)) {
          project.project_details.forEach(userDetail => {
            projectSheetData.push(['', userDetail.date, userDetail.totalWorkHours]); // Details follow in rows below
          });
        }else {
          projectSheetData.push(['', 'No Data found', "Check In and Check Out record does not found for this user for this particular"]); 
        }

      });

      wb.Sheets[truncatedSheetName] = XLSX.utils.aoa_to_sheet(projectSheetData);
      wb.SheetNames.push(truncatedSheetName);
    });

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }



  public exportToExcel(json: any[], excelFileName: string): void {
    const sheets = {};

    json.forEach(item => {
      const sheetName = `${item.user_id}_${item.name}`;

      if (!sheets[sheetName]) {
        sheets[sheetName] = { user_name: item.name, projects: {} };
      }

      const projectKey = `${item.project_id}_${item.project_name}`;

      if (!sheets[sheetName].projects[projectKey]) {
        sheets[sheetName].projects[projectKey] = [];
      }

      sheets[sheetName].projects[projectKey].push({
        checkType: item.checkType,
        checkTime: item.checkTime,
        location_name: item.location_name
      });
    });

    const wb: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

    for (const userSheetName in sheets) {
      if (sheets.hasOwnProperty(userSheetName)) {
        const userData = sheets[userSheetName];
        const userSheetData: any[] = [['User Name', userData.user_name], [], ['Project ID', 'Project Name', 'Check Type', 'Check Time', 'Location Name']];

        for (const projectKey in userData.projects) {
          if (userData.projects.hasOwnProperty(projectKey)) {
            const projectData = userData.projects[projectKey];
            const [projectId, projectName] = projectKey.split('_');

            userSheetData.push(['', '']); // Add empty row above project name
            userSheetData.push([projectId, projectName]);
            userSheetData.push(['', '']); // Add empty row below project name

            for (const projectDetail of projectData) {
              userSheetData.push([
                '',
                '',
                projectDetail.checkType,
                projectDetail.checkTime,
                projectDetail.location_name
              ]);
            }
          }
        }

        // Add an empty row below user details
        userSheetData.push([]);

        const truncatedSheetName = this.truncateSheetName(userSheetName);
        const userSheetId = `${truncatedSheetName}`;
        wb.Sheets[userSheetId] = XLSX.utils.aoa_to_sheet(userSheetData);
        wb.SheetNames.push(userSheetId);
      }
    }
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private truncateSheetName(name: string): string {
    // Truncate or modify the name as needed
    return name.substring(0, 31);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}


