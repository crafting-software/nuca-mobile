import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import { CatSterilizationReport, castToReport } from '../models/Report';
import { isWeb } from '../utils/platform';
import SnackbarManager from './SnackbarManager';
import { makeRequest } from './server';

export const getReports = async (
  checkInDate: Date,
  checkOutDate: Date
): Promise<{
  success: boolean;
  report?: CatSterilizationReport;
}> => {
  const formattedCheckInDate = moment(checkInDate).format('YYYY-MM-DD');
  const formattedCheckOutDate = moment(checkOutDate).format('YYYY-MM-DD');

  const { error, data } = await makeRequest({
    path: `/report?check_in_date=${formattedCheckInDate}&check_out_date=${formattedCheckOutDate}`,
    method: 'GET',
  });

  if (error) {
    console.error('fetching the reports failed', error);
    return { success: false };
  }

  return { success: true, report: castToReport(data) };
};

const getFileUri = (filename: string) => {
  return FileSystem.documentDirectory + `${encodeURI(filename)}.csv`;
};

const saveReportAsCsvFileOnMobile = async (
  filename: string,
  report: CatSterilizationReport
) => {
  const fileUri = getFileUri(filename);
  await FileSystem.writeAsStringAsync(fileUri, report.content);
  await Sharing.shareAsync(fileUri);
};

const saveReportAsCsvFileOnWeb = async (
  filename: string,
  report: CatSterilizationReport
) => {
  const downloadFileThroughHiddenAnchor = async (blob: Blob) => {
    const hiddenDownloadAnchor = document.createElement('a');
    hiddenDownloadAnchor.download = `${filename}.csv`;
    hiddenDownloadAnchor.href = URL.createObjectURL(blob);
    hiddenDownloadAnchor.addEventListener('click', _e => {
      setTimeout(
        () => URL.revokeObjectURL(hiddenDownloadAnchor.href),
        30 * 1000
      );
    });
    hiddenDownloadAnchor.click();
  };

  const blob = new Blob([report.content], { type: 'text/csv' });
  downloadFileThroughHiddenAnchor(blob);
};

export const saveReportAsCsvFile = async (
  checkInDate: Date,
  checkOutDate: Date,
  filename: string
) => {
  const { success, report } = await getReports(checkInDate, checkOutDate);

  if (!success) {
    SnackbarManager.error(
      'reports.ts - saveReportAsCsvFile - request failed',
      'CSV report request failed.'
    );
    return;
  }

  if (!report) {
    SnackbarManager.error(
      'reports.ts - saveReportAsCsvFile - empty report contents',
      'The downloaded CSV report is empty.'
    );
    return;
  }

  isWeb()
    ? saveReportAsCsvFileOnWeb(filename, report)
    : saveReportAsCsvFileOnMobile(filename, report);
};
