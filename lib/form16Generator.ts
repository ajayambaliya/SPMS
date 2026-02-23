import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateForm16PDF = (data: any, employee: any, financialYear: string) => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- Colors ---
    const primaryColor: [number, number, number] = [16, 185, 129]; // Emerald 500
    const darkColor: [number, number, number] = [30, 41, 59]; // Slate 800
    const textMuted: [number, number, number] = [100, 116, 139]; // Slate 500
    const textDark: [number, number, number] = [15, 23, 42]; // Slate 900
    const successBg: [number, number, number] = [220, 252, 231]; // Green 100

    // --- Header Banner ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 110, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('FORM 16 - PART B', 40, 60);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const nextYear = parseInt(financialYear) + 1;
    doc.text(`Financial Year: ${financialYear}-${nextYear} (Assessment Year: ${nextYear}-${nextYear + 1})`, 40, 85);

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
    doc.text('Adopted Tax Regime', 60, cardY + 50);

    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(employee.corrected_name || 'N/A', 150, cardY + 28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(data.regimeName || 'N/A', 150, cardY + 50);

    // Right side info
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.text('Payroll No (HRPN)', (pageWidth / 2) + 20, cardY + 28);
    doc.text('PAN Number', (pageWidth / 2) + 20, cardY + 50);

    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(employee.hrpn || 'N/A', (pageWidth / 2) + 120, cardY + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(employee.pan_number || 'N/A', (pageWidth / 2) + 120, cardY + 50);

    // --- Data Table ---
    const tableBody = [
        ['1. Gross Salary (17(1))', `Rs. ${data.grossSalary?.toLocaleString('en-IN')}`],
        [{ content: 'Less: Allowance to the extent exempt u/s 10', styles: { fontStyle: 'bold' } }, ''],
        [' - House Rent Allowance (HRA)', `Rs. ${data.hraExemption?.toLocaleString('en-IN')}`],
        ['2. Total Amount of Salary', `Rs. ${(data.grossSalary - (data.hraExemption || 0)).toLocaleString('en-IN')}`],
        [{ content: 'Less: Deductions under section 16', styles: { fontStyle: 'bold' } }, ''],
        [' - Standard Deduction u/s 16(ia)', `Rs. ${data.standardDeduction?.toLocaleString('en-IN')}`],
        [' - Tax on Employment u/s 16(iii) (Professional Tax)', `Rs. ${data.professionalTax?.toLocaleString('en-IN')}`],
        [{ content: '3. Income Chargeable under the head "Salaries"', styles: { fontStyle: 'bold' } }, `Rs. ${(data.taxableIncome + data.totalDeductionsAllowed).toLocaleString('en-IN')}`],
        ['Less: Interest on Housing Loan u/s 24(B)', `Rs. ${data.homeLoanInterest?.toLocaleString('en-IN')}`],
        [{ content: 'Deductions under Chapter VI-A', styles: { fontStyle: 'bold' } }, ''],
        [' - Section 80C (GPF, LIC, PPF, etc)', `Rs. ${data.section80C?.toLocaleString('en-IN')}`],
        [' - Section 80CCD(1B) (NPS)', `Rs. ${data.section80CCD1B?.toLocaleString('en-IN')}`],
        [' - Section 80D (Health Insurance)', `Rs. ${data.section80D?.toLocaleString('en-IN')}`],
        [' - Other Deductions', `Rs. ${data.otherDeductions?.toLocaleString('en-IN')}`],
        [{ content: '4. Total Deductions under Chapter VI-A', styles: { fontStyle: 'bold' } }, `Rs. ${data.totalDeductionsAllowed?.toLocaleString('en-IN')}`],
        [{ content: '5. Total Taxable Income', styles: { fontStyle: 'bold' } }, `Rs. ${data.taxableIncome?.toLocaleString('en-IN')}`],
        ['6. Tax on Total Income', `Rs. ${data.taxBeforeRebate?.toLocaleString('en-IN')}`],
        ['7. Rebate under section 87A', `Rs. ${data.rebate87A?.toLocaleString('en-IN')}`],
        ['8. Health & Education Cess (4%)', `Rs. ${data.healthAndEducationCess?.toLocaleString('en-IN')}`],
    ];

    autoTable(doc, {
        startY: cardY + 115,
        theme: 'grid',
        head: [['Details of Salary Paid and Any Other Income and Tax Deducted', 'Amount']],
        body: tableBody as any,
        headStyles: {
            fillColor: darkColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 11,
            cellPadding: 8,
            halign: 'left'
        },
        styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 7,
            lineColor: [226, 232, 240], // Light grey borders
            textColor: textDark
        },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'right', fontStyle: 'bold' },
        },
        margin: { left: 40, right: 40 },
        alternateRowStyles: {
            fillColor: [248, 250, 252] // Very light slate for alternate rows
        }
    });

    const finalYTable = (doc as any).lastAutoTable.finalY;

    // --- Giant Net Tax Liability Badge ---
    const netPayY = finalYTable + 30;

    // Gradient-like solid background
    doc.setFillColor(...successBg);
    doc.setDrawColor(187, 247, 208); // Green 200
    doc.setLineWidth(1);
    doc.roundedRect(40, netPayY, pageWidth - 80, 80, 8, 8, 'FD');

    // Left side Label
    doc.setTextColor(...textDark);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('NET TAX LIABILITY', 70, netPayY + 36);

    doc.setFontSize(10);
    doc.setTextColor(...textMuted);
    doc.text('(Total Tax Payable for the year)', 70, netPayY + 54);

    // Right side Value
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(`Rs. ${Number(data.totalTaxLiability || 0).toLocaleString('en-IN')}`, pageWidth - 70, netPayY + 48, { align: 'right' });

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

    doc.save(`Form16_Proforma_${employee.hrpn}_FY${financialYear}.pdf`);
};
