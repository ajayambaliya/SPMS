import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

export const generatePayslipPDF = (record: any, employee: any) => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- Colors ---
    const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo 600
    const darkColor: [number, number, number] = [30, 41, 59]; // Slate 800
    const lightGray: [number, number, number] = [241, 245, 249]; // Slate 100
    const textMuted: [number, number, number] = [100, 116, 139]; // Slate 500
    const textDark: [number, number, number] = [15, 23, 42]; // Slate 900
    const successBg: [number, number, number] = [220, 252, 231]; // Green 100
    const successText: [number, number, number] = [21, 128, 61]; // Green 700
    const dangerText: [number, number, number] = [185, 28, 28]; // Red 700

    // --- Modern Header Banner ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 110, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYSLIP', 40, 60);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`MONTH: ${(record.month_year || '').toUpperCase()}`, 40, 85);

    // Right aligned company details
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('General Hospital, ESIS, Vadodara', pageWidth - 40, 65, { align: 'right' });


    // --- Employee Details Card ---
    const cardY = 140;
    doc.setDrawColor(226, 232, 240); // border color
    doc.setLineWidth(1);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(40, cardY, pageWidth - 80, 85, 6, 6, 'FD');

    // Vertical divider inside card
    doc.setDrawColor(241, 245, 249);
    doc.line(pageWidth / 2, cardY + 15, pageWidth / 2, cardY + 70);

    // Left side info
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.text('Employee Name', 60, cardY + 28);
    doc.text('Designation', 60, cardY + 50);
    doc.text('Office/Dept', 60, cardY + 72);

    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(employee.corrected_name || record.name || 'N/A', 150, cardY + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(record.designation || 'N/A', 150, cardY + 50);
    doc.text(record.office || 'N/A', 150, cardY + 72);

    // Right side info
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.text('Payroll No (HRPN)', (pageWidth / 2) + 20, cardY + 28);
    doc.text('PAN Number', (pageWidth / 2) + 20, cardY + 50);
    doc.text('Bill No', (pageWidth / 2) + 20, cardY + 72);

    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(employee.hrpn || record.hrpn || 'N/A', (pageWidth / 2) + 120, cardY + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(employee.pan_number || 'N/A', (pageWidth / 2) + 120, cardY + 50);
    doc.text(record.bill_no || 'N/A', (pageWidth / 2) + 120, cardY + 72);


    // --- Tables Layout ---
    const earnings = [
        ['Basic Pay', record.basic || 0],
        ['Dearness Allowance (DA)', record.da || 0],
        ['House Rent Allowance (HRA)', record.hra || 0],
        ['City Level Allowance (CLA)', record.cla || 0],
        ['Medical Allowance', record.med_allow || 0],
        ['Transport Allowance', record.trans_allow || 0],
        ['Nursing/Special Pay', (record.nursing_allow || 0) + (record.special_pay || 0)],
        ['Other Allowances', (record.book_allow || 0) + (record.npp_allow || 0) + (record.esis_allow || 0) + (record.uniform_allow || 0) + (record.washing_allow || 0)]
    ].filter(item => Number(item[1]) !== 0);

    const deductions = [
        ['Income Tax', record.income_tax || 0],
        ['Professional Tax', record.prof_tax || 0],
        ['GPF', (record.gpf_reg || 0) + (record.gpf_class4 || 0)],
        ['NPS', record.nps_reg || 0],
        ['R&B / Rent', record.rnb || 0],
        ['Govt Savings/Fund', (record.govt_saving || 0) + (record.govt_fund || 0)],
        ['Recovery of Pay', record.recovery_of_pay || 0]
    ].filter(item => Number(item[1]) !== 0);

    const maxRows = Math.max(earnings.length, deductions.length);
    const tableBody = [];

    for (let i = 0; i < maxRows; i++) {
        const earnName = earnings[i] ? String(earnings[i][0]) : '';
        const earnVal = earnings[i] ? `Rs. ${Number(earnings[i][1]).toLocaleString('en-IN')}` : '';
        const dedName = deductions[i] ? String(deductions[i][0]) : '';
        const dedVal = deductions[i] ? `Rs. ${Number(deductions[i][1]).toLocaleString('en-IN')}` : '';
        tableBody.push([earnName, earnVal, dedName, dedVal]);
    }

    autoTable(doc, {
        startY: cardY + 115,
        theme: 'grid',
        head: [['EARNINGS', 'AMOUNT', 'DEDUCTIONS', 'AMOUNT']],
        body: tableBody,
        headStyles: {
            fillColor: darkColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            cellPadding: 8,
            halign: 'center'
        },
        styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 7,
            lineColor: [226, 232, 240], // Light grey borders
            textColor: textDark
        },
        columnStyles: {
            0: { halign: 'left' }, // Earnings Name
            1: { halign: 'right', fontStyle: 'bold', textColor: [5, 150, 105] }, // Earnings Value
            2: { halign: 'left' }, // Deductions Name
            3: { halign: 'right', fontStyle: 'bold', textColor: dangerText }, // Deductions Value
        },
        margin: { left: 40, right: 40 },
        alternateRowStyles: {
            fillColor: [248, 250, 252] // Very light slate for alternate rows
        }
    });

    const finalYTable = (doc as any).lastAutoTable.finalY || 400;

    // Grand Totals Row
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.setFillColor(241, 245, 249);
    doc.rect(40, finalYTable, pageWidth - 80, 30, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);

    const tableWidth = pageWidth - 80;
    const colWidth = tableWidth / 4;

    doc.text('TOTAL EARNINGS', 48, finalYTable + 19);
    doc.text('TOTAL DEDUCTIONS', 40 + (colWidth * 2) + 8, finalYTable + 19);

    doc.setTextColor(5, 150, 105);
    doc.text(`Rs. ${Number(record.gross || 0).toLocaleString('en-IN')}`, 40 + (colWidth * 2) - 8, finalYTable + 19, { align: 'right' });
    doc.setTextColor(...dangerText);
    doc.text(`Rs. ${Number(record.total_ded || 0).toLocaleString('en-IN')}`, 40 + tableWidth - 8, finalYTable + 19, { align: 'right' });


    // --- Giant Net Pay Badge ---
    const netPayY = finalYTable + 60;

    // Gradient-like solid background
    doc.setFillColor(...successBg);
    doc.setDrawColor(187, 247, 208); // Green 200
    doc.setLineWidth(1);
    doc.roundedRect(40, netPayY, pageWidth - 80, 80, 8, 8, 'FD');

    // Left side Label
    doc.setTextColor(...successText);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('NET PAY TRANSFERABLE', 70, netPayY + 36);

    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52); // Darker green
    doc.text('(Amount credited to bank account)', 70, netPayY + 54);

    // Right side Value
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${Number(record.net_pay || 0).toLocaleString('en-IN')}`, pageWidth - 70, netPayY + 48, { align: 'right' });


    // --- Footer ---
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.setFont('helvetica', 'italic');
    doc.text(
        'This is a computer-generated document and requires no physical signature. This data is verified from karmyogi portal of government of gujarat.',
        pageWidth / 2,
        pageHeight - 40,
        { align: 'center' }
    );

    doc.save(`Payslip_${employee.hrpn}_${record.month_year}.pdf`);
};
