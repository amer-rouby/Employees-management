import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


@Injectable({
  providedIn: 'root'
})
export class PdfService {
  generatePdf(elementId: string, fileName: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      html2canvas(element, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      })
        .then((canvas) => {
          const imgWidth = 190;
          const pageHeight = 290;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');

          const margin = 10;
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(fileName);
        })
        .catch((err) => console.error('Error generating PDF:', err));
    }
  }
}
