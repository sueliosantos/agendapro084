import PDFDocument from "pdfkit";

type MonthlyAppointment = {
  paciente: string;
  data: string;
  hora: string;
  status: string;
  valorConsulta: string;
};

type ReportInput = {
  referencia: string;
  consultas: MonthlyAppointment[];
  totalMes: string;
};

export async function buildMonthlyReportPdf({ referencia, consultas, totalMes }: ReportInput) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks as unknown as readonly Uint8Array[]);
      resolve(pdfBuffer);
    });
    doc.on("error", reject);

    doc.fontSize(18).text("Relatorio Mensal de Consultas");
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Referencia: ${referencia}`);
    doc.moveDown();

    consultas.forEach((consulta, index) => {
      doc
        .fontSize(11)
        .text(
          `${index + 1}. ${consulta.data} ${consulta.hora} | ${consulta.paciente} | ${consulta.status} | R$ ${consulta.valorConsulta}`
        );
      doc.moveDown(0.3);
    });

    doc.moveDown();
    doc.fontSize(13).text(`Total do mes: R$ ${totalMes}`);
    doc.end();
  });
}
